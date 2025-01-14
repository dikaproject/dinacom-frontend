// Navbar.tsx
"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN':
        return '/admin';
      case 'DOCTOR':
        return '/doctor/dashboard';
      case 'USER':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  };

  const navItems = [
    { title: 'Home', href: '/' },
    { title: 'Diagnose', href: '/diagnosa' },
    { title: 'Consultation', href: '/konsultasi' },
    { title: 'PregnaAi', href: '/pregna' },
    { title: 'PregnaShop', href: '/pregnashop' },

  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-lg backdrop-blur-sm' 
          : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - adjusted for mobile */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex-shrink-0 flex items-center space-x-2"
            >
              <Image
                src="/images/logo-pregnacare.png"
                alt="PregnaCare Logo"
                width={100}
                height={100}
                className="cursor-pointer md:w-[130px] md:h-[130px]"
              />
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                PregnaCare
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link
                  href={item.href}
                  className={`text-gray-600 hover:text-purple-600 font-medium transition-colors ${
                    pathname === item.href ? 'text-purple-600' : ''
                  }`}
                >
                  {item.title}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            <Link href="/cart">
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>
            </Link>

            {user ? (
              <div className="flex items-center space-x-3 ml-4">
                <Link href={getDashboardLink()}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-white">Dashboard</span>
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={logout}
                  className="flex items-center space-x-2 bg-white border-2 border-red-500 text-red-500 px-5 py-2 rounded-full font-medium hover:bg-red-50 transition-all"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </motion.button>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-white">Login</span>
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button - adjusted styling */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - improved animation and styling */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-white border-t"
          >
            <div className="px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.title} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="block px-4 py-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    {item.title}
                  </motion.div>
                </Link>
              ))}
              
              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Cart</span>
                </motion.div>
              </Link>

              {user ? (
                <>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 px-4 py-2.5 text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-white">Dashboard</span>
                    </motion.div>
                  </Link>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2.5 text-red-500 border-2 border-red-500 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <Link 
                  href="/login"
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-white">Login</span>
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;