import { Lightbulb, Target } from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/Navbar";
import { coreValues, teamMembers } from "../../utils";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <main className="container mx-auto px-4 sm:px-6 py-12">
          {/* --- New Hero Section with your Gradient --- */}
          <div className="relative text-center overflow-hidden rounded-3xl py-20 md:py-28 mb-16 shadow-[var(--color-shadow)]">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0b4f4a] via-[#1a756f] to-[#2a9b94]"></div>
            {/* Content on top of the gradient */}
            <div className="relative z-10 px-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
                India's Health Locker
              </h1>
              <div className="w-24 h-1.5 bg-white/50 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto leading-relaxed">
                <strong>MedLock</strong> is building a secure, centralized
                repository for every Indian's medical history.
              </p>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* --- Mission and Vision Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="relative p-8 bg-[var(--color-card-bg)] rounded-3xl shadow-[var(--color-shadow)] border-[var(--color-border)]">
                <Target className="w-12 h-12 text-[var(--color-secondary)] absolute -top-6 -left-6" />
                <h2 className="text-3xl font-bold text-[var(--color-card-text)] mb-4">
                  Our Mission
                </h2>
                <p className="text-[var(--color-card-secondary-text)] leading-loose">
                  To create a <strong>single, unified health repository</strong>{" "}
                  for every citizen of India. We eliminate scattered physical
                  files and fragmented digital reports, enabling patients and
                  doctors across the nation to access a complete medical history
                  securely and instantly.
                </p>
              </div>
              <div className="relative p-8 bg-[var(--color-card-bg)] rounded-3xl shadow-[var(--color-shadow)] border-[var(--color-border)]">
                <Lightbulb className="w-12 h-12 text-[var(--color-secondary)] absolute -top-6 -right-6" />
                <h2 className="text-3xl font-bold text-[var(--color-card-text)] mb-4">
                  Our Vision
                </h2>
                <p className="text-[var(--color-card-secondary-text)] leading-loose">
                  We envision a future of{" "}
                  <strong>"One Nation, One Health Record."</strong> A future
                  where your vital health information is available to an
                  authorized doctor anywhere in India, ensuring better emergency
                  care, informed diagnoses, and continuity of treatment for all.
                </p>
              </div>
            </div>

            {/* --- Core Values Section --- */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  Our Guiding Principles
                </h2>
                <p className="text-lg text-[var(--color-card-secondary-text)] mt-2">
                  The foundation upon which MedLock is built.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {coreValues.map((value, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-card-bg)] p-8 rounded-2xl text-center border-[var(--color-border)] shadow-[var(--color-shadow)] hover:scale-105 hover:shadow-xl transition-transform duration-300"
                  >
                    {value.icon}
                    <h3 className="text-2xl font-bold text-[var(--color-card-text)] mb-3">
                      {value.title}
                    </h3>
                    <p className="text-[var(--color-card-secondary-text)]">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* --- Meet the Team Section --- */}
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[var(--color-text)]">
                  The Team
                </h2>
                <p className="text-lg text-[var(--color-card-secondary-text)] mt-2">
                  The passionate minds driving India's healthcare revolution.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-[var(--color-card-bg)] rounded-2xl overflow-hidden shadow-[var(--color-shadow)] group"
                  >
                    <div className="relative">
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-teal-200">{member.role}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-[var(--color-card-secondary-text)]">
                        {member.bio}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUs;
