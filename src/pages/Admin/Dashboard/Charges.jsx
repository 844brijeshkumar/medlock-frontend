import React, {
  useState,
  useEffect,
  useMemo,
  useContext,
  createContext,
} from "react";
import {
  DollarSign,
  ArrowRight,
  Edit3,
  Plus,
  ChevronDown,
  ChevronRight,
  Activity,
  ClipboardList,
  Filter,
  Users,
  Zap,
  Baby,
} from "lucide-react";

// --- MOCK API & CONTEXT FOR PREVIEW ---

// 1. Mock Toast Context
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ title, message, type }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border min-w-[300px] animate-in slide-in-from-right-full fade-in duration-300 ${
              toast.type === "error"
                ? "bg-red-50 border-red-100 text-red-800"
                : toast.type === "warning"
                ? "bg-amber-50 border-amber-100 text-amber-800"
                : "bg-emerald-50 border-emerald-100 text-emerald-800"
            }`}
          >
            <div className="font-bold text-sm">{toast.title}</div>
            <div className="text-xs opacity-90">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// 2. Mock API Functions
const getHospitalForAdmin = async (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: true,
        hospitals: [
          { Id: "h1", Name: "City General Hospital" },
          { Id: "h2", Name: "Metro West Clinic" },
          { Id: "h3", Name: "Lakeside Medical Center" },
        ],
      });
    }, 600);
  });
};

const upsertDepartmentPricing = async (token, payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Payload sent to Salesforce:", payload);
      resolve({ status: true });
    }, 1000);
  });
};

// Mock fetch single record for Edit Mode
const getDepartmentPricing = async (
  token,
  hospitalId,
  type,
  gender,
  ageGroup
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock DB: Only City General (h1) has some data for demo
      if (
        hospitalId === "h1" &&
        type === "Standard" &&
        gender === "Any" &&
        ageGroup === "Adult"
      ) {
        resolve({
          status: true,
          data: {
            Neurology: 500,
            Cardiology: 1200,
            Gynecology: "",
            Pediatrics: 400,
            "General Surgery": 200,
            Dermatology: 350,
          },
        });
      } else if (
        hospitalId === "h1" &&
        type === "Emergency" &&
        ageGroup === "Adult"
      ) {
        resolve({
          status: true,
          data: { Neurology: 900, Cardiology: 2000, "General Surgery": 500 },
        });
      } else if (hospitalId === "h1" && ageGroup === "Born Baby") {
        resolve({
          status: true,
          data: { Pediatrics: 1500, "General Surgery": 800, Cardiology: 3000 },
        });
      } else {
        resolve({ status: true, data: {} });
      }
    }, 500);
  });
};

// Mock fetch list for View Mode
const getAllPricingRecords = async (
  token,
  hospitalFilter,
  typeFilter,
  genderFilter,
  ageFilter
) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Demo Data
      const allRecords = [
        {
          id: 1,
          hospitalName: "City General Hospital",
          hospitalId: "h1",
          type: "Standard",
          gender: "Any",
          ageGroup: "Adult",
          prices: {
            Neurology: 500,
            Cardiology: 1200,
            "General Surgery": 200,
            Pediatrics: 450,
            "Orthopedic Surgery": 800,
          },
        },
        {
          id: 2,
          hospitalName: "City General Hospital",
          hospitalId: "h1",
          type: "Emergency",
          gender: "Any",
          ageGroup: "Adult",
          prices: { Neurology: 900, Cardiology: 2000, "General Surgery": 500 },
        },
        {
          id: 3,
          hospitalName: "Metro West Clinic",
          hospitalId: "h2",
          type: "Standard",
          gender: "Female",
          ageGroup: "Adult",
          prices: { Gynecology: 800, "General Surgery": 300 },
        },
      ];

      let results = allRecords;

      if (hospitalFilter && hospitalFilter !== "All") {
        results = results.filter((r) => r.hospitalId === hospitalFilter);
      }
      if (typeFilter && typeFilter !== "All") {
        results = results.filter((r) => r.type === typeFilter);
      }
      if (genderFilter && genderFilter !== "All") {
        results = results.filter((r) => r.gender === genderFilter);
      }
      if (ageFilter && ageFilter !== "All") {
        results = results.filter((r) => r.ageGroup === ageFilter);
      }

      resolve({ status: true, data: results });
    }, 600);
  });
};

// --- END MOCKS ---

// --- CONFIGURATION: DEPARTMENT MASTER LIST ---
const DEPARTMENT_CONFIG = [
  { key: "Cardiology", label: "Cardiology", desc: "Heart, blood pressure, and vascular health." },
  { key: "Neurology", label: "Neurology", desc: "Brain, spinal cord, and nervous system." },
  { key: "Oncology", label: "Oncology", desc: "Cancer treatment (Chemotherapy & Immunotherapy)." },
  { key: "Gastroenterology", label: "Gastroenterology", desc: "Digestive system, stomach, and liver health." },
  { key: "Endocrinology", label: "Endocrinology", desc: "Hormones, Diabetes, and Thyroid issues." },
  { key: "Nephrology", label: "Nephrology", desc: "Kidney diseases and Dialysis." },
  { key: "Pulmonology", label: "Pulmonology", desc: "Lungs and respiratory health (Asthma/COPD)." },
  { key: "Dermatology", label: "Dermatology", desc: "Skin, hair, and nail conditions." },
  { key: "Rheumatology", label: "Rheumatology", desc: "Autoimmune diseases and joint inflammation." },
  { key: "Psychiatry", label: "Psychiatry", desc: "Mental health and behavioral therapy." },
  { key: "InfectiousDiseases", label: "Infectious Diseases", desc: "Viral, bacterial, and parasitic infections." },
  { key: "Hematology", label: "Hematology", desc: "Blood-related disorders and bone marrow." },
  { key: "Immunology", label: "Immunology", desc: "Immune system disorders." }, // Separated
  { key: "Allergy", label: "Allergy", desc: "Severe allergic reactions." }, // Separated
  { key: "Geriatrics", label: "Geriatrics", desc: "Specialized care for the elderly." },
  { key: "GeneralSurgery", label: "General Surgery", desc: "Abdominal and soft tissue operative procedures." },
  { key: "OrthopedicSurgery", label: "Orthopedic Surgery", desc: "Bone fractures, joints, and musculoskeletal repair." },
  { key: "CardiothoracicSurgery", label: "Cardiothoracic Surgery", desc: "Operative care for heart and lungs." },
  { key: "Neurosurgery", label: "Neurosurgery", desc: "Brain and spinal cord surgery." },
  { key: "Ophthalmology", label: "Ophthalmology", desc: "Medical and surgical care for eyes." },
  { key: "Otolaryngology", label: "Otolaryngology (ENT)", desc: "Ear, nose, throat, and neck surgery." },
  { key: "Urology", label: "Urology", desc: "Urinary tract and male reproductive health." },
  { key: "Gynecology", label: "Gynecology", desc: "Female reproductive system (Uterus/Ovaries)." },
  { key: "PlasticReconstructive", label: "Plastic & Reconstructive", desc: "Trauma recovery and gender-affirming surgery." },
  { key: "VascularSurgery", label: "Vascular Surgery", desc: "Surgery on arteries and veins." },
  { key: "OralMaxillofacial", label: "Oral & Maxillofacial", desc: "Surgery for face, mouth, and jaws." },
  { key: "ReproEndocrinology", label: "Repro. Endocrinology", desc: "Fertility, IVF, and hormone replacement." },
  { key: "SexualHealth", label: "Sexual Health", desc: "STI treatment and sexual wellness." },
  { key: "Anesthesiology", label: "Anesthesiology", desc: "Pain management and sedation for procedures." },
];

function DepartmentChargesContent() {
  const [mode, setMode] = useState("add"); // modes: 'add', 'update', 'view'
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  // State for View Mode
  const [viewFilterHospital, setViewFilterHospital] = useState("All");
  const [viewFilterType, setViewFilterType] = useState("All");
  const [viewFilterGender, setViewFilterGender] = useState("All");
  const [viewFilterAge, setViewFilterAge] = useState("All");

  const [viewData, setViewData] = useState([]);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState(null);

  // New state for Pricing Logic (Composite Keys)
  const [chargeType, setChargeType] = useState("Standard");
  const [genderTarget, setGenderTarget] = useState("Any");
  const [ageGroup, setAgeGroup] = useState("Adult");

  // Initialize state based on the Configuration List
  const [pricingData, setPricingData] = useState(() => {
    const initialState = {};
    DEPARTMENT_CONFIG.forEach(dept => {
      initialState[dept.key] = "";
    });
    return initialState;
  });

  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    []
  );

  // Fetch Hospitals for the dropdown
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const token = "mock-token";
        const res = await getHospitalForAdmin(token);
        if (res.status) setHospitals(res.hospitals);
      } catch (err) {
        console.error("Failed to load hospitals:", err);
        showToast({
          title: "Error",
          message: "Failed to load hospitals",
          type: "error",
        });
      }
    };
    fetchHospitals();
  }, [showToast]);

  // Handle Edit Mode Data Fetching
  useEffect(() => {
    if (mode === "update" && selectedHospitalId) {
      const loadPricing = async () => {
        setIsProcessing(true);
        try {
          const res = await getDepartmentPricing(
            "token",
            selectedHospitalId,
            chargeType,
            genderTarget,
            ageGroup
          );
          
          // Merge fetched data with default structure to ensure all inputs work
          const mergedData = {};
          // Ensure every key in config exists in state, populating from API if available
          DEPARTMENT_CONFIG.forEach(dept => {
             // Handle case where API might use Label or Key. Assuming API uses Keys.
             const apiValue = res.data && (res.data[dept.key] || res.data[dept.label]);
             mergedData[dept.key] = apiValue !== undefined ? apiValue : "";
          });

          setPricingData(mergedData);
        } catch (error) {
          console.error(error);
        } finally {
          setIsProcessing(false);
        }
      };
      loadPricing();
    } else if (mode === "add") {
       // Reset all fields to empty
       const resetData = {};
       DEPARTMENT_CONFIG.forEach(dept => {
         resetData[dept.key] = "";
       });
       setPricingData(resetData);
    }
  }, [selectedHospitalId, chargeType, genderTarget, ageGroup, mode]);

  // Handle View Mode Data Fetching with Filters
  useEffect(() => {
    if (mode === "view") {
      const loadViewData = async () => {
        setIsLoadingView(true);
        try {
          const res = await getAllPricingRecords(
            "token",
            viewFilterHospital,
            viewFilterType,
            viewFilterGender,
            viewFilterAge
          );
          setViewData(res.data || []);
        } catch (error) {
          showToast({
            title: "Error",
            message: "Could not load records",
            type: "error",
          });
        } finally {
          setIsLoadingView(false);
        }
      };
      loadViewData();
    }
  }, [
    mode,
    viewFilterHospital,
    viewFilterType,
    viewFilterGender,
    viewFilterAge,
  ]);

  const handlePriceChange = (e) => {
    const val = e.target.value;
    setPricingData({ ...pricingData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHospitalId) {
      showToast({
        title: "Validation Error",
        message: "Please select a hospital branch.",
        type: "warning",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const token = "mock-token";
      const payload = {
        hospitalId: selectedHospitalId,
        chargeType: chargeType,
        genderTarget: genderTarget,
        ageGroup: ageGroup,
        prices: pricingData,
      };

      const response = await upsertDepartmentPricing(token, payload);

      if (response && response.status) {
        showToast({
          title: "Success",
          message: "Department charges updated successfully.",
          type: "success",
        });
      } else {
        showToast({
          title: "Success",
          message: "Department charges saved locally (Demo).",
          type: "success",
        });
      }
    } catch (error) {
      console.error(error);
      showToast({
        title: "Error",
        message: error.message || "Failed to save records.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRow = (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
    } else {
      setExpandedRowId(id);
    }
  };

  return (
    <div
      className="max-w-6xl mx-auto space-y-12 py-8 fade-in min-h-screen"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-primary">
          Department Charges
        </h2>
        <p className="text-slate-500 font-medium">
          Configure service rates based on hospital branch, urgency, gender, and
          age group.
        </p>
      </div>

      {/* Mode Toggle Switch */}
      <div className="flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center relative transition-all duration-300 hover:shadow-md">
          <button
            onClick={() => setMode("add")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${mode === "add" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Plus size={14} strokeWidth={3} /> New Charge
          </button>
          <button
            onClick={() => setMode("update")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${mode === "update" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Edit3 size={14} strokeWidth={3} /> Edit Pricing
          </button>
          <button
            onClick={() => setMode("view")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${mode === "view" ? "text-white shadow-md bg-gradient-to-r from-primary to-secondary" : "text-gray-400 hover:text-gray-600"}`}
          >
            <ClipboardList size={14} strokeWidth={3} /> View Rates
          </button>
        </div>
      </div>

      {/* VIEW MODE UI */}
      {mode === "view" && (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-secondary/5 p-10 animate-in fade-in slide-in-from-bottom-6 overflow-hidden">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-black text-primary flex items-center gap-2">
                <ClipboardList className="text-secondary" /> Active Rate Cards
              </h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">
                Overview of all configured prices
              </p>
            </div>

            {/* FILTERS BAR */}
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-sm hover:border-slate-200">
              <div className="flex items-center gap-2 px-2 border-r border-slate-200">
                <Filter size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Filters:
                </span>
              </div>

              {/* Branch Filter */}
              <div className="relative group transition-transform hover:-translate-y-0.5 duration-200">
                <select
                  value={viewFilterHospital}
                  onChange={(e) => setViewFilterHospital(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none py-2 pl-2 pr-6 cursor-pointer hover:text-primary transition-colors appearance-none min-w-[120px]"
                >
                  <option value="All">All Branches</option>
                  {hospitals.map((h) => (
                    <option key={h.Id} value={h.Id}>
                      {h.Name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors"
                />
              </div>

              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

              {/* Type Filter */}
              <div className="relative group transition-transform hover:-translate-y-0.5 duration-200">
                <select
                  value={viewFilterType}
                  onChange={(e) => setViewFilterType(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none py-2 pl-2 pr-6 cursor-pointer hover:text-primary transition-colors appearance-none min-w-[100px]"
                >
                  <option value="All">All Types</option>
                  <option value="Standard">Standard</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Service-Base">Service-Base</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors"
                />
              </div>

              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

              {/* Gender Filter */}
              <div className="relative group transition-transform hover:-translate-y-0.5 duration-200">
                <select
                  value={viewFilterGender}
                  onChange={(e) => setViewFilterGender(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none py-2 pl-2 pr-6 cursor-pointer hover:text-primary transition-colors appearance-none min-w-[100px]"
                >
                  <option value="All">All Genders</option>
                  <option value="Any">Any (All)</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors"
                />
              </div>

              <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>

              {/* Age Filter */}
              <div className="relative group transition-transform hover:-translate-y-0.5 duration-200">
                <select
                  value={viewFilterAge}
                  onChange={(e) => setViewFilterAge(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-600 outline-none py-2 pl-2 pr-6 cursor-pointer hover:text-primary transition-colors appearance-none min-w-[100px]"
                >
                  <option value="All">All Ages</option>
                  <option value="Born Baby">Born Baby</option>
                  <option value="Infant">Infant</option>
                  <option value="Child">Child</option>
                  <option value="Teenage">Teenage</option>
                  <option value="Adult">Adult</option>
                  <option value="Geriatric">Geriatric</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {isLoadingView ? (
            <div className="py-20 text-center text-slate-400 animate-pulse">
              Loading records...
            </div>
          ) : viewData.length === 0 ? (
            <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              No pricing records found for this selection.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="py-4 pl-4">Branch</th>
                    <th className="py-4">Type</th>
                    <th className="py-4">Patient Profile</th>
                    <th className="py-4 text-right pr-4">Active Config</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-bold text-slate-600">
                  {viewData.map((record) => {
                    const activeDepts = Object.entries(record.prices).filter(
                      ([_, p]) => p !== "" && p !== null && p !== undefined,
                    );
                    const isExpanded = expandedRowId === record.id;

                    return (
                      <React.Fragment key={record.id}>
                        <tr
                          onClick={() => toggleRow(record.id)}
                          className={`border-b border-slate-50 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer group select-none relative ${isExpanded ? "bg-slate-50/80" : "hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-l-4 hover:border-l-secondary hover:pl-0"}`}
                          style={{
                            borderLeftWidth: isExpanded ? "0" : undefined,
                          }}
                        >
                          <td
                            className={`py-4 pl-4 text-primary font-bold transition-all ${!isExpanded && "group-hover:pl-3"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-1.5 rounded-full transition-all duration-300 ${isExpanded ? "bg-secondary text-white rotate-90 scale-110 shadow-md" : "bg-slate-100 text-slate-300 group-hover:bg-white group-hover:text-secondary group-hover:shadow-sm"}`}
                              >
                                <ChevronRight size={14} strokeWidth={3} />
                              </div>
                              {record.hospitalName}
                            </div>
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-transform group-hover:scale-105 ${
                                record.type === "Emergency"
                                  ? "bg-red-50 text-red-600 border-red-100"
                                  : record.type === "Service-Base"
                                    ? "bg-purple-50 text-purple-600 border-purple-100"
                                    : "bg-blue-50 text-blue-600 border-blue-100"
                              }`}
                            >
                              {record.type === "Emergency" && <Zap size={10} />}
                              {record.type}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] uppercase tracking-wider transition-transform group-hover:scale-105">
                                <Users size={10} /> {record.gender}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[10px] uppercase tracking-wider transition-transform group-hover:scale-105 ${
                                  record.ageGroup === "Born Baby" ||
                                  record.ageGroup === "Infant"
                                    ? "bg-rose-50 text-rose-600 border-rose-100"
                                    : record.ageGroup === "Geriatric"
                                      ? "bg-orange-50 text-orange-600 border-orange-100"
                                      : "bg-slate-50 text-slate-500 border-slate-100"
                                }`}
                              >
                                {record.ageGroup}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 text-right pr-4">
                            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm group-hover:border-secondary/30 group-hover:shadow-md transition-all duration-300">
                              <span className="text-primary font-black text-lg leading-none">
                                {activeDepts.length}
                              </span>
                              <span className="text-[10px] uppercase font-bold text-slate-400 leading-tight text-left">
                                Services
                                <br />
                                Active
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* EXPANDED ROW FOR LARGE DATA SETS */}
                        {isExpanded && (
                          <tr className="bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
                            <td colSpan="4" className="p-4 sm:p-6">
                              <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opacity-20"></div>
                                <div className="flex justify-between items-end mb-6 border-b border-slate-50 pb-4">
                                  <div>
                                    <h4 className="text-sm font-black text-primary flex items-center gap-2">
                                      <Activity
                                        size={16}
                                        className="text-secondary"
                                      />
                                      Rate Card Configuration
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1">
                                      Detailed breakdown of charges for this
                                      category.
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setMode("update");
                                      setSelectedHospitalId(record.hospitalId);
                                      setChargeType(record.type);
                                      setGenderTarget(record.gender);
                                      setAgeGroup(record.ageGroup);
                                    }}
                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-secondary transition-all hover:scale-105"
                                  >
                                    <Edit3 size={12} /> Edit These Rates
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                  {activeDepts.map(([dept, price]) => (
                                    <div
                                      key={dept}
                                      className="flex flex-col p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-secondary/40 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group/item cursor-default relative overflow-hidden"
                                    >
                                      <div className="absolute top-0 right-0 w-8 h-8 bg-secondary/5 rounded-bl-2xl -mr-4 -mt-4 transition-all group-hover/item:bg-secondary/10 group-hover/item:scale-150"></div>
                                      <span
                                        className="text-[10px] uppercase font-bold text-slate-400 mb-1 truncate relative z-10"
                                        title={dept}
                                      >
                                        {dept}
                                      </span>
                                      <div className="flex items-baseline gap-0.5 text-primary group-hover/item:scale-105 transition-transform origin-left relative z-10">
                                        <span className="text-xs font-bold text-slate-300">
                                          ₹
                                        </span>
                                        <span className="text-lg font-black tracking-tight">
                                          {price}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT MODE UI */}
      {(mode === "add" || mode === "update") && (
        <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-secondary/5 p-10 animate-in fade-in slide-in-from-bottom-6 relative overflow-hidden">
          {/* Selection Header - The 'Composite Key' Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-secondary/30 transition-all hover:shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 transition-colors group-hover:text-secondary">
                Select Branch
              </label>
              <div className="relative group/input">
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer appearance-none text-gray-700 group-hover/input:shadow-md"
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                >
                  <option value="">-- Choose Hospital --</option>
                  {hospitals.map((h) => (
                    <option key={h.Id} value={h.Id}>
                      {h.Name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/input:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 transition-colors group-hover:text-secondary">
                Charge Type
              </label>
              <div className="relative group/input">
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer appearance-none text-gray-700 group-hover/input:shadow-md"
                  value={chargeType}
                  onChange={(e) => setChargeType(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Service-Base">Service-Base</option>
                </select>
                <ChevronDown
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/input:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 transition-colors group-hover:text-secondary">
                Target Gender
              </label>
              <div className="relative group/input">
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer appearance-none text-gray-700 group-hover/input:shadow-md"
                  value={genderTarget}
                  onChange={(e) => setGenderTarget(e.target.value)}
                >
                  <option value="Any">Any (All)</option>
                  <option value="Male">Male Only</option>
                  <option value="Female">Female Only</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/input:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 transition-colors group-hover:text-secondary">
                Age Group
              </label>
              <div className="relative group/input">
                <select
                  className="w-full bg-white border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border shadow-sm cursor-pointer appearance-none text-gray-700 group-hover/input:shadow-md"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                >
                  <option value="Born Baby">Born Baby (0-28 Days)</option>
                  <option value="Infant">Infant (29 Days - 1 Year)</option>
                  <option value="Child">Child (2 - 12 Years)</option>
                  <option value="Teenage">Teenage (13 - 17 Years)</option>
                  <option value="Adult">Adult (18 - 64 Years)</option>
                  <option value="Geriatric">Geriatric (65+ Years)</option>
                </select>
                <ChevronDown
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover/input:text-primary transition-colors"
                  size={18}
                />
              </div>
            </div>
          </div>

          {selectedHospitalId ? (
            <form
              className="space-y-8 animate-in slide-in-from-bottom-4"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm transition-transform hover:rotate-12 hover:scale-110">
                  <Activity size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-primary">
                    Department Rates
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Leave blank if department is unavailable for this selection
                  </p>
                </div>
              </div>

              {/* Price Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {DEPARTMENT_CONFIG.map((dept) => (
                  <div
                    key={dept.key}
                    className="group animate-in fade-in zoom-in duration-300 hover:-translate-y-1 transition-transform"
                  >
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1 group-hover:text-primary transition-colors truncate" title={dept.label}>
                      {dept.label}
                    </label>
                    <div className="relative shadow-sm transition-shadow group-hover:shadow-md rounded-2xl">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold z-10 transition-colors group-hover:text-secondary">
                        ₹
                      </span>
                      <input
                        name={dept.key}
                        type="number"
                        min="0"
                        step="0.01"
                        value={pricingData[dept.key] || ""}
                        onChange={handlePriceChange}
                        placeholder="N/A"
                        className={`w-full border-transparent rounded-2xl pl-10 pr-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-secondary/10 transition-all border hover:bg-white text-gray-700 placeholder:text-gray-300 placeholder:font-normal ${
                          isProcessing
                            ? "bg-gray-100 animate-pulse"
                            : "bg-slate-50"
                        }`}
                      />
                    </div>
                    {/* Tooltip Description under input */}
                    <p className="mt-1 ml-1 text-[9px] text-slate-400 opacity-50 truncate group-hover:opacity-100 transition-opacity">
                         {dept.desc}
                    </p>
                  </div>
                ))}
              </div>

              <SubmitButton
                label={
                  isProcessing ? "Saving Records..." : "Save Pricing Matrix"
                }
              />
            </form>
          ) : (
            <div className="py-24 text-center text-slate-400 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110 hover:rotate-12 hover:bg-accent/20 cursor-default">
                <DollarSign size={40} className="text-gray-200" />
              </div>
              <h3 className="text-lg font-bold text-gray-500">
                Ready to Configure
              </h3>
              <p className="font-medium text-gray-400 max-w-md mx-auto">
                Select a hospital branch, charge type, gender, and age group
                above to begin configuring prices.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Reusable Submit Button Component
function SubmitButton({ label }) {
  return (
    <button
      type="submit"
      className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] hover:shadow-xl active:scale-95 uppercase tracking-widest text-sm"
    >
      {label}{" "}
      <ArrowRight
        size={18}
        className="transition-transform group-hover:translate-x-1"
      />
    </button>
  );
}

// Default Export wrapper with Providers
export default function DepartmentCharges() {
  return (
    <ToastProvider>
      <DepartmentChargesContent />
    </ToastProvider>
  );
}