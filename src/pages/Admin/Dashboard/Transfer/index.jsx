import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Building2,
  Layers,
  User,
  ChevronDown,
  Lock,
  ArrowRight,
  ArrowLeftRight,
  Activity,
  Stethoscope,
  CheckCircle2
} from "lucide-react";
import { useToast } from "../../../../utils/ToastContext";

export default function StaffTransfer() {
  // Source Filter States
  const [sourceHospitalId, setSourceHospitalId] = useState("");
  const [sourceDepartmentId, setSourceDepartmentId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Transfer Target States
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [targetHospitalId, setTargetHospitalId] = useState("");
  const [targetDepartmentId, setTargetDepartmentId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Data States
  const [hospitals, setHospitals] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  const { showToast } = useToast();

  // --- ROLE DETECTION ---
  const rawRole = localStorage.getItem("role")?.toLowerCase() || "";
  const isHospitalRole = rawRole === "hospital" || rawRole === "hp";
  const isDepartmentRole = rawRole === "department" || rawRole === "dp";
  const isAdminRole = !isHospitalRole && !isDepartmentRole;
  
  const dashboardName = localStorage.getItem("name") || localStorage.getItem("dashboardName") || "Your Entity";
  const parentHospitalName = localStorage.getItem("parentHospitalName") || "Parent Branch";

  const theme = useMemo(
    () => ({ primary: "#0b4f4a", secondary: "#2a9b94", accent: "#d1e8e5" }),
    []
  );

  const roleConfig = {
    doctor: { title: "Doctors", icon: <Stethoscope size={16} /> },
    nurse: { title: "Nurses", icon: <Activity size={16} /> },
    receptionist: { title: "Receptionists", icon: <User size={16} /> },
  };

  // 1. Fetch Infrastructure
  useEffect(() => {
    const fetchInfrastructure = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        const [deptRes, hospRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/manage/department/", { headers }),
          fetch("http://127.0.0.1:8000/api/hospital/", { headers })
        ]);

        let fetchedDepartments = [];
        if (deptRes.ok) {
          const deptData = await deptRes.json();
          fetchedDepartments = deptData.departments || [];
          setAllDepartments(fetchedDepartments);
        }

        if (hospRes.ok) {
          const hospData = await hospRes.json();
          const fetchedHospitals = hospData.hospitals || [];
          setHospitals(fetchedHospitals);

          // Auto-lock Source & Target Hospital if logged in as a Hospital branch
          if (isHospitalRole && fetchedHospitals.length > 0) {
            const myHospId = String(fetchedHospitals[0].id || fetchedHospitals[0].Id);
            setSourceHospitalId(myHospId);
            setTargetHospitalId(myHospId);
          }
        }

        if (isDepartmentRole && fetchedDepartments.length > 0) {
          const myDept = fetchedDepartments[0];
          setSourceDepartmentId(String(myDept.id || myDept.Id));
          setSourceHospitalId(String(myDept.hospital_id)); 
        }

      } catch (err) {
        console.error("Failed to load infrastructure:", err);
      }
    };
    fetchInfrastructure();
  }, [isAdminRole, isHospitalRole, isDepartmentRole]);

  // 2. Fetch Staff when Role Changes
  useEffect(() => {
    if (selectedRole) {
      const fetchStaff = async () => {
        setIsLoadingStaff(true);
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/manage/staff/?role=${selectedRole}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) setStaffList(data.staff || []);
        } catch (err) {
          console.error("Failed to load staff:", err);
        } finally {
          setIsLoadingStaff(false);
        }
      };
      fetchStaff();
    } else {
      setStaffList([]);
    }
    // Deselect staff if filter changes
    setSelectedStaffId("");
  }, [selectedRole, sourceDepartmentId]);

  // Cascading Resets
  useEffect(() => {
    if (!isDepartmentRole) setSelectedRole("");
  }, [sourceDepartmentId, isDepartmentRole]);

  useEffect(() => {
    if (!isDepartmentRole && !isHospitalRole) setSourceDepartmentId("");
  }, [sourceHospitalId, isDepartmentRole, isHospitalRole]);

  useEffect(() => {
    if (!isHospitalRole) setTargetDepartmentId("");
  }, [targetHospitalId, isHospitalRole]);

  // Derived Filters
  const sourceFilteredDepartments = allDepartments.filter(d => String(d.hospital_id) === String(sourceHospitalId));
  const targetFilteredDepartments = allDepartments.filter(d => String(d.hospital_id) === String(targetHospitalId));

  const activeStaffList = staffList.filter((staff) => {
    if (String(staff.department_id) !== String(sourceDepartmentId)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return staff.name?.toLowerCase().includes(query) || String(staff.punch_id).includes(query);
    }
    return true;
  });

  const selectedStaffRecord = activeStaffList.find(s => String(s.id) === String(selectedStaffId));

  // Handle Submit
  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !targetDepartmentId || !selectedRole) {
        showToast({ title: "Incomplete", message: "Please complete all selections.", type: "warning" });
        return;
    }

    if (String(targetDepartmentId) === String(sourceDepartmentId)) {
        showToast({ title: "Invalid Transfer", message: "Staff is already in this department.", type: "warning" });
        return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/staff/transfer/", {
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
        showToast({ title: "Success", message: data.message || "Transfer completed.", type: "success" });
        
        // Remove from current list
        setStaffList(prev => prev.filter(s => String(s.id) !== String(selectedStaffId)));
        
        // Reset selections
        setSelectedStaffId("");
        if (!isHospitalRole) setTargetHospitalId(""); 
        setTargetDepartmentId("");

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
    <div className="max-w-6xl mx-auto space-y-6 py-8 fade-in min-h-screen font-sans text-slate-800" style={{ "--primary": theme.primary, "--secondary": theme.secondary }}>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-primary">Staff Reassignment</h2>
          <p className="text-slate-500 font-medium mt-1">Locate personnel and securely transfer them across branches or wings.</p>
        </div>
      </div>

      {/* --- STEP 1: CASCADING FILTERS (SOURCE) --- */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-secondary/5 p-6 relative z-20">
        <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest ml-1 flex items-center gap-2">
          Step 1: Locate Current Assignment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Source Branch */}
          <div>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              {isHospitalRole || isDepartmentRole ? (
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold text-slate-500 cursor-not-allowed flex items-center justify-between">
                  <span>{hospitals.length > 0 ? (hospitals[0].name || hospitals[0].Name) : (isDepartmentRole ? parentHospitalName : dashboardName)}</span>
                  <Lock size={14} className="text-slate-300" />
                </div>
              ) : (
                <>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none hover:border-slate-300 transition-colors"
                    value={sourceHospitalId}
                    onChange={(e) => setSourceHospitalId(e.target.value)}
                  >
                    <option value="">Select Source Branch...</option>
                    {hospitals.map((h) => (
                      <option key={h.id || h.Id} value={h.id || h.Id}>{h.name || h.Name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          {/* Source Department */}
          <div className={!sourceHospitalId && !isDepartmentRole ? "opacity-50 grayscale pointer-events-none transition-all" : "transition-all"}>
            <div className="relative group">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              {isDepartmentRole ? (
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold text-slate-500 cursor-not-allowed flex items-center justify-between">
                  <span>{allDepartments.length > 0 ? (allDepartments[0].name || allDepartments[0].Name) : dashboardName}</span>
                  <Lock size={14} className="text-slate-300" />
                </div>
              ) : (
                <>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none hover:border-slate-300 transition-colors"
                    value={sourceDepartmentId}
                    onChange={(e) => setSourceDepartmentId(e.target.value)}
                  >
                    <option value="">Select Source Department...</option>
                    {sourceFilteredDepartments.map((d) => (
                      <option key={d.id || d.Id} value={d.id || d.Id}>{d.name || d.Name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
                </>
              )}
            </div>
          </div>

          {/* Role */}
          <div className={!sourceDepartmentId ? "opacity-50 grayscale pointer-events-none transition-all" : "transition-all"}>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <select
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none hover:border-slate-300 transition-colors text-primary"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select Role Category...</option>
                <option value="doctor">Doctors</option>
                <option value="nurse">Nurses</option>
                <option value="receptionist">Receptionists</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      {/* --- STEP 2: STAFF SELECTION LIST --- */}
      <div className={`bg-white border border-slate-100 rounded-3xl shadow-xl shadow-secondary/5 overflow-hidden transition-all duration-500 ${!selectedRole ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
        
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">
              Step 2: Select Personnel
            </h3>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
            <input
              type="text"
              placeholder="Search by name or Punch ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={!selectedRole || isLoadingStaff}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="p-0 max-h-[300px] overflow-y-auto">
          {isLoadingStaff ? (
             <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : activeStaffList.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <User size={24} className="text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-400">No staff match your selection.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-50">
                {activeStaffList.map((staff) => {
                  const isSelected = String(staff.id) === String(selectedStaffId);
                  return (
                    <tr 
                      key={staff.id} 
                      onClick={() => setSelectedStaffId(String(staff.id))}
                      className={`cursor-pointer transition-colors group ${isSelected ? 'bg-secondary/10 border-l-4 border-l-secondary' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                    >
                      <td className="px-8 py-4 w-12">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-secondary bg-secondary' : 'border-slate-300 group-hover:border-secondary/50'}`}>
                          {isSelected && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className={`text-sm font-bold ${isSelected ? 'text-secondary' : 'text-slate-800'}`}>{staff.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{staff.designation || 'Staff'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold font-mono">
                          ID: {staff.punch_id || "N/A"}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <p className="text-xs font-bold text-slate-700">{staff.contact || "No Phone"}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- STEP 3: DESTINATION & SUBMIT --- */}
      {selectedStaffId && (
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 shadow-lg shadow-emerald-900/5 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xs font-black uppercase text-emerald-600 tracking-widest flex items-center gap-2 mb-6">
            <ArrowRight size={14} /> Step 3: Configure Destination for {selectedStaffRecord?.name}
          </h3>
          
          <form onSubmit={handleTransfer} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            
            {/* Target Branch */}
            <div>
              <label className="block text-[10px] font-black uppercase text-emerald-600/70 mb-2 tracking-widest ml-1">Target Branch</label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 size-4" />
                {isHospitalRole ? (
                  <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold text-emerald-900/60 cursor-not-allowed flex items-center justify-between">
                    <span>{hospitals.length > 0 ? (hospitals[0].name || hospitals[0].Name) : dashboardName}</span>
                    <Lock size={14} className="text-emerald-600/30" />
                  </div>
                ) : (
                  <>
                    <select
                      className="w-full bg-white border border-emerald-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-300 transition-colors text-emerald-900 cursor-pointer appearance-none"
                      value={targetHospitalId}
                      onChange={(e) => setTargetHospitalId(e.target.value)}
                    >
                      <option value="">Select Destination...</option>
                      {hospitals.map((h) => (
                        <option key={h.id || h.Id} value={h.id || h.Id}>{h.name || h.Name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600/50 size-4 pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Target Department */}
            <div className={!targetHospitalId ? 'opacity-50 grayscale pointer-events-none transition-all' : 'transition-all'}>
              <label className="block text-[10px] font-black uppercase text-emerald-600/70 mb-2 tracking-widest ml-1">Target Department</label>
              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/50 size-4" />
                <select
                  className="w-full bg-white border border-emerald-200 rounded-2xl pl-10 pr-4 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-300 transition-colors text-emerald-900 cursor-pointer appearance-none"
                  value={targetDepartmentId}
                  onChange={(e) => setTargetDepartmentId(e.target.value)}
                >
                  <option value="">{targetHospitalId ? "Select Destination Wing..." : "Select Branch First"}</option>
                  {targetFilteredDepartments.map((d) => (
                    <option key={d.id || d.Id} value={d.id || d.Id}>{d.name || d.Name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600/50 size-4 pointer-events-none" />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!targetDepartmentId || isProcessing}
              className={`w-full py-3.5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm group ${
                !targetDepartmentId || isProcessing
                  ? "bg-emerald-100 text-emerald-400 cursor-not-allowed border border-emerald-200"
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/20 active:scale-[0.99]"
              }`}
            >
              {isProcessing ? "Processing..." : "Confirm Transfer"}
              <ArrowLeftRight size={16} className={!targetDepartmentId || isProcessing ? "" : "group-hover:rotate-180 transition-transform duration-500"} />
            </button>

          </form>
        </div>
      )}
    </div>
  );
}