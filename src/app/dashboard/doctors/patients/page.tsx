"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Phone, Mail, MapPin, Calendar, BookOpen, MessageSquare } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface Patient {
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

const PatientsPage = () => {
  const { user } = useUser();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les patients depuis Clerk
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/patients", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des patients");
        }

        const data = await response.json();
        setPatients(data.patients || []);
        setFilteredPatients(data.patients || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPatients();
    }
  }, [user]);

  // Filtrer les patients
  useEffect(() => {
    const filtered = patients.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, patients]);

  // État de chargement
  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement des patients...</p>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-8 max-w-md text-center">
          <Users size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Erreur</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <Users size={40} className="text-blue-600" />
          Mes Patients
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Consultez et gérez vos patients
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total de patients</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{patients.length}</p>
            </div>
            <Users size={48} className="text-blue-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Visites ce mois</p>
              <p className="text-4xl font-bold text-green-600 mt-2">
                {patients.filter((p) => {
                  const lastVisit = new Date(p.lastVisit);
                  const today = new Date();
                  const currentMonth = today.getMonth();
                  const currentYear = today.getFullYear();
                  return lastVisit.getMonth() === currentMonth && lastVisit.getFullYear() === currentYear;
                }).length}
              </p>
            </div>
            <Calendar size={48} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Inscrits récemment</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">
                {patients.filter((p) => {
                  const regDate = new Date(p.registrationDate);
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                  return regDate >= thirtyDaysAgo;
                }).length}
              </p>
            </div>
            <BookOpen size={48} className="text-purple-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des patients */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""} trouvé{filteredPatients.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Liste */}
            <div className="space-y-3">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPatient?.id === patient.id
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {getInitials(patient.firstName, patient.lastName)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {patient.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={14} />
                            {patient.phone}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Dernière visite: {formatDate(patient.lastVisit)}
                        </p>
                      </div>

                      {/* Age */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{patient.age}</p>
                        <p className="text-xs text-gray-600">ans</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucun patient trouvé</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails du patient */}
        {selectedPatient ? (
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-blue-200 sticky top-6">
              {/* Avatar et info de base */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
                  {getInitials(selectedPatient.firstName, selectedPatient.lastName)}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{selectedPatient.age} ans</p>
              </div>

              {/* Informations */}
              <div className="space-y-4 border-t border-blue-200 pt-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    {selectedPatient.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Téléphone</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Phone size={16} className="text-blue-600" />
                    {selectedPatient.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Adresse</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    {selectedPatient.address}, {selectedPatient.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Groupe sanguin</p>
                  <p className="text-lg font-bold text-blue-600">{selectedPatient.bloodType}</p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3 border-t border-blue-200 pt-6 mt-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Inscrit depuis</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    {formatDate(selectedPatient.registrationDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-1">Dernière visite</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    {formatDate(selectedPatient.lastVisit)}
                  </p>
                </div>
              </div>

              {/* Antécédents médicaux */}
              <div className="border-t border-blue-200 pt-6 mt-6">
                <p className="text-sm text-gray-600 font-semibold mb-3">Antécédents médicaux</p>
                <div className="space-y-2">
                  {selectedPatient.medicalHistory.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-gray-800">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="border-t border-blue-200 pt-6 mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <Calendar size={18} />
                  Prendre rendez-vous
                </button>
                <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  <MessageSquare size={18} />
                  Envoyer message
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500 h-full flex items-center justify-center">
              <div>
                <Users size={48} className="mx-auto mb-4 opacity-30" />
                <p>Sélectionnez un patient pour voir les détails</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientsPage;
