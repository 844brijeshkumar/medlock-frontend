import { Outlet } from "react-router-dom";
import Navbar from "../Navbar"; 
import Footer from "../footer"; 

const HomeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* 1. Add relative and a very high z-index here! */}
      <div className="relative z-[9999]">
        <Navbar />
      </div>
      
      {/* 2. Keep the main content relative but lower z-index */}
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      
      {/* 3. Protect the footer layer as well */}
      <div className="relative z-50">
        <Footer />
      </div>

    </div>
  );
};

export default HomeLayout;