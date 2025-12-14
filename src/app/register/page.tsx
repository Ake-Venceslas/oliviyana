"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useSignUp } from "@clerk/nextjs";
import { ChevronLeft, Eye, EyeOff, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const { signUp, setActive } = useSignUp();
  const [userType, setUserType] = useState<"doctor" | "patient" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  const specialties = [
    "Médecine Générale",
    "Cardiologie",
    "Dermatologie",
    "Neurologie",
    "Pédiatrie",
    "Psychiatrie",
    "Orthopédie",
    "Oncologie",
    "Gastroentérologie",
    "Ophtalmologie",
    "ORL",
    "Pneumologie",
    "Rhumatologie",
  ];

  // Redirect if already logged in
  useEffect(() => {
    if (isLoaded && userId) {
      // La redirection sera gérée par les appels signUp.create
      router.push("/dashboard/patients");
    }
  }, [isLoaded, userId, router]);

  useEffect(() => {
    if (window.innerWidth >= 1023) {
      setUserType("patient"); // Automatically show patient on desktop
    }
  }, []);

  const handlePatientSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const formElements = e.currentTarget.elements;
    const firstName = (formElements.namedItem("firstName") as HTMLInputElement)?.value || "";
    const lastName = (formElements.namedItem("lastName") as HTMLInputElement)?.value || "";
    const email = (formElements.namedItem("email") as HTMLInputElement)?.value || "";
    const password = (formElements.namedItem("password") as HTMLInputElement)?.value || "";

    if (!signUp) {
      setError("Service d'inscription non disponible.");
      return;
    }

    try {
      // Créer le nouvel utilisateur Clerk
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        unsafeMetadata: {
          role: "patient",
        },
      });

      // Attendre la vérification
      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.push("/dashboard/patients");
      } else {
        setError("Veuillez vérifier votre email pour compléter l'inscription.");
      }
    } catch (err: unknown) {
      console.error("Erreur d'inscription:", err);
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      if (clerkError?.errors?.[0]?.code === "form_identifier_exists") {
        setError("Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse ou vous connecter.");
      } else {
        setError(clerkError?.errors?.[0]?.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    // Valider le nombre de spécialités
    if (selectedSpecialties.length === 0) {
      setError("Veuillez sélectionner au moins une spécialité.");
      return;
    }
    if (selectedSpecialties.length > 2) {
      setError("Vous pouvez sélectionner au maximum 2 spécialités.");
      return;
    }
    
    const formElements = e.currentTarget.elements;
    const firstName = (formElements.namedItem("firstName") as HTMLInputElement)?.value || "";
    const lastName = (formElements.namedItem("lastName") as HTMLInputElement)?.value || "";
    const email = (formElements.namedItem("email") as HTMLInputElement)?.value || "";
    const password = (formElements.namedItem("password") as HTMLInputElement)?.value || "";

    if (!signUp) {
      setError("Service d'inscription non disponible.");
      return;
    }

    try {
      // Créer le nouvel utilisateur Clerk
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        unsafeMetadata: {
          role: "doctor",
          specialties: selectedSpecialties,
        },
      });

      // Attendre la vérification
      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.push("/dashboard/doctors");
      } else {
        setError("Veuillez vérifier votre email pour compléter l'inscription.");
      }
    } catch (err: unknown) {
      console.error("Erreur d'inscription:", err);
      const clerkError = err as { errors?: Array<{ message: string; code: string }> };
      if (clerkError?.errors?.[0]?.code === "form_identifier_exists") {
        setError("Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse ou vous connecter.");
      } else {
        setError(clerkError?.errors?.[0]?.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  const backgroundImage =
    userType === "patient"
      ? "bg-[url('/images/patientbg.webp')]"
      : "bg-[url('/images/doctorbg.webp')]";

  return (
    <div
      id="register"
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
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Rejoignez-nous! </h2>
                <p className="text-sm sm:text-base lg:w-full">
                  Créez un compte pour accéder à votre tableau de bord personnalisé. Nous sommes là pour soutenir votre parcours de santé à chaque étape.
                </p>
              </div>
              <form onSubmit={handlePatientSubmit} className="grid gap-y-4 grid-flow-row bg-white/30 p-4 sm:p-6 lg:p-8 w-full sm:max-w-sm rounded-lg">
                {/* Patient register form fields */}
                <h3 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl">Inscription Patient</h3>
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-4">
                  <label className="grid grid-flow-row gap-2" htmlFor="firstName">
                    <span className="text-sm sm:text-base">Prénom</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="text"
                      name="firstName"
                      placeholder="Votre Prénom"
                      required
                    />
                  </label>
                  <label className="grid grid-flow-row gap-2" htmlFor="lastName">
                    <span className="text-sm sm:text-base">Nom</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="text"
                      name="lastName"
                      placeholder="Votre Nom"
                      required
                    />
                  </label>
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
                  <span>J&apos;accepte les conditions</span>
                </label>
              </div>
                <button
                  className="cursor-pointer bg-linear-to-r from-[#1c5284] to-[#39e240] p-2 rounded-lg text-white font-semibold text-sm sm:text-base"
                  type="submit"
                >
                  S&apos;inscrire
                </button>
              </form>
            </div>
          )}

          {userType === "doctor" && (
            <div className="flex flex-col lg:flex-row justify-between px-4 sm:px-8 lg:px-12 py-6 lg:py-8 lg:w-[80vw] xl:w-[60vw] lg:h-[60vh] items-center gap-8 lg:gap-0 overflow-hidden">
              <div className="grid gap-y-4 lg:gap-y-8 lg:max-w-md">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Rejoignez-nous, Médecin!
                </h2>
                <p className="text-sm sm:text-base lg:w-full">
                  Créez un compte pour accéder à votre tableau de bord personnalisé. Nous sommes là pour soutenir votre rôle vital en fournissant des soins excellents et en aidant les patients dans leur parcours de santé.
                </p>
              </div>
              <form onSubmit={handleDoctorSubmit} className="grid gap-y-4 grid-flow-row bg-white/30 p-4 sm:p-6 lg:p-8 w-full sm:max-w-sm rounded-lg overflow-visible max-h-[65vh] overflow-y-auto">
                {/* Doctor register form fields */}
                <h3 className="text-center font-bold text-xl sm:text-2xl lg:text-3xl">Inscription Médecin</h3>
                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
                <div className="grid gap-y-4 overflow-visible">
                  <label className="grid grid-flow-row gap-2" htmlFor="firstName">
                    <span className="text-sm sm:text-base">Prénom</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="text"
                      name="firstName"
                      placeholder="Votre Prénom"
                      required
                    />
                  </label>
                  <label className="grid grid-flow-row gap-2" htmlFor="lastName">
                    <span className="text-sm sm:text-base">Nom</span>
                    <input
                      className="bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base"
                      type="text"
                      name="lastName"
                      placeholder="Votre Nom"
                      required
                    />
                  </label>
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
                  <label className="grid grid-flow-row gap-2" htmlFor="specialties">
                    <span className="text-sm sm:text-base">Spécialité(s) *</span>
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="w-full bg-white/40 py-2 px-3 sm:px-4 rounded-lg text-left flex justify-between items-center hover:bg-white/50 transition text-sm sm:text-base"
                      >
                        <span className="text-xs sm:text-sm">
                          {selectedSpecialties.length === 0
                            ? "Sélectionner..."
                            : `${selectedSpecialties.length} spécialité(s)`}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${openDropdown ? "rotate-180" : ""}`}
                        />
                      </button>

                      {openDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg p-3 max-h-[180px] overflow-y-auto z-50 shadow-lg border border-gray-300 pointer-events-auto">
                          {specialties.map((specialty) => (
                            <label
                              key={specialty}
                              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded transition text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSpecialties.includes(specialty)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (selectedSpecialties.length < 2) {
                                      setSelectedSpecialties([...selectedSpecialties, specialty]);
                                    }
                                  } else {
                                    setSelectedSpecialties(
                                      selectedSpecialties.filter((s) => s !== specialty)
                                    );
                                  }
                                }}
                                disabled={
                                  !selectedSpecialties.includes(specialty) &&
                                  selectedSpecialties.length >= 2
                                }
                                className="w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm text-gray-800">{specialty}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <small className="text-white/80 text-xs sm:text-sm">
                      ({selectedSpecialties.length}/2) Min 1, Max 2
                    </small>
                  </label>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <label className="flex items-center gap-1 text-xs sm:text-sm">
                  <input type="checkbox" />
                  <span>J&apos;accepte les conditions</span>
                </label>
              </div>
                <button
                  className="cursor-pointer bg-linear-to-r from-[#1c5284] to-[#39e240] p-2 rounded-lg text-white font-semibold text-sm sm:text-base"
                  type="submit"
                >
                  S&apos;inscrire
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center">Rejoignez-nous!</h2>
            <p className="text-sm sm:text-base text-center mb-8 px-2 max-w-xs">
              Veuillez sélectionner si vous vous inscrivez en tant que médecin ou patient pour créer votre compte de santé personnalisé.
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
                Rejoignez-nous {userType === "doctor" ? "Médecin" : "Patient"}
              </h3>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-3 rounded text-red-700 text-xs sm:text-sm mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={userType === "doctor" ? handleDoctorSubmit : handlePatientSubmit} className="w-full flex flex-col gap-4 sm:gap-6">
                <div className="w-full grid gap-4 sm:gap-6">
                  <label htmlFor="firstName" className="relative grid gap-2">
                    <span className="absolute top-[-0.9rem] left-2 text-xs sm:text-sm font-medium text-gray-500 bg-white px-1">Prénom</span>
                    <input
                      required
                      type="text"
                      name="firstName"
                      placeholder="Votre prénom"
                      className="p-3 border border-gray-300 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:border-[#2E7D32]"
                    />
                  </label>
                  <label htmlFor="lastName" className="relative grid gap-2">
                    <span className="absolute top-[-0.9rem] left-2 text-xs sm:text-sm font-medium text-gray-500 bg-white px-1">Nom</span>
                    <input
                      required
                      type="text"
                      name="lastName"
                      placeholder="Votre nom"
                      className="p-3 border border-gray-300 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:border-[#2E7D32]"
                    />
                  </label>
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
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Votre mot de passe"
                        className="p-3 border border-gray-300 rounded-lg w-full text-sm sm:text-base pr-10 focus:outline-none focus:border-[#2E7D32]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700 hover:text-gray-900"
                      >
                        {showPassword ? <EyeOff size={20} strokeWidth={2} /> : <Eye size={20} strokeWidth={2} />}
                      </button>
                    </div>
                  </label>
                  {userType === "doctor" && (
                    <div className="relative grid gap-2 w-full">
                      <span className="text-sm sm:text-base font-medium text-gray-600">Spécialité(s) *</span>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(!openDropdown)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition text-sm sm:text-base"
                      >
                        <span className="text-xs sm:text-sm">
                          {selectedSpecialties.length === 0
                            ? "Sélectionner..."
                            : `${selectedSpecialties.length} spécialité(s)`}
                        </span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform ${openDropdown ? "rotate-180" : ""}`}
                        />
                      </button>

                      {openDropdown && (
                        <div className="border border-gray-300 rounded-lg bg-white p-3 max-h-[200px] overflow-y-auto z-50 shadow-lg pointer-events-auto">
                          {specialties.map((specialty) => (
                            <label
                              key={specialty}
                              className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded transition text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSpecialties.includes(specialty)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (selectedSpecialties.length < 2) {
                                      setSelectedSpecialties([...selectedSpecialties, specialty]);
                                    }
                                  } else {
                                    setSelectedSpecialties(
                                      selectedSpecialties.filter((s) => s !== specialty)
                                    );
                                  }
                                }}
                                disabled={
                                  !selectedSpecialties.includes(specialty) &&
                                  selectedSpecialties.length >= 2
                                }
                                className="w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs sm:text-sm text-gray-800">{specialty}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      <small className="text-gray-600 text-xs sm:text-sm">
                        ({selectedSpecialties.length}/2) Min 1, Max 2
                      </small>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <label className="flex items-center gap-1 text-xs sm:text-sm">
                    <input type="checkbox" />
                    <span>J&apos;accepte les conditions</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="cursor-pointer py-3 bg-gradient-to-r from-[#1c5284] to-[#39e240] text-white rounded-lg font-semibold text-sm sm:text-base"
                >
                  S&apos;inscrire
                </button>
                <div className="relative border-t-2 border-gray-200">
                  <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-gray-400 text-xs sm:text-sm">Vous avez un compte?</span>
                  <Link className="grid justify-center mt-4 py-3 text-[#2E7D32] font-semibold text-sm sm:text-base" href="/login">Se connecter</Link>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
    