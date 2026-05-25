import {
  Check,
  ArrowRight,
  ShieldCheck,
  Building2,
  Cpu,
  Crown,
  Rocket,
  Layers3,
} from "lucide-react";

import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/footer";

const plans = [
  {
    name: "AlphaAccess",
    price: "₹4,999",
    description: "Perfect for small clinics and healthcare startups.",
    icon: <Rocket className="w-7 h-7" />,
    features: [
      "1 Hospital Branch",
      "25 Staff Accounts",
      "Appointment System",
      "Patient Management",
      "Basic Analytics",
      "Email Support",
    ],
    popular: false,
  },

  {
    name: "PrimePulse",
    price: "₹14,999",
    description: "Ideal for growing hospitals and diagnostic centers.",
    icon: <Building2 className="w-7 h-7" />,
    features: [
      "5 Hospital Branches",
      "150 Staff Accounts",
      "Diagnostics Modules",
      "Insurance Claims",
      "Advanced Analytics",
      "Priority Support",
    ],
    popular: true,
  },

  {
    name: "EliteEdge",
    price: "₹39,999",
    description: "Enterprise infrastructure for multi-branch healthcare networks.",
    icon: <Crown className="w-7 h-7" />,
    features: [
      "20 Hospital Branches",
      "Unlimited Staff",
      "Government Analytics",
      "Custom Plugins",
      "Enterprise Security",
      "Dedicated Support",
    ],
    popular: false,
  },
];

const addons = [
  {
    title: "Pathology Plugin",
    price: "₹2,999/mo",
  },

  {
    title: "Radiology Plugin",
    price: "₹3,999/mo",
  },

  {
    title: "Insurance Claims",
    price: "₹4,499/mo",
  },

  {
    title: "Government Analytics",
    price: "Custom",
  },
];

const Pricing = () => {
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
                <ShieldCheck className="w-4 h-4" />
                Flexible SaaS Pricing
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white">
                Simple Pricing for
                <span className="text-white/80">
                  {" "}Modern Healthcare
                </span>
              </h1>

              {/* Description */}
              <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl">
                Choose the infrastructure your healthcare organization
                needs and scale MedLock with modular healthcare plugins.
              </p>

            </div>

          </div>

        </section>

        {/* PRICING CARDS */}
        <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {plans.map((plan, index) => (
              <div
                key={index}
                className={`group relative rounded-[2rem] p-10 border overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular
                    ? "bg-primary text-white border-primary shadow-2xl shadow-primary/20 scale-[1.02]"
                    : "bg-white border-gray-100 shadow-sm hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10"
                }`}
              >

                {/* Badge */}
                {plan.popular && (
                  <div className="absolute top-6 right-6 bg-white text-primary px-4 py-2 rounded-full text-sm font-bold">
                    Most Popular
                  </div>
                )}

                {/* Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  plan.popular
                    ? "bg-white"
                    : "bg-gradient-to-r from-primary to-secondary"
                }`} />

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  plan.popular
                    ? "bg-white/10 text-white"
                    : "bg-secondary/10 text-secondary"
                }`}>
                  {plan.icon}
                </div>

                {/* Name */}
                <h2 className={`text-4xl font-black mt-8 ${
                  plan.popular ? "text-white" : "text-gray-900"
                }`}>
                  {plan.name}
                </h2>

                {/* Desc */}
                <p className={`mt-4 leading-relaxed ${
                  plan.popular ? "text-white/70" : "text-gray-500"
                }`}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mt-8">

                  <h3 className={`text-5xl font-black ${
                    plan.popular ? "text-white" : "text-primary"
                  }`}>
                    {plan.price}
                  </h3>

                  <p className={`mt-2 ${
                    plan.popular ? "text-white/60" : "text-gray-500"
                  }`}>
                    Per Month
                  </p>

                </div>

                {/* Features */}
                <div className="flex flex-col gap-4 mt-10">

                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3"
                    >

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        plan.popular
                          ? "bg-white/10"
                          : "bg-secondary/10"
                      }`}>
                        <Check className={`w-4 h-4 ${
                          plan.popular
                            ? "text-white"
                            : "text-secondary"
                        }`} />
                      </div>

                      <span className={`font-medium ${
                        plan.popular
                          ? "text-white/90"
                          : "text-gray-700"
                      }`}>
                        {feature}
                      </span>

                    </div>
                  ))}

                </div>

                {/* Button */}
                <button
                  className={`mt-10 w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-white text-primary hover:scale-105"
                      : "bg-primary text-white hover:bg-secondary"
                  }`}
                >
                  Get Started

                  <ArrowRight className="w-5 h-5" />

                </button>

              </div>
            ))}

          </div>

        </section>

        {/* ADDONS */}
        <section className="max-w-7xl mx-auto px-6 py-24">

          <div className="text-center max-w-3xl mx-auto">

            <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
              Plugin Add-ons
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-4 text-gray-900">
              Expand Your Healthcare Ecosystem
            </h2>

            <p className="mt-6 text-lg text-gray-500">
              Activate additional healthcare modules whenever your
              organization needs them.
            </p>

          </div>

          {/* Addons */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">

            {addons.map((addon, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:-translate-y-2 hover:border-secondary/40 hover:shadow-2xl hover:shadow-secondary/10 transition-all duration-500 overflow-hidden"
              >

                {/* Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                  <Cpu className="w-7 h-7" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black mt-6 text-gray-900">
                  {addon.title}
                </h3>

                {/* Price */}
                <h4 className="text-3xl font-black text-primary mt-6">
                  {addon.price}
                </h4>

                {/* Button */}
                <button className="mt-8 w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-secondary transition-all duration-300">
                  Add Plugin
                </button>

              </div>
            ))}

          </div>

        </section>

        {/* COMPARISON */}
        <section className="max-w-7xl mx-auto px-6 pb-24">

          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="p-10 border-b border-gray-100">

              <p className="text-sm uppercase tracking-[4px] text-secondary font-bold">
                Plan Comparison
              </p>

              <h2 className="text-4xl font-black mt-4 text-gray-900">
                Compare Plans
              </h2>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-6 text-gray-500 font-semibold">
                      Features
                    </th>

                    <th className="p-6 text-primary font-black">
                      AlphaAccess
                    </th>

                    <th className="p-6 text-primary font-black">
                      PrimePulse
                    </th>

                    <th className="p-6 text-primary font-black">
                      EliteEdge
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {[
                    ["Hospital Branches", "1", "5", "20+"],
                    ["Staff Accounts", "25", "150", "Unlimited"],
                    ["Diagnostics", "Basic", "Advanced", "Enterprise"],
                    ["Insurance Claims", "—", "✔", "✔"],
                    ["Government Analytics", "—", "—", "✔"],
                    ["Support", "Email", "Priority", "Dedicated"],
                  ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100"
                    >

                      {row.map((item, idx) => (
                        <td
                          key={idx}
                          className={`p-6 ${
                            idx === 0
                              ? "font-semibold text-gray-700"
                              : "text-center text-gray-500"
                          }`}
                        >
                          {item}
                        </td>
                      ))}

                    </tr>
                  ))}

                </tbody>

              </table>

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
                Start Building Your Healthcare Infrastructure Today
              </h2>

              <p className="mt-8 text-lg max-w-3xl mx-auto text-white/80">
                Choose the perfect MedLock plan and scale your
                healthcare operations with modular SaaS architecture.
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

export default Pricing;