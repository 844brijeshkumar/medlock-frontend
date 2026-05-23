import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  User,
  Hash,
  ShieldCheck,
  Send,
  Building,
  FileJson,
  Lock,
  PenTool,
  CheckSquare,
  Stethoscope,
  Banknote,
  Landmark,
  Shield,
  KeyRound,
  FileText
} from 'lucide-react';

// --- MOCK DATA: Step 5 (Final Preview & Submit) ---
const mockClaimsReadyForSubmit = [
  {
    "encounterId": "ENC-2026-0895",
    "patientName": "Sunita Rao",
    "abhaId": "91-2222-3333-4444",
    "currentStatus": "Ready for Submission",
    "planType": "Retail",
    "claimedAmount": 45000,
    "provider": { payer: "HDFC Ergo General Insurance", policyNo: "HDFC-POL-998877", tpa: "Medi Assist" },
    "clinical": { primaryDiagnosis: "Acute Appendicitis (K35.8)", doctorName: "Dr. Sharma", hprId: "IN-DOC-001" },
    "hospital": { hfrId: "IN-HOS-9988" },
    "attachedDocs": ["Clinical Notes", "Lab Report", "Final Stamped Invoice"]
  },
  {
    "encounterId": "ENC-2026-0910",
    "patientName": "Rahul Dravid",
    "abhaId": "91-1010-2020-3030",
    "currentStatus": "Ready for Submission",
    "planType": "Government",
    "claimedAmount": 125000, // Represents the HBP Package Total
    "provider": { payer: "PM-JAY (Ayushman Bharat)", policyNo: "P9988776655", tpa: "" },
    "clinical": { primaryDiagnosis: "Coronary Artery Disease (I25.10)", doctorName: "Dr. Verma", hprId: "IN-DOC-002" },
    "hospital": { hfrId: "IN-HOS-9988" },
    "attachedDocs": ["Pre-Auth Approval Letter", "Clinical Notes", "Final Package Invoice"]
  }
];

// Utilities
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export default function NHCXPreviewAndSubmit() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState(mockClaimsReadyForSubmit[0].encounterId);
  const [theme, setTheme] = useState({ primary: '#0b4f4a', secondary: '#2a9b94', accent: '#d1e8e5' });
  
  // --- NHCX SPECIFIC STATE ---
  const [claimStage, setClaimStage] = useState("preauth"); // preauth, enhancement, final
  const [preAuthRefId, setPreAuthRefId] = useState("");
  const [fundsReserve, setFundsReserve] = useState("cashless"); // cashless, reimbursement
  const [consentGiven, setConsentGiven] = useState(false);
  
  // --- AADHAAR E-SIGN STATE ---
  const [selectedDoctorHpr, setSelectedDoctorHpr] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  
  // Submission States
  const [isSigning, setIsSigning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    try {
      const cachedPrimary = localStorage.getItem('theme-primary');
      if (cachedPrimary) setTheme({ primary: cachedPrimary, secondary: localStorage.getItem('theme-secondary') || '#2a9b94', accent: localStorage.getItem('theme-accent') || '#d1e8e5' });
    } catch (e) {}
  }, []);

  const filteredClaims = useMemo(() => mockClaimsReadyForSubmit.filter(claim => claim.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) || claim.patientName.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);
  const selectedClaim = useMemo(() => mockClaimsReadyForSubmit.find(c => c.encounterId === selectedClaimId) || mockClaimsReadyForSubmit[0], [selectedClaimId]);

  // Reset form when clicking a different claim
  useEffect(() => {
    setClaimStage("preauth");
    setPreAuthRefId("");
    setFundsReserve("cashless");
    setConsentGiven(false);
    setIsSubmitted(false);
    setIsSigning(false);
    // Reset E-Sign
    setSelectedDoctorHpr("");
    setAadhaarOtp("");
    setIsOtpSent(false);
    
    // Auto-select doctor for convenience if there's only one in the mock data
    if(selectedClaim) {
       setSelectedDoctorHpr(selectedClaim.clinical.hprId);
    }
  }, [selectedClaimId, selectedClaim]);

  // --- Dynamic Label Helpers ---
  const getPolicyLabel = (payer) => {
    if (payer.includes('PM-JAY')) return 'Ayushman ID';
    if (payer.includes('CGHS')) return 'CGHS Beneficiary ID';
    if (payer.includes('ECHS')) return 'Smart Card No.';
    if (payer.includes('ESIC')) return 'IP Number';
    if (payer.includes('Railway')) return 'UMID Number';
    return 'Policy Number';
  };

  // --- Validation ---
  const requiresRefId = claimStage === "final" || claimStage === "enhancement";
  const isRefIdValid = requiresRefId ? preAuthRefId.trim() !== "" : true;
  
  const isSignatureValid = isOtpSent && aadhaarOtp.length === 6 && selectedDoctorHpr !== "";
  
  const isFormValid = consentGiven && isRefIdValid && isSignatureValid && !isSubmitted;

  // --- E-Sign Handlers ---
  const handleSendOtp = () => {
     if(!selectedDoctorHpr) return alert("Select a signing doctor first.");
     setIsSigning(true);
     setTimeout(() => {
         setIsSigning(false);
         setIsOtpSent(true);
     }, 1000);
  };

  // --- Submission Handler ---
  const handleSignAndSubmit = () => {
    setIsSigning(true);
    
    // Simulate API Payload Generation
    setTimeout(() => {
      setIsSigning(false);
      setIsSubmitted(true);
      
      const payloadSummary = `
      FHIR BUNDLE GENERATED & E-SIGNED ✅
      ---------------------------------
      Encounter: ${selectedClaim.encounterId}
      Plan Type: ${selectedClaim.planType.toUpperCase()}
      Stage: ${claimStage.toUpperCase()}
      Type: ${fundsReserve.toUpperCase()}
      Ref ID: ${preAuthRefId || 'N/A'}
      Consent: Verified via Patient
      Signatory: ${selectedClaim.clinical.doctorName} (HPR: ${selectedDoctorHpr})
      Signature Validated via UIDAI OTP.
      
      Status: Encrypted & Dispatched to NHCX Gateway.
      `;
      alert(payloadSummary);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900" style={{ '--primary': theme.primary, '--secondary': theme.secondary, '--accent': theme.accent }}>
      
      {/* LEFT COLUMN: Queue */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-white sticky top-0">
          <h1 className="text-xl font-bold text-primary mb-4 flex items-center gap-2"><FileJson className="w-5 h-5 text-secondary" /> Final Submission</h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search Encounter..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary transition-all" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredClaims.map((claim) => (
            <div key={claim.encounterId} onClick={() => setSelectedClaimId(claim.encounterId)} className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${selectedClaimId === claim.encounterId ? 'bg-accent/30 border-secondary shadow-sm ring-1 ring-secondary/50' : 'bg-white border-slate-100 hover:bg-slate-50 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-slate-900 text-sm flex items-center gap-2"><User size={14} className="text-primary"/> {claim.patientName}</p>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1"><CheckCircle2 size={10} /> Ready</span>
              </div>
              <div className="flex justify-between items-end text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium"><Hash className="w-3.5 h-3.5" /> {claim.encounterId}</span>
                <span className="font-semibold text-slate-700">{formatCurrency(claim.claimedAmount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Preview & Configuration */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
        
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-end shadow-sm z-10 flex-none">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-200 uppercase tracking-wider">Step 5: Bundle Generation</span>
              
              {/* Dynamic Badge for Plan Type */}
              <div className={`px-2.5 py-1 rounded-full border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                  selectedClaim.planType === 'Government' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
                  {selectedClaim.planType === 'Government' ? <Landmark className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                  {selectedClaim.planType} Claim
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedClaim.patientName}</h2>
            <p className="text-slate-500 flex items-center gap-1.5 mt-2 text-sm font-mono">ID: {selectedClaim.encounterId} | ABHA: {selectedClaim.abhaId}</p>
          </div>
          
          {/* Main Action Button */}
          <button 
            onClick={handleSignAndSubmit}
            disabled={!isFormValid}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-md transition-all uppercase tracking-wide
                ${isSubmitted ? 'bg-emerald-500 text-white shadow-none' : 
                  (isFormValid ? 'bg-primary hover:bg-primary-hover text-white active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none')}
            `}
          >
            {isSigning && isOtpSent ? (<><Activity className="w-4 h-4 animate-spin" /> Transmitting...</>) : 
             isSubmitted ? (<><CheckCircle2 className="w-4 h-4" /> Submitted</>) : 
             (<><Send className="w-4 h-4" /> Sign & Transmit</>)}
          </button>
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6 pb-12">

            {/* --- 1. NHCX GATEWAY CONFIGURATIONS --- */}
            <div className={`p-8 rounded-2xl border-2 shadow-sm transition-all ${isSubmitted ? 'border-emerald-200 bg-emerald-50/20' : 'border-secondary/40 bg-white'}`}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><Send className="w-4 h-4" /> Claim Parameters (FHIR Message Header)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Claim Stage Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3">Claim Stage / Request Type <span className="text-rose-500">*</span></label>
                  <div className="flex flex-col gap-3">
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${claimStage === 'preauth' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" checked={claimStage === 'preauth'} onChange={() => setClaimStage('preauth')} className="w-4 h-4 accent-primary" disabled={isSubmitted} />
                        <div><p className={`text-sm font-bold ${claimStage === 'preauth' ? 'text-primary' : 'text-slate-700'}`}>Pre-Authorization</p><p className="text-[11px] text-slate-500">Requesting initial approval & estimated cost.</p></div>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${claimStage === 'enhancement' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" checked={claimStage === 'enhancement'} onChange={() => setClaimStage('enhancement')} className="w-4 h-4 accent-primary" disabled={isSubmitted} />
                        <div><p className={`text-sm font-bold ${claimStage === 'enhancement' ? 'text-primary' : 'text-slate-700'}`}>Enhancement</p><p className="text-[11px] text-slate-500">Requesting additional funds mid-treatment.</p></div>
                    </label>
                    <label className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${claimStage === 'final' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 hover:bg-slate-50'}`}>
                        <input type="radio" checked={claimStage === 'final'} onChange={() => setClaimStage('final')} className="w-4 h-4 accent-primary" disabled={isSubmitted} />
                        <div><p className={`text-sm font-bold ${claimStage === 'final' ? 'text-primary' : 'text-slate-700'}`}>Final Claim (Discharge)</p><p className="text-[11px] text-slate-500">Submitting final invoice for settlement.</p></div>
                    </label>
                  </div>
                </div>

                {/* Right Column inside Config */}
                <div className="space-y-6">
                  {/* Conditional Pre-Auth Input */}
                  <div className={`transition-all duration-300 ${requiresRefId ? 'opacity-100 h-auto' : 'opacity-50 pointer-events-none'}`}>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Pre-Auth Reference ID {requiresRefId && <span className="text-rose-500">*</span>}</label>
                    <input 
                      type="text" 
                      value={preAuthRefId} 
                      onChange={(e) => setPreAuthRefId(e.target.value)} 
                      placeholder={requiresRefId ? "Enter Approved ID from Payer..." : "Not required for initial Pre-Auth"}
                      disabled={!requiresRefId || isSubmitted}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:border-secondary focus:ring-1 focus:ring-secondary shadow-sm disabled:bg-slate-100" 
                    />
                    {requiresRefId && !isRefIdValid && <p className="text-[10px] text-rose-500 mt-1 font-bold">Required for Enhancements & Final Claims.</p>}
                  </div>

                  {/* Cashless vs Reimbursement */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Funds Reserve (Payment Routing) <span className="text-rose-500">*</span></label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => setFundsReserve('cashless')} disabled={isSubmitted} className={`flex-1 py-2 text-xs font-bold rounded-md flex justify-center items-center gap-2 transition-all ${fundsReserve === 'cashless' ? 'bg-white text-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Banknote size={14} /> Cashless</button>
                      <button onClick={() => setFundsReserve('reimbursement')} disabled={isSubmitted} className={`flex-1 py-2 text-xs font-bold rounded-md flex justify-center items-center gap-2 transition-all ${fundsReserve === 'reimbursement' ? 'bg-white text-secondary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><User size={14} /> Reimbursement</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- 2. DATA PAYLOAD SUMMARY --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><CheckSquare className="w-4 h-4" /> FHIR Payload Preview</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                
                {/* Dynamic Value Box based on Plan Type */}
                <div className={`p-3 rounded-lg border ${selectedClaim.planType === 'Government' ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                  <p className={`text-[10px] font-bold uppercase ${selectedClaim.planType === 'Government' ? 'text-indigo-500' : 'text-slate-500'}`}>
                     {selectedClaim.planType === 'Government' ? 'HBP Package Total' : 'Total Billed (Incl. GST)'}
                  </p>
                  <p className={`font-bold mt-1 ${selectedClaim.planType === 'Government' ? 'text-indigo-900' : 'text-slate-900'}`}>{formatCurrency(selectedClaim.claimedAmount)}</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Documents</p>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5"><FileText size={12} className="text-emerald-600"/> {selectedClaim.attachedDocs.length} Verified Files</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Doctor (HPR ID)</p>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5"><Stethoscope size={12} className="text-secondary"/> {selectedClaim.clinical.hprId}</p>
                </div>
                
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Hospital (HFR ID)</p>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5"><Building size={12} className="text-secondary"/> {selectedClaim.hospital.hfrId}</p>
                </div>
                
                <div className="col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Diagnosis (ICD-10)</p>
                  <p className="font-bold text-slate-900 mt-1">{selectedClaim.clinical.primaryDiagnosis}</p>
                </div>
                
                <div className="col-span-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{selectedClaim.planType === 'Government' ? 'Government Scheme' : 'Destination Payer'}</p>
                  <p className="font-bold text-slate-900 mt-1 truncate">
                    {selectedClaim.provider.payer} <span className="font-medium text-slate-500 ml-1">({getPolicyLabel(selectedClaim.provider.payer)}: {selectedClaim.provider.policyNo})</span>
                  </p>
                </div>
                
                {/* File Manifest List */}
                <div className="col-span-4 mt-2">
                   <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Attached Evidence Manifest</p>
                   <div className="flex flex-wrap gap-2">
                      {selectedClaim.attachedDocs.map((doc, i) => (
                         <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1">
                             <CheckCircle2 size={10} /> {doc}
                         </span>
                      ))}
                   </div>
                </div>

              </div>
            </div>

            {/* --- 3. ABDM COMPLIANCE & CONSENT --- */}
            <div className={`p-5 rounded-xl border flex items-start gap-4 transition-colors ${consentGiven ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="mt-1">
                <ShieldCheck className={`w-6 h-6 ${consentGiven ? 'text-emerald-500' : 'text-rose-500'}`} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${consentGiven ? 'text-emerald-900' : 'text-rose-900'}`}>ABDM Data Privacy & Consent</p>
                <p className={`text-xs mt-1 ${consentGiven ? 'text-emerald-700' : 'text-rose-700'}`}>Under the Digital Personal Data Protection Act, explicit patient consent is required to transmit medical records over the NHCX gateway.</p>
                
                <label className="flex items-center gap-3 mt-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={consentGiven} 
                    onChange={(e) => setConsentGiven(e.target.checked)} 
                    disabled={isSubmitted}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer" 
                  />
                  <span className={`text-sm font-bold ${consentGiven ? 'text-emerald-800' : 'text-slate-700'}`}>I verify that Patient Consent (OTP / Physical Signature) is on file.</span>
                </label>
              </div>
              {!consentGiven && <Lock className="w-8 h-8 text-rose-200 opacity-50" />}
            </div>

            {/* --- 4. THE GRAND FINALE: AADHAAR E-SIGN --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-hidden relative">
              {/* Decorative background icon */}
              <PenTool className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-50 opacity-50 pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                   <PenTool className="w-4 h-4" /> Medical Officer E-Signature
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                   {/* Doctor Selection */}
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Select Treating Doctor (Signatory) <span className="text-rose-500">*</span></label>
                     <div className="relative">
                         <Stethoscope className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                         <select 
                             value={selectedDoctorHpr}
                             onChange={(e) => setSelectedDoctorHpr(e.target.value)}
                             disabled={isOtpSent || isSubmitted}
                             className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none disabled:opacity-70"
                         >
                             <option value="" disabled>Select Doctor...</option>
                             <option value={selectedClaim.clinical.hprId}>{selectedClaim.clinical.doctorName} (HPR: {selectedClaim.clinical.hprId})</option>
                             <option value="IN-DOC-999">Dr. Anjali Desai - Chief Medical Officer</option>
                         </select>
                     </div>
                   </div>

                   {/* OTP Workflow */}
                   <div className="flex gap-3">
                     {!isOtpSent ? (
                        <button 
                          onClick={handleSendOtp} 
                          disabled={!selectedDoctorHpr || isSigning}
                          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold shadow-sm transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                           {isSigning ? <Activity className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                           Request Aadhaar OTP
                        </button>
                     ) : (
                        <div className="w-full flex gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                           <div className="relative flex-1">
                             <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                             <input 
                               type="text" 
                               value={aadhaarOtp} 
                               onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                               placeholder="Enter 6-digit OTP"
                               maxLength="6"
                               disabled={isSubmitted}
                               className="w-full pl-9 pr-4 py-3 bg-white border border-emerald-300 rounded-lg text-sm font-bold tracking-widest focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-sm"
                             />
                           </div>
                           <button onClick={() => {setIsOtpSent(false); setAadhaarOtp("");}} disabled={isSubmitted} className="px-4 py-3 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                             Resend
                           </button>
                        </div>
                     )}
                   </div>
                </div>

                {!isOtpSent && (
                  <p className="text-xs text-slate-500 mt-4">
                    As per ABDM guidelines, the clinical bundle must be digitally signed by an authorized practitioner using their Aadhaar-linked HPR ID before NHCX routing.
                  </p>
                )}
                {isOtpSent && !isSubmitted && (
                   <p className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1 animate-pulse">
                     <CheckCircle2 className="w-3 h-3" /> OTP Sent to Aadhaar-linked mobile for {selectedDoctorHpr}.
                   </p>
                )}

              </div>
            </div>

          </div>
        </div>
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