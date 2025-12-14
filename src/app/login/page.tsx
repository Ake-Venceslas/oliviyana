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
      className={`${backgroundImage} relative w-[100vw] h-[100vh] grid justify-center items-center bg-cover bg-center`}
    >
      <div className="hidden absolute inset-0 bg-black/30 backdrop-blur-[2px] lg:flex items-center justify-center">
        <div
          className={`${backgroundImage} bg-cover bg-black/60 bg-blend-multiply text-white hidden lg:grid rounded-md drop-shadow-xl/50 relative`}
        >
          <div className="flex justify-between bg-white/60 p-1 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-4xl">
            <button
              onClick={() => setUserType("patient")}
              disabled={userType === "patient"}
              className={`px-[2rem] py-[.4em] cursor-pointer ${
                userType === "patient" ? "bg-[#2E7D32] rounded-4xl" : ""
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setUserType("doctor")}
              disabled={userType === "doctor"}
              className={`px-[2rem] py-[.4em] cursor-pointer ${
                userType === "doctor" ? "bg-[#2E7D32] rounded-4xl" : ""
              }`}
            >
              Médecin
            </button>
          </div>

          {userType === "patient" && (
            <div className="flex justify-between px-[3rem] py-[2.5rem] lg:w-[80vw] xl:w-[60vw] h-[60vh] items-center">
              <div className="grid gap-y-[2rem]">
                <h2 className="text-[2.5rem] font-bold">Bienvenue de retour! </h2>
                <p className="w-[25rem]">
                  Connectez-vous pour accéder à votre tableau de bord personnalisé. Nous sommes là pour soutenir votre parcours de santé à chaque étape.
                </p>
              </div>
              <form onSubmit={handlePatientLogin} className="grid gap-y-[1rem] grid-flow-row bg-white/30 p-[2rem]">
                {/* Patient login form fields */}
                <h3 className="text-center font-bold text-3xl">Connexion Patient</h3>
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-[1rem]">
                  <label className="grid grid-flow-row gap-2" htmlFor="email">
                    Email
                    <input
                      className="bg-white/40 py-2 pl-[1rem] pr-[2rem] rounded-3xl"
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
                    Mot de passe
                    <input
                      className="bg-white/40 py-2 pl-[1rem] pr-[2rem] rounded-3xl"
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      required
                    />
                  </label>
                </div>
                <div className="flex justify-between items-center">
                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  <span className="text-[.8rem]">Se souvenir de moi</span>
                </label>
                <Link className="text-[#39e240] text-[.8rem]" href="#">Mot de passe oublié?</Link>
              </div>
                <button
                  className="bg-linear-to-r from-[#1c5284] to-[#39e240] p-2 rounded-4xl text-white font-semibold"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Envoyer"}
                </button>
              </form>
            </div>
          )}

          {userType === "doctor" && (
            <div className="flex justify-between px-[3rem] py-[2.5rem] lg:w-[80vw] xl:w-[60vw] h-[60vh] items-center">
              <div className="grid gap-y-[2rem]">
                <h2 className="text-[2.5rem] w-[25rem] font-bold">
                  Bienvenue de retour, Médecin!
                </h2>
                <p className="w-[25rem]">
                  Connectez-vous pour accéder à votre tableau de bord personnalisé. Nous sommes là pour soutenir votre rôle vital en fournissant des soins excellents et en aidant les patients dans leur parcours de santé
                </p>
              </div>
              <form onSubmit={handleDoctorLogin} className="grid gap-y-[1rem] grid-flow-row bg-white/30 p-[2rem]">
                {/* Doctor login form fields */}
                <h3 className="text-center font-bold text-3xl">Connexion Médecin</h3>
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-[1rem]">
                  <label className="grid grid-flow-row gap-2" htmlFor="email">
                    Email
                    <input
                      className="bg-white/40 py-2 pl-[1rem] pr-[2rem] rounded-3xl"
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
                    Mot de passe
                    <input
                      className="bg-white/40 py-2 pl-[1rem] pr-[2rem] rounded-3xl"
                      type="password"
                      name="password"
                      placeholder="Mot de passe"
                      required
                    />
                  </label>
                </div>
                <div className="flex justify-between items-center">
                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  <span className="text-[.8rem]">Se souvenir de moi</span>
                </label>
                <Link className="text-[#39e240] text-[.8rem]" href="#">Mot de passe oublié?</Link>
              </div>
                <button
                  className="cursor-pointer bg-linear-to-r from-[#1c5284] to-[#39e240] p-2 rounded-4xl text-white font-semibold"
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
        className={`relative lg:hidden  w-screen h-screen flex flex-col justify-center items-center transition-all duration-300 bg-cover bg-center ${
          userType === null ? "bg-[url('/images/signbg.jpg')]" : backgroundImage
        }`}
      >
        {!userType && (
          // This block renders the initial welcome screen with two buttons
          <div className="bg-black/30 backdrop-blur-[2px] text-white flex flex-col items-center justify-center w-full h-full px-5">
            <h2 className="text-4xl font-bold mb-2">Bienvenue de retour!</h2>
            <p className="text-md text-center  mb-8">
              Veuillez sélectionner si vous vous connectez en tant que médecin ou patient pour accéder à votre tableau de bord de santé personnalisé.
            </p>
            <div className="flex w-full justify-between gap-2 px-6">
              <button
                onClick={() => setUserType("patient")}
                className="flex-1 py-3 bg-white text-blue-700 rounded-lg shadow"
              >
                Patient
              </button>
              <button
                onClick={() => setUserType("doctor")}
                className="flex-1 py-3 bg-white text-blue-700 rounded-lg shadow"
              >
                Médecin
              </button>
            </div>
          </div>
        )}

        {userType && (
          // This block renders the white sign-in interface for the chosen user type
          <div className="h-[70vh]  absolute left-0 right-0 bottom-0 mx-auto bg-white rounded-t-3xl px-10 py-8 shadow-lg">
            <button
              className="self-start mb-4 text-white flex absolute top-[-10rem] left-4 items-center gap-2"
              onClick={() => setUserType(null)}
            >
              <ChevronLeft />
              <span>Retour</span>
            </button>
            <h3 className="text-[1.5rem] text-center font-semibold mb-6 text-[#39e240]">
              Bienvenue {userType === "doctor" ? "Médecin" : "Patient"}
            </h3>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm mb-4">
                {error}
              </div>
            )}
            <form onSubmit={userType === "doctor" ? handleDoctorLogin : handlePatientLogin} className="w-full flex flex-col gap-y-[1.5rem]">
              <div className="w-full grid gap-y-[2rem]">
                <label htmlFor="email" className="relative grid gap-y-3">
                  <span className="absolute top-[-.7rem] left-1 text-[.9rem] font-medium text-gray-400 bg-white px-2">Email</span>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="jacob@exemple.com"
                    className="p-3 border rounded-lg w-full"
                  />
                </label>
                <label htmlFor="password" className="relative grid gap-y-3">
                  <span className="absolute top-[-.7rem] left-1 text-[.9rem] font-medium text-gray-400 bg-white px-2">Mot de passe</span>
                  <input
                    required
                    type="password"
                    name="password"
                    placeholder="Votre mot de passe"
                    className="p-3 border rounded-lg w-full"
                  />
                </label>
              </div>
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-1">
                  <input type="checkbox" />
                  <span className="text-[.8rem]">Se souvenir de moi</span>
                </label>
                <Link className="text-[#39e240] text-[.8rem]" href="#">Mot de passe oublié?</Link>
              </div>
              <button
                type="submit"
                className="cursor-pointer py-3 bg-linear-to-r from-[#1c5284] to-[#39e240] text-white rounded-lg font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Connexion en cours..." : "Se Connecter"}
              </button>
              <div className="relative border-t-2 border-gray-200">
                <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-gray-400 text-[.8rem]">Ou</span>
                <Link className="grid justify-center mt-5 py-4 text-[#39e240]" href="/register">Créer un compte</Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
