'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, Search, X, CheckCircle, AlertCircle, Plus, MapPin, FileText } from 'lucide-react';

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

interface Appointment {
  id: string;
  doctorId: string;
  doctor?: Doctor;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  prescription?: {
    id: string;
    medications: string;
    instructions: string;
    createdAt: string;
  };
  createdAt: string;
}

interface AppointmentData {
  date: string;
  time: string;
  reason: string;
}

export default function AppointmentsPage() {
  const { user, isLoaded } = useUser();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAppointmentHistory, setShowAppointmentHistory] = useState(true);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    date: '',
    time: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past' | 'pending'>('all');

  // Fonction pour récupérer les rendez-vous du patient
  const fetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des rendez-vous');
      }
      const data = await response.json();
      setAppointments(Array.isArray(data) ? data : data.appointments || []);
    } catch (err) {
      console.error('Erreur fetch rendez-vous:', err);
    }
  };

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
    fetchAppointments();
  }, [isLoaded]);

  // Fonction pour déterminer le statut temporel d'un rendez-vous
  const getAppointmentTimingStatus = (appointment: Appointment): 'past' | 'upcoming' | 'today' => {
    const appointmentDate = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
    const now = new Date();
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    
    if (appointmentDay < today) return 'past';
    if (appointmentDay.getTime() === today.getTime()) return 'today';
    return 'upcoming';
  };

  // Filtrer les rendez-vous
  const getFilteredAppointments = () => {
    return appointments.filter((apt) => {
      if (filterStatus === 'all') return true;
      if (filterStatus === 'pending') return apt.status === 'pending';
      
      const timingStatus = getAppointmentTimingStatus(apt);
      if (filterStatus === 'past') return timingStatus === 'past';
      if (filterStatus === 'upcoming') return timingStatus === 'upcoming' || timingStatus === 'today';
      
      return true;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentData.date || !appointmentData.time) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    if (!user?.id) {
      toast.error('Vous devez être connecté pour réserver un rendez-vous');
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

      toast.success('Rendez-vous demandé avec succès! Le docteur devra confirmer votre demande.');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setAppointmentData({ date: '', time: '', reason: '' });
      fetchAppointments(); // Rafraîchir la liste
    } catch (err) {
      toast.error(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Composant pour afficher un rendez-vous
  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const timingStatus = getAppointmentTimingStatus(appointment);
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
    const isUpcoming = timingStatus === 'upcoming' || timingStatus === 'today';
    const isPast = timingStatus === 'past';
    
    const doctor = appointment.doctor;
    const doctorName = doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Docteur (données non disponibles)';
    const doctorSpecialty = doctor?.specialty || 'Spécialité inconnue';

    // Déterminer le statut affiché pour les rendez-vous passés
    const getDisplayStatus = () => {
      if (!isPast) return appointment.status;
      
      // Si le rendez-vous est passé
      if (appointment.prescription) {
        return 'completed';
      }
      return 'no-show';
    };

    const displayStatus = getDisplayStatus();
    
    const statusConfig: Record<string, { bg: string; border: string; dot: string; label: string }> = {
      confirmed: { bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500', label: 'Confirmé' },
      pending: { bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500', label: 'En attente' },
      completed: { bg: 'bg-blue-50', border: 'border-blue-200', dot: 'bg-blue-500', label: 'Effectué' },
      cancelled: { bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500', label: 'Annulé' },
      'no-show': { bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400', label: 'Non effectué' },
    };

    const config = statusConfig[displayStatus] || statusConfig.pending;

    return (
      <div className={`rounded-xl ${config.bg} border ${config.border} overflow-hidden hover:shadow-md transition-all duration-200`}>
        <div className="p-6">
          {/* En-tête avec statut */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                {doctorName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{doctorSpecialty}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold`}>
              <span className={`h-2 w-2 rounded-full ${config.dot}`}></span>
              <span className="text-gray-700">{config.label}</span>
            </div>
          </div>

          {/* Infos rendez-vous */}
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 text-gray-700">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                <Calendar className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Date</p>
                <p className="text-sm font-medium">{appointmentDateTime.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Heure</p>
                <p className="text-sm font-medium">{appointment.appointmentTime}</p>
              </div>
            </div>
            {appointment.reason && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Raison</p>
                  <p className="text-sm text-gray-700">{appointment.reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Prescription pour les rendez-vous passés */}
          {isPast && appointment.prescription && (
            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-emerald-900">Ordonnance</p>
                  {appointment.prescription.medications && (
                    <p className="text-xs text-emerald-800 mt-2">{appointment.prescription.medications}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{new Date(appointment.prescription.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          )}

          {isPast && !appointment.prescription && (
            <div className="mt-5 pt-5 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Aucune ordonnance</p>
                  <p className="text-xs text-amber-800 mt-1">Aucune ordonnance n&apos;a été générée pour ce rendez-vous</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !showAppointmentHistory) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-red-900 mb-2">Erreur</h2>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Rendez-vous</h1>
            <p className="text-gray-600 mt-2">Gérez et consultez vos rendez-vous médicaux</p>
          </div>

          {/* Onglets */}
          <div className="flex gap-3 border-b border-gray-200">
            <button
              onClick={() => setShowAppointmentHistory(true)}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
                showAppointmentHistory
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Historique
            </button>
            <button
              onClick={() => setShowAppointmentHistory(false)}
              className={`px-4 py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                !showAppointmentHistory
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Plus className="h-5 w-5" />
              Nouveau rendez-vous
            </button>
          </div>
        </div>

        {/* SECTION: HISTORIQUE DES RENDEZ-VOUS */}
        {showAppointmentHistory ? (
          <div>
            {/* Filtres */}
            <div className="mb-8 flex gap-2 flex-wrap">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'upcoming', label: 'À venir' },
                { id: 'past', label: 'Passés' },
                { id: 'pending', label: 'En attente' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id as "all" | "upcoming" | "past")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Liste des rendez-vous */}
            {filteredAppointments.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun rendez-vous
                </h3>
                <p className="text-gray-600 mb-8">
                  {appointments.length === 0
                    ? 'Vous n\'avez pas encore de rendez-vous réservé.'
                    : 'Aucun rendez-vous ne correspond à ce filtre.'}
                </p>
                <button
                  onClick={() => {
                    setShowAppointmentHistory(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Réserver un rendez-vous
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* SECTION: RÉSERVATION */
          <div>
            {/* Barre de recherche */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Recherchez un docteur ou une spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Liste des docteurs */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {doctors.length === 0 ? 'Aucun docteur' : 'Aucun résultat'}
                </h3>
                <p className="text-gray-600">
                  {doctors.length === 0
                    ? 'Aucun docteur n\'est disponible.'
                    : 'Essayez de modifier votre recherche.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Avatar placé en haut */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 h-24 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl border-4 border-white">
                        {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Infos docteur */}
                      <h3 className="text-lg font-bold text-gray-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-sm text-blue-600 font-semibold mt-1">{doctor.specialty}</p>
                      
                      {/* Séparation */}
                      <div className="my-4 h-px bg-gray-100"></div>

                      {/* Détails */}
                      <div className="space-y-3 mb-6 text-sm">
                        <div className="flex items-start gap-3">
                          <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{doctor.bio}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <p className="text-gray-700">{doctor.experience} ans d&apos;expérience</p>
                        </div>
                        {doctor.phone && (
                          <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <p className="text-gray-700">{doctor.phone}</p>
                          </div>
                        )}
                      </div>

                      {/* Bouton de réservation */}
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowBookingModal(true);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de réservation */}
        {showBookingModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              {/* Header */}
              <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Réserver un rendez-vous
                </h2>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setSelectedDoctor(null);
                    setAppointmentData({ date: '', time: '', reason: '' });
                  }}
                  className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="p-6 space-y-5">
                {/* Docteur sélectionné */}
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">Docteur</p>
                  <p className="text-base font-semibold text-gray-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialty}</p>
                </div>

                <div className="h-px bg-gray-200"></div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={appointmentData.date}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, date: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                {/* Heure */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={appointmentData.time}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, time: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                {/* Raison */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Raison de la visite
                  </label>
                  <textarea
                    value={appointmentData.reason}
                    onChange={(e) =>
                      setAppointmentData({ ...appointmentData, reason: e.target.value })
                    }
                    placeholder="Décrivez vos symptômes ou la raison..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none h-20"
                  />
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBookingModal(false);
                      setSelectedDoctor(null);
                      setAppointmentData({ date: '', time: '', reason: '' });
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Réservation...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
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
