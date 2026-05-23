import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
// import { useLocation } from "react-router-dom";

const nav = [
  {
    id: 1,
    link: "/",
    name: "Home",
  },
  {
    id: 2,
    link: "/services",
    name: "Services",
  },
  {
    id: 3,
    link: "/about",
    name: "About Us",
  },
  {
    id: 4,
    link: "/contact",
    name: "Contact",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "");
  const location = useLocation();

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleTheme = () => {
    setTheme(theme === "theme-dark" ? "" : "theme-dark");
  };
  // Apply theme globally
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const getLogoSrc = () => {
    if (theme === "theme-dark") {
      return "/home-logo.png";
    }
    return "/medlock.png";
  };

  return (
    <nav className="w-full bg-[var(--color-bg)] sticky shadow-[var(--color-shadow)] z-50 top-0">
      <div className="w-full mx-auto px-6 py-4 flex items-center justify-between bg-[var(--color-bg)]">
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={isMenuOpen ? toggleMenu : undefined}
        >
          <div className="flex items-center ">
            <div className="h-25 w-23 flex items-center justify-center">
              <img
                src={theme == "theme-dark" ? "/home-logo.png" : "/medlock.png"}
                className={theme == "theme-dark" ? "h-17 w-18" : "h-20 w-20"}
                alt="MedLock Logo"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                MedLock
              </h1>
              <p className="text-xs text-[var(--color-card-secondary-text)]">
                Centralized Medical Reports
              </p>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 font-medium">
          {nav?.map((page, index) => (
            <Link
              to={page.link}
              key={index}
              className={` ${
                location.pathname == page.link
                  ? "text-[var(--color-hover)]"
                  : "text-[var(--color-text)]"
              } hover:text-[var(--color-hover)] transition-colors duration-200`}
            >
              {page.name}
            </Link>
          ))}
          {/* <button
            onClick={toggleTheme}
            className="p-2 rounded-xl cursor-pointer bg-[var(--color-primary)] text-white flex items-center justify-center transition-colors duration-200"
          >
            {" "}
            {theme === "theme-dark" ? (
              <h1>Dark</h1>
            ) : (
              // <FaSun className="w-5 h-5" />
              <h1>Light</h1>
              // <FaMoon className="w-5 h-5" />
            )}
          </button> */}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-[var(--color-text)]"
        >
          {isMenuOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--color-bg)] shadow-lg py-4 transition-all duration-300 transform origin-top">
          <div className="flex flex-col items-center space-y-4">
            {nav.map((page, index) => (
              <Link
                to={page.link}
                key={index}
                onClick={toggleMenu}
                className="hover:text-[var(--color-hover)] transition-colors duration-200 text-lg text-[var(--color-text)]"
              >
                {page.name}
              </Link>
            ))}

            {/* Theme Selector in Mobile */}
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-full cursor-pointer bg-[var(--color-primary)] text-white flex items-center justify-center"
            >
              {theme === "theme-dark" ? (
                <h1>Dark</h1>
              ) : (
                // <FaSun className="w-5 h-5" />
                <h1>Light</h1>
                // <FaMoon className="w-5 h-5" />
              )}
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
