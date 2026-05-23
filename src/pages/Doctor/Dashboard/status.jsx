import React, { useState, useEffect } from 'react';
import {
  Activity,
  Clock,
  User,
  Fingerprint,
  Stethoscope,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  FileDigit,
  LayoutList,
  Edit,
  Navigation,
  RefreshCcw,
  Download,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

// Mock Data strictly for Doctor's view
const MOCK_DOCTOR_ENCOUNTERS = [
  {
    encounterId: "ENC-2026-0900",
    patient: { name: "Anita Desai", abhaId: "91-9876-5432-1098", aadhaar: "1112-3444-5555" },
    date: "2026-02-26T11:15:00Z",
    status: "Draft"
  },
  {
    encounterId: "ENC-2026-0899",
    patient: { name: "Ramesh Kumar", abhaId: "91-1234-5678-9012", aadhaar: "1234-5678-9012" },
    date: "2026-02-26T10:30:00Z",
    status: "Draft"
  },
  {
    encounterId: "ENC-2026-0885",
    patient: { name: "Suresh Patel", abhaId: "91-1111-2222-3333", aadhaar: "3333-4444-5555" },
    date: "2026-02-26T09:00:00Z",
    status: "Submitted" // Locked for Doctor
  },
  {
    encounterId: "ENC-2026-0865",
    patient: { name: "Rajesh Khanna", abhaId: "91-3333-4444-5555", aadhaar: "3333-4444-5555" },
    date: "2026-02-25T12:10:00Z",
    status: "Query Raised",
    queryNote: "Missing justification for Daycare procedure. Please add ICD code for secondary diagnosis."
  },
  {
    encounterId: "ENC-2026-0850",
    patient: { name: "Vikram Singh", abhaId: "91-5555-4444-3333", aadhaar: "5555-6666-7777" },
    date: "2026-02-24T16:45:00Z",
    status: "Re-Submitted" // Locked for Doctor
  }
];

const TABS = ["All", "Draft", "Query Raised", "Submitted", "Re-Submitted"];

export default function DoctorWorkspaceDashboard() {
  const [encounters, setEncounters] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState({
    primary: '#0b4f4a',
    secondary: '#2a9b94',
    accent: '#d1e8e5'
  });

  useEffect(() => {
    // Simulate API fetch
    setEncounters(MOCK_DOCTOR_ENCOUNTERS);

    // Dynamic Theming: Fetch from local cache or fallback
    try {
      const cachedPrimary = localStorage.getItem('theme-primary');
      if (cachedPrimary) {
        setTheme({
          primary: cachedPrimary || '#0b4f4a',
          secondary: localStorage.getItem('theme-secondary') || '#2a9b94',
          accent: localStorage.getItem('theme-accent') || '#d1e8e5'
        });
      }
    } catch (e) {
      console.warn("Could not load theme from cache, using defaults.");
    }
  }, []);

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
  };

  // Derived KPIs for the Doctor
  const todayStr = new Date('2026-02-26').toDateString(); // Hardcoded for mock context
  const kpis = {
    pendingDrafts: encounters.filter(e => e.status === "Draft").length,
    actionRequired: encounters.filter(e => e.status === "Query Raised").length,
    completedToday: 14, // Typically fetched from backend (count of 'Submitted' today)
  };

  // Filter Logic
  const filteredEncounters = encounters.filter(e => {
    const matchesTab = activeTab === "All" || e.status === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = q === "" || 
      e.patient.name.toLowerCase().includes(q) || 
      e.encounterId.toLowerCase().includes(q);
    
    return matchesTab && matchesSearch;
  });

  // Doctor-Specific Status Badge Configuration
  const getStatusConfig = (status) => {
    switch(status) {
      case 'Draft': return { color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
      case 'Submitted': return { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 };
      case 'Query Raised': return { color: 'bg-red-50 text-red-700 border-red-200', icon: AlertTriangle };
      case 'Re-Submitted': return { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Navigation };
      default: return { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: Activity };
    }
  };

  // Action Handler
  const handleAction = (actionType, encounterId) => {
    if (actionType === "CREATE_NEW") {
      alert("Opening blank Clinical Suite...");
    } else {
      alert(`Loading Clinical Suite for Encounter: ${encounterId}`);
      // router.push(`/clinical-suite/${encounterId}`)
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8 font-sans"
      style={{
        '--primary': theme.primary,
        '--secondary': theme.secondary,
        '--accent': theme.accent,
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Stethoscope className="w-8 h-8" />
              Clinical Workspace
            </h1>
            <p className="text-gray-500 mt-1">Manage your drafts and respond to clinical queries.</p>
          </div>
          <button 
            onClick={() => handleAction("CREATE_NEW")}
            className="px-6 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <PlusCircle size={18} /> New Encounter
          </button>
        </div>

        {/* 1. Doctor KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-xl text-slate-600"><Clock size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.pendingDrafts}</p>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
            <div className="p-3 bg-red-50 rounded-xl text-red-600"><AlertTriangle size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Action Required</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.actionRequired}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><CheckCircle2 size={24} /></div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.completedToday}</p>
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
                placeholder="Search Name or ID..."
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
                    className={`group bg-white border rounded-xl p-4 lg:p-5 flex flex-col transition-all duration-300 hover:shadow-md ${
                      enc.status === 'Query Raised' ? 'border-red-200 hover:border-red-400' : 'border-gray-200 hover:border-primary/40'
                    }`}
                  >
                    
                    {/* Top Row: Info & Action */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                      
                      {/* Patient & Enc Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-5 flex items-start gap-3">
                          <div className="p-2 bg-accent/30 rounded-full text-primary mt-0.5">
                            <User size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{enc.patient.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                              <Fingerprint size={12} className="text-secondary" />
                              <span>ABHA: <span className="font-mono text-gray-600">{enc.patient.abhaId}</span></span>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-4 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100">
                          <p className="text-xs text-gray-500 font-mono mb-0.5">ID: <span className="font-bold text-gray-700">{enc.encounterId}</span></p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock size={12} /> {dt.date} at {dt.time}
                          </p>
                        </div>
                        
                        {/* Status Badge in middle for Doctor */}
                        <div className="md:col-span-3 flex justify-start md:justify-end">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusConfig(enc.status).color}`}>
                            <StatusIcon size={14} />
                            {enc.status}
                          </span>
                        </div>
                      </div>

                      {/* Dynamic Action Button Area */}
                      <div className="w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                        
                        {enc.status === "Draft" && (
                          <button onClick={() => handleAction("EDIT_CLINICAL", enc.encounterId)} className="w-full lg:w-auto px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5">
                            <Edit size={14} /> Edit Clinical Data
                          </button>
                        )}

                        {enc.status === "Query Raised" && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            <button 
                            onClick={() => handleAction("DOWNLOAD_QUERY", enc.encounterId)} 
                            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5"
                            >
                            <Download size={14} /> Download Query
                            </button>
                            
                            <button 
                            onClick={() => handleAction("FIX_QUERY", enc.encounterId)} 
                            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 group-hover:-translate-y-0.5"
                            >
                            <PlusCircle size={14} /> Add Clinical Data
                            </button>
                        </div>
                        )}

                        {/* Locked States for Doctor */}
                        {(enc.status === "Submitted" || enc.status === "Re-Submitted") && (
                          <button disabled className="w-full lg:w-auto px-4 py-2 text-xs font-medium text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed flex items-center justify-center gap-1.5 border border-gray-100">
                            Locked (With Admin)
                          </button>
                        )}

                      </div>
                    </div>

                    {/* Bottom Row: Query Note (Only visible if Query Raised) */}
                    {enc.status === "Query Raised" && enc.queryNote && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-0.5">NHCX Auditor Note</p>
                          <p className="text-sm font-medium text-red-700">{enc.queryNote}</p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}