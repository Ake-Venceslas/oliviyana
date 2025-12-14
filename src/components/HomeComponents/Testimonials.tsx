// components/TestimonialsSlider.tsx
"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

type Testimonial = {
  name: string;
  role: string;
  image: string; // Placeholder for now, you can set to avatars
  rating: number;
  comment: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Martine Nji",
    role: "Propriétaire d'Entreprise",
    image: "/avatars/benjamin.jpg",
    rating: 4.6,
    comment: "J'ai réservé mon rendez-vous en quelques minutes et reçu des rappels par SMS. Cette application hospitalière économise beaucoup de temps avec un service rapide!"
  },
  {
    name: "Emmanuel Ngong",
    role: "Médecin",
    image: "/avatars/joshua.jpg",
    rating: 4.8,
    comment: "Tous mes résultats de laboratoire et mes ordonnances sont stockés de manière sécurisée. Il est facile de montrer les rapports précédents lors de la consultation avec les médecins, plus de stress du papier."
  },
  {
    name: "Brigitte Mbah",
    role: "Enseignant",
    image: "/avatars/darlene.jpg",
    rating: 5,
    comment: "L'application est simple et propre. J'ai programmé les bilans de santé de mes enfants et reçu une notification instantanée. Cela semble sûr et fiable."
  },
  {
    name: "Moussa Talla",
    role: "Étudiant Universitaire",
    image: "/avatars/thomas.jpg",
    rating: 4.7,
    comment: "J'ai pu discuter directement avec mon médecin et télécharger mes documents. Cette application est le moyen le plus facile de gérer les rendez-vous au Cameroun!"
  },
  {
    name: "Clarisse Nyambi",
    role: "Infirmière",
    image: "/avatars/isabelle.jpg",
    rating: 4.9,
    comment: "J'aime voir tous les détails de mes médicaments en un coup d'œil. En tant qu'infirmière, l'accès rapide aux informations des patients est un énorme avantage pour notre travail."
  },
  {
    name: "Emily Ebogo",
    role: "Agriculteur",
    image: "/avatars/emily.jpg",
    rating: 5,
    comment: "Très reconnaissante pour la santé numérique. J'ai reçu des mises à jour et des notifications de suivi même dans mon village. Très recommandé pour tout le monde!"
  }
];


export default function TestimonialsSlider() {
  const [index, setIndex] = useState(0);

  // Show 3 at a time, advance by 1
  const visible = testimonials.slice(index, index + 3);

  const scrollLeft = () => setIndex(idx => (idx > 0 ? idx - 1 : testimonials.length - 3));
  const scrollRight = () => setIndex(idx => (idx < testimonials.length - 3 ? idx + 1 : 0));

  return (
    <div className="w-full py-12 bg-white grid gap-y-[2rem]">
      <h2 className="text-3xl font-semibold mb-8 text-center">
        — Nos Clients Heureux Disent
      </h2>
      <div className="flex items-center justify-center gap-8">
        {visible.map((t, i) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={scrollLeft}
          aria-label="Précédent"
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
          <ChevronLeft className="w-6 h-6" />
        </button>
        {/* Fake page indicator */}
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, idx) => (
            <span key={idx}
              className={`h-2 w-2 rounded-full ${index / 3 === idx ? "bg-gray-800" : "bg-gray-300"}`}>
            </span>
          ))}
        </div>
        <button
          onClick={scrollRight}
          aria-label="Suivant"
          className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function TestimonialCard({ image, name, role, rating, comment }: Testimonial) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-64 h-96 rounded-md overflow-hidden bg-white group transition hover:cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={image}
        alt={name}
        width={1000}
        height={1000}
        className={`absolute inset-0 object-cover w-full h-full transition-all duration-300 ${hovered ? "scale-105 blur-sm brightness-75" : ""}`}
      />
      <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-5 transition-opacity ${hovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="text-green-100 flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star key={idx} fill={idx + 1 <= rating ? "#00b37a" : "none"} stroke="#00b37a" className="w-5 h-5"/>
          ))}
          <span className="text-xs text-white ml-2 font-medium">{rating.toFixed(1)} Note</span>
        </div>
        <p className="text-white mb-6 text-lg italic min-h-[72px]">{comment}</p>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow">
            <Image src={image} alt={name} width={1000} height={1000} className="object-cover w-full h-full" />
          </div>
          <div>
            <div className="text-white font-semibold text-base">{name}</div>
            <div className="text-white text-xs opacity-80">{role}</div>
          </div>
        </div>
      </div>
      {!hovered && (
        <div className="absolute bottom-0 left-0 w-full bg-white/80 py-3 px-4">
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-xs text-gray-500">{role}</div>
        </div>
      )}
    </div>
  );
}
