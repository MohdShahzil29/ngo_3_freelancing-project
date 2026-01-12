import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">SM</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">Star Marketing</span>
            </div>
            <p className="text-stone-400 text-sm">
              एक बेहतर कल के लिए साथ मिलकर काम करते हैं
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/services" className="hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/campaigns" className="hover:text-primary transition-colors">
                Campaigns
              </Link>
              <Link to="/events" className="hover:text-primary transition-colors">
                Events
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Get Involved</h3>
            <div className="flex flex-col space-y-2">
              <Link to="/donate" className="hover:text-primary transition-colors">
                Donate Now
              </Link>
              <Link to="/register" className="hover:text-primary transition-colors">
                Become a Member
              </Link>
              <Link to="/events" className="hover:text-primary transition-colors">
                Volunteer
              </Link>
              <Link to="/contact" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Contact</h3>
            <div className="flex flex-col space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>Sikar, Rajasthan, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} className="flex-shrink-0" />
                <span>90245 48020</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} className="flex-shrink-0" />
                <span>info@starmarketing.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm text-stone-400">
          <p>&copy; {new Date().getFullYear()} Star Marketing. All rights reserved.</p>
          <p className="mt-2">
            Developed by{' '}
            <a
              href="https://www.wingstarnarketing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Star Marketing
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;