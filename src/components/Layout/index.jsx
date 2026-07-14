import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { User, Users } from "lucide-react";
import Sidebar from "../Sidebar.jsx";
import ProfilePhoto from "../ProfilePhoto/index.jsx";

import { patientNavigation, buildDynamicNavigation } from "../../utils/navigation.js";

// Notice 'navigation' is removed from props since we handle it dynamically now
const Layout = ({ children, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [navItems, setNavItems] = useState([]);
  const [isLoadingNav, setIsLoadingNav] = useState(true);


  useEffect(() => {
    const fetchNavigation = async () => {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token");

      // 1. If Patient, use hardcoded navigation
      if (role === "patient") {
        setNavItems(patientNavigation);
        setIsLoadingNav(false);
        return;
      }

      // 2. If Staff/Admin, fetch from Django backend
      try {
        const response = await fetch("http://127.0.0.1:8000/api/rbac/navigation/", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const rawData = await response.json();
          // Format the raw JSON into the array structure the Sidebar expects
          const formattedNav = buildDynamicNavigation(rawData.navigation);
          
          setNavItems(formattedNav);
          
          // Cache it in localStorage so the UI doesn't blink if the user refreshes the page
          localStorage.setItem("dynamicNav", JSON.stringify(rawData.navigation));
        } else {
          // Fallback to cache if API returns an error (e.g., token expired)
          const cached = JSON.parse(localStorage.getItem("dynamicNav") || "[]");
          setNavItems(buildDynamicNavigation(cached));
        }
      } catch (error) {
        console.error("Failed to load navigation menus", error);
        const cached = JSON.parse(localStorage.getItem("dynamicNav") || "[]");
        setNavItems(buildDynamicNavigation(cached));
      } finally {
        setIsLoadingNav(false);
      }
    };

    fetchNavigation();
  }, []);

  return (
    <div className="h-full fixed flex w-full bg-white ">
      <Sidebar
        navigation={navItems}
        name={name}
      />

      {/* Main content */}
      <div className="w-full h-full flex flex-col overflow-auto ">
        {/* header */}
        <div className="sticky top-0 z-40 flex h-20 py-6 items-center gap-x-4 border-b justify-between border-gray-200 bg-white px-4 shadow-sm ">
          <div className=" hidden sm:flex items-center gap-2 ">
            <Users className="h-6 w-6 text-primary" />

            <h1 className="text-lg text-secondary">{name}</h1>
          </div>
          <div className="flex sm:hidden items-center space-x-3">
            <div>
              <img src="/logo.png" className="h-10 w-9" alt="MedLock Logo" />
            </div>
            <h1
              className={`text-xl font-bold text-black transition-opacity duration-300`}
            >
              Medlock
            </h1>
          </div>
          <div className=" flex items-center space-x-5">
            <ProfilePhoto />
          </div>
        </div>

        {/* Page content */}
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;