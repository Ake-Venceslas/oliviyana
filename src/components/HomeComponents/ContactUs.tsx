"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { toast } from 'sonner';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle form submission (API, email, etc)
    toast.success("Merci de nous avoir contactés!");
  };
  return (
    <div>
      <section className="">
        <div className="grid gap-y-[1.5rem] justify-center text-center">
          <h3 className="font-semibold text-[2.5rem]">Nous Contacter</h3>
          <p className="font-semibold text-gray-500 w-[75vw]">
            Si vous avez des questions, besoin d&apos;assistance avec nos services, ou souhaitez
            partager vos commentaires, notre équipe est là pour vous aider. N&apos;hésitez pas à
            nous contacter en utilisant le formulaire ci-dessous, envoyez-nous un e-mail ou appelez notre
            {/* customer care line. Whether you’re booking an appointment,
            requesting medical records, or looking for more information about
            our hospital, we’re committed to providing you with prompt and
            compassionate support. */}
            {/* Your health and satisfaction are our top priorities don’t hesitate to reach out! */}
          </p>
        </div>

        <div className="my-[4rem] flex gap-x-[7rem] bg-white px-[2rem] py-[2rem] rounded-lg">
          {/* Left Div */}
          <div className="bg-black/20 bg-[url('/images/liquidWaves.jpg')] bg-blend-multiply  bg-cover text-white p-[1.5rem] rounded-lg">
            <div className="">
              <h5 className="font-semibold text-[1.2rem]">
                Informations de Contact
              </h5>
              <p className="w-[19rem] text-[.9rem] mt-2">
                Votre santé et votre satisfaction sont nos priorités absolues,
                n&apos;hésitez pas à nous contacter!
              </p>
            </div>
            <div className="grid gap-y-[2rem] mt-[2rem]">
              <div className="flex gap-2">
                <Phone fill="#fff" />
                <div className="grid ">
                  <span>+237 676 74 66 77</span>
                  <span>+237 687 47 47 76</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail />
                <span>oliviyanaSupport@gmail.com</span>
              </div>
              <div className="flex gap-3">
                <MapPin />
                <span>Douala, Cameroon</span>
              </div>
            </div>
          </div>
          {/* Right Div */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="bg-white  mt-12 flex flex-col gap-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-gray-400 block"
                  >
                    Votre Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-300 outline-none py-2 px-2 text-lg bg-transparent"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-400 block"
                  >
                    Votre Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border-b border-gray-300 outline-none py-2 px-2 text-lg bg-transparent"
                    autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="text-sm font-semibold text-gray-400 block"
                >
                  Votre Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-b border-gray-300 outline-none py-2 px-2 text-lg bg-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-[#2E7D32] mb-1 block"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Écrivez votre message ici"
                  rows={3}
                  className="w-full border-b border-[#2E7D32] outline-none py-2 px-2 text-base bg-transparent resize-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="py-3 px-5 mt-6 bg-[#2E7D32] hover:bg-[#2E7D32] text-[.9rem] text-white rounded font-semibold text-lg transition"
                >
                  Envoyer le Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
