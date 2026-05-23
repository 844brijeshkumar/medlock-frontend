import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { User, Users } from "lucide-react";
import Sidebar from "../Sidebar.jsx";
import ProfilePhoto from "../ProfilePhoto/index.jsx";

const Layout = ({ children, navigation, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="h-full fixed  flex w-full bg-white ">
      <Sidebar
        navigation={navigation}
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        name={name}
      />

      {/* Main content */}
      <div className="w-full h-full flex flex-col overflow-auto ">
        {/*  header */}
        <div className="sticky top-0 z-40 flex h-20 py-6 items-center gap-x-4 border-b justify-between border-gray-200 bg-white px-4 shadow-sm ">
          <div className=" hidden sm:flex items-center gap-2 ">
            <Users className="h-6 w-6 text-primary" />

            <h1 className="text-lg  text-secondary">{name}</h1>
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
            <button
              onClick={toggleSidebar}
              className=" rounded-xl cursor-pointer p-2  text-white flex  sm:hidden items-center justify-center transition-colors duration-200"
            >
              {" "}
              {isCollapsed ? (
                <Bars3Icon className="h-8 w-8 text-[#0b4f4a] " />
              ) : (
                <XMarkIcon className="h-8 w-8 text-[#0b4f4a] " />
              )}
            </button>
          </div>
        </div>

        {/* Page content */}

        <main className="">{children} </main>
      </div>
    </div>
  );
};

export default Layout;
