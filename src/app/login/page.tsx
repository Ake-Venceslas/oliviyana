"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignIn, useUser } from "@clerk/nextjs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const { signIn, setActive } = useSignIn();
  const [userType, setUserType] = useState<"doctor" | "patient" | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard/patients");
    }
  }, [isLoaded, userId, router]);

  // Vérifier le rôle de l'utilisateur et rediriger correctement
  useEffect(() => {
    if (user && userId && isLoaded) {
      const userRole = user?.unsafeMetadata?.role as string;
      
      // Si on est sur la page et que l'utilisateur vient de se connecter
      if (userRole === "doctor") {
        // Rediriger vers dashboard docteur
        router.push("/dashboard/doctors");
      } else if (userRole === "patient") {
        // Rediriger vers dashboard patient
        router.push("/dashboard/patients");
      }
    }
  }, [user, userId, isLoaded, router]);

  // Vérifier le rôle de l'utilisateur et afficher une erreur si mismatch
  useEffect(() => {
    if (user && userId && isLoaded && userType) {
      const userRole = user?.unsafeMetadata?.role as string;
      
      // Vérifier si le rôle correspond au type de connexion
      if (userType === "patient" && userRole === "doctor") {
        setError("Accès refusé. Vous êtes enregistré en tant que médecin. Veuillez utiliser la page de connexion médecin pour vous connecter.");
        setIsLoading(false);
      } else if (userType === "doctor" && userRole === "patient") {
        setError("Accès refusé. Vous êtes enregistré en tant que patient. Veuillez utiliser la page de connexion patient pour vous connecter.");
        setIsLoading(false);
      }
    }
  }, [user, userId, isLoaded, userType]);

  useEffect(() => {
    if (window.innerWidth >= 1023) {
      setUserType("patient"); // Automatically show patient on desktop
    }
  }, []);

  const handlePatientLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formElements = e.currentTarget.elements;
    const email = (formElements.namedItem("email") as HTMLInputElement)?.value || "";
    const password = (formElements.namedItem("password") as HTMLInputElement)?.value || "";

    if (!signIn) {
      setError("Service de connexion non disponible.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        
        // Attendre que les données utilisateur se mettent à jour
        setTimeout(() => {
          // Le hook useUser va vérifier le rôle dans useEffect
          // et rediriger automatiquement
        }, 100);
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error("Erreur de connexion:", err);
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      setError(clerkError?.errors?.[0]?.message || "Identifiants incorrects. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  const handleDoctorLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formElements = e.currentTarget.elements;
    const email = (formElements.namedItem("email") as HTMLInputElement)?.value || "";
    const password = (formElements.namedItem("password") as HTMLInputElement)?.value || "";

    if (!signIn) {
      setError("Service de connexion non disponible.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        
        // Attendre que les données utilisateur se mettent à jour
        setTimeout(() => {
          // Le hook useUser va vérifier le rôle dans useEffect
          // et rediriger automatiquement
        }, 100);
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error("Erreur de connexion:", err);
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      setError(clerkError?.errors?.[0]?.message || "Identifiants incorrects. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  const backgroundImage =
    userType === "patient"
      ? "bg-[url('/images/patientbg.webp')]"
      : "bg-[url('/images/doctorbg.webp')]";

  return (
    <div
      id="login"
      className={`${backgroundImage} relative w-full min-h-screen grid justify-center items-center bg-cover bg-center`}
    >
      <div className="hidden absolute inset-0 bg-black/30 backdrop-blur-[2px] lg:flex items-center justify-center">
        <div
          className={`${backgroundImage} bg-cover bg-black/60 bg-blend-multiply text-white hidden lg:grid rounded-md drop-shadow-xl/50 relative`}
        >
          <div className="flex justify-between bg-white/60 p-1 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-4xl">
            <button
              onClick={() => setUserType("patient")}
              disabled={userType === "patient"}
              className={`px-4 sm:px-6 py-2 cursor-pointer text-sm sm:text-base ${
                userType === "patient" ? "bg-[#2E7D32] rounded-4xl" : ""
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setUserType("doctor")}
              disabled={userType === "doctor"}
              className={`px-4 sm:px-6 py-2 cursor-pointer text-sm sm:text-base ${
                userType === "doctor" ? "bg-[#2E7D32] rounded-4xl" : ""
              }`}
            >
              Médecin
            </button>
          </div>

          {userType === "patient" && (
            <div className="flex flex-col lg:flex-row justify-between px-4 sm:px-8 lg:px-12 py-6 lg:py-8 lg:w-[80vw] xl:w-[60vw] lg:h-[60vh] items-center gap-8 lg:gap-0">
              <div className="grid gap-y-4 lg:gap-y-8 lg:max-w-md">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Bienvenue de retour! </h2>
                <p className="text-sm sm:text-base lg:w-full">
                  Connectez-vous pour accéder à votre tableau de bord personnalisé. Nous sommes là pour soutenir votre parcours de santé à chaque étape.
                </p>
              </div>
              <form onSubmit={handlePatientLogin} className="grid gap-y-4 grid-flow-row bg-white/30 p-4 sm:p-6 lg:p-8 w-full sm:max-w-sm rounded-lg">
                {/* Patient login form fields */}
                <h3 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl">Connexion Patient</h3>
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-4">
                  <label className="grid grid-flow-row gap-2" htmlFor="email">
                    <span className="text-sm sm:text-base">Email</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="email"
                      name="email"
                      placeholder="Email Patient"
                      required
                    />
                  </label>
                  <label
                    className="grid grid-flow-row gap-2"
                    htmlFor="password"
                  >
                    <span className="text-sm sm:text-base">Mot de passe</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      required
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <label className="flex items-center gap-1 text-xs sm:text-sm">
                  <input type="checkbox" />
                  <span>Se souvenir de moi</span>
                </label>
                <Link className="text-[#39e240] text-xs sm:text-sm" href="#">Mot de passe oublié?</Link>
              </div>
                <button
                  className="bg-linear-to-r from-[#1c5284] to-[#39e240] p-2 rounded-lg text-white font-semibold text-sm sm:text-base"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Envoyer"}
                </button>
              </form>
            </div>
          )}

          {userType === "doctor" && (
            <div className="flex flex-col lg:flex-row justify-between px-4 sm:px-8 lg:px-12 py-6 lg:py-8 lg:w-[80vw] xl:w-[60vw] lg:h-[60vh] items-center gap-8 lg:gap-0">
              <div className="grid gap-y-4 lg:gap-y-8 lg:max-w-md">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Bienvenue de retour, Médecin!
                </h2>
                <p className="text-sm sm:text-base lg:w-full">
                  Connectez-vous pour accéder à votre tableau de bord personnalisé. Nous sommes là pour soutenir votre rôle vital en fournissant des soins excellents et en aidant les patients dans leur parcours de santé
                </p>
              </div>
              <form onSubmit={handleDoctorLogin} className="grid gap-y-4 grid-flow-row bg-white/30 p-4 sm:p-6 lg:p-8 w-full sm:max-w-sm rounded-lg">
                {/* Doctor login form fields */}
                <h3 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl">Connexion Médecin</h3>
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-4">
                  <label className="grid grid-flow-row gap-2" htmlFor="email">
                    <span className="text-sm sm:text-base">Email</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="email"
                      name="email"
                      placeholder="Email Médecin"
                      required
                    />
                  </label>
                  <label
                    className="grid grid-flow-row gap-2"
                    htmlFor="password"
                  >
                    <span className="text-sm sm:text-base">Mot de passe</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      required
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <label className="flex items-center gap-1 text-xs sm:text-sm">
                  <input type="checkbox" />
                  <span>Se souvenir de moi</span>
                </label>
                <Link className="text-[#39e240] text-xs sm:text-sm" href="#">Mot de passe oublié?</Link>
              </div>
                <button
                  className="cursor-pointer bg-linear-to-r from-[#1c5284] to-[#39e240] p-2 rounded-lg text-white font-semibold text-sm sm:text-base"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se Connecter"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div
        className={`relative lg:hidden w-full min-h-screen flex flex-col justify-center items-center transition-all duration-300 bg-cover bg-center ${
          userType === null ? "bg-[url('/images/signbg.jpg')]" : backgroundImage
        }`}
      >
        {!userType && (
          // This block renders the initial welcome screen with two buttons
          <div className="bg-black/30 backdrop-blur-[2px] text-white flex flex-col items-center justify-center w-full h-full px-4 py-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center">Bienvenue de retour!</h2>
            <p className="text-sm sm:text-base text-center mb-8 px-2 max-w-xs">
              Veuillez sélectionner si vous vous connectez en tant que médecin ou patient pour accéder à votre tableau de bord de santé personnalisé.
            </p>
            <div className="flex w-full gap-3 px-4 max-w-sm">
              <button
                onClick={() => setUserType("patient")}
                className="flex-1 py-3 bg-white text-[#2E7D32] rounded-lg shadow font-semibold text-sm sm:text-base"
              >
                Patient
              </button>
              <button
                onClick={() => setUserType("doctor")}
                className="flex-1 py-3 bg-white text-[#2E7D32] rounded-lg shadow font-semibold text-sm sm:text-base"
              >
                Médecin
              </button>
            </div>
          </div>
        )}

        {userType && (
          // This block renders the white sign-in interface for the chosen user type
          <div className="w-full h-screen flex flex-col justify-end lg:hidden">
            <div className="w-full bg-white rounded-t-2xl sm:rounded-t-3xl px-4 sm:px-6 py-6 sm:py-8 shadow-lg max-h-[90vh] overflow-y-auto">
              <button
                className="mb-4 text-[#2E7D32] flex items-center gap-2 font-semibold text-sm sm:text-base"
                onClick={() => setUserType(null)}
              >
                <ChevronLeft size={20} />
                <span>Retour</span>
              </button>
              <h3 className="text-xl sm:text-2xl text-center font-semibold mb-4 sm:mb-6 text-[#2E7D32]">
                Bienvenue {userType === "doctor" ? "Médecin" : "Patient"}
              </h3>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-xs sm:text-sm mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={userType === "doctor" ? handleDoctorLogin : handlePatientLogin} className="w-full flex flex-col gap-4 sm:gap-6">
                <div className="w-full grid gap-4 sm:gap-6">
                  <label htmlFor="email" className="relative grid gap-2">
                    <span className="absolute top-[-0.9rem] left-2 text-xs sm:text-sm font-medium text-gray-500 bg-white px-1">Email</span>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="jacob@exemple.com"
                      className="p-3 border border-gray-300 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:border-[#2E7D32]"
                    />
                  </label>
                  <label htmlFor="password" className="relative grid gap-2">
                    <span className="absolute top-[-0.9rem] left-2 text-xs sm:text-sm font-medium text-gray-500 bg-white px-1">Mot de passe</span>
                    <input
                      required
                      type="password"
                      name="password"
                      placeholder="Votre mot de passe"
                      className="p-3 border border-gray-300 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:border-[#2E7D32]"
                    />
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <label className="flex items-center gap-1 text-xs sm:text-sm">
                    <input type="checkbox" />
                    <span>Se souvenir de moi</span>
                  </label>
                  <Link className="text-[#2E7D32] text-xs sm:text-sm font-semibold" href="#">Mot de passe oublié?</Link>
                </div>
                <button
                  type="submit"
                  className="cursor-pointer py-3 bg-gradient-to-r from-[#1c5284] to-[#39e240] text-white rounded-lg font-semibold text-sm sm:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se Connecter"}
                </button>
                <div className="relative border-t-2 border-gray-200">
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-400 text-xs sm:text-sm">Ou</span>
                  <Link className="grid justify-center mt-4 py-3 text-[#2E7D32] font-semibold text-sm sm:text-base" href="/register">Créer un compte</Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
