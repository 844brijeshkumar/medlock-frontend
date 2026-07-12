import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Hospital as HospitalIcon,
  ArrowRight,
  CheckCircle2,
  Edit3,
  Plus,
  ChevronDown,
  Search,
} from "lucide-react";
import { useToast } from "../../../../utils/ToastContext";
import { fetchLocations } from "../../../../utils/api";

export default function Management() {
  const [activeSubTab] = useState("hospital");
  const [mode, setMode] = useState("add");
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  
  const [locationData, setLocationData] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [hospitals, setHospitals] = useState([]);
  const [formData, setFormData] = useState({});

  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  // Load locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const data = await fetchLocations();
        setLocationData(data);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };
    loadLocations();
  }, []);

  // Fetch all hospitals on mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = localStorage.getItem("token");
        // Using the GET endpoint we made previously
        const res = await fetch("http://127.0.0.1:8000/api/ad/branches/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const data = await res.json();
        if (res.ok) {
          setHospitals(data.hospitals || []);
        }
      } catch (err) {
        console.error("Failed to load hospitals:", err);
      }
    };
    fetchHospitals();
  }, []);

  // Reset form when mode changes
  useEffect(() => {
    setFormData({});
    setSelectedEntityId("");
    setIsSuccess(false);
    setSelectedState("");
    setSelectedDistrict("");
  }, [mode]);

  // Load hospital data into form for update
  useEffect(() => {
    if (mode === "update" && selectedEntityId) {
      const h = hospitals.find((h) => h.id === selectedEntityId);
      if (h) {
        setFormData({
          name: h.Name || "",
          npi: h.npi_id || "", 
          contact: h.contact_number || "",
          address: h.address || "",
          email: h.email || "",
          state: h.State__r?.Name || "",
          district: h.District__r?.Name || "",
          image: h.image_url || "",
        });
        setSelectedState(h.State__r?.Name || "");
        setSelectedDistrict(h.District__r?.Name || "");
      }
    }
  }, [selectedEntityId, mode, hospitals]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.state) {
      showToast({
        title: "Required Fields",
        message: "Please fill in Name, Email, and State.",
        type: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const isAdd = mode === "add";
      
      // Setup fetch configuration based on Mode (POST vs PUT)
      const fetchMethod = isAdd ? "POST" : "PUT";
      const payload = isAdd ? formData : { ...formData, id: selectedEntityId };

      const response = await fetch("http://127.0.0.1:8000/api/ad/manage/hospitals/", {
        method: fetchMethod,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status) {
        // Sync local React state without needing to refresh the page
        setHospitals((prev) => {
          if (isAdd) {
            const newHosp = {
              id: data.id,
              Name: formData.name,
              State__r: { Name: formData.state },
              District__r: { Name: formData.district },
              Status__c: "Active",
            };
            return [newHosp, ...prev];
          }
          // Update mode
          return prev.map((h) =>
            h.id === selectedEntityId
              ? {
                  ...h,
                  Name: formData.name,
                  State__r: { Name: formData.state },
                  District__r: { Name: formData.district },
                }
              : h
          );
        });

        showToast({
          title: "Success",
          message: data.message || "Hospital records synchronized.",
          type: "success",
        });

        setTimeout(() => {
          if (mode === "add") {
            setFormData({});
            setSelectedState("");
            setSelectedDistrict("");
          }
          setSelectedEntityId("");
        }, 1000);
      } else {
        throw new Error(data.message || "Failed to save hospital.");
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

  useEffect(() => {
    if (mode === "add") setSelectedDistrict("");
  }, [selectedState, mode]);

  const stateOptions = useMemo(
    () => Object.keys(locationData).sort(),
    [locationData],
  );
  
  const districtOptions = useMemo(
    () => (selectedState ? (locationData[selectedState] || []).sort() : []),
    [selectedState, locationData],
  );

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
          Entity Management
        </h2>
        <p className="text-slate-500 font-medium">
          Add new branches or update existing records in the MedLock network.
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
            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-secondary/30 transition-colors">
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest group-hover:text-primary transition-colors">
                Select Hospital Branch to Edit
              </label>
              <select
                className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer"
                value={selectedEntityId}
                onChange={(e) => setSelectedEntityId(e.target.value)}
              >
                <option value="">-- Choose Hospital --</option>
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(mode === "add" || selectedEntityId) && (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm">
                <HospitalIcon size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-primary">
                  {mode === "add" ? "Register" : "Update"} Hospital
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                  Branch Infrastructure
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="name"
                label="Hospital Name *"
                placeholder="City General Hospital"
                value={formData.name || ""}
                onChange={handleInputChange}
              />

              <Input
                name="npi"
                label="NPI Id"
                placeholder="NPI-DEL-006"
                value={formData.npi || ""}
                onChange={handleInputChange}
              />
              <Input
                name="contact"
                label="Contact Number"
                placeholder="011-23311273"
                value={formData.contact || ""}
                onChange={handleInputChange}
              />
              <Input
                name="address"
                label="Address"
                placeholder="123 Medical Lane"
                value={formData.address || ""}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                label="Email *"
                placeholder="admin@medlock.com"
                type="email"
                value={formData.email || ""}
                onChange={handleInputChange}
              />

              <SearchableSelect
                label="State *"
                placeholder="Select State"
                options={stateOptions}
                value={formData.state || selectedState}
                onChange={(val) => {
                  handleSelectChange("state", val);
                  setSelectedState(val);
                }}
              />
              <SearchableSelect
                label="District"
                options={districtOptions}
                placeholder="Select District"
                value={formData.district || selectedDistrict}
                onChange={(val) => {
                  handleSelectChange("district", val);
                  setSelectedDistrict(val);
                }}
              />

              <div className="md:col-span-2">
                <Input
                  name="image"
                  label="Hospital Image URL"
                  placeholder="https://..."
                  value={formData.image || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <SubmitButton
              label={
                isProcessing
                  ? "Processing..."
                  : mode === "add"
                    ? "Launch Branch"
                    : "Update Branch"
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
              Please select a branch above to begin editing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable Components
function SearchableSelect({ label, placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="group relative" ref={containerRef}>
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          placeholder={placeholder}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          className="w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white text-gray-700"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {isOpen && (filteredOptions.length > 0 || searchTerm !== "") && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          <div className="p-2 space-y-1">
            {filteredOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setSearchTerm(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 ${value === opt ? "bg-accent/30 text-primary" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Search size={14} /> {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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