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
      <section id='desktop-navbar' className='bg-white z-10 hidden lg:flex justify-between items-center py-5 border-y-2 fixed top-0 left-[3.75rem] right-[3.75rem]'>
        {/* Logo Section */}
            <Link href={'/'}>
              <Image 
                src='/logo 2.png' 
                alt='Logo' 
                width={80} 
                height={27}
              />
            </Link>
        {/* Logo Section */}

        {/* Nav-links Section */}
        <div className='flex gap-x-[2rem] items-center'>
            <ul className='flex gap-x-[2rem] text-gray-600 font-medium'>
                <li><NavLink className='' href={'#home'}>Accueil</NavLink></li>
                <li><NavLink className='' href={'#aboutUs'}>À Propos</NavLink></li>
                <li><NavLink className='' href={'#healthCenter'}>Hôpitaux</NavLink></li>
                <li><NavLink className='' href={'#testimonials'}>Témoignages</NavLink></li>
                <li><NavLink className='' href={'#contactUs'}>Nous Contacter</NavLink></li>
            </ul>

            <div className='flex gap-x-[1rem] items-center'>
                <Link href={'/login'}>Connexion</Link>
                <Link className='bg-default rounded-sm py-2 px-4 text-white' href={'/register'}>S'inscrire</Link>
            </div>
        </div>
        {/* Nav-links Section */}
      </section>



      {/* Mobile View */}
      <section ref={containerRef}  className='bg-default lg:hidden fixed bottom-0 left-0 right-0 pl-5 z-20'>
        <div ref={containerRef} className='relative'>
            <AnimatePresence initial={false}>
                {isOpen ? (
                    <motion.div
                        className="absolute bottom-[5.5rem] left-0 right-4 grid gap-y-1 justify-end"
                        variants={buttonVariants}
                        initial='initial'
                        animate='animate'
                        exit='exit'
                    >
                        {/* <Button className='bg-white text-gray-600 font-medium text-[.7rem] shadow-md'>
                            <MessageSquareQuote/>
                            Témoignages
                        </Button> */}
                        <Link href={'#'} className='flex gap-x-3 items-center py-2 px-4 bg-white text-gray-600 font-medium text-[.7rem] rounded-md shadow-md'>
                            <UserRoundCheck/>
                            Se Connecter
                        </Link>
                        <Link href={'#'} className='flex gap-x-3 items-center py-2 px-4 bg-white text-gray-600 font-medium text-[.7rem] rounded-md shadow-md'>
                            <LogIn/>
                            S'inscrire
                        </Link>
                    </motion.div>
                ) : null }
            </AnimatePresence>
            <ul className='flex px-1 justify-between items-center text-gray-300 text-[.6rem] font-medium'>
                <li>
                    <NavLink className='flex flex-col items-center' href={'#home'}>
                        <div><House width={17}/></div>
                        <p>Accueil</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink className='flex flex-col items-center' href={'#aboutUs'}>
                        <div><Users width={17}/></div>
                        <p>À Propos</p>
                    </NavLink>
                </li>
                
                <li>
                    <NavLink className='flex flex-col items-center' href={'##healthCenter'}>
                        <div><ScrollText width={17}/></div>
                        <p>Hôpitaux</p>
                    </NavLink>
                </li>
                <li>
                    <NavLink className='flex flex-col items-center' href={'#contactUs'}>
                        <div><Headset width={17}/></div>
                        <p>Nous Contacter</p>
                    </NavLink>
                </li>
                <li><Button
                        onClick={toggleMenu}
                        className='relative bottom-6 rounded-full bg-white shadow-xl/30 w-[3rem] h-[3rem]'
                    >
                        <Menu color='gray'/>
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
          width={70} 
          height={24}
        />
      </div>

    </div>
  )
}

export default Navbar
