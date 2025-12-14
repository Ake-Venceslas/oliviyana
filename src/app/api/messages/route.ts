import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveMessage, getUserMessages } from "@/lib/storage";

interface SendMessageRequest {
  recipientId: string;
  subject: string;
  content: string;
  messageType?: string;
}

export async function POST(request: Request) {
  try {
    // Essayer de récupérer l'authentification
    let userId: string | null = null;
    let senderName = "Système";
    
    try {
      const authData = await auth();
      userId = authData?.userId || null;
    } catch (authError) {
      console.warn("Authentification échouée, utilisation du mode système");
    }

    const body: SendMessageRequest = await request.json();
    const { recipientId, subject, content, messageType = "general" } = body;

    if (!recipientId || !subject || !content) {
      return NextResponse.json(
        { error: "Paramètres manquants: recipientId, subject, content" },
        { status: 400 }
      );
    }

    // Récupérer les informations de l'expéditeur
    const client = await clerkClient();
    
    if (userId) {
      const sender = await client.users.getUser(userId);
      senderName = `${sender.firstName || ""} ${sender.lastName || ""}`.trim() || "Docteur";
    }

    // Récupérer les informations du destinataire
    const recipient = await client.users.getUser(recipientId);
    if (!recipient) {
      return NextResponse.json(
        { error: "Destinataire non trouvé" },
        { status: 404 }
      );
    }

    // Créer le message
    const message = {
      id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: senderName,
      senderType: messageType === "appointment_request" ? "patient" : (messageType === "prescription" ? "doctor" : "system") as "doctor" | "patient" | "system",
      senderEmail: userId ? (await client.users.getUser(userId)).emailAddresses[0]?.emailAddress : undefined,
      senderId: userId,
      subject,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      messageType: messageType as "general" | "appointment_request" | "appointment_confirmation" | "prescription" | "message",
      recipientId,
    };

    // Sauvegarder le message
    saveMessage(message);
    console.log("Message créé et sauvegardé:", message);

    return NextResponse.json(
      { 
        success: true, 
        message: "Message envoyé avec succès",
        data: message 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer les messages pour cet utilisateur
    const messages = getUserMessages(userId);

    return NextResponse.json(
      { messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}
