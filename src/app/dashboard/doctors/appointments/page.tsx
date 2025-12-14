'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  reason?: string;
  createdAt: string;
}

export default function AppointmentsPage() {
  const { user, isLoaded } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/appointments?role=doctor');

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Erreur ${response.status}`);
        }

        const data = await response.json();
        const appointmentList = data.appointments || data || [];
        setAppointments(Array.isArray(appointmentList) ? appointmentList : []);
        setError(null);
      } catch (err) {
        console.error('Erreur fetch rendez-vous:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [isLoaded]);

  const filteredAppointments = appointments.filter((apt) =>
    filterStatus === 'all' ? true : apt.status === filterStatus
  );

  const handleStatusUpdate = async (appointmentId: string, newStatus: 'confirmed' | 'cancelled') => {
    if (!selectedAppointment) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId,
          status: newStatus,
          patientId: selectedAppointment.patientId,
          patientEmail: selectedAppointment.patientEmail,
          patientName: selectedAppointment.patientName,
          appointmentDate: selectedAppointment.appointmentDate,
          appointmentTime: selectedAppointment.appointmentTime,
          reason: selectedAppointment.reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      // Mettre à jour localement
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt))
      );

      setShowModal(false);
      setSelectedAppointment(null);
      alert(
        newStatus === 'confirmed'
          ? 'Rendez-vous confirmé! Un message a été envoyé au patient.'
          : 'Rendez-vous refusé. Un message a été envoyé au patient.'
      );
    } catch (err) {
      alert(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">En attente</span>;
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Confirmé</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Annulé</span>;
      default:
        return null;
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des rendez-vous...</p>
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
            Gérez les demandes de rendez-vous de vos patients
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {status === 'all' && 'Tous'}
              {status === 'pending' && 'En attente'}
              {status === 'confirmed' && 'Confirmés'}
              {status === 'cancelled' && 'Annulés'}
            </button>
          ))}
        </div>

        {/* Liste des rendez-vous */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun rendez-vous</h3>
            <p className="text-gray-600">
              {appointments.length === 0
                ? 'Aucune demande de rendez-vous pour le moment.'
                : 'Aucun rendez-vous avec ce statut.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                          {appointment.patientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.patientName}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {appointment.patientEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>{getStatusBadge(appointment.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                      {new Date(appointment.appointmentDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-indigo-600" />
                      {appointment.appointmentTime}
                    </div>
                    <div className="text-gray-600">
                      Demandé le: {new Date(appointment.createdAt).toLocaleDateString('fr-FR')}
                    </div>
                  </div>

                  {appointment.reason && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                      <p className="text-sm text-blue-900">
                        <strong>Raison:</strong> {appointment.reason}
                      </p>
                    </div>
                  )}

                  {appointment.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowModal(true);
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Confirmer
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowModal(true);
                        }}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmation */}
        {showModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="bg-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold">Confirmation</h2>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Êtes-vous sûr de vouloir{' '}
                  <strong>
                    {selectedAppointment.status === 'pending' ? 'confirmer' : 'modifier'}
                  </strong>{' '}
                  le rendez-vous de <strong>{selectedAppointment.patientName}</strong>?
                </p>

                <div className="bg-blue-50 p-3 rounded mb-6 text-sm text-blue-900">
                  <p>
                    <strong>Patient:</strong> {selectedAppointment.patientName}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleDateString('fr-FR')}
                  </p>
                  <p>
                    <strong>Heure:</strong> {selectedAppointment.appointmentTime}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setSelectedAppointment(null);
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAppointment.id, 'confirmed')}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Confirmation...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Confirmer
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedAppointment.id, 'cancelled')}
                    disabled={submitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Refus...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Refuser
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
