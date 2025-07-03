"use client"
import {  LayoutDashboard,  LogOut, Upload, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'; // Hamburger and close icons

const Header = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  // Close the menu when a button is clicked in mobile view
  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="text-white shadow-md py-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">

        <div className="container flex justify-between items-center mx-auto">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-3xl font-semibold tracking-tight">Reels
              <span className="text-blue-700">Pro</span>
            </h1>
          </Link>

          {/* Hamburger Menu Icon (Visible on small screens) */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              <FaBars size={30} />
            </button>
          </div>

          {/* Desktop Menu (Visible on medium and larger screens) */}
          <div className="hidden md:flex items-center space-x-4">
            {session?.user ? (
              <div className="flex items-center space-x-4">
                <div className='flex flex-row justify-center items-center space-x-2'>
                  <User className="w-5 h-5" />
                  <span className="text-lg text-white">{session.user?.email?.split("@")[0]}</span>
                </div>
                <Link href="/dashboard">
                  <div className="flex flex-row justify-center items-center space-x-2">
                    <LayoutDashboard className="w-5 h-5" />
                    <p>Dashboard</p>
                  </div>
                </Link>
                <Link href="/upload">
                  <div className="flex flex-row justify-center items-center space-x-2">
                    <Upload className='w-5 h-5' />
                    <p>Upload Video</p>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                >
                  <div className='flex flex-row justify-center items-center space-x-2'>
                    <LogOut className='w-5 h-5' />
                    Sign out
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login">
                  <button className="bg-blue-700  py-2 px-6 rounded-md transition duration-300">
                    Login
                  </button>
                </Link>
                <Link href="/register">
                  <button className="text-black bg-white border py-2 px-6 rounded-md transition duration-300">
                    Register
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu (Visible on small screens) */}
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-transform transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex justify-end p-4">
              <button onClick={toggleMenu}>
                <FaTimes size={30} className="text-white" />
              </button>
            </div>
            <div className="flex flex-col justify-center items-center space-y-4 text-lg">
              {session?.user ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className='flex flex-row items-center justify-center space-x-2' onClick={closeMenu}>
                    <User className="w-5 h-5" />
                    <span className="text-lg text-white"> {session.user?.email?.split("@")[0]}</span>
                  </div>
                  <div className='flex flex-row justify-center items-center space-x-2' onClick={closeMenu}>
                    <Link href="/dashboard">
                      <div className='flex flex-row justify-center items-center space-x-2' onClick={closeMenu}>
                        <LayoutDashboard className="w-5 h-5" />
                        <p>Dashboard</p>
                      </div>
                    </Link>
                  </div>
                  <div className='flex flex-row justify-center items-center space-x-2' onClick={closeMenu}>
                    <Link href="/upload">
                      <div className='flex flex-row justify-center items-center space-x-2' onClick={closeMenu}>
                        <Upload className='w-5 h-5' />
                        <p>Upload Video</p>
                      </div>
                    </Link>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    <div className='flex flex-row justify-center items-center space-x-2'>
                      <LogOut className='w-5 h-5' />
                      Sign out
                    </div>
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <button onClick={closeMenu} className="bg-blue-700  text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300">
                      Login
                    </button>
                  </Link>
                  <Link href="/register">
                    <button onClick={closeMenu} className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-700 transition duration-300">
                      Register
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;

