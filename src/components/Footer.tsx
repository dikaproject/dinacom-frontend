"use client"
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-pink-600">MomCare</h3>
            <p className="text-gray-600">Supporting healthy pregnancies with AI-powered care.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-pink-600">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-pink-600">AI Consultation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600">Expert Connect</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600">Health Tracking</a></li>
              <li><a href="#" className="text-gray-600 hover:text-pink-600">Resources</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">support@momcare.com</li>
              <li className="text-gray-600">+1 234 567 890</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 flex items-center justify-center">
            Made with <Heart size={16} className="mx-1 text-pink-600" /> by MomCare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;