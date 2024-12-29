"use client"
import { motion } from "framer-motion";
import { Heart, Home, MessageCircle, Baby, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold text-pink-600">MomCare</span>
          </motion.div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <NavLink icon={<Home size={18} />} text="Home" />
              <NavLink icon={<MessageCircle size={18} />} text="Consultation" />
              <NavLink icon={<Baby size={18} />} text="Baby Development" />
              <NavLink icon={<Heart size={18} />} text="Health Tips" />
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink icon={<Home size={18} />} text="Home" />
            <MobileNavLink icon={<MessageCircle size={18} />} text="Consultation" />
            <MobileNavLink icon={<Baby size={18} />} text="Baby Development" />
            <MobileNavLink icon={<Heart size={18} />} text="Health Tips" />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

const NavLink = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.a
    whileHover={{ scale: 1.05 }}
    className="flex items-center space-x-1 text-gray-700 hover:text-pink-600"
    href="#"
  >
    {icon}
    <span>{text}</span>
  </motion.a>
);

const MobileNavLink = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <motion.a
    whileHover={{ scale: 1.05 }}
    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-pink-600 hover:bg-pink-50"
    href="#"
  >
    {icon}
    <span>{text}</span>
  </motion.a>
);

export default Navbar;