import React, { useState, useEffect, useMemo } from "react";
import { 
  Building, 
  Loader2, 
  Search, 
  MapPin, 
  Filter, 
  Stethoscope 
} from "lucide-react";
// Removed HeroSection as per request
import HospitalCard from "../../../components/HospitalCard";
import Pagination from "../../../components/Pagination";
import BookingModal from "../../../components/BookingModal";
import { fetchLocations } from "../../../utils/api";
import { hospitalSearch } from "../../../api/auth";

const token = localStorage.getItem("token");

const AppointmentBooking = () => {
  // --- Filter States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  // --- Data States ---
  const [locationData, setLocationData] = useState({});
  const [hospitals, setHospitals] = useState([]);

  // --- Loading States ---
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false);

  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // --- Theme Configuration ---
  const themeString = localStorage.getItem("theme");
  const themeObj = themeString ? JSON.parse(themeString) : null;
  const id = themeObj?.id;

  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  // 1. Fetch Location Data on Mount
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoadingLocations(true);
      const data = await fetchLocations();
      setLocationData(data);
      setIsLoadingLocations(false);
    };
    loadLocations();
  }, []);

  // 2. Debounce Search Term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. Fetch Hospitals Logic
  const fetchHospitals = async (
    currentState,
    currentDistrict,
    currentSearch,
  ) => {
    const params = new URLSearchParams();
    setIsLoadingHospitals(true);
    setCurrentPage(1); // Reset page on new fetch

    if (currentState) params.append("state", currentState);
    if (currentDistrict) params.append("district", currentDistrict);
    if (currentSearch) params.append("search", currentSearch);

    try {
      const res = await hospitalSearch(
        token,
        currentState,
        currentDistrict,
        currentSearch,
        id,
      );
      if (res?.status) {
        setHospitals(res.hospitals);
      } else {
        setHospitals([]); // Fallback to empty if status false
      }
    } catch (error) {
      console.error("Failed to fetch hospitals", error);
      setHospitals([]);
    } finally {
      setIsLoadingHospitals(false);
    }
  };

  useEffect(() => {
    fetchHospitals(selectedState, selectedDistrict, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedDistrict, debouncedSearch]);

  // Reset district when state changes
  useEffect(() => {
    setSelectedDistrict("");
  }, [selectedState]);

  // Pagination Logic
  const totalPages = Math.ceil(hospitals.length / itemsPerPage);
  const displayedHospitals = hospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Helper for Location Dropdowns
  const stateOptions = useMemo(() => Object.keys(locationData).sort(), [locationData]);
  const districtOptions = useMemo(() => 
    selectedState ? (locationData[selectedState] || []).sort() : [], 
    [selectedState, locationData]
  );

  return (
    <div 
      className="fade-in min-h-screen bg-slate-50 font-sans p-4 md:p-10 space-y-8"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-black tracking-tight text-primary">Book Appointment</h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Find and book consultations with top hospitals
            </p>
        </div>
        
        {/* Optional Header Action - purely visual to match previous UI */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-xs font-medium text-gray-500">
          <Stethoscope className="h-4 w-4 text-secondary" />
          <span>Verified Healthcare Providers</span>
        </div>
      </div>

      {/* --- REPLACED HERO SECTION WITH FILTER BAR --- */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col xl:flex-row gap-2 relative z-30">
        
        {/* Search Input */}
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search hospital name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-medium"
          />
        </div>

        <div className="hidden xl:block w-px bg-gray-200 my-2"></div>

        {/* Filters Group */}
        <div className="flex flex-col md:flex-row gap-2">
            
            {/* State Selection */}
            <div className="relative md:w-56 group">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
                <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    disabled={isLoadingLocations}
                    className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600 disabled:opacity-50"
                >
                    <option value="">All States</option>
                    {stateOptions.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                </select>
                {/* Custom chevron could go here, relying on browser default for now or add pointer-events-none icon right-4 */}
            </div>

            {/* District Selection */}
            <div className="relative md:w-56 group">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
                <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedState || isLoadingLocations}
                    className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <option value="">All Districts</option>
                    {districtOptions.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Result Count */}
        <div className="flex items-center justify-center px-6 py-2 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 whitespace-nowrap min-w-[100px]">
          {isLoadingHospitals ? (
            <Loader2 className="h-4 w-4 animate-spin text-secondary" />
          ) : (
            `${hospitals.length} found`
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="relative min-h-[400px]">
        
        {/* Loading State */}
        {isLoadingHospitals ? (
           <div className="flex flex-col justify-center items-center py-32 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-gray-100/50">
             <div className="bg-secondary/10 p-4 rounded-full mb-4">
               <Loader2 className="w-8 h-8 text-secondary animate-spin" />
             </div>
             <p className="text-gray-500 font-medium animate-pulse">
               Fetching connected hospitals...
             </p>
           </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedHospitals?.map((hospital, index) => (
                // Wrapper div to apply the hover/slide animation if HospitalCard doesn't support class injection
                <div key={index} className="group hover:-translate-y-2 transition-transform duration-300">
                    <HospitalCard
                      hospital={hospital}
                      onBook={setSelectedHospital}
                    />
                </div>
              ))}
            </div>

            {/* Empty State */}
            {hospitals.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors">
                   <Building className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No hospitals found</h3>
                <p className="font-medium text-sm mt-2 max-w-xs text-center">
                  Try adjusting your search criteria or location filters.
                </p>
                <button 
                   onClick={() => {
                     setSearchTerm("");
                     setSelectedState("");
                     setSelectedDistrict("");
                   }}
                   className="mt-6 text-sm font-bold text-secondary bg-secondary/10 px-6 py-2 rounded-xl hover:bg-secondary hover:text-white transition-all duration-300"
                >
                   Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {hospitals.length > 0 && (
              <div className="mt-8">
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
              </div>
            )}
          </>
        )}
      </div>

      {/* --- BOOKING MODAL --- */}
      {selectedHospital && (
        <BookingModal
          hospital={selectedHospital}
          onClose={() => setSelectedHospital(null)}
        />
      )}
    </div>
  );
};

export default AppointmentBooking;