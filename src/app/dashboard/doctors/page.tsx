"use client";

import { Bell, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useSidebar } from "@/components/SidebarProvider";
import { CalendarCn } from "@/components/Calendar";
import { FaTooth } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";
import { GiKidneys } from "react-icons/gi";
import { StatCard } from "@/components/Dashboard/StatCard";
import { Handlee } from "next/font/google";
import {
  LabGraph,
  OfflineGraph,
  OnlineGraph,
} from "@/components/Dashboard/LineChart";

// import React, { useState } from "react";

// interface PageProps {
//   expanded: boolean;
//   setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
// }

interface Appointments {
  id: string;
  image: string;
  title: string;
  subTitle: string;
  time: string;
}

const handlee = Handlee({ weight: "400", subsets: ["latin"] });

/*
const appointments: Appointments[] = [
  {
    id: "01",
    image: "https://randomuser.me/api/portraits/men/70.jpg",
    title: "Consultation avec Dr. Marie Mboua",
    subTitle: "Médecine Générale - Hôpital Général de Douala",
    time: "09:00 AM",
  },
  {
    id: "02",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    title: "Suivi: M. Samuel Nguem",
    subTitle: "Cardiologie - Hôpital Central de Yaoundé",
    time: "11:30 AM",
  },
  {
    id: "03",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    title: "Nouveau Patient: Mlle Rose Ngue",
    subTitle: "Pédiatrie - Hôpital Régional de Bafoussam",
    time: "02:00 PM",
  },
  {
    id: "04",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    title: "Consultation: M. Pierre Atangana",
    subTitle: "Dermatologie - Hôpital de District de Limbe",
    time: "10:00 AM",
  },
  {
    id: "05",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    title: "Examen: Mme Linda Fon",
    subTitle: "Obstétrique & Gynécologie - Hôpital Provincial de Bamenda",
    time: "01:15 PM",
  },
];
*/

const healthChecks = [
  {
    id: "1",
    name: "Santé Dentaire",
    date: "November 08, 2021",
    icon: <FaTooth className="text-blue-300" size={22} />,
  },
  {
    id: "2",
    name: "Analyse de Sang",
    date: "October 20, 2021",
    icon: <MdBloodtype className="text-[#880808]" size={22} />,
  },
  {
    id: "3",
    name: "Vérification Régulière des Reins",
    date: "August 18, 2021",
    icon: <GiKidneys className="text-[#c42a33]" size={22} />,
  },
];

const Page = () => {
  const { expanded } = useSidebar();
  const { user, isLoaded } = useUser();

  const userName = isLoaded && user ? user.firstName || user.emailAddresses[0].emailAddress : "Docteur";

  return (
    <div id="dash-content" className="grid gap-x-[2rem] relative">
      <div className="hidden lg:block">
        {/* Top Section */}
        <section className="flex justify-between items-start ">
          <div>
            <h4 className="text-[1.2rem] text-gray-500">Bienvenue Dr. {userName}</h4>
            <h3 className="text-[1.7rem] font-semibold">Ravi de vous revoir!</h3>
          </div>
          <div className="flex gap-x-[1rem] items-center">
            <div className="text-gray-500 border-2 border-dashed grid place-items-center w-[2.5rem] h-[2.5rem]  rounded-full">
              <Plus width={17} />
            </div>
            <div className="bg-[#62c167] text-white grid place-items-center w-[2.5rem] h-[2.5rem] rounded-full">
              <Search width={17} />
            </div>
          </div>
        </section>

        {/* Welcome Section */}
        <section
          id="pop-div"
          className="relative lg:my-[3rem] xl:mt-[5rem] p-[2rem] flex items-center bg-green-300 text-white rounded-xl"
        >
          <div className="grid gap-y-[1rem]">
            <h5>Rappel</h5>
            <p
              className={`lg:text-[1.7rem] xl:text-[2rem] lg:w-[17rem] xl:w-[25rem] font-semibold ${
                expanded ? "expanded-text" : "collapsed-text"
              }`}
            >
              Avez-vous eu un bilan de santé de routine ce mois-ci?
            </p>
            <div className="flex items-center gap-x-[1rem]">
              <button className="bg-white text-green-400 px-5 py-2 rounded-md cursor-pointer">
                Vérifier Maintenant
              </button>
              <button className="px-5 py-2 border-2 border-white rounded-md cursor-pointer">
                Voir le Rapport
              </button>
            </div>
          </div>
          <div
            className={`image-container lg:w-[20vw] xl:w-[18vw] absolute transition-all duration-300 ease-in-out ${
              expanded ? "expanded-image" : "collapsed-image"
            }`}
          >
            <Image
              className="pop-image"
              src="/images/FemaleDoc.png"
              alt="femaledoc"
              width={1000}
              height={1000}
            />
          </div>
        </section>

        {/* Middle Section */}
        <section className="my-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-6">Statistiques du Mois</h4>
          <div
            className={`grid gap-6 transition-all duration-300 ease-in-out ${
              expanded
                ? "lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2"
                : "lg:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            <StatCard
              graph={<OfflineGraph />}
              value={27}
              label="Patients Hospitaliers"
              subLabel="Travail Hors Ligne"
              diffLabel="-6% que la moyenne"
              diffColor="bg-red-50 text-red-600"
            />
            <StatCard
              graph={<OnlineGraph />}
              value={9}
              label="Consultations en Ligne"
              subLabel="Travail en Ligne"
              diffLabel="+12% que la moyenne"
              diffColor="bg-green-50 text-green-600"
            />
            <StatCard
              graph={<LabGraph />}
              value={19}
              label="Analyses de Laboratoire"
              subLabel="Travail de Laboratoire"
              diffLabel="+0% que la moyenne"
              diffColor="bg-blue-50 text-blue-600"
            />
          </div>
        </section>
      </div>
      

      {/* Right Section */}
      <div className="hidden lg:block relative ">
        <div
          className={`fixed bg-[#fff] top-0 right-0  transition-all duration-300 ease-in-out h-[100vh] overflow-y-scroll ${
            expanded
              ? "lg:w-[27vw] xl:w-[20vw] p-[1.1rem]"
              : "lg:w-[33vw] xl:w-[25vw] p-[1.8rem]"
          }`}
        >
          <div className="flex justify-between items-center mb-[3rem]">
            <span className="font-semibold">Prévisibilité du Prochain Bilan</span>
            <div className="grid justify-center place-items-center bg-[#62c167] w-[2.5rem] h-[2.5rem] p-2 rounded-full">
              <Bell width={19} fill="white" strokeOpacity={0} />
            </div>
          </div>
          <div className="grid gap-y-[3rem]">
            <CalendarCn />

            <div className="bg-gray-100 px-[1rem] py-[1.5rem] grid gap-y-[2rem] rounded-md">
              <span className="font-semibold">Votre Dernier Bilan de Santé</span>
              <div>
                <div className="grid gap-y-[1rem]">
                  {healthChecks.map((item) => (
                    <div key={item.id} className="flex gap-x-[1.5rem]">
                      <span className="bg-[#f6f6f6] p-2 grid items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full">
                        {item.icon}
                      </span>
                      <div className="grid grid-cols-1">
                        <span className="font-bold text-[.9rem]">
                          {item.name}
                        </span>
                        <span className="text-[.8rem] text-gray-500">
                          {item.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden">
        {/* Top Section */}
        <section className="relative bg-[url(/images/doctordashbg.webp)] bg-cover bg-center w-screen h-[50vh] px-[2rem]">
          <div className="relative pt-[2rem] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white grid gap-y-2">
            <h4 className={`${handlee.className} text-[2rem] text-shadow-md`}>
              Hi Dr. {userName}
            </h4>
            <div>
              <div className="grid gap-y-[1.4vw]">
                <h5 className="text-[1.3rem] ">Rappel</h5>
                <p className="text-[4vw] w-[40vw] md:w-[50vw]">
                  Avez-vous eu un bilan de santé de routine ce mois-ci?
                </p>
                <div className="flex items-center gap-x-[1rem]">
                  <button className="bg-white text-green-400 px-5 py-2 rounded-md cursor-pointer text-[2vw] md:text-[1.5vw]">
                    Vérifier Maintenant
                  </button>
                  <button className="px-5 py-2 border-2 border-white rounded-md cursor-pointer text-[2vw] md:text-[1.5vw]">
                    Voir le Rapport
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Middle Section */}
        <section className="px-[1rem]">
           \
        </section>
      </div>
    </div>
  );
};

export default Page;
