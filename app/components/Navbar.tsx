'use client';
import React, { useState} from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, LogOut, Upload, User, Menu, X,  Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


const NavBar = () => {
  const { data: session } = useSession();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathName = usePathname();
  const isAuthPage = pathName === '/login' || pathName === '/register';
  const isAppPage= pathName === '/dashboard' || pathName === '/upload';
  const { toast } = useToast();


  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out.',
        variant: 'success',
      })
      
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md transition-all duration-300 shadow-lg"
      style={{ position: 'fixed' }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-4 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-white">
          <Play className="h-6 w-6 text-reelspro-blue mr-2" fill="#4CC9F0" />
          <span className="text-xl font-bold">
            Reels<span className="text-reelspro-cyan">Pro</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-white/80">
          {!isAuthPage && !isAppPage && (
            <>
              <Link href="#features" className="hover:text-reelspro-blue transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="hover:text-reelspro-blue transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="hover:text-reelspro-blue transition-colors">
                About
              </Link>
              <Link href="#contact" className="hover:text-reelspro-blue transition-colors">
                Contact
              </Link>
            </>
          )}

          {session?.user && (
            <>
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 hover:text-reelspro-blue transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
              </Link>
              <Link
                href="/upload"
                className="flex items-center space-x-2 hover:text-reelspro-blue transition-colors"
              >
                <Upload className="w-5 h-5" /> <span>Upload Video</span>
              </Link>
            </>
          )}
        </div>

        {/* Auth buttons / User info */}
        <div className="hidden md:flex items-center space-x-4 text-white">
          {session?.user ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span className="font-semibold capitalize">{session.user.email?.split('@')[0]}</span>
              </div>
              <Button onClick={handleSignOut} className="bg-reelspro-blue/50">
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4" /> <span>Sign Out</span>
                </div>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="text-white bg-gradient-to-r from-reelspro-blue/70 to-reelspro-blue/40">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-reelspro-pink/50 to-reelspro-purple/40 hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white focus:outline-none z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          style={{ position: 'relative', zIndex: 100 }}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-black/70 shadow-lg border-t border-white/10 absolute left-0 right-0 overflow-hidden transition-max-height duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen p-4' : 'max-h-0 p-0'
        }`}
        style={{ top: '60px', zIndex: 40 }}
      >
        {!isAuthPage && !isAppPage && (
          <>
            <Link
              href="#features"
              className="block text-white/80 hover:text-reelspro-blue py-2"
              onClick={closeMobileMenu}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block text-white/80 hover:text-reelspro-blue py-2"
              onClick={closeMobileMenu}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="block text-white/80 hover:text-reelspro-blue py-2"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="block text-white/80 hover:text-reelspro-blue py-2"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </>
        )}

        {session?.user && (
          <>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-white/80 hover:text-reelspro-blue py-2"
              onClick={closeMobileMenu}
            >
              <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
            </Link>
            <Link
              href="/upload"
              className="flex items-center space-x-2 text-white/80 hover:text-reelspro-blue py-2"
              onClick={closeMobileMenu}
            >
              <Upload className="w-5 h-5" /> <span>Upload Video</span>
            </Link>
          </>
        )}

        <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
          {session?.user ? (
            <Button
              onClick={() => {
                handleSignOut();
                closeMobileMenu();
              }}
              className="w-full"
            >
              <div className="flex items-center justify-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </div>
            </Button>
          ) : (

            <div className='flex gap-2'>
              <Link href="/login" onClick={closeMobileMenu}>
                <Button  className="text-white bg-gradient-to-r from-reelspro-blue/70 to-reelspro-blue/40">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={closeMobileMenu}>
                <Button className="bg-gradient-to-r from-reelspro-pink/50 to-reelspro-purple/40 hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
