import React from "react";
import {
  Gavel,
  Scale,
  MessageCircleQuestion,
  Database,
  Users,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

// Define the terms of service sections
const termsSections = [
  {
    icon: <Gavel className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Acceptance of Terms",
    description:
      "By accessing or using the MedLock platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
  },
  {
    icon: <Database className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Data and Privacy",
    description:
      "Your privacy is critically important to us. Our use of your personal and health data is governed by our Privacy Policy, which is incorporated into these terms by reference. You retain full ownership of your data.",
  },
  {
    icon: <Users className="w-10 h-10 text-teal-600 mb-4" />,
    title: "User Responsibilities",
    description:
      "You are responsible for maintaining the confidentiality of your account information. You agree not to misuse the platform, upload harmful content, or engage in any activity that could disrupt the service or compromise data security.",
  },
  {
    icon: <Scale className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Limitation of Liability",
    description:
      "MedLock provides a tool for managing health records and is not a substitute for professional medical advice. We are not liable for any health decisions made based on the information in your locker. Consult a qualified healthcare professional for all medical advice.",
  },
  {
    icon: <MessageCircleQuestion className="w-10 h-10 text-teal-600 mb-4" />,
    title: "Changes to Terms",
    description:
      "We reserve the right to modify these Terms of Service at any time. We will provide notice of any material changes by posting the new terms on the platform. Your continued use of the service constitutes your acceptance of the updated terms.",
  },
];

const TermsOfService = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="container mx-auto px-4 sm:px-6 py-12">
          {/* --- Hero Section --- */}
          <div className="relative text-center overflow-hidden rounded-3xl py-20 md:py-28 mb-16 shadow-2xl">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0b4f4a] via-[#1a756f] to-[#2a9b94]"></div>

            {/* Content on top of the gradient */}
            <div className="relative z-10 px-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                Terms of Service
              </h1>
              <div className="w-24 h-1.5 bg-white/50 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
                By using our services, you agree to these terms.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* --- Main Terms Section --- */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  Your Agreement with MedLock
                </h2>
                <p className="text-lg text-[var(--color-card-secondary-text)] mt-2">
                  Please read this document carefully.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {termsSections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-card-bg)] p-8 rounded-2xl text-center hover:scale-105 hover:shadow-xl transition-transform duration-300"
                    style={{
                      border: "1px solid var(--color-border)",
                      boxShadow: "var(--color-shadow)",
                    }}
                  >
                    {section.icon}
                    <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                      {section.title}
                    </h3>
                    <p className="text-[var(--color-card-secondary-text)]">
                      {section.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- General Provisions Section --- */}
            <div
              className="bg-[var(--color-bg)] backdrop-blur-md p-8 md:p-12 rounded-3xl"
              style={{
                border: "1px solid var(--color-border)",
                boxShadow: "var(--color-shadow)",
              }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  General Provisions
                </h2>
                <p className="text-lg text-[var(--color-card-secondary-text)] mt-2">
                  Additional legal information you should know.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 md:gap-12">
                {/* Governing Law */}
                <div className="flex flex-col md:flex-row items-start md:items-center text-center md:text-left gap-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg flex-shrink-0">
                    <span className="text-3xl font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                      Governing Law
                    </h3>
                    <p className="text-[var(--color-card-secondary-text)]">
                      These terms shall be governed by the laws of India. Any legal action or proceeding related to the MedLock platform shall be brought exclusively in the courts located in [Your City, India].
                    </p>
                  </div>
                </div>

                {/* Dispute Resolution */}
                <div className="flex flex-col md:flex-row items-start md:items-center text-center md:text-left gap-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg flex-shrink-0">
                    <span className="text-3xl font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                      Dispute Resolution
                    </h3>
                    <p className="text-[var(--color-card-secondary-text)]">
                      All disputes arising out of or in connection with these terms shall be resolved through binding arbitration in accordance with the Indian Arbitration and Conciliation Act, 1996.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="flex flex-col md:flex-row items-start md:items-center text-center md:text-left gap-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg flex-shrink-0">
                    <span className="text-3xl font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                      Contact Information
                    </h3>
                    <p className="text-[var(--color-card-secondary-text)]">
                      If you have any questions about these Terms of Service, please contact us at [Your Support Email Address] or by mail at [Your Company Address].
                    </p>
                  </div>
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

export default TermsOfService;