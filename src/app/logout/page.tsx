"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut();
        // Rediriger vers la page d'accueil après la déconnexion
        router.push("/");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        // Même en cas d'erreur, rediriger vers l'accueil
        router.push("/");
      }
    };

    handleLogout();
  }, [signOut, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Déconnexion en cours...</h1>
        <p className="text-gray-600">Veuillez patienter, vous allez être redirigé vers la page d&apos;accueil.</p>
      </div>
    </div>
  );
}
