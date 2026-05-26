
import { useState } from "react";
import {
  FaCheckCircle,
  FaHospital,
  FaShieldAlt,
  FaChartLine,
  FaDatabase,
  FaFlask,
  FaArrowRight,
  FaUserMd,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const features = [
  {
    id: 1,
    title: "Hospital Infrastructure",
    description: "Manage branches, wards, rooms, departments, and healthcare operations from one dashboard.",
    icon: <FaHospital />,
  },
  {
    id: 2,
    title: "Role-Based Access",
    description: "Secure permissions for doctors, nurses, receptionists, admins, and departments.",
    icon: <FaShieldAlt />,
  },
  {
    id: 3,
    title: "Government Analytics",
    description: "Track healthcare trends, district spikes, red zones, and anonymous statistics.",
    icon: <FaChartLine />,
  },
  {
    id: 4,
    title: "Centralized Reports",
    description: "Securely manage patient reports, diagnostics, insurance, and medical workflows.",
    icon: <FaDatabase />,
  },
];

const plugins = [
  { id: 1, title: "Pathology Plugin", description: "Lab reports, sample collection, processing, and diagnostics workflows." },
  { id: 2, title: "Radiology Plugin", description: "Imaging workflows, radiologist review, scans, and PACS integration." },
  { id: 3, title: "Insurance Management", description: "Claim management, billing verification, and insurance workflows." },
  { id: 4, title: "Blood Bank Management", description: "Blood inventory tracking, donor appointments, and emergency requests." },
];

const steps = [
  "Choose Subscription",
  "Create Hospital Branches",
  "Activate Plugins",
  "Start Managing Operations",
];

const Home = () => {
  // State to track mouse position for the dynamic glow
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update coordinates when mouse moves over the Hero section
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <>
      {/* HERO SECTION */}
      <section 
        className="relative overflow-hidden min-h-[92vh] flex items-center group"
        onMouseMove={handleMouseMove}
      >
        <div className="absolute inset-0 bg-slate-950" />
        
        {/* DYNAMIC CURSOR GLOW - Made smaller (300px) and tighter blur (90px) */}
        <div 
          className="absolute top-0 left-0 w-[300px] h-[300px] bg-white/20 rounded-full blur-[90px] pointer-events-none transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 z-0"
          style={{
            // Subtracted 150 (half of 300) to keep it perfectly centered on the cursor
            transform: `translate(${mousePosition.x - 150}px, ${mousePosition.y - 150}px)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] z-0"
          style={{
            backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-5 mb-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white text-sm font-semibold mb-8">
                <FaCheckCircle className="text-[var(--color-secondary)]" />
                Enterprise Healthcare CRM Platform
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white">
                The Operating System for
                <span className="bg-gradient-to-r from-[var(--color-secondary)] to-white bg-clip-text text-transparent"> Modern Healthcare</span>
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                MedLock unifies hospital infrastructure, diagnostics, insurance workflows, patient management, and analytics into one scalable healthcare ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Link to="/demo" className="group relative overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white px-8 py-4 rounded-2xl font-bold shadow-2xl shadow-[var(--color-secondary)]/20 hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  Request Demo
                  <FaArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/plugins" className="border border-white/10 bg-white/5 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300">
                  Explore Plugins
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-16">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white">20+</h3>
                  <p className="text-slate-400 mt-2 text-sm">Healthcare Modules</p>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white">SaaS</h3>
                  <p className="text-slate-400 mt-2 text-sm">Multi-Tenant Infrastructure</p>
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white">Secure</h3>
                  <p className="text-slate-400 mt-2 text-sm">Enterprise Role Access</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE UI MOCKUP */}
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-secondary)]/20 blur-[120px]" />
              <div className="relative bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div>
                    <p className="text-slate-400 text-sm">MedLock Dashboard</p>
                    <h3 className="text-white text-2xl font-bold mt-1">Hospital Analytics</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center text-white text-2xl shadow-lg">
                    <FaHospital />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">Active Hospitals</p>
                    <h2 className="text-4xl font-black text-white mt-3">24</h2>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">Daily Reports</p>
                    <h2 className="text-4xl font-black text-white mt-3">12K</h2>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">Plugins Active</p>
                    <h2 className="text-4xl font-black text-white mt-3">18</h2>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-slate-400 text-sm">Insurance Claims</p>
                    <h2 className="text-4xl font-black text-white mt-3">3.4K</h2>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-r from-[var(--color-primary)]/30 to-[var(--color-secondary)]/30 rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm">Government Analytics</p>
                      <h3 className="text-white text-xl font-bold mt-1">District-Level Monitoring</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <FaChartLine className="text-white text-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[4px] text-[var(--color-secondary)] font-bold">Core Features</p>
          <h2 className="text-4xl md:text-5xl font-black mt-4 leading-tight">
            Everything You Need to Run Modern Healthcare Operations
          </h2>
          <p className="mt-6 text-lg text-gray-500">
            MedLock centralizes healthcare workflows into one scalable and modular healthcare ecosystem.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">
          {features.map((feature) => (
            <div key={feature.id} className="group relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-[var(--color-secondary)] hover:shadow-2xl hover:shadow-[var(--color-secondary)]/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="w-16 h-16 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-2xl text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mt-6 group-hover:text-[var(--color-primary)] transition-colors">
                {feature.title}
              </h3>
              <p className="mt-4 text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLUGINS */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[4px] text-[var(--color-secondary)] font-bold">Plugin Marketplace</p>
              <h2 className="text-4xl md:text-5xl font-black mt-4">Expand Your Healthcare Ecosystem</h2>
              <p className="mt-6 text-lg text-gray-500">
                Activate only the modules your organization needs and scale MedLock as operations grow.
              </p>
            </div>
            <Link to="/plugins" className="group relative overflow-hidden bg-[var(--color-primary)] text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-[var(--color-primary)]/20 hover:scale-105 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              View All Plugins
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            {plugins.map((plugin) => (
              <div key={plugin.id} className="group relative bg-slate-50 rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-[var(--color-secondary)] hover:shadow-2xl hover:shadow-[var(--color-secondary)]/10 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-xl text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-all duration-300">
                    <FaFlask />
                  </div>
                  <h3 className="text-2xl font-bold">{plugin.title}</h3>
                </div>
                <p className="mt-6 text-gray-500 leading-relaxed">{plugin.description}</p>
                <Link to="/plugins" className="inline-flex items-center gap-2 mt-8 text-[var(--color-secondary)] font-bold hover:gap-4 transition-all duration-300">
                  Learn More
                  <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm uppercase tracking-[4px] text-[var(--color-secondary)] font-bold">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black mt-4">Get Started with MedLock</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step, index) => (
            <div key={index} className="group relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-[var(--color-secondary)] hover:shadow-2xl hover:shadow-[var(--color-secondary)]/10 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="text-6xl font-black text-[var(--color-secondary)]/20">0{index + 1}</div>
              <h3 className="text-2xl font-bold mt-6 group-hover:text-[var(--color-primary)] transition-colors">{step}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, var(--color-primary), var(--color-secondary))" }} />
          <div className="relative z-10 px-8 py-20 md:px-20 text-center text-white">
            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8">
              <FaUserMd className="text-4xl" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black max-w-4xl mx-auto leading-tight">
              Transform Your Healthcare Operations with MedLock
            </h2>
            <p className="mt-8 text-lg max-w-3xl mx-auto text-white/80">
              Build scalable healthcare infrastructure with modular plugins, analytics, diagnostics, and enterprise-grade workflows.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <Link to="/demo" className="group relative overflow-hidden bg-white text-[var(--color-primary)] px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#d1e8e5] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                Request Demo
              </Link>
              <Link to="/pricing" className="border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
