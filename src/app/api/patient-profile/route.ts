import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getPatientProfile, createPatientProfile, updatePatientProfile } from "@/lib/storage";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer le profil du patient
    let profile = getPatientProfile(userId);

    // Si le profil n'existe pas, le créer
    if (!profile) {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      profile = createPatientProfile(userId, user.imageUrl);
    }

    return NextResponse.json(
      { profile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Valider que le barcode n'est pas dans les updates
    if (body.barcode) {
      return NextResponse.json(
        { error: "Le code-barres ne peut pas être modifié" },
        { status: 400 }
      );
    }

    // Mettre à jour le profil
    const updatedProfile = updatePatientProfile(userId, body);

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Profil non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { profile: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du profil" },
      { status: 500 }
    );
  }
}
