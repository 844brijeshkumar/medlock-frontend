import React, { useState, useMemo } from 'react';
import { 
  Activity, Pill, FileText, Droplets, Users, User, ArrowLeftRight, 
  FlaskConical, AlertTriangle, Lock, EyeOff, Link as LinkIcon,
  TrendingUp, Search, ShieldCheck, Filter, ChevronDown
} from 'lucide-react';

// --- THEME & CONFIG ---
const THEME = {
  primary: "#0b4f4a",
  secondary: "#2a9b94",
  accent: "#d1e8e5",
  danger: "#ef4444",
  warning: "#f59e0b"
};

const CATEGORY_CONFIG = {
  'Clinical Note': { icon: FileText, color: 'blue', theme: 'text-blue-700 bg-blue-50 border-blue-200' },
  'Vitals': { icon: Activity, color: 'orange', theme: 'text-orange-700 bg-orange-50 border-orange-200' },
  'Medication': { icon: Pill, color: 'emerald', theme: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  'Lab Result': { icon: FlaskConical, color: 'purple', theme: 'text-purple-700 bg-purple-50 border-purple-200' },
  'Blood Transfusion': { icon: Droplets, color: 'red', theme: 'text-red-700 bg-red-50 border-red-200' },
  'Visit / Round': { icon: Users, color: 'indigo', theme: 'text-indigo-700 bg-indigo-50 border-indigo-200' }
};

// --- MOCK IMMUTABLE LEDGER DATA ---
const MOCK_LEDGER_EVENTS = [
  {
    id: 'EV-001',
    type: 'Event',
    clinical_action_time: '2026-04-24T08:00:00',
    category: 'Vitals',
    details: { temp: 37.2, sys: 145, dia: 90, spo2: 96, hr: 88 },
    performedBy: 'Nurse Clara Barton',
    recordedBy: 'Rec. John Doe (Front Desk)'
  },
  {
    id: 'EV-002',
    type: 'Event',
    clinical_action_time: '2026-04-24T08:15:00',
    category: 'Medication',
    details: { drug: 'Tab. Amlodipine 5mg', dosage: '5mg', route: 'Oral' },
    performedBy: 'Nurse Clara Barton',
    recordedBy: 'Rec. John Doe (Front Desk)'
  },
  {
    id: 'EV-003',
    type: 'Event',
    clinical_action_time: '2026-04-24T09:30:00',
    category: 'Clinical Note',
    details: { note: 'Patient complains of severe chest pain radiating to left arm.' },
    performedBy: 'Dr. Anita Rao',
    recordedBy: 'Rec. John Doe (Front Desk)',
    isVoided: true, // Edge Case: Voided Entry
    correctedByEventId: 'EV-004'
  },
  {
    id: 'EV-004',
    type: 'Event',
    clinical_action_time: '2026-04-24T09:35:00',
    category: 'Clinical Note',
    details: { note: 'Patient complains of mild indigestion, NOT chest pain. Correcting previous typo.' },
    performedBy: 'Dr. Anita Rao',
    recordedBy: 'Rec. John Doe (Front Desk)'
  },
  {
    id: 'EV-005',
    type: 'Patient_Transfer',
    clinical_action_time: '2026-04-24T10:00:00',
    from: 'ER / Bed 02',
    fromDept: 'Emergency Dept',
    to: 'ICU-W01 / B04',
    toDept: 'Cardiology Dept',
    recordedBy: 'System Auto-Log'
  },
  {
    id: 'EV-006',
    type: 'Event',
    clinical_action_time: '2026-04-24T10:30:00',
    category: 'Lab Result',
    details: { test: 'Complete Blood Count', result: 'WBC 12.5k, RBC 4.8M, Hgb 14.2', blinded: true },
    performedBy: 'Tech-0092', // To be blinded
    recordedBy: 'LIMS API Integration'
  },
  {
    id: 'EV-007',
    type: 'Event',
    clinical_action_time: '2026-04-24T12:00:00',
    category: 'Vitals',
    details: { temp: 37.0, sys: 130, dia: 82, spo2: 98, hr: 76 },
    performedBy: 'Nurse Raj Singh',
    recordedBy: 'Rec. Jane Smith (Ward Admin)'
  },
  {
    id: 'EV-008',
    type: 'Event',
    clinical_action_time: '2026-04-24T16:00:00',
    category: 'Vitals',
    details: { temp: 36.8, sys: 125, dia: 78, spo2: 99, hr: 72 },
    performedBy: 'Nurse Raj Singh',
    recordedBy: 'Rec. Jane Smith (Ward Admin)'
  }
];

// --- HELPER COMPONENTS ---

const TimelineIcon = ({ category, isVoided }) => {
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['Clinical Note'];
  const Icon = cfg.icon;
  
  if (isVoided) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-gray-500 shadow-sm z-10 relative">
        <AlertTriangle size={16} />
      </div>
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center shadow-sm z-10 relative ${cfg.theme}`}>
      <Icon size={16} />
    </div>
  );
};

const TransferMarker = ({ event }) => (
  <div className="w-full flex items-center gap-4 my-8 relative z-10">
    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
    <div className="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-3 shadow-sm">
      <ArrowLeftRight size={14} className="text-secondary" />
      Patient Moved from <span className="text-gray-900 bg-gray-100 px-2 py-1 rounded-md">{event.fromDept ? `${event.fromDept} / ` : ''}{event.from}</span> to <span className="text-primary bg-accent/30 px-2 py-1 rounded-md">{event.toDept ? `${event.toDept} / ` : ''}{event.to}</span>
    </div>
    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1" />
  </div>
);

const SparklineChart = ({ data }) => {
  if (!data || data.length < 2) return <div className="text-xs text-gray-400 p-4">Not enough data for trendline</div>;

  const width = 600;
  const height = 120;
  const padding = 20;

  const getPoints = (key, maxVal, minVal) => {
    return data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding) / (data.length - 1));
      const y = height - padding - ((d.details[key] - minVal) / (maxVal - minVal) * (height - 2 * padding));
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full overflow-x-auto bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
          <TrendingUp size={16} /> Vitals Recovery Trend
        </h3>
        <div className="flex gap-4 text-xs font-bold">
          <span className="flex items-center gap-1 text-red-500"><div className="w-2 h-2 rounded-full bg-red-500"></div> Systolic BP</span>
          <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> SpO2 %</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full min-w-[500px]">
        {/* Grid lines */}
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4" />
        
        {/* Sys BP Line (Red) */}
        <polyline points={getPoints('sys', 180, 90)} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* SpO2 Line (Blue) */}
        <polyline points={getPoints('spo2', 100, 85)} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data Points */}
        {data.map((d, i) => {
          const x = padding + (i * (width - 2 * padding) / (data.length - 1));
          const ySys = height - padding - ((d.details.sys - 90) / (180 - 90) * (height - 2 * padding));
          return (
            <g key={i}>
              <circle cx={x} cy={ySys} r="4" fill="#ef4444" className="hover:r-6 transition-all" />
              <text x={x} y={height - 5} fontSize="10" fill="#9ca3af" textAnchor="middle">{new Date(d.clinical_action_time).getHours()}:00</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function ClinicalTimeline() {
  const [filter, setFilter] = useState('All');
  const [showCharts, setShowCharts] = useState(false);

  // Mock Data for the Patient 360 Card
  const [params] = useState({
    encounter_id: 'ENC-2024-9982',
    patient_id: 'PT-88291',
    ward_department_id: 'DEPT-CARDIOLOGY',
    ward_id: 'ICU-W01',
    bed_id: 'B04'
  });

  const [patient] = useState({
    name: 'Ramesh Krishnan',
    age: 58,
    gender: 'Male',
    abhaId: '91-4421-0082-1234'
  });

  // 1. Sort Engine: Strictly by clinical_action_time (Oldest to Newest for chronological narrative)
  const sortedEvents = useMemo(() => {
    return [...MOCK_LEDGER_EVENTS].sort((a, b) => 
      new Date(a.clinical_action_time) - new Date(b.clinical_action_time)
    );
  }, []);

  // Filter Engine
  const displayedEvents = useMemo(() => {
    if (filter === 'All') return sortedEvents;
    if (filter === 'Vitals Only') return sortedEvents.filter(e => e.category === 'Vitals' || e.type === 'Patient_Transfer');
    if (filter === 'Medications Only') return sortedEvents.filter(e => e.category === 'Medication' || e.type === 'Patient_Transfer');
    return sortedEvents;
  }, [sortedEvents, filter]);

  const vitalsData = sortedEvents.filter(e => e.category === 'Vitals');

  const scrollToEvent = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800 selection:bg-secondary/30 selection:text-primary">
      
      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-primary">Clinical Narrative Timeline</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Read-only chronological audit trail of patient encounter</p>
          </div>
          
          <div className="group relative overflow-hidden bg-white border border-gray-200 text-gray-500 px-6 py-3 rounded-2xl font-bold flex items-center shadow-sm cursor-default">
            <Lock className="h-5 w-5 mr-2 text-gray-400" />
            Ledger Sealed
          </div>
        </div>

        {/* PATIENT 360 & LOCATION CARD */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-all duration-300">
              <User size={28} />
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight text-gray-900 group-hover:text-primary transition-colors">{patient.name}</h1>
              <p className="text-gray-500 text-sm font-medium mt-1">
                {patient.gender}, {patient.age}y • Pt ID: <span className="font-mono font-bold text-gray-700">{params.patient_id}</span> • ABHA: <span className="font-mono font-bold text-gray-700">{patient.abhaId}</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="bg-gray-50/50 px-6 py-3 rounded-xl border border-gray-100 flex-1 text-center">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Encounter ID</p>
              <p className="font-bold font-mono text-gray-700 text-lg">{params.encounter_id}</p>
            </div>
            <div className="bg-gray-50/50 px-6 py-3 rounded-xl border border-gray-100 flex-1 text-center">
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Location / Dept</p>
              <p className="font-bold text-gray-700 text-lg">{params.ward_id} / {params.bed_id}</p>
              <p className="text-[10px] font-bold text-gray-500">{params.ward_department_id}</p>
            </div>
          </div>
        </div>

        {/* 4. Filtering & Charts */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 pt-4">
          <div className="flex flex-wrap gap-2">
            {['All', 'Vitals Only', 'Medications Only'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  filter === f 
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f === 'All' ? <Filter size={14} /> : null}
                {f}
              </button>
            ))}
          </div>

          {(filter === 'Vitals Only' || filter === 'All') && vitalsData.length > 0 && (
            <button
              onClick={() => setShowCharts(!showCharts)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                showCharts 
                ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20' 
                : 'bg-white text-secondary border-secondary/30 hover:bg-secondary/5'
              }`}
            >
              <TrendingUp size={16} />
              {showCharts ? 'Hide Trend Chart' : 'View Vitals Trend'}
            </button>
          )}
        </div>

        {/* Dynamic Vitals Chart */}
        {showCharts && <SparklineChart data={vitalsData} />}

        {/* 1. The Timeline Engine */}
        <div className="relative">
          {/* Vertical Track */}
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200 z-0 rounded-full" />

          <div className="space-y-6">
            {displayedEvents.map((ev, index) => {
              
              // 2. Handling Location Changes (Transfer Blocks)
              if (ev.type === 'Patient_Transfer') {
                return <TransferMarker key={ev.id} event={ev} />;
              }

              // Event variables
              const dateObj = new Date(ev.clinical_action_time);
              const timeString = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              const dateString = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              // 3. Edge Case: Blind Entry Results (Lab)
              const isBlindLab = ev.category === 'Lab Result' && ev.details.blinded;
              const displayPerformedBy = isBlindLab ? '*** (Blinded Lab Technician)' : ev.performedBy;
              
              // 3. Edge Case: Voided Entries
              const isVoided = ev.isVoided;

              return (
                <div key={ev.id} id={ev.id} className={`flex gap-6 relative group ${isVoided ? 'opacity-70' : ''}`}>
                  
                  {/* Timeline Node */}
                  <div className="pt-4 relative">
                     <TimelineIcon category={ev.category} isVoided={isVoided} />
                  </div>

                  {/* Card Payload */}
                  <div className={`flex-1 rounded-[1.5rem] p-6 border shadow-sm transition-all duration-300 ${
                    isVoided 
                    ? 'bg-gray-50 border-gray-200 border-dashed' 
                    : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                  }`}>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                          {isVoided && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-md uppercase tracking-widest border border-red-200">Voided Typo</span>}
                          {ev.category}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">{dateString} • {timeString}</p>
                      </div>
                      <div className="text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        {ev.id}
                      </div>
                    </div>

                    {/* Data Body */}
                    <div className={`mb-6 ${isVoided ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {ev.category === 'Vitals' && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                           <div><p className="text-[10px] uppercase text-gray-400 font-bold">Temp</p><p className="font-mono font-bold">{ev.details.temp}°C</p></div>
                           <div><p className="text-[10px] uppercase text-gray-400 font-bold">BP</p><p className="font-mono font-bold">{ev.details.sys}/{ev.details.dia}</p></div>
                           <div><p className="text-[10px] uppercase text-gray-400 font-bold">SpO2</p><p className="font-mono font-bold">{ev.details.spo2}%</p></div>
                           <div><p className="text-[10px] uppercase text-gray-400 font-bold">HR</p><p className="font-mono font-bold">{ev.details.hr} bpm</p></div>
                        </div>
                      )}

                      {ev.category === 'Medication' && (
                         <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100 flex items-center gap-4">
                            <Pill size={24} className="text-emerald-500" />
                            <div>
                              <p className="font-bold text-gray-900">{ev.details.drug}</p>
                              <p className="text-xs text-gray-600 font-medium">{ev.details.dosage} • {ev.details.route}</p>
                            </div>
                         </div>
                      )}

                      {ev.category === 'Clinical Note' && (
                         <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{ev.details.note}</p>
                      )}

                      {ev.category === 'Lab Result' && (
                         <div className="bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                            <p className="font-bold text-purple-900 mb-1 flex items-center gap-2">
                              {ev.details.test}
                              {ev.details.blinded && <span className="flex items-center gap-1 text-[9px] bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full"><EyeOff size={10} /> Blinded</span>}
                            </p>
                            <p className="text-sm font-mono text-gray-700 bg-white p-3 rounded-lg border border-purple-100/50">{ev.details.result}</p>
                         </div>
                      )}
                    </div>

                    {/* Voided Link Logic */}
                    {isVoided && ev.correctedByEventId && (
                      <div className="mb-4">
                        <button 
                          onClick={() => scrollToEvent(ev.correctedByEventId)}
                          className="text-xs font-bold text-primary flex items-center gap-1 bg-accent/20 hover:bg-accent/40 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <LinkIcon size={12} /> View Corrected Entry ({ev.correctedByEventId})
                        </button>
                      </div>
                    )}

                    {/* 1. Attribution Footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <span className="text-gray-400">Performed By:</span> 
                        <span className={isBlindLab ? 'text-purple-600' : 'text-gray-800'}>{displayPerformedBy}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>Recorded By:</span> {ev.recordedBy}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* End of Timeline Marker */}
        <div className="mt-12 flex justify-center opacity-50">
           <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-gray-400" /> Start of Admission
           </div>
        </div>

      </main>
    </div>
  );
}