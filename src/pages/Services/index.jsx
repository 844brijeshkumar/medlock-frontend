import React from "react";
import {
  FileText,
  LockKeyhole,
  Globe,
  Share2,
  Activity,
  Building2,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

// Define the services offered by MedLock
const services = [
  {
    icon: <FileText className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Unified Health Record",
    description:
      "We consolidate all your medical records—prescriptions, lab reports, and summaries—from various hospitals into a single, chronological timeline.",
  },
  {
    icon: <LockKeyhole className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Secure Digital Locker",
    description:
      "Your health history is stored with bank-grade encryption. You are the sole owner of your data, ensuring complete privacy and security.",
  },
  {
    icon: <Globe className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Instant Nationwide Access",
    description:
      "Access your vital health information anytime, anywhere in India. Essential for travel, emergencies, or second opinions.",
  },
  {
    icon: <Share2 className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Consent-Based Sharing",
    description:
      "Securely share your health records with any doctor for a limited time. You control who sees your data and for how long, with a full audit trail.",
  },
  {
    icon: <Activity className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Personal Health Timeline",
    description:
      "Visually track your health journey, from past treatments to recent check-ups, empowering you to take proactive charge of your well-being.",
  },
  {
    icon: <Building2 className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Ecosystem Integration",
    description:
      "We partner with hospitals, clinics, and diagnostic labs across India to ensure your new records are automatically added to your MedLock.",
  },
];

const Services = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-gray-800">
        <main className="container mx-auto px-4 sm:px-6 py-12">
          {/* --- Hero Section --- */}
          <div className="relative text-center overflow-hidden rounded-3xl py-20 md:py-28 mb-16 shadow-2xl">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0b4f4a] via-[#1a756f] to-[#2a9b94]"></div>

            {/* Content on top of the gradient */}
            <div className="relative z-10 px-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                Our Services
              </h1>
              <div className="w-24 h-1.5 bg-white/50 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
                Empowering every Indian with secure and seamless access to their
                complete medical history.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* --- Core Services Section --- */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  What We Offer
                </h2>
                <p className="text-lg text-gray-500 mt-2">
                  The core features of your personal health locker.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-card-bg)] p-8 rounded-2xl text-center border-[var(--color-border)] shadow-[var(--color-shadow)] hover:scale-105 hover:shadow-xl transition-transform duration-300"
                  >
                    {service.icon}
                    <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                      {service.title}
                    </h3>
                    <p className="text-[var(--color-card-secondary-text)]">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- How It Works Section --- */}
            <div className="bg-[var(--color-bg)] backdrop-blur-md p-8 md:p-12 rounded-3xl medical-shadow border border-white/30">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-teal-900">
                  Simple Steps to Get Started
                </h2>
                <p className="text-lg text-gray-500 mt-2">
                  Your lifelong health record is just minutes away.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Create Your Locker
                  </h3>
                  <p className="text-gray-600">
                    Sign up in seconds using your mobile number and create your
                    secure health profile.
                  </p>
                </div>
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Link Your Records
                  </h3>
                  <p className="text-gray-600">
                    Connect with our partner hospitals and labs to automatically
                    fetch your past and future records.
                  </p>
                </div>
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Access & Share
                  </h3>
                  <p className="text-gray-600">
                    View your complete history anytime, and share it with any
                    doctor in India with a single tap.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Services;
