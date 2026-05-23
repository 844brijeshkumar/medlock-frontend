import React, { useState, useEffect } from 'react';
import {
  Activity,
  Clock,
  User,
  Fingerprint,
  Stethoscope,
  ArrowRight,
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileDigit,
  LayoutList,
  Wallet,
  FileCheck,
  Edit,
  Navigation,
  UploadCloud,
  CornerUpLeft,
  RefreshCcw,
  Paperclip,
  Shield,
  Building,
  Send
} from 'lucide-react';

// Extended Mock Data matching the new detailed pipeline
const MOCK_ENCOUNTERS = [
  {
    encounterId: "ENC-2026-0899",
    patient: { name: "Ramesh Kumar", abhaId: "91-1234-5678-9012", aadhaar: "1234-5678-9012" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-26T10:30:00Z",
    status: "Pending Billing"
  },
  {
    encounterId: "ENC-2026-0895",
    patient: { name: "Sunita Rao", abhaId: "91-2222-3333-4444", aadhaar: "2222-3333-4444" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-26T09:45:00Z",
    status: "Billed" // Shows BOTH Edit Bill and Attach Files
  },
  {
    encounterId: "ENC-2026-0905",
    patient: { name: "Kiran Bedi", abhaId: "91-8888-7777-6666", aadhaar: "8888-7777-6666" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002", doctorId: "DR-3355" },
    date: "2026-02-26T11:20:00Z",
    status: "File Attached" 
  },
  {
    encounterId: "ENC-2026-0910",
    patient: { name: "Rahul Dravid", abhaId: "91-1010-2020-3030", aadhaar: "1010-2020-3030" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-26T12:05:00Z",
    status: "Provider Selected" 
  },
  {
    encounterId: "ENC-2026-0885",
    patient: { name: "Suresh Patel", abhaId: "91-1111-2222-3333", aadhaar: "3333-4444-5555" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-26T09:00:00Z",
    status: "Submitted"
  },
  {
    encounterId: "ENC-2026-0870",
    patient: { name: "Priya Singh", abhaId: "91-4444-5555-6666", aadhaar: "4444-5555-6666" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002", doctorId: "DR-3355" },
    date: "2026-02-25T14:20:00Z",
    status: "Admin Query"
  },
  {
    encounterId: "ENC-2026-0865",
    patient: { name: "Rajesh Khanna", abhaId: "91-3333-4444-5555", aadhaar: "3333-4444-5555" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-25T12:10:00Z",
    status: "Clinical Query Raised"
  },
  {
    encounterId: "ENC-2026-0860",
    patient: { name: "Anjali Gupta", abhaId: "91-9999-0000-1111", aadhaar: "9999-0000-1111" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002", doctorId: "DR-3355" },
    date: "2026-02-25T11:00:00Z",
    status: "Both Queries Raised"
  },
  {
    encounterId: "ENC-2026-0855",
    patient: { name: "Meena Kumari", abhaId: "91-6666-7777-8888", aadhaar: "6666-7777-8888" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002", doctorId: "DR-3355" },
    date: "2026-02-25T09:30:00Z",
    status: "On Hold Clinical"
  },
  {
    encounterId: "ENC-2026-0850",
    patient: { name: "Vikram Singh", abhaId: "91-5555-4444-3333", aadhaar: "5555-6666-7777" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-24T16:45:00Z",
    status: "Re-Passed Clinical"
  },
  {
    encounterId: "ENC-2026-0845",
    patient: { name: "Anita Desai", abhaId: "91-9876-5432-1098", aadhaar: "1112-3444-5555" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002", doctorId: "DR-3355" },
    date: "2026-02-24T10:15:00Z",
    status: "On Hold Admin"
  },
  {
    encounterId: "ENC-2026-0840",
    patient: { name: "Rohit Sharma", abhaId: "91-1212-3434-5656", aadhaar: "1212-3434-5656" },
    doctor: { name: "Dr. Sharma", hprId: "IN-DOC-001", doctorId: "DR-1001" },
    date: "2026-02-24T09:00:00Z",
    status: "File Re-Attached"
  },
  {
    encounterId: "ENC-2026-0800",
    patient: { name: "MS Dhoni", abhaId: "91-0007-0007-0007", aadhaar: "0007-0007-0007" },
    doctor: { name: "Dr. Verma", hprId: "IN-DOC-002", doctorId: "DR-3355" },
    date: "2026-02-20T14:00:00Z",
    status: "Settled"
  }
];

const TABS = [
  "All", 
  "Draft", 
  "Pending Billing", 
  "Billed",
  "File Attached", 
  "Provider Selected",
  "Submitted", 
  "Queries", 
  "On Hold Clinical", 
  "Re-Passed Clinical", 
  "On Hold Admin", 
  "File Re-Attached", 
  "Settled"
];

export default function EncounterQueueDashboard() {
  const [encounters, setEncounters] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState({ primary: '#0b4f4a', secondary: '#2a9b94', accent: '#d1e8e5' });

  useEffect(() => {
    setEncounters(MOCK_ENCOUNTERS);
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

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  const todayStr = new Date('2026-02-26').toDateString();
  const kpis = {
    totalToday: encounters.filter(e => new Date(e.date).toDateString() === todayStr).length,
    pendingBilling: encounters.filter(e => ["Pending Billing", "Re-Passed Clinical"].includes(e.status)).length,
    activeClaims: encounters.filter(e => e.status === "Submitted").length,
    settled: encounters.filter(e => e.status === "Settled").length,
  };

  const filteredEncounters = encounters.filter(e => {
    let matchesTab = false;
    if (activeTab === "All") matchesTab = true;
    else if (activeTab === "Queries") matchesTab = ["Admin Query", "Clinical Query Raised", "Both Queries Raised"].includes(e.status);
    else matchesTab = e.status === activeTab;

    const q = searchQuery.toLowerCase();
    const matchesSearch = q === "" || 
      e.patient.name.toLowerCase().includes(q) || 
      e.patient.abhaId.toLowerCase().includes(q) || 
      (e.patient.aadhaar && e.patient.aadhaar.toLowerCase().includes(q));
    
    return matchesTab && matchesSearch;
  });

  const getStatusConfig = (status) => {
    switch(status) {
      case 'Draft': return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
      case 'Pending Billing': return { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle };
      case 'Billed': return { color: 'bg-teal-50 text-teal-700 border-teal-200', icon: FileCheck };
      case 'File Attached': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Paperclip };
      case 'Provider Selected': return { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Shield };
      case 'Submitted': return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Navigation };
      case 'Admin Query': return { color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', icon: UploadCloud };
      case 'Clinical Query Raised': return { color: 'bg-red-50 text-red-700 border-red-200', icon: Stethoscope };
      case 'Both Queries Raised': return { color: 'bg-rose-100 text-rose-800 border-rose-300', icon: AlertCircle };
      case 'On Hold Clinical': return { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Clock };
      case 'Re-Passed Clinical': return { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: RefreshCcw };
      case 'On Hold Admin': return { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Clock };
      case 'File Re-Attached': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Paperclip };
      case 'Settled': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
      default: return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Activity };
    }
  };

  const handleAction = (actionType, encounterId) => {
    if (actionType === "ROUTE_TO_DOCTOR") {
      setEncounters(prev => prev.map(enc => enc.encounterId === encounterId ? { ...enc, status: "On Hold Clinical" } : enc));
      alert(`Encounter ${encounterId} routed to Doctor's queue. Status changed to "On Hold Clinical".`);
    } else {
      alert(`Navigating to [${actionType}] page for Encounter: ${encounterId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans" style={{ '--primary': theme.primary, '--secondary': theme.secondary, '--accent': theme.accent }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <LayoutList className="w-8 h-8" />
            Encounter & Claims Queue
          </h1>
          <p className="text-gray-500 mt-1">Manage billing pipelines and track NHCX claims from clinical sign-off to settlement.</p>
        </div>

        {/* 1. KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-accent/50 rounded-xl text-primary"><Activity size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Today</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalToday}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-amber-400"></div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600"><AlertCircle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Action Required</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.pendingBilling}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><FileDigit size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Active Claims</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.activeClaims}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><Wallet size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Settled Claims</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.settled}</p>
            </div>
          </div>
        </div>

        {/* 2. Main Queue Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          
          {/* Filters & Search Bar */}
          <div className="border-b border-gray-200 bg-gray-50/50 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 lg:pb-0">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-accent hover:text-primary hover:border-primary/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Name, ABHA, or Aadhaar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm bg-white"
              />
            </div>
          </div>

          {/* List/Queue Container */}
          <div className="p-4 space-y-3">
            {filteredEncounters.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <LayoutList className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No encounters found for "{activeTab}"</p>
              </div>
            ) : (
              filteredEncounters.map((enc) => {
                const StatusIcon = getStatusConfig(enc.status).icon;
                const dt = formatDateTime(enc.date);
                
                return (
                  <div 
                    key={enc.encounterId} 
                    className="group bg-white border border-gray-200 rounded-xl p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all duration-300 hover:shadow-md hover:border-primary/40"
                  >
                    
                    {/* Encounter & Patient Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      
                      {/* Patient Details (Col 1-4) */}
                      <div className="md:col-span-4 flex items-start gap-3">
                        <div className="p-2 bg-accent/30 rounded-full text-primary mt-0.5">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{enc.patient.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                            <Fingerprint size={12} className="text-secondary" />
                            <span>ABHA: <span className="font-mono text-gray-600">{enc.patient.abhaId}</span></span>
                          </div>
                          {enc.patient.aadhaar && (
                            <p className="text-[10px] text-gray-400 mt-0.5">Aadhaar: <span className="font-mono">{enc.patient.aadhaar}</span></p>
                          )}
                        </div>
                      </div>

                      {/* Encounter & Time (Col 5-8) */}
                      <div className="md:col-span-4 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                        <p className="text-xs text-gray-500 font-mono mb-0.5">ID: <span className="font-bold text-gray-700">{enc.encounterId}</span></p>
                        <p className="text-sm text-gray-900">{dt.date}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} /> {dt.time}
                        </p>
                      </div>

                      {/* Doctor Details (Col 9-12) */}
                      <div className="md:col-span-4 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                          <Stethoscope size={14} className="text-secondary" />
                          {enc.doctor.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-mono">HPR: {enc.doctor.hprId} | ID: {enc.doctor.doctorId}</p>
                      </div>
                    </div>

                    {/* Status & Actions Area */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 min-w-[200px]">
                      
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusConfig(enc.status).color}`}>
                        <StatusIcon size={14} />
                        {enc.status}
                      </span>

                      {/* Dynamic Action Button Logic */}
                      <div className="w-full lg:w-auto">
                        
                        {enc.status === "Pending Billing" && (
                          <button onClick={() => handleAction("START_BILLING", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-secondary rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            Start Billing <ArrowRight size={14} />
                          </button>
                        )}

                        {/* NEW: Billed Status now has BOTH Edit and Attach buttons side by side */}
                        {enc.status === "Billed" && (
                          <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2">
                            <button onClick={() => handleAction("EDIT_BILL", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-secondary hover:bg-secondary/90 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                              <Edit size={14} /> Edit Bill
                            </button>
                            <button onClick={() => handleAction("ATTACH_FILES", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                              <UploadCloud size={14} /> Attach Files
                            </button>
                          </div>
                        )}

                        {enc.status === "File Attached" && (
                          <button onClick={() => handleAction("ROUTE_PROVIDER", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <Building size={14} /> Select Provider
                          </button>
                        )}

                        {enc.status === "Provider Selected" && (
                          <button onClick={() => handleAction("SUBMIT_CLAIM", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <Send size={14} /> Submit to NHCX
                          </button>
                        )}

                        {enc.status === "Submitted" && (
                          <button onClick={() => handleAction("TRACK_CLAIM", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-primary border-2 border-primary hover:bg-accent rounded-lg transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5 bg-white">
                            <Navigation size={14} /> Track Claim
                          </button>
                        )}

                        {enc.status === "Re-Passed Clinical" && (
                          <button onClick={() => handleAction("RE_BILLING", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <RefreshCcw size={14} /> Re-Billing
                          </button>
                        )}

                        {enc.status === "Admin Query" && (
                          <button onClick={() => handleAction("UPLOAD_EVIDENCE", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-fuchsia-600 hover:bg-fuchsia-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <UploadCloud size={14} /> Resubmit Evidence
                          </button>
                        )}

                        {(enc.status === "Clinical Query Raised" || enc.status === "Both Queries Raised") && (
                          <button onClick={() => handleAction("ROUTE_TO_DOCTOR", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <CornerUpLeft size={14} /> Route to Doctor
                          </button>
                        )}

                        {enc.status === "File Re-Attached" && (
                          <button onClick={() => handleAction("VIEW_PROVIDER", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <Send size={14} /> View Provider
                          </button>
                        )}

                        {/* Read Only States */}
                        {(enc.status === "Draft" || enc.status === "On Hold Clinical" || enc.status === "On Hold Admin") && (
                          <button disabled className="w-full lg:w-auto px-4 py-2 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5">
                            <Clock size={14} /> {enc.status === "On Hold Admin" ? "Awaiting Dispatch" : "Awaiting Clinical"}
                          </button>
                        )}

                        {enc.status === "Settled" && (
                          <button className="w-full lg:w-auto px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-lg transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <FileText size={14} /> View Invoice
                          </button>
                        )}

                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background-color: #94a3b8; }
      `}} />
    </div>
  );
}