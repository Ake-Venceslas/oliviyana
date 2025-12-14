"use client";

import React, { useEffect, useState } from "react";
import { fetchDoctors, Doctor } from "@/data/hospitals";
import Image from "next/image";

const HealthCenter: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await fetchDoctors();
        setDoctors(doctorsData.slice(0, 3)); // Take only first 3 doctors
      } catch (error) {
        console.error("Erreur lors du chargement des médecins:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto p-4 grid gap-y-[.5rem]">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          Meilleurs Médecins
        </h2>
        <div className="text-center text-gray-500">Chargement...</div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto p-4 grid gap-y-[.5rem]">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Meilleurs Médecins
      </h2>
      <div className="grid justify-center text-center">
        <p className="text-[1.2rem] text-gray-500 w-[55vw]">
          Nous sommes partenaires avec les meilleurs médecins du pays. Notre plateforme est conçue pour faciliter la recherche de rendez-vous avec des médecins de confiance.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-[2.5rem]">
        {doctors.map((doctor) => (
          <article
            key={doctor.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {doctor.profileImage && (
              <Image
                src={doctor.profileImage}
                alt={`${doctor.firstName} ${doctor.lastName} image`}
                className="rounded-t-lg object-cover w-full h-48"
                width={1000}
                height={1000}
                loading="lazy"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Spécialité:</strong> {doctor.specialty}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Expérience:</strong> {doctor.experience} ans
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">{doctor.bio}</p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Contact:</strong> {doctor.phone}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {doctor.email}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HealthCenter;
