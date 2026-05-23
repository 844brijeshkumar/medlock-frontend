import React, { useState } from "react";
import {
  Send,
  Phone,
  Mail,
  MapPin,
  User,
  Stethoscope,
  Building2,
} from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";

// The main App component containing all logic and UI
const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "user", // Default value
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        {/* Contact Section */}
        <main className="container mx-auto px-3 sm:px-6 py-12">
          <div className="max-w-5xl mx-auto bg-[var(--color-card-bg)] backdrop-blur-md p-5 md:p-16 rounded-3xl shadow-[var(--color-shadow)] border border-[var(--color-border)]">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold gradient-text mb-4 tracking-tight">
                Contact Us
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-[var(--color-card-secondary-text)] max-w-2xl mx-auto leading-relaxed">
                We'd love to hear from you. Reach out to our team for any
                inquiries about our medical report system.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="p-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card-bg)]">
                  <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-6">
                    Get in Touch
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--color-card-text)] text-lg">
                          Phone
                        </h4>
                        <p className="text-[var(--color-card-secondary-text)] text-lg">
                          +1 (123) 456-7890
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--color-card-text)] text-lg">
                          Email
                        </h4>
                        <p className="text-[var(--color-card-secondary-text)] text-lg">
                          contact@medlock.dev
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 group">
                      <div className="w-12 h-12 bg-[var(--color-secondary)] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[var(--color-card-text)] text-lg">
                          Address
                        </h4>
                        <p className="text-[var(--color-card-secondary-text)] text-lg">
                          456 Tech Lane, Suite 789
                          <br />
                          Dev City, 54321
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl shadow-[var(--color-shadow)]">
                  {/* Placeholder for the medical team image */}
                  <img
                    src="https://placehold.co/800x600/60a5fa/ffffff?text=Medical+Team"
                    alt="Medical team working together"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-lg font-semibold">
                      Professional Medical Care
                    </p>
                    <p className="text-sm opacity-90">
                      Trusted by healthcare professionals
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-[var(--color-card-bg)] sm:p-8 rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-6">
                  Send us a Message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-bold text-[var(--color-card-text)] mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[var(--color-border)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 bg-[var(--color-card-bg)]"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold text-[var(--color-card-text)] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[var(--color-border)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 bg-[var(--color-card-bg)]"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--color-card-text)] mb-3">
                      I am a...
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.userType === "user"
                              ? "border-[var(--color-primary)] bg-[var(--color-border)] shadow-lg"
                              : "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-primary)]"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <User
                              className={`w-6 h-6 ${
                                formData.userType === "user"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-card-secondary-text)]"
                              }`}
                            />
                            <span
                              className={`font-semibold ${
                                formData.userType === "user"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-card-secondary-text)]"
                              }`}
                            >
                              User
                            </span>
                          </div>
                        </div>
                      </label>
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
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.userType === "doctor"
                              ? "border-[var(--color-primary)] bg-[var(--color-border)] shadow-lg"
                              : "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-primary)]"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Stethoscope
                              className={`w-6 h-6 ${
                                formData.userType === "doctor"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-card-secondary-text)]"
                              }`}
                            />
                            <span
                              className={`font-semibold ${
                                formData.userType === "doctor"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-card-secondary-text)]"
                              }`}
                            >
                              Doctor
                            </span>
                          </div>
                        </div>
                      </label>
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
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            formData.userType === "hospital"
                              ? "border-[var(--color-primary)] bg-[var(--color-border)] shadow-lg"
                              : "border-[var(--color-border)] bg-[var(--color-card-bg)] hover:border-[var(--color-primary)]"
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <Building2
                              className={`w-6 h-6 ${
                                formData.userType === "hospital"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-card-secondary-text)]"
                              }`}
                            />
                            <span
                              className={`font-semibold ${
                                formData.userType === "hospital"
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-card-secondary-text)]"
                              }`}
                            >
                              Hospital
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-bold text-[var(--color-card-text)] mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[var(--color-border)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 bg-[var(--color-card-bg)]"
                      placeholder="What can we help you with?"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-bold text-[var(--color-card-text)] mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-[var(--color-border)] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-300 bg-[var(--color-card-bg)] resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="btn-primary w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-[var(--color-shadow)] text-base font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-[var(--color-hover)]"
                    >
                      <Send className="mr-3 w-5 h-5" />
                      Send Message
                    </button>
                  </div>
                  {isSubmitted && (
                    <div className="mt-6 p-6 bg-[var(--color-border)] border-2 border-[var(--color-primary)] rounded-2xl">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <p className="text-[var(--color-card-text)] font-bold text-lg">
                          Thank you! Your message has been sent successfully.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default App;