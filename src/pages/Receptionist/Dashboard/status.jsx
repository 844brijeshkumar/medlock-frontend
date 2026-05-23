import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Circle,
  FileText,
  AlertCircle,
  Download,
  Eye,
  Activity,
  User,
  Hash,
  ArrowRight,
  Stethoscope,
  Landmark, // Added for Government Scheme UI
  Shield    // Added for Private Scheme UI
} from 'lucide-react';

// --- MOCK DATA: Step 5 (Post-Submission Tracking) ---
// ADDED: planType and payer to handle all Government and Private schemes
const mockClaims = [
  {
    "encounterId": "ENC-2026-0899",
    "nhcxClaimId": "NHCX-9988",
    "patientName": "Ramesh Kumar",
    "planType": "Corporate",
    "payer": "Star Health & Allied Insurance",
    "currentStatus": "Query Raised", 
    "claimedAmount": 45500,
    "timeline": [
      { "stage": "Claim Submitted", "timestamp": "2026-02-26T10:30:00Z", "completed": true, "nhcxSummary": "FHIR Bundle validated. Sent to Star Health TPA.", "buttonLabel": "View Payload", "buttonType": "secondary" },
      { "stage": "Ack Received", "timestamp": "2026-02-26T10:35:00Z", "completed": true, "nhcxSummary": "Claim ID NHCX-9988 assigned by Payer.", "buttonLabel": "View Ack", "buttonType": "secondary" },
      { 
        "stage": "Query Raised", 
        "timestamp": "2026-02-26T14:15:00Z", 
        "completed": true, 
        "isCurrent": true, 
        "nhcxSummary": "Payer has raised a query regarding the submitted documents and clinical justification.", 
      },
      { "stage": "Processing", "completed": false },
      { "stage": "Approved / Rejected", "completed": false },
      { "stage": "Settled", "completed": false }
    ]
  },
  {
    "encounterId": "ENC-2026-0850",
    "nhcxClaimId": "NHCX-1122",
    "patientName": "Vikram Singh",
    "planType": "Government",
    "payer": "CGHS (Central Government Health Scheme)",
    "currentStatus": "Settled",
    "claimedAmount": 30000,
    "timeline": [
      { "stage": "Claim Submitted", "timestamp": "2026-02-25T16:45:00Z", "completed": true, "nhcxSummary": "Sent to CGHS Portal.", "buttonLabel": "View Payload", "buttonType": "secondary" },
      { "stage": "Ack Received", "timestamp": "2026-02-25T16:50:00Z", "completed": true, "nhcxSummary": "Claim ID NHCX-1122 assigned.", "buttonLabel": "View Ack", "buttonType": "secondary" },
      { "stage": "Processing", "timestamp": "2026-02-26T08:00:00Z", "completed": true, "nhcxSummary": "In review by medical adjudicator.", "buttonLabel": "View Log", "buttonType": "secondary" },
      { "stage": "Approved", "timestamp": "2026-02-26T09:00:00Z", "completed": true, "nhcxSummary": "Approved amount: ₹30,000. Full HBP Approved.", "buttonLabel": "View Details", "buttonType": "secondary" },
      { "stage": "Settled", "timestamp": "2026-02-26T14:00:00Z", "completed": true, "isCurrent": true, "nhcxSummary": "UTR: SBIN000123456 transferred.", "buttonLabel": "Download EOR", "buttonType": "primary" }
    ]
  },
  {
    "encounterId": "ENC-2026-0912",
    "nhcxClaimId": "NHCX-3344",
    "patientName": "Sunita Sharma",
    "planType": "Government",
    "payer": "PM-JAY (Ayushman Bharat)",
    "currentStatus": "Query Raised", 
    "claimedAmount": 15000,
    "timeline": [
      { "stage": "Claim Submitted", "timestamp": "2026-02-26T18:00:00Z", "completed": true, "nhcxSummary": "Sent to PM-JAY State NHA.", "buttonLabel": "View Payload", "buttonType": "secondary" },
      { "stage": "Ack Received", "timestamp": "2026-02-26T18:05:00Z", "completed": true, "nhcxSummary": "Claim ID NHCX-3344 assigned.", "buttonLabel": "View Ack", "buttonType": "secondary" },
      { 
        "stage": "Query Raised", 
        "timestamp": "2026-02-26T19:30:00Z", 
        "completed": true, 
        "isCurrent": true, 
        "nhcxSummary": "State Auditor has requested clearer pre-surgery and post-surgery clinical photos.", 
      },
      { "stage": "Approved / Rejected", "completed": false },
      { "stage": "Settled", "completed": false }
    ]
  },
  {
    "encounterId": "ENC-2026-0945",
    "nhcxClaimId": "NHCX-7788",
    "patientName": "Arjun Desai",
    "planType": "Government",
    "payer": "Railway Health Services (IRHS)",
    "currentStatus": "Processing", 
    "claimedAmount": 22000,
    "timeline": [
      { "stage": "Claim Submitted", "timestamp": "2026-02-26T19:00:00Z", "completed": true, "nhcxSummary": "Sent to IRHS TPA.", "buttonLabel": "View Payload", "buttonType": "secondary" },
      { "stage": "Ack Received", "timestamp": "2026-02-26T19:05:00Z", "completed": true, "nhcxSummary": "Claim ID NHCX-7788 assigned.", "buttonLabel": "View Ack", "buttonType": "secondary" },
      { "stage": "Processing", "timestamp": "2026-02-26T20:30:00Z", "completed": true, "isCurrent": true, "nhcxSummary": "Referral UMID under validation.", "buttonLabel": "View Log", "buttonType": "secondary" },
      { "stage": "Approved / Rejected", "completed": false },
      { "stage": "Settled", "completed": false }
    ]
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

const formatDate = (isoString) => {
  if (!isoString) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(isoString));
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Query Raised': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Settled': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Approved': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'Processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default: return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getTimelineIcon = (stage, isCompleted) => {
  if (!isCompleted) return <Circle className="w-4 h-4 text-slate-300" />;
  if (stage.includes('Query')) return <AlertCircle className="w-4 h-4 text-white" />;
  if (stage.includes('Processing')) return <Activity className="w-4 h-4 text-white" />;
  if (stage.includes('Settled') || stage.includes('Approved')) return <CheckCircle2 className="w-4 h-4 text-white" />;
  if (stage.includes('Submitted') || stage.includes('Ack')) return <FileText className="w-4 h-4 text-white" />;
  return <CheckCircle2 className="w-4 h-4 text-white" />;
};

const getButtonIcon = (label) => {
  if (label.includes('Download')) return <Download className="w-4 h-4" />;
  return <Eye className="w-4 h-4" />;
};

export default function Step5ClaimTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaimId, setSelectedClaimId] = useState(mockClaims[0].encounterId);
  const [isSyncing, setIsSyncing] = useState(false);
  const [theme, setTheme] = useState({ primary: '#0b4f4a', secondary: '#2a9b94', accent: '#d1e8e5' });
  
  // State is now an object to support selecting BOTH Admin and Clinical
  const [queryClassification, setQueryClassification] = useState({
    admin: false,
    clinical: false
  });

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

  const filteredClaims = useMemo(() => {
    return mockClaims.filter(claim => 
      claim.encounterId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.nhcxClaimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedClaim = useMemo(() => {
    return mockClaims.find(c => c.encounterId === selectedClaimId) || mockClaims[0];
  }, [selectedClaimId]);

  // Reset classification when switching claims
  useEffect(() => {
    setQueryClassification({ admin: false, clinical: false });
  }, [selectedClaimId]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const handleAction = (label) => {
    alert(`Action: ${label}`);
  }

  // Toggle selection logic
  const toggleClassification = (type) => {
    setQueryClassification(prev => ({
        ...prev,
        [type]: !prev[type]
    }));
  };

  const handleRouteQuery = () => {
    // If BOTH or CLINICAL ONLY is selected, route to Doctor
    if (queryClassification.clinical) {
        alert("Encounter routed to Doctor's Queue.\nStatus changed to 'On Hold Clinical'.\n\nNote: Once Clinical review is approved, this will trigger the Re-billing/Admin flow.");
    } 
    // If ONLY ADMIN is selected, route to Admin/Billing
    else if (queryClassification.admin) {
        alert("Navigating to Admin Evidence Upload Page...\nStatus changed to 'Admin Query'.");
    }
  }

  const isRouteDisabled = !queryClassification.admin && !queryClassification.clinical;

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
            <Activity className="w-5 h-5 text-secondary" />
            Claim Tracker
          </h1>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Encounter, Claim ID, or Patient..." 
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
                <p className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    {/* Tiny Icon indicator in list */}
                    {claim.planType === 'Government' ? <Landmark className="w-3.5 h-3.5 text-indigo-500" /> : <Shield className="w-3.5 h-3.5 text-blue-500" />}
                    {claim.patientName}
                </p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wide ${getStatusColor(claim.currentStatus)}`}>
                  {claim.currentStatus}
                </span>
              </div>
              <div className="flex justify-between items-end text-xs text-slate-500">
                <div className="flex flex-col gap-1.5">
                  <span className="flex items-center gap-1 font-medium">
                    <Hash className="w-3.5 h-3.5" /> {claim.encounterId}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-slate-400">
                    <FileText className="w-3.5 h-3.5" /> {claim.nhcxClaimId}
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

      {/* RIGHT COLUMN: Detail Vertical Timeline */}
      <div className="flex-1 flex flex-col bg-slate-50/50 relative overflow-hidden">
        
        {/* Detail Header */}
        <div className="bg-white px-8 py-6 border-b border-slate-200 flex justify-between items-end shadow-sm z-10 flex-none">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(selectedClaim.currentStatus)}`}>
                Current Status: {selectedClaim.currentStatus}
              </span>
              
              {/* NEW: DYNAMIC SCHEME BADGE */}
              <span className={`px-2.5 py-1 rounded-full border font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                selectedClaim.planType === 'Government' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {selectedClaim.planType === 'Government' ? <Landmark className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {selectedClaim.payer || selectedClaim.planType}
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
                <span className="font-medium text-slate-700">Claim ID:</span> {selectedClaim.nhcxClaimId}
              </p>
              <p className="text-slate-500 flex items-center gap-1.5">
                <span className="font-medium text-slate-700">Total Claimed:</span> 
                <span className="font-bold text-slate-900">{formatCurrency(selectedClaim.claimedAmount)}</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSync}
            className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-secondary' : 'text-slate-500'}`} />
            {isSyncing ? 'Syncing with NHCX...' : 'Manual Sync'}
          </button>
        </div>

        {/* Timeline Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-8 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              NHCX Gateway Event Log
            </h3>
            
            <div className="relative pl-4">
              {selectedClaim.timeline.map((step, index) => {
                const isLast = index === selectedClaim.timeline.length - 1;
                
                // Determine step styles
                let dotBg = "bg-slate-100 border-slate-300";
                if (step.completed) dotBg = "bg-secondary border-secondary shadow-md";
                if (step.isCurrent) dotBg = "bg-primary border-primary ring-4 ring-accent shadow-lg";
                if (step.isCurrent && step.stage.includes('Query')) dotBg = "bg-amber-500 border-amber-600 ring-4 ring-amber-100 shadow-lg";

                return (
                  <div key={index} className="relative pb-10 last:pb-0">
                    {/* Connecting Solid Line */}
                    {!isLast && (
                      <div className={`absolute top-8 left-[15px] w-[2px] h-full -ml-[1px] ${step.completed ? 'bg-secondary/40' : 'bg-slate-200'}`}></div>
                    )}
                    
                    <div className="flex items-start gap-6">
                      {/* Timeline Dot */}
                      <div className={`relative z-10 flex-none flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${dotBg}`}>
                        {getTimelineIcon(step.stage, step.completed)}
                      </div>
                      
                      {/* Content Area */}
                      <div className={`flex-1 flex flex-col justify-between pt-1 transition-opacity duration-300 ${step.completed ? 'opacity-100' : 'opacity-50'}`}>
                        <div className="w-full">
                          <h4 className={`text-base font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                            {step.stage}
                          </h4>
                          
                          {step.completed && (
                            <>
                              <p className="text-xs font-medium text-slate-500 mt-1 mb-3">
                                {formatDate(step.timestamp)}
                              </p>
                              {step.nhcxSummary && (
                                <div className={`border rounded-lg p-3 text-sm leading-relaxed shadow-sm max-w-xl ${
                                    step.stage.includes('Query') ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                                }`}>
                                  <span className={`font-semibold mr-2 ${step.stage.includes('Query') ? 'text-amber-800' : 'text-slate-700'}`}>
                                      Gateway Response:
                                  </span>
                                  {step.nhcxSummary}
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Standard Action Button (For older steps) */}
                        {step.completed && step.buttonLabel && step.stage !== 'Query Raised' && (
                          <div className="mt-3">
                            <button 
                                onClick={() => handleAction(step.buttonLabel)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 shadow-sm w-max
                                ${step.buttonType === 'primary' 
                                  ? 'bg-primary hover:bg-primary-hover text-white font-bold ring-2 ring-transparent focus:ring-accent' 
                                  : 'bg-white border border-secondary text-secondary hover:bg-accent font-semibold'
                                }`}
                            >
                                {getButtonIcon(step.buttonLabel)}
                                {step.buttonLabel}
                            </button>
                          </div>
                        )}

                        {/* Multi-Select Classification UI for 'Query Raised' */}
                        {step.isCurrent && step.stage === 'Query Raised' && (
                          <div className="mt-5 p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-sm font-bold text-slate-800">Classify & Route Query (Select all that apply)</p>
                              <button 
                                onClick={() => alert('Downloading Query Letter (PDF)...')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-md text-xs font-bold hover:bg-slate-100 hover:text-primary transition-all shadow-sm"
                              >
                                <Download className="w-3.5 h-3.5" /> View Query Letter
                              </button>
                            </div>
                            
                            {/* Classification Options (Multi-select toggles) */}
                            <div className="flex gap-4 mb-5">
                              <button
                                onClick={() => toggleClassification('admin')}
                                className={`relative flex-1 p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                                  queryClassification.admin 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                                    : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-accent/10'
                                }`}
                              >
                                {queryClassification.admin && (
                                    <div className="absolute top-3 right-3 text-primary animate-in zoom-in duration-200">
                                        <CheckCircle2 size={18} className="fill-primary/20" />
                                    </div>
                                )}
                                <div className={`p-2 rounded-lg transition-colors ${queryClassification.admin ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="pr-6">
                                  <p className={`text-sm font-bold ${queryClassification.admin ? 'text-primary' : 'text-slate-700'}`}>Admin / Billing Query</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Missing invoices, discharge summary, ID proofs, etc.</p>
                                </div>
                              </button>
                              
                              <button
                                onClick={() => toggleClassification('clinical')}
                                className={`relative flex-1 p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                                  queryClassification.clinical 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm' 
                                    : 'border-slate-200 bg-white hover:border-primary/40 hover:bg-accent/10'
                                }`}
                              >
                                {queryClassification.clinical && (
                                    <div className="absolute top-3 right-3 text-primary animate-in zoom-in duration-200">
                                        <CheckCircle2 size={18} className="fill-primary/20" />
                                    </div>
                                )}
                                <div className={`p-2 rounded-lg transition-colors ${queryClassification.clinical ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  <Stethoscope className="w-4 h-4" />
                                </div>
                                <div className="pr-6">
                                  <p className={`text-sm font-bold ${queryClassification.clinical ? 'text-primary' : 'text-slate-700'}`}>Clinical Query</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">Medical justification, exact ICD codes, treatment rationale.</p>
                                </div>
                              </button>
                            </div>

                            {/* Smart Routing Indicator & Action */}
                            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                              <div className="text-sm font-medium">
                                {queryClassification.admin && queryClassification.clinical && (
                                    <span className="text-amber-700 flex items-center gap-1.5 animate-in fade-in">
                                        <Activity size={16} /> Routing to Doctor first for Clinical Clearance, followed by Re-billing.
                                    </span>
                                )}
                                {queryClassification.admin && !queryClassification.clinical && (
                                    <span className="text-primary flex items-center gap-1.5 animate-in fade-in">
                                        <FileText size={16} /> Routing to Document Dispatch / Admin Queue.
                                    </span>
                                )}
                                {!queryClassification.admin && queryClassification.clinical && (
                                    <span className="text-primary flex items-center gap-1.5 animate-in fade-in">
                                        <Stethoscope size={16} /> Routing to Doctor's Queue for Clinical Justification.
                                    </span>
                                )}
                              </div>
                              <button
                                disabled={isRouteDisabled}
                                onClick={handleRouteQuery}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all uppercase tracking-wide shrink-0
                                  ${!isRouteDisabled 
                                    ? 'bg-primary text-white hover:bg-primary-hover shadow-md active:scale-95' 
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                  }`}
                              >
                                Route Query <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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