'use client';

import VitalsCards from "@/components/Dashboard/VitalsCard";
import PatientProfileModal, { PatientProfileData } from "@/components/PatientProfileModal";
import { toast } from 'sonner';
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Ellipsis,
  LucideTestTube2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaCapsules, FaMicroscope, FaTablets, FaUserMd } from "react-icons/fa";
import { MdOutlineMonitorHeart } from "react-icons/md";
import { RiSyringeFill } from "react-icons/ri";
import { useSidebar } from "@/components/SidebarProvider";
import { useUser } from "@clerk/nextjs";

type MedicationStatus = "active" | "off" | "refill" | "done";
type IconBg = string;

interface MedicationItem {
  name: string;
  instruction: string;
  lastRefill?: string;
  status: MedicationStatus;
  icon: React.ElementType;
  iconBg: IconBg;
}

type LabResultItem = {
  name: string;
  subtitle?: string;
  icon: React.ElementType;
  iconBg: string;
};

type AppointmentItem = {
  id: number;
  doctorName: string;
  specialty: string;
  avatar: string;
  date: string;
  time: string;
  buttonLabel: string;
};

type PatientInfo = {
  avatar: string;
  fullName: string;
  email: string;
  bio: string;
  sex: "Male" | "Female" | "Other" | string;
  birthdate: string;
  age: string;
  address: string;
  notes: string;
  barcode: string;
  nationality: string;
};

const PatientDashboard = () => {
  const { expanded } = useSidebar();
  const { user, isLoaded } = useUser();
  const [patientData, setPatientData] = useState<PatientInfo | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  // Récupérer les données du profil patient
  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/patient-profile');
        
        if (response.ok) {
          const data = await response.json();
          const profile = data.profile;
          
          // Calculer l'âge
          let age = "";
          if (profile.birthdate) {
            const birth = new Date(profile.birthdate);
            const today = new Date();
            let calculatedAge = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
              calculatedAge--;
            }
            age = `${calculatedAge} ans`;
          }

          // Vérifier si le profil est complété
          const isCompleted = !!(profile.bio && profile.birthdate && profile.address && profile.nationality);
          setProfileCompleted(isCompleted);
          
          // Afficher le modal si le profil n'est pas complété
          if (!isCompleted) {
            setShowProfileModal(true);
          }

          setPatientData({
            avatar: profile.profileImage || user.imageUrl || "/avatars/default.jpg",
            fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: user.emailAddresses[0]?.emailAddress || "",
            bio: profile.bio || "Complétez votre profil pour ajouter une biographie",
            sex: profile.sex || "Other",
            birthdate: profile.birthdate || "Non défini",
            age: age || "Non défini",
            address: profile.address || "Non définie",
            notes: profile.notes || "Aucune note",
            barcode: profile.barcode,
            nationality: profile.nationality || "Non définie",
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };

    fetchProfile();
  }, [isLoaded, user]);

  const handleProfileSubmit = async (data: PatientProfileData) => {
    setProfileLoading(true);
    try {
      const response = await fetch('/api/patient-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      const updatedData = await response.json();
      const profile = updatedData.profile;

      // Recalculer l'âge
      let age = "";
      if (profile.birthdate) {
        const birth = new Date(profile.birthdate);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          calculatedAge--;
        }
        age = `${calculatedAge} ans`;
      }

      setPatientData((prev) =>
        prev
          ? {
              ...prev,
              bio: profile.bio,
              sex: profile.sex,
              birthdate: profile.birthdate,
              age,
              address: profile.address,
              notes: profile.notes,
              nationality: profile.nationality,
            }
          : null
      );

      setProfileCompleted(true);
      setShowProfileModal(false);
      toast.success('Profil mis à jour avec succès!');
    } catch (error) {
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setProfileLoading(false);
    }
  };

  if (!isLoaded || !patientData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const medicationsData: MedicationItem[] = [
    {
      name: "Fenofibrate (50mg)",
      instruction: "Prendre avec de la nourriture tous les matins",
      status: "active",
      icon: FaCapsules,
      iconBg: "bg-rose-100",
    },
    {
      name: "Fenofibrate (20mg)",
      instruction: "Prendre avec du liquide tous les matins",
      lastRefill: "Dernier Renouvellement 2 Oct, 2022",
      status: "off",
      icon: RiSyringeFill,
      iconBg: "bg-red-100",
    },
    {
      name: "Fenofibrate (15mg)",
      instruction: "Prendre 3 comprimés, 3 fois par jour.",
      lastRefill: "Dernier Renouvellement 3 Oct, 2022",
      status: "active",
      icon: FaTablets,
      iconBg: "bg-orange-100",
    },
  ];

  const labResultsData: LabResultItem[] = [
    { name: "X-Ray Cooper", icon: FaUserMd, iconBg: "bg-blue-100" },
    { name: "Allergen-specific IGE", icon: LucideTestTube2, iconBg: "bg-orange-100" },
    { name: "Nasal Endoscope", icon: FaMicroscope, iconBg: "bg-pink-100" },
    { name: "CT-Scan", icon: MdOutlineMonitorHeart, iconBg: "bg-sky-100" },
  ];

  const appointmentsData: AppointmentItem[] = [
    {
      id: 1,
      doctorName: "Dr. Benjamin Itti",
      specialty: "Spécialiste Dentaire",
      avatar: "/avatars/benjamin.jpg",
      date: "7 Oct 2021",
      time: "08:00 - 10:00 AM",
      buttonLabel: "Reschedule",
    },
    {
      id: 2,
      doctorName: "Dr. Darlene Robertson",
      specialty: "Gastroentérologue",
      avatar: "/avatars/darlene.jpg",
      date: "12 Oct 2021",
      time: "10:00 - 11:00 AM",
      buttonLabel: "Reschedule",
    },
    {
      id: 3,
      doctorName: "Dr. Joshua Noah",
      specialty: "Oto-Rhino-Laryngologiste",
      avatar: "/avatars/joshua.jpg",
      date: "20 Oct 2021",
      time: "11:00 - 12:00 AM",
      buttonLabel: "Reschedule",
    },
    {
      id: 4,
      doctorName: "Dr. Emily Carter",
      specialty: "Cardiologue",
      avatar: "/avatars/emily.jpg",
      date: "25 Oct 2021",
      time: "09:00 - 10:30 AM",
      buttonLabel: "Reschedule",
    },
  ];

  return (
    <div className="grid gap-x-[2rem] relative mt-[1rem]">
      <div id="dash-content" className="grid gap-x-[2rem]">
        {/* Left Section */}
        <div>
          <section className="bg-white p-[1.5rem] rounded-md grid gap-y-2">
            <h4 className="font-semibold text-[1.2rem]">Signes Vitaux</h4>
            <div>
              <VitalsCards />
            </div>
          </section>

          <section className="grid gap-x-[2rem] grid-cols-2 my-[2rem]">
            {/* Medications */}
            <div className="bg-white px-[1.5rem] py-[1rem] grid gap-y-[1.5rem]">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Médicaments</h5>
                <div className="flex gap-x-2 items-center">
                  <span className="text-gray-500 text-[.9rem]">Voir tout</span>
                  <Link href={"#"}>
                    <ChevronRight width={15} strokeWidth={3} color="#5d5d5d" />
                  </Link>
                </div>
              </div>
              {medicationsData.map((med, idx) => (
                <div key={med.name + idx} className="flex justify-between border-2 border-[#fbfbfb] p-[1rem]">
                  <div className="flex gap-x-[2rem]">
                    <div className={`${med.iconBg} w-[2rem] h-[2rem] grid items-center justify-center rounded-full`}>
                      {med.icon && <med.icon size={21} />}
                    </div>
                    <div className="grid grid-cols-1">
                      <h5 className="font-semibold">{med.name}</h5>
                      <span className="text-gray-500 text-[.9rem]">{med.instruction}</span>
                      <span className="text-[.8rem] text-[#007efd]">{med.lastRefill}</span>
                    </div>
                  </div>
                  <Ellipsis />
                </div>
              ))}
            </div>

            {/* Lab Results */}
            <div className="bg-white px-[1.5rem] py-[1rem] grid">
              <div className="flex justify-between items-center">
                <h5 className="font-semibold">Résultats Laboratoire</h5>
                <div className="flex gap-x-2 items-center">
                  <span className="text-gray-500 text-[.9rem]">Voir tout</span>
                  <Link href={"#"}>
                    <ChevronRight width={15} strokeWidth={3} color="#5d5d5d" />
                  </Link>
                </div>
              </div>
              {labResultsData.map((lab, idx) => (
                <div key={lab.name + idx}>
                  <div className="flex justify-between border-2 border-[#fbfbfb] p-[1rem]">
                    <div className="flex gap-x-[2rem]">
                      <div className={`${lab.iconBg} w-[2rem] h-[2rem] grid items-center justify-center rounded-full`}>
                        {lab.icon && <lab.icon size={21} />}
                      </div>
                      <div className="grid grid-cols-1">
                        <h5 className="font-semibold">{lab.name}</h5>
                      </div>
                    </div>
                    <ChevronRight width={15} strokeWidth={3} color="#5d5d5d" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Appointments */}
          <section className="bg-white w-full px-[1.5rem] py-[1rem] mb-[2rem]">
            <div>
              <h5 className="font-semibold">Rendez-vous à Venir</h5>
            </div>
            <div className="mt-5 grid gap-y-[1rem]">
              {appointmentsData.map((app, idx) => (
                <div key={app.id + idx} className="shadow-md p-[1rem] flex items-center justify-between">
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="w-[2.5rem] h-[2.5rem] overflow-hidden rounded-full">
                      <Image
                        className="object-cover object-top w-[2.5rem] h-[2.5rem]"
                        src={app.avatar}
                        alt={app.doctorName}
                        width={100}
                        height={100}
                      />
                    </div>
                    <div className="grid grid-cols-1">
                      <span className="font-semibold">{app.doctorName}</span>
                      <span className="text-[.85rem] text-gray-500">{app.specialty}</span>
                    </div>
                  </div>
                  <div className="flex gap-x-[2rem]">
                    <div className="flex items-center gap-x-1.5">
                      <CalendarDays strokeWidth={1.2} width={18} color="#99a1af" />
                      <span className="text-[.9rem] text-gray-400 font-semibold">{app.date}</span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      <Clock strokeWidth={1.2} width={18} color="#99a1af" />
                      <span className="text-[.9rem] text-gray-400 font-semibold">{app.time}</span>
                    </div>
                  </div>
                  <button className="bg-[#05df72] text-white py-2 px-4 rounded">Reprogrammer</button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Section - Patient Profile */}
        <div className="w-full h-full relative">
          <div
            className={`fixed bg-[#fff] top-[rem] right-0 transition-all duration-300 ease-in-out h-[100vh] overflow-y-scroll ${
              expanded
                ? "lg:w-[27vw] xl:w-[23vw] p-[1.1rem] mr-2"
                : "lg:w-[33vw] xl:w-[26vw] p-[1.8rem] mr-3"
            }`}
          >
            <div key={patientData.barcode} className="grid gap-y-[1.5rem]">
              <div className="grid justify-center">
                <Image
                  className="w-[10rem] h-[10rem] object-cover rounded-full"
                  src={patientData.avatar}
                  alt="profile"
                  width={1000}
                  height={1000}
                />
              </div>
              <div className="grid justify-center text-center">
                <h4 className="font-semibold text-[1.5rem]">{patientData.fullName}</h4>
                <span className="text-gray-500">{patientData.email}</span>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-semibold text-[1.1rem]">Biographie</h5>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Modifier
                  </button>
                </div>
                <p className="bg-gray-100 py-2 px-3 text-[.8rem] text-gray-600">{patientData.bio}</p>
              </div>
              <div className="grid gap-y-3">
                <h5 className="font-semibold text-[1.1rem]">À Propos</h5>
                <div className="flex justify-between">
                  <div className="grid text-center gap-y-2">
                    <span className="text-[.9rem] text-gray-500">Sexe</span>
                    <span className="font-semibold text-[.9rem]">{patientData.sex}</span>
                  </div>
                  <div className="grid text-center gap-y-2">
                    <span className="text-[.9rem] text-gray-500">Date de Naissance</span>
                    <span className="font-semibold text-[.9rem]">{patientData.birthdate}</span>
                  </div>
                  <div className="grid text-center gap-y-2">
                    <span className="text-[.9rem] text-gray-500">Âge</span>
                    <span className="font-semibold text-[.9rem]">{patientData.age}</span>
                  </div>
                </div>
                <div className="my-4">
                  <h5 className="font-semibold text-[1.1rem]">Localisation</h5>
                  <span className="text-gray-500">{patientData.address}</span>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold text-[1.1rem]">Nationalité</h5>
                  <span className="text-gray-500">{patientData.nationality}</span>
                </div>
                <div className="mb-4">
                  <h5 className="font-semibold text-[1.1rem]">Code-barres</h5>
                  <span className="text-gray-500 font-mono text-sm break-all">{patientData.barcode}</span>
                </div>
                <div className="mb-[6rem]">
                  <h5 className="font-semibold text-[1.1rem]">Remarques</h5>
                  <span className="text-gray-500">{patientData.notes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de profil patient */}
      <PatientProfileModal
        isOpen={showProfileModal}
        onClose={() => !profileCompleted && setShowProfileModal(true)}
        onSubmit={handleProfileSubmit}
        isLoading={profileLoading}
      />
    </div>
  );
};

export default PatientDashboard;
