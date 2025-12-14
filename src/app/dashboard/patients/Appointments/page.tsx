'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar, Clock, User, Phone, BookOpen, Search, X } from 'lucide-react';

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string;
  bio: string;
  profileImage?: string;
  experience: number;
}

interface AppointmentData {
  date: string;
  time: string;
  reason: string;
}

export default function AppointmentsPage() {
  const { user, isLoaded } = useUser();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: '',
    time: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/doctors');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur ${response.status}`);
        }

        const data = await response.json();
        const doctorsList = data.doctors || data || [];
        setDoctors(Array.isArray(doctorsList) ? doctorsList : []);
        setError(null);
      } catch (err) {
        console.error('Erreur fetch docteurs:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des docteurs');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [isLoaded]);

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentData.date || !appointmentData.time) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (!user?.id) {
      alert('Vous devez être connecté pour réserver un rendez-vous');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          appointmentDate: appointmentData.date,
          appointmentTime: appointmentData.time,
          reason: appointmentData.reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la réservation');
      }

      alert('Rendez-vous demandé avec succès! Le docteur devra confirmer votre demande.');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setAppointmentData({ date: '', time: '', reason: '' });
    } catch (err) {
      alert(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
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
            <p className="text-gray-600">Chargement des docteurs...</p>
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
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rendez-vous</h1>
          <p className="text-gray-600">
            Sélectionnez un docteur et réservez votre rendez-vous
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Message si aucun docteur */}
        {filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {doctors.length === 0 ? 'Aucun docteur trouvé' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-600">
              {doctors.length === 0
                ? 'Aucun docteur n\'est disponible pour le moment.'
                : 'Essayez de modifier votre recherche.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>

                <div className="px-6 pb-6">
                  {/* Avatar */}
                  <div className="flex items-center -mt-16 mb-4">
                    <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl border-4 border-white">
                      {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-sm text-indigo-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </div>

                  {/* Bio et infos */}
                  <p className="text-sm text-gray-600 mb-4">{doctor.bio}</p>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                      {doctor.experience} ans d&apos;expérience
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                      {doctor.phone}
                    </div>
                  </div>

                  {/* Bouton de réservation */}
                  <button
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setShowBookingModal(true);
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Calendar className="h-5 w-5" />
                    Réserver un rendez-vous
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de réservation */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-indigo-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  Rendez-vous avec Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
                </h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedDoctor(null);
                    setAppointmentData({ date: '', time: '', reason: '' });
                  }}
                  className="text-white hover:bg-indigo-700 rounded-full p-2 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="p-6 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-900">
                    <strong>Spécialité:</strong> {selectedDoctor.specialty}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date du rendez-vous
                  </label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, date: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Heure du rendez-vous
                  </label>
                  <input
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, time: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Raison de la visite (optionnel)
                  </label>
                  <textarea
                    value={appointmentData.reason}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, reason: e.target.value })
                    }
                    placeholder="Décrivez les symptômes ou la raison de votre visite..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none h-24"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedDoctor(null);
                      setAppointmentData({ date: '', time: '', reason: '' });
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
                        Réservation...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5" />
                        Réserver
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
