import { CircleCheckBig } from "lucide-react";

// import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";



const AboutUs = () => {
  return (
    <div>
      <div className="hidden lg:grid grid-cols-2 items-center bg-[#e9ffea] px-10 pt-5 rounded-3xl">
        <div className="grid gap-y-[2rem]">
          <h3 className="font-semibold text-[3rem] leading-[3.5rem]">
            Découvrez notre mission
          </h3>
          <p className="text-gray-600">
            Nous nous engagements à rendre les soins de santé accessibles, fiables et centrés sur le patient. Notre plateforme connecte les patients aux médecins de confiance, simplifie la prise de rendez-vous et favorise de meilleurs résultats en matière de santé grâce à la technologie. En combinant innovation et compassion, nous visons à autonomiser chaque patient pour qu&apos;il prenne soin de son bien-être.
          </p>
          <div className="grid grid-cols-2 gap-y-4 justify-between">
            <div className="flex items-center gap-x-[1rem]">
              <div className="place-self-start pt-1.5">
                <CircleCheckBig color="#2E7D32" size={15} />
              </div>
              <p>Fournir des soins de santé accessibles</p>
            </div>
            <div className="flex items-center gap-x-[1rem]">
              <div className="place-self-start pt-1.5">
                <CircleCheckBig color="#2E7D32" size={15} />
              </div>
              <p>Améliorer l'engagement des patients</p>
            </div>
            <div className="flex items-center gap-x-[1rem]">
              <div className="place-self-start pt-1.5">
                <CircleCheckBig color="#2E7D32" size={15} />
              </div>
              <p>Promouvoir l'éducation sanitaire</p>
            </div>
            <div className="flex items-center gap-x-[1rem]">
              <div className="place-self-start pt-1.5">
                <CircleCheckBig color="#2E7D32" size={15} />
              </div>
              <p>Construire la confiance</p>
            </div>
            <div className="flex items-center gap-x-[1rem]">
              <div className="place-self-start pt-1.5">
                <CircleCheckBig color="#2E7D32" size={15} />
              </div>
              <p>Engagement communautaire</p>
            </div>
            <div className="flex items-center gap-x-[1rem]">
              <div className="place-self-start pt-1.5">
                <CircleCheckBig color="#2E7D32" size={15} />
              </div>
              <p>Sécurité et confidentialité</p>
            </div>
          </div>
        </div>
        <div
          id="about-image"
          className="bg-[url('/images/doctor-about.png')] bg-cover bg-center h-[70vh] w-auto"
        ></div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden px-3">
        <div className="grid gap-y-3 relative">
          <h3 className="font-semibold text-[2rem] text-center leading-[2.5rem]">
            Découvrez notre mission
          </h3>
          <span className="text-gray-500 text-center font-medium">
            Nous nous engageons à rendre les soins de santé accessibles, fiables et centrés sur le patient. Notre plateforme connecte les patients aux médecins de confiance, simplifie la prise de rendez-vous et favorise de meilleurs résultats en matière de santé grâce à la technologie...
          </span>
          <Dialog>
            <DialogTrigger className=" text-white py-3 grid justify-center ">
              <div className="bg-default px-5 py-3 rounded-lg">Lire la suite</div>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Découvrez notre mission</DialogTitle>
              <div className="grid gap-y-3">
                <div className="text-gray-600">
                  Nous nous engageons à rendre les soins de santé accessibles, fiables et centrés sur le patient. Notre plateforme connecte les patients aux médecins de confiance, simplifie la prise de rendez-vous et favorise de meilleurs résultats en matière de santé grâce à la technologie. En combinant innovation et compassion, nous visons à autonomiser chaque patient pour qu&apos;il prenne soin de son bien-être.
                </div>
                <div className="grid  gap-y-4 justify-between">
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="place-self-start pt-1.5">
                      <CircleCheckBig color="#2E7D32" size={15} />
                    </div>
                    <p>Fournir des soins de santé accessibles</p>
                  </div>
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="place-self-start pt-1.5">
                      <CircleCheckBig color="#2E7D32" size={15} />
                    </div>
                    <p>Améliorer l&apos;engagement des patients</p>
                  </div>
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="place-self-start pt-1.5">
                      <CircleCheckBig color="#2E7D32" size={15} />
                    </div>
                    <p>Promouvoir l'éducation sanitaire</p>
                  </div>
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="place-self-start pt-1.5">
                      <CircleCheckBig color="#2E7D32" size={15} />
                    </div>
                    <p>Construire la confiance</p>
                  </div>
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="place-self-start pt-1.5">
                      <CircleCheckBig color="#2E7D32" size={15} />
                    </div>
                    <p>Engagement communautaire</p>
                  </div>
                  <div className="flex items-center gap-x-[1rem]">
                    <div className="place-self-start pt-1.5">
                      <CircleCheckBig color="#2E7D32" size={15} />
                    </div>
                    <p>Sécurité et confidentialité</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
