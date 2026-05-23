import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Plus,
  Building2,
  ChevronDown,
  Search,
  User,
} from "lucide-react";
import { useToast } from "../../../../utils/ToastContext";
import {
  doctorRegister,
  doctorUpdate,
  getDoctorForAdmin,
  getHospitalForAdmin,
} from "../../../../api/auth";

export default function Doctors() {
  const [mode, setMode] = useState("add");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [selectedBranchIdForUpdate, setSelectedBranchIdForUpdate] =
    useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const [hospitals, setHospitals] = useState([]);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({});

  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [docRes, hospRes] = await Promise.all([
          getDoctorForAdmin(token),
          getHospitalForAdmin(token),
        ]);
        if (docRes.status) setStaff(docRes.doctors);
        if (hospRes.status) setHospitals(hospRes.hospitals);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormData({});
    setSelectedEntityId("");
    setSelectedBranchIdForUpdate("");
  }, [mode]);

  useEffect(() => {
    if (mode === "update" && selectedEntityId) {
      const s = staff?.find((s) => s.Id === selectedEntityId);
      if (s) {
        setFormData({
          name: s.Name,
          email: s.Email__c,
          specialization: s.Specialization__c,
          phone_no: s.Phone_No__c,
          adhaar_no: s.Aadhaar_No__c,
          date_of_birth: s.Date_of_Birth__c || "2026-01-09",
          status: s.Status__c || "Available",
          Hospital__c: s.Hospital__c,
        });
      }
    } else {
      setFormData({});
    }
  }, [selectedEntityId, mode, staff]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      doctorId: mode === "update" ? selectedEntityId : null,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.specialization) {
      showToast({
        title: "Required Fields",
        message: "Please fill in the Name, Email, and Specialization.",
        type: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      let response;
      if (mode === "add") {
        response = await doctorRegister(token, formData);
      } else {
        response = await doctorUpdate(token, formData);
      }
      if (response.status) {
        setStaff((prevStaff) => {
          if (mode === "add") {
            // Add new doctor to the top of the list
            const newDoctor = {
              Id: response.id, // ID from Salesforce
              Name: formData.name,
              Email__c: formData.email,
              Specialization__c: formData.specialization,
              Phone_No__c: formData.phone_no,
              Aadhaar_No__c: formData.adhaar_no,
              Date_of_Birth__c: formData.date_of_birth,
              Hospital__c: formData.Hospital__c,
              Status__c: formData.status || "Available",
            };
            return [newDoctor, ...prevStaff];
          } else {
            // Find the existing doctor and update their details
            return prevStaff.map((doc) =>
              doc.Id === selectedEntityId
                ? {
                    ...doc,
                    Name: formData.name,
                    Email__c: formData.email,
                    Specialization__c: formData.specialization,
                    Phone_No__c: formData.phone_no,
                    Aadhaar_No__c: formData.adhaar_no,
                    Date_of_Birth__c: formData.date_of_birth,
                    Status__c: formData.status,
                  }
                : doc,
            );
          }
        });
        showToast({
          title: "Success",
          message: "Doctor record processed successfully.",
          type: "success",
        });

        setTimeout(() => {
          if (mode === "add") setFormData({});
          setSelectedEntityId("");
        }, 3000);
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

  const filteredDoctors = selectedBranchIdForUpdate
    ? staff?.filter((d) => d.Hospital__c === selectedBranchIdForUpdate)
    : [];

  return (
    <div
      className="max-w-5xl mx-auto space-y-10 py-8 fade-in min-h-screen"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-primary">
          Practitioner Management
        </h2>
        <p className="text-slate-500 font-medium">
          Add new doctors or update existing records in the MedLock network.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center relative">
          <button
            onClick={() => setMode("add")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${mode === "add" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Plus size={14} strokeWidth={3} /> Register New
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
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-secondary/30 transition-colors">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2 group-hover:text-primary transition-colors">
                  <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Building2 size={10} />
                  </div>
                  Step 1: Select Branch
                </label>
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer"
                  value={selectedBranchIdForUpdate}
                  onChange={(e) => {
                    setSelectedBranchIdForUpdate(e.target.value);
                    setSelectedEntityId("");
                  }}
                >
                  <option value="">-- Choose Branch --</option>
                  {hospitals?.map((h) => (
                    <option key={h.Id} value={h.Id}>
                      {h.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-secondary/30 transition-all duration-300 ${!selectedBranchIdForUpdate ? "opacity-50 pointer-events-none grayscale" : "opacity-100"}`}
              >
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest flex items-center gap-2 group-hover:text-primary transition-colors">
                  <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Stethoscope size={10} />
                  </div>
                  Step 2: Select Doctor
                </label>
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer"
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  disabled={!selectedBranchIdForUpdate}
                >
                  <option value="">-- Choose Doctor --</option>
                  {filteredDoctors?.map((d) => (
                    <option key={d.Id} value={d.Id}>
                      {d.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {(mode === "add" || selectedEntityId) && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 ease-out">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm">
                  <Stethoscope size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary">
                    {mode === "add" ? "Onboard" : "Update"} Practitioner
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Professional Staffing
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {mode === "add" && (
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                      Target Branch Assignment
                    </label>
                    <div className="relative group">
                      <Building2
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors"
                        size={18}
                      />
                      <select
                        name="Hospital__c"
                        value={formData.Hospital__c || ""}
                        onChange={handleInputChange}
                        className="w-full bg-slate-50 border-transparent rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm hover:bg-white hover:border-secondary/20 cursor-pointer appearance-none"
                      >
                        <option value="">Select Branch</option>
                        {hospitals?.map((h) => (
                          <option key={h.Id} value={h.Id}>
                            {h.Name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    name="name"
                    label="Doctor Name"
                    placeholder="Dr. Madhuri"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    icon={<User size={16} />}
                    disabled={!formData.Hospital__c}
                  />
                  <Input
                    name="specialization"
                    label="Specialization"
                    placeholder="Cardiology"
                    value={formData.specialization || ""}
                    onChange={handleInputChange}
                    icon={<Stethoscope size={16} />}
                    disabled={!formData.Hospital__c}
                  />
                  <Input
                    name="email"
                    label="Email"
                    placeholder="your@gmail.com"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    disabled={!formData.Hospital__c}
                  />
                  <Input
                    name="phone_no"
                    label="Phone No"
                    placeholder="+91..."
                    value={formData.phone_no || ""}
                    onChange={handleInputChange}
                    disabled={!formData.Hospital__c}
                  />
                  <Input
                    name="adhaar_no"
                    label="Aadhaar No"
                    placeholder="918882641706"
                    value={formData.adhaar_no || ""}
                    onChange={handleInputChange}
                    disabled={!formData.Hospital__c}
                  />
                  <Input
                    name="date_of_birth"
                    label="Date of Birth"
                    type="date"
                    value={formData.date_of_birth || "2026-01-09"}
                    onChange={handleInputChange}
                    disabled={!formData.Hospital__c}
                  />
                  <Input
                    name="status"
                    label="Status"
                    placeholder="Available"
                    value={formData.status || "available"}
                    onChange={handleInputChange}
                    disabled={!formData.Hospital__c}
                  />
                </div>
              </div>
              <SubmitButton
                label={
                  isProcessing
                    ? "Processing..."
                    : mode === "add"
                      ? "Register Practitioner"
                      : "Update Practitioner"
                }
              />
            </form>
          </div>
        )}

        {mode === "update" && !selectedEntityId && (
          <div className="py-24 text-center text-slate-400 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 size={40} className="text-gray-200" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-500">Ready to Edit</h3>
              <p className="font-medium text-gray-400 max-w-md mx-auto">
                Please select a branch and then a doctor above to begin editing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-components kept exactly as provided
function Input({
  label,
  placeholder = "",
  type = "text",
  name,
  value,
  onChange,
  disabled,
  icon,
}) {
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
          disabled={disabled}
          className={`w-full bg-slate-50 border-transparent rounded-2xl py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white hover:border-secondary/20 hover:shadow-sm placeholder:text-slate-300 text-gray-700 ${icon ? "pl-12 pr-4" : "px-6"}`}
        />
      </div>
    </div>
  );
}

function SubmitButton({ label }) {
  return (
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] uppercase tracking-widest text-sm group"
    >
      {label}{" "}
      <ArrowRight
        size={18}
        className="group-hover:translate-x-1 transition-transform"
      />
    </button>
  );
}
