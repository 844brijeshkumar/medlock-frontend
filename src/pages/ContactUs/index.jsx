
import React, { useState } from "react";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  User,
  Stethoscope,
  Building2,
  MessageSquare,
} from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "user",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    setFormData({
      name: "",
      email: "",
      userType: "user",
      subject: "",
      message: "",
    });
  };

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

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 w-full text-center">
          <div className="max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/10 backdrop-blur-md text-white text-sm font-semibold mb-8">
              <MessageSquare className="w-4 h-4" />
              Get in Touch
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] text-white">
              Let's Talk About Your
              <span className="text-white/80"> Healthcare Needs</span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg md:text-xl text-white/80 leading-relaxed">
              Reach out to our team for inquiries about our modular SaaS platform, 
              enterprise pricing, or custom healthcare infrastructure solutions.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT FORM & INFO SECTION */}
      <section className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-[var(--color-secondary)]/10 border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            
            {/* LEFT: CONTACT INFO */}
            <div className="lg:col-span-2 bg-slate-50 p-10 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
              <h3 className="text-3xl font-black text-gray-900 mb-8">
                Contact Information
              </h3>
              
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-all duration-300 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Phone</h4>
                    <p className="text-gray-500 mt-1">+1 (123) 456-7890</p>
                    <p className="text-sm text-gray-400 mt-1">Mon-Fri from 8am to 6pm.</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-all duration-300 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Email</h4>
                    <p className="text-gray-500 mt-1">contact@medlock.dev</p>
                    <p className="text-sm text-gray-400 mt-1">We'll respond within 24 hours.</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] group-hover:bg-[var(--color-secondary)] group-hover:text-white transition-all duration-300 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Headquarters</h4>
                    <p className="text-gray-500 mt-1">
                      456 Tech Lane, Suite 789<br />
                      Dev City, 54321
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Image/Box */}
              <div className="mt-12 relative overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e18690c5e561?q=80&w=2070&auto=format&fit=crop"
                  alt="Medical professionals"
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/90 to-transparent"></div>
                <div className="absolute bottom-4 left-5 text-white">
                  <p className="font-bold">24/7 Enterprise Support</p>
                  <p className="text-sm opacity-90">Trusted by modern hospitals.</p>
                </div>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <div className="lg:col-span-3 p-10 md:p-12">
              <h3 className="text-3xl font-black text-gray-900 mb-8">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* User Type Radio Buttons */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    I am a...
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* User Option */}
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="user"
                        checked={formData.userType === "user"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          formData.userType === "user"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-gray-100 bg-white hover:border-[var(--color-secondary)]/50"
                        }`}
                      >
                        <User className={`w-6 h-6 ${formData.userType === "user" ? "text-[var(--color-primary)]" : "text-gray-400"}`} />
                        <span className={`font-bold ${formData.userType === "user" ? "text-[var(--color-primary)]" : "text-gray-500"}`}>
                          Patient / User
                        </span>
                      </div>
                    </label>

                    {/* Doctor Option */}
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="doctor"
                        checked={formData.userType === "doctor"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          formData.userType === "doctor"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-gray-100 bg-white hover:border-[var(--color-secondary)]/50"
                        }`}
                      >
                        <Stethoscope className={`w-6 h-6 ${formData.userType === "doctor" ? "text-[var(--color-primary)]" : "text-gray-400"}`} />
                        <span className={`font-bold ${formData.userType === "doctor" ? "text-[var(--color-primary)]" : "text-gray-500"}`}>
                          Doctor
                        </span>
                      </div>
                    </label>

                    {/* Hospital Option */}
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="hospital"
                        checked={formData.userType === "hospital"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                          formData.userType === "hospital"
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                            : "border-gray-100 bg-white hover:border-[var(--color-secondary)]/50"
                        }`}
                      >
                        <Building2 className={`w-6 h-6 ${formData.userType === "hospital" ? "text-[var(--color-primary)]" : "text-gray-400"}`} />
                        <span className={`font-bold ${formData.userType === "hospital" ? "text-[var(--color-primary)]" : "text-gray-500"}`}>
                          Hospital
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-slate-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[var(--color-primary)] text-white py-4 rounded-2xl font-bold hover:bg-[var(--color-secondary)] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[var(--color-primary)]/20 hover:-translate-y-1"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 animate-fade-in">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-green-800 font-bold">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;