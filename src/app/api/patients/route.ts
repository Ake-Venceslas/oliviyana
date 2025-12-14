import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface PatientData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  bloodType: string;
  address: string;
  city: string;
  profileImage?: string;
  registrationDate: string;
  lastVisit: string;
  medicalHistory: string[];
}

export async function GET() {
  try {
    // Vérifier que l'utilisateur est authentifié
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer tous les utilisateurs
    const client = await clerkClient();
    const users = await client.users.getUserList();

    // Filtrer les patients (utilisateurs avec role = "patient")
    const patients: PatientData[] = users.data
      .filter((user) => {
        const role = user.unsafeMetadata?.role;
        return role === "patient";
      })
      .map((user) => {
        // Générer des données de démonstration basées sur l'utilisateur Clerk
        const firstNames = ["Gabriel", "Marie", "Jean", "Sophie", "Paul", "Linda"];
        const lastNames = ["Nkoue", "Dupont", "Martin", "Lefevre", "Nkomo", "Fon"];
        const cities = ["Yaoundé", "Douala", "Buea", "Bafoussam"];
        const bloodTypes = ["O+", "A+", "B+", "AB+", "O-", "A-"];
        const medicalHistories = [
          ["Grippe (2024)", "Consultation générale", "Vaccin COVID-19"],
          ["Suivi gynécologique", "Allergie saisonnière"],
          ["Hypertension", "Consultation cardiaque", "Suivi mensuel"],
          ["Consultation générale", "Vaccins à jour"],
          ["Diabète type 2", "Suivi régulier", "Contrôle tension"],
          ["Suivi gynécologique", "Prenatal check-up"],
        ];

        // Utiliser les initiales de l'utilisateur pour la clé
        const userIndex = (user.id.charCodeAt(0) + user.id.charCodeAt(1)) % 6;

        // Date d'inscription approximative
        const regDate = new Date(user.createdAt || new Date());
        const lastVisitDate = new Date(regDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

        return {
          id: user.id,
          firstName: user.firstName || firstNames[userIndex],
          lastName: user.lastName || lastNames[userIndex],
          email: user.emailAddresses[0]?.emailAddress || "",
          phone: user.phoneNumbers[0]?.phoneNumber || "+237 6 99 88 77 66",
          age: Math.floor(Math.random() * 40) + 18,
          bloodType: bloodTypes[userIndex % bloodTypes.length],
          address: `${Math.floor(Math.random() * 999) + 1} Rue de la Santé`,
          city: cities[userIndex % cities.length],
          profileImage: user.imageUrl,
          registrationDate: regDate.toISOString().split("T")[0],
          lastVisit: lastVisitDate.toISOString().split("T")[0],
          medicalHistory: medicalHistories[userIndex],
        };
      });

    return NextResponse.json({ patients }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des patients:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des patients" },
      { status: 500 }
    );
  }
}
