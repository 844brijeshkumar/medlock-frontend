import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  User,
  Hash,
  ChevronRight,
  Stethoscope,
  TestTubes,
  Pill,
  ShieldCheck,
  CreditCard,
  FileCheck,
  Send,
  Info,
  Banknote,
  PanelLeftClose,
  PanelLeft,
  Package, // Added for Govt
  Landmark, // Added for Govt
  Shield,   // Added for Private
  Trash2    // Added for Govt packages
} from 'lucide-react';

// --- MOCK GOVERNMENT PACKAGES (HBP Master List) ---
const GOVT_PACKAGES = [
  { code: "SG01.1", name: "Appendectomy - General Surgery", rate: 25000, category: "General Surgery" },
  { code: "RD05.22", name: "MRI Brain with Contrast", rate: 8500, category: "Radiology" },
  { code: "CV09.5", name: "CABG (Bypass) - High Risk", rate: 150000, category: "Cardio Thoracic" },
  { code: "MD12.1", name: "Dengue Management (Conservative)", rate: 12000, category: "General Medicine" }
];

// --- MOCK DATA: Step 2 / Billing Queue ---
// ADDED planType to mock data to trigger the dynamic swap!
const mockBillingQueue = [
  {
    encounterId: "ENC-2026-0899",
    patient: { name: "Ramesh Kumar", abhaId: "91-1234-5678-9012" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001" },
    currentStatus: "Pending Billing",
    planType: "Retail", // <-- Private Insurance
    queryNote: null,
    clinicalData: {
      diagnoses: [
        { code: "K35.80", description: "Unspecified acute appendicitis", isComorbidity: false },
        { code: "E11.9", description: "Type 2 diabetes mellitus", isComorbidity: true }
      ],
      procedures: [
        { code: "SG01.01", description: "Appendectomy - General Surgery", type: "PROCEDURE" },
        { code: "AN01.01", description: "General Anesthesia", type: "PROCEDURE" }
      ],
      labs: [
        { code: "2339-0", description: "Glucose [Mass/volume] in Blood", type: "LAB TEST" },
        { code: "789-8", description: "Erythrocytes [#/volume] in Blood", type: "LAB TEST" }
      ],
      prescriptions: [
        { code: "RX-IND", description: "Calpol 500 - Tablet (Paracetamol 500mg)", type: "MEDICINE" },
        { code: "RX-IND-2", description: "Augmentin 625 Duo Tablet", type: "MEDICINE" }
      ]
    }
  },
  {
    encounterId: "ENC-2026-0860",
    patient: { name: "Anil Kapoor", abhaId: "91-8888-7777-6666" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002" },
    currentStatus: "Re-Billing",
    planType: "Government", // <-- PM-JAY / CGHS
    queryNote: "Clinical Query Cleared: Doctor has added 'MRI Brain' to the procedure list. Please update the final invoice accordingly before re-uploading.",
    clinicalData: {
      diagnoses: [
        { code: "I25.10", description: "Coronary Artery Disease", isComorbidity: false }
      ],
      procedures: [
        { code: "RD05.22", description: "MRI Brain with Contrast", type: "PROCEDURE" } 
      ],
      labs:  [
        { code: "2339-0", description: "Glucose [Mass/volume] in Blood", type: "LAB TEST" },
        { code: "789-8", description: "Erythrocytes [#/volume] in Blood", type: "LAB TEST" }
      ],
      prescriptions: [
        { code: "RX-IND-3", description: "Aspirin 75mg", type: "MEDICINE" }
      ]
    }
  },
  {
    encounterId: "ENC-2026-0910",
    patient: { name: "Sunita Rao", abhaId: "91-5555-4444-3333" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001" },
    currentStatus: "Pending Billing",
    planType: "Retail", // <-- Private Insurance
    queryNote: null,
    clinicalData: {
      diagnoses: [{ code: "J01.90", description: "Acute tonsillitis, unspecified", isComorbidity: false }],
      procedures: [],
      labs: [{ code: "1234-5", description: "Complete Blood Count (CBC)", type: "LAB TEST" }],
      prescriptions: [{ code: "RX-IND-4", description: "Amoxicillin 500mg", type: "MEDICINE" }]
    }
  }
];

// Utilities
const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending Billing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Re-Billing': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function ClinicalBillingMapping() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("All");
  const [selectedClaimId, setSelectedClaimId] = useState(mockBillingQueue[0].encounterId);
  const [theme, setTheme] = useState({ primary: '#0b4f4a', secondary: '#2a9b94', accent: '#d1e8e5' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Financial State Mapping (Private / Itemized)
  const [consultationInputs, setConsultationInputs] = useState({});
  const [procedureInputs, setProcedureInputs] = useState({});
  const [labInputs, setLabInputs] = useState({});
  const [pharmacyInputs, setPharmacyInputs] = useState({});

  // NEW: Financial State Mapping (Government / Packages)
  const [packageSearchTerm, setPackageSearchTerm] = useState('');
  const [selectedPackages, setSelectedPackages] = useState([]);

  useEffect(() => {
    try {
      const cachedPrimary = localStorage.getItem('theme-primary');
      if (cachedPrimary) setTheme({ primary: cachedPrimary, secondary: localStorage.getItem('theme-secondary') || '#2a9b94', accent: localStorage.getItem('theme-accent') || '#d1e8e5' });
    } catch (e) {}
  }, []);

  // Derived state for Left Pane List
  const filteredClaims = useMemo(() => {
    return mockBillingQueue.filter(claim => {
      const matchesSearch = claim.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) || claim.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || claim.currentStatus === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  // Derived state for Right Pane Detail
  const selectedClaim = useMemo(() => {
    return mockBillingQueue.find(c => c.encounterId === selectedClaimId) || mockBillingQueue[0];
  }, [selectedClaimId]);

  // Derived state for Government Package Search
  const filteredPackages = useMemo(() => {
    if (!packageSearchTerm) return [];
    return GOVT_PACKAGES.filter(pkg => 
      pkg.name.toLowerCase().includes(packageSearchTerm.toLowerCase()) || 
      pkg.code.toLowerCase().includes(packageSearchTerm.toLowerCase())
    );
  }, [packageSearchTerm]);

  // Reset inputs when selected encounter changes
  useEffect(() => {
    if (selectedClaim) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        const today = new Date().toISOString().split('T')[0];
        const now = new Date().toISOString().slice(0, 16);

        // Reset Govt Packages
        setSelectedPackages([]);
        setPackageSearchTerm('');

        // Initialize Consultations (Includes roomType and endDate)
        const initConsultations = {};
        selectedClaim.clinicalData.diagnoses.forEach((diag, i) => {
          initConsultations[i] = { 
            price: 500, 
            diagType: diag.isComorbidity ? 'Comorbidity' : (i === 0 ? 'Primary' : 'Secondary'),
            service: 'OPD',
            roomType: 'General Ward', 
            startDate: today, 
            endDate: today            
          };
        });
        setConsultationInputs(initConsultations);

        // Initialize Procedures (Includes endDatetime)
        const initProcedures = {};
        selectedClaim.clinicalData.procedures.forEach((_, i) => {
          initProcedures[i] = { 
            price: 25000, 
            startDatetime: now, 
            endDatetime: now, 
            type: 'Surgical', 
            sac: '9993' 
          };
        });
        setProcedureInputs(initProcedures);

        // Initialize Labs
        const initLabs = {};
        selectedClaim.clinicalData.labs.forEach((_, i) => {
          initLabs[i] = { count: 1, price: 250, sac: '9993' };
        });
        setLabInputs(initLabs);

        // Initialize Pharmacy
        const initPharmacy = {};
        selectedClaim.clinicalData.prescriptions.forEach((_, i) => {
          initPharmacy[i] = { qty: 10, price: 15, gst: 12, hsn: '3004' };
        });
        setPharmacyInputs(initPharmacy);

        setIsLoading(false);
      }, 400); 
      return () => clearTimeout(timer);
    }
  }, [selectedClaimId, selectedClaim]);

  // General Update Field
  const updateField = (setter, index, field, value) => {
    setter(prev => ({ ...prev, [index]: { ...prev[index], [field]: value } }));
  };

  // Govt Package Handlers
  const addPackage = (pkg) => {
    if (!selectedPackages.find(p => p.code === pkg.code)) {
      setSelectedPackages([...selectedPackages, pkg]);
      setPackageSearchTerm('');
    }
  };
  const removePackage = (code) => {
    setSelectedPackages(selectedPackages.filter(p => p.code !== code));
  };

  const handleGenerateInvoice = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Invoice Generated for ${selectedClaim.encounterId}.\nFHIR Claim Resource created.\nRouting to Document Dispatch Queue.`);
    }, 1500);
  };

  // --- Calculations (Private/Itemized) ---
  let consultationTotal = 0;
  if(!isLoading) selectedClaim.clinicalData.diagnoses.forEach((_, i) => consultationTotal += Number(consultationInputs[i]?.price) || 0);

  let procedureTotal = 0;
  if(!isLoading) selectedClaim.clinicalData.procedures.forEach((_, i) => procedureTotal += Number(procedureInputs[i]?.price) || 0);

  let labTotal = 0;
  if(!isLoading) selectedClaim.clinicalData.labs.forEach((_, i) => labTotal += (Number(labInputs[i]?.count) || 0) * (Number(labInputs[i]?.price) || 0));

  let pharmacySubtotal = 0;
  let pharmacyGstAmount = 0;
  if(!isLoading) {
      selectedClaim.clinicalData.prescriptions.forEach((_, i) => {
        const p = pharmacyInputs[i] || {};
        const lineTotal = (Number(p.qty) || 0) * (Number(p.price) || 0);
        pharmacySubtotal += lineTotal;
        pharmacyGstAmount += lineTotal * (Number(p.gst) / 100);
      });
  }

  const itemizedSubtotal = consultationTotal + procedureTotal + labTotal + pharmacySubtotal;
  const cgstAmount = pharmacyGstAmount / 2;
  const sgstAmount = pharmacyGstAmount / 2;
  const itemizedGrandTotal = itemizedSubtotal + pharmacyGstAmount;

  // --- Calculations (Government/Packages) ---
  const totalPackageRate = selectedPackages.reduce((sum, pkg) => sum + pkg.rate, 0);

  // --- Master Total based on Plan Type ---
  const grandTotal = selectedClaim?.planType === 'Government' ? totalPackageRate : itemizedGrandTotal;

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900" style={{ '--primary': theme.primary, '--primary-hover': '#083b37', '--secondary': theme.secondary, '--accent': theme.accent }}>
      
      {/* LEFT COLUMN: Queue (Collapsible) */}
      {isSidebarOpen && (
        <div className="w-1/3 min-w-[320px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm transition-all duration-300">
          <div className="p-4 border-b border-slate-200 bg-white sticky top-0">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                <Banknote className="w-5 h-5 text-secondary" />
                Billing & Mapping
              </h1>
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
                title="Close Sidebar"
              >
                <PanelLeftClose size={20} />
              </button>
            </div>
            
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Encounter or Patient..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {["All", "Pending Billing", "Re-Billing"].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedClaimId(null); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-accent hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {filteredClaims.length > 0 ? filteredClaims.map((claim) => (
              <div 
                key={claim.encounterId}
                onClick={() => setSelectedClaimId(claim.encounterId)}
                className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                  selectedClaimId === claim.encounterId 
                    ? 'bg-accent/30 border-secondary shadow-sm ring-1 ring-secondary/50' 
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <User size={14} className="text-primary"/> {claim.patient.name}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wide flex items-center gap-1 ${getStatusColor(claim.currentStatus)}`}>
                    {(claim.currentStatus === 'Pending Billing' || claim.currentStatus === 'Re-Billing') && <Activity size={10} />}
                    {claim.currentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-end text-xs text-slate-500">
                  <div className="flex flex-col gap-1.5">
                    <span className="flex items-center gap-1 font-medium"><Hash className="w-3.5 h-3.5" /> {claim.encounterId}</span>
                    <span className="flex items-center gap-1 font-medium text-slate-400"><Stethoscope className="w-3.5 h-3.5" /> {claim.doctor.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-colors ${selectedClaimId === claim.encounterId ? 'text-secondary' : 'text-slate-300'}`} />
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-500 text-sm">No encounters found.</div>
            )}
          </div>
        </div>
      )}

      {/* RIGHT COLUMN: Detail Panel */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden transition-all duration-300">
        
        {!selectedClaim ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="mb-4 p-2 bg-white rounded-full shadow-sm text-primary hover:bg-accent">
                <PanelLeft size={24} />
              </button>
            )}
            <Banknote className="w-16 h-16 mb-4 opacity-20" />
            <p>Select an encounter from the queue to start billing.</p>
          </div>
        ) : (
          <>
            {/* Detail Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-200 shadow-sm z-10 flex-none">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {!isSidebarOpen && (
                    <button 
                      onClick={() => setIsSidebarOpen(true)} 
                      className="p-1 hover:bg-slate-100 rounded-md text-slate-500 transition-colors mr-2"
                      title="Open Sidebar"
                    >
                      <PanelLeft size={20} />
                    </button>
                  )}
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(selectedClaim.currentStatus)}`}>
                    Queue: {selectedClaim.currentStatus}
                  </span>
                </div>
                
                {/* NEW: DYNAMIC BADGE BASED ON PLAN TYPE */}
                <div className={`px-3 py-1 rounded-lg border font-bold text-xs flex items-center gap-1.5 ${
                  selectedClaim.planType === 'Government' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {selectedClaim.planType === 'Government' ? <Landmark className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                  {selectedClaim.planType === 'Government' ? 'Govt Package Mode (HBP)' : 'Private Itemized Mode'}
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-slate-400" /> {selectedClaim.patient.name}
                  </h2>
                  <p className="text-slate-500 flex items-center gap-1.5 mt-2 text-sm font-mono">
                    ID: {selectedClaim.encounterId} | ABHA: {selectedClaim.patient.abhaId}
                  </p>
                </div>
                
                {/* Submit Action Button */}
                <button 
                  onClick={handleGenerateInvoice}
                  disabled={isLoading || isSubmitting}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-md transition-all uppercase tracking-wide
                    ${(!isLoading && !isSubmitting) ? 'bg-primary hover:bg-primary-hover text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}
                  `}
                >
                  {isSubmitting ? (
                    <><Activity className="w-4 h-4 animate-spin" /> Generating...</>
                  ) : (
                    <>
                      {selectedClaim.currentStatus === 'Re-Billing' ? <><Activity className="w-4 h-4" /> Generate Re-Bill</> : <><FileCheck className="w-4 h-4" /> Generate Invoice</>}
                    </>
                  )}
                </button>
              </div>

              {/* Context Banner for Re-Billing */}
              <div className="mt-6">
                {selectedClaim.currentStatus === 'Re-Billing' && selectedClaim.queryNote ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-orange-800 uppercase tracking-widest mb-0.5">Clinical Modification Alert</p>
                      <p className="text-sm font-medium text-orange-900">{selectedClaim.queryNote}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-blue-800 pt-0.5">
                      {selectedClaim.planType === 'Government' 
                        ? 'Map the clinical diagnosis to standardized Government Health Benefit Packages (HBP).' 
                        : 'Map clinical diagnosis and procedures to standard SAC/HSN codes and finalize pricing.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative">
              {isLoading ? (
                <div className="absolute inset-0 z-50 bg-slate-50/80 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Activity className="w-10 h-10 animate-spin text-primary mb-4" />
                  <p className="text-slate-600 font-medium">Parsing Clinical JSON...</p>
                </div>
              ) : (
                <div className="max-w-[1200px] mx-auto pb-12 flex flex-col gap-8">
                  
                  {/* ========================================================= */}
                  {/* DYNAMIC SWAP: GOVERNMENT PACKAGE VS PRIVATE ITEMIZED      */}
                  {/* ========================================================= */}
                  
                  {selectedClaim.planType === 'Government' ? (
                    
                    /* --- GOVERNMENT PACKAGE VIEW --- */
                    <div className="space-y-6">
                      <div className="bg-indigo-50/30 rounded-2xl border border-indigo-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-sm font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-2">
                            <Package className="w-4 h-4" /> Package Mapping (HBP)
                          </h3>
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
                            <AlertCircle className="w-3 h-3" /> Fixed Rates Apply
                          </span>
                        </div>
                        
                        {/* Search Bar for Packages */}
                        <div className="relative mb-6">
                          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            value={packageSearchTerm}
                            onChange={(e) => setPackageSearchTerm(e.target.value)}
                            placeholder="Search by Procedure Name or HBP Code (e.g., SG01.1)..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-indigo-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-sm transition-all"
                          />
                          
                          {/* Floating Search Results */}
                          {packageSearchTerm && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden z-20">
                              {filteredPackages.length > 0 ? (
                                filteredPackages.map(pkg => (
                                  <div key={pkg.code} onClick={() => addPackage(pkg)} className="p-4 hover:bg-indigo-50 border-b border-slate-100 cursor-pointer flex justify-between items-center transition-colors">
                                    <div>
                                      <p className="font-bold text-slate-800">{pkg.name}</p>
                                      <p className="text-xs text-slate-500 font-medium">Code: {pkg.code} • {pkg.category}</p>
                                    </div>
                                    <span className="font-bold text-indigo-700">{formatINR(pkg.rate)}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center text-slate-500 text-sm">No packages found matching "{packageSearchTerm}"</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Selected Packages List */}
                        <div className="space-y-3">
                          {selectedPackages.length === 0 ? (
                            <div className="h-32 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-indigo-200 rounded-2xl bg-white/50">
                              <Package className="w-8 h-8 mb-2 text-indigo-200" />
                              <p className="font-bold text-sm">No packages mapped.</p>
                              <p className="text-xs">Search and select a government procedure code.</p>
                            </div>
                          ) : (
                            selectedPackages.map(pkg => (
                              <div key={pkg.code} className="flex items-center justify-between p-4 bg-white border border-indigo-100 rounded-xl shadow-sm">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs shrink-0">
                                    HBP
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{pkg.name}</h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Code: {pkg.code} | {pkg.category}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <span className="text-base font-black text-slate-800">{formatINR(pkg.rate)}</span>
                                  <button onClick={() => removePackage(pkg.code)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  
                  ) : (
                    
                    /* --- PRIVATE ITEMIZED VIEW (Your Original Code) --- */
                    <div className="space-y-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Financial Mapping
                      </h3>

                      {/* 1. Consultations / Diagnosis */}
                      {selectedClaim.clinicalData.diagnoses.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                            <div className="p-2 bg-accent/30 rounded-xl text-primary"><Stethoscope size={18} /></div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Consultations & Diagnosis</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">0% GST</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {selectedClaim.clinicalData.diagnoses.map((diag, index) => (
                              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-800 mb-3 truncate" title={diag.description}>{diag.code} - {diag.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Type</label>
                                    <select className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={consultationInputs[index]?.diagType ?? ''} onChange={(e) => updateField(setConsultationInputs, index, 'diagType', e.target.value)}>
                                      <option value="Primary">Primary</option>
                                      <option value="Secondary">Secondary</option>
                                      <option value="Comorbidity">Comorbidity</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Service</label>
                                    <select className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={consultationInputs[index]?.service ?? ''} onChange={(e) => updateField(setConsultationInputs, index, 'service', e.target.value)}>
                                      <option value="OPD">OPD</option>
                                      <option value="IPD">IPD</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Room Type</label>
                                    <select className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={consultationInputs[index]?.roomType ?? ''} onChange={(e) => updateField(setConsultationInputs, index, 'roomType', e.target.value)}>
                                      <option value="None">None (OPD)</option>
                                      <option value="General Ward">General Ward</option>
                                      <option value="Semi-Private">Semi-Private</option>
                                      <option value="Private Room">Private Room</option>
                                      <option value="ICU">ICU</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Start Date</label>
                                    <input type="date" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={consultationInputs[index]?.startDate ?? ''} onChange={(e) => updateField(setConsultationInputs, index, 'startDate', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">End Date</label>
                                    <input type="date" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={consultationInputs[index]?.endDate ?? ''} onChange={(e) => updateField(setConsultationInputs, index, 'endDate', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Fee (₹)</label>
                                    <input type="number" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none font-medium text-primary" value={consultationInputs[index]?.price ?? ''} onChange={(e) => updateField(setConsultationInputs, index, 'price', e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. Procedures */}
                      {selectedClaim.clinicalData.procedures.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                            <div className="p-2 bg-accent/30 rounded-xl text-primary"><Activity size={18} /></div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Procedures</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">0% GST</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {selectedClaim.clinicalData.procedures.map((proc, index) => (
                              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs font-bold text-slate-800 mb-3 truncate" title={proc.description}>{proc.code} - {proc.description}</p>
                                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Type</label>
                                    <select className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={procedureInputs[index]?.type ?? ''} onChange={(e) => updateField(setProcedureInputs, index, 'type', e.target.value)}>
                                      <option value="Surgical">Surgical</option>
                                      <option value="Non-Surgical">Non-Surgical</option>
                                      <option value="Daycare">Daycare</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Start Date/Time</label>
                                    <input type="datetime-local" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={procedureInputs[index]?.startDatetime ?? ''} onChange={(e) => updateField(setProcedureInputs, index, 'startDatetime', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">End Date/Time</label>
                                    <input type="datetime-local" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={procedureInputs[index]?.endDatetime ?? ''} onChange={(e) => updateField(setProcedureInputs, index, 'endDatetime', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">SAC Code</label>
                                    <input type="text" placeholder="9993" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={procedureInputs[index]?.sac ?? ''} onChange={(e) => updateField(setProcedureInputs, index, 'sac', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Pkg Price (₹)</label>
                                    <input type="number" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none font-medium text-primary" value={procedureInputs[index]?.price ?? ''} onChange={(e) => updateField(setProcedureInputs, index, 'price', e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3. Labs */}
                      {selectedClaim.clinicalData.labs.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                            <div className="p-2 bg-accent/30 rounded-xl text-primary"><TestTubes size={18} /></div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Lab Investigations</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">0% GST</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {selectedClaim.clinicalData.labs.map((lab, index) => (
                              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col lg:flex-row lg:items-end gap-4">
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-slate-800 truncate" title={lab.description}>{lab.code} - {lab.description}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">SAC</label>
                                    <input type="text" placeholder="9993" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={labInputs[index]?.sac ?? ''} onChange={(e) => updateField(setLabInputs, index, 'sac', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Count</label>
                                    <input type="number" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={labInputs[index]?.count ?? ''} onChange={(e) => updateField(setLabInputs, index, 'count', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Unit Price (₹)</label>
                                    <input type="number" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none font-medium text-primary" value={labInputs[index]?.price ?? ''} onChange={(e) => updateField(setLabInputs, index, 'price', e.target.value)} />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 4. Pharmacy */}
                      {selectedClaim.clinicalData.prescriptions.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                            <div className="p-2 bg-accent/30 rounded-xl text-primary"><Pill size={18} /></div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">Pharmacy</h4>
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Taxable Goods</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {selectedClaim.clinicalData.prescriptions.map((med, index) => (
                              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col lg:flex-row lg:items-end gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate" title={med.description}>{med.code} - {med.description}</p>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">HSN</label>
                                    <input type="text" placeholder="3004" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={pharmacyInputs[index]?.hsn ?? ''} onChange={(e) => updateField(setPharmacyInputs, index, 'hsn', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Qty</label>
                                    <input type="number" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={pharmacyInputs[index]?.qty ?? ''} onChange={(e) => updateField(setPharmacyInputs, index, 'qty', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">MRP (₹)</label>
                                    <input type="number" className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none font-medium text-primary" value={pharmacyInputs[index]?.price ?? ''} onChange={(e) => updateField(setPharmacyInputs, index, 'price', e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1">GST %</label>
                                    <select className="w-full border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-primary outline-none" value={pharmacyInputs[index]?.gst ?? '12'} onChange={(e) => updateField(setPharmacyInputs, index, 'gst', e.target.value)}>
                                      <option value="5">5%</option>
                                      <option value="12">12%</option>
                                      <option value="18">18%</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* --- BOTTOM SECTION: Live Invoice Preview ---                */}
                  {/* ========================================================= */}
                  <div className="w-full mt-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Final Invoice
                    </h3>

                    <div className="bg-white rounded-2xl shadow-lg border-t-8 border-t-primary p-6 relative overflow-hidden">
                      <ShieldCheck className="absolute -bottom-10 -right-10 w-48 h-48 text-slate-50 opacity-50 pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="text-center mb-6">
                          <h3 className="font-bold text-xl text-slate-900 uppercase tracking-widest">Tax Invoice</h3>
                          <p className="text-xs text-slate-500 mt-1">Medlock CRM Hospitals</p>
                          <p className="text-xs text-slate-500">Invoice #: INV-{selectedClaim.encounterId.split('-')[1]}-{Math.floor(Math.random() * 1000)}</p>
                          <p className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString('en-IN')}</p>
                        </div>

                        {/* Invoice Items (DYNAMIC BASED ON PLAN TYPE) */}
                        <div className="space-y-3 mb-6 pr-2">
                          
                          {selectedClaim.planType === 'Government' ? (
                            
                            /* --- GOVT INVOICE RENDER --- */
                            selectedPackages.map((pkg, i) => (
                              <div key={`inv-pkg-${i}`} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                <div className="flex-1 pr-4 overflow-hidden">
                                  <p className="font-semibold text-indigo-800 truncate" title={pkg.name}>[HBP] {pkg.name}</p>
                                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Code: {pkg.code} • 0% GST</p>
                                </div>
                                <p className="font-semibold text-slate-900">{formatINR(pkg.rate)}</p>
                              </div>
                            ))

                          ) : (
                            
                            /* --- PRIVATE ITEMIZED INVOICE RENDER (Your Original Code) --- */
                            <>
                              {/* Consultations */}
                              {selectedClaim.clinicalData.diagnoses.map((diag, i) => {
                                 const room = consultationInputs[i]?.roomType && consultationInputs[i]?.roomType !== 'None' ? ` • ${consultationInputs[i]?.roomType}` : '';
                                 const dates = (consultationInputs[i]?.startDate && consultationInputs[i]?.endDate) ? ` • (${consultationInputs[i].startDate} to ${consultationInputs[i].endDate})` : '';
                                 return (
                                  <div key={`inv-diag-${i}`} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                    <div className="flex-1 pr-4 overflow-hidden">
                                      <p className="font-semibold text-slate-800 truncate" title={`Consultation - ${diag.code}`}>Consultation ({consultationInputs[i]?.service || 'OPD'})</p>
                                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{consultationInputs[i]?.diagType || 'Primary'}{room}{dates} • 0% GST</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{formatINR(Number(consultationInputs[i]?.price) || 0)}</p>
                                  </div>
                                 )
                              })}

                              {/* Procedures */}
                              {selectedClaim.clinicalData.procedures.map((proc, i) => {
                                 const dateStr = (procedureInputs[i]?.startDatetime && procedureInputs[i]?.endDatetime) 
                                  ? ` • (${new Date(procedureInputs[i].startDatetime).toLocaleString('en-IN')} to ${new Date(procedureInputs[i].endDatetime).toLocaleString('en-IN')})` 
                                  : '';
                                return (
                                  <div key={`inv-proc-${i}`} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                    <div className="flex-1 pr-4 overflow-hidden">
                                      <p className="font-semibold text-slate-800 truncate" title={proc.description}>{proc.description}</p>
                                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{procedureInputs[i]?.type || 'Surgical'}{dateStr} • 0% GST</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{formatINR(Number(procedureInputs[i]?.price) || 0)}</p>
                                  </div>
                                )
                              })}

                              {/* Labs */}
                              {selectedClaim.clinicalData.labs.map((lab, i) => {
                                const lQty = Number(labInputs[i]?.count) || 0;
                                const lPrice = Number(labInputs[i]?.price) || 0;
                                return (
                                  <div key={`inv-lab-${i}`} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                    <div className="flex-1 pr-4 overflow-hidden">
                                      <p className="font-semibold text-slate-800 truncate" title={lab.description}>{lab.description} (x{lQty})</p>
                                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">0% GST</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{formatINR(lQty * lPrice)}</p>
                                  </div>
                                );
                              })}

                              {/* Pharmacy */}
                              {selectedClaim.clinicalData.prescriptions.map((med, i) => {
                                const pQty = Number(pharmacyInputs[i]?.qty) || 0;
                                const pPrice = Number(pharmacyInputs[i]?.price) || 0;
                                const pGst = pharmacyInputs[i]?.gst || 12;
                                return (
                                  <div key={`inv-med-${i}`} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                                    <div className="flex-1 pr-4 overflow-hidden">
                                      <p className="font-semibold text-slate-800 truncate" title={med.description}>{med.description} (x{pQty})</p>
                                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{pGst}% GST</p>
                                    </div>
                                    <p className="font-semibold text-slate-900">{formatINR(pQty * pPrice)}</p>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </div>

                        {/* Totals */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:w-1/2 md:ml-auto">
                          {selectedClaim.planType === 'Retail' && (
                            <>
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Subtotal</span><span>{formatINR(itemizedSubtotal)}</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                <span>Total CGST</span><span>{formatINR(cgstAmount)}</span>
                              </div>
                              <div className="flex justify-between text-[10px] text-slate-500 mb-3 border-b border-slate-200 pb-3">
                                <span>Total SGST</span><span>{formatINR(sgstAmount)}</span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="font-bold text-slate-800">Grand Total</span>
                            <span className="font-extrabold text-xl text-primary">{formatINR(grandTotal)}</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Global Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />
    </div>
  );
}