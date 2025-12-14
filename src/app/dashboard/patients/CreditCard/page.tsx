"use client";

import React, { useState } from "react";
import { toast } from 'sonner';
import { CreditCard, Plus, Trash2, Lock, Eye, EyeOff, Wallet, DollarSign, CheckCircle } from "lucide-react";
import Image from "next/image";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "debit_card" | "paypal" | "mobile_money" | "bank_transfer";
  name: string;
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
  provider: string;
  logo: string;
  color: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  paymentMethod: string;
}

const PaymentPage = () => {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>("PM001");
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "PM001",
      type: "credit_card",
      name: "Visa Card",
      lastFour: "4242",
      expiryDate: "12/25",
      isDefault: true,
      provider: "Visa",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "PM002",
      type: "debit_card",
      name: "Mastercard",
      lastFour: "5555",
      expiryDate: "08/26",
      isDefault: false,
      provider: "Mastercard",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Mastercard_logo.svg/1200px-Mastercard_logo.svg.png",
      color: "from-red-600 to-orange-600",
    },
    {
      id: "PM003",
      type: "mobile_money",
      name: "Orange Money",
      lastFour: "6 99 88 77 66",
      expiryDate: "N/A",
      isDefault: false,
      provider: "Orange Money",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Orange_logo.svg/1200px-Orange_logo.svg.png",
      color: "from-orange-500 to-orange-700",
    },
    {
      id: "PM004",
      type: "mobile_money",
      name: "MTN Mobile Money",
      lastFour: "6 88 77 66 55",
      expiryDate: "N/A",
      isDefault: false,
      provider: "MTN Mobile Money",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/MTN_logo.svg/1280px-MTN_logo.svg.png",
      color: "from-yellow-500 to-yellow-700",
    },
    {
      id: "PM005",
      type: "paypal",
      name: "PayPal",
      lastFour: "user@email.com",
      expiryDate: "N/A",
      isDefault: false,
      provider: "PayPal",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1280px-PayPal.svg.png",
      color: "from-blue-700 to-blue-900",
    },
    {
      id: "PM006",
      type: "debit_card",
      name: "American Express",
      lastFour: "3782",
      expiryDate: "05/27",
      isDefault: false,
      provider: "American Express",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/American_Express_logo.svg/1200px-American_Express_logo.svg.png",
      color: "from-cyan-600 to-cyan-800",
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: "TRX001",
      date: "2024-12-10",
      description: "Consultation - Dr. Ahmed Abdallah",
      amount: 50000,
      status: "completed",
      paymentMethod: "Visa Card",
    },
    {
      id: "TRX002",
      date: "2024-12-08",
      description: "Analyse de sang",
      amount: 25000,
      status: "completed",
      paymentMethod: "Orange Money",
    },
    {
      id: "TRX003",
      date: "2024-12-05",
      description: "Radiographie thoracique",
      amount: 75000,
      status: "completed",
      paymentMethod: "Mastercard",
    },
    {
      id: "TRX004",
      date: "2024-12-01",
      description: "Consultation générale",
      amount: 40000,
      status: "pending",
      paymentMethod: "Visa Card",
    },
    {
      id: "TRX005",
      date: "2024-11-28",
      description: "Vaccination COVID-19",
      amount: 15000,
      status: "completed",
      paymentMethod: "MTN Mobile Money",
    },
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.cardNumber && formData.cardHolder && formData.expiryDate && formData.cvv) {
      toast.info("Fonctionnalité de paiement non disponible pour le moment.");
      setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
      setShowAddPayment(false);
    }
  };

  const handleDeletePayment = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?")) {
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
    }).format(amount);
  };

  const totalSpent = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <Wallet size={40} className="text-blue-600" />
          Mes Paiements
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Gérez vos méthodes de paiement et historique de transactions
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <p className="text-gray-600 text-sm font-medium">Total dépensé</p>
          <p className="text-4xl font-bold text-blue-600 mt-3">{formatCurrency(totalSpent)}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full w-1/2"></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <p className="text-gray-600 text-sm font-medium">Méthodes de paiement</p>
          <p className="text-4xl font-bold text-green-600 mt-3">{paymentMethods.length}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full w-1/2"></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
          <p className="text-gray-600 text-sm font-medium">Transactions totales</p>
          <p className="text-4xl font-bold text-purple-600 mt-3">{transactions.length}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full w-1/2"></div>
        </div>
      </div>

      {/* Sélecteur de mode de paiement */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <CreditCard size={28} className="text-blue-600" />
          Choisir votre mode de paiement
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentId(method.id)}
              className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 flex flex-col items-center justify-center gap-3 ${
                selectedPaymentId === method.id
                  ? `border-blue-600 bg-blue-100 shadow-lg`
                  : `border-gray-300 bg-white hover:border-gray-400 hover:shadow-md`
              }`}
            >
              <div className="w-12 h-8 relative">
                <Image
                  src={method.logo}
                  alt={method.provider}
                  width={48}
                  height={32}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs font-bold text-center text-gray-800 truncate w-full">
                {method.provider}
              </span>
            </button>
          ))}
        </div>

        {/* Détail de la méthode sélectionnée */}
        {paymentMethods.find((m) => m.id === selectedPaymentId) && (
          <div className="mt-8 bg-white rounded-lg p-6 border-2 border-blue-200">
            {(() => {
              const selected = paymentMethods.find((m) => m.id === selectedPaymentId)!;
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Image
                        src={selected.logo}
                        alt={selected.provider}
                        width={30}
                        height={20}
                        className="object-contain"
                        unoptimized
                      />
                      {selected.name}
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Numéro</p>
                        <p className="text-lg font-mono font-bold text-gray-800">
                          {"•".repeat(12)}{selected.lastFour}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date d&apos;expiration</p>
                        <p className="text-lg font-bold text-gray-800">{selected.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="text-lg font-bold text-gray-800 capitalize">{selected.type.replace("_", " ")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      {selected.isDefault && (
                        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold mb-4">
                          ✓ Méthode par défaut
                        </span>
                      )}
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl text-center">
                      Procéder au paiement avec {selected.provider}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Méthodes de paiement */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <CreditCard size={28} className="text-blue-600" />
            Mes méthodes de paiement
          </h2>
          <button
            onClick={() => setShowAddPayment(!showAddPayment)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Ajouter
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showAddPayment && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 mb-8 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Ajouter une nouvelle méthode de paiement</h3>
            <form onSubmit={handleAddPayment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Numéro de carte</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cardNumber: e.target.value.replace(/\s/g, "").slice(0, 16),
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Titulaire de la carte</label>
                  <input
                    type="text"
                    placeholder="Nom Complet"
                    value={formData.cardHolder}
                    onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Date d&apos;expiration</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">CVV/CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                  />
                </div>
              </div>
              <div className="flex gap-3 mb-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Ajouter la carte
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Annuler
                </button>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-xs text-red-700 flex items-center gap-2">
                  <Lock size={16} className="flex-shrink-0" />
                  Les paiements ne sont pas fonctionnels dans cette version
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Grille des cartes */}
        {paymentMethods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`rounded-xl p-6 transition-all transform hover:scale-105 ${
                  method.isDefault
                    ? `bg-gradient-to-br ${method.color} text-white shadow-xl border-2 border-white`
                    : "bg-white border-2 border-gray-200 hover:border-gray-300 shadow-lg"
                }`}
              >
                {/* Header avec logo */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                    <Image
                      src={method.logo}
                      alt={method.provider}
                      width={50}
                      height={30}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  {method.isDefault && (
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Par défaut
                    </span>
                  )}
                </div>

                {/* Numéro de carte */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2 min-w-0">
                    <span className="text-lg lg:text-2xl font-mono font-bold tracking-wider truncate">
                      {"•".repeat(12)}{method.lastFour}
                    </span>
                    <button
                      onClick={() =>
                        setShowCardDetails(showCardDetails === method.id ? null : method.id)
                      }
                      className={`p-1 rounded hover:${method.isDefault ? "bg-white/20" : "bg-gray-100"} transition-colors flex-shrink-0`}
                    >
                      {showCardDetails === method.id ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  {showCardDetails === method.id && (
                    <div className={`text-xs lg:text-sm ${method.isDefault ? "text-white/80" : "text-gray-600"} border-t border-opacity-20 border-current pt-3 mt-3 break-words`}>
                      <p className="truncate">Expire: {method.expiryDate}</p>
                      <p className="truncate">{method.name}</p>
                    </div>
                  )}
                </div>

                {/* Provider */}
                <p className={`text-xs lg:text-sm font-semibold mb-4 ${method.isDefault ? "text-white/90" : "text-gray-700"} truncate`}>
                  {method.provider}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Définir par défaut
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePayment(method.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1 ${
                      method.isDefault
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <CreditCard size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucune méthode de paiement ajoutée</p>
          </div>
        )}
      </div>

      {/* Historique des transactions */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <DollarSign size={28} className="text-green-600" />
          Historique des transactions
        </h2>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Méthode</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Statut</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-700 font-medium">{formatDate(transaction.date)}</td>
                    <td className="px-6 py-4 text-gray-800 font-semibold">{transaction.description}</td>
                    <td className="px-6 py-4 font-bold text-lg text-gray-800">{formatCurrency(transaction.amount)}</td>
                    <td className="px-6 py-4 text-gray-700 font-medium">{transaction.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
                          transaction.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status === "completed" && <CheckCircle size={14} />}
                        {transaction.status === "completed"
                          ? "Complétée"
                          : transaction.status === "pending"
                          ? "En attente"
                          : "Échouée"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <DollarSign size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucune transaction enregistrée</p>
          </div>
        )}
      </div>

      {/* Avis de sécurité */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-8 shadow-lg">
        <div className="flex gap-6">
          <Lock size={32} className="text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 mb-2 text-lg">Sécurité de vos paiements</h3>
            <p className="text-blue-800">
              Vos informations de paiement sont sécurisées et chiffrées. Les paiements ne sont pas fonctionnels
              dans cette version de démonstration. Cette page est à titre informatif uniquement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
