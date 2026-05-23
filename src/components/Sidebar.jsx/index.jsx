import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LogoutModal from "../LogoutModal";
import { useTheme } from "../../utils/ThemeProvider";
import { useToast } from "../../utils/ToastContext";

function Sidebar({ navigation, toggleSidebar, isCollapsed }) {
  const location = useLocation();
  const { resetTheme, logo } = useTheme();
  const [openMenus, setOpenMenus] = useState({});
  const displayName = localStorage.getItem("dashboardName") || "Admin";
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Handle Sub-menu Toggle
  const toggleSubMenu = (menuName) => {
    if (isCollapsed) return; // Prevent expansion if sidebar is mini
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    try {
      // 1️⃣ CALL THE BACKEND: Direct fetch to Django backend
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you use token auth in Django, pass it here so the server knows who is logging out
          "Authorization": `Token ${localStorage.getItem("token")}` 
        },
      });

      showToast({
        title: "Success",
        message: "Logout successful!",
        type: "success",
      });
    } catch (error) {
      console.error(
        "Logout API failed, but clearing local state anyway.",
        error,
      );
    } finally {
      // 2️⃣ CLEAR LOCAL STORAGE: Remove UI-specific hints
      localStorage.removeItem("role");
      localStorage.removeItem("dashboardName");
      localStorage.removeItem("adminSelection");
      localStorage.removeItem("token"); // Ensure token is cleared just in case

      // 3️⃣ REDIRECT: Send user back to landing/login
      navigate("/");
    }
  };

  // Dynamic Tailwind Classes
  const sidebarWidthClass = isCollapsed ? "w-0 sm:lg:w-20" : "lg:w-64";
  const logoTextVisibility = isCollapsed ? "hidden" : "inline";
  const navItemTextVisibility = isCollapsed ? "hidden" : "block";

  return (
    <div
      className={`fixed right-0 z-30 bg-white h-full lg:inset-y-0 sm:relative sm:left-0 flex ${sidebarWidthClass} lg:flex-col transition-all duration-300 ease-in-out`}
    >
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <div className="flex flex-col flex-grow bg-[var(--color-bg-2)] border-r border-white shadow-sm overflow-x-hidden">
        {/* Header/Logo Section */}
        <div className="flex h-20 items-center px-4 border-b border-gray-200 justify-between">
          <div className="flex items-center gap-2">
            <img
              onClick={toggleSidebar}
              src={logo ? logo : "/medlock.png"}
              className="h-12 w-13 flex-shrink-0 hover:scale-105 cursor-pointer transition-transform"
              alt="Logo"
            />
            <h1
              className={`text-2xl font-bold text-primary ${logoTextVisibility} whitespace-nowrap`}
            >
              Medlock
            </h1>
          </div>

          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-full text-[var(--icon-color)] hover:bg-[var(--nav-button-hover-bg)] transition-colors ${logoTextVisibility}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`h-6 w-6 transform transition-transform duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
            >
              <path
                fillRule="evenodd"
                d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* User Info Section */}
        <div className="border-b flex gap-2 items-center border-gray-200 px-4 py-3">
          <div className="bg-secondary text-white p-3 w-fit rounded-full border border-transparent flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className={`${navItemTextVisibility} overflow-hidden`}>
            <span className="text-lg font-bold truncate block">
              {displayName}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openMenus[item.name];
            const isActive =
              location.pathname === item.href ||
              item.subItems?.some((s) => location.pathname === s.href);

            return (
              <div key={index} className="space-y-1">
                {hasSubItems ? (
                  // Item with Sub-menu
                  <Link
                    to={item.subItems[0].href}
                    onClick={() => toggleSubMenu(item.name)}
                    className={`group flex items-center w-full p-3 text-sm font-medium rounded-md transition-all hover:bg-primary ${
                      isActive ? "bg-primary text-white" : "text-black"
                    } ${isCollapsed ? "justify-center" : "justify-between"}`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"} `}
                      />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    )}
                  </Link>
                ) : (
                  // Simple Link
                  <Link
                    to={item.href}
                    className={`group flex items-center p-3 text-sm font-medium rounded-md transition-all ${isActive ? "bg-primary   text-white" : "hover:bg-secondary text-black"} ${isCollapsed ? "justify-center" : ""}`}
                  >
                    <item.icon
                      className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )}

                {/* Sub-menu Items Rendering */}
                {hasSubItems && isOpen && !isCollapsed && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 transition-all">
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className={`flex items-center p-2 text-sm rounded-md transition-all ${isSubActive ? "text-white font-bold bg-secondary" : "text-gray-500 hover:bg-gray-100 hover:text-black"}`}
                        >
                          <sub.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer: Theme & Logout */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center p-3 text-sm font-medium transition-colors hover:bg-red-50 text-red-600 ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;