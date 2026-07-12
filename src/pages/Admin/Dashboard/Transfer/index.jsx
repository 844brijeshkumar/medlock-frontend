import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  Layers,
  User,
  ChevronDown,
  Stethoscope,
  Activity
} from "lucide-react";
import { useToast } from "../../../../utils/ToastContext";

export default function StaffTransfer() {
  // Transfer Form States
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [targetHospitalId, setTargetHospitalId] = useState("");
  const [targetDepartmentId, setTargetDepartmentId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Data States
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  
  const { showToast } = useToast();
  const theme = useMemo(() => ({ primary: "#0b4f4a", secondary: "#2a9b94", accent: "#d1e8e5" }), []);

  const roleConfig = {
    doctor: { title: "Doctor", icon: Stethoscope },
    nurse: { title: "Nurse", icon: Activity },
    receptionist: { title: "Receptionist", icon: User },
  };

  // 1. Fetch Hospitals and Departments on mount
  useEffect(() => {
    const fetchInfrastructure = async () => {
      const token = localStorage.getItem("token");
      try {
        const [hRes, dRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/ad/branches/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/ad/manage/departments/", { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        const hData = await hRes.json();
        const dData = await dRes.json();
        
        if (hRes.ok) setHospitals(hData.hospitals || []);
        if (dRes.ok) setDepartments(dData.departments || []);
      } catch (err) {
        console.error("Failed to load infrastructure data:", err);
      }
    };
    fetchInfrastructure();
  }, []);

  // 2. Fetch Staff dynamically when Role changes
  useEffect(() => {
    if (selectedRole) {
      const fetchStaff = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/ad/manage/staff/?role=${selectedRole}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) setStaffList(data.staff || []);
        } catch (err) {
          console.error("Failed to load staff:", err);
        }
      };
      fetchStaff();
    } else {
      setStaffList([]);
    }
    
    // Reset downward selections
    setSelectedStaffId("");
  }, [selectedRole]);

  // Handle cascading resets
  useEffect(() => {
    setTargetDepartmentId("");
  }, [targetHospitalId]);

  // Derived Selection Data (To show Current Location)
  const selectedStaff = staffList.find(s => String(s.id) === String(selectedStaffId));
  const currentDept = departments.find(d => String(d.id) === String(selectedStaff?.department_id));
  const currentHosp = hospitals.find(h => String(h.id) === (String(currentDept?.hospital_id) || String(selectedStaff?.hospital_id)));

  // Filter available destination departments based on chosen destination hospital
  const filteredDepartments = departments.filter(d => String(d.hospital_id) === String(targetHospitalId));

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !targetDepartmentId || !selectedRole) {
        showToast({ title: "Incomplete", message: "Please complete all selections.", type: "warning" });
        return;
    }

    // Prevent transferring to the exact same department
    if (String(targetDepartmentId) === String(selectedStaff.department_id)) {
        showToast({ title: "Invalid Transfer", message: "Staff is already in this department.", type: "warning" });
        return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/ad/transfer/staff/", {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          role: selectedRole,
          staff_id: selectedStaffId,
          new_department_id: targetDepartmentId
        }),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showToast({ title: "Success", message: data.message, type: "success" });
        
        // Remove staff from current view or trigger a re-fetch here if needed
        setSelectedStaffId("");
        setTargetHospitalId("");
        setTargetDepartmentId("");
        
        // Locally update the staff list to reflect the change immediately
        setStaffList(prev => prev.map(s => String(s.id) === String(selectedStaffId) ? { ...s, department_id: targetDepartmentId } : s));

      } else {
        throw new Error(data.message || "Transfer failed.");
      }
    } catch (error) {
      showToast({ title: "Error", message: error.message, type: "error" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8 fade-in min-h-screen" style={{ "--primary": theme.primary, "--secondary": theme.secondary }}>
      
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-primary">Staff Reassignment</h2>
        <p className="text-slate-500 font-medium">Seamlessly transfer personnel between branches and internal departments.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-10 relative overflow-hidden">
        <form onSubmit={handleTransfer} className="space-y-10">
          
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm">
              <ArrowLeftRight size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary">Transfer Details</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Select Member and Destination</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: STAFF SELECTION */}
            <div className="space-y-6">
              
              {/* Role Select */}
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">1. Select Role Category</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                  <select
                    className="w-full bg-slate-50 border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white cursor-pointer appearance-none text-gray-700"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="">-- Choose Role --</option>
                    <option value="doctor">Doctors</option>
                    <option value="nurse">Nurses</option>
                    <option value="receptionist">Receptionists</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* Staff Select */}
              <div className={`transition-all duration-300 ${!selectedRole ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">2. Select {roleConfig[selectedRole]?.title || 'Staff Member'}</label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white cursor-pointer"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                  >
                    <option value="">-- Choose Member --</option>
                    {staffList.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} (ID: {s.punch_id})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Current Location Preview */}
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">Current Assignment</label>
                {selectedStaff ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 animate-in fade-in transition-all">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{currentHosp?.name || currentHosp?.Name || "Unknown Hospital"}</h4>
                      <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                        <Layers size={12}/> {currentDept?.name || "Unknown Department"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[90px] bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Awaiting Selection
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: TARGET DESTINATION */}
            <div className={`flex flex-col justify-end space-y-6 transition-all duration-500 ${!selectedStaffId ? "opacity-30 pointer-events-none grayscale" : ""}`}>
              
              <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100 space-y-6">
                <h3 className="text-xs font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2">
                  <ArrowRight size={14} /> New Destination
                </h3>
                
                {/* Target Hospital Select */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-emerald-600/70 mb-2 tracking-widest ml-1">Target Branch</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 size-5" />
                    <select
                      className="w-full bg-white border-emerald-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-emerald-900 cursor-pointer appearance-none"
                      value={targetHospitalId}
                      onChange={(e) => setTargetHospitalId(e.target.value)}
                    >
                      <option value="">-- Select Destination Branch --</option>
                      {hospitals.map((h) => (
                        <option key={h.id || h.Id} value={h.id || h.Id}>{h.name || h.Name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={18} />
                  </div>
                </div>

                {/* Target Department Select */}
                <div className={`transition-all duration-300 ${!targetHospitalId ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
                  <label className="block text-[10px] font-black uppercase text-emerald-600/70 mb-2 tracking-widest ml-1">Target Department</label>
                  <div className="relative group">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 size-5" />
                    <select
                      className="w-full bg-white border-emerald-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-100 transition-all text-emerald-900 cursor-pointer appearance-none"
                      value={targetDepartmentId}
                      onChange={(e) => setTargetDepartmentId(e.target.value)}
                    >
                      <option value="">{targetHospitalId ? "-- Select Destination Department --" : "Select Branch First"}</option>
                      {filteredDepartments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600/50 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <SubmitButton
            label={isProcessing ? "Executing Transfer..." : "Confirm Staff Transfer"}
            disabled={!targetDepartmentId || isProcessing}
          />
        </form>
      </div>
    </div>
  );
}

// Reusable Button Component
function SubmitButton({ label, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm group ${
        disabled
          ? "bg-slate-100 text-slate-300 cursor-not-allowed border border-slate-200"
          : "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-secondary/20"
      }`}
    >
      {label}{" "}
      <ArrowRight
        size={18}
        className={!disabled ? "group-hover:translate-x-1 transition-transform" : ""}
      />
    </button>
  );
}