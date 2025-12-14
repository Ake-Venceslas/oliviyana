"use client";

import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Accès Refusé</h1>
        <p className="text-gray-600 mb-6">
          Vous n&apos;avez pas accès à cette page. Votre rôle utilisateur ne correspond pas à la page que vous essayez d&apos;accéder.
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Retourner à la connexion
          </Link>
          <Link
            href="/"
            className="block bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 font-semibold"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
