import {
  FlaskConical,
  ScanLine,
  ShieldCheck,
  Building2,
  Wallet,
  Activity,
  ArrowRight,
  CheckCircle2,
  Database,
  Users,
  BarChart3,
  Cpu,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const plugins = [
  {
    title: "Pathology Plugin",
    description:
      "Manage diagnostics, lab reports, sample collection, and pathology workflows.",
    icon: <FlaskConical className="w-7 h-7" />,
    features: [
      "Lab Report Management",
      "Sample Collection",
      "Test Verification",
      "Diagnostic Analytics",
    ],
  },

  {
    title: "Radiology Plugin",
    description:
      "Handle imaging workflows, scan reports, radiologist reviews, and PACS integration.",
    icon: <ScanLine className="w-7 h-7" />,
    features: [
      "Imaging Workflow",
      "Radiologist Reports",
      "PACS Integration",
      "Scan Scheduling",
    ],
  },

  {
    title: "Insurance Claims",
    description:
      "Automate claim workflows, billing verification, and healthcare reimbursements.",
    icon: <ShieldCheck className="w-7 h-7" />,
    features: [
      "Claim Processing",
      "TPA Management",
      "Billing Verification",
      "Insurance Analytics",
    ],
  },

  {
    title: "Hospital Infrastructure",
    description:
      "Manage departments, wards, rooms, beds, and healthcare infrastructure.",
    icon: <Building2 className="w-7 h-7" />,
    features: [
      "Branch Management",
      "Ward & Bed Tracking",
      "Department Setup",
      "Infrastructure Analytics",
    ],
  },

  {
    title: "Finance & Billing",
    description:
      "Track billing workflows, hospital finance, invoices, and payment systems.",
    icon: <Wallet className="w-7 h-7" />,
    features: [
      "Invoice Management",
      "Billing System",
      "Payment Tracking",
      "Financial Reports",
    ],
  },

  {
    title: "Government Analytics",
    description:
      "District-level monitoring, outbreak analytics, and anonymous healthcare statistics.",
    icon: <BarChart3 className="w-7 h-7" />,
    features: [
      "Heatmaps",
      "Outbreak Monitoring",
      "Anonymous Statistics",
      "Trend Analysis",
    ],
  },

  {
    title: "Patient Management",
    description:
      "Centralized patient records, appointments, diagnostics, and healthcare workflows.",
    icon: <Database className="w-7 h-7" />,
    features: [
      "Patient Records",
      "Appointment System",
      "Medical History",
      "Healthcare Workflows",
    ],
  },

  {
    title: "HR & Staff Management",
    description:
      "Manage healthcare staff, attendance, permissions, and operational workflows.",
    icon: <Users className="w-7 h-7" />,
    features: [
      "Role Management",
      "Attendance Tracking",
      "Staff Analytics",
      "Biometric Support",
    ],
  },
];

const stats = [
  {
    value: "20+",
    label: "Healthcare Modules",
  },

  {
    value: "Modular",
    label: "Plugin Architecture",
  },

  {
    value: "Enterprise",
    label: "Multi-Tenant SaaS",
  },

  {
    value: "Scalable",
    label: "Healthcare Infrastructure",
  },
];

const Plugins = () => {
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
                Plugin Marketplace
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white">
                Expand Your
                <span className="text-white/80">
                  {" "}Healthcare Ecosystem
                </span>
              </h1>

              {/* Description */}
              <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
                Activate only the healthcare modules your organization
                needs and scale MedLock with a flexible modular architecture.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mt-10">

                <Link
                  to="/pricing"
                  className="group relative overflow-hidden bg-white text-primary px-8 py-4 rounded-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  View Pricing

                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/demo"
                  className="border border-white/20 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300"
                >
                  Request Demo
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

        {/* PLUGINS */}
        <section className="max-w-7xl mx-auto px-6 py-24">

          <div className="text-center max-w-3xl mx-auto">

            <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
              Healthcare Modules
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900">
              Modular Plugins Built for Modern Healthcare
            </h2>

            <p className="mt-6 text-lg text-gray-500">
              Scale MedLock with powerful healthcare plugins designed
              for diagnostics, infrastructure, insurance, analytics,
              and healthcare operations.
            </p>

          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">

            {plugins.map((plugin, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden"
              >

                {/* Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  {plugin.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black mt-6 text-gray-900">
                  {plugin.title}
                </h3>

                {/* Desc */}
                <p className="mt-4 text-gray-500 leading-relaxed">
                  {plugin.description}
                </p>

                {/* Features */}
                <div className="mt-6 flex flex-col gap-3">

                  {plugin.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-gray-600"
                    >

                      <div className="w-2 h-2 rounded-full bg-secondary" />

                      <span className="text-sm font-medium">
                        {feature}
                      </span>

                    </div>
                  ))}

                </div>

                {/* Button */}
                <button className="mt-8 w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-secondary transition-all duration-300 flex items-center justify-center gap-2">
                  Activate Plugin

                  <Cpu className="w-5 h-5" />
                </button>

              </div>
            ))}

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
                Build Your Healthcare Ecosystem with MedLock Plugins
              </h2>

              <p className="mt-8 text-lg max-w-3xl mx-auto text-white/80">
                Start with the modules you need and expand your
                healthcare infrastructure as your organization grows.
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
                  to="/pricing"
                  className="border border-white/30 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300"
                >
                  View Pricing
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

export default Plugins;