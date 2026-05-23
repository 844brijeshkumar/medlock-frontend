import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  UploadCloud, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Activity,
  User,
  Hash,
  ChevronRight,
  Syringe,
  FileDigit,
  Receipt,
  X,
  Type,
  Info,
  Pill,
  Building,
  HeartPulse,
  Skull,
  FileCheck,
  CreditCard,
  Landmark,
  Shield
} from 'lucide-react';

// --- MOCK DATA: Step 3 / Evidence Dispatch Queue ---
const mockUploadQueue = [
  {
    "encounterId": "ENC-2026-0895",
    "nhcxClaimId": "Pending",
    "patientName": "Sunita Rao",
    "currentStatus": "Billed", 
    "planType": "Retail",
    "selectedPayer": "HDFC Ergo General Insurance",
    "claimedAmount": 45000,
    "queryNote": null,
    "dischargeType": "Routine", 
    "existingDocs": { diagnosis: null, lab: { name: "lab_report.pdf", size: "1.2 MB" } }
  },
  {
    "encounterId": "ENC-2026-0860",
    "nhcxClaimId": "NHCX-8877",
    "patientName": "Anil Kapoor",
    "currentStatus": "Re-Billed", 
    "planType": "Government",
    "selectedPayer": "PM-JAY (Ayushman Bharat)",
    "claimedAmount": 48500,
    "queryNote": null,
    "dischargeType": "Expired", 
    "existingDocs": { diagnosis: { name: "updated_clinical.pdf", size: "900 KB" }, lab: null }
  },
  {
    "encounterId": "ENC-2026-0870",
    "nhcxClaimId": "NHCX-9988",
    "patientName": "Priya Singh",
    "currentStatus": "Required Evidence",
    "planType": "Government",
    "selectedPayer": "Railway Health Services (IRHS)",
    "claimedAmount": 32000,
    "queryNote": "The attached Invoice is missing the hospital seal. Please upload the finalized stamped invoice and latest clinical notes.",
    "dischargeType": "Routine",
    "existingDocs": { diagnosis: { name: "initial_assessment.pdf", size: "1.2 MB" }, lab: null }
  },
  {
    "encounterId": "ENC-2026-0899",
    "nhcxClaimId": "Pending",
    "patientName": "Ramesh Kumar",
    "currentStatus": "Billed",
    "planType": "Corporate",
    "selectedPayer": "Star Health & Allied Insurance",
    "claimedAmount": 15000,
    "queryNote": null,
    "dischargeType": "LAMA", 
    "existingDocs": { diagnosis: null, lab: null }
  }
];

// Utilities
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Required Evidence': return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
    case 'Billed': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'Re-Billed': return 'bg-orange-100 text-orange-800 border-orange-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function DocumentDispatchCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState("All");
  const [selectedClaimId, setSelectedClaimId] = useState(mockUploadQueue[0].encounterId);
  const [theme, setTheme] = useState({ primary: '#0b4f4a', secondary: '#2a9b94', accent: '#d1e8e5' });

  const [dischargeType, setDischargeType] = useState("Routine"); 

  // State for documents
  const [docs, setDocs] = useState({
    diagnosis: null, 
    procedure: null, 
    lab: null, 
    invoice: null,
    dischargeSummary: { mode: 'file', data: null },
    deathSummary: { mode: 'file', data: null },
    deathCertificate: null, 
    clinicalNotes: { mode: 'text', data: '' },
    medicineInfo: { mode: 'file', data: null },
    
    // Government & Scheme Specific Docs
    preAuthLetter: null,
    referralMemo: null,
    smartCard: null,
    patientId: null,
    esicForm11: null,
    umidCard: null,
    stateIdCard: null
  });

  useEffect(() => {
    try {
      const cachedPrimary = localStorage.getItem('theme-primary');
      if (cachedPrimary) {
        setTheme({ primary: cachedPrimary, secondary: localStorage.getItem('theme-secondary') || '#2a9b94', accent: localStorage.getItem('theme-accent') || '#d1e8e5' });
      }
    } catch (e) { console.warn("Theme load failed."); }
  }, []);

  // Derived states
  const filteredClaims = useMemo(() => {
    return mockUploadQueue.filter(claim => {
      const matchesSearch = claim.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) || claim.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || claim.currentStatus === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchTerm, activeTab]);

  const selectedClaim = useMemo(() => {
    return mockUploadQueue.find(c => c.encounterId === selectedClaimId) || mockUploadQueue[0];
  }, [selectedClaimId]);

  // Reset document state when a new patient is clicked
  useEffect(() => {
    if (selectedClaim) {
      setDischargeType(selectedClaim.dischargeType || "Routine");
      setDocs({
        diagnosis: selectedClaim.existingDocs?.diagnosis || null,
        procedure: null,
        lab: selectedClaim.existingDocs?.lab || null,
        invoice: null,
        dischargeSummary: { mode: 'file', data: null },
        deathSummary: { mode: 'file', data: null },
        deathCertificate: null,
        clinicalNotes: { mode: 'text', data: '' },
        medicineInfo: { mode: 'file', data: null },
        preAuthLetter: null,
        referralMemo: null,
        smartCard: null,
        patientId: null,
        esicForm11: null,
        umidCard: null,
        stateIdCard: null
      });
    }
  }, [selectedClaimId, selectedClaim]);

  // --- THE SMART CHECKLIST VALIDATOR ---
  const missingMandatoryDocs = useMemo(() => {
    let missing = [];
    const pt = selectedClaim?.planType || 'Retail';
    const payer = selectedClaim?.selectedPayer || '';

    // 1. Final Invoice is ALWAYS required
    if (!docs.invoice) missing.push(pt === 'Government' ? "Final Package Invoice (HBP)" : "Final Itemized Invoice");

    // 2. Discharge / Death Logic (Universal)
    if (dischargeType === "Expired") {
        if (!docs.deathSummary.data) missing.push("Death Summary");
        if (!docs.deathCertificate) missing.push("Death Certificate");
    } else {
        if (!docs.dischargeSummary.data) missing.push("Discharge Summary");
    }

    // 3. Payer-Specific Logic
    if (pt === 'Government') {
       // --- GOVERNMENT SPECIFIC (All 6 Types Handled) ---
       if (payer.includes('PM-JAY') || payer.includes('State Scheme')) {
          if (!docs.preAuthLetter) missing.push(payer.includes('PM-JAY') ? "PM-JAY Pre-Auth Letter" : "State Pre-Auth Letter");
          if (!docs.clinicalNotes.data) missing.push("Clinical Notes / Surgery Photos");
          if (payer.includes('State Scheme') && !docs.stateIdCard) missing.push("State Beneficiary Card (e.g., Ration Card)");
       } 
       else if (payer.includes('CGHS') || payer.includes('ECHS')) {
          if (!docs.referralMemo) missing.push("Government Referral Memo");
          if (!docs.smartCard) missing.push("Smart Card / Beneficiary Copy");
       }
       else if (payer.includes('ESIC')) {
          if (!docs.esicForm11) missing.push("ESIC Form-11 (Referral)");
          if (!docs.smartCard) missing.push("ESIC Pehchan Card Copy");
       }
       else if (payer.includes('Railway')) {
          if (!docs.referralMemo) missing.push("Railway Hospital Referral Letter");
          if (!docs.umidCard) missing.push("Railway UMID Card Copy");
       }
    } else {
       // --- UNIFIED PRIVATE / CORPORATE LOGIC ---
       if (!docs.patientId) missing.push("Patient ID / KYC");
       if (!docs.clinicalNotes.data) missing.push("Clinical Notes");
    }

    return missing;
  }, [docs, selectedClaim, dischargeType]);


  // --- Real Document Handlers ---
  const processFile = (category, file, isDualMode = false) => {
    if (!file) return;
    const fileData = { name: file.name, size: formatFileSize(file.size), fileObject: file };
    setDocs(prev => {
      if (isDualMode) return { ...prev, [category]: { ...prev[category], data: fileData } };
      return { ...prev, [category]: fileData };
    });
  };

  const handleRemoveFile = (category, isDualMode = false) => {
    setDocs(prev => {
      if (isDualMode) return { ...prev, [category]: { ...prev[category], data: null } };
      return { ...prev, [category]: null };
    });
  };

  const handleDualModeChange = (category, mode) => {
    setDocs(prev => ({ ...prev, [category]: { ...prev[category], mode, data: mode === 'text' ? '' : null } }));
  };
  
  const handleTextChange = (category, value) => {
    setDocs(prev => ({ ...prev, [category]: { ...prev[category], data: value } }));
  };

  // --- Next Step Handler ---
  const handleSubmit = () => {
    if (missingMandatoryDocs.length > 0) {
        alert(`Cannot proceed to NHCX Gateway.\n\nMissing mandatory documents:\n- ${missingMandatoryDocs.join('\n- ')}`);
        return;
    }
    alert(`FHIR Bundle Verified & Packed successfully for ${selectedClaim.encounterId}.\nRouting to Final Preview.`);
  };

  // --- REUSABLE UI COMPONENTS (Cards) ---
  const FileCard = ({ title, category, icon: Icon, required, accentColor = 'secondary' }) => {
    const file = docs[category];
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
      e.preventDefault(); setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(category, e.dataTransfer.files[0], false);
    };

    const borderFocus = accentColor === 'rose' ? 'border-rose-400' : accentColor === 'indigo' ? 'border-indigo-400' : accentColor === 'blue' ? 'border-blue-400' : 'border-secondary/40';
    const bgFocus = accentColor === 'rose' ? 'bg-rose-50' : accentColor === 'indigo' ? 'bg-indigo-50' : accentColor === 'blue' ? 'bg-blue-50' : 'bg-accent/20';
    const textFocus = accentColor === 'rose' ? 'text-rose-500' : accentColor === 'indigo' ? 'text-indigo-600' : accentColor === 'blue' ? 'text-blue-600' : 'text-secondary';
    const iconBg = accentColor === 'rose' ? 'bg-rose-100 text-rose-600' : accentColor === 'indigo' ? 'bg-indigo-100 text-indigo-600' : accentColor === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-accent/30 text-primary';

    return (
      <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full transition-colors hover:${borderFocus}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-1.5 rounded-md ${iconBg}`}><Icon size={16} /></div>
          <h3 className="font-bold text-slate-800 text-xs flex-1">{title} {required && <span className="text-rose-500">*</span>}</h3>
        </div>
        
        {file ? (
          <div className="flex-1 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
            <div className="flex items-center gap-2 overflow-hidden">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              <div className="truncate">
                <p className="text-xs font-bold text-emerald-900 truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] text-emerald-700">{file.size}</p>
              </div>
            </div>
            <button onClick={() => handleRemoveFile(category, false)} className="text-emerald-600 hover:text-emerald-800 shrink-0 ml-2"><X size={14} /></button>
          </div>
        ) : (
          <div 
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} 
            className={`flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer group transition-all
              ${isDragging ? `${borderFocus} ${bgFocus}` : `border-slate-200 bg-slate-50 hover:${bgFocus} hover:${borderFocus}`}`}
          >
            <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { if(e.target.files?.[0]) processFile(category, e.target.files[0], false); e.target.value = null; }} />
            <UploadCloud size={20} className={`mb-1 transition-colors ${isDragging ? textFocus : `text-slate-400 group-hover:${textFocus}`}`} />
            <p className={`text-[10px] font-bold transition-colors ${isDragging ? textFocus : `text-slate-500 group-hover:${textFocus}`}`}>Click or Drag file</p>
          </div>
        )}
      </div>
    );
  };

  const DualModeCard = ({ title, category, icon: Icon, required, accentColor='secondary' }) => {
    const state = docs[category];
    const isFileMode = state.mode === 'file';
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e) => {
      e.preventDefault(); setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) processFile(category, e.dataTransfer.files[0], true);
    };

    const borderFocus = accentColor === 'rose' ? 'border-rose-400' : 'border-secondary/40';
    const bgFocus = accentColor === 'rose' ? 'bg-rose-50' : 'bg-accent/20';
    const textFocus = accentColor === 'rose' ? 'text-rose-500' : 'text-secondary';
    const iconBg = accentColor === 'rose' ? 'bg-rose-100 text-rose-600' : 'bg-accent/30 text-primary';

    return (
      <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full transition-colors hover:${borderFocus}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${iconBg}`}><Icon size={16} /></div>
            <h3 className="font-bold text-slate-800 text-xs">{title} {required && <span className="text-rose-500">*</span>}</h3>
          </div>
          <div className="flex bg-slate-100 p-0.5 rounded-md">
            <button onClick={() => handleDualModeChange(category, 'file')} className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${isFileMode ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><UploadCloud size={10} /> File</button>
            <button onClick={() => handleDualModeChange(category, 'text')} className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 transition-all ${!isFileMode ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Type size={10} /> Text</button>
          </div>
        </div>
        
        {isFileMode ? (
          state.data && state.data.name ? (
             <div className="flex-1 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
               <div className="flex items-center gap-2 overflow-hidden">
                 <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                 <div className="truncate">
                    <p className="text-xs font-bold text-emerald-900 truncate" title={state.data.name}>{state.data.name}</p>
                    {state.data.size && <p className="text-[10px] text-emerald-700">{state.data.size}</p>}
                 </div>
               </div>
               <button onClick={() => handleRemoveFile(category, true)} className="text-emerald-600 hover:text-emerald-800 shrink-0 ml-2"><X size={14} /></button>
             </div>
          ) : (
            <div 
              onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} 
              className={`flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer group transition-all
                ${isDragging ? `${borderFocus} ${bgFocus}` : `border-slate-200 bg-slate-50 hover:${bgFocus} hover:${borderFocus}`}`}
            >
              <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => { if(e.target.files?.[0]) processFile(category, e.target.files[0], true); e.target.value = null; }} />
              <UploadCloud size={20} className={`mb-1 transition-colors ${isDragging ? textFocus : `text-slate-400 group-hover:${textFocus}`}`} />
              <p className={`text-[10px] font-bold transition-colors ${isDragging ? textFocus : `text-slate-500 group-hover:${textFocus}`}`}>Click or Drag file</p>
            </div>
          )
        ) : (
          <textarea value={state.data || ''} onChange={(e) => handleTextChange(category, e.target.value)} placeholder={`Type ${title.toLowerCase()}...`} className="flex-1 w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none resize-none custom-scrollbar min-h-[80px]" />
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900" style={{ '--primary': theme.primary, '--primary-hover': '#083b37', '--secondary': theme.secondary, '--accent': theme.accent }}>

      {/* LEFT COLUMN: Master List */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-white sticky top-0">
          <h1 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-secondary" />
            Document Dispatch
          </h1>
          
          <div className="relative mb-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search Encounter or Patient..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all" />
          </div>

          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
            {["All", "Billed", "Re-Billed", "Required Evidence"].map(tab => (
              <button
                key={tab} onClick={() => { setActiveTab(tab); setSelectedClaimId(null); }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-accent hover:text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredClaims.length > 0 ? filteredClaims.map((claim) => (
            <div 
              key={claim.encounterId} onClick={() => setSelectedClaimId(claim.encounterId)}
              className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${selectedClaimId === claim.encounterId ? 'bg-accent/30 border-secondary shadow-sm ring-1 ring-secondary/50' : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2"><User size={14} className="text-primary"/> {claim.patientName}</p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wide ${getStatusColor(claim.currentStatus)}`}>{claim.currentStatus}</span>
              </div>
              <div className="flex justify-between items-end text-xs text-slate-500">
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1 font-medium"><Hash className="w-3.5 h-3.5" /> {claim.encounterId}</span>
                  <span className="font-semibold text-slate-700 mt-0.5">{formatCurrency(claim.claimedAmount)}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-colors ${selectedClaimId === claim.encounterId ? 'text-secondary' : 'text-slate-300'}`} />
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-500 text-sm">No pending uploads found.</div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Detail Upload Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
        {!selectedClaim ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <UploadCloud className="w-16 h-16 mb-4 opacity-20" />
            <p>Select an encounter from the queue to attach documents.</p>
          </div>
        ) : (
          <>
            {/* Detail Header */}
            <div className="bg-white px-8 py-6 border-b border-slate-200 shadow-sm z-10 flex-none">
              <div className="flex items-center justify-between mb-1.5">
                 <div className="flex items-center gap-3">
                   <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(selectedClaim.currentStatus)}`}>
                    Queue: {selectedClaim.currentStatus}
                  </span>
                  
                  {/* DYNAMIC BADGE */}
                  <div className={`px-2.5 py-1 rounded-full border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                    selectedClaim.planType === 'Government' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {selectedClaim.planType === 'Government' ? <Landmark className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                    {selectedClaim.selectedPayer || selectedClaim.planType} Requirements
                  </div>
                 </div>
                
                {/* Discharge Type Selector */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <span className="text-xs font-bold text-slate-500 ml-2">Discharge:</span>
                    <select 
                        value={dischargeType} onChange={(e) => setDischargeType(e.target.value)}
                        className={`text-xs font-bold py-1 px-2 rounded border focus:outline-none focus:ring-1 focus:ring-secondary ${dischargeType === 'Expired' ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-white text-slate-700 border-slate-200'}`}
                    >
                        <option value="Routine">Routine</option>
                        <option value="LAMA">LAMA / DAMA</option>
                        <option value="Transfer">Transfer</option>
                        <option value="Expired">Expired (Death)</option>
                    </select>
                </div>
              </div>
              
              <div className="flex justify-between items-end mt-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-slate-400" />
                    {selectedClaim.patientName}
                  </h2>
                  <p className="text-slate-500 flex items-center gap-1.5 mt-2 text-sm font-mono">
                    ID: {selectedClaim.encounterId}
                  </p>
                </div>
                
                {/* Dynamic Submit Button */}
                <button 
                  onClick={handleSubmit}
                  disabled={missingMandatoryDocs.length > 0} 
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-md transition-all uppercase tracking-wide
                    ${missingMandatoryDocs.length === 0
                      ? 'bg-primary hover:bg-primary-hover text-white active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }
                  `}
                >
                  <Building className="w-4 h-4" />
                  Preview & Submit
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Context Banner */}
              <div className="mt-6">
                {selectedClaim.queryNote ? (
                  <div className="p-3 bg-fuchsia-50 border border-fuchsia-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-fuchsia-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-bold text-fuchsia-800 uppercase tracking-widest mb-0.5">Auditor Requirements</p>
                      <p className="text-sm font-medium text-fuchsia-900">{selectedClaim.queryNote}</p>
                    </div>
                  </div>
                ) : dischargeType === 'Expired' ? (
                   <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                    <Skull className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-rose-800 pt-0.5">
                      Patient Expired. <span className="font-bold">Death Summary</span> and <span className="font-bold">Death Certificate</span> are mandatory for NHCX submission.
                    </p>
                  </div>
                ) : missingMandatoryDocs.length > 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-amber-800 pt-0.5">
                      Please upload the remaining <span className="font-bold">{missingMandatoryDocs.length} mandatory document(s)</span> for this {selectedClaim.planType} claim to unlock submission.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-emerald-800 pt-0.5">
                      All mandatory FHIR bundle documents verified. Ready for Preview.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Grid Scroll Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                
                {/* ========================================== */}
                {/* --- DYNAMIC GOVERNMENT SCHEME DOCUMENTS --- */}
                {/* ========================================== */}
                
                {/* 1. PM-JAY & State Schemes */}
                {selectedClaim.planType === 'Government' && (selectedClaim.selectedPayer?.includes('PM-JAY') || selectedClaim.selectedPayer?.includes('State Scheme')) && (
                  <FileCard title="Pre-Auth Approval Letter" category="preAuthLetter" icon={FileCheck} required accentColor="indigo" />
                )}
                
                {/* 2. CGHS, ECHS, Railways (Referrals) */}
                {selectedClaim.planType === 'Government' && (selectedClaim.selectedPayer?.includes('CGHS') || selectedClaim.selectedPayer?.includes('ECHS') || selectedClaim.selectedPayer?.includes('Railway')) && (
                  <FileCard title="Government Referral Memo" category="referralMemo" icon={FileText} required accentColor="indigo" />
                )}

                {/* 3. ESIC Specific */}
                {selectedClaim.planType === 'Government' && selectedClaim.selectedPayer?.includes('ESIC') && (
                  <FileCard title="ESIC Form-11 (Referral)" category="esicForm11" icon={FileText} required accentColor="indigo" />
                )}

                {/* 4. ID Cards for Government */}
                {selectedClaim.planType === 'Government' && (
                  <>
                    {(selectedClaim.selectedPayer?.includes('CGHS') || selectedClaim.selectedPayer?.includes('ECHS') || selectedClaim.selectedPayer?.includes('ESIC')) && (
                      <FileCard title={`${selectedClaim.selectedPayer.includes('ECHS') ? '64KB ' : selectedClaim.selectedPayer.includes('ESIC') ? 'Pehchan ' : ''}Smart Card Copy`} category="smartCard" icon={CreditCard} required accentColor="indigo" />
                    )}
                    {selectedClaim.selectedPayer?.includes('Railway') && (
                      <FileCard title="Railway UMID Card Copy" category="umidCard" icon={CreditCard} required accentColor="indigo" />
                    )}
                    {selectedClaim.selectedPayer?.includes('State Scheme') && (
                      <FileCard title="State ID / Ration Card Copy" category="stateIdCard" icon={CreditCard} required accentColor="indigo" />
                    )}
                  </>
                )}

                {/* ========================================== */}
                {/* --- UNIFIED PRIVATE / CORPORATE DOCUMENTS --- */}
                {/* ========================================== */}
                {(selectedClaim.planType === 'Retail' || selectedClaim.planType === 'Corporate') && (
                  <FileCard title="Patient ID / KYC" category="patientId" icon={User} required accentColor="blue" />
                )}


                {/* ========================================== */}
                {/* --- STANDARD CLINICAL DOCUMENTS --- */}
                {/* ========================================== */}
                <FileCard title="Diagnosis Related" category="diagnosis" icon={Activity} />
                <FileCard title="Procedure Related" category="procedure" icon={Syringe} />
                <FileCard title="Lab Test Reports" category="lab" icon={FileDigit} />
                
                <FileCard 
                  title={selectedClaim.planType === 'Government' ? "Final Package Invoice" : "Final Itemized Invoice"} 
                  category="invoice" icon={Receipt} required 
                />
                
                <DualModeCard title="Medicine / Pharmacy" category="medicineInfo" icon={Pill} />
                
                {/* Conditional Discharge / Death Docs */}
                {dischargeType === 'Expired' ? (
                  <>
                    <DualModeCard title="Death Summary" category="deathSummary" icon={HeartPulse} required accentColor="rose" />
                    <FileCard title="Death Certificate" category="deathCertificate" icon={FileText} required accentColor="rose" />
                  </>
                ) : (
                  <DualModeCard title="Discharge Summary" category="dischargeSummary" icon={FileText} required={true} />
                )}

                <div className="lg:col-span-3">
                  <DualModeCard 
                    title="Clinical Notes / Surgery Photos" 
                    category="clinicalNotes" 
                    icon={FileText} 
                    required={selectedClaim.planType === 'Retail' || selectedClaim.planType === 'Corporate' || selectedClaim?.selectedPayer?.includes('PM-JAY')} 
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />
    </div>
  );
}