import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPending = user && user.role === "member" && user.is_active === false;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="https://customer-assets.emergentagent.com/job_ngoboost/artifacts/oauqu6j1_IMG-20260110-WA0009.jpg"
              alt="NVP Welfare Foundation India"
              className="h-12 w-12 object-contain"
            />
            <span className="font-heading font-bold text-lg sm:text-xl text-stone-900">
              NVP Welfare Foundation
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-stone-700 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-stone-700 hover:text-primary transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/services"
              className="text-stone-700 hover:text-primary transition-colors font-medium"
            >
              Services
            </Link>
            <Link
              to="/campaigns"
              className="text-stone-700 hover:text-primary transition-colors font-medium"
            >
              Campaigns
            </Link>
            <Link
              to="/events"
              className="text-stone-700 hover:text-primary transition-colors font-medium"
            >
              Events
            </Link>
            <Link
              to="/contact"
              className="text-stone-700 hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {!isPending && (
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin-dashboard"
                        : "/member-dashboard"
                    }
                    className="text-stone-700 hover:text-primary font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                {isPending && (
                  <Link
                    to="/pending-approval"
                    className="text-yellow-600 font-medium"
                  >
                    Pending Approval
                  </Link>
                )}

                <Button onClick={logout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Join Us</Button>
                </Link>
              </>
            )}

            <Link to="/donate">
              <Button
                className="bg-secondary hover:bg-secondary/90"
                data-testid="donate-nav-button"
              >
                Donate Now
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-stone-700 hover:text-primary">
                Home
              </Link>
              <Link to="/about" className="text-stone-700 hover:text-primary">
                About
              </Link>
              <Link
                to="/services"
                className="text-stone-700 hover:text-primary"
              >
                Services
              </Link>
              <Link
                to="/campaigns"
                className="text-stone-700 hover:text-primary"
              >
                Campaigns
              </Link>
              <Link to="/events" className="text-stone-700 hover:text-primary">
                Events
              </Link>
              <Link to="/contact" className="text-stone-700 hover:text-primary">
                Contact
              </Link>
              {user ? (
                <>
                  {!isPending && (
                    <Link
                      to={
                        user.role === "admin"
                          ? "/admin-dashboard"
                          : "/member-dashboard"
                      }
                    >
                      Dashboard
                    </Link>
                  )}

                  {isPending && (
                    <Link to="/pending-approval" className="text-yellow-600">
                      Pending Approval
                    </Link>
                  )}

                  <Button onClick={logout} variant="outline" className="w-full">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full">Join Us</Button>
                  </Link>
                </>
              )}

              <Link to="/donate">
                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
