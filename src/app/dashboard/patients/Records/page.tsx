"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, Trash2, Upload, Search, Calendar, User, Stethoscope } from "lucide-react";

interface MedicalRecord {
  id: string;
  type: "prescription" | "lab_result" | "diagnosis" | "radiology" | "vaccination" | "consultation_note";
  title: string;
  date: string;
  doctor: string;
  hospital: string;
  description: string;
  fileSize: string;
  fileType: string;
}

const RecordsPage = () => {
  const [records] = useState<MedicalRecord[]>([
    {
      id: "REC001",
      type: "consultation_note",
      title: "Note de consultation - Cardiologie",
      date: "2024-12-10",
      doctor: "Dr. Ahmed Abdallah",
      hospital: "Hôpital Central de Yaoundé",
      description: "Consultation générale et suivi cardiaque. Patient en bon état.",
      fileSize: "2.3 MB",
      fileType: "PDF",
    },
    {
      id: "REC002",
      type: "lab_result",
      title: "Résultats d'analyse de sang",
      date: "2024-12-05",
      doctor: "Dr. Marie Mboua",
      hospital: "Hôpital Général de Douala",
      description: "Analyse complète de sang. Tous les paramètres dans les normes.",
      fileSize: "1.8 MB",
      fileType: "PDF",
    },
    {
      id: "REC003",
      type: "radiology",
      title: "Radiographie thoracique",
      date: "2024-11-28",
      doctor: "Dr. Paul Nguem",
      hospital: "Hôpital Provincial de Bamenda",
      description: "Radiographie pulmonaire de routine. Aucune anomalie détectée.",
      fileSize: "5.2 MB",
      fileType: "DICOM",
    },
    {
      id: "REC004",
      type: "prescription",
      title: "Ordonnance - Traitement hypertension",
      date: "2024-11-20",
      doctor: "Dr. Ahmed Abdallah",
      hospital: "Hôpital Central de Yaoundé",
      description: "Prescription de médicaments pour contrôle de la tension artérielle.",
      fileSize: "0.9 MB",
      fileType: "PDF",
    },
    {
      id: "REC005",
      type: "vaccination",
      title: "Certificat de vaccination - COVID-19",
      date: "2024-11-15",
      doctor: "Infirmière Annick",
      hospital: "Centre de Vaccination - Yaoundé",
      description: "Dose de rappel COVID-19 administrée avec succès.",
      fileSize: "0.5 MB",
      fileType: "PDF",
    },
    {
      id: "REC006",
      type: "diagnosis",
      title: "Diagnostic - Infection respiratoire",
      date: "2024-11-10",
      doctor: "Dr. Linda Fon",
      hospital: "Hôpital Régional de Bafoussam",
      description: "Diagnostic d'infection respiratoire supérieure. Traitement initié.",
      fileSize: "1.2 MB",
      fileType: "PDF",
    },
    {
      id: "REC007",
      type: "lab_result",
      title: "Résultats d'urinablyse",
      date: "2024-10-25",
      doctor: "Dr. Rose Atangana",
      hospital: "Hôpital de District de Limbe",
      description: "Analyse d'urine complète. Résultats normaux.",
      fileSize: "0.8 MB",
      fileType: "PDF",
    },
    {
      id: "REC008",
      type: "consultation_note",
      title: "Note de consultation - Médecine générale",
      date: "2024-10-10",
      doctor: "Dr. Marie Mboua",
      hospital: "Hôpital Général de Douala",
      description: "Consultation de suivi annuel. Patient en bonne santé générale.",
      fileSize: "1.5 MB",
      fileType: "PDF",
    },
  ]);

  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>(records);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);


  React.useEffect(() => {
    let filtered = records;

    if (selectedType !== "all") {
      filtered = filtered.filter((record) => record.type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.hospital.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  }, [records, searchQuery, selectedType]);

  const getRecordTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      prescription: "Ordonnance",
      lab_result: "Résultat de labo",
      diagnosis: "Diagnostic",
      radiology: "Radiologie",
      vaccination: "Vaccination",
      consultation_note: "Note de consultation",
    };
    return labels[type] || type;
  };

  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      prescription: "bg-blue-100 text-blue-800",
      lab_result: "bg-green-100 text-green-800",
      diagnosis: "bg-red-100 text-red-800",
      radiology: "bg-purple-100 text-purple-800",
      vaccination: "bg-orange-100 text-orange-800",
      consultation_note: "bg-cyan-100 text-cyan-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getRecordTypeIcon = (type: string) => {
    const icons: { [key: string]: React.ReactElement } = {
      prescription: <FileText size={20} />,
      lab_result: <FileText size={20} />,
      diagnosis: <Stethoscope size={20} />,
      radiology: <FileText size={20} />,
      vaccination: <FileText size={20} />,
      consultation_note: <FileText size={20} />,
    };
    return icons[type] || <FileText size={20} />;
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
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={32} className="text-blue-600" />
          Mes Dossiers Médicaux
        </h1>
        <p className="text-gray-600 mt-2">Accédez à tous vos documents médicaux et antécédents</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total de documents</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{records.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Résultats de labo</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {records.filter((r) => r.type === "lab_result").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Ordonnances</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {records.filter((r) => r.type === "prescription").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Dernière mise à jour</p>
          <p className="text-lg font-bold text-gray-800 mt-2">{formatDate(records[0].date)}</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Titre, médecin, hôpital..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filtre par type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de document</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les types</option>
              <option value="prescription">Ordonnances</option>
              <option value="lab_result">Résultats de labo</option>
              <option value="diagnosis">Diagnostics</option>
              <option value="radiology">Radiologie</option>
              <option value="vaccination">Vaccinations</option>
              <option value="consultation_note">Notes de consultation</option>
            </select>
          </div>

          {/* Bouton de téléchargement massif */}
          <div className="flex items-end">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Upload size={18} />
              Télécharger les documents
            </button>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Médecin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Taille</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getRecordTypeColor(record.type)}`}>
                        {getRecordTypeIcon(record.type)}
                        {getRecordTypeLabel(record.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors"
                      >
                        {record.title}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{record.doctor}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(record.date)}</td>
                    <td className="px-6 py-4 text-gray-700">{record.fileSize}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Voir le document"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Télécharger"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Aucun document trouvé</p>
            <p className="text-sm mt-2">Vos documents médicaux apparaîtront ici</p>
          </div>
        )}
      </div>

      {/* Aperçu du document sélectionné */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tête du modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedRecord.title}</h2>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User size={16} />
                    {selectedRecord.doctor}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    {formatDate(selectedRecord.date)}
                  </p>
                  <p className="text-sm text-gray-600">{selectedRecord.hospital}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700 mb-4">{selectedRecord.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Type de fichier: {selectedRecord.fileType}</p>
                    <p className="text-xs text-gray-500">Taille: {selectedRecord.fileSize}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Eye size={18} />
                      Afficher le document
                    </button>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                      <Download size={18} />
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;
