import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveAppointment, updateAppointment, getDoctorAppointments, getPatientAppointments, saveMessage, saveConsultation } from "@/lib/storage";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorEmail: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  reason?: string;
  createdAt: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { doctorId, appointmentDate, appointmentTime, reason } = body;

    if (!doctorId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const client = await clerkClient();

    // Récupérer les infos du patient
    const patient = await client.users.getUser(userId);
    const patientName = `${patient.firstName || ""} ${patient.lastName || ""}`.trim();

    // Récupérer les infos du docteur
    const doctor = await client.users.getUser(doctorId);
    if (!doctor || doctor.unsafeMetadata?.role !== "doctor") {
      return NextResponse.json(
        { error: "Docteur non trouvé" },
        { status: 404 }
      );
    }

    const doctorName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();

    // Vérifier que le docteur n'a pas déjà un rendez-vous à la même heure
    const doctorAppointments = getDoctorAppointments(doctorId);
    const conflictingAppointment = doctorAppointments.find(
      (apt) => apt.appointmentDate === appointmentDate && apt.appointmentTime === appointmentTime
    );

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: `Le docteur a déjà un rendez-vous le ${appointmentDate} à ${appointmentTime}` },
        { status: 409 }
      );
    }

    // Créer le rendez-vous
    const appointment: Appointment = {
      id: `APT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patientId: userId,
      patientName,
      patientEmail: patient.emailAddresses[0]?.emailAddress || "",
      doctorId,
      doctorName,
      doctorEmail: doctor.emailAddresses[0]?.emailAddress || "",
      specialty: (doctor.unsafeMetadata?.specialties as string[])?.[0] || "Médecine Générale",
      appointmentDate,
      appointmentTime,
      status: "pending",
      reason,
      createdAt: new Date().toISOString(),
    };

    // Sauvegarder le rendez-vous
    saveAppointment(appointment);
    // Créer un message pour le docteur
    const messageResponse = await fetch(
      new URL("/api/messages", request.url).toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // On doit passer le userId du patient pour que Clerk reconnaisse l'authentification
        },
        body: JSON.stringify({
          recipientId: doctorId,
          subject: `Demande de rendez-vous - ${patientName}`,
          content: `Le patient ${patientName} a demandé un rendez-vous.\n\nDate: ${appointmentDate}\nHeure: ${appointmentTime}\nRaison: ${reason || "Non spécifiée"}\n\nContact: ${patient.emailAddresses[0]?.emailAddress}`,
          messageType: "appointment_request",
        }),
      }
    );

    console.log("Message envoyé au docteur:", messageResponse.status);

    return NextResponse.json(
      {
        success: true,
        message: "Rendez-vous demandé avec succès",
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du rendez-vous" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Essayer de récupérer l'authentification
    let userId: string | null = null;
    try {
      const authData = await auth();
      userId = authData?.userId || null;
    } catch (authError) {
      console.warn("Authentification échouée, continuant sans auth:", authError);
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role"); // "doctor" ou "patient"

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    let appointments: Appointment[] = [];

    if (role === "doctor") {
      // Récupérer les rendez-vous du docteur
      appointments = getDoctorAppointments(userId);
    } else if (role === "patient") {
      // Récupérer les rendez-vous du patient
      appointments = getPatientAppointments(userId);
    } else {
      // Retourner tous les rendez-vous (avec authentification)
      const allAppointments = require("@/lib/storage").getAllAppointments();
      appointments = allAppointments;
    }

    return NextResponse.json(
      { appointments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des rendez-vous", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId: doctorId } = await auth();

    if (!doctorId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { appointmentId, status, patientEmail, patientName, patientId, appointmentDate, appointmentTime, reason, doctorName } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    if (!["confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const doctor = await client.users.getUser(doctorId);
    const docName = `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim() || "Docteur";

    // Créer et envoyer un message au patient
    const messageContent =
      status === "confirmed"
        ? `Votre rendez-vous du ${appointmentDate} à ${appointmentTime} avec le Dr. ${docName} a été confirmé. Vous recevrez bientôt plus de détails sur le lieu et les modalités.`
        : `Votre demande de rendez-vous du ${appointmentDate} à ${appointmentTime} a été refusée par le docteur. Vous pouvez demander un autre rendez-vous avec un autre docteur.`;

    const messageSubject =
      status === "confirmed"
        ? "Rendez-vous confirmé ✓"
        : "Rendez-vous refusé";

    const message = {
      id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: docName,
      senderType: "doctor" as const,
      senderEmail: doctor.emailAddresses[0]?.emailAddress,
      senderId: doctorId,
      subject: messageSubject,
      content: messageContent,
      timestamp: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      messageType: "appointment_confirmation" as const,
      recipientId: patientId,
    };

    // Sauvegarder le message
    saveMessage(message);

    // Mettre à jour le rendez-vous
    const updatedAppointment = updateAppointment(appointmentId, { status });

    // Si confirmé, créer une consultation
    if (status === "confirmed" && updatedAppointment) {
      const consultation = {
        id: `CON_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        appointmentId: appointmentId,
        patientId: patientId,
        patientName: patientName,
        patientEmail: patientEmail,
        doctorId: doctorId,
        doctorName: docName,
        appointmentDate: appointmentDate,
        appointmentTime: appointmentTime,
        reason: reason,
        status: "confirmed" as const,
        confirmedAt: new Date().toISOString(),
      };

      saveConsultation(consultation);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Rendez-vous mis à jour et message envoyé au patient",
        data: {
          appointmentId,
          status,
          patientEmail,
          messageSubject,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du rendez-vous:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du rendez-vous" },
      { status: 500 }
    );
  }
}
