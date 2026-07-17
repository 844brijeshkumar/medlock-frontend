import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom"; 
import { User, Users } from "lucide-react";
import Sidebar from "../Sidebar.jsx";
import ProfilePhoto from "../ProfilePhoto/index.jsx";

// ADDED: extractValidRoutes import
import { patientNavigation, buildDynamicNavigation, extractValidRoutes } from "../../utils/navigation.js";

const Layout = ({ children, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [navItems, setNavItems] = useState([]);
  const [isLoadingNav, setIsLoadingNav] = useState(true);
  
  // ADDED: Get current URL
  const location = useLocation();

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
          const formattedNav = buildDynamicNavigation(rawData.navigation);
          
          setNavItems(formattedNav);
          localStorage.setItem("dynamicNav", JSON.stringify(rawData.navigation));
        } else {
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

  // --- THE BOUNCER LOGIC ---
  
  // 1. Show a blank screen (or loading spinner) while fetching permissions so we don't accidentally kick a valid user
  if (isLoadingNav) {
    return <div className="h-screen w-full flex items-center justify-center bg-white">Loading Security Policies...</div>;
  }

  // 2. Generate the flat list of allowed URLs
  const validRoutes = extractValidRoutes(navItems);
  const currentPath = location.pathname.toLowerCase();

  // 3. Check if the current URL matches any allowed route 
  // We use .startsWith() to allow dynamic child routes (e.g., /branch/edit/1) if /branch is allowed
  const isAuthorized = validRoutes.some(route => currentPath.startsWith(route));

  // 4. Bypass check for absolute base root if needed (optional based on your app structure)
  const isRootPath = currentPath === "/" || currentPath === "/dashboard";

  if (!isAuthorized && !isRootPath) {
    // 5. KICK THEM OUT: Redirect to a 403 page
    return <Navigate to="/403" replace />;
  }
  // -------------------------

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