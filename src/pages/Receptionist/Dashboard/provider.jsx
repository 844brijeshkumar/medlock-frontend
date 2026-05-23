import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Activity,
  User,
  Hash,
  Shield,
  Send,
  Check,
  Building,
  CreditCard,
  Briefcase,
  Network,
  CarFront,
  Baby,
  PlusCircle,
  Users,
  Fingerprint,
  RefreshCw,
  Landmark // <-- NEW: Added Landmark icon for Government
} from 'lucide-react';

// --- MOCK DATA: Step 4 (Provider Selection & Review) ---
const mockClaimsReadyForRouting = [
  {
    "encounterId": "ENC-2026-0895",
    "patientName": "Sunita Rao",
    "currentStatus": "Files Attached",
    "claimedAmount": 45000,
    "defaultPayer": "", 
    "planType": "Retail", 
    "policyNumber": "", 
    "employeeId": "",
    "attachedDocs": ["Clinical Notes", "Lab Report", "Final Stamped Invoice"]
  },
  {
    "encounterId": "ENC-2026-0840",
    "patientName": "Col. Rohit Sharma (Retd)", // <-- NEW: ECHS Government Mock Data
    "currentStatus": "File Re-Attached", 
    "claimedAmount": 35000,
    "defaultPayer": "ECHS (Ex-Servicemen Contributory Health Scheme)",
    "planType": "Government",
    "policyNumber": "ECHS-556677",
    "employeeId": "",
    "attachedDocs": ["Government Referral Memo", "Updated Clinical Notes", "Final Stamped Invoice"]
  },
  {
    "encounterId": "ENC-2026-0860",
    "patientName": "Anil Kapoor",
    "currentStatus": "Files Attached",
    "claimedAmount": 48500,
    "defaultPayer": "HDFC Ergo General Insurance", 
    "planType": "Retail",
    "policyNumber": "HDFC-POL-998877", 
    "employeeId": "",
    "attachedDocs": ["Discharge Summary", "Pharmacy Bills", "Final Stamped Invoice"]
  },
  {
    "encounterId": "ENC-2026-0912",
    "patientName": "Sunita Sharma",
    "currentStatus": "Incomplete Files",
    "claimedAmount": 15000,
    "defaultPayer": "ICICI Lombard",
    "planType": "Corporate", 
    "policyNumber": "ICI-CORP-4455",
    "employeeId": "EMP-9921", 
    "attachedDocs": ["Clinical Notes"] 
  }
];

const PAYER_LIST = [
  "Star Health & Allied Insurance",
  "HDFC Ergo General Insurance",
  "ICICI Lombard",
  "Niva Bupa Health Insurance",
  "Care Health Insurance",
  "SBI General Insurance"
];

// --- NEW: Government Scheme Master List ---
const GOVT_SCHEME_LIST = [
  "PM-JAY (Ayushman Bharat)",
  "CGHS (Central Government Health Scheme)",
  "ECHS (Ex-Servicemen Contributory Health Scheme)",
  "ESIC (Employees' State Insurance Corporation)",
  "Railway Health Services (IRHS)",
  "State Scheme (e.g., Aarogyasri, MJPJAY)"
];

const TPA_LIST = [
  "Medi Assist India TPA", 
  "Family Health Plan (FHPL)", 
  "MDIndia Health Insurance TPA", 
  "Paramount Health Services", 
  "HealthIndia TPA"
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
    case 'Files Attached': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'File Re-Attached': return 'bg-orange-100 text-orange-800 border-orange-200'; 
    case 'Incomplete Files': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function ProviderRoutingStep() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState(mockClaimsReadyForRouting[0].encounterId);
  const [theme, setTheme] = useState({ primary: '#0b4f4a', secondary: '#2a9b94', accent: '#d1e8e5' });
  
  // Base Form State (Now includes 'Government')
  const [selectedPayer, setSelectedPayer] = useState("");
  const [planType, setPlanType] = useState("Retail");
  const [policyNumber, setPolicyNumber] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  
  // Subscriber Relationship State
  const [relationshipToSubscriber, setRelationshipToSubscriber] = useState("Self");
  const [subscriberName, setSubscriberName] = useState("");
  const [subscriberAadhaar, setSubscriberAadhaar] = useState(""); 

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optional Conditions State
  const [hasTPA, setHasTPA] = useState(false);
  const [selectedTPA, setSelectedTPA] = useState("");

  const [isMLC, setIsMLC] = useState(false);
  const [mlcDetails, setMlcDetails] = useState({ firNumber: "", policeStation: "", cause: "" });
  
  const [isMaternity, setIsMaternity] = useState(false);
  const [maternityDetails, setMaternityDetails] = useState({ deliveryDate: "", deliveryType: "Normal", livingChildren: "" });

  useEffect(() => {
    try {
      const cachedPrimary = localStorage.getItem('theme-primary');
      if (cachedPrimary) {
        setTheme({
          primary: cachedPrimary,
          secondary: localStorage.getItem('theme-secondary') || '#2a9b94',
          accent: localStorage.getItem('theme-accent') || '#d1e8e5'
        });
      }
    } catch (e) { console.warn("Theme load failed."); }
  }, []);

  // Derived state
  const filteredClaims = useMemo(() => {
    return mockClaimsReadyForRouting.filter(claim => 
      claim.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedClaim = useMemo(() => {
    return mockClaimsReadyForRouting.find(c => c.encounterId === selectedClaimId) || mockClaimsReadyForRouting[0];
  }, [selectedClaimId]);

  // Reset form when clicking a different claim on the left
  useEffect(() => {
    if (selectedClaim) {
      setSelectedPayer(selectedClaim.defaultPayer || "");
      setPlanType(selectedClaim.planType || "Retail");
      setPolicyNumber(selectedClaim.policyNumber || "");
      setEmployeeId(selectedClaim.employeeId || "");
      
      // Reset relationship
      setRelationshipToSubscriber("Self");
      setSubscriberName("");
      setSubscriberAadhaar(""); 

      // Reset optional toggles
      setHasTPA(false); setSelectedTPA("");
      setIsMLC(false); setMlcDetails({ firNumber: "", policeStation: "", cause: "" });
      setIsMaternity(false); setMaternityDetails({ deliveryDate: "", deliveryType: "Normal", livingChildren: "" });
    }
  }, [selectedClaimId, selectedClaim]);

  // Reset selected payer if plan type is manually toggled to prevent mismatches
  useEffect(() => {
    if (selectedClaim && planType !== selectedClaim.planType) {
        setSelectedPayer("");
        setPolicyNumber("");
    }
  }, [planType]);

  // --- NEW: Dynamic UI Generators ---
  const activePayerList = planType === 'Government' ? GOVT_SCHEME_LIST : PAYER_LIST;

  const getPolicyLabel = () => {
    if (planType !== 'Government') return "Policy Number / Member ID";
    if (selectedPayer.includes("PM-JAY")) return "Ayushman Card Number (ABHA Linked)";
    if (selectedPayer.includes("CGHS")) return "CGHS Beneficiary Card Number";
    if (selectedPayer.includes("ECHS")) return "ECHS 64KB Smart Card Number";
    if (selectedPayer.includes("ESIC")) return "ESIC IP Number / Pehchan Card";
    if (selectedPayer.includes("Railway")) return "Railway UMID Number";
    return "Government Scheme Beneficiary ID";
  };

  const getPolicyPlaceholder = () => {
    if (planType !== 'Government') return "Enter Policy ID...";
    if (selectedPayer.includes("PM-JAY")) return "e.g. P1234567890";
    if (selectedPayer.includes("ECHS")) return "Enter Smart Card No...";
    return "Enter Scheme ID...";
  };

  // --- Dynamic Validation ---
  const isBaseValid = selectedPayer.trim() !== "" && policyNumber.trim() !== "";
  const isCorporateValid = planType === 'Corporate' ? employeeId.trim() !== "" : true; 
  const isTpaValid = (hasTPA && planType !== 'Government') ? selectedTPA.trim() !== "" : true;
  
  const isSubscriberValid = relationshipToSubscriber !== "Self" 
    ? subscriberName.trim() !== "" && subscriberAadhaar.trim().length >= 12 
    : true;

  const isMlcValid = isMLC ? mlcDetails.firNumber.trim() !== "" && mlcDetails.policeStation.trim() !== "" : true;
  const isMaternityValid = isMaternity ? maternityDetails.deliveryDate.trim() !== "" : true;

  const isFormValid = isBaseValid && isCorporateValid && isTpaValid && isSubscriberValid && isMlcValid && isMaternityValid;

  // --- Submit Handlers ---
  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`SUCCESS: Claim ${selectedClaim.encounterId}\nProvider: ${selectedPayer}\nID Ref: ${policyNumber}\n\nNHCX FHIR Bundle Generated. Moving to Step 5 (Preview)`);
    }, 1500);
  };

  const handleReClaim = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`RE-CLAIM SUCCESS: Encounter ${selectedClaim.encounterId}\n\nUpdated evidence attached and resubmitted to ${selectedPayer}.\n\nNHCX Status updated to: PROCESSING`);
    }, 1500);
  };

  return (
    <div 
      className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans antialiased text-slate-900"
      style={{
        '--primary': theme.primary,
        '--primary-hover': '#083b37',
        '--secondary': theme.secondary,
        '--accent': theme.accent,
      }}
    >

      {/* LEFT COLUMN: Master List */}
      <div className="w-1/3 min-w-[320px] max-w-[400px] bg-white border-r border-slate-200 flex flex-col z-10 shadow-sm">
        <div className="p-4 border-b border-slate-200 bg-white sticky top-0">
          <h1 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            Provider Routing
          </h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Encounter or Patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
            />
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
                    <User size={14} className="text-primary"/> {claim.patientName}
                </p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wide flex items-center gap-1 ${getStatusColor(claim.currentStatus)}`}>
                  {(claim.currentStatus === 'Files Attached' || claim.currentStatus === 'File Re-Attached') ? <CheckCircle2 size={10} /> : <AlertCircle size={10}/>}
                  {claim.currentStatus}
                </span>
              </div>
              <div className="flex justify-between items-end text-xs text-slate-500">
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Hash className="w-3.5 h-3.5" /> {claim.encounterId}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-400">
                    <FileText className="w-3.5 h-3.5" /> {claim.attachedDocs.length} Docs Attached
                  </span>
                </div>
                <span className="font-semibold text-slate-700 mb-0.5">
                  {formatCurrency(claim.claimedAmount)}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-10 text-slate-500 text-sm">
              No claims found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Detail Panel */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
        
        {/* Detail Header */}
        <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-end shadow-sm z-10 flex-none">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(selectedClaim.currentStatus)}`}>
                Status: {selectedClaim.currentStatus}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <User className="w-6 h-6 text-slate-400" />
              {selectedClaim.patientName}
            </h2>
            <div className="flex gap-6 mt-3 text-sm">
              <p className="text-slate-500 flex items-center gap-1.5">
                <span className="font-medium text-slate-700">Encounter:</span> {selectedClaim.encounterId}
              </p>
              <p className="text-slate-500 flex items-center gap-1.5">
                <span className="font-medium text-slate-700">Total Claimed:</span> 
                <span className="font-bold text-slate-900">{formatCurrency(selectedClaim.claimedAmount)}</span>
              </p>
            </div>
          </div>
          
          {/* Dynamic Action Button (Submit vs Re-Claim) */}
          {selectedClaim.currentStatus === 'File Re-Attached' ? (
            <button 
              onClick={handleReClaim}
              disabled={!isFormValid || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-md transition-all uppercase tracking-wide
                  ${(isFormValid && !isSubmitting)
                      ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }
              `}
            >
              {isSubmitting ? (
                <><Activity className="w-4 h-4 animate-spin" /> Processing...</>
              ) : (
                <><RefreshCw className="w-4 h-4" /> Re-Claim NHCX</>
              )}
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={!isFormValid || selectedClaim.currentStatus === 'Incomplete Files' || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold shadow-md transition-all uppercase tracking-wide
                  ${(isFormValid && selectedClaim.currentStatus === 'Files Attached' && !isSubmitting)
                      ? 'bg-primary hover:bg-primary-hover text-white active:scale-95' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }
              `}
            >
              {isSubmitting ? (
                <><Activity className="w-4 h-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-4 h-4" /> Submit & Preview</>
              )}
            </button>
          )}
        </div>

        {/* Action Form Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8 pb-12">
            
            {/* --- SECTION 1: Provider & Policy Form --- */}
            <div className={`p-8 rounded-2xl border-2 shadow-sm transition-colors ${isBaseValid && isCorporateValid && isTpaValid && isSubscriberValid ? 'border-secondary/50 bg-white' : 'border-slate-200 bg-white'}`}>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Route to Insurance / Scheme Provider
                </h3>

                {/* Plan Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-3">
                      NHCX Claim Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-3">
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${planType === 'Retail' ? 'border-secondary bg-slate-50 shadow-sm ring-1 ring-secondary/30' : 'border-slate-200 hover:bg-slate-50/50'}`}>
                          <input 
                            type="radio" name="planType" value="Retail" 
                            checked={planType === 'Retail'} onChange={(e) => setPlanType(e.target.value)}
                            className="w-4 h-4 accent-secondary"
                          />
                          <span className={`text-sm font-bold ${planType === 'Retail' ? 'text-secondary' : 'text-slate-600'}`}>Retail / Private</span>
                      </label>
                      
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${planType === 'Corporate' ? 'border-primary bg-slate-50 shadow-sm ring-1 ring-primary/30' : 'border-slate-200 hover:bg-slate-50/50'}`}>
                          <input 
                            type="radio" name="planType" value="Corporate" 
                            checked={planType === 'Corporate'} onChange={(e) => setPlanType(e.target.value)}
                            className="w-4 h-4 accent-primary"
                          />
                          <span className={`text-sm font-bold ${planType === 'Corporate' ? 'text-primary' : 'text-slate-600'}`}>Corporate Group</span>
                      </label>

                      {/* NEW: Government / Scheme Selection */}
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${planType === 'Government' ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-1 ring-indigo-600/30' : 'border-slate-200 hover:bg-slate-50/50'}`}>
                          <input 
                            type="radio" name="planType" value="Government" 
                            checked={planType === 'Government'} onChange={(e) => setPlanType(e.target.value)}
                            className="w-4 h-4 accent-indigo-600"
                          />
                          <span className={`text-sm font-bold flex items-center gap-1 ${planType === 'Government' ? 'text-indigo-700' : 'text-slate-600'}`}>
                            <Landmark className="w-4 h-4" /> Government
                          </span>
                      </label>
                  </div>
                </div>

                {/* Payer Selection */}
                <div className="grid grid-cols-1 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        {planType === 'Government' ? 'Select Scheme / Ministry' : 'Destination Payer (Insurance Co.)'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <Shield className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${planType === 'Government' ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <select 
                            value={selectedPayer}
                            onChange={(e) => setSelectedPayer(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary appearance-none shadow-sm"
                        >
                            <option value="" disabled>Select Provider / Scheme...</option>
                            {activePayerList.map(payer => (
                                <option key={payer} value={payer}>{payer}</option>
                            ))}
                        </select>
                    </div>
                  </div>

                  {/* TPA Toggle (Hidden for Government Schemes) */}
                  {planType !== 'Government' && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={hasTPA} 
                          onChange={(e) => setHasTPA(e.target.checked)} 
                          className="w-5 h-5 rounded text-secondary focus:ring-secondary border-slate-300 cursor-pointer" 
                        />
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Network className="w-4 h-4 text-slate-400" /> Route via TPA (Third Party Administrator)?
                        </span>
                      </label>
                      
                      {hasTPA && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select TPA <span className="text-rose-500">*</span></label>
                          <select 
                              value={selectedTPA} 
                              onChange={(e) => setSelectedTPA(e.target.value)} 
                              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-secondary shadow-sm"
                          >
                              <option value="" disabled>Select TPA...</option>
                              {TPA_LIST.map(tpa => <option key={tpa} value={tpa}>{tpa}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Dynamic Policy/ID Number Input */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        {getPolicyLabel()} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                        <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text"
                            value={policyNumber}
                            onChange={(e) => setPolicyNumber(e.target.value)}
                            placeholder={getPolicyPlaceholder()}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary shadow-sm"
                        />
                    </div>
                    {/* Helper text for common government schemes */}
                    {planType === 'Government' && selectedPayer.includes('CGHS') && (
                        <p className="text-[11px] text-amber-600 font-bold mt-2 flex items-center gap-1">
                          <FileText className="w-3 h-3"/> Ensure Referral Memo is attached below.
                        </p>
                    )}
                  </div>

                  {/* Employee ID Input (Corporate Only) */}
                  {planType === 'Corporate' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                          Employee / Group ID <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                          <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                              type="text"
                              value={employeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              placeholder="Enter Employee ID..."
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary shadow-sm"
                          />
                      </div>
                    </div>
                  )}
                </div>

                {/* Subscriber Relationship Section */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Patient's Relationship to Policyholder <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        {['Self', 'Spouse', 'Child', 'Parent', 'Other'].map(rel => (
                            <button
                                key={rel}
                                onClick={() => setRelationshipToSubscriber(rel)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    relationshipToSubscriber === rel 
                                      ? 'bg-secondary text-white shadow-sm' 
                                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {rel}
                            </button>
                        ))}
                    </div>

                    {/* Show Subscriber inputs if patient is NOT the policyholder */}
                    {relationshipToSubscriber !== 'Self' && (
                        <div className="animate-in fade-in slide-in-from-top-2 grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Primary Policyholder Name <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={subscriberName}
                                        onChange={(e) => setSubscriberName(e.target.value)}
                                        placeholder="Full name of insured..."
                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-secondary shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Policyholder Govt ID (Aadhaar/PAN) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <Fingerprint className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input 
                                        type="text"
                                        value={subscriberAadhaar}
                                        onChange={(e) => setSubscriberAadhaar(e.target.value.replace(/\D/g, ''))} // Numeric only
                                        placeholder="Enter 12-digit ID..."
                                        maxLength="12"
                                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-secondary shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Validation Warning */}
                {(!isBaseValid || !isCorporateValid || !isTpaValid || !isSubscriberValid) && (
                    <div className="mt-5 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-700 font-medium">
                            Please fill all required <span className="text-rose-500 font-bold">*</span> fields in this section to route the claim.
                        </p>
                    </div>
                )}
            </div>


            {/* --- SECTION 2: OPTIONAL REGULATORY (MLC / Maternity) --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Special Conditions & Regulatory (Optional)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* MLC / Accident Card */}
                <div className={`border-2 rounded-xl p-5 transition-colors ${isMLC ? 'border-amber-300 bg-amber-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                  <label className="flex items-center gap-3 cursor-pointer mb-1">
                    <input 
                      type="checkbox" 
                      checked={isMLC} 
                      onChange={(e) => setIsMLC(e.target.checked)} 
                      className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500 border-slate-300 cursor-pointer" 
                    />
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <CarFront className={`w-4 h-4 ${isMLC ? 'text-amber-500' : 'text-slate-400'}`} /> Medico-Legal / Accident Case
                    </span>
                  </label>
                  
                  {isMLC && (
                    <div className="mt-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">FIR Number <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          value={mlcDetails.firNumber} 
                          onChange={e => setMlcDetails({...mlcDetails, firNumber: e.target.value})} 
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white" 
                          placeholder="e.g. FIR-2026/899" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Police Station <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          value={mlcDetails.policeStation} 
                          onChange={e => setMlcDetails({...mlcDetails, policeStation: e.target.value})} 
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white" 
                          placeholder="Name of PS" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Cause of Injury</label>
                        <input 
                          type="text" 
                          value={mlcDetails.cause} 
                          onChange={e => setMlcDetails({...mlcDetails, cause: e.target.value})} 
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 bg-white" 
                          placeholder="RTA, Fall, etc." 
                        />
                      </div>
                      {!isMlcValid && <p className="text-[10px] font-bold text-rose-500">Required fields missing.</p>}
                    </div>
                  )}
                </div>

                {/* Maternity Card */}
                <div className={`border-2 rounded-xl p-5 transition-colors ${isMaternity ? 'border-fuchsia-300 bg-fuchsia-50/30' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                  <label className="flex items-center gap-3 cursor-pointer mb-1">
                    <input 
                      type="checkbox" 
                      checked={isMaternity} 
                      onChange={(e) => setIsMaternity(e.target.checked)} 
                      className="w-5 h-5 rounded text-fuchsia-500 focus:ring-fuchsia-500 border-slate-300 cursor-pointer" 
                    />
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Baby className={`w-4 h-4 ${isMaternity ? 'text-fuchsia-500' : 'text-slate-400'}`} /> Maternity Claim
                    </span>
                  </label>
                  
                  {isMaternity && (
                    <div className="mt-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Delivery <span className="text-rose-500">*</span></label>
                        <input 
                          type="date" 
                          value={maternityDetails.deliveryDate} 
                          onChange={e => setMaternityDetails({...maternityDetails, deliveryDate: e.target.value})} 
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 bg-white text-slate-700" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Delivery Type</label>
                          <select 
                            value={maternityDetails.deliveryType} 
                            onChange={e => setMaternityDetails({...maternityDetails, deliveryType: e.target.value})} 
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 bg-white"
                          >
                            <option>Normal</option>
                            <option>C-Section</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Living Children</label>
                          <input 
                            type="number" 
                            min="0" 
                            value={maternityDetails.livingChildren} 
                            onChange={e => setMaternityDetails({...maternityDetails, livingChildren: e.target.value})} 
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-fuchsia-400 focus:ring-1 focus:ring-fuchsia-400 bg-white" 
                            placeholder="e.g. 1" 
                          />
                        </div>
                      </div>
                      {!isMaternityValid && <p className="text-[10px] font-bold text-rose-500">Required fields missing.</p>}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* --- SECTION 3: File Verification Summary --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Bundle Contents Summary
              </h3>

              {selectedClaim.currentStatus === 'Incomplete Files' ? (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                          <p className="text-sm font-bold text-rose-800">Cannot Submit: Missing Documents</p>
                          <p className="text-xs font-medium text-rose-700 mt-1">This encounter is missing mandatory NHCX files based on your scheme selection. Please attach missing files before proceeding.</p>
                      </div>
                  </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedClaim.attachedDocs.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-emerald-100 bg-emerald-50 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span className="font-semibold text-sm text-emerald-900">{doc}</span>
                        </div>
                    ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />
    </div>
  );
}