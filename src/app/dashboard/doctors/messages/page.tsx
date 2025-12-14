"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Mail, MessageCircle, Trash2, Star, Search } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderType: "system" | "doctor" | "patient";
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  messageType: "welcome_signup" | "welcome_login" | "appointment_confirmation" | "appointment_reminder" | "general";
}

const MessagesPage = () => {
  const { user, isLoaded } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "starred">("all");

  // Initialiser les messages au chargement
  useEffect(() => {
    if (isLoaded && user) {
      const userName = user.firstName || user.emailAddresses[0].emailAddress;
      
      // Générer les messages de base
      const baseMessages: Message[] = [
        {
          id: "MSG001",
          sender: "Système",
          senderType: "system",
          subject: "Bienvenue!",
          content: `Bienvenue Dr. ${userName}! Votre compte a été créé avec succès. Vous pouvez maintenant accéder à tous nos services de gestion médicale. Gérez vos patients, consultations et rendez-vous depuis votre tableau de bord.`,
          timestamp: new Date().toISOString(),
          isRead: true,
          isStarred: false,
          messageType: "welcome_signup",
        },
        {
          id: "MSG002",
          sender: "Système",
          senderType: "system",
          subject: "Bienvenue de retour!",
          content: `Bienvenue de retour Dr. ${userName}! Heureux de vous revoir sur notre plateforme. Consultez vos patients, vos messages et votre agenda médical.`,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isRead: true,
          isStarred: false,
          messageType: "welcome_login",
        },
        {
          id: "MSG003",
          sender: "Patient: Gabriel Nkoue",
          senderType: "patient",
          subject: "Demande de rendez-vous",
          content: `Dr. ${userName}, Gabriel Nkoue souhaite prendre rendez-vous avec vous pour une consultation générale. Disponibilité: le 20 décembre 2024 entre 09:00 et 11:00. Veuillez confirmer ou proposer une autre date.`,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          isRead: true,
          isStarred: true,
          messageType: "appointment_confirmation",
        },
        {
          id: "MSG004",
          sender: "Patient: Marie Dupont",
          senderType: "patient",
          subject: "Demande de rendez-vous",
          content: `Dr. ${userName}, Marie Dupont souhaite prendre rendez-vous avec vous pour un suivi de consultation. Disponibilité: le 25 décembre 2024 entre 14:00 et 16:00. Merci de confirmer.`,
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          isRead: false,
          isStarred: false,
          messageType: "appointment_confirmation",
        },
        {
          id: "MSG005",
          sender: "Système",
          senderType: "system",
          subject: "Rappel de consultation",
          content: `Dr. ${userName}, vous avez une consultation prévue le 5 janvier 2025 à 10:00 AM avec le patient Jean Martin. N'oubliez pas de préparer son dossier médical à l'avance.`,
          timestamp: new Date(Date.now() - 345600000).toISOString(),
          isRead: false,
          isStarred: false,
          messageType: "appointment_reminder",
        },
      ];

      setMessages(baseMessages);
      setFilteredMessages(baseMessages);
    }
  }, [isLoaded, user]);

  // Filtrer les messages
  useEffect(() => {
    let filtered = messages;

    // Filtrer par type
    if (filterType === "unread") {
      filtered = filtered.filter((msg) => !msg.isRead);
    } else if (filterType === "starred") {
      filtered = filtered.filter((msg) => msg.isStarred);
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(
        (msg) =>
          msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMessages(filtered);
  }, [messages, filterType, searchQuery]);

  const handleMarkAsRead = (id: string) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg)));
  };

  const handleToggleStar = (id: string) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg)));
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
    setSelectedMessage(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString("fr-FR");
    }
  };

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case "system":
        return "bg-blue-50 border-blue-200";
      case "doctor":
        return "bg-green-50 border-green-200";
      case "patient":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Liste des messages */}
      <div className="w-full md:w-1/3 border-r border-gray-200 bg-white flex flex-col">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle size={28} className="text-blue-600" />
            Messages
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {unreadCount} nouveau{unreadCount > 1 ? "x" : ""}
            </p>
          )}
        </div>

        {/* Recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="p-4 border-b border-gray-200 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              filterType === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFilterType("unread")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              filterType === "unread"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Non lus ({unreadCount})
          </button>
          <button
            onClick={() => setFilterType("starred")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors ${
              filterType === "starred"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Importants
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  handleMarkAsRead(message.id);
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedMessage?.id === message.id ? "bg-blue-50" : ""
                } ${!message.isRead ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800 truncate">{message.sender}</h3>
                      {!message.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(message.timestamp)}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStar(message.id);
                    }}
                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    <Star
                      size={18}
                      className={message.isStarred ? "fill-yellow-500 text-yellow-500" : ""}
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Mail size={48} className="mb-4 opacity-50" />
              <p>Aucun message trouvé</p>
            </div>
          )}
        </div>
      </div>

      {/* Détails du message */}
      <div className="hidden md:flex w-2/3 flex-col bg-white">
        {selectedMessage ? (
          <>
            {/* En-tête du message */}
            <div className={`p-6 border-b border-gray-200 ${getSenderColor(selectedMessage.senderType)}`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                  <p className="text-gray-600 mt-2">De: {selectedMessage.sender}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatDate(selectedMessage.timestamp)}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStar(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-yellow-500 transition-colors rounded-lg hover:bg-white"
                  >
                    <Star
                      size={20}
                      className={selectedMessage.isStarred ? "fill-yellow-500 text-yellow-500" : ""}
                    />
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu du message */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.content}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle size={64} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucun message sélectionné</p>
            <p className="text-sm mt-2">Sélectionnez un message pour voir les détails</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
