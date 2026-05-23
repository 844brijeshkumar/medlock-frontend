import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  ClipboardList,
  Stethoscope,
  Users,
  ArrowUpRight,
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
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- MOCK DATA GENERATORS ---
const INITIAL_HOSPITALS = [
  {
    id: "h1",
    name: "Apollo Hospitals",
    reports: 1240,
    appointments: 850,
    doctors: 45,
    receptionists: 12,
    growth: "14.2%",
  },
  {
    id: "h2",
    name: "City Diagnostic Center",
    reports: 890,
    appointments: 420,
    doctors: 20,
    receptionists: 8,
    growth: "9.5%",
  },
  {
    id: "h3",
    name: "Wellness Clinic",
    reports: 560,
    appointments: 310,
    doctors: 12,
    receptionists: 5,
    growth: "12.1%",
  },
];

const DATA_VIEWS = {
  week: [
    { name: "Mon", reports: 400, appointments: 240 },
    { name: "Tue", reports: 300, appointments: 450 },
    { name: "Wed", reports: 500, appointments: 980 },
    { name: "Thu", reports: 278, appointments: 390 },
    { name: "Fri", reports: 450, appointments: 480 },
    { name: "Sat", reports: 239, appointments: 680 },
    { name: "Sun", reports: 349, appointments: 430 },
  ],
  month: [
    { name: "Week 1", reports: 1200, appointments: 900 },
    { name: "Week 2", reports: 1500, appointments: 1100 },
    { name: "Week 3", reports: 1100, appointments: 1300 },
    { name: "Week 4", reports: 1800, appointments: 1400 },
  ],
  year: [
    { name: "Jan", reports: 4500, appointments: 3200 },
    { name: "Feb", reports: 4200, appointments: 3100 },
    { name: "Mar", reports: 4800, appointments: 3500 },
    { name: "Apr", reports: 5100, appointments: 3800 },
    { name: "May", reports: 4900, appointments: 3700 },
    { name: "Jun", reports: 5500, appointments: 4100 },
  ],
};

export default function Dashboard() {
  const [hospitals] = useState(INITIAL_HOSPITALS);
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState(null);

  // Date Filter State
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [timeframe, setTimeframe] = useState("week"); // week, month, year

  // Chart visibility toggles
  const [showReports, setShowReports] = useState(true);
  const [showAppointments, setShowAppointments] = useState(true);

  // Logic: Calculate stats for the summary cards
  const stats = useMemo(() => {
    let baseData =
      selectedBranchId === "all"
        ? hospitals
        : [hospitals.find((h) => h.id === selectedBranchId)].filter(Boolean);

    const totalDocs = baseData.reduce((acc, h) => acc + h.doctors, 0);
    const totalReceps = baseData.reduce((acc, h) => acc + h.receptionists, 0);
    const avgGrowth =
      selectedBranchId === "all" ? "11.8%" : baseData[0]?.growth || "0%";

    // Simulate filtering transactional data based on selected range or timeframe
    const dateFilterActive = fromDate || toDate;
    let multiplier = 1.0;
    if (dateFilterActive) multiplier = 0.65;
    else if (timeframe === "month") multiplier = 4.0;
    else if (timeframe === "year") multiplier = 48.0;

    const totalReports = Math.round(
      baseData.reduce((acc, h) => acc + h.reports, 0) * multiplier,
    );
    const totalAppointments = Math.round(
      baseData.reduce((acc, h) => acc + h.appointments, 0) * multiplier,
    );

    return {
      totalReports,
      totalAppointments,
      totalDocs,
      totalReceps,
      avgGrowth,
    };
  }, [selectedBranchId, hospitals, fromDate, toDate, timeframe]);

  // Logic: Prepare data for the chart
  const filteredChartData = useMemo(() => {
    return DATA_VIEWS[timeframe];
  }, [timeframe]);

  const handleAiInsights = async () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setAiReport(`Health Grid Analysis (${timeframe.toUpperCase()}):
      • Pattern: ${timeframe === "year" ? "Steady growth across H1" : "Mid-week surge detected"}.
      • Metric Focus: ${showReports && showAppointments ? "Correlation between reports and appointments is 0.82" : "Reviewing isolated metrics"}.
      • Recommendation: Increase staff capacity during the next peak identified in ${filteredChartData[filteredChartData.length - 1].name}.`);
      setIsGeneratingAi(false);
    }, 1200);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900">
                System Performance
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                Analytics for{" "}
                <span className="text-primary font-bold">
                  {selectedBranchId === "all"
                    ? "All Branches"
                    : "Selected Branch"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Branch Selector */}
              <div className="relative group">
                <select
                  className="appearance-none bg-white border border-slate-200 rounded-2xl text-sm font-bold pl-4 pr-10 py-3 focus:ring-4 focus:ring-primary/10 focus:border-secondary transition-all cursor-pointer outline-none shadow-sm hover:border-secondary"
                  value={selectedBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
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

              {/* TWO INPUT DATA FILTER: From and To */}
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 shadow-sm hover:border-secondary transition-colors focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-secondary">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-secondary transition-colors">
                      From
                    </label>
                    <input
                      type="date"
                      className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>
                  <div className="w-px h-6 bg-slate-100 mx-2"></div>
                  <div className="flex flex-col group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-secondary transition-colors">
                      To
                    </label>
                    <input
                      type="date"
                      className="text-xs font-bold text-slate-600 outline-none bg-transparent cursor-pointer"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>
                </div>
                {(fromDate || toDate) && (
                  <button
                    onClick={clearFilters}
                    className="ml-4 p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all hover:rotate-90"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAiInsights}
            disabled={isGeneratingAi}
            className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-secondary/10 hover:scale-105 hover:shadow-secondary active:scale-95 transition-all disabled:opacity-50 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isGeneratingAi ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            )}
            AI Analysis
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          <StatCard
            label="Branch Growth"
            value={stats.avgGrowth}
            trend="+2.4% MoM"
            icon={<TrendingUp className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            label="Total Reports"
            value={stats.totalReports.toLocaleString()}
            trend={fromDate || toDate ? "Custom Range" : "All Time"}
            icon={<ClipboardList className="w-5 h-5" />}
            color="teal"
            active={fromDate || toDate}
          />
          <StatCard
            label="Appointments"
            value={stats.totalAppointments.toLocaleString()}
            trend={fromDate || toDate ? "Custom Range" : "Scheduled"}
            icon={<Calendar className="w-5 h-5" />}
            color="sky"
            active={fromDate || toDate}
          />
          <StatCard
            label="Active Doctors"
            value={stats.totalDocs.toLocaleString()}
            trend="Staffed"
            icon={<Stethoscope className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            label="Staff (Receps)"
            value={stats.totalReceps.toLocaleString()}
            trend="Active"
            icon={<Users className="w-5 h-5" />}
            color="amber"
          />
        </div>

        {/* AI Insight Box */}
        {aiReport && (
          <div className="bg-white border-2 border-secondary rounded-[2.5rem] p-8 shadow-sm animate-in fade-in zoom-in duration-500 relative overflow-hidden ring-4 ring-secondary/50">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-secondary w-5 h-5 animate-pulse" />
              <h3 className="font-extrabold text-slate-900">
                Health Grid Intelligence
              </h3>
              <button
                onClick={() => setAiReport(null)}
                className="ml-auto text-slate-400 p-2 hover:bg-slate-50 rounded-full transition-colors hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="text-slate-600 font-medium whitespace-pre-line leading-relaxed">
              {aiReport}
            </div>
          </div>
        )}

        {/* Main Growth Graph Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Health Grid Growth
              </h3>
              <p className="text-slate-400 text-sm font-semibold">
                Historical comparison between transactional reports and patient
                bookings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* TIMEFRAME FILTER: Week, Month, Year */}
              <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                {["week", "month", "year"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 ${
                      timeframe === t
                        ? "bg-white text-slate-900 shadow-md transform scale-105"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Metric Visibility Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReports(!showReports)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${
                    showReports
                      ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105"
                      : "bg-white text-slate-400 border-slate-100 hover:border-secondary"
                  }`}
                >
                  {showReports && <Check size={12} />} Reports
                </button>
                <button
                  onClick={() => setShowAppointments(!showAppointments)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 border ${
                    showAppointments
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-white text-slate-400 border-slate-100 hover:border-primary"
                  }`}
                >
                  {showAppointments && <Check size={12} />} Appointments
                </button>
              </div>
            </div>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredChartData}>
                <defs>
                  {/* 1. Use the CSS variable for the gradient fill */}
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-secondary)"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-secondary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--color-border)" /* 2. Dynamic border color */
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fontWeight: 800,
                    fill: "var(--color-text)" /* 3. Dynamic text color */,
                  }}
                  dy={15}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    backgroundColor:
                      "var(--color-card-bg)" /* 4. Dynamic Tooltip BG */,
                    boxShadow: "var(--color-shadow)" /* 5. Dynamic Shadow */,
                    padding: "20px",
                  }}
                  itemStyle={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "var(--color-primary)" /* 6. Dynamic Item Color */,
                    padding: "4px 0",
                  }}
                />

                {showReports && (
                  <Area
                    type="monotone"
                    dataKey="reports"
                    stroke="var(--color-primary)" /* 7. Dynamic line color */
                    strokeWidth={5}
                    fillOpacity={1}
                    fill="url(#colorReports)"
                    animationDuration={1500}
                  />
                )}

                {showAppointments && (
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="var(--color-secondary)" /* 8. Dynamic line color */
                    strokeWidth={5}
                    fillOpacity={1}
                    fill="url(#colorAppts)"
                    animationDuration={1500}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-center gap-6 justify-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2 group cursor-help">
              <Clock
                size={12}
                className="text-teal-500 group-hover:animate-spin"
              />
              <span>Auto-refreshing live stream</span>
            </div>
            <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
            <div className="flex items-center gap-2 group cursor-help">
              <ShieldCheck
                size={12}
                className="text-sky-500 group-hover:scale-125 transition-transform"
              />
              <span>ABHA Compliance Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for better organization
function StatCard({ label, value, trend, icon, color, active }) {
  const colorClasses = {
    emerald:
      "bg-emerald-50 text-emerald-600 shadow-emerald-500/10 hover:border-emerald-200 hover:shadow-emerald-500/20",
    teal: "bg-teal-50 text-teal-600 shadow-teal-500/10 hover:border-teal-200 hover:shadow-teal-500/20",
    sky: "bg-sky-50 text-sky-600 shadow-sky-500/10 hover:border-sky-200 hover:shadow-sky-500/20",
    indigo:
      "bg-indigo-50 text-indigo-600 shadow-indigo-500/10 hover:border-indigo-200 hover:shadow-indigo-500/20",
    amber:
      "bg-amber-50 text-amber-600 shadow-amber-500/10 hover:border-amber-200 hover:shadow-amber-500/20",
  };

  return (
    <div
      className={`bg-white p-7 rounded-[2.2rem] border transition-all duration-500 group relative overflow-hidden cursor-default ${active ? "border-teal-400 ring-4 ring-teal-50 shadow-xl" : "border-slate-100 shadow-sm"} hover:-translate-y-2 hover:shadow-2xl`}
    >
      {/* Decorative Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-teal-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div
          className={`p-4 rounded-2xl ${colorClasses[color]} shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
        >
          {icon}
        </div>
        <div
          className={`text-[10px] font-black ${colorClasses[color]} px-3 py-1.5 rounded-full uppercase tracking-tighter border border-current/10 bg-white/50 backdrop-blur-sm group-hover:scale-105 transition-transform`}
        >
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-teal-600 transition-colors duration-300">
          {value}
        </p>
        <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-[0.15em] group-hover:text-slate-600 transition-colors">
          {label}
        </p>
      </div>
    </div>
  );
}

// Simple internal icon for ShieldCheck
const ShieldCheck = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
