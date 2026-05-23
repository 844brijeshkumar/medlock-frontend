import React from "react";
import { LockKeyhole, FileText, ShieldCheck, Share2 } from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

const PrivacyPolicy = () => {
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
                Privacy & Policy
              </h1>
              <div className="w-24 h-1.5 bg-white/50 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
                Your health data is your most personal asset. We are committed
                to protecting it with the highest standards of security and
                transparency.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* --- Our Commitment Section --- */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  Our Commitment to Your Privacy
                </h2>
                <p className="text-lg text-[var(--color-card-secondary-text)] mt-2">
                  Your trust is our top priority.
                </p>
              </div>
              <div
                className="bg-[var(--color-card-bg)] p-8 md:p-12 rounded-2xl text-center"
                style={{
                  border: "1px solid var(--color-border)",
                  boxShadow: "var(--color-shadow)",
                }}
              >
                <p className="text-[var(--color-card-text)] leading-relaxed">
                  The purpose of this privacy policy is to inform you about how
                  MedLock collects, uses, stores, and protects your personal and
                  health information. By using our services, you agree to the
                  terms outlined in this policy.
                </p>
              </div>
            </div>

            {/* --- Policy Details Section --- */}
            <div className="mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Information We Collect */}
                <div
                  className="bg-[var(--color-card-bg)] p-8 rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--color-shadow)",
                  }}
                >
                  <LockKeyhole className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                    Information We Collect
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)] mb-2">
                    We collect information to provide and improve our services to you.
                    This includes:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-card-secondary-text)] space-y-2">
                    <li>
                      <b>Personal Identification:</b> Your name and mobile number.
                    </li>
                    <li>
                      <b>Health Information:</b> Your prescriptions, lab reports, and
                      medical history.
                    </li>
                    <li>
                      <b>Technical Information:</b> Your IP address and device type.
                    </li>
                  </ul>
                </div>

                {/* How We Use Your Information */}
                <div
                  className="bg-[var(--color-card-bg)] p-8 rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--color-shadow)",
                  }}
                >
                  <FileText className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                    How We Use Your Information
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)] mb-2">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-card-secondary-text)] space-y-2">
                    <li>
                      <b>Manage Your Health Locker:</b> To consolidate your medical records.
                    </li>
                    <li>
                      <b>Facilitate Consent-Based Sharing:</b> To enable secure data sharing.
                    </li>
                    <li>
                      <b>Improve Our Services:</b> To analyze usage and develop new features.
                    </li>
                    <li>
                      <b>Ensure Security:</b> To protect your data from unauthorized access.
                    </li>
                  </ul>
                </div>

                {/* Data Security */}
                <div
                  className="bg-[var(--color-card-bg)] p-8 rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--color-shadow)",
                  }}
                >
                  <ShieldCheck className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                    Data Security
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)] mb-2">
                    The security of your data is paramount. We employ a variety of
                    industry-standard security measures, including:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-card-secondary-text)] space-y-2">
                    <li>
                      <b>Bank-Grade Encryption:</b> Your data is encrypted both in transit and at rest.
                    </li>
                    <li>
                      <b>Strict Access Controls:</b> Access to your data is limited to you and those you explicitly grant access to.
                    </li>
                    <li>
                      <b>Secure Infrastructure:</b> Our systems are hosted in a secure environment.
                    </li>
                  </ul>
                </div>

                {/* Sharing Your Information */}
                <div
                  className="bg-[var(--color-card-bg)] p-8 rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                  style={{
                    border: "1px solid var(--color-border)",
                    boxShadow: "var(--color-shadow)",
                  }}
                >
                  <Share2 className="w-10 h-10 text-teal-600 mb-4" />
                  <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                    Sharing Your Information
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)] mb-2">
                    We will <b>never</b> sell, rent, or lease your personal health
                    information to any third party for marketing or any other
                    purpose without your explicit consent. We only share with:
                  </p>
                  <ul className="list-disc list-inside text-[var(--color-card-secondary-text)] space-y-2">
                    <li>
                      <b>With Your Consent:</b> When you choose to share your records with a doctor.
                    </li>
                    <li>
                      <b>With Service Providers:</b> With third parties who help us operate our business (e.g., cloud hosting).
                    </li>
                    <li>
                      <b>Legal Requirements:</b> If required by law or a court order.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* --- Your Rights Section --- */}
            <div className="p-8 md:p-12 rounded-3xl" style={{ border: "1px solid var(--color-border)", boxShadow: "var(--color-shadow)" }}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  Your Rights
                </h2>
                <p className="text-lg text-[var(--color-card-secondary-text)] mt-2">
                  You have full control over your data.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {/* Access Data */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    Access Your Data
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)]">
                    View and download your complete health history at any time.
                  </p>
                </div>
                {/* Correct Information */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    Correct Your Information
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)]">
                    Request corrections to any inaccuracies in your personal data.
                  </p>
                </div>
                {/* Control Sharing */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    Control Sharing
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)]">
                    Manage and revoke access to your shared records whenever you want.
                  </p>
                </div>
                {/* Delete Account */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg mb-4">
                    <span className="text-3xl font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                    Delete Your Account
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)]">
                    Request the deletion of your account and all associated data.
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

export default PrivacyPolicy;