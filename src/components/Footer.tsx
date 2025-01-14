// Footer.tsx
"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <footer className="bg-white border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div {...fadeIn} className="space-y-6">
            <div className="flex items-center">
              <Image
                src="/images/logo-pregnacare.png"
                alt="PregnaCare"
                width={100}
                height={100}
              />
              <h3 className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                PregnaCare
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Supporting mothers through their pregnancy journey with expert guidance and comprehensive care solutions.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div {...fadeIn} className="space-y-6">
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

          {/* Contact Info */}
          <motion.div {...fadeIn} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Contact Us</h3>
            <div className="space-y-4 text-gray-600">
              <p className="flex items-center space-x-3">
                <span className="text-purple-500">📧</span>
                <span>intechofficialteam@gmail.com</span>
              </p>
              <p className="flex items-center space-x-3">
                <span className="text-purple-500">📱</span>
                <span>+62 812-278408422</span>
              </p>
              <p className="flex items-center space-x-3">
                <span className="text-purple-500">📍</span>
                <span>Purwokerto, Banyumas Indonesia</span>
              </p>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div {...fadeIn} className="space-y-6">
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
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Social Media & Copyright */}
        <div className="mt-12 pt-8 border-t border-purple-100">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6">
              {[FaFacebook, FaTwitter, FaInstagram, FaYoutube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -3 }}
                  className="text-purple-400 hover:text-purple-600 transition-colors"
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PregnaCare. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;