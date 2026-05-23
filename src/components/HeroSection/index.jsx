import React from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Filter,
  Activity,
  ShieldCheck,
  Clock,
} from "lucide-react";
// import { LocationData } from '../types';

const HeroSection = ({
  searchTerm,
  setSearchTerm,
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  locationData,
  isLoadingLocations,
}) => {
  const availableDistricts = selectedState ? locationData[selectedState] : [];

  return (
    <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-teal-600 pb-32 pt-20 px-4 sm:px-6 lg:px-8 shadow-2xl overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/50 border border-teal-400/30 backdrop-blur-sm text-teal-100 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live OPD Status: Online</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Medlock <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">
              Centerlize Healthcare System
            </span>
          </h1>

          <p className="text-lg md:text-xl text-teal-50 max-w-2xl mx-auto font-light leading-relaxed opacity-90 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Direct integration with government hospital servers.
            <span className="font-semibold text-white">
              {" "}
              Zero waiting time. Instant digital receipts.
            </span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-teal-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Govt. Verified
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors cursor-default">
              <Clock className="w-4 h-4 text-emerald-300" />
              Real-time Slots
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-2 rounded-3xl shadow-xl shadow-teal-900/20 max-w-5xl mx-auto flex flex-col md:flex-row gap-2 items-center transform translate-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          {/* Search Input */}
          <div className="relative flex-grow w-full md:w-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-4 rounded-2xl bg-gray-50 border-0 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6 transition-all hover:bg-white font-medium"
              placeholder="Search hospitals, doctors, or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex w-full md:w-auto gap-2">
            {/* State Select */}
            <div className="relative w-full md:w-48 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-4 rounded-2xl bg-gray-50 border-0 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6 appearance-none cursor-pointer hover:bg-white transition-all font-medium "
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                disabled={isLoadingLocations}
              >
                <option value="">
                  {isLoadingLocations ? "Loading..." : "All States"}
                </option>
                {Object.keys(locationData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>

            {/* District Select */}
            <div className="relative w-full md:w-48 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
              </div>
              <select
                className={`block w-full pl-10 pr-10 py-4 rounded-2xl bg-gray-50 border-0 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-teal-500 sm:text-sm sm:leading-6 appearance-none cursor-pointer hover:bg-white transition-all font-medium  ${
                  !selectedState ? "opacity-50 cursor-not-allowed" : ""
                }`}
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedState}
              >
                <option value="">
                  {selectedState ? "All Districts" : "District"}
                </option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-2xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center active:scale-95 group">
            <Filter className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
