import {
  Building2,
  ShieldCheck,
  Globe,
  Database,
  ArrowRight,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

const values = [
  {
    title: "Healthcare Infrastructure",
    description:
      "Built to manage hospitals, diagnostics, insurance, departments, and healthcare operations at scale.",
    icon: <Building2 className="w-7 h-7" />,
  },
  {
    title: "Security & Privacy",
    description:
      "Enterprise-grade access control and secure medical workflows designed for healthcare ecosystems.",
    icon: <ShieldCheck className="w-7 h-7" />,
  },
  {
    title: "National Scale Vision",
    description:
      "Designed for scalable healthcare networks, analytics systems, and future government integrations.",
    icon: <Globe className="w-7 h-7" />,
  },
];

const stats = [
  {
    title: "Modular Plugins",
    value: "20+",
  },
  {
    title: "Multi-Tenant SaaS",
    value: "Enterprise",
  },
  {
    title: "Infrastructure",
    value: "Scalable",
  },
  {
    title: "Analytics",
    value: "Real-Time",
  },
];

const AboutUs = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 text-gray-800">

        {/* HERO SECTION */}
        <section className="relative overflow-hidden min-h-[80vh] flex items-center">

          {/* Background */}
          <div className="absolute inset-0 bg-slate-950" />

          {/* Glow */}
          <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-white/20 rounded-full blur-[120px]" />

          <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-white/30 rounded-full blur-[140px]" />

          {/* Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-5 mb-5">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* LEFT */}
              <div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-8">
                  <CheckCircle2 className="text-white w-4 h-4" />
                  About MedLock
                </div>

                {/* Heading */}
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white">
                  Building the Future of
                  <span className="text-white/80">
                    {" "}Healthcare Infrastructure
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl">
                  MedLock is a modular healthcare CRM ecosystem designed
                  to help hospitals manage infrastructure, diagnostics,
                  patient workflows, insurance operations, and analytics
                  from one centralized platform.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-4 mt-10">

                  <Link
                    to="/demo"
                    className="group relative overflow-hidden bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                    Request Demo

                    <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/plugins"
                    className="border border-white/20 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
                  >
                    Explore Platform
                  </Link>

                </div>

              </div>

              {/* RIGHT */}
              <div className="relative">

                {/* Glow */}
                <div className="absolute inset-0 bg-secondary/20 blur-[120px]" />

                {/* Main Card */}
                <div className="relative bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl">

                  {/* Top */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">

                    <div>
                      <p className="text-white/60 text-sm">
                        MedLock Ecosystem
                      </p>

                      <h3 className="text-white text-2xl font-bold mt-1">
                        Healthcare SaaS Platform
                      </h3>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-lg">
                      <Database className="w-7 h-7" />
                    </div>

                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6">

                    {stats.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5"
                      >
                        <p className="text-white/60 text-sm">
                          {item.title}
                        </p>

                        <h2 className="text-3xl font-black text-white mt-3">
                          {item.value}
                        </h2>
                      </div>
                    ))}

                  </div>

                  {/* Bottom */}
                  <div className="mt-6 bg-white/5 rounded-2xl p-5 border border-white/10">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-white/60 text-sm">
                          Real-Time Monitoring
                        </p>

                        <h3 className="text-white text-xl font-bold mt-1">
                          Healthcare Analytics Engine
                        </h3>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <Activity className="text-white w-6 h-6" />
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* MISSION & VISION */}
        <section className="max-w-7xl mx-auto px-6 py-24">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Mission */}
            <div className="group relative bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden">

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                <Building2 className="w-8 h-8" />
              </div>

              <h2 className="text-4xl font-black mt-8 text-gray-900">
                Our Mission
              </h2>

              <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                To simplify healthcare infrastructure by creating a scalable,
                modular, and centralized ecosystem for hospitals, diagnostics,
                insurance workflows, and healthcare operations.
              </p>

            </div>

            {/* Vision */}
            <div className="group relative bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden">

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                <Globe className="w-8 h-8" />
              </div>

              <h2 className="text-4xl font-black mt-8 text-gray-900">
                Our Vision
              </h2>

              <p className="mt-6 text-lg text-gray-500 leading-relaxed">
                To become the operating system powering modern healthcare
                infrastructure through secure healthcare SaaS, analytics,
                diagnostics, and intelligent medical ecosystems.
              </p>

            </div>

          </div>

        </section>

        {/* VALUES */}
        <section className="bg-white py-24">

          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center max-w-3xl mx-auto">

              <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
                Core Values
              </p>

              <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900">
                Principles Behind MedLock
              </h2>

              <p className="mt-6 text-lg text-gray-500">
                The foundation that drives our healthcare ecosystem.
              </p>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-50 rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden"
                >

                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    {value.icon}
                  </div>

                  <h3 className="text-2xl font-black mt-6 text-gray-900">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-gray-500 leading-relaxed">
                    {value.description}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="px-6 py-24">

          <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative">

            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />

            <div className="relative z-10 px-8 py-20 md:px-20 text-center text-white">

              <h2 className="text-4xl md:text-5xl font-black max-w-4xl mx-auto leading-tight">
                Build the Future of Healthcare with MedLock
              </h2>

              <p className="mt-8 text-lg max-w-3xl mx-auto text-white/80">
                Join the next generation of healthcare infrastructure powered
                by modular SaaS architecture and intelligent healthcare systems.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

                <Link
                  to="/demo"
                  className="group relative overflow-hidden bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Request Demo
                </Link>

                <Link
                  to="/contact"
                  className="border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
                >
                  Contact Us
                </Link>

              </div>

            </div>

          </div>

        </section>

        <Footer />

      </div>
    </>
  );
};

export default AboutUs;