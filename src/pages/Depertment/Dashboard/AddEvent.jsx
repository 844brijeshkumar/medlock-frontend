import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  PlusCircle, History, AlertCircle, CheckCircle2, Stethoscope, 
  Pill, Activity, FileText, User, MapPin, Clock, ChevronRight,
  Save, RotateCcw, AlertTriangle, Syringe, ShieldCheck, 
  ArrowLeftRight, MessageSquareWarning, Droplets, ShieldAlert,
  Users
} from 'lucide-react';

// --- REGISTRIES ---
const STAFF_REGISTRY = [
  { id: 'D001', name: 'Dr. Sarah Smith', role: 'Chief Cardiologist' },
  { id: 'D002', name: 'Dr. James Wilson', role: 'General Surgeon' },
  { id: 'N001', name: 'Nurse Clara Barton', role: 'Senior ICU Nurse' },
  { id: 'N002', name: 'Nurse Raj Singh', role: 'Ward Manager' },
  { id: 'D003', name: 'Dr. Anita Rao', role: 'Junior Resident' },
  { id: 'D004', name: 'Dr. Kenji Sato', role: 'Senior Consultant' }
];

const DRUG_REGISTRY = ['Paracetamol 500mg', 'Injection Ceftriaxone 1g', 'Tab. Amlodipine 5mg', 'Inj. Insulin (Regular)', 'Tab. Metformin 500mg'];

const ENCOUNTER_STATUS = { ACTIVE: 'Active', DISCHARGED: 'Discharged' };
const ROUTES = ['Oral', 'IV', 'IM', 'SC', 'Nebulizer', 'Sublingual'];
const STATUS_LEVELS = ['Stable', 'Improving', 'Guarded', 'Critical', 'Deteriorating'];

// --- STYLE MAPS ---
const CATEGORY_CONFIG = {
  'Clinical Note': { icon: FileText, color: 'blue', theme: 'bg-blue-50/50 border-blue-500 text-blue-700 shadow-lg shadow-blue-500/20 ring-4 ring-blue-500/10' },
  'Vitals': { icon: Activity, color: 'orange', theme: 'bg-orange-50/50 border-orange-500 text-orange-700 shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/10' },
  'Medication': { icon: Pill, color: 'emerald', theme: 'bg-emerald-50/50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/10' },
  'Procedure': { icon: Stethoscope, color: 'indigo', theme: 'bg-indigo-50/50 border-indigo-500 text-indigo-700 shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10' },
  'Blood Transfusion': { icon: Droplets, color: 'red', theme: 'bg-red-50/50 border-red-500 text-red-700 shadow-lg shadow-red-500/20 ring-4 ring-red-500/10' },
  'Visit / Round': { icon: Users, color: 'purple', theme: 'bg-purple-50/50 border-purple-500 text-purple-700 shadow-lg shadow-purple-500/20 ring-4 ring-purple-500/10' }
};

const STORAGE_KEY = 'medlock_builder_draft';

// Helper to format Date to datetime-local string (YYYY-MM-DDThh:mm)
const toLocalISOString = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000; 
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

export default function App() {
  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  // Simulate URL Parameters
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
    abhaId: '91-4421-0082-1234',
    admissionTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: ENCOUNTER_STATUS.ACTIVE 
  });

  const [events, setEvents] = useState([]);
  const [view, setView] = useState('form');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    timestamp: toLocalISOString(new Date()),
    performedBy: '',
    collaboratingProviders: [], // Multi-Provider Visit Logic
    category: 'Clinical Note',
    details: {
      status: 'Stable', note: '',
      temp: '', unit: 'C', sys: '', dia: '', spo2: '', hr: '',
      drug: '', dosage: '', route: 'Oral',
      bloodBagId: '', doubleVerified: false,
      procedureName: '', visitType: 'Morning Round'
    }
  });

  // --- LOGIC: SESSION RESILIENCE ---
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        setFormData(JSON.parse(draft));
      } catch(e) {
        console.error("Failed to parse local draft");
      }
    }

    const autosave = setInterval(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(autosave);
  }, [formData]);

  // --- LOGIC: BIOLOGICAL GUARDRAILS ---
  const checkLethalValues = useCallback(() => {
    const d = formData.details;
    const alerts = [];
    if (formData.category === 'Vitals') {
      if (d.temp > 42) alerts.push("LETHAL: Hyperpyrexia (>42°C)");
      if (d.spo2 < 70 && d.spo2 !== '') alerts.push("CRITICAL: Severe Hypoxia (<70%)");
      if (d.sys > 220) alerts.push("CRITICAL: Hypertensive Emergency (>220 Sys)");
      if (d.hr > 180) alerts.push("CRITICAL: Extreme Tachycardia (>180 bpm)");
    }
    return alerts;
  }, [formData]);

  const validate = () => {
    const newErrors = {};
    const d = formData.details;
    const now = Date.now();
    const admission = new Date(patient.admissionTime).getTime();
    const actionTime = new Date(formData.timestamp).getTime();

    if (actionTime > now) newErrors.timestamp = "Future date prohibited";
    if (actionTime < admission) newErrors.timestamp = "Action predates admission";
    if (!formData.performedBy) newErrors.performedBy = "Staff ID required";

    if (formData.category === 'Vitals') {
      if (d.temp > 45 || (d.temp < 25 && d.temp !== '')) newErrors.temp = "Impossible Temp";
      if (d.spo2 > 100) newErrors.spo2 = "SpO2 max 100%";
    }

    if (formData.category === 'Blood Transfusion' && !d.doubleVerified) {
      newErrors.verified = "Double verification required for blood products";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (patient.status === ENCOUNTER_STATUS.DISCHARGED || isSaving) return;
    if (!validate()) return;

    setIsSaving(true); // Idempotency: Immediate disable
    await new Promise(r => setTimeout(r, 800)); // Simulate API

    const newEvent = {
      id: `EV-${Date.now()}`,
      ...formData,
      ward: params.ward_id,
      bed: params.bed_id
    };

    setEvents(prev => [newEvent, ...prev]);
    setToast({ msg: "Ledger entry anchored successfully", type: 'success' });
    setTimeout(() => setToast(null), 3000);
    
    // Clear draft
    localStorage.removeItem(STORAGE_KEY);
    setFormData({
      ...formData,
      collaboratingProviders: [],
      details: { ...formData.details, note: '', temp: '', sys: '', dia: '', spo2: '', hr: '', bloodBagId: '', doubleVerified: false, visitType: 'Morning Round' }
    });
    setIsSaving(false);
  };

  const lethalAlerts = checkLethalValues();
  const minDateLimit = toLocalISOString(new Date(patient.admissionTime));
  const maxDateLimit = toLocalISOString(new Date());

  // Input helper class
  const inputClass = (hasError) => `w-full pl-4 pr-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border outline-none text-gray-700 placeholder-gray-400 transition-all font-medium ${
    hasError 
    ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 bg-red-50/50' 
    : 'border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10'
  }`;

  return (
    <div 
      className="space-y-8 p-4 md:p-10 fade-in bg-gray-50 min-h-screen relative font-sans"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* SUCCESS TOAST */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 border border-secondary/30">
          <CheckCircle2 className="text-secondary" />
          <span className="font-bold">{toast.msg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-primary">Patient Event Entry</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Transcribe handwritten notes to the immutable ledger</p>
          </div>
          
          <button 
            type="button" 
            onClick={() => setView('history')} 
            className="group relative overflow-hidden bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <History className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform" />
            Ledger History
          </button>
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

        {/* BUILDER AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSave} className="lg:col-span-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 relative group hover:border-secondary/20 transition-colors">
            
            {/* LETHAL VALUE ALERT BANNER */}
            {lethalAlerts.length > 0 && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-4 animate-pulse shadow-sm">
                <div className="bg-red-100 p-2 rounded-xl">
                  <ShieldAlert size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wider">Lethal Value Alert</p>
                  <p className="text-xs font-bold mt-1">{lethalAlerts.join(' | ')}</p>
                </div>
              </div>
            )}

            {/* METADATA SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 group/input">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within/input:text-secondary transition-colors">Action Timestamp</label>
                <div className="relative">
                  <input 
                    type="datetime-local"
                    min={minDateLimit}
                    max={maxDateLimit}
                    value={formData.timestamp}
                    onChange={e => setFormData({...formData, timestamp: e.target.value})}
                    className={inputClass(errors.timestamp)}
                  />
                  <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within/input:text-secondary transition-colors" size={20} />
                </div>
                {errors.timestamp && <p className="text-[10px] text-red-500 font-bold">{errors.timestamp}</p>}
                <p className="text-[10px] text-gray-400 font-medium">Restricted to valid encounter dates.</p>
              </div>

              <div className="space-y-2 group/input">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within/input:text-secondary transition-colors">Primary Performed By</label>
                <select 
                  value={formData.performedBy}
                  onChange={e => setFormData({...formData, performedBy: e.target.value})}
                  className={`${inputClass(errors.performedBy)} appearance-none cursor-pointer`}
                >
                  <option value="">Search Clinical Staff...</option>
                  {STAFF_REGISTRY.map(s => <option key={s.id} value={s.name}>{s.name} ({s.role})</option>)}
                </select>
                {errors.performedBy && <p className="text-[10px] text-red-500 font-bold">{errors.performedBy}</p>}
              </div>

              {/* COLLABORATING PROVIDERS (Multi-Visit Logic) */}
              <div className="md:col-span-2 space-y-2 group/input bg-gray-50/30 p-4 rounded-2xl border border-gray-100">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-focus-within/input:text-secondary transition-colors flex items-center gap-2">
                  <Users size={14} /> Collaborating Providers (Optional)
                </label>
                <div className="flex flex-col gap-3">
                  <select 
                    value=""
                    onChange={e => {
                      const val = e.target.value;
                      if (val && !formData.collaboratingProviders.includes(val)) {
                        setFormData(prev => ({...prev, collaboratingProviders: [...prev.collaboratingProviders, val]}));
                      }
                    }}
                    className={`${inputClass(false)} appearance-none cursor-pointer`}
                  >
                    <option value="">+ Add Assisting Doctor or Nurse...</option>
                    {STAFF_REGISTRY
                      .filter(s => s.name !== formData.performedBy && !formData.collaboratingProviders.includes(s.name))
                      .map(s => <option key={s.id} value={s.name}>{s.name} ({s.role})</option>)
                    }
                  </select>

                  {formData.collaboratingProviders.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.collaboratingProviders.map(provider => (
                        <span key={provider} className="text-xs font-bold bg-secondary/10 text-secondary border border-secondary/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                          {provider}
                          <button 
                            type="button" 
                            onClick={() => setFormData(prev => ({...prev, collaboratingProviders: prev.collaboratingProviders.filter(p => p !== provider)}))}
                            className="hover:text-primary hover:bg-secondary/20 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100 my-4"></div>

            {/* CATEGORY SELECTOR */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block text-center">Service Category</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(CATEGORY_CONFIG).map(([id, cfg]) => {
                  const Icon = cfg.icon;
                  const active = formData.category === id;
                  return (
                    <button 
                      key={id}
                      type="button"
                      onClick={() => setFormData({...formData, category: id})}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${active ? cfg.theme : 'bg-gray-50/50 border-transparent text-gray-400 hover:bg-white hover:border-gray-200 hover:text-gray-600 hover:shadow-sm'}`}
                    >
                      <Icon size={22} className={active ? '' : 'opacity-70'} />
                      <span className="text-[10px] font-bold text-center leading-tight">{id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC PAYLOAD ENGINE */}
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm">
              {formData.category === 'Clinical Note' && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Patient Status</label>
                    <select value={formData.details.status} onChange={e => setFormData({...formData, details: {...formData.details, status: e.target.value}})} className={`${inputClass()} appearance-none cursor-pointer`}>
                      {STATUS_LEVELS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Transcription Note</label>
                    <textarea rows={4} value={formData.details.note} onChange={e => setFormData({...formData, details: {...formData.details, note: e.target.value}})} className={inputClass()} placeholder="Type doctor's handwritten notes..."></textarea>
                  </div>
                </div>
              )}

              {formData.category === 'Visit / Round' && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Round Type</label>
                    <select value={formData.details.visitType} onChange={e => setFormData({...formData, details: {...formData.details, visitType: e.target.value}})} className={`${inputClass()} appearance-none cursor-pointer`}>
                      {['Morning Round', 'Evening Round', 'Specialist Consult', 'Emergency Visit'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors flex items-center justify-between">
                      <span>Consultation Notes</span>
                      <span className="text-[9px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-md lowercase tracking-normal">use for split attribution</span>
                    </label>
                    <textarea rows={4} value={formData.details.note} onChange={e => setFormData({...formData, details: {...formData.details, note: e.target.value}})} className={inputClass()} placeholder="e.g. Dr. Sato ordered Echo. Dr. Smith adjusted insulin dosage..."></textarea>
                  </div>
                </div>
              )}

              {formData.category === 'Vitals' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="space-y-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Temp (°C)</label>
                    <input type="number" step="0.1" value={formData.details.temp} onChange={e => setFormData({...formData, details: {...formData.details, temp: e.target.value}})} className={inputClass(errors.temp || parseFloat(formData.details.temp) > 42)} />
                  </div>
                  <div className="space-y-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">BP (Sys/Dia)</label>
                    <div className="flex gap-2 items-center">
                      <input type="number" placeholder="S" value={formData.details.sys} onChange={e => setFormData({...formData, details: {...formData.details, sys: e.target.value}})} className={inputClass()} />
                      <span className="text-gray-300 font-bold">/</span>
                      <input type="number" placeholder="D" value={formData.details.dia} onChange={e => setFormData({...formData, details: {...formData.details, dia: e.target.value}})} className={inputClass()} />
                    </div>
                  </div>
                  <div className="space-y-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">SpO2 %</label>
                    <input type="number" value={formData.details.spo2} onChange={e => setFormData({...formData, details: {...formData.details, spo2: e.target.value}})} className={inputClass(errors.spo2 || (parseFloat(formData.details.spo2) < 90 && formData.details.spo2 !== ''))} />
                  </div>
                  <div className="space-y-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Heart Rate</label>
                    <input type="number" value={formData.details.hr} onChange={e => setFormData({...formData, details: {...formData.details, hr: e.target.value}})} className={inputClass()} />
                  </div>
                </div>
              )}

              {formData.category === 'Medication' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2 group/input">
                      <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Search Drug</label>
                      <input list="drugs" value={formData.details.drug} onChange={e => setFormData({...formData, details: {...formData.details, drug: e.target.value}})} className={inputClass()} placeholder="Type to search registry..." />
                      <datalist id="drugs">{DRUG_REGISTRY.map(d => <option key={d} value={d} />)}</datalist>
                    </div>
                    <div className="flex flex-col gap-2 group/input">
                      <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Dosage</label>
                      <input type="text" value={formData.details.dosage} onChange={e => setFormData({...formData, details: {...formData.details, dosage: e.target.value}})} className={inputClass()} placeholder="e.g. 500mg or 2ml" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Route</label>
                    <select value={formData.details.route} onChange={e => setFormData({...formData, details: {...formData.details, route: e.target.value}})} className={`${inputClass()} appearance-none cursor-pointer`}>
                      {ROUTES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {formData.category === 'Blood Transfusion' && (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Blood Bag ID</label>
                    <input type="text" value={formData.details.bloodBagId} onChange={e => setFormData({...formData, details: {...formData.details, bloodBagId: e.target.value}})} className={`${inputClass()} font-mono`} placeholder="BAG-XXXX-XXXX" />
                  </div>
                  <div className={`p-5 rounded-2xl border flex items-center justify-between transition-colors ${formData.details.doubleVerified ? 'bg-secondary/10 border-secondary text-primary' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className={formData.details.doubleVerified ? 'text-secondary' : 'text-gray-400'} />
                      <span className="text-sm font-bold">Double verification at bedside completed</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.details.doubleVerified} 
                      onChange={e => setFormData({...formData, details: {...formData.details, doubleVerified: e.target.checked}})}
                      className="w-6 h-6 rounded-lg cursor-pointer accent-secondary"
                    />
                  </div>
                  {errors.verified && <p className="text-[10px] text-red-500 font-bold">{errors.verified}</p>}
                </div>
              )}

              {formData.category === 'Procedure' && (
                <div className="space-y-5">
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Procedure Description</label>
                    <input type="text" value={formData.details.procedureName} onChange={e => setFormData({...formData, details: {...formData.details, procedureName: e.target.value}})} className={inputClass()} placeholder="e.g. Wound dressing, Catheterization" />
                  </div>
                  <div className="flex flex-col gap-2 group/input">
                    <label className="text-xs font-bold text-gray-500 uppercase group-focus-within/input:text-secondary transition-colors">Observations</label>
                    <textarea value={formData.details.note} onChange={e => setFormData({...formData, details: {...formData.details, note: e.target.value}})} className={inputClass()} placeholder="Type procedural findings..."></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* FORM ACTIONS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-100">
               <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <ShieldCheck size={16} className="text-secondary" /> NHCX Ledger Idempotency Active
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData({
                        timestamp: toLocalISOString(new Date()),
                        performedBy: '',
                        collaboratingProviders: [],
                        category: 'Clinical Note',
                        details: { status: 'Stable', note: '', temp: '', unit: 'C', sys: '', dia: '', spo2: '', hr: '', bloodBagId: '', doubleVerified: false, drug: '', dosage: '', route: 'Oral', procedureName: '', visitType: 'Morning Round' }
                      });
                      localStorage.removeItem(STORAGE_KEY);
                    }}
                    className="flex-1 md:flex-none px-8 py-4 rounded-2xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 hover:text-primary transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} /> Reset
                  </button>
                  <button 
                    disabled={isSaving || patient.status === ENCOUNTER_STATUS.DISCHARGED}
                    type="submit"
                    className={`group relative overflow-hidden flex-1 md:flex-none px-12 py-4 rounded-2xl font-black text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                      patient.status === ENCOUNTER_STATUS.DISCHARGED 
                      ? 'bg-gray-300 cursor-not-allowed opacity-50 shadow-none' 
                      : 'bg-primary shadow-primary/20 hover:scale-105'
                    }`}
                  >
                    {patient.status !== ENCOUNTER_STATUS.DISCHARGED && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />}
                    {isSaving ? 'Anchoring...' : <><Save className="w-5 h-5 group-hover:-translate-y-1 transition-transform" /> Anchor to Ledger</>}
                  </button>
                </div>
            </div>

            {patient.status === ENCOUNTER_STATUS.DISCHARGED && (
              <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm rounded-[2rem] flex items-center justify-center p-8 text-center">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-sm transform scale-105">
                   <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <AlertTriangle size={32} />
                   </div>
                   <h2 className="font-black text-2xl mb-2 text-gray-900">Encounter Closed</h2>
                   <p className="text-gray-500 text-sm mb-8 font-medium">This patient has been discharged. The clinical ledger is cryptographically sealed and no further entries are permitted.</p>
                   <button type="button" onClick={() => setView('history')} className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-secondary transition-colors w-full">View Final History</button>
                </div>
              </div>
            )}
          </form>

          {/* SIDEBAR: AUDIT & RECENT */}
          <aside className="lg:col-span-4 space-y-6">
             <div className="bg-primary rounded-[2rem] p-8 text-white shadow-xl shadow-primary/10 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                   <ShieldCheck size={140} />
                </div>
                <h4 className="font-black text-xl mb-8 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  Builder Protocol
                </h4>
                <div className="space-y-6 relative z-10">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-secondary shrink-0 shadow-inner">1</div>
                    <p className="text-sm text-accent font-medium leading-relaxed"><span className="text-white font-bold">Multi-Provider Visites:</span> Tag assisting staff via "Collaborating Providers". Enter sequential notes using the exact `Action Timestamp`.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-secondary shrink-0 shadow-inner">2</div>
                    <p className="text-sm text-accent font-medium leading-relaxed"><span className="text-white font-bold">Resilience:</span> Form state is cached locally every 30s. Wi-Fi drops won't lose doctor notes.</p>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold text-secondary shrink-0 shadow-inner">3</div>
                    <p className="text-sm text-accent font-medium leading-relaxed"><span className="text-white font-bold">Idempotency & Lock:</span> "Anchor" disables to prevent double-entry. Ledger seals instantly on Discharge.</p>
                  </div>
                </div>
             </div>

             <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm group hover:border-secondary/20 transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">Recent Session</h4>
                  <button onClick={() => setView('history')} className="text-[10px] font-bold text-secondary hover:text-primary hover:underline transition-colors">Full History</button>
                </div>
                <div className="space-y-4">
                  {events.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                       <p className="text-sm text-gray-400 font-medium">No events recorded in current session.</p>
                    </div>
                  ) : events.slice(0, 5).map((ev, index) => {
                    const Config = CATEGORY_CONFIG[ev.category] || CATEGORY_CONFIG['Clinical Note'];
                    return (
                      <div key={ev.id} className="p-4 bg-white rounded-2xl border border-gray-100 flex gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50 hover:border-secondary/30 relative overflow-hidden">
                        {/* Accent Line */}
                        <div className="absolute left-0 top-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className={`p-3 rounded-xl bg-gray-50 h-fit ${Config.color === 'blue' ? 'text-blue-500' : Config.color === 'orange' ? 'text-orange-500' : Config.color === 'red' ? 'text-red-500' : Config.color === 'purple' ? 'text-purple-500' : 'text-emerald-500'}`}>
                           <Config.icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{ev.timestamp.split('T')[1]}</p>
                           <p className="text-sm font-bold text-gray-900 truncate">{ev.category}</p>
                           <p className="text-xs text-gray-500 truncate mt-0.5">{ev.details.note || ev.details.drug || ev.details.procedureName || ev.details.bloodBagId}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </aside>
        </div>
      </div>
      
      <footer className="mt-20 pb-12 text-center text-gray-400">
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Medlock CRM Builder • Ver 4.3.0 • Dynamic Theme Active</p>
      </footer>

      {/* TIMELINE VIEW (HISTORY MODAL) */}
      {view === 'history' && (
        <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md p-4 md:p-10 flex items-center justify-center animate-in zoom-in-95 duration-300 font-sans">
           <div className="bg-white w-full max-w-4xl h-full rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/20">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                   <div onClick={() => setView('form')} className="p-3 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-2xl transition-all cursor-pointer text-gray-500">
                      <ArrowLeftRight size={20} className="rotate-180" />
                   </div>
                   <div>
                     <h2 className="font-black text-2xl tracking-tighter text-primary">Clinical Ledger History</h2>
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Encounter: {params.encounter_id}</p>
                   </div>
                </div>
                <button onClick={() => setView('form')} className="p-4 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"><RotateCcw size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                {events.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                     <div className="bg-gray-100 p-6 rounded-full mb-4">
                        <History size={48} className="text-gray-300" />
                     </div>
                     <p className="font-bold text-lg text-gray-500">No historical events found.</p>
                     <p className="text-sm mt-1">Actions anchored in this session will appear here.</p>
                  </div>
                ) : (
                  <div className="border-l-2 border-gray-200 ml-8 space-y-10 relative">
                    {events.map(ev => {
                       const Config = CATEGORY_CONFIG[ev.category] || CATEGORY_CONFIG['Clinical Note'];
                       return (
                        <div key={ev.id} className="relative pl-10 group">
                           {/* Node Dot */}
                           <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-secondary shadow-sm group-hover:scale-125 transition-transform`}></div>
                           
                           <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-100 group-hover:shadow-xl group-hover:shadow-secondary/10 group-hover:border-secondary/30 transition-all duration-300">
                              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-2">
                                <div className="flex items-start gap-4">
                                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${Config.theme}`}>
                                      <Config.icon size={22} />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{formatDate(ev.timestamp)}</p>
                                      <h4 className="font-black text-lg text-gray-900 group-hover:text-primary transition-colors">
                                        {ev.category} {ev.category === 'Visit / Round' && <span className="text-xs text-secondary ml-2 font-bold bg-secondary/10 px-2 py-0.5 rounded-lg border border-secondary/20">{ev.details.visitType}</span>}
                                      </h4>
                                   </div>
                                </div>
                                <div className="flex flex-col items-start sm:items-end gap-1 mt-2 sm:mt-0">
                                  <p className="text-[10px] font-bold px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 uppercase flex items-center gap-1">
                                    <User size={12} className="text-gray-400" /> By {ev.performedBy}
                                  </p>
                                  {ev.collaboratingProviders?.length > 0 && (
                                    <p className="text-[9px] font-bold px-2 py-1 text-gray-400 uppercase">
                                      + {ev.collaboratingProviders.join(', ')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-50 mt-2">
                                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                  {ev.details.note || ev.details.drug || ev.details.procedureName || ev.details.bloodBagId || 'Observation recorded'}
                                </p>
                              </div>
                           </div>
                        </div>
                       )
                    })}
                  </div>
                )}
              </div>
              <div className="p-8 border-t border-gray-100 bg-white flex justify-end">
                 <button onClick={() => setView('form')} className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all">Close History View</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

const formatDate = (iso) => new Intl.DateTimeFormat('en-IN', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
}).format(new Date(iso));