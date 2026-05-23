import React, { useEffect, useState } from "react";
// Ensure this path matches your project structure
import { getPartners } from "../../api/auth";

const BRAND_GRADIENT = "from-teal-500 to-teal-600";

const CarouselItem = ({ company }) => (
  <div className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-105 transition-all duration-300 flex flex-col mb-4 border border-gray-100">
    <div className={`h-2 bg-gradient-to-r ${BRAND_GRADIENT}`}></div>
    <div className="p-6 flex-grow">
      <div className="flex items-center space-x-4">
        <img
          src={company.Logo__c || "https://via.placeholder.com/150"}
          alt={company.Name}
          className="w-16 h-16 rounded-full object-cover border-2 border-teal-500/10"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold truncate text-gray-800">
            {company.Name}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2">
            {company.Description__c || "Partner Description"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex text-teal-500">★★★★★</div>
        <button
          onClick={() => window.open(company.Website__c, "_blank")}
          className="text-teal-600 hover:text-teal-700 font-medium text-sm"
        >
          View Profile
        </button>
      </div>
    </div>
  </div>
);

const CompanyCarousel = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPartners() {
      try {
        const res = await getPartners();
        if (res?.status) {
          setPartners(res.partners);
        }
      } catch (error) {
        console.error("Public fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPartners();
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading Partners...</div>;
  if (!partners || partners.length === 0) return null;

  // Triplicate the list to ensure the loop is invisible to the eye
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <div className="relative w-full overflow-hidden py-10 bg-white">
      {/* The 'animate-scroll-infinite' class handles the movement. 
          The 'hover:[animation-play-state:paused]' stops it when someone looks at a card.
      */}
      <div className="flex w-max animate-scroll-infinite space-x-6 px-6 hover:[animation-play-state:paused] will-change-transform">
        {duplicatedPartners.map((partner, index) => (
          <CarouselItem key={`${partner.id || index}-${index}`} company={partner} />
        ))}
      </div>

      {/* Side Fades - Cleaned up to match a white background */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default CompanyCarousel;