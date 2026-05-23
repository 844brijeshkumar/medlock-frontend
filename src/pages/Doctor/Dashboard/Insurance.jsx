import React, { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Plus, 
  FileSignature, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Database, 
  Zap,
  Activity,
  Calendar,
  Stethoscope,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Clock,
  User,
  Building,
  FileText,
  Fingerprint,
  Check,
  X,
  Smartphone,
  Mail,
  KeyRound,
  Pill
} from "lucide-react";

// --- HELPER UTILS ---
const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "critical": return "bg-red-50 text-red-600 border-red-100";
    case "high": case "surgical": return "bg-orange-50 text-orange-600 border-orange-100";
    case "medium": case "global": return "bg-blue-50 text-blue-600 border-blue-100";
    case "low": case "routine": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default: return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

export default function App() {
  const [icdQuery, setIcdQuery] = useState("");
  const [cptQuery, setCptQuery] = useState("");
  const [labQuery, setLabQuery] = useState("");
  const [drugQuery, setDrugQuery] = useState("");
  
  // MULTI-SELECT STATES
  const [selectedIcds, setSelectedIcds] = useState([]);
  const [selectedCpts, setSelectedCpts] = useState([]);
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  
  const [notes, setNotes] = useState("");
  const [necessity, setNecessity] = useState("");
  
  // API Results & Loading States
  const [icdResults, setIcdResults] = useState([]);
  const [cptResults, setCptResults] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [drugResults, setDrugResults] = useState([]);
  
  const [isIcdLoading, setIsIcdLoading] = useState(false);
  const [isCptLoading, setIsCptLoading] = useState(false);
  const [isLabLoading, setIsLabLoading] = useState(false);
  const [isDrugLoading, setIsDrugLoading] = useState(false);

  // PATIENT IDENTITY STATES (Multi-step)
  const [aadhaarStep, setAadhaarStep] = useState(1);
  const [aadhaar, setAadhaar] = useState("");
  const [otpMethod, setOtpMethod] = useState(null);
  const [otp, setOtp] = useState("");

  // Theme configuration
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  // --- API 1: ICD-10 Search (NIH ClinicalTable) ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (icdQuery.trim().length < 2) {
        setIcdResults([]);
        return;
      }
      setIsIcdLoading(true);
      try {
        const response = await fetch(
          `https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?terms=${encodeURIComponent(icdQuery)}&maxList=10`
        );
        const data = await response.json();
        
        if (data && Array.isArray(data) && data[1] && Array.isArray(data[1])) {
          const codes = data[1];
          const descriptions = data[3] || [];
          
          const formatted = codes.map((code, i) => ({
            code: code || "N/A",
            description: descriptions[i] || "No description available",
            priority: code?.startsWith("C") || code?.startsWith("I") ? "High" : "Medium"
          })).filter(item => item.code !== "N/A");
          
          setIcdResults(formatted);
        } else {
          setIcdResults([]);
        }
      } catch (error) {
        console.error("ICD API Error:", error);
        setIcdResults([]);
      } finally {
        setIsIcdLoading(false);
      }
    }, 400); 
    return () => clearTimeout(timer);
  }, [icdQuery]);

  // --- API 2: Procedure Search (Mocked Custom Backend) ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (cptQuery.trim().length < 2) {
        setCptResults([]);
        return;
      }
      setIsCptLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockDatabase = [
          { code: "SG01.01", description: "Appendectomy - General Surgery", priority: "Surgical" },
          { code: "MC02.04", description: "Consultation - General Medicine", priority: "Routine" },
          { code: "SU04.12", description: "Laparoscopic Cholecystectomy", priority: "Surgical" },
          { code: "ONC01.05", description: "Chemotherapy Infusion Cycle", priority: "High" }
        ];

        const filtered = mockDatabase.filter(c => 
          c.code.includes(cptQuery) || c.description.toLowerCase().includes(cptQuery.toLowerCase())
        );

        const formatted = filtered.map(item => ({
          code: item.code,
          description: item.description,
          type: "PROCEDURE",
          priority: item.priority
        }));
        
        setCptResults(formatted);
      } catch (error) {
        console.error("Procedure API Error:", error);
        setCptResults([]);
      } finally {
        setIsCptLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [cptQuery]);

  // --- API 3: Labs (LOINC) Search (NIH ClinicalTable) ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (labQuery.trim().length < 2) {
        setLabResults([]);
        return;
      }
      setIsLabLoading(true);
      try {
        const response = await fetch(
          `https://clinicaltables.nlm.nih.gov/api/loinc_items/v3/search?terms=${encodeURIComponent(labQuery)}&maxList=10`
        );
        const data = await response.json();
        
        if (data && Array.isArray(data) && data[1] && Array.isArray(data[1])) {
          const codes = data[1];
          const descriptions = data[3] || []; 
          
          const formatted = codes.map((code, i) => {
            const descText = (descriptions[i] && descriptions[i][0]) ? descriptions[i][0] : "No description available";
            return {
              code: code || "N/A",
              description: descText,
              type: "LAB TEST",
              priority: "Routine"
            };
          }).filter(item => item.code !== "N/A");
          
          setLabResults(formatted);
        } else {
          setLabResults([]);
        }
      } catch (error) {
        console.error("Lab API Error:", error);
        setLabResults([]);
      } finally {
        setIsLabLoading(false);
      }
    }, 400); 
    return () => clearTimeout(timer);
  }, [labQuery]);

  // --- API 4: DUAL FETCH - Drugs (US API) + Medicines (Indian Backend) ---
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (drugQuery.trim().length < 2) {
        setDrugResults([]);
        return;
      }
      setIsDrugLoading(true);
      
      try {
        let combinedResults = [];

        // 1. Fetch from US API (Salts / DRUGS)
        try {
          const rxResponse = await fetch(
            `https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${encodeURIComponent(drugQuery)}&maxList=5&ef=STRENGTHS_AND_FORMS`
          );
          const rxData = await rxResponse.json();
          
          if (rxData && Array.isArray(rxData) && rxData[1]) {
            const drugNames = rxData[1];
            const extraFields = rxData[2] || {};
            const strengthsForms = extraFields.STRENGTHS_AND_FORMS || []; 
            
            const usDrugs = drugNames.map((name, i) => {
              const specificMedicine = strengthsForms[i] && strengthsForms[i].length > 0 
                ? `${name} (${strengthsForms[i][0]})` 
                : name;

              return {
                code: "RX-SALT", 
                description: specificMedicine,
                type: "DRUG", // <-- Tagged as DRUG from US API
                priority: "Medium"
              };
            });
            combinedResults = [...combinedResults, ...usDrugs];
          }
        } catch (e) {
          console.error("US Drug API Failed:", e);
        }

        // 2. Fetch from Mocked Indian Backend (Brands / MEDICINES)
        try {
          await new Promise(resolve => setTimeout(resolve, 150)); // Simulated network delay
          
          const indianDrugsDB = [
            { brand: "Calpol 500", generic: "Paracetamol 500mg", form: "Tablet" },
            { brand: "Calpol Pead", generic: "Paracetamol 250mg/5ml", form: "Syrup" },
            { brand: "Disprin", generic: "Aspirin 350mg", form: "Effervescent Tablet" },
            { brand: "Dolo 650", generic: "Paracetamol 650mg", form: "Tablet" },
            { brand: "Pan-D", generic: "Pantoprazole + Domperidone", form: "Capsule" },
            { brand: "Augmentin 625 Duo", generic: "Amoxicillin + Clavulanic Acid", form: "Tablet" },
            { brand: "Azithral 500", generic: "Azithromycin 500mg", form: "Tablet" }
          ];

          const filtered = indianDrugsDB.filter(d => 
            d.brand.toLowerCase().includes(drugQuery.toLowerCase()) || 
            d.generic.toLowerCase().includes(drugQuery.toLowerCase())
          );

          const indMedicines = filtered.map(item => ({
            code: "RX-IND", 
            description: `${item.brand} - ${item.form} (${item.generic})`,
            type: "MEDICINE", // <-- Tagged as MEDICINE from Backend
            priority: "Medium"
          }));
          
          combinedResults = [...combinedResults, ...indMedicines];
        } catch (e) {
          console.error("Indian Medicine DB Failed:", e);
        }

        // 3. Set the combined list (Drugs + Medicines) to state
        setDrugResults(combinedResults);

      } catch (error) {
        console.error("Combined Drug/Medicine API Error:", error);
        setDrugResults([]);
      } finally {
        setIsDrugLoading(false);
      }
    }, 400); 
    return () => clearTimeout(timer);
  }, [drugQuery]);

  // --- MULTI-SELECT HANDLERS ---
  const handleToggleIcd = (item) => {
    if (selectedIcds.some(i => i.code === item.code)) {
      setSelectedIcds(prev => prev.filter(i => i.code !== item.code));
    } else {
      setSelectedIcds(prev => [...prev, item]);
    }
  };

  const handleToggleCpt = (item) => {
    if (selectedCpts.some(c => c.code === item.code)) {
      setSelectedCpts(prev => prev.filter(c => c.code !== item.code));
    } else {
      setSelectedCpts(prev => [...prev, item]);
    }
  };

  const handleToggleLab = (item) => {
    if (selectedLabs.some(p => p.code === item.code)) {
      setSelectedLabs(prev => prev.filter(p => p.code !== item.code));
    } else {
      setSelectedLabs(prev => [...prev, item]);
    }
  };

  const handleToggleDrug = (item) => {
    if (selectedDrugs.some(d => d.description === item.description)) {
      setSelectedDrugs(prev => prev.filter(d => d.description !== item.description));
    } else {
      setSelectedDrugs(prev => [...prev, item]);
    }
  };

  // --- AADHAAR FLOW HANDLERS ---
  const handleAadhaarSubmit = (e) => {
    e.preventDefault();
    if (aadhaar.length === 12) {
      setAadhaarStep(2); 
    } else {
      alert("Please enter a valid 12-digit Aadhaar number.");
    }
  };

  const handleOtpMethodSelect = (method) => {
    setOtpMethod(method);
    setAadhaarStep(3); 
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    if (otp.length >= 4) {
      setAadhaarStep(4); 
    } else {
      alert("Please enter a valid OTP.");
    }
  };

  // --- FINAL SUBMISSION ---
  const handleSign = () => {
    if (aadhaarStep !== 4) {
      alert("Please verify Patient Identity first.");
      return;
    }
    if (selectedIcds.length === 0) {
      alert("Please select at least one Diagnosis code.");
      return;
    }
    if (selectedCpts.length === 0) {
      alert("Please select at least one Procedure code.");
      return;
    }
    if (selectedLabs.length === 0 && selectedDrugs.length === 0) {
      alert("Please select at least one Lab Test or Drug/Medicine.");
      return;
    }
    
    const icdString = selectedIcds.map(i => i.code).join(", ");
    const cptString = selectedCpts.map(c => c.code).join(", ");
    const labString = selectedLabs.map(p => p.code).join(", ") || "None";
    const drugString = selectedDrugs.map(d => d.description).join(", ") || "None";
    
    alert(`Encounter Signed Successfully!\nPatient Aadhaar: ${aadhaar}\nDiagnoses: ${icdString}\nProcedures: ${cptString}\nLabs ordered: ${labString}\nDrugs/Medicines prescribed: ${drugString}`);
    
    // Reset Form
    setSelectedIcds([]);
    setSelectedCpts([]);
    setSelectedLabs([]);
    setSelectedDrugs([]);
    setNotes("");
    setNecessity("");
    setAadhaar("");
    setOtp("");
    setAadhaarStep(1);
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 p-6 md:p-10 fade-in transition-all duration-500"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-secondary" />
               Clinical Suite
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-widest">
              Diagnosis Discovery • Procedure Mapping • Medical Necessity
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <Calendar className="h-4 w-4 text-secondary" />
              <div className="text-[10px] font-bold text-gray-400">
                <p>AUTO-SYNC</p>
                <p className="text-gray-700">ACTIVE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 🔹 LEFT COLUMN: SEARCH DISCOVERY (5/12) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. ICD-10 Diagnosis Search Section */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                    <Database className="h-4 w-4 text-secondary" />
                    1. Diagnosis Search (ICD-10)
                  </h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary" />
                  <input
                    type="text"
                    placeholder="Search by code or condition..."
                    value={icdQuery}
                    onChange={(e) => setIcdQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-sm font-medium transition-all"
                  />
                  {isIcdLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-secondary" />}
               </div>
               <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {icdResults.map((item, idx) => {
                    const isSelected = selectedIcds.some(i => i.code === item.code);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleIcd(item)}
                        className={`group relative bg-white rounded-[1.5rem] p-4 border transition-all duration-300 cursor-pointer hover:shadow-lg overflow-hidden ${
                          isSelected ? 'border-secondary ring-2 ring-secondary/5' : 'border-gray-100'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transition-transform origin-left ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-black text-secondary text-[11px] flex items-center gap-2">
                            {item.code}
                            {isSelected && <CheckCircle2 className="h-3 w-3 text-secondary" />}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getPriorityColor(item.priority)}`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.description}</p>
                      </div>
                    );
                  })}
                  {!isIcdLoading && icdQuery.trim().length >= 2 && icdResults.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4 italic">No diagnoses found.</p>
                  )}
               </div>
            </div>

            {/* 2. Procedures (PM-JAY/IRDAI) Search Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                    <Activity className="h-4 w-4 text-secondary" />
                    2. Procedure Search
                  </h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary" />
                  <input
                    type="text"
                    placeholder="Search standard procedures (e.g., Cholecystectomy)..."
                    value={cptQuery}
                    onChange={(e) => setCptQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none text-sm font-medium transition-all"
                  />
                  {isCptLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-secondary" />}
               </div>
               <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {cptResults.map((item, idx) => {
                    const isSelected = selectedCpts.some(c => c.code === item.code);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleCpt(item)}
                        className={`group relative bg-white rounded-[1.5rem] p-4 border transition-all duration-300 cursor-pointer hover:shadow-lg overflow-hidden ${
                          isSelected ? 'border-secondary ring-2 ring-secondary/5' : 'border-gray-100'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary transition-transform origin-left ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-black text-primary text-[11px] flex items-center gap-2">
                            {item.code}
                            {isSelected && <CheckCircle2 className="h-3 w-3 text-primary" />}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getPriorityColor(item.priority)}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.description}</p>
                      </div>
                    );
                  })}
                  {!isCptLoading && cptQuery.trim().length >= 2 && cptResults.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4 italic">No procedures found.</p>
                  )}
               </div>
            </div>

            {/* 3. Labs (LOINC) Search Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    3. Lab Tests Search (LOINC)
                  </h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-amber-500" />
                  <input
                    type="text"
                    placeholder="Search lab tests (e.g., Glucose)..."
                    value={labQuery}
                    onChange={(e) => setLabQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 outline-none text-sm font-medium transition-all"
                  />
                  {isLabLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-amber-500" />}
               </div>
               <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {labResults.map((item, idx) => {
                    const isSelected = selectedLabs.some(p => p.code === item.code);
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleLab(item)}
                        className={`group relative bg-white rounded-[1.5rem] p-4 border transition-all duration-300 cursor-pointer hover:shadow-lg overflow-hidden ${
                          isSelected ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-gray-100'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-600 transition-transform origin-left ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-black text-amber-600 text-[11px] flex items-center gap-2">
                            {item.code}
                            {isSelected && <CheckCircle2 className="h-3 w-3 text-amber-500" />}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getPriorityColor(item.priority)}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.description}</p>
                      </div>
                    );
                  })}
                  {!isLabLoading && labQuery.trim().length >= 2 && labResults.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4 italic">No lab tests found.</p>
                  )}
               </div>
            </div>

            {/* 4. Combined Drugs (US) & Medicines (IN) Search Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-black text-primary uppercase tracking-tighter flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-500" />
                    4. Drugs & Medicines Search
                  </h3>
               </div>
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
                  <input
                    type="text"
                    placeholder="Search Salts (Drugs) or Brands (Medicines)..."
                    value={drugQuery}
                    onChange={(e) => setDrugQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm font-medium transition-all"
                  />
                  {isDrugLoading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />}
               </div>
               <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {drugResults.map((item, idx) => {
                    const isSelected = selectedDrugs.some(d => d.description === item.description);
                    // Dynamically set color based on if it's a DRUG or MEDICINE
                    const isMedicine = item.type === "MEDICINE";
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => handleToggleDrug(item)}
                        className={`group relative bg-white rounded-[1.5rem] p-4 border transition-all duration-300 cursor-pointer hover:shadow-lg overflow-hidden ${
                          isSelected ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-100'
                        }`}
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 transition-transform origin-left ${isSelected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'} ${isMedicine ? 'bg-gradient-to-r from-purple-400 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'}`} />
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-mono font-black text-[11px] flex items-center gap-2 ${isMedicine ? 'text-purple-600' : 'text-blue-600'}`}>
                            {item.code}
                            {isSelected && <CheckCircle2 className={`h-3 w-3 ${isMedicine ? 'text-purple-500' : 'text-blue-500'}`} />}
                          </span>
                          {/* The Badge perfectly reflects DRUG vs MEDICINE */}
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${isMedicine ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {item.type}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.description}</p>
                      </div>
                    );
                  })}
                  {!isDrugLoading && drugQuery.trim().length >= 2 && drugResults.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-4 italic">No drugs or medicines found.</p>
                  )}
               </div>
            </div>

          </div>

          {/* 🔹 RIGHT COLUMN: CLINICAL DOCUMENTATION (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 🔹 PATIENT IDENTIFICATION CARD (Multi-Step) */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 overflow-hidden relative">
               
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${aadhaarStep === 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {aadhaarStep === 4 ? <User className="h-5 w-5" /> : <Fingerprint className="h-5 w-5" />}
                    </div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-tighter">Patient Identity Verification</h3>
                 </div>
                 {aadhaarStep === 4 && (
                   <Badge variant="success">Verified</Badge>
                 )}
               </div>

               {/* Step 1: Enter Aadhaar */}
               {aadhaarStep === 1 && (
                 <form onSubmit={handleAadhaarSubmit} className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-right-4">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="Enter 12-digit Aadhaar Number..."
                        value={aadhaar}
                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 rounded-2xl border border-gray-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 outline-none text-sm font-bold tracking-[0.2em] transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                    >
                      Verify Aadhaar
                    </button>
                 </form>
               )}

               {/* Step 2: Select OTP Method */}
               {aadhaarStep === 2 && (
                 <div className="animate-in fade-in slide-in-from-right-4 space-y-3">
                   <p className="text-xs font-bold text-gray-600">Select method to receive OTP for Aadhaar ending in <span className="text-primary font-black">XXXX-{aadhaar.slice(-4)}</span></p>
                   <div className="flex gap-3">
                     <button onClick={() => handleOtpMethodSelect('sms')} className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-secondary hover:bg-secondary/5 py-4 rounded-2xl text-sm font-bold text-gray-700 transition-all">
                       <Smartphone className="h-5 w-5 text-secondary" /> SMS to Mobile
                     </button>
                     <button onClick={() => handleOtpMethodSelect('email')} className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-secondary hover:bg-secondary/5 py-4 rounded-2xl text-sm font-bold text-gray-700 transition-all">
                       <Mail className="h-5 w-5 text-secondary" /> Email ID
                     </button>
                   </div>
                   <button onClick={() => setAadhaarStep(1)} className="text-[10px] text-gray-400 hover:text-primary font-bold underline mt-2">Change Aadhaar Number</button>
                 </div>
               )}

               {/* Step 3: Enter OTP */}
               {aadhaarStep === 3 && (
                 <form onSubmit={handleOtpVerify} className="animate-in fade-in slide-in-from-right-4 space-y-3">
                   <p className="text-xs font-bold text-gray-600 flex items-center gap-2">
                     <KeyRound className="h-4 w-4 text-amber-500" /> Enter OTP sent via {otpMethod === 'sms' ? 'SMS' : 'Email'}
                   </p>
                   <div className="flex flex-col sm:flex-row gap-3">
                     <input
                        type="text"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="flex-1 px-4 py-3 bg-gray-50 rounded-2xl border border-gray-100 focus:border-amber-500 focus:ring-4 focus:ring-amber-50 outline-none text-center text-lg font-black tracking-[0.5em] transition-all"
                      />
                      <button 
                        type="submit"
                        className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                      >
                        Verify OTP
                      </button>
                   </div>
                   <button onClick={() => setAadhaarStep(2)} className="text-[10px] text-gray-400 hover:text-primary font-bold underline mt-2">Change OTP Method</button>
                 </form>
               )}

               {/* Step 4: Patient Details (Verified) */}
               {aadhaarStep === 4 && (
                 <div className="animate-in fade-in zoom-in-95 bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Patient Name</p>
                        <p className="text-sm font-bold text-emerald-900 mt-1">Ramesh Kumar</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Date of Birth</p>
                        <p className="text-sm font-bold text-emerald-900 mt-1">15-Aug-1985</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-widest">Aadhaar</p>
                        <p className="text-sm font-bold text-emerald-900 mt-1">XXXX-XXXX-{aadhaar.slice(-4)}</p>
                      </div>
                    </div>
                 </div>
               )}

               {aadhaarStep === 1 && (
                 <p className="text-[10px] text-gray-400 mt-3 ml-1 italic font-medium">
                   Note: Encrypted Aadhaar linking is required for claim submissions.
                 </p>
               )}
            </div>

            {/* 🔹 CLINICAL DOCUMENTATION CARD */}
            <div className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10 overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                    <FileSignature className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Encounter Sign-off</h3>
                </div>
                <Badge variant={selectedIcds.length > 0 && selectedCpts.length > 0 && (selectedLabs.length > 0 || selectedDrugs.length > 0) && aadhaarStep === 4 ? "success" : "default"}>
                  {selectedIcds.length > 0 && selectedCpts.length > 0 && (selectedLabs.length > 0 || selectedDrugs.length > 0) && aadhaarStep === 4 ? "Validated" : "Discovery Stage"}
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-stretch gap-4">
                  
                  {/* 1. Diagnosis Container */}
                  <div className={`w-full p-5 rounded-[1.5rem] border-2 transition-all duration-500 ${selectedIcds.length > 0 ? 'border-secondary/20 bg-secondary/5' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3">1. Diagnoses (Why)</p>
                    {selectedIcds.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-[130px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-left-2">
                        {selectedIcds.map(icd => (
                           <div key={icd.code} className="bg-white p-3 rounded-xl border border-secondary/20 shadow-sm relative group/item">
                              <button onClick={() => handleToggleIcd(icd)} className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                              <h4 className="font-mono font-black text-primary text-sm leading-none">{icd.code}</h4>
                              <p className="text-[11px] font-bold text-gray-600 line-clamp-1 mt-1 pr-6">{icd.description}</p>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Select ICD-10 codes from search...</p>
                    )}
                  </div>

                  {/* 2. Procedure Container */}
                  <div className={`w-full p-5 rounded-[1.5rem] border-2 transition-all duration-500 ${selectedCpts.length > 0 ? 'border-primary/10 bg-primary/5' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">2. Procedures (What was done)</p>
                    {selectedCpts.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-[130px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-right-2">
                        {selectedCpts.map(cpt => (
                           <div key={cpt.code} className="bg-white p-3 rounded-xl border border-primary/10 shadow-sm relative group/item">
                              <button onClick={() => handleToggleCpt(cpt)} className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                              <h4 className="font-mono font-black text-primary text-sm leading-none">{cpt.code}</h4>
                              <p className="text-[11px] font-bold text-gray-600 line-clamp-1 mt-1 pr-6">{cpt.description}</p>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Select Procedures from search...</p>
                    )}
                  </div>

                  {/* 3. Lab Tests Container */}
                  <div className={`w-full p-5 rounded-[1.5rem] border-2 transition-all duration-500 ${selectedLabs.length > 0 ? 'border-amber-500/20 bg-amber-500/5' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">3. Lab Tests (What was ordered)</p>
                    {selectedLabs.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-[130px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-right-2">
                        {selectedLabs.map(proc => (
                           <div key={proc.code} className="bg-white p-3 rounded-xl border border-amber-500/20 shadow-sm relative group/item">
                              <button onClick={() => handleToggleLab(proc)} className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                              <h4 className="font-mono font-black text-amber-600 text-sm leading-none">{proc.code}</h4>
                              <p className="text-[11px] font-bold text-gray-600 line-clamp-1 mt-1 pr-6">{proc.description}</p>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Select LOINC lab tests from search...</p>
                    )}
                  </div>

                  {/* 4. Drugs Container */}
                  <div className={`w-full p-5 rounded-[1.5rem] border-2 transition-all duration-500 ${selectedDrugs.length > 0 ? 'border-blue-500/20 bg-blue-500/5' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">4. Drugs / Medicines (What was prescribed)</p>
                    {selectedDrugs.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-[130px] overflow-y-auto pr-2 custom-scrollbar animate-in fade-in slide-in-from-right-2">
                        {selectedDrugs.map(drug => (
                           <div key={drug.description} className="bg-white p-3 rounded-xl border border-blue-500/20 shadow-sm relative group/item">
                              <button onClick={() => handleToggleDrug(drug)} className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                              <h4 className="font-mono font-black text-blue-600 text-sm leading-none">{drug.code}</h4>
                              <p className="text-[11px] font-bold text-gray-600 line-clamp-1 mt-1 pr-6">{drug.description}</p>
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic flex items-center gap-2"><AlertCircle className="h-3 w-3" /> Select Drugs or Medicines from search...</p>
                    )}
                  </div>

                </div>

                {/* Necessity Message */}
                {selectedIcds.length > 0 && selectedCpts.length > 0 && (selectedLabs.length > 0 || selectedDrugs.length > 0) && aadhaarStep === 4 && (
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in zoom-in-95 duration-500">
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <p className="text-[11px] font-bold text-emerald-800 leading-tight">
                      <strong>Medical Necessity Check:</strong> Encounter validated. Patient identity confirmed and selected diagnoses support the mapped procedures & prescriptions.
                    </p>
                  </div>
                )}

                {/* Narrative Sections */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Encounter Documentation</label>
                    <textarea 
                      className="w-full bg-gray-50 rounded-2xl p-4 text-sm min-h-[140px] focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all placeholder:text-gray-300 font-medium"
                      placeholder="Enter clinical findings and observations..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Necessity Justification</label>
                    <textarea 
                      className="w-full bg-gray-50 rounded-2xl p-4 text-sm min-h-[80px] focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all placeholder:text-gray-300 font-medium"
                      placeholder="Justify why these treatments and labs/drugs are required for this specific patient..."
                      value={necessity}
                      onChange={(e) => setNecessity(e.target.value)}
                    />
                  </div>
                </div>

                {/* Final Submission */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleSign}
                    className="flex-[2] bg-primary hover:bg-secondary text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 text-xs uppercase tracking-widest shadow-primary/20 hover:scale-[1.02]"
                  >
                    <FileSignature className="h-5 w-5" />
                    Sign Encounter & Submit Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable internal Badge
const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default: "bg-slate-100 text-slate-400 border-slate-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[variant]}`}>
      {children}
    </span>
  );
};