// Footer.tsx
"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import Image from 'next/image';

const Footer = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <footer className="bg-white pt-20 pb-8">
      {/* Wave Separator */}
      <div className="wave-separator">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#F5F3FF"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info Section */}
          <motion.div {...fadeIn} className="space-y-5">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="PregnaCare"
                width={40}
                height={40}
              />
              <h3 className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                PregnaCare
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Dedicated to supporting mothers through their pregnancy journey with
              expert guidance and comprehensive care solutions.
            </p>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div {...fadeIn} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Diagnosa', 'Konsultasi', 'About Us'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info Section */}
          <motion.div {...fadeIn} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <div className="space-y-3 text-gray-600">
              <p className="flex items-center">
                <span className="mr-2">📧</span> contact@pregnacare.com
              </p>
              <p className="flex items-center">
                <span className="mr-2">📱</span> (021) 555-0123
              </p>
              <p className="flex items-center">
                <span className="mr-2">📍</span> Jl. Kesehatan No. 123, Jakarta
              </p>
            </div>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div {...fadeIn} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800">Newsletter</h3>
            <p className="text-gray-600">
              Get weekly pregnancy tips and updates.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Media Links */}
        <motion.div
          {...fadeIn}
          className="mt-16 pt-8 border-t border-purple-100"
        >
          <div className="flex justify-center space-x-8">
            {[
              { Icon: FaFacebook, link: '#' },
              { Icon: FaTwitter, link: '#' },
              { Icon: FaInstagram, link: '#' },
              { Icon: FaYoutube, link: '#' },
            ].map(({ Icon, link }, index) => (
              <motion.a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="text-purple-400 hover:text-purple-600 transition-colors"
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} PregnaCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;