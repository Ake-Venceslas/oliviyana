import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface DoctorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  profileImage?: string;
  experience: number;
}

export async function GET() {
  try {
    const client = await clerkClient();
    const users = await client.users.getUserList();

    // Filtrer les docteurs (utilisateurs avec role = "doctor")
    const doctors: DoctorData[] = users.data
      .filter((user) => {
        const role = user.unsafeMetadata?.role;
        return role === "doctor";
      })
      .map((user) => {
        const bios = [
          "Médecin expérimenté avec plus de 10 ans de pratique",
          "Spécialiste réputé dans le domaine de la santé",
          "Professionnel de santé dédié à l'excellence",
          "Praticien qualifié avec un suivi personnalisé",
        ];

        const userIndex = (user.id.charCodeAt(0) + user.id.charCodeAt(1)) % 4;
        
        // Récupérer la première spécialité choisie lors de l'inscription
        const specialties = user.unsafeMetadata?.specialties || [];
        const specialty = Array.isArray(specialties) && specialties.length > 0 
          ? specialties[0] 
          : "Médecine Générale";

        return {
          id: user.id,
          firstName: user.firstName || "Dr.",
          lastName: user.lastName || "Médecin",
          email: user.emailAddresses[0]?.emailAddress || "",
          phone: user.phoneNumbers[0]?.phoneNumber || "+237 6 99 88 77 66",
          specialty: specialty,
          bio: bios[userIndex],
          profileImage: user.imageUrl,
          experience: Math.floor(Math.random() * 20) + 5,
        };
      });

    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des docteurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des docteurs" },
      { status: 500 }
    );
  }
}
