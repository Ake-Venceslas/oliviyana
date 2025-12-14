'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';
import { MessageCircle, FileText, Search } from 'lucide-react';

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

export default function PrescriptionsPage() {
  const { isLoaded } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/patients');
        
        if (response.status === 401) {
          setError('Vous devez être authentifié en tant que docteur');
          setPatients([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const patientList = data.patients || data || [];
        setPatients(Array.isArray(patientList) ? patientList : []);
        setError(null);
      } catch (err) {
        console.error('Erreur fetch patients:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors du chargement des patients');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [isLoaded]);

  const filteredPatients = patients.filter((patient) =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendPrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !prescriptionText.trim()) {
      toast.error('Veuillez sélectionner un patient et entrer une ordonnance');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientId: selectedPatient.id,
          subject: `Ordonnance médicale`,
          content: prescriptionText,
          messageType: 'prescription',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de l\'envoi');
      }

      await response.json();
      toast.success(`Ordonnance envoyée à ${selectedPatient.firstName} ${selectedPatient.lastName}. Le patient la recevra dans ses messages.`);
      setPrescriptionText('');
      setShowPrescriptionModal(false);
      setSelectedPatient(null);
    } catch (err) {
      toast.error(`Erreur lors de l'envoi de l'ordonnance: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des patients...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <h2 className="text-xl font-bold mb-2">Erreur</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Ordonnances</h1>
          <p className="text-gray-600">
            Sélectionnez un patient et envoyez-lui une ordonnance par message
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un patient par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Message si aucun patient */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {patients.length === 0 ? 'Aucun patient trouvé' : 'Aucun résultat de recherche'}
            </h3>
            <p className="text-gray-600">
              {patients.length === 0
                ? 'Aucun patient n\'a créé de compte pour le moment.'
                : 'Essayez de modifier vos critères de recherche.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {patient.firstName} {patient.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{patient.age} ans</p>
                    </div>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-24">Email:</span>
                      <span className="text-gray-800">{patient.email}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-24">Téléphone:</span>
                      <span className="text-gray-800">{patient.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-24">Groupe sanguin:</span>
                      <span className="text-gray-800">{patient.bloodType}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-24">Ville:</span>
                      <span className="text-gray-800">{patient.city}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-600 font-medium w-24">Inscription:</span>
                      <span className="text-gray-800">{patient.registrationDate}</span>
                    </div>
                  </div>

                  {/* Bouton d'action */}
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setShowPrescriptionModal(true);
                      setPrescriptionText('');
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Envoyer une ordonnance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal d'ordonnance */}
        {showPrescriptionModal && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-indigo-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Ordonnance pour {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setSelectedPatient(null);
                    setPrescriptionText('');
                  }}
                  className="text-white hover:bg-indigo-700 rounded-full p-2 transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSendPrescription} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contenu de l'ordonnance
                  </label>
                  <textarea
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    placeholder="Entrez les détails de l'ordonnance (médicaments, posologie, durée du traitement, etc.)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-40"
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>À envoyer à:</strong> {selectedPatient.email}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrescriptionModal(false);
                      setSelectedPatient(null);
                      setPrescriptionText('');
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-5 w-5" />
                        Envoyer l&apos;ordonnance
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
