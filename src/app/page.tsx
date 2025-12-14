'use client'

import AboutUs from '@/components/HomeComponents/AboutUs'
import ContactUs from '@/components/HomeComponents/ContactUs'
import HealthCenter from '@/components/HomeComponents/HealthCenter'
import Hero from '@/components/HomeComponents/Hero'
import Testimonials from '@/components/HomeComponents/Testimonials'
import Navbar from '@/components/NavbarComponents/Navbar'
// import Image from 'next/image'
// import Link from 'next/link'


const page = () => {
  return (
    <>

      <main className='md:mx-15 relative'>
        <Navbar/>

        {/* Hero Section */}
        <section id='home' className='lg:mt-5 relative'>
          <Hero/>
        </section>

        {/* AboutUs Section */}
        <section id='aboutUs' className='mt-[3.5rem] lg:mt-[12rem]'>
          <AboutUs/>
        </section>

        {/* HealthCenter Section */}
        <section id='healthCenter' className='mt-[5rem]'>
          <HealthCenter/>
        </section>

        {/* Testimonial Section */}
        <section id='testimonials' className='mt-[5rem]'>
          <Testimonials/>
        </section>

        {/* ContactUs Section */}
        <section id='contactUs' className='my-[5rem]'>
          <ContactUs/>
        </section>

      </main>


    </>
  )
}

export default page
