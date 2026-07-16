import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp, ClipboardList, Users, Sparkles, Loader2, Calendar, 
  X, Check, Clock, Lock, Activity, Target, CircleDashed
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from "recharts";

export default function Dashboard() {
  // --- ROLE RESOLUTION ---
  const rawRole = localStorage.getItem("role")?.toLowerCase() || "admin";
  const isHospitalRole = rawRole === "hospital" || rawRole === "hp";
  const isDepartmentRole = rawRole === "department" || rawRole === "dp";
  const isAdminRole = !isHospitalRole && !isDepartmentRole;

  // Fetch from multiple possible localStorage keys just in case
  const initialHospId = localStorage.getItem("hospitalId") || localStorage.getItem("id") || "";
  const initialDeptId = localStorage.getItem("departmentId") || localStorage.getItem("id") || "";

  // Dynamic Display Names (Will auto-update if localStorage fails)
  const [displayHospName, setDisplayHospName] = useState(localStorage.getItem("hospitalName") || localStorage.getItem("name") || "Your Hospital Branch");
  const [displayDeptName, setDisplayDeptName] = useState(localStorage.getItem("departmentName") || localStorage.getItem("name") || "Your Department Wing");

  // --- FILTER STATES ---
  const [selectedHospitalId, setSelectedHospitalId] = useState(isAdminRole ? "all" : initialHospId);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(isDepartmentRole ? initialDeptId : "all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeframe, setTimeframe] = useState("week");

  // --- DATA STATES ---
  const [hospitals, setHospitals] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [dashboardData, setDashboardData] = useState({ 
    stats: { totalReports: 0, totalAppointments: 0, totalDocs: 0, totalReceps: 0, totalNurses: 0, avgGrowth: "0%" }, 
    chartData: [], specialtyData: [], activityData: [], radarData: [] 
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showReports, setShowReports] = useState(true);
  const [showAppointments, setShowAppointments] = useState(true);

  const theme = useMemo(() => ({ primary: "#0b4f4a", secondary: "#2a9b94", accent: "#d1e8e5" }), []);
  const COLORS = ["#0b4f4a", "#2a9b94", "#3dbbb3", "#7ccdc8", "#d1e8e5", "#a3dbd7", "#083a36", "#04201c"];

  // 1. Fetch Infrastructure & Auto-Fix LocalStorage Gaps
  useEffect(() => {
    const fetchInfrastructure = async () => {
      const token = localStorage.getItem("token");
      try {
        const [hRes, dRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/hospital/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/manage/department/", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (hRes.ok) {
          const hData = (await hRes.json()).hospitals || [];
          setHospitals(hData);
          
          // --- THE FIX: Auto-populate missing Hospital IDs for restricted roles ---
          if (isHospitalRole && hData.length > 0) {
            const actualId = String(hData[0].id || hData[0].Id);
            if (!selectedHospitalId || selectedHospitalId === "all" || selectedHospitalId === "") {
              setSelectedHospitalId(actualId);
            }
            if (displayHospName === "Your Hospital Branch") {
              setDisplayHospName(hData[0].name || hData[0].Name);
            }
          }
        }
        
        if (dRes.ok) {
          const dData = (await dRes.json()).departments || [];
          setAllDepartments(dData);

          // Auto-populate missing Department IDs
          if (isDepartmentRole && dData.length > 0) {
            const actualDeptId = String(dData[0].id || dData[0].Id);
            if (!selectedDepartmentId || selectedDepartmentId === "all" || selectedDepartmentId === "") {
              setSelectedDepartmentId(actualDeptId);
            }
            if (displayDeptName === "Your Department Wing") {
              setDisplayDeptName(dData[0].name || dData[0].Name);
            }
          }
        }
      } catch (err) {
        console.error("Infrastructure fetch failed:", err);
      }
    };
    fetchInfrastructure();
  }, [isHospitalRole, isDepartmentRole, selectedHospitalId, selectedDepartmentId, displayHospName, displayDeptName]);

  // 2. Fetch Dashboard Analytics
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Don't fetch if the ID hasn't been resolved yet
      if ((isHospitalRole && !selectedHospitalId) || (isDepartmentRole && !selectedDepartmentId)) return;

      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); 
        if (!token) throw new Error("No authentication token found.");

        const queryParams = new URLSearchParams({ timeframe });
        if (selectedHospitalId && selectedHospitalId !== "all") queryParams.append("hospital_id", selectedHospitalId);
        if (selectedDepartmentId && selectedDepartmentId !== "all") queryParams.append("department_id", selectedDepartmentId);
        if (fromDate) queryParams.append("from_date", fromDate);
        if (toDate) queryParams.append("to_date", toDate);

        const response = await fetch(`http://127.0.0.1:8000/api/dashboard/?${queryParams.toString()}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok || data.status === false) throw new Error(data.message || "Failed to fetch dashboard data");
        
        setDashboardData({
          stats: data.stats || { totalReports: 0, totalAppointments: 0, totalDocs: 0, totalReceps: 0, totalNurses: 0, avgGrowth: "0%" },
          chartData: data.chart_data?.length ? data.chart_data : [{ name: "Mon", reports: 0, appointments: 0 }],
          specialtyData: data.specialty_data?.length ? data.specialty_data : [{ name: "General", value: 1 }],
          activityData: data.activity_data?.length ? data.activity_data : [{ name: "Week 1", reports: 0 }],
          radarData: data.radar_data?.length ? data.radar_data : [
            { subject: "Speed", A: 100, fullMark: 150 }, { subject: "Accuracy", A: 100, fullMark: 150 },
            { subject: "Volume", A: 100, fullMark: 150 }, { subject: "Feedback", A: 100, fullMark: 150 }
          ]
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [selectedHospitalId, selectedDepartmentId, timeframe, fromDate, toDate, isHospitalRole, isDepartmentRole]);

  // Derived filtered departments (Now safely handles empty strings)
  const filteredDepartments = allDepartments.filter(d => 
    selectedHospitalId === "all" || !selectedHospitalId || String(d.hospital_id) === String(selectedHospitalId)
  );
  
  const totalStaff = (dashboardData.stats.totalDocs || 0) + (dashboardData.stats.totalReceps || 0) + (dashboardData.stats.totalNurses || 0);

  if (error) return <div className="p-8 text-red-500 font-bold bg-red-50 rounded-2xl m-8 border border-red-200">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans" style={{ "--primary": theme.primary, "--secondary": theme.secondary, "--accent": theme.accent }}>
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-700">
          <div>
            <div className="flex items-center gap-3 mb-2 text-primary">
              <div className="relative flex items-center justify-center w-10 h-10 bg-accent/30 rounded-xl">
                <CircleDashed size={28} className="absolute text-secondary animate-[spin_10s_linear_infinite]" />
                <Lock size={16} strokeWidth={3} className="text-primary z-10" />
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Unified Dashboard</h1>
            </div>
            <p className="text-slate-500 font-medium ml-14">Real-time analytics and cross-network telemetry mapping.</p>
          </div>

          <button onClick={() => { setIsGeneratingAi(true); setTimeout(() => setIsGeneratingAi(false), 2000); }} disabled={isGeneratingAi || isLoading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-secondary/10 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70">
            {isGeneratingAi ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />} Generate AI Insights
          </button>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="bg-white p-3 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col xl:flex-row items-center gap-3 animate-in fade-in duration-700">
          
          <div className="flex-1 w-full relative group">
            <label className="absolute -top-2 left-4 bg-white px-1 text-[9px] font-black uppercase tracking-widest text-slate-400 z-10">Network Branch</label>
            {isAdminRole ? (
              <select className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl pl-5 pr-10 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer appearance-none" value={selectedHospitalId} onChange={(e) => { setSelectedHospitalId(e.target.value); setSelectedDepartmentId("all"); }} disabled={isLoading}>
                <option value="all">Entire Hospital Network</option>
                {hospitals.map(h => <option key={h.id || h.Id} value={h.id || h.Id}>{h.name || h.Name}</option>)}
              </select>
            ) : (
              <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center gap-2 text-slate-400 cursor-not-allowed shadow-inner">
                <Lock size={14} className="shrink-0 text-slate-400" />
                <span className="text-sm font-bold truncate">{displayHospName}</span>
              </div>
            )}
            {isAdminRole && <ChevronIcon />}
          </div>

          <div className="flex-1 w-full relative group">
            <label className="absolute -top-2 left-4 bg-white px-1 text-[9px] font-black uppercase tracking-widest text-slate-400 z-10">Department Wing</label>
            {isDepartmentRole ? (
              <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center gap-2 text-slate-400 cursor-not-allowed shadow-inner">
                <Lock size={14} className="shrink-0 text-slate-400" />
                <span className="text-sm font-bold truncate">{displayDeptName}</span>
              </div>
            ) : (
              <select className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl pl-5 pr-10 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer appearance-none disabled:opacity-50" value={selectedDepartmentId} onChange={(e) => setSelectedDepartmentId(e.target.value)} disabled={isLoading || (selectedHospitalId === "all" && !isAdminRole)}>
                <option value="all">{selectedHospitalId === "all" && !isAdminRole ? "Select Branch First..." : "All Departments"}</option>
                {filteredDepartments.map(d => <option key={d.id || d.Id} value={d.id || d.Id}>{d.name || d.Name}</option>)}
              </select>
            )}
            {!isDepartmentRole && <ChevronIcon />}
          </div>

          <div className="flex-[1.5] w-full flex flex-col sm:flex-row items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 transition-colors focus-within:ring-2 focus-within:ring-secondary/20">
            <div className="flex-1 relative flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 w-full hover:border-secondary transition-colors group">
              <span className="text-[10px] font-black uppercase text-slate-400 mr-3 group-focus-within:text-secondary">From</span>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} disabled={isLoading} className="w-full text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer disabled:opacity-50" />
            </div>
            <div className="flex-1 relative flex items-center px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 w-full hover:border-secondary transition-colors group">
              <span className="text-[10px] font-black uppercase text-slate-400 mr-3 group-focus-within:text-secondary">To</span>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} disabled={isLoading} className="w-full text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer disabled:opacity-50" />
            </div>
            {(fromDate || toDate) && (
              <button onClick={() => { setFromDate(""); setToDate(""); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mr-1 hover:rotate-90"><X size={16} strokeWidth={3} /></button>
            )}
          </div>
        </div>

        {/* --- STATS ROW --- */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <StatCard label="Growth" value={dashboardData.stats.avgGrowth} trend="Calculated" icon={<TrendingUp className="w-5 h-5" />} color="emerald" />
          <StatCard label="Total Reports" value={dashboardData.stats.totalReports?.toLocaleString() || 0} trend="Active" icon={<ClipboardList className="w-5 h-5" />} color="teal" />
          <StatCard label="Appointments" value={dashboardData.stats.totalAppointments?.toLocaleString() || 0} trend="Scheduled" icon={<Calendar className="w-5 h-5" />} color="sky" />
          <StatCard label="Total Staff" value={totalStaff.toLocaleString()} trend="Active" icon={<Users className="w-5 h-5" />} color="indigo" />
        </div>

        {/* --- MAIN GRAPH --- */}
        <div className={`bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Health Grid Growth</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                {["week", "month", "year"].map((t) => (
                  <button key={t} onClick={() => setTimeframe(t)} disabled={isLoading} className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${timeframe === t ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"}`}>{t}</button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowReports(!showReports)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border ${showReports ? "bg-secondary text-white border-secondary" : "bg-white text-slate-400 border-slate-100"}`}>{showReports && <Check size={12} />} Reports</button>
                <button onClick={() => setShowAppointments(!showAppointments)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase border ${showAppointments ? "bg-primary text-white border-primary" : "bg-white text-slate-400 border-slate-100"}`}>{showAppointments && <Check size={12} />} Appointments</button>
              </div>
            </div>
          </div>

          <div className="h-[450px] w-full">
            {isLoading && dashboardData.chartData.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.chartData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient>
                    <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.2} /><stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 800, fill: "#64748b" }} dy={15} />
                  <RechartsTooltip contentStyle={{ borderRadius: "24px", border: "none", backgroundColor: "#fff", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", padding: "20px" }} />
                  {showReports && <Area type="monotone" dataKey="reports" stroke="var(--primary)" strokeWidth={5} fillOpacity={1} fill="url(#colorReports)" />}
                  {showAppointments && <Area type="monotone" dataKey="appointments" stroke="var(--secondary)" strokeWidth={5} fillOpacity={1} fill="url(#colorAppts)" />}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* --- SECONDARY CHARTS GRID --- */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
          <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary transition-transform duration-300 group-hover:translate-x-1">Volume Analysis</h3>
              <Activity className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-secondary" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardData.activityData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} width={30} />
                  <RechartsTooltip cursor={{ fill: 'var(--accent)', opacity: 0.3 }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="reports" fill="var(--secondary)" radius={[4, 4, 4, 4]} barSize={25} className="transition-all duration-300 hover:opacity-90" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
            <h3 className="text-lg font-bold text-primary mb-6 transition-transform duration-300 group-hover:translate-x-1">Specialty Distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dashboardData.specialtyData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {dashboardData.specialtyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary transition-transform duration-300 group-hover:translate-x-1">Efficiency Index</h3>
              <Target className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-secondary" />
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={dashboardData.radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 9, fontWeight: 600 }} />
                  <Radar name="System Average" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.6} />
                  <RechartsTooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronIcon = () => (
  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

function StatCard({ label, value, trend, icon, color }) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    sky: "bg-sky-50 text-sky-600 border-sky-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border transition-all duration-300 border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${colorClasses[color]} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>{icon}</div>
        <div className={`text-[9px] font-black ${colorClasses[color]} px-2.5 py-1 rounded-full uppercase tracking-widest`}>{trend}</div>
      </div>
      <div>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}