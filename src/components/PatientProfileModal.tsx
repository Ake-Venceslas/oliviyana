'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientProfileData) => Promise<void>;
  isLoading?: boolean;
}

export interface PatientProfileData {
  bio: string;
  sex: 'Male' | 'Female' | 'Other';
  birthdate: string;
  address: string;
  notes: string;
  nationality: string;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PatientProfileData>({
    bio: '',
    sex: 'Other',
    birthdate: '',
    address: '',
    notes: '',
    nationality: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setFormData({
        bio: '',
        sex: 'Other',
        birthdate: '',
        address: '',
        notes: '',
        nationality: '',
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Compléter Votre Profil</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Biographie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Biographie
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Parlez-nous de vous..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sexe
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Male">Masculin</option>
              <option value="Female">Féminin</option>
              <option value="Other">Autre</option>
            </select>
          </div>

          {/* Date de Naissance */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de Naissance
            </label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              min="2000-01-01"
              max="2035-12-31"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ex: 123 Rue de la Santé, Yaoundé"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Nationalité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nationalité
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Ex: Camerounais"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes Personnelles
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Informations supplémentaires..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfileModal;
