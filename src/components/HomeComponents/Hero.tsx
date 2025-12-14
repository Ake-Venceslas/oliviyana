
import Link from "next/link";
import { useEffect } from "react";

import infiniteScroll from "@/data/main"

import { Clock, HandCoins, Handshake, Library, Shield } from "lucide-react";

import { Norican } from "next/font/google";



const norican = Norican({
  weight: "400",
  subsets: ["latin"],
});
const Hero = () => {

  useEffect(() => {
    infiniteScroll();
  }, []);

  return (
    <div>
      <div className="hidden lg:grid grid-cols-2 gap-8 lg:gap-12 items-center px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid gap-y-5 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Connecter <span className="text-[#2E7D32]">les Patients</span> et{" "}
            <span className="text-[#2E7D32]">les Médecins</span>, N&apos;importe Quand, N&apos;importe Où
          </h2>
          <p className="text-base sm:text-lg text-gray-700">
            Réservez facilement des rendez-vous, accédez à vos dossiers et connectez-vous avec des médecins de confiance, tout en un seul endroit sécurisé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 pt-4">
            <Link
              href={"#"}
              className="border-none bg-default text-white px-6 py-3 rounded-full text-center font-medium text-sm sm:text-base hover:bg-[#1B5E20] transition"
            >
              Je suis un Patient
            </Link>
            <Link href={"#"} className="border-2 border-gray-300 px-6 py-3 rounded-lg text-center font-medium text-sm sm:text-base hover:border-[#2E7D32] hover:text-[#2E7D32] transition">
              Je suis un Médecin
            </Link>
          </div>
        </div>

        <div className="">
          <div className="mask-alpha mask-x-from-black mask-x-from-70% mask-l-to-transparent mask-y-from-90% mask-y-to-transparent bg-[url('/images/hero-3.jpg')] bg-cover bg-center w-full h-64 sm:h-80 lg:h-96 rounded-lg"></div>
        </div>
      </div>

      <div className="hidden absolute bottom-[-7rem] lg:grid grid-cols-5 bg-white px-6 py-8 rounded-3xl shadow-2xl shadow-[#A5D6A7]">
        <div className="grid justify-items-center place-items-center border-r-2 border-gray-100 px-3">
          <div className="w-[80%] pb-2 grid justify-items-center border-b-3 border-[#A5D6A7]">
            <Handshake color="#676767" />
          </div>
          <div className="grid justify-items-center">
            <h4 className="py-3 font-semibold">Rendez-vous Faciles</h4>
            <p className="text-center text-[.9rem] text-gray-500">
              Réservez et gérez les visites médicales en quelques secondes.
            </p>
          </div>
        </div>
        <div className="grid justify-items-center place-items-center border-r-2 border-gray-100 px-3">
          <div className="w-[80%] pb-2 grid justify-items-center border-b-3 border-[#A5D6A7]">
            <Library color="#676767" />
          </div>
          <div className="grid justify-items-center">
            <h4 className="py-3 font-semibold">Dossiers Numériques</h4>
            <p className="text-center text-[.9rem] text-gray-500">
              Accédez en toute sécurité à votre historique médical n&apos;importe quand
            </p>
          </div>
        </div>
        <div className="grid justify-items-center place-items-center border-r-2 border-gray-100 px-3">
          <div className="w-[80%] pb-2 grid justify-items-center border-b-3 border-[#A5D6A7]">
            <Shield color="#676767" />
          </div>
          <div className="grid justify-items-center">
            <h4 className="py-3 font-semibold">Médecins Vérifiés</h4>
            <p className="text-center text-[.9rem] text-gray-500">
              Connectez-vous avec des professionnels agréés et de confiance
            </p>
          </div>
        </div>
        <div className="grid justify-items-center place-items-center border-r-2 border-gray-100 px-3">
          <div className="w-[80%] pb-2 grid justify-items-center border-b-3 border-[#A5D6A7]">
            <HandCoins color="#676767" />
          </div>
          <div className="grid justify-items-center">
            <h4 className="py-3 font-semibold">Accès Abordable</h4>
            <p className="text-center text-[.9rem] text-gray-500">
              Des soins de santé de qualité sans stress
            </p>
          </div>
        </div>
        <div className="grid justify-items-center place-items-center">
          <div className="w-[80%] pb-2 grid justify-items-center border-b-3 border-[#A5D6A7]">
            <Clock color="#676767" />
          </div>
          <div className="grid justify-items-center">
            <h4 className="py-3 font-semibold">Disponibilité 24/7</h4>
            <p className="text-center text-[.9rem] text-gray-500">
              Des soins de santé adaptés à votre emploi du temps
            </p>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="relative grid place-items-center lg:hidden mt-[3rem] px-6 py-30 bg-[url('/images/hero-3.jpg')] h-[30rem] bg-cover bg-center bg-gray-500 bg-blend-multiply mask-alpha mask-b-from-black mask-b-from-70%">
        <h2 className="text-white text-[2rem] text-center font-bold leading-[2.5rem] ">
          <span className={`${norican.className} text-[3rem]`}>Connecter</span>{" "}
          <span className="text-[#51b957]">
            <br />
            les Patients
          </span>{" "}
          et <span className="text-[#51b957]">les Médecins</span> N&apos;importe Quand, N&apos;importe Où
        </h2>
        <div className="flex gap-5">
          <Link
            href={"#"}
            className="border-none bg-default text-white px-5 py-2 rounded-lg"
          >
            Je suis un Patient
          </Link>
          <Link href={"#"} className="border-2 px-3 py-2 rounded-lg text-white">
            Je suis un Médecin
          </Link>
        </div>
      </div>

      <div className="block lg:hidden absolute bottom-[-2rem] z-10 py-5 w-full overflow-x-auto scrollbar-hide">
        <div className="flex px-4 py-2 w-max scroller">
          {/* First Set */}
          <ul className="flex gap-4 px-4 inner-scroller tag-list">
            <li className="bg-white flex items-center gap-2 px-3 py-4 rounded-md drop-shadow-lg">
              <Handshake color="#676767" />
              <h4 className="font-semibold text-gray-600">Rendez-vous Faciles</h4>
            </li>
            <li className="bg-white flex items-center gap-2 px-3 py-4 rounded-md drop-shadow-lg">
              <Library color="#676767" />
              <h4 className="font-semibold text-gray-600">Dossiers Numériques</h4>
            </li>
            <li className="bg-white flex items-center gap-2 px-3 py-4 rounded-md drop-shadow-lg">
              <Shield color="#676767" />
              <h4 className="font-semibold text-gray-600">Médecins Vérifiés</h4>
            </li>
            <li className="bg-white flex items-center gap-2 px-3 py-4 rounded-md drop-shadow-lg">
              <HandCoins color="#676767" />
              <h4 className="font-semibold text-gray-600">Accès Abordable</h4>
            </li>
            <li className="bg-white flex items-center gap-2 px-3 py-4 rounded-md drop-shadow-lg">
              <Clock color="#676767" />
              <h4 className="font-semibold text-gray-600">Disponibilité 24/7</h4>
            </li>
          </ul>
          {/* Second Set */}
          
        </div>
      </div>
    </div>
  );
};

export default Hero;
