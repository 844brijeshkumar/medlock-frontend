import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import { hospitalData, doctorsData, reportsData } from "../../../utils";
import { Stethoscope, FileText, Users, Building, Activity, TrendingUp, Target } from "lucide-react";
import { formatDate } from "../../../utils";

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [doctors, setDoctors] = useState(doctorsData);
  const [hospital, setHospital] = useState(
    localStorage.getItem("hospitalName")
  );
  const reports = reportsData;

  // --- THEME LOGIC: Define colors for Recharts to use via CSS variables ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",    
    secondary: "#2a9b94",  
    accent: "#d1e8e5",     
  }), []);

  const totalDoctors = doctors?.length || 0;
  const completedReports = reports?.filter(
    (report) => report.status === "Completed"
  );
  const totalReports = completedReports?.length || 0;
  const recentDoctorActivity = doctors?.slice(0, 4) || [];
  
  // --- Mock Data for Charts ---
  const activityData = [
    { name: "Mon", reports: 40 },
    { name: "Tue", reports: 30 },
    { name: "Wed", reports: 60 },
    { name: "Thu", reports: 45 },
    { name: "Fri", reports: 90 },
  ];

  const specialtyData = [
    { name: "Cardiology", value: 450 },
    { name: "Neurology", value: 320 },
    { name: "Pediatrics", value: 300 },
    { name: "Orthopedics", value: 280 },
    { name: "Dermatology", value: 210 },
    { name: "Oncology", value: 190 },
    { name: "Radiology", value: 250 },
    { name: "General Surgery", value: 310 },
  ];

  // Extended color palette using CSS variables where possible
  const COLORS = [
    "var(--primary)",
    "var(--secondary)", 
    "#3dbbb3", 
    "#7ccdc8", 
    "var(--accent)", 
    "#a3dbd7", 
    "#d1e8e5", 
    "#083a36"
  ];

  return (
    <div 
      className="space-y-12 p-10 fade-in bg-gray-50 min-h-screen"
      // Inject theme colors as CSS variables for Recharts and arbitrary Tailwind values
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* --- NEW: Charts Row 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Report Volume Line Chart */}
        <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary transition-transform duration-300 group-hover:translate-x-1">
              Report Activity (Weekly)
            </h3>
            {/* Icon lights up with secondary color on hover */}
            <Activity className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-secondary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                />
                <Line
                  type="monotone"
                  dataKey="reports"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "var(--primary)", strokeWidth: 0 }}
                  activeDot={{ r: 8, fill: "var(--secondary)", stroke: "white", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Specialty Distribution Pie Chart */}
        <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
          <h3 className="text-lg font-bold text-primary mb-4 transition-transform duration-300 group-hover:translate-x-1">
            Specialty Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {specialtyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="transition-opacity duration-300 hover:opacity-80 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- NEW: Charts Row 2 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 3. Monthly Comparison Bar Chart */}
        <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary transition-transform duration-300 group-hover:translate-x-1">
              Growth Comparison
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-secondary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                   cursor={{ fill: 'var(--accent)', opacity: 0.3 }}
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                />
                <Bar 
                  dataKey="reports" 
                  fill="var(--secondary)" 
                  radius={[6, 6, 6, 6]} 
                  barSize={40}
                  className="transition-all duration-300 hover:opacity-90"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Doctor Performance Radar Chart */}
        <div className="group bg-white p-6 rounded-[2rem] shadow-sm border border-transparent transition-all duration-500 hover:border-secondary hover:shadow-xl hover:shadow-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-primary transition-transform duration-300 group-hover:translate-x-1">
              Performance Metrics
            </h3>
            <Target className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-secondary" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={[
                  { subject: "Speed", A: 120, fullMark: 150 },
                  { subject: "Accuracy", A: 98, fullMark: 150 },
                  { subject: "Volume", A: 86, fullMark: 150 },
                  { subject: "Feedback", A: 99, fullMark: 150 },
                ]}
              >
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 600 }} />
                <Radar
                  name="Hospital Avg"
                  dataKey="A"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- Recent Doctor Activity --- */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-primary mb-8 flex items-center">
          {/* Static icon container, could animate if desired */}
          <div className="p-2 rounded-xl bg-gray-50 mr-4 border border-gray-100">
            <Users className="h-6 w-6 text-secondary" />
          </div>
          Recent Doctor Activity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentDoctorActivity.map((doctor) => (
            <div
              key={doctor.id}
              className="group relative bg-white p-6 rounded-3xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:border-secondary hover:shadow-xl hover:shadow-secondary/15 cursor-pointer overflow-hidden"
            >
              {/* Top gradient accent that appears on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl bg-secondary/10 text-secondary transition-all duration-300 group-hover:bg-secondary group-hover:text-white group-hover:rotate-6 shadow-sm">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary">
                    {doctor.name}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 transition-colors duration-300 group-hover:text-secondary">
                    {doctor.specialty}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    Last logged in: {formatDate(doctor.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;