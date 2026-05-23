import React, { useEffect, useState, useMemo } from "react";
import { Settings, User, ShieldCheck, LogOut, Loader2 } from "lucide-react";
import PatientSettings from "../../../components/PatientSettings";
import { getPatient } from "../../../api/auth";

const token = localStorage.getItem("token");

const PatientSettingsPage = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  const Logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("dashboardName");

    // Redirect to login page
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  // 🔹 Fetch patient profile
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await getPatient(token);

        setPatientData({
          name: res.patient.name,
          aadhaar: res.patient.aadhaar,
          phone: res.patient.phone,
          email: res.patient.email,
          password: "",
          bloodGroup: res.patient.bloodGroup || "",
          dob: res.patient.dob || "",
          gender: res.patient.gender || "",
          photo: res.patient.photo || "",

          ecName: res.emergencyContact?.name || "",
          ecRelation: res.emergencyContact?.relation || "",
          ecPhone: res.emergencyContact?.phone || "",
          ecEmail: res.emergencyContact?.email || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] bg-slate-50">
        <div className="bg-[#2a9b94]/10 p-4 rounded-full mb-4">
          <Loader2 className="w-8 h-8 text-[#2a9b94] animate-spin" />
        </div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div 
      className="fade-in min-h-screen bg-slate-50 font-sans p-4 md:p-10 space-y-8"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
             <div className="p-2 bg-secondary/10 rounded-xl">
                <Settings className="w-6 h-6 text-secondary" />
             </div>
             Settings
          </h1>
          <p className="text-xs font-medium text-gray-500 mt-2 ml-1">
            Manage your personal profile, security preferences, and account access.
          </p>
        </div>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="group bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-300 text-secondary">
            <User className="w-7 h-7" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
            Profile Information
          </h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            View and update your personal details, medical history references, and emergency contacts.
          </p>
          
          <button
            onClick={() => setOpenSettings(true)}
            className="w-full py-3 px-6 bg-secondary text-white font-bold rounded-xl hover:bg-primary hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Edit Profile
          </button>
        </div>

        {/* Security Card */}
        <div className="group bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6 text-gray-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Security & Privacy
          </h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Manage password, two-factor authentication, and login sessions. Your data is protected.
          </p>
          
          <button
            disabled
            className="w-full py-3 px-6 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
          >
            Coming Soon
          </button>
        </div>

        {/* Logout Card */}
        <div className="group bg-white rounded-[2rem] p-8 shadow-sm border border-red-100 hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
            <LogOut className="w-7 h-7" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            Sign Out
          </h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Securely log out of your account on this device.
          </p>
          
          <button
            onClick={Logout}
            className="w-full py-3 px-6 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {openSettings && (
        <PatientSettings
          initialData={patientData}
          onClose={() => setOpenSettings(false)}
          onSave={(updated) => {
            setPatientData(updated);
            setOpenSettings(false);
          }}
        />
      )}
    </div>
  );
};

export default PatientSettingsPage;