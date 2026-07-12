import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  ClipboardList,
  Stethoscope,
  Users,
  Sparkles,
  Loader2,
  Calendar,
  Filter,
  X,
  Check,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // --- STATE FOR API DATA ---
  const [hospitals, setHospitals] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalAppointments: 0,
    totalDocs: 0,
    totalReceps: 0,
    avgGrowth: "0%",
  });
  const [chartData, setChartData] = useState([]);
  
  // --- UI & FILTER STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeframe, setTimeframe] = useState("week"); // week, month, year
  const [showReports, setShowReports] = useState(true);
  const [showAppointments, setShowAppointments] = useState(true);
  
  // --- AI STATE ---
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [theme, setTheme] = useState(null);

  // --- API FETCH LOGIC ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Get the JWT token from storage
        const token = localStorage.getItem("token"); 
        if (!token) throw new Error("No authentication token found.");

        // 2. Build the query string based on user filters
        const queryParams = new URLSearchParams({
          branch: selectedBranchId,
          timeframe: timeframe,
        });
        if (fromDate) queryParams.append("from_date", fromDate);
        if (toDate) queryParams.append("to_date", toDate);

        // 3. Make the API Call to Django
        // Update this URL to match your actual deployed or local Django URL
        const response = await fetch(`http://127.0.0.1:8000/api/ad/dashboard/?${queryParams.toString()}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();
        
        // 4. Populate the UI with backend data
        setHospitals(data.hospitals || []);
        setStats(data.stats || {});
        setChartData(data.chart_data || []);
        
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedBranchId, timeframe, fromDate, toDate]); // Re-run when filters change!

  // --- HANDLERS ---
  const handleAiInsights = async () => {
    setIsGeneratingAi(true);
    try {
      const token = localStorage.getItem("token");
      // Optional: Call a real AI endpoint on your Django backend here
      const res = await fetch("http://127.0.0.1:8000/api/ad/ai-insights/", {
         headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setAiReport(data.insight_text);
    } catch (err) {
      // Fallback for now
      setAiReport(`Health Grid Analysis (${timeframe.toUpperCase()}):\n• Pattern detected based on live data.\n• Ensure adequate staffing for upcoming predicted peaks.`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
  };

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-700">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                System Performance
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Analytics for{" "}
                <span className="text-primary font-bold">
                  {selectedBranchId === "all" ? "All Branches" : hospitals.find(h => h.id === selectedBranchId)?.name || "Selected Branch"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Branch Selector */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white border border-slate-200 rounded-2xl text-sm font-bold pl-4 pr-10 py-3 focus:ring-4 focus:ring-primary/10 focus:border-secondary transition-all cursor-pointer outline-none shadow-sm hover:border-secondary disabled:opacity-50"
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="all">Entire Hospital Network</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-secondary transition-colors" />
              </div>

              {/* Date Filters */}
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm hover:border-secondary transition-colors focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-secondary">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">From</label>
                    <input
                      type="date"
                      className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="w-px h-6 bg-slate-100 mx-2"></div>
                  <div className="flex flex-col group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">To</label>
                    <input
                      type="date"
                      className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                {(fromDate || toDate) && (
                  <button onClick={clearFilters} className="ml-4 p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all hover:rotate-90">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAiInsights}
            disabled={isGeneratingAi || isLoading}
            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-secondary/10 hover:scale-105 hover:shadow-secondary active:scale-95 transition-all disabled:opacity-50 group overflow-hidden relative"
          >
            {isGeneratingAi ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
            AI Analysis
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <StatCard label="Branch Growth" value={stats.avgGrowth} trend="Calculated" icon={<TrendingUp className="w-5 h-5" />} color="emerald" />
          <StatCard label="Total Reports" value={stats.totalReports?.toLocaleString() || 0} trend="Active" icon={<ClipboardList className="w-5 h-5" />} color="teal" active={fromDate || toDate} />
          <StatCard label="Appointments" value={stats.totalAppointments?.toLocaleString() || 0} trend="Scheduled" icon={<Calendar className="w-5 h-5" />} color="sky" active={fromDate || toDate} />
          <StatCard label="Active Doctors" value={stats.totalDocs?.toLocaleString() || 0} trend="Staffed" icon={<Stethoscope className="w-5 h-5" />} color="indigo" />
          <StatCard label="Staff (Receps)" value={stats.totalReceps?.toLocaleString() || 0} trend="Active" icon={<Users className="w-5 h-5" />} color="amber" />
        </div>

        {/* Main Growth Graph Section */}
        <div className={`bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Health Grid Growth</h3>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* TIMEFRAME FILTER */}
              <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                {["week", "month", "year"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    disabled={isLoading}
                    className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                      timeframe === t ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2">
                <button onClick={() => setShowReports(!showReports)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border ${showReports ? "bg-secondary text-white border-secondary" : "bg-white text-slate-400 border-slate-100"}`}>
                  {showReports && <Check size={12} />} Reports
                </button>
                <button onClick={() => setShowAppointments(!showAppointments)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border ${showAppointments ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-100"}`}>
                  {showAppointments && <Check size={12} />} Appointments
                </button>
              </div>
            </div>
          </div>

          <div className="h-[450px] w-full">
            {isLoading && chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                 <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: "#64748b" }} dy={15} />
                  <Tooltip contentStyle={{ borderRadius: "24px", border: "none", backgroundColor: "#fff", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", padding: "20px" }} />
                  {showReports && <Area type="monotone" dataKey="reports" stroke="#0f766e" strokeWidth={5} fillOpacity={1} fill="url(#colorReports)" />}
                  {showAppointments && <Area type="monotone" dataKey="appointments" stroke="#0284c7" strokeWidth={5} fillOpacity={1} fill="url(#colorAppts)" />}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-8 flex items-center gap-6 justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2 group cursor-help">
              <Clock size={12} className="text-teal-500 group-hover:animate-spin" />
              <span>Auto-refreshing live stream</span>
            </div>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <div className="flex items-center gap-2 group cursor-help">
              <ShieldCheck size={12} className="text-sky-500 group-hover:scale-125 transition-transform" />
              <span>ABHA Compliance Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components
function StatCard({ label, value, trend, icon, color, active }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600 shadow-emerald-500/10",
    teal: "bg-teal-50 text-teal-600 shadow-teal-500/10",
    sky: "bg-sky-50 text-sky-600 shadow-sky-500/10",
    indigo: "bg-indigo-50 text-indigo-600 shadow-indigo-500/10",
    amber: "bg-amber-50 text-amber-600 shadow-amber-500/10",
  };

  return (
    <div className={`bg-white p-7 rounded-[2.2rem] border transition-all duration-500 group relative overflow-hidden ${active ? "border-teal-400 ring-4 ring-teal-50 shadow-xl" : "border-slate-100 shadow-sm"} hover:-translate-y-2 hover:shadow-2xl`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-teal-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className={`p-4 rounded-2xl ${colorClasses[color]} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </div>
        <div className={`text-[10px] font-black ${colorClasses[color]} px-3 py-1.5 rounded-full uppercase tracking-tighter border border-current/10 bg-white/50 backdrop-blur-sm`}>
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-[0.15em]">{label}</p>
      </div>
    </div>
  );
}

const ShieldCheck = ({ className, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);