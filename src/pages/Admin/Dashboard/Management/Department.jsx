import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Layers as DepartmentIcon,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Plus,
  ChevronDown,
  Search,
} from "lucide-react";
import { useToast } from "../../../../utils/ToastContext";

export default function Departments() {
  const [mode, setMode] = useState("add");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedHospitalForUpdate, setSelectedHospitalForUpdate] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({});

  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  // Fetch all hospitals and departments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetch Hospitals
        const hospRes = await fetch("http://127.0.0.1:8000/api/ad/branches/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hospData = await hospRes.json();
        if (hospRes.ok) setHospitals(hospData.hospitals || []);

        // Fetch Departments (FIXED: Added trailing slash)
        const deptRes = await fetch("http://127.0.0.1:8000/api/ad/manage/departments/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const deptData = await deptRes.json();
        if (deptRes.ok) setDepartments(deptData.departments || []);
        
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  // Reset form when mode changes
  useEffect(() => {
    setFormData({});
    setSelectedEntityId("");
    setSelectedHospitalForUpdate("");
  }, [mode]);

  // Load department data into form for update
  useEffect(() => {
    if (mode === "update" && selectedEntityId) {
      const d = departments.find((dept) => String(dept.id) === String(selectedEntityId));
      if (d) {
        setFormData({
          hospital_id: d.hospital_id || "",
          name: d.name || "",
          password: d.password || "",
          building_id: d.building_id || "",
          floor: d.floor || "",
          is_active: d.is_active !== undefined ? String(d.is_active) : "true",
        });
      }
    }
  }, [selectedEntityId, mode, departments]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hospital_id || !formData.name || !formData.password) {
      showToast({
        title: "Required Fields",
        message: "Please fill in Hospital, Department Name, and Password.",
        type: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const isAdd = mode === "add";
      
      const fetchMethod = isAdd ? "POST" : "PUT";
      const payload = isAdd ? formData : { ...formData, id: selectedEntityId };

      const response = await fetch("http://127.0.0.1:8000/api/ad/manage/departments/", {
        method: fetchMethod,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // Sync local React state
        setDepartments((prev) => {
          if (isAdd) {
            const newDept = {
              id: data.id,
              hospital_id: formData.hospital_id,
              name: formData.name,
              password: formData.password,
              building_id: formData.building_id,
              floor: formData.floor,
              is_active: formData.is_active === "true",
            };
            return [newDept, ...prev];
          }
          // Update mode
          return prev.map((d) =>
            String(d.id) === String(selectedEntityId)
              ? {
                  ...d,
                  name: formData.name,
                  password: formData.password,
                  building_id: formData.building_id,
                  floor: formData.floor,
                  is_active: formData.is_active === "true",
                }
              : d
          );
        });

        showToast({
          title: "Success",
          message: data.message || "Department records synchronized.",
          type: "success",
        });

        setTimeout(() => {
          if (mode === "add") {
            setFormData({});
          }
          setSelectedEntityId("");
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to save department.");
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: error.message || "Operation failed.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredDepartments = selectedHospitalForUpdate
    ? departments.filter((d) => String(d.hospital_id) === String(selectedHospitalForUpdate))
    : [];

  return (
    <div
      className="max-w-5xl mx-auto space-y-12 py-8 fade-in min-h-screen"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-primary">
          Department Management
        </h2>
        <p className="text-slate-500 font-medium">
          Add new departments or update existing wings in the network.
        </p>
      </div>

      {/* Mode Toggle Switch */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center relative">
          <button
            onClick={() => setMode("add")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === "add" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Plus size={14} strokeWidth={3} /> Add New
          </button>
          <button
            onClick={() => setMode("update")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === "update" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Edit3 size={14} strokeWidth={3} /> Update Existing
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-secondary/5 p-10 animate-in fade-in slide-in-from-bottom-6 relative overflow-hidden">
        {mode === "update" && (
          <div className="mb-10 space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-[2rem]  border border-slate-100 group hover:border-secondary/30 transition-colors">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest group-hover:text-primary transition-colors">
                  Step 1: Select Hospital Branch
                </label>
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer"
                  value={selectedHospitalForUpdate}
                  onChange={(e) => {
                    setSelectedHospitalForUpdate(e.target.value);
                    setSelectedEntityId(""); 
                  }}
                >
                  <option value="">-- Choose Branch --</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-secondary/30 transition-all ${!selectedHospitalForUpdate ? "opacity-50 pointer-events-none grayscale" : ""}`}>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest group-hover:text-primary transition-colors">
                  Step 2: Select Department
                </label>
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer"
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                >
                  <option value="">-- Choose Department --</option>
                  {filteredDepartments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {(mode === "add" || selectedEntityId) && (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm">
                <DepartmentIcon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary">
                  {mode === "add" ? "Register" : "Update"} Department
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Hospital Wings & Sectors
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mode === "add" && (
                <div className="md:col-span-2 group">
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                    Parent Hospital *
                  </label>
                  <div className="relative">
                    <select
                      name="hospital_id"
                      value={formData.hospital_id || ""}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white text-gray-700 appearance-none cursor-pointer"
                    >
                      <option value="">Select Branch</option>
                      {hospitals.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} {/* FIXED: Changed from h.Name */}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
              )}

              <Input
                name="name"
                label="Department Name *"
                placeholder="Cardiology"
                value={formData.name || ""}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                label="Department Access Password *"
                type="password"
                placeholder="Secure Password"
                value={formData.password || ""}
                onChange={handleInputChange}
              />
              <Input
                name="building_id"
                label="Building ID"
                placeholder="Block B"
                value={formData.building_id || ""}
                onChange={handleInputChange}
              />
              <Input
                name="floor"
                label="Floor"
                placeholder="2nd Floor"
                value={formData.floor || ""}
                onChange={handleInputChange}
              />

              <div className="group">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="is_active"
                    value={formData.is_active || "true"}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
            
            <SubmitButton
              label={
                isProcessing
                  ? "Processing..."
                  : mode === "add"
                    ? "Create Department"
                    : "Update Department"
              }
            />
          </form>
        )}

        {mode === "update" && !selectedEntityId && (
          <div className="py-24 text-center text-slate-400 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 size={40} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-bold text-gray-500">Ready to Edit</h3>
            <p className="font-medium text-gray-400 max-w-md mx-auto">
              Please select a branch and a department above to begin editing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Components matching your provided code exactly
function Input({ label, placeholder = "", type = "text", name, value, onChange }) {
  return (
    <div className="group">
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white text-gray-700"
      />
    </div>
  );
}

function SubmitButton({ label }) {
  return (
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] uppercase tracking-widest text-sm"
    >
      {label} <ArrowRight size={18} />
    </button>
  );
}