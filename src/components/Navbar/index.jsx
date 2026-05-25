import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const nav = [
  {
    id: 1,
    link: "/",
    name: "Home",
  },
  {
    id: 2,
    link: "/features",
    name: "Features",
  },
  {
    id: 3,
    link: "/plugins",
    name: "Plugins",
  },
  {
    id: 4,
    link: "/pricing",
    name: "Pricing",
  },
  {
    id: 5,
    link: "/solutions",
    name: "Solutions",
  },
  {
    id: 6,
    link: "/about",
    name: "About",
  },
  {
    id: 7,
    link: "/contact",
    name: "Contact",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="w-full sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          onClick={isMenuOpen ? toggleMenu : undefined}
        >
          <div className="h-14 w-14 flex items-center justify-center">
            <img
              src="/medlock.png"
              className="h-12 w-12 object-contain"
              alt="MedLock Logo"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">
              MedLock
            </h1>

            <p className="text-xs tracking-wide text-[var(--color-card-secondary-text)]">
              Healthcare CRM Infrastructure
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 font-medium">
          {nav.map((page) => (
            <Link
              key={page.id}
              to={page.link}
              className={`transition-all duration-200 hover:text-[var(--color-hover)]
                ${
                  location.pathname === page.link
                    ? "text-[var(--color-hover)]"
                    : "text-[var(--color-text)]"
                }`}
            >
              {page.name}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="text-[var(--color-text)] hover:text-[var(--color-hover)] transition duration-200"
          >
            Login
          </Link>

          <Link
            to="/demo"
            className="bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-xl hover:bg-[var(--color-hover)] transition duration-300 shadow-md"
          >
            Request Demo
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-[var(--color-text)]"
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[var(--color-bg)]/95 backdrop-blur-md">
          <div className="flex flex-col px-6 py-6 gap-5">
            
            {nav.map((page) => (
              <Link
                key={page.id}
                to={page.link}
                onClick={toggleMenu}
                className={`text-lg transition duration-200
                  ${
                    location.pathname === page.link
                      ? "text-[var(--color-hover)]"
                      : "text-[var(--color-text)]"
                  }`}
              >
                {page.name}
              </Link>
            ))}

            {/* Mobile Buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <Link
                to="/login"
                onClick={toggleMenu}
                className="w-full border border-[var(--color-primary)] text-[var(--color-text)] py-3 rounded-xl text-center hover:bg-[var(--color-primary)] hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/demo"
                onClick={toggleMenu}
                className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl text-center hover:bg-[var(--color-hover)] transition"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;