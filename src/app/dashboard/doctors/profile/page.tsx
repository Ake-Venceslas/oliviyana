"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useSidebar } from "@/components/SidebarProvider";
import { Check, X, Edit2, Save, Mail, MapPin, Briefcase, Calendar, Camera } from "lucide-react";

interface DoctorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  hospital: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  yearsExperience: number;
  profileImage: string;
  joinDate: string;
}

const DoctorProfilePage = () => {
  const { expanded } = useSidebar();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction pour générer un numéro de licence aléatoire
  const generateLicenseNumber = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    return `LIC-${year}-${randomNum}`;
  };

  const [profile, setProfile] = useState<DoctorProfile>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "+237 6 99 88 77 66",
    specialization: "",
    licenseNumber: "",
    hospital: "Hôpital Central de Yaoundé",
    address: "123 Rue de la Santé",
    city: "Yaoundé",
    state: "Centre",
    zipCode: "1000",
    bio: "Médecin spécialisé en cardiologie avec plus de 10 ans d'expérience.",
    yearsExperience: 10,
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    joinDate: "2015-03-15",
  });

  const [formData, setFormData] = useState<DoctorProfile>(profile);

  // Charger les données sauvegardées au chargement et synchroniser avec Clerk
  useEffect(() => {
    if (!user) return;

    const savedProfile = localStorage.getItem("doctorProfile");
    const specialties = (user?.unsafeMetadata?.specialties as string[]) || [];
    const specialization = specialties.length > 0 ? specialties[0] : "Non spécifiée";
    
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      // Mettre à jour les données Clerk si l'utilisateur a changé
      const updatedProfile = {
        ...parsedProfile,
        firstName: user.firstName || parsedProfile.firstName,
        lastName: user.lastName || parsedProfile.lastName,
        email: user.primaryEmailAddress?.emailAddress || parsedProfile.email,
        specialization: specialization,
      };
      setProfile(updatedProfile);
      setFormData(updatedProfile);
    } else {
      // Si aucun profil sauvegardé, créer un nouveau avec les données Clerk
      const newProfile: DoctorProfile = {
        id: `DOC${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "+237 6 99 88 77 66",
        specialization: specialization,
        licenseNumber: generateLicenseNumber(),
        hospital: "Hôpital Central de Yaoundé",
        address: "123 Rue de la Santé",
        city: "Yaoundé",
        state: "Centre",
        zipCode: "1000",
        bio: "Médecin spécialisé en cardiologie avec plus de 10 ans d'expérience.",
        yearsExperience: 10,
        profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
        joinDate: "2015-03-15",
      };
      setProfile(newProfile);
      setFormData(newProfile);
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Empêcher la modification du firstName, lastName, specialization et licenseNumber
    if (name === "firstName" || name === "lastName" || name === "specialization" || name === "licenseNumber") {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: name === "yearsExperience" ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sauvegarder dans localStorage
      localStorage.setItem("doctorProfile", JSON.stringify(formData));
      setProfile(formData);
      setIsEditing(false);
      setSuccessMessage("Profil mis à jour avec succès!");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setErrorMessage("Erreur lors de la sauvegarde du profil");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
    setErrorMessage("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("La taille de l'image ne doit pas dépasser 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Veuillez sélectionner une image valide");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          profileImage: imageData,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`transition-all duration-300 ${
        expanded ? "ml-64" : "ml-20"
      } p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen`}
    >
      {/* Messages */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <Check size={20} />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <X size={20} />
          {errorMessage}
        </div>
      )}

      {/* En-tête */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations professionnelles</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
          >
            <Edit2 size={20} />
            Modifier
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium disabled:bg-gray-400"
            >
              <Save size={20} />
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              <X size={20} />
              Annuler
            </button>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Carte profil gauche */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            {/* Avatar */}
            <div className="mb-6 flex justify-center">
              <div className="relative group">
                <Image
                  src={formData.profileImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-4 border-blue-600 shadow-lg"
                />
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <Camera size={32} className="text-white" />
                  </button>
                )}

                {/* Input file caché */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Charger une photo de profil"
                />
              </div>
            </div>

            {/* Infos principales */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-blue-600 font-semibold mt-2">{profile.specialization}</p>
              <p className="text-gray-600 text-sm mt-1">ID: {profile.id}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{profile.yearsExperience}</p>
                <p className="text-gray-600 text-sm">Ans d&apos;expérience</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">4.8</p>
                <p className="text-gray-600 text-sm">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire droite */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="space-y-6">
              {/* Section Informations Personnelles */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Mail size={20} className="text-blue-600" />
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom (Non modifiable)
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom (Non modifiable)
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section Informations Professionnelles */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  Informations Professionnelles
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spécialisation (Non modifiable)
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de Licence (Non modifiable)
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 text-gray-600 rounded-lg border border-gray-300 cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hôpital
                    </label>
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Années d&apos;expérience
                    </label>
                    <input
                      type="number"
                      name="yearsExperience"
                      value={formData.yearsExperience}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section Adresse */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-blue-600" />
                  Adresse
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      État/Région
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code Postal
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors ${
                        isEditing
                          ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          : "bg-gray-50 text-gray-800"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Section Bio */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Biographie</h3>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border border-gray-300 transition-colors resize-none ${
                    isEditing
                      ? "bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      : "bg-gray-50 text-gray-800"
                  }`}
                  placeholder="Décrivez votre expérience et votre approche médicale..."
                />
              </div>

              {/* Date d'adhésion */}
              <div className="pt-6 border-t border-gray-200 flex items-center gap-2 text-gray-600">
                <Calendar size={20} />
                <span>Membre depuis: {new Date(profile.joinDate).toLocaleDateString("fr-FR")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
