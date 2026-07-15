import React, { useState, useEffect, useMemo } from "react";
import {
  Stethoscope,
  Activity,
  User,
  ArrowRight,
  Edit3,
  Plus,
  Building2,
  ChevronDown,
  Layers,
  Phone,
  Mail,
  MapPin,
  Fingerprint,
  Briefcase
} from "lucide-react";
import { useToast } from "../../../../utils/ToastContext";

export default function StaffManagement() {
  const [mode, setMode] = useState("add");
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  // Cascading Selection States
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");

  // Data States
  const [hospitals, setHospitals] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({});

  // --- ROLE DETECTION ---
  const rawRole = localStorage.getItem("role")?.toLowerCase() || "";
  const isHospitalRole = rawRole === "hospital" || rawRole === "hp";
  const isDepartmentRole = rawRole === "department" || rawRole === "dp";
  const isAdminRole = !isHospitalRole && !isDepartmentRole;
  
  // Safe fallback names
  const dashboardName = localStorage.getItem("name") || localStorage.getItem("dashboardName") || "Your Entity";
  const parentHospitalName = localStorage.getItem("parentHospitalName") || "Parent Hospital Network";

  const theme = useMemo(
    () => ({ primary: "#0b4f4a", secondary: "#2a9b94", accent: "#d1e8e5" }),
    []
  );

  const roleConfig = {
    doctor: { title: "Practitioner", icon: Stethoscope },
    nurse: { title: "Nursing Staff", icon: Activity },
    receptionist: { title: "Receptionist", icon: User },
  };

  // 1. Fetch Hospitals and Departments on mount based on Role
  useEffect(() => {
    const fetchBaseData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      try {
        // Everyone needs departments
        const deptRes = await fetch("http://127.0.0.1:8000/api/manage/department/", { headers });
        let fetchedDepartments = [];
        if (deptRes.ok) {
          const deptData = await deptRes.json();
          fetchedDepartments = deptData.departments || [];
          setAllDepartments(fetchedDepartments);
        }

        // Fetch Hospitals (Even for Departments, to try and grab the parent name)
        const hospRes = await fetch("http://127.0.0.1:8000/api/hospital/", { headers });
        if (hospRes.ok) {
          const hospData = await hospRes.json();
          const fetchedHospitals = hospData.hospitals || [];
          setHospitals(fetchedHospitals);

          // Auto-lock Hospital if logged in as Hospital
          if (isHospitalRole && fetchedHospitals.length > 0) {
            setSelectedHospitalId(String(fetchedHospitals[0].id || fetchedHospitals[0].Id));
          }
        }

        // Auto-lock Department (and infer parent hospital) if logged in as Department
        if (isDepartmentRole && fetchedDepartments.length > 0) {
          const myDept = fetchedDepartments[0];
          setSelectedDepartmentId(String(myDept.id || myDept.Id));
          setSelectedHospitalId(String(myDept.hospital_id)); 
        }

      } catch (err) {
        console.error("Failed to load infrastructure data:", err);
      }
    };
    fetchBaseData();
  }, [isAdminRole, isHospitalRole, isDepartmentRole]);

  // 2. Fetch Staff when Role changes
  useEffect(() => {
    if (selectedRole) {
      const fetchStaff = async () => {
        const token = localStorage.getItem("token");
        try {
          const res = await fetch(`http://127.0.0.1:8000/api/manage/staff/?role=${selectedRole}`, {
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
  }, [selectedRole, isProcessing]);

  // Reset cascading selections cleanly
  useEffect(() => {
    setFormData({});
    setSelectedStaffId("");
  }, [mode, selectedRole, selectedDepartmentId]);

  // Clear downstream selections when Hospital changes (Only if not a Department user)
  useEffect(() => {
    if (!isDepartmentRole) {
      setSelectedDepartmentId("");
      setSelectedRole("");
    }
  }, [selectedHospitalId, isDepartmentRole]);

  // Load staff data into form for update
  useEffect(() => {
    if (mode === "update" && selectedStaffId) {
      const s = staffList.find((s) => String(s.id) === String(selectedStaffId));
      if (s) {
        setFormData({
          name: s.name || s.Name || "",
          password: "", // Never pre-fill passwords
          adhaar: s.adhaar === "[Aadhaar Redacted]" ? "" : (s.adhaar || ""),
          contact: s.contact || "",
          gmail: s.gmail || "",
          address: s.address || "",
          punch_id: s.punch_id || "",
          designation: s.designation || "",
          is_active: s.is_active !== undefined ? String(s.is_active) : "true",
        });
      }
    } else {
      setFormData({});
    }
  }, [selectedStaffId, mode, staffList]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDepartmentId || !selectedRole || !formData.name || !formData.password || !formData.punch_id) {
      showToast({
        title: "Required Fields",
        message: "Please fill in Name, Password, and Punch ID.",
        type: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const isAdd = mode === "add";
      
      const payload = { 
        ...formData, 
        role: selectedRole, 
        department_id: selectedDepartmentId 
      };

      if (!isAdd) payload.id = selectedStaffId;

      const response = await fetch("http://127.0.0.1:8000/api/manage/staff/", {
        method: isAdd ? "POST" : "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showToast({
          title: "Success",
          message: `${roleConfig[selectedRole].title} record processed successfully.`,
          type: "success",
        });

        if (isAdd) {
          setFormData({});
        } else {
          setSelectedStaffId("");
        }
      } else {
        throw new Error(data.message || "Failed to save record.");
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: error.message || "Could not connect to the server.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Derived filtered arrays for dropdowns
  const filteredDepartments = allDepartments.filter(
    (d) => String(d.hospital_id) === String(selectedHospitalId)
  );

  const filteredStaff = staffList.filter(
    (s) => String(s.department_id) === String(selectedDepartmentId)
  );

  const CurrentIcon = selectedRole ? roleConfig[selectedRole].icon : User;

  return (
    <div
      className="max-w-5xl mx-auto space-y-10 py-8 fade-in min-h-screen font-sans"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-primary">
          Unified Staff Management
        </h2>
        <p className="text-slate-500 font-medium">
          Onboard and manage doctors, nurses, and receptionists across departments.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center relative">
          <button
            onClick={() => setMode("add")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === "add" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Plus size={14} strokeWidth={3} /> Onboard Staff
          </button>
          <button
            onClick={() => setMode("update")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === "update" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Edit3 size={14} strokeWidth={3} /> Update Records
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-secondary/5 p-10 relative overflow-hidden">
        
        {/* --- CASCADING SELECTORS --- */}
        <div className="mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1: Hospital */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                Step 1: Branch
              </label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                {isHospitalRole || isDepartmentRole ? (
                  <select disabled className="w-full bg-gray-100 border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold !text-gray-500 outline-none transition-all shadow-sm cursor-not-allowed opacity-90 appearance-none">
                    <option>
                      {hospitals.length > 0 
                        ? (hospitals[0].name || hospitals[0].Name) 
                        : (isDepartmentRole ? parentHospitalName : dashboardName)}
                    </option>
                  </select>
                ) : (
                  <>
                    <select
                      className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none text-slate-800"
                      value={selectedHospitalId}
                      onChange={(e) => setSelectedHospitalId(e.target.value)}
                    >
                      <option value="">-- Choose Hospital --</option>
                      {hospitals.map((h) => (
                        <option key={h.id || h.Id} value={h.id || h.Id}>{h.name || h.Name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Step 2: Department */}
            <div className={!isDepartmentRole && !selectedHospitalId ? "opacity-50 grayscale pointer-events-none" : "transition-all duration-300"}>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                Step 2: Department
              </label>
              <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                {isDepartmentRole ? (
                  <select disabled className="w-full bg-gray-100 border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold !text-gray-500 outline-none transition-all shadow-sm cursor-not-allowed opacity-90 appearance-none">
                    <option>
                      {allDepartments.length > 0 
                        ? (allDepartments[0].name || allDepartments[0].Name) 
                        : dashboardName}
                    </option>
                  </select>
                ) : (
                  <>
                    <select
                      className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none text-slate-800"
                      value={selectedDepartmentId}
                      onChange={(e) => setSelectedDepartmentId(e.target.value)}
                    >
                      <option value="">-- Choose Dept --</option>
                      {filteredDepartments.map((d) => (
                        <option key={d.id || d.Id} value={d.id || d.Id}>{d.name || d.Name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Step 3: Role */}
            <div className={!selectedDepartmentId ? "opacity-50 grayscale pointer-events-none" : "transition-all duration-300"}>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                Step 3: Staff Role
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                <select
                  className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none text-primary"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">-- Role --</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 size-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Step 4: Select Existing Staff (Update Mode Only) */}
          {mode === "update" && selectedRole && (
            <div className="pt-6 border-t border-slate-200 mt-6 animate-in fade-in zoom-in duration-300">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                Step 4: Select {roleConfig[selectedRole].title}
              </label>
              <div className="relative max-w-md">
                <select
                  className="w-full bg-white border border-secondary/30 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary cursor-pointer text-slate-800"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                >
                  <option value="">-- Select Member to Update --</option>
                  {filteredStaff.map((s) => (
                    <option key={s.id || s.Id} value={s.id || s.Id}>{s.name || s.Name} (Punch ID: {s.punch_id})</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* --- FORM SECTION --- */}
        {selectedRole && (mode === "add" || selectedStaffId) && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 ease-out pt-4">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm">
                  <CurrentIcon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary">
                    {mode === "add" ? "Onboard" : "Update"} {roleConfig[selectedRole].title}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Profile & Credentials
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="name" label="Full Name *" placeholder="Jane Doe"
                  value={formData.name || ""} onChange={handleInputChange} icon={<User size={16} />}
                />
                
                <Input
                  name="password" label="Portal Password *" type="password" placeholder="Secure Password"
                  value={formData.password || ""} onChange={handleInputChange} icon={<Fingerprint size={16} />}
                />

                <Input
                  name="gmail" label="Email Address" type="email" placeholder="jane@hospital.com"
                  value={formData.gmail || ""} onChange={handleInputChange} icon={<Mail size={16} />}
                />
                
                <Input
                  name="contact" label="Contact Number" placeholder="+91..."
                  value={formData.contact || ""} onChange={handleInputChange} icon={<Phone size={16} />}
                />
                
                <Input
                  name="adhaar" label="National ID / Aadhaar" placeholder="XXXX-XXXX-XXXX"
                  value={formData.adhaar || ""} onChange={handleInputChange} icon={<Fingerprint size={16} />}
                />
                
                <Input
                  name="punch_id" label="Biometric Punch ID *" type="number" placeholder="1001"
                  value={formData.punch_id || ""} onChange={handleInputChange} icon={<Activity size={16} />}
                />

                {/* Conditional Field: Designation is for Doctors only */}
                {selectedRole === "doctor" && (
                  <Input
                    name="designation" label="Designation / Specialization" placeholder="Cardiologist, MBBS"
                    value={formData.designation || ""} onChange={handleInputChange} icon={<Briefcase size={16} />}
                  />
                )}

                <div className="group md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                    Residential Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400" size={16} />
                    <textarea
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder="Full residential address"
                      className="w-full bg-slate-50 border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white min-h-[100px] text-gray-700"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                    Employment Status
                  </label>
                  <div className="relative">
                    <select
                      name="is_active"
                      value={formData.is_active || "true"}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white text-gray-700 appearance-none cursor-pointer"
                    >
                      <option value="true">Active (On Duty)</option>
                      <option value="false">Inactive (Suspended/Resigned)</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-widest text-sm group disabled:opacity-70"
              >
                {isProcessing ? "Processing..." : mode === "add" ? `Register ${roleConfig[selectedRole].title}` : `Update ${roleConfig[selectedRole].title}`}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        )}

        {/* Empty State Instructions */}
        {!selectedRole && (
          <div className="py-20 text-center text-slate-400 space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100">
              <User size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-500">Awaiting Selection</h3>
            <p className="font-medium text-gray-400 max-w-sm mx-auto text-sm">
              Please follow Steps 1 through 3 above to load the appropriate staff form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Input Component
function Input({ label, placeholder = "", type = "text", name, value, onChange, icon }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest group-focus-within:text-secondary transition-colors ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
            {icon}
          </div>
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border-transparent rounded-2xl py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white hover:border-secondary/20 hover:shadow-sm placeholder:text-slate-300 text-gray-700 ${icon ? "pl-12 pr-4" : "px-6"}`}
        />
      </div>
    </div>
  );
}