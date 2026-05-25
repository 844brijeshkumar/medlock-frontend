import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white mt-24">

      {/* Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-slate-700/20 rounded-full blur-[120px]" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-slate-600/30 rounded-full blur-[140px]" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">

        {/* Top Footer */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">

          {/* Brand */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-4">

              <div className="w-18 h-18 rounded-2xl bg-white backdrop-blur-md flex items-center justify-center shadow-lg">
                <img
                  src="/medlock.png"
                  alt="MedLock Logo"
                  className="w-20 h-18 object-contain"
                />
              </div>

              <div>
                <h2 className="text-3xl font-black">
                  MedLock
                </h2>

                <p className="text-white/70 text-sm mt-1">
                  Healthcare CRM Infrastructure
                </p>
              </div>

            </div>

            <p className="mt-8 text-white/70 leading-relaxed max-w-xl text-lg">
              MedLock helps hospitals manage diagnostics, infrastructure,
              insurance workflows, patient operations, and healthcare
              analytics through a scalable modular SaaS ecosystem.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4 mt-8">

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Instagram size={20} />
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Facebook size={20} />
              </a>

            </div>

          </div>

          {/* Product */}
          <div>

            <h3 className="text-xl font-black mb-6">
              Platform
            </h3>

            <div className="flex flex-col gap-4 text-white/70">

              <Link
                to="/features"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Features
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                to="/plugins"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Plugins
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                to="/pricing"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Pricing
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                to="/solutions"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Solutions
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

            </div>

          </div>

          {/* Company */}
          <div>

            <h3 className="text-xl font-black mb-6">
              Company
            </h3>

            <div className="flex flex-col gap-4 text-white/70">

              <Link
                to="/about"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                About Us
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                to="/contact"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Contact
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                to="/privacy-policy"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Privacy Policy
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

              <Link
                to="/terms-of-service"
                className="hover:text-white transition-all duration-300 flex items-center gap-2 group"
              >
                Terms of Service
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Link>

            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">

          <p className="text-white/60 text-sm">
            © 2026 MedLock. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-sm text-white/60">

            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />

            Enterprise Healthcare SaaS Infrastructure

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;