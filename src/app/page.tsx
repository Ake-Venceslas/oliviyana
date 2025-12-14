'use client'

import AboutUs from '@/components/HomeComponents/AboutUs'
import ContactUs from '@/components/HomeComponents/ContactUs'
import HealthCenter from '@/components/HomeComponents/HealthCenter'
import Hero from '@/components/HomeComponents/Hero'
import Testimonials from '@/components/HomeComponents/Testimonials'
import Navbar from '@/components/NavbarComponents/Navbar'


const page = () => {
  return (
    <>
      <main className='w-full relative pt-20'>
        <Navbar/>

        {/* Hero Section */}
        <section id='home' className='relative pt-8 lg:pt-12'>
          <Hero/>
        </section>

        {/* AboutUs Section */}
        <section id='aboutUs' className='mt-8 sm:mt-12 lg:mt-20'>
          <AboutUs/>
        </section>

        {/* HealthCenter Section */}
        <section id='healthCenter' className='mt-8 sm:mt-12 lg:mt-16 px-4 sm:px-6 lg:px-0'>
          <HealthCenter/>
        </section>

        {/* Testimonial Section */}
        <section id='testimonials' className='mt-8 sm:mt-12 lg:mt-16'>
          <Testimonials/>
        </section>

        {/* ContactUs Section */}
        <section id='contactUs' className='my-8 sm:my-12 lg:my-16'>
          <ContactUs/>
        </section>

      </main>
    </>
  )
}

export default page
