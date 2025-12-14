'use client'

import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '../ui/button';
import { Headset, House, LogIn, Menu, ScrollText, UserRoundCheck, Users } from 'lucide-react'
import NavLink from './NavLink';



const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [containerRef]);

    const buttonVariants = {
        initial: {
        opacity: 0,
        y: 0
        },
        animate: {
        opacity: 1,
        scale: 1,
        },
        exit: {
        opacity: 0,
        y: 1
        }
    };

  return (
    <div>
      
      {/* Desktop View */}
      <section id='desktop-navbar' className='bg-white z-10 hidden lg:flex justify-between items-center py-4 px-6 border-b-2 fixed top-0 left-0 right-0'>
        {/* Logo Section */}
            <Link href={'/'}>
              <Image 
                src='/logo 2.png' 
                alt='Logo' 
                width={70} 
                height={24}
                className='w-auto h-auto'
              />
            </Link>
        {/* Logo Section */}

        {/* Nav-links Section */}
        <div className='flex gap-6 lg:gap-8 items-center'>
            <ul className='flex gap-6 lg:gap-8 text-gray-600 font-medium text-sm lg:text-base'>
                <li><NavLink className='' href={'#home'}>Accueil</NavLink></li>
                <li><NavLink className='' href={'#aboutUs'}>À Propos</NavLink></li>
                <li><NavLink className='' href={'#healthCenter'}>Hôpitaux</NavLink></li>
                <li><NavLink className='' href={'#testimonials'}>Témoignages</NavLink></li>
                <li><NavLink className='' href={'#contactUs'}>Nous Contacter</NavLink></li>
            </ul>

            <div className='flex gap-3 lg:gap-4 items-center'>
                <Link href={'/login'} className='text-sm lg:text-base hover:text-[#2E7D32] transition'>Connexion</Link>
                <Link className='bg-default rounded-lg py-2 px-4 text-white text-sm lg:text-base hover:bg-[#1B5E20] transition' href={'/register'}>S&apos;inscrire</Link>
            </div>
        </div>
        {/* Nav-links Section */}
      </section>



      {/* Mobile View */}
      <section ref={containerRef}  className='bg-default lg:hidden fixed bottom-0 left-0 right-0 z-20'>
        <div ref={containerRef} className='relative'>
            <AnimatePresence initial={false}>
                {isOpen ? (
                    <motion.div
                        className="absolute bottom-[4rem] left-0 right-4 grid gap-y-2 justify-end"
                        variants={buttonVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                    >
                        <Link href={'/login'} className='flex gap-x-2 items-center py-2 px-4 bg-white text-gray-600 font-medium text-xs sm:text-sm rounded-lg shadow-md hover:bg-gray-100 transition'>
                            <UserRoundCheck size={16}/>
                            Se Connecter
                        </Link>
                        <Link href={'/register'} className='flex gap-x-2 items-center py-2 px-4 bg-white text-gray-600 font-medium text-xs sm:text-sm rounded-lg shadow-md hover:bg-gray-100 transition'>
                            <LogIn size={16}/>
                            S&apos;inscrire
                        </Link>
                    </motion.div>
                ) : null }
            </AnimatePresence>
            <ul className='flex px-2 justify-between items-center text-gray-300 text-xs font-medium gap-1'>
                <li>
                    <NavLink className='flex flex-col items-center gap-1' href={'#home'}>
                        <div><House size={18}/></div>
                        <p className='text-[0.65rem]'>Accueil</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink className='flex flex-col items-center gap-1' href={'#aboutUs'}>
                        <div><Users size={18}/></div>
                        <p className='text-[0.65rem]'>À Propos</p>
                    </NavLink>
                </li>
                
                <li>
                    <NavLink className='flex flex-col items-center gap-1' href={'#healthCenter'}>
                        <div><ScrollText size={18}/></div>
                        <p className='text-[0.65rem]'>Hôpitaux</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink className='flex flex-col items-center gap-1' href={'#contactUs'}>
                        <div><Headset size={18}/></div>
                        <p className='text-[0.65rem]'>Nous Contacter</p>
                    </NavLink>
                </li>
                <li><Button
                        onClick={toggleMenu}
                        className='relative rounded-full bg-white shadow-lg w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition'
                    >
                        <Menu size={20} color='gray'/>
                    </Button>
                </li>
            </ul>
        </div>
      </section>

      {/* Mobile Header View */}
      <div className='bg-white border-b flex lg:hidden justify-center items-center py-3 fixed top-0 left-0 right-0 z-20'>
        <Image 
          src='/logo 2.png' 
          alt='Logo' 
          width={65} 
          height={22}
          className='w-auto h-auto'
        />
      </div>

    </div>
  )
}

export default Navbar
