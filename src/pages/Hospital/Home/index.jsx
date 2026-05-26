import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/footer";

const Home = () => {
  const cards = [
    {
      title: "Login as a Doctor!",
      description: "Access patient records and manage.",
      imgSrc: "PATIENT.png",
      link: "/login/doctor",
    },
    {
      title: "Login as a Hospital Head!",
      description: "Learn about our mission and team of experts.",
      imgSrc: "HOSPITAL.png",
      link: "/login/hospital",
    },
    {
      title: "Login as a Receptionist!",
      description: "Learn about our mission and team of experts.",
      imgSrc: "HOSPITAL.png",
      link: "/login/receptionist",
    },
  ];
  return (
    <div
      className={`font-sans antialiased text-gray-800 bg-[var(--color-bg)] min-h-screen`}
    >
      <Navbar />

      {/* Main content container */}
      <main className="container  mx-auto px-6 py-12 ">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-teal-900 mb-12">
          Welcome Back Hospital Hands
        </h1>
        {/* Two Card Section, centered and responsive */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {cards.map((card, index) => {
            return (
              <Link key={index} to={card.link} className="w-full max-w-sm">
                <div className="bg-[var(--color-card-bg)] p-8 rounded-2xl shadow-xl flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300 h-full">
                  <img
                    src={card.imgSrc}
                    alt={card.title}
                    className="w-24 h-24 mb-4"
                  />
                  <h3 className="text-2xl font-semibold text-[var(--color-card-text)]">
                    {card.title}
                  </h3>
                  <p className="text-[var(--color-card-secondary-text)] mt-2">
                    {card.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
