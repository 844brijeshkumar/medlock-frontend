import {
  Building2,
  FlaskConical,
  ShieldCheck,
  BarChart3,
  HeartPulse,
  Users,
  ArrowRight,
  CheckCircle2,
  Landmark,
  ScanLine,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const solutions = [
  {
    title: "Hospitals",
    description:
      "Complete healthcare infrastructure for multi-branch hospitals and enterprise healthcare networks.",
    icon: <Building2 className="w-7 h-7" />,
    features: [
      "Department Management",
      "Patient Operations",
      "Staff & HR Workflows",
      "Infrastructure Analytics",
    ],
  },

  {
    title: "Diagnostic Labs",
    description:
      "Centralized pathology and radiology workflows for modern diagnostic centers.",
    icon: <FlaskConical className="w-7 h-7" />,
    features: [
      "Lab Reports",
      "Sample Collection",
      "Radiology Management",
      "Diagnostic Analytics",
    ],
  },

  {
    title: "Insurance Providers",
    description:
      "Automate healthcare claims, billing workflows, and insurance reimbursement systems.",
    icon: <ShieldCheck className="w-7 h-7" />,
    features: [
      "Claim Processing",
      "TPA Management",
      "Billing Verification",
      "Healthcare Reimbursements",
    ],
  },

  {
    title: "Government Analytics",
    description:
      "District-level monitoring, healthcare statistics, outbreak tracking, and analytics systems.",
    icon: <BarChart3 className="w-7 h-7" />,
    features: [
      "Outbreak Monitoring",
      "Healthcare Heatmaps",
      "Trend Analysis",
      "Anonymous Statistics",
    ],
  },

  {
    title: "Clinics",
    description:
      "Modern clinic management infrastructure for appointments, diagnostics, and patient workflows.",
    icon: <HeartPulse className="w-7 h-7" />,
    features: [
      "Appointment System",
      "Patient Records",
      "Clinic Billing",
      "Doctor Scheduling",
    ],
  },

  {
    title: "Healthcare Staff",
    description:
      "Manage healthcare workforce operations, attendance, permissions, and staff analytics.",
    icon: <Users className="w-7 h-7" />,
    features: [
      "Attendance Tracking",
      "Role Permissions",
      "Biometric Support",
      "Operational Analytics",
    ],
  },
];

const workflow = [
  {
    step: "01",
    title: "Choose Your Solution",
    description:
      "Select the healthcare infrastructure your organization needs.",
  },

  {
    step: "02",
    title: "Activate Modules",
    description:
      "Enable diagnostics, insurance, analytics, and operational plugins.",
  },

  {
    step: "03",
    title: "Configure Infrastructure",
    description:
      "Create departments, branches, wards, and healthcare workflows.",
  },

  {
    step: "04",
    title: "Scale Operations",
    description:
      "Expand your healthcare ecosystem with modular SaaS infrastructure.",
  },
];

const stats = [
  {
    value: "20+",
    label: "Healthcare Modules",
  },

  {
    value: "Enterprise",
    label: "Multi-Tenant SaaS",
  },

  {
    value: "Real-Time",
    label: "Healthcare Analytics",
  },

  {
    value: "Scalable",
    label: "Infrastructure",
  },
];

const Solutions = () => {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 text-gray-800">

        {/* HERO */}
        <section className="relative overflow-hidden min-h-[70vh] flex items-center">

          {/* Background */}
          <div className="absolute inset-0 bg-slate-950" />

          {/* Glow */}
          <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-white/20 rounded-full blur-[120px]" />

          <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-white/30 rounded-full blur-[140px]" />


          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full">

            <div className="max-w-4xl">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-8">
                <CheckCircle2 className="w-4 h-4" />
                Healthcare Solutions
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white">
                Solutions Built for
                <span className="text-white/80">
                  {" "}Modern Healthcare Infrastructure
                </span>
              </h1>

              {/* Description */}
              <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
                MedLock provides scalable healthcare infrastructure
                for hospitals, diagnostics, insurance systems,
                analytics, and healthcare operations.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <Link
                  to="/demo"
                  className="group relative overflow-hidden bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  Request Demo

                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/pricing"
                  className="border border-white/20 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
                >
                  View Pricing
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* STATS */}
        <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {stats.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-secondary/5 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500"
              >

                <h2 className="text-4xl font-black text-primary">
                  {item.value}
                </h2>

                <p className="mt-3 text-gray-500 font-medium">
                  {item.label}
                </p>

              </div>
            ))}

          </div>

        </section>

        {/* SOLUTIONS */}
        <section className="max-w-7xl mx-auto px-6 py-24">

          <div className="text-center max-w-3xl mx-auto">

            <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
              Healthcare Ecosystem
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900">
              Solutions for Every Healthcare Organization
            </h2>

            <p className="mt-6 text-lg text-gray-500">
              Scale healthcare operations with intelligent infrastructure,
              diagnostics, analytics, and modular SaaS systems.
            </p>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">

            {solutions.map((solution, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden"
              >

                {/* Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  {solution.icon}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-black mt-6 text-gray-900">
                  {solution.title}
                </h3>

                {/* Desc */}
                <p className="mt-4 text-gray-500 leading-relaxed">
                  {solution.description}
                </p>

                {/* Features */}
                <div className="mt-8 flex flex-col gap-4">

                  {solution.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-gray-600"
                    >

                      <div className="w-2 h-2 rounded-full bg-secondary" />

                      <span className="font-medium">
                        {feature}
                      </span>

                    </div>
                  ))}

                </div>

                {/* Button */}
                <button className="mt-10 w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-2">
                  Explore Solution

                  <ArrowRight className="w-5 h-5" />

                </button>

              </div>
            ))}

          </div>

        </section>

        {/* WORKFLOW */}
        <section className="bg-white py-24">

          <div className="max-w-7xl mx-auto px-6">

            <div className="text-center max-w-3xl mx-auto">

              <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
                How It Works
              </p>

              <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900">
                Build Your Healthcare Ecosystem
              </h2>

              <p className="mt-6 text-lg text-gray-500">
                Deploy scalable healthcare infrastructure in four simple steps.
              </p>

            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

              {workflow.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-slate-50 rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden"
                >

                  {/* Accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Number */}
                  <div className="text-6xl font-black text-secondary/20">
                    {item.step}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-black mt-6 text-gray-900">
                    {item.title}
                  </h3>

                  {/* Desc */}
                  <p className="mt-4 text-gray-500 leading-relaxed">
                    {item.description}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* INDUSTRIES */}
        <section className="max-w-7xl mx-auto px-6 py-24">

          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="p-10 border-b border-gray-100">

              <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
                Supported Infrastructure
              </p>

              <h2 className="text-4xl font-black mt-4 text-gray-900">
                Healthcare Infrastructure Coverage
              </h2>

            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

              {[
                {
                  icon: <Building2 className="w-8 h-8" />,
                  title: "Hospitals",
                },

                {
                  icon: <FlaskConical className="w-8 h-8" />,
                  title: "Diagnostic Labs",
                },

                {
                  icon: <ScanLine className="w-8 h-8" />,
                  title: "Radiology Centers",
                },

                {
                  icon: <Landmark className="w-8 h-8" />,
                  title: "Government Systems",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group p-10 border-b lg:border-b-0 lg:border-r border-gray-100 hover:bg-slate-50 transition-all duration-300"
                >

                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>

                  <h3 className="text-2xl font-black mt-6 text-gray-900">
                    {item.title}
                  </h3>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CTA */}
        <section className="px-6 pb-24">

          <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative">

            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary" />

            {/* Content */}
            <div className="relative z-10 px-8 py-20 md:px-20 text-center text-white">

              <h2 className="text-4xl md:text-5xl font-black max-w-4xl mx-auto leading-tight">
                Build Smarter Healthcare Infrastructure with MedLock
              </h2>

              <p className="mt-8 text-lg max-w-3xl mx-auto text-white/80">
                Deploy modern healthcare systems powered by modular SaaS,
                diagnostics, analytics, and enterprise healthcare operations.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

                <Link
                  to="/demo"
                  className="bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Request Demo
                </Link>

                <Link
                  to="/plugins"
                  className="border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
                >
                  Explore Plugins
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

export default Solutions;