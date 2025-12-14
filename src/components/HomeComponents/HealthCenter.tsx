import React from "react";
import { topHospitals } from "@/data/hospitals";
import Image from "next/image";

const HealthCenter: React.FC = () => {
  // Take only first 3 hospitals to display
  const hospitalsToShow = topHospitals.slice(0, 3);

  return (
    <section className="max-w-6xl mx-auto p-4 grid gap-y-[.5rem]">
      <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Meilleurs Hôpitaux
      </h2>
      <div className="grid justify-center text-center">
        <p className="text-[1.2rem] text-gray-500 w-[55vw]">
          Nous sommes partenaires avec les meilleurs hôpitaux du pays. Notre plateforme est conçue pour faciliter la recherche de rendez-vous avec des médecins de confiance.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-[2.5rem]">
        {hospitalsToShow.map((hospital) => (
          <article
            key={hospital.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Image
              src={hospital.imageUrl}
              alt={`${hospital.name} image`}
              className="rounded-t-lg object-cover w-full h-48"
              width={1000}
              height={1000}
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                {hospital.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{hospital.city}</p>
              <p className="text-yellow-500 font-medium mb-2">
                {"★".repeat(Math.floor(hospital.rating))}{" "}
                <span className="text-gray-400">
                  ({hospital.rating.toFixed(1)})
                </span>
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">{hospital.description}</p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Spécialité:</strong> {hospital.specialty}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Contact:</strong> {hospital.contactNumber}
              </p>
              {hospital.website && (
                <a
                  href={hospital.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-600 hover:underline text-sm"
                >
                  Visiter le site web
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default HealthCenter;
