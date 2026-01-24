import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://customer-assets.emergentagent.com/job_ngoboost/artifacts/oauqu6j1_IMG-20260110-WA0009.jpg"
                alt="NVP Welfare Foundation India"
                className="h-10 w-10 object-contain bg-white rounded-full p-1"
              />
              <span className="font-heading font-bold text-lg text-white">
                NVP Welfare Foundation
              </span>
            </div>
            <p className="text-stone-400 text-sm">
              एक बेहतर कल के लिए साथ मिलकर काम करते हैं
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/profile.php?id=61569841799395"
                className="hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/n_v_p_welfare_foundation_india"
                className="hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/@nvpwfoundationindia"
                className="hover:text-primary transition-colors"
              >
                <Youtube size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/about"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/services"
                className="hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                to="/campaigns"
                className="hover:text-primary transition-colors"
              >
                Campaigns
              </Link>
              <Link
                to="/events"
                className="hover:text-primary transition-colors"
              >
                Events
              </Link>
            </div>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Get Involved
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/donate"
                className="hover:text-primary transition-colors"
              >
                Donate Now
              </Link>
              <Link
                to="/register"
                className="hover:text-primary transition-colors"
              >
                Become a Member
              </Link>
              <Link
                to="/events"
                className="hover:text-primary transition-colors"
              >
                Volunteer
              </Link>
              <Link
                to="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">
              Contact
            </h3>
            <div className="flex flex-col space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span>
                  नारायण निवास, बजरंग नगर, मोड़ा बालाजी रोड, दौसा, राजस्थान –
                  303303
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} className="flex-shrink-0" />
                <span>78776 43155</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} className="flex-shrink-0" />
                <span>nvpwfoundationindia@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800 mt-8 pt-6 text-center text-sm text-stone-400 space-y-2">
          <p>
            &copy; {new Date().getFullYear()} NVP Welfare Foundation India. All
            rights reserved.
          </p>
          <p className="text-stone-500">
            Developed &amp; Designed by{" "}
            <a
              href="https://wingstarnarketing.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-medium hover:text-primary transition-colors"
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
