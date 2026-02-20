
import { motion } from 'framer-motion';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🚗</span>
              <span className="text-2xl font-bold">RideRental</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner for bikes, cars, and hostels across India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/bikes" className="hover:text-white transition">Bikes</a></li>
              <li><a href="/cars" className="hover:text-white transition">Cars</a></li>
              <li><a href="/hostels" className="hover:text-white transition">Hostels</a></li>
              <li><a href="/about" className="hover:text-white transition">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
              <li><a href="/terms" className="hover:text-white transition">Terms</a></li>
              <li><a href="/privacy" className="hover:text-white transition">Privacy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@riderental.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Delhi, India</li>
            </ul>
            <div className="flex gap-4 mt-4">
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-blue-400">
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-pink-400">
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="hover:text-gray-400">
                <Github className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>© 2026 RideRental. All rights reserved. | Made with ❤️ in India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;