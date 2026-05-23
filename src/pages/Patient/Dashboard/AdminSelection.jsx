import { useState, useEffect } from "react";
import { getAdmins } from "../../../api/auth"; // Removed unused imports
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react"; // Added Search icon
import { useTheme } from "../../../utils/ThemeProvider";

const AdminSelection = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const { refreshThemeForPatient } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const response = await getAdmins();
        if (!response.status) {
          throw new Error("Failed to fetch healthcare providers");
        }
        setAdmins(response.admins);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const onSelect = (admin) => {
    refreshThemeForPatient(admin);
    navigate("/patient/dashboard");
    localStorage.setItem("adminSelection", true);
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b4f4a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="text-white animate-pulse text-xl font-medium">
            Loading Providers...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b4f4a] flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl backdrop-blur-sm text-red-200 text-center max-w-md mx-4">
          <p className="text-2xl font-bold mb-2">Connection Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b4f4a] via-[#166660] to-[#2a9b94] flex flex-col items-center p-6 md:p-12 overflow-y-auto min-w-full">
      
      {/* Header Section */}
      <div className="text-center mb-10 w-full max-w-4xl animate-in slide-in-from-top-10 duration-700">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-sm">
          Select Healthcare Provider
        </h1>
        <p className="text-cyan-50/80 text-lg mb-8">
          Choose a medical group to access your secure dashboard.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-cyan-200 group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search provider by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 focus:bg-white/20 focus:border-transparent backdrop-blur-sm transition-all duration-300"
          />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12 animate-in fade-in duration-1000 delay-200 fill-mode-backwards">
        {filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin, index) => (
            <div
              key={index}
              onClick={() => onSelect(admin)}
              className="group relative bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/20 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center"
            >
              {/* Card Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Logo Container */}
              <div className="w-24 h-24 mb-4 relative z-10">
                <div className="w-full h-full rounded-full bg-white/90 shadow-lg flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-300 ease-out">
                  <img
                    src={admin.logo}
                    alt={admin.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        "https://img.icons8.com/fluency/96/hospital.png";
                    }}
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center z-10">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-50 transition-colors mb-1">
                  {admin.name}
                </h3>
                <span className="inline-block text-xs font-medium text-cyan-200/80 border border-cyan-200/20 px-2 py-1 rounded-full group-hover:bg-cyan-500/20 group-hover:text-cyan-100 transition-all">
                  Click to Select
                </span>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="col-span-full text-center py-12 animate-in fade-in">
            <div className="bg-white/5 inline-block p-6 rounded-full mb-4">
              <Search className="w-12 h-12 text-white/30" />
            </div>
            <p className="text-xl text-white/60 font-medium">
              No providers found matching "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSelection;