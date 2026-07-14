import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, Search } from "lucide-react";
import LogoutModal from "../LogoutModal";
import { useTheme } from "../../utils/ThemeProvider";
import { useToast } from "../../utils/ToastContext";

function Sidebar({ navigation }) {
  const location = useLocation();
  const { logo } = useTheme();
  const [openMenus, setOpenMenus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const displayName = localStorage.getItem("dashboardName") || "Admin";
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // Handle Sub-menu Toggle
  const toggleSubMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      localStorage.removeItem("role");
      localStorage.removeItem("dashboardName");
      localStorage.removeItem("adminSelection");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // Filter navigation items based on search query string
  const filteredNavigation = navigation.map(item => {
    const matchParent = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter matching sub-items if they exist
    const filteredSubs = item.subItems?.filter(sub => 
      sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Keep the item if parent name matches OR any sub-items match
    if (matchParent || filteredSubs.length > 0) {
      return {
        ...item,
        // If parent matched but no sub-items matched text, keep original sub-items
        subItems: filteredSubs.length > 0 ? filteredSubs : item.subItems
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="fixed right-0 z-30 bg-white h-full lg:inset-y-0 sm:relative sm:left-0 flex lg:w-64 lg:flex-col transition-all duration-300 ease-in-out">
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
      <div className="flex flex-col flex-grow bg-[var(--color-bg-2)] border-r border-white shadow-sm overflow-x-hidden">
        
        {/* Header/Logo Section with Dynamic User Name */}
        <div className="flex h-20 items-center px-4 border-b border-gray-200">
          <div className="flex items-center gap-2 overflow-hidden w-full">
            <img
              src={logo ? logo : "/medlock.png"}
              className="h-12 w-13 flex-shrink-0 hover:scale-105 cursor-pointer transition-transform"
              alt="Logo"
            />
            <h1 className="text-xl font-bold text-primary truncate whitespace-nowrap pr-2">
              {displayName}
            </h1>
          </div>
        </div>

        {/* Navigation Live Search Bar */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-9 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 outline-none bg-white"
              placeholder="Search tabs..."
            />
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {filteredNavigation.map((item, index) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            // Automatically expand menu groups if the user is actively searching
            const isOpen = searchQuery ? true : !!openMenus[item.name];
            const isActive =
              location.pathname === item.href ||
              item.subItems?.some((s) => location.pathname === s.href);

            return (
              <div key={index} className="space-y-1">
                {hasSubItems ? (
                  // Accordion Menu Trigger Item
                  <button
                    onClick={() => toggleSubMenu(item.name)}
                    className={`group flex items-center justify-between w-full p-3 text-sm font-medium rounded-md transition-all text-left outline-none ${
                      isActive ? "bg-primary text-white" : "text-black hover:bg-gray-100"
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  // Simple Navigation Link
                  <Link
                    to={item.href}
                    className={`group flex items-center p-3 text-sm font-medium rounded-md transition-all ${
                      isActive ? "bg-primary text-white" : "hover:bg-secondary text-black"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>
                )}

                {/* Sub-menu Items Rendering */}
                {hasSubItems && isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 transition-all">
                    {item.subItems.map((sub) => {
                      const isSubActive = location.pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className={`flex items-center p-2 text-sm rounded-md transition-all ${
                            isSubActive 
                              ? "text-white font-bold bg-secondary" 
                              : "text-gray-500 hover:bg-gray-100 hover:text-black"
                          }`}
                        >
                          <span>{sub.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredNavigation.length === 0 && (
            <div className="text-center py-4 text-xs text-gray-400">
              No tabs found matching "{searchQuery}"
            </div>
          )}
        </nav>

        {/* Footer: Logout */}
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center p-3 text-sm font-medium transition-colors hover:bg-red-50 text-red-600"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;