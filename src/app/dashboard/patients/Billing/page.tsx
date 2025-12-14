"use client";

import React, { useState } from "react";
import { FileText, Download, Eye, Filter, Search, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  description: string;
  hospital: string;
  doctor: string;
  services: string[];
}

const BillingPage = () => {
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV001",
      invoiceNumber: "FAC-2024-001",
      date: "2024-12-10",
      dueDate: "2024-12-25",
      amount: 50000,
      status: "paid",
      description: "Consultation générale",
      hospital: "Hôpital Central Yaoundé",
      doctor: "Dr. Ahmed Abdallah",
      services: ["Consultation", "Examen clinique"],
    },
    {
      id: "INV002",
      invoiceNumber: "FAC-2024-002",
      date: "2024-12-08",
      dueDate: "2024-12-23",
      amount: 25000,
      status: "paid",
      description: "Analyse de sang",
      hospital: "Hôpital Central Yaoundé",
      doctor: "Dr. Sophie Martin",
      services: ["Analyse sanguine complète", "Rapport laboratoire"],
    },
    {
      id: "INV003",
      invoiceNumber: "FAC-2024-003",
      date: "2024-12-05",
      dueDate: "2024-12-20",
      amount: 75000,
      status: "paid",
      description: "Radiographie thoracique",
      hospital: "Hôpital Général Douala",
      doctor: "Dr. Pierre Dubois",
      services: ["Radiographie", "Interprétation médicale", "Rapport détaillé"],
    },
    {
      id: "INV004",
      invoiceNumber: "FAC-2024-004",
      date: "2024-12-02",
      dueDate: "2024-12-17",
      amount: 35000,
      status: "pending",
      description: "Vaccination",
      hospital: "Centre de Vaccination Yaoundé",
      doctor: "Dr. Lise Moreau",
      services: ["Vaccination COVID-19", "Consultation pré-vaccination"],
    },
    {
      id: "INV005",
      invoiceNumber: "FAC-2024-005",
      date: "2024-11-28",
      dueDate: "2024-12-13",
      amount: 20000,
      status: "overdue",
      description: "Consultation cardiaque",
      hospital: "Clinique Spécialisée Yaoundé",
      doctor: "Dr. Mahmoud Hassan",
      services: ["Consultation cardiaque", "ECG", "Avis spécialisé"],
    },
    {
      id: "INV006",
      invoiceNumber: "FAC-2024-006",
      date: "2024-11-25",
      dueDate: "2024-12-10",
      amount: 45000,
      status: "paid",
      description: "Consultation dentaire",
      hospital: "Clinique Dentaire Yaoundé",
      doctor: "Dr. Farah Al-Rashid",
      services: ["Détartrage", "Examen dentaire", "Traitement"],
    },
  ]);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.hospital.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const calculateStats = () => {
    const paid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
    const pending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0);
    const overdue = invoices.filter((i) => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
    return { paid, pending, overdue };
  };

  const stats = calculateStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "overdue":
        return <AlertCircle size={16} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "pending":
        return "En attente";
      case "overdue":
        return "En retard";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <FileText size={40} className="text-blue-600" />
          Mes Factures
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Consultez et téléchargez vos factures médicales
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Payées</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(stats.paid)}</p>
            </div>
            <CheckCircle size={48} className="text-green-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">En attente</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{formatCurrency(stats.pending)}</p>
            </div>
            <Clock size={48} className="text-yellow-200" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">En retard</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{formatCurrency(stats.overdue)}</p>
            </div>
            <AlertCircle size={48} className="text-red-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des factures */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Filtres */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher facture, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "paid" | "pending" | "overdue")}
                    className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="paid">Payées</option>
                    <option value="pending">En attente</option>
                    <option value="overdue">En retard</option>
                  </select>
                </div>
              </div>

              {/* Compteur de résultats */}
              <p className="text-sm text-gray-600">
                {filteredInvoices.length} facture{filteredInvoices.length !== 1 ? "s" : ""} trouvée{filteredInvoices.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Tableau des factures */}
            {filteredInvoices.length > 0 ? (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedInvoice?.id === invoice.id
                        ? "border-blue-600 bg-blue-50 shadow-lg"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="text-sm text-gray-600">Facture</p>
                        <p className="font-bold text-gray-800">{invoice.invoiceNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-bold text-gray-800">{formatDate(invoice.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Montant</p>
                        <p className="font-bold text-gray-800">{formatCurrency(invoice.amount)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusIcon(invoice.status)}
                          {getStatusLabel(invoice.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune facture trouvée</p>
              </div>
            )}
          </div>
        </div>

        {/* Détail de la facture */}
        {selectedInvoice ? (
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Détails de la facture</h3>

              <div className="space-y-6">
                {/* Numéro et statut */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Numéro de facture</p>
                  <p className="text-xl font-bold text-gray-800">{selectedInvoice.invoiceNumber}</p>
                </div>

                {/* Statut */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Statut</p>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold ${getStatusColor(
                      selectedInvoice.status
                    )}`}
                  >
                    {getStatusIcon(selectedInvoice.status)}
                    {getStatusLabel(selectedInvoice.status)}
                  </span>
                </div>

                {/* Montant */}
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">Montant total</p>
                  <p className="text-3xl font-bold text-blue-600">{formatCurrency(selectedInvoice.amount)}</p>
                </div>

                {/* Dates */}
                <div className="space-y-3 border-t border-blue-200 pt-6">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Date d&apos;émission</p>
                    <p className="text-gray-800 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      {formatDate(selectedInvoice.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Date limite</p>
                    <p className="text-gray-800 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      {formatDate(selectedInvoice.dueDate)}
                    </p>
                  </div>
                </div>

                {/* Information médicale */}
                <div className="space-y-3 border-t border-blue-200 pt-6">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Hôpital</p>
                    <p className="text-gray-800">{selectedInvoice.hospital}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Praticien</p>
                    <p className="text-gray-800">{selectedInvoice.doctor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">Description</p>
                    <p className="text-gray-800">{selectedInvoice.description}</p>
                  </div>
                </div>

                {/* Services */}
                <div className="border-t border-blue-200 pt-6">
                  <p className="text-sm text-gray-600 font-semibold mb-3">Services facturés</p>
                  <ul className="space-y-2">
                    {selectedInvoice.services.map((service, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-800">
                        <span className="text-blue-600 font-bold mt-1">•</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Boutons d'action */}
                <div className="border-t border-blue-200 pt-6 space-y-3">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <Download size={18} />
                    Télécharger PDF
                  </button>
                  <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <Eye size={18} />
                    Aperçu
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500 h-full flex items-center justify-center">
              <div>
                <FileText size={48} className="mx-auto mb-4 opacity-30" />
                <p>Sélectionnez une facture pour voir les détails</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
