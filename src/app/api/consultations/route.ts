import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getDoctorConsultations } from "@/lib/storage";

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  status: "confirmed";
  confirmedAt: string;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer les consultations confirmées du docteur
    const consultations = getDoctorConsultations(userId);

    return NextResponse.json(
      { consultations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des consultations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des consultations" },
      { status: 500 }
    );
  }
}
