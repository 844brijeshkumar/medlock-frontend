import React, { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  TrendingUp,
  Building2,
  CheckCircle2,
  XCircle,
  Search,
  Activity,
  ArrowRight,
  Filter,
} from "lucide-react";

export default function BranchList() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitalData, setHospitalData] = useState([]);
  
  // Added Loading & Error States based on your new pattern
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- THEME CONFIGURATION ---
  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  // --- API FETCH LOGIC ---
  useEffect(() => {
    const fetchHospitalsData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Get the JWT token from storage inside the function
        const token = localStorage.getItem("token"); 
        if (!token) throw new Error("No authentication token found.");

        // 2. Make the API Call to Django
        const response = await fetch(`http://127.0.0.1:8000/api/ad/branches/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch branch data");
        }

        const data = await response.json();
        
        // 3. Populate the UI with backend data
        setHospitalData(data.hospitals || []);
        
      } catch (err) {
        console.error("Branch fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHospitalsData();
  }, []);

  // Filter Logic
  const filteredHospitals = hospitalData?.filter((h) => {
    const matchesFilter = filter === "All" || h.Status__c === filter;
    const matchesSearch =
      h.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.District__r?.Name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div
      className="min-h-screen bg-slate-50 pb-20 font-sans relative"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-12 pb-24 px-4 sm:px-8 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-sm">
                <Activity size={14} className="text-teal-300 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                  Live Network Status
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Branch Directory
              </h1>
              <p className="text-teal-50/80 text-lg font-medium max-w-xl">
                Real-time management and performance auditing for{" "}
                <span className="text-white font-bold">
                  {hospitalData?.length || 0}
                </span>{" "}
                interconnected healthcare facilities.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <p className="text-teal-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                  Total Reports Aggregated
                </p>
                <p className="text-4xl font-black text-white">
                  4,790{" "}
                  <span className="text-sm font-bold text-teal-300 bg-teal-900/30 px-2 py-1 rounded-lg ml-2">
                    +12%
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- FILTER & SEARCH BAR --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 -mt-10 z-20 relative">
        <div className="bg-white rounded-[2rem] p-3 shadow-xl shadow-secondary/10 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto p-2">
            <div className="bg-gray-50 p-1.5 rounded-xl flex gap-1 w-full sm:w-auto border border-gray-100">
              {["All", "Active", "Inactive"].map((f, index) => (
                <button
                  key={index}
                  onClick={() => setFilter(f)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wide transition-all duration-300 ${
                    filter === f
                      ? "bg-white text-primary shadow-md transform scale-105"
                      : "text-gray-400 hover:text-secondary hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <Filter size={14} className="text-secondary" />
              {filteredHospitals?.length || 0} Branches Found
            </div>
          </div>

          <div className="relative w-full lg:w-96 group mr-2">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-secondary transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name or district..."
              className="w-full bg-gray-50 border-transparent focus:bg-white rounded-2xl pl-14 pr-6 py-4 text-sm font-bold text-gray-700 outline-none focus:ring-4 focus:ring-secondary/10 transition-all border group-hover:border-secondary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- BRANCH GRID / STATES --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 mt-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Activity className="animate-spin text-primary" size={48} />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 rounded-3xl p-10 text-center border border-red-200">
            <h3 className="text-xl font-bold mb-2">Failed to load branches</h3>
            <p>{error}</p>
          </div>
        ) : filteredHospitals?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredHospitals?.map((h, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden"
              >
                {/* Top Accent Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Status Badge */}
                <div className="absolute top-8 right-8 z-20">
                  {h.Status__c === "Active" ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 shadow-sm">
                      <CheckCircle2 size={12} className="animate-pulse" />{" "}
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-wider border border-gray-100 shadow-sm">
                      <XCircle size={12} /> Inactive
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start gap-5 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-br from-primary to-secondary p-5 rounded-3xl shadow-lg shadow-secondary/20 group-hover:scale-110 transition-transform duration-500 shrink-0">
                      <Building2 className="text-white" size={32} />
                    </div>

                    {/* --- MARQUEE CONTAINER FOR HOSPITAL NAME --- */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex w-max group-hover:animate-marquee">
                        <h3 className="font-black text-2xl text-gray-900 group-hover:text-primary transition-colors pr-10">
                          {h.Name}
                        </h3>
                        {/* Duplicate Name for Seamless Loop Effect */}
                        <h3
                          className="font-black text-2xl text-gray-900 group-hover:text-primary transition-colors pr-10"
                          aria-hidden="true"
                        >
                          {h.Name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-400 mt-1">
                        <MapPin size={14} className="text-secondary shrink-0" />
                        <span className="text-xs font-bold tracking-tight truncate">
                          {h.State__r?.Name}, {h.District__r?.Name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    <BranchStat
                      label="Reports"
                      value={h.counts?.reports || 0}
                      color="teal"
                    />
                    <BranchStat
                      label="Doctors"
                      value={h.counts?.doctors || 0}
                      color="indigo"
                    />
                    <BranchStat
                      label="Reception"
                      value={h.counts?.receptionists || 0}
                      color="amber"
                    />
                  </div>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-10 h-10 rounded-full bg-gray-100 border-4 border-white flex items-center justify-center overflow-hidden shadow-sm"
                          >
                            <img
                              src={`https://i.pravatar.cc/100?u=${h.id}${i}`}
                              alt="User"
                              className="w-full h-full object-cover grayscale opacity-70"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        +
                        {Math.max(
                          0,
                          (h.counts?.doctors || 0) +
                            (h.counts?.receptionists || 0),
                        )}{" "}
                        Staff
                      </div>
                    </div>

                    <button className="bg-white border border-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-sm hover:bg-primary hover:text-white hover:border-transparent transition-all group/btn">
                      Analytics{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>

                {/* Growth Indicator Overlay */}
                <div className="absolute -bottom-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <TrendingUp size={120} className="text-secondary" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl shadow-gray-100 border border-gray-100 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 mb-6">
              <Building2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">
              No Matching Branches
            </h3>
            <p className="text-gray-400 text-sm font-medium max-w-sm mx-auto mb-8">
              Adjust your search or clear filters to view available healthcare
              centers.
            </p>
            <button
              onClick={() => {
                setFilter("All");
                setSearchTerm("");
              }}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BranchStat({ label, value, color }) {
  const styles = {
    teal: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  };

  return (
    <div
      className={`rounded-2xl p-3 text-center border transition-all cursor-default hover:bg-white hover:shadow-md ${styles[color]}`}
    >
      <p className="text-xl font-black leading-tight">{value}</p>
      <p className="text-[9px] font-bold uppercase tracking-widest opacity-70 mt-1">
        {label}
      </p>
    </div>
  );
}