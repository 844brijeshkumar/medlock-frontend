import {
  Calendar,
  Heart,
  Shield,
  Phone,
  AlertTriangle,
  TrendingUp,
  FileText,
  Clock,
  User,
  Activity,
  ArrowRight
} from "lucide-react";

import { getCategoryIcon, formatDate, getAge } from "../../../utils";
import { useEffect, useState, useMemo } from "react";
import {
  getAppointmentsByPatient,
  getPatient,
  getReportsByPatient,
} from "../../../api/auth";
import { Link } from "react-router-dom";

const token = localStorage.getItem("token");

const Dashboard = () => {
  const [patient, setPatient] = useState();
  const [emergency, setEmergency] = useState();
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState();

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  const recentReports = reports?.slice(0, 3);
  
  // Filter for high priority reports
  const criticalReports = reports?.filter(
    (r) => r.priority === "critical" || r.priority === "high",
  );
  
  const themeString = localStorage.getItem("theme");
  const themeObj = themeString ? JSON.parse(themeString) : null;
  const id = themeObj?.id;

  const callPatient = async () => {
    try {
      const res = await getPatient(token);
      setPatient(res.patient);
      setEmergency(res.emergencyContact);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callPatient();
  }, []);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await getReportsByPatient(token, id);
        if (res?.status) {
          console.log("Loaded reports:", res.reports);
          setReports(res.reports);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    }
    loadReports();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getAppointmentsByPatient(token, id);
        setAppointments(data.appointments);
      } catch (error) {
        console.error("Failed to load appointments", error);
      }
    };
    loadData();
  }, []);

  const emptyData = "N/A";

  return (
    <div 
      className="w-full h-full mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in min-h-screen bg-slate-50"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-[2.5rem] p-10 text-white mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                    <Activity size={16} className="text-white animate-pulse" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">Patient Portal</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-2">
              Welcome back, {localStorage.getItem("dashboardName")}!
            </h1>
            <p className="text-teal-50 text-lg font-medium max-w-xl">
              Your complete medical history and health insights at a glance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Patient Info */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Personal Info Card */}
          <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-500"></div>
            
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 rounded-xl text-rose-500">
                <Heart className="h-6 w-6" />
              </div>
              Personal Info
            </h2>
            
            <div className="space-y-5">
              <InfoRow label="Age" value={patient?.dob ? `${getAge(patient?.dob)} years` : emptyData} />
              
              <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">Blood Group</span>
                {patient?.bloodGroup ? (
                  <span className="font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                    {patient?.bloodGroup}
                  </span>
                ) : (
                  <span className="font-bold text-slate-700">{emptyData}</span>
                )}
              </div>
              
              <InfoRow label="Gender" value={patient?.gender} capitalize />
              
              <div className="pt-6 mt-2">
                <div className="flex items-center text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  <Phone className="h-3 w-3 mr-2 text-emerald-500" />
                  Emergency Contact
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="font-bold text-slate-900 text-lg mb-1">
                        {emergency?.name || emptyData}
                    </p>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">{emergency?.relation || emptyData}</span>
                        <span className="font-medium text-emerald-600">{emergency?.phone || emptyData}</span>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Alerts Card */}
          {(patient?.allergies?.length > 0 || patient?.chronicConditions?.length > 0) && (
            <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 p-8 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
              
              <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                    <Shield className="h-6 w-6" />
                </div>
                Health Alerts
              </h2>

              <div className="space-y-6">
                {patient.allergies?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-red-500" /> Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies?.map((allergy, index) => (
                        <span key={index} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-bold border border-red-100">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {patient.chronicConditions?.length > 0 && (
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-orange-500" /> Conditions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.chronicConditions?.map((condition, index) => (
                        <span key={index} className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold border border-orange-100">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Reports & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                label="Total Reports" 
                value={reports?.length || 0} 
                icon={<FileText className="h-6 w-6 text-blue-600" />} 
                color="bg-blue-50 border-blue-100 text-blue-900"
            />
            <StatCard 
                label="High Priority" 
                value={criticalReports?.length || 0} 
                icon={<AlertTriangle className="h-6 w-6 text-red-600" />} 
                color="bg-red-50 border-red-100 text-red-900"
            />
            <StatCard 
                label="Appointments (30d)" 
                value={appointments?.filter((r) => {
                    const reportDate = new Date(r.Date__c);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return reportDate >= thirtyDaysAgo;
                }).length} 
                icon={<Calendar className="h-6 w-6 text-emerald-600" />} 
                color="bg-emerald-50 border-emerald-100 text-emerald-900"
            />
          </div>

          {/* Recent Reports List */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-500">
                    <Clock className="h-6 w-6" />
                </div>
                Recent Reports
              </h2>
              <Link
                to="/patient/report"
                className="group flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
              >
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentReports?.map((report, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-slate-100 rounded-2xl p-5 hover:border-secondary hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300 cursor-default"
                >
                  {/* Hover Accent Line */}
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-secondary rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pl-3">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:bg-secondary/10 group-hover:border-secondary/20 transition-colors">
                        {getCategoryIcon(report.Category__c)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">
                          {report.Title__c}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                          {report.Notes__c}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <User size={12} /> Dr. {report.Doctor__r.Name}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Heart size={12} /> {report.Hospital__r.Name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 min-w-[100px]">
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                        {report.Date_of_issue__c}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          report.priority === "critical"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : report.priority === "high"
                            ? "bg-orange-50 text-orange-600 border-orange-100"
                            : report.priority === "medium"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                      >
                        {report.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {!recentReports?.length && (
                 <div className="text-center py-10 text-slate-400 italic">No recent reports found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---

function InfoRow({ label, value, capitalize }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100 last:border-0">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">{label}</span>
            <span className={`font-bold text-slate-700 ${capitalize ? 'capitalize' : ''}`}>
                {value || "N/A"}
            </span>
        </div>
    )
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className={`rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${color}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm shadow-sm">
                    {icon}
                </div>
                <span className="text-4xl font-black tracking-tighter opacity-90">{value}</span>
            </div>
            <p className="text-xs font-black uppercase tracking-widest opacity-70">
                {label}
            </p>
        </div>
    )
}

export default Dashboard;