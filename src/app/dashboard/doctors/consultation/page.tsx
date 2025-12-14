'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar, Clock, Mail, FileText, Search } from 'lucide-react';

interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  reason?: string;
  status: "confirmed";
  confirmedAt: string;
}

export default function ConsultationPage() {
  const { isLoaded } = useUser();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/consultations');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur ${response.status}`);
        }

        const data = await response.json();
        const consultationsList = data.consultations || data || [];
        setConsultations(Array.isArray(consultationsList) ? consultationsList : []);
        setError(null);
      } catch (err) {
        console.error('Erreur fetch consultations:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [isLoaded]);

  const filteredConsultations = consultations.filter((consultation) =>
    consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.patientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des consultations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Consultations</h1>
          <p className="text-gray-600">
            Vos patients avec rendez-vous confirmés
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

        {/* Message si aucune consultation */}
        {filteredConsultations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {consultations.length === 0 ? 'Aucune consultation' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-600">
              {consultations.length === 0
                ? 'Vous n\'avez pas encore de rendez-vous confirmés.'
                : 'Essayez de modifier votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2"></div>

                <div className="p-6">
                  {/* Patient Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xl border-2 border-indigo-200">
                        {consultation.patientName.charAt(0)}{consultation.patientName.split(' ')[1]?.charAt(0) || ''}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {consultation.patientName}
                        </h3>
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mt-1">
                          Confirmé
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Infos de contact */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Mail className="h-4 w-4 mr-2 text-indigo-600" />
                      {consultation.patientEmail}
                    </div>
                  </div>

                  {/* Détails du rendez-vous */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium">
                        {new Date(consultation.appointmentDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span className="font-medium">{consultation.appointmentTime}</span>
                    </div>
                    {consultation.reason && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-indigo-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Raison de la visite:</p>
                          <p className="text-gray-700">{consultation.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5" />
                      Voir le dossier
                    </button>
                    <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors">
                      Notes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
