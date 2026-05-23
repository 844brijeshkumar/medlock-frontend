import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Play, 
  Square, 
  AlertOctagon, 
  ScanLine, 
  Printer, 
  UserCheck, 
  Search,
  AlertTriangle,
  Activity,
  Plus,
  Minus,
  Droplet,
  FileText,
  Clock
} from 'lucide-react';

/**
 * PHLEBOTOMY CLINICAL DASHBOARD - MULTI-PATIENT
 * Tablet-optimized Grid for concurrent blood collection.
 * Enforces strict Print-on-Demand and Post-Scan Verification.
 */

// --- Mock Axios & API Service ---
const mockAxios = {
  get: async (url) => {
    console.log(`[API GET] ${url}`);
    await new Promise(resolve => setTimeout(resolve, 600)); // Network delay
    
    // Simulate backend returning missing blood type for test ABHA IDs ending in '99'
    if (url.endsWith('99')) {
      return {
        data: { name: "Priya Patel", bloodType: null, phone: "+91 91234 56789", eligibility: "CLEARED" }
      };
    }
    // Default mock response
    return {
      data: { name: "Arjun Sharma", bloodType: "O+", phone: "+91 98765 43210", eligibility: "CLEARED" }
    };
  },
  post: async (url, payload) => {
    console.log(`[API POST] ${url}`, payload);
    await new Promise(resolve => setTimeout(resolve, 800)); // Network delay
    
    const year = new Date().getFullYear().toString().slice(-2);
    const serial = Math.floor(100000 + Math.random() * 900000);
    const mockIsbtBarcode = `V1934${year}${serial}`;

    return {
      data: {
        success: true,
        bag_barcode_id: mockIsbtBarcode,
        status: payload.reason ? 'Incomplete_Collection' : 'Quarantined'
      }
    };
  }
};

// --- Sub-Components ---

const BarcodeStickerMock = ({ barcode, status }) => (
  <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm w-full max-w-[280px] mx-auto flex flex-col items-center justify-center transition-all hover:border-secondary/30">
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">ISBT 128 Standard</div>
    <div className="flex items-center h-10 w-full bg-gray-50 px-1 justify-between mb-2 opacity-80 rounded">
       <div className="w-1 h-full bg-slate-800"></div><div className="w-2 h-full bg-slate-800"></div>
       <div className="w-1 h-full bg-slate-800"></div><div className="w-3 h-full bg-slate-800"></div>
       <div className="w-1 h-full bg-slate-800"></div><div className="w-2 h-full bg-slate-800"></div>
       <div className="w-4 h-full bg-slate-800"></div><div className="w-1 h-full bg-slate-800"></div>
       <div className="w-2 h-full bg-slate-800"></div><div className="w-1 h-full bg-slate-800"></div>
    </div>
    <div className="font-mono text-xl tracking-[0.1em] font-bold text-gray-900">{barcode}</div>
    {status === 'Incomplete_Collection' && (
       <div className="mt-3 bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider w-full text-center">
         BIOHAZARD - DESTRUCT
       </div>
    )}
  </div>
);

// --- Autonomous Chair Component ---
// Manages its own complete state machine so chairs can operate independently.
const ChairCard = ({ chairId, onModeChange }) => {
  const [mode, setMode] = useState('IDLE'); // IDLE -> VERIFICATION -> BLEEDING -> ABORT_MODAL -> PRINT_VERIFY
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [donorId, setDonorId] = useState('');
  
  // Real-time tracking
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  const [patientData, setPatientData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedBarcode, setGeneratedBarcode] = useState(null);
  const [collectionStatus, setCollectionStatus] = useState(null);
  
  // Weigh-in state
  const [bagWeight, setBagWeight] = useState('');

  const [scanInput, setScanInput] = useState('');
  const [scanError, setScanError] = useState(false);
  const scanInputRef = useRef(null);

  // Sync mode changes with parent dashboard
  useEffect(() => {
    if (onModeChange) {
      onModeChange(chairId, mode);
    }
  }, [mode, chairId, onModeChange]);

  // Fetch patient data when ABHA ID is 14 digits long
  useEffect(() => {
    const fetchDonor = async () => {
      const rawId = donorId.replace(/\D/g, '');
      if (rawId.length === 14) {
        setIsFetching(true);
        try {
          // Simulate fetching by clean ID
          const res = await mockAxios.get(`/api/v1/donor/${rawId}`);
          setPatientData(res.data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsFetching(false);
        }
      } else {
        setPatientData(null);
      }
    };
    fetchDonor();
  }, [donorId]);

  // Strict ABHA ID Input Validation
  const handleAbhaChange = (e) => {
    // Strip all non-numeric characters automatically
    const val = e.target.value.replace(/\D/g, ''); 
    let formatted = val;
    
    // Auto-format to standard ABHA pattern: XXXX-XXXX-XXXX-XX
    if (val.length > 12) formatted = `${val.slice(0,4)}-${val.slice(4,8)}-${val.slice(8,12)}-${val.slice(12,14)}`;
    else if (val.length > 8) formatted = `${val.slice(0,4)}-${val.slice(4,8)}-${val.slice(8,12)}`;
    else if (val.length > 4) formatted = `${val.slice(0,4)}-${val.slice(4,8)}`;
    
    setDonorId(formatted);
  };

  // Independent Timer
  useEffect(() => {
    let interval = null;
    if (timerActive && mode === 'BLEEDING') {
      interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, mode]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatRealTime = (dateObj) => {
    if (!dateObj) return '--:--';
    return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatShortDate = (dateObj) => {
    if (!dateObj) return '--';
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleInitiateBleed = () => {
    setMode('BLEEDING');
    setTimerActive(true);
    setElapsedSeconds(0);
    setStartTime(new Date());
    setEndTime(null);
    setBagWeight('');
  };

  const handleStopBleed = () => {
    const end = new Date();
    setEndTime(end);
    setTimerActive(false);
    setMode('WEIGH_IN'); // Transition to Phase 2 before API call
  };

  const submitFinalRecord = async () => {
    setIsProcessing(true);
    
    // Auto-calculate the volume: Volume (mL) = (Weight_in_grams - 40) / 1.053
    const calculatedVolume = bagWeight ? Math.max(0, Math.round((parseFloat(bagWeight) - 40) / 1.053)) : 0;

    try {
      // Send ALL contextual data + weight & volume to the complete endpoint
      const response = await mockAxios.post('/api/v1/collection/complete', {
        donor_id: donorId || 'DONOR_999',
        chair_id: chairId,
        patient_name: patientData?.name,
        blood_type: patientData?.bloodType,
        contact_number: patientData?.phone,
        duration_seconds: elapsedSeconds,
        start_time: startTime?.toISOString(),
        end_time: endTime?.toISOString(),
        gross_weight_g: parseFloat(bagWeight),
        net_volume_ml: calculatedVolume
      });
      setGeneratedBarcode(response.data.bag_barcode_id);
      setCollectionStatus(response.data.status);
      setMode('PRINT_VERIFY');
      setTimeout(() => scanInputRef.current?.focus(), 100);
    } catch (err) {
      console.error(err);
      // If API fails, allow them to retry
    } finally {
      setIsProcessing(false);
    }
  };

  const submitAbort = async (reason) => {
    const end = new Date();
    setEndTime(end);
    setIsProcessing(true);
    try {
      // Send ALL contextual data to the abort endpoint
      const response = await mockAxios.post('/api/v1/collection/abort', {
        donor_id: donorId || 'DONOR_999',
        chair_id: chairId,
        patient_name: patientData?.name,
        blood_type: patientData?.bloodType,
        contact_number: patientData?.phone,
        duration_seconds: elapsedSeconds,
        reason: reason,
        start_time: startTime?.toISOString(),
        end_time: end.toISOString()
      });
      setGeneratedBarcode(response.data.bag_barcode_id);
      setCollectionStatus(response.data.status);
      setMode('PRINT_VERIFY');
      setTimeout(() => scanInputRef.current?.focus(), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanVerify = (e) => {
    e.preventDefault();
    if (scanInput.trim().toUpperCase() === generatedBarcode) {
      setMode('IDLE');
      setDonorId('');
      setPatientData(null);
      setScanInput('');
      setGeneratedBarcode(null);
      setElapsedSeconds(0);
      setStartTime(null);
      setEndTime(null);
      setScanError(false);
    } else {
      setScanError(true);
      setScanInput('');
    }
  };

  // --- RENDER MODES FOR THIS SPECIFIC CHAIR ---

  const baseCardClasses = "group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden flex flex-col min-h-[420px]";
  const animatedTopLine = <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left z-10" />;

  if (mode === 'IDLE') {
    return (
      <div className={`${baseCardClasses} items-center justify-center`}>
        {animatedTopLine}
        <div className="w-20 h-20 rounded-[2rem] bg-secondary/10 flex items-center justify-center text-secondary shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300 mb-6">
          <Droplet size={40} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-6">Chair {chairId} Available</h2>
        <button 
          onClick={() => setMode('VERIFICATION')}
          className="flex items-center gap-2 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
        >
          <Plus size={20} /> Admit Patient
        </button>
      </div>
    );
  }

  if (mode === 'VERIFICATION') {
    return (
      <div className={`${baseCardClasses} justify-start`}>
        {animatedTopLine}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">Chair {chairId} - Intake</h2>
          <button onClick={() => { setMode('IDLE'); setDonorId(''); setPatientData(null); }} className="text-gray-400 hover:text-red-500 text-sm font-bold transition-colors">Cancel</button>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Scan or Enter ABHA ID</label>
          <div className="relative mb-6 group/input">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-secondary transition-colors" size={24} />
            <input 
              type="text" 
              value={donorId}
              onChange={handleAbhaChange}
              placeholder="XXXX-XXXX-XXXX-XX"
              className="w-full pl-12 pr-4 py-4 text-xl font-mono bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-all text-gray-700 placeholder-gray-400"
            />
          </div>

          {isFetching && (
            <div className="flex justify-center items-center py-8">
              <Activity className="animate-spin text-secondary" size={32} />
            </div>
          )}

          {patientData && !isFetching && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 gap-y-2 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 group-hover:border-secondary/10 transition-colors">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm">
                    <UserCheck size={28} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{patientData.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-secondary/20 bg-secondary/5 text-primary">
                        {patientData.bloodType || 'Pending'}
                      </span>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-200 bg-emerald-50 text-emerald-600">
                        {patientData.eligibility}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="truncate font-medium">📞 {patientData.phone}</span>
                </div>
              </div>
              <button 
                onClick={handleInitiateBleed}
                className="w-full bg-primary hover:bg-[#083d39] text-white text-lg font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <Play size={20} className="fill-current" /> Initiate Bleed
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'BLEEDING') {
    return (
      <div className={`${baseCardClasses} justify-between`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-400 z-10" />

        <div className="flex justify-between items-start mb-2 relative z-10">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Chair {chairId} - Live</h2>
            <p className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
              {patientData?.name} ({patientData?.bloodType || 'N/A'})
            </p>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium">
              <Clock size={12} /> Started: {formatRealTime(startTime)}
            </p>
          </div>
          <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-2 border border-red-100 shadow-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> REC
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-6">
          <div className="text-6xl md:text-7xl leading-none font-black text-primary tracking-tight drop-shadow-sm font-mono transition-colors">
            {formatTime(elapsedSeconds)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <button 
            disabled={isProcessing}
            onClick={() => setMode('ABORT_MODAL')}
            className="h-16 bg-red-50 hover:bg-red-600 border border-red-100 hover:border-red-600 text-red-600 hover:text-white text-sm font-bold rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            <AlertOctagon size={18} /> Abort
          </button>
          
          <button 
            disabled={elapsedSeconds < 5}
            onClick={handleStopBleed}
            className="h-16 bg-secondary/10 hover:bg-secondary border border-secondary/20 hover:border-secondary text-secondary hover:text-white text-sm font-bold rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            <Square className="fill-current" size={18} /> Complete
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'WEIGH_IN') {
    const calcVol = bagWeight ? Math.max(0, Math.round((parseFloat(bagWeight) - 40) / 1.053)) : 0;
    
    // Calculate Expiries based on Start Time
    const rbcExp = startTime ? new Date(startTime.getTime() + 42 * 86400000) : null;
    const pltExp = startTime ? new Date(startTime.getTime() + 5 * 86400000) : null;
    const plaExp = startTime ? new Date(startTime.getTime() + 365 * 86400000) : null;

    return (
      <div className={`${baseCardClasses} justify-start`}>
        {animatedTopLine}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">Phase 2: Weigh-in</h2>
          <span className="px-2 py-1 bg-secondary/10 text-primary text-xs font-bold rounded-lg border border-secondary/20">
            {formatTime(elapsedSeconds)}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Weight Input & Live Volume */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Gross Bag Weight</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={bagWeight}
                  onChange={(e) => setBagWeight(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-2xl font-bold text-gray-800 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">g</span>
              </div>
            </div>
            
            <div className="bg-secondary/5 p-4 rounded-2xl border border-secondary/20 flex flex-col justify-center items-center text-center">
              <label className="block text-[10px] font-black text-primary uppercase tracking-wider mb-1">Live Net Volume</label>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary">{calcVol}</span>
                <span className="text-secondary font-bold text-sm">mL</span>
              </div>
            </div>
          </div>

          {/* Expiry Calculations Display */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-3">Projected Component Expiries</label>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">RBCs (+42d)</span>
                <span className="font-bold text-gray-800">{formatShortDate(rbcExp)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Platelets (+5d)</span>
                <span className="font-bold text-gray-800">{formatShortDate(pltExp)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Plasma (+365d)</span>
                <span className="font-bold text-gray-800">{formatShortDate(plaExp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 mt-2 border-t border-gray-100">
          <button 
            disabled={!bagWeight || isProcessing}
            onClick={submitFinalRecord}
            className="w-full bg-primary hover:bg-[#083d39] text-white text-lg font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
          >
            {isProcessing ? <Activity className="animate-spin" size={20} /> : <FileText size={20} />}
            Save Final Record
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'ABORT_MODAL') {
    const reasons = ["Donor Reaction", "Vein Collapse", "Equipment Failure", "Clot Detected"];

    return (
      <div className={`${baseCardClasses} border-red-100 hover:border-red-200 hover:shadow-red-500/10`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-400 z-10" />
        
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Abort Collection</h2>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 font-medium bg-red-50/50 p-3 rounded-xl border border-red-50">
          Halting bleed at <span className="font-bold text-red-600">{formatTime(elapsedSeconds)}</span> (Started: {formatRealTime(startTime)}). Select reason for biohazard tracking:
        </p>

        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {reasons.map(reason => (
            <button
              key={reason}
              onClick={() => { setTimerActive(false); submitAbort(reason); }}
              className="w-full text-left bg-gray-50/50 hover:bg-red-50 border border-transparent hover:border-red-100 p-4 rounded-xl text-sm font-bold text-gray-700 hover:text-red-600 transition-colors shadow-sm hover:shadow-md"
            >
              {reason}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setMode('BLEEDING')}
          className="w-full py-3 text-gray-400 font-bold hover:bg-gray-50 rounded-xl transition-colors text-sm uppercase tracking-wider"
        >
          Cancel & Resume
        </button>
      </div>
    );
  }

  if (mode === 'PRINT_VERIFY') {
    return (
      <div className={`${baseCardClasses} text-center`}>
        {animatedTopLine}
        <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2 group-hover:text-primary transition-colors">
          <Printer className="text-secondary" size={24} /> Print Successful
        </h2>
        <p className="text-sm text-gray-500 mb-6 font-medium">Apply sticker to bag and scan to verify.</p>

        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-6 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-50/80 border border-gray-100 py-2.5 px-4 rounded-xl w-fit mx-auto shadow-sm">
           <span className="flex items-center gap-1"><Play size={12} className="text-secondary"/> Start: {formatRealTime(startTime)}</span>
           <span className="flex items-center gap-1"><Square size={12} className="text-red-500"/> End: {formatRealTime(endTime)}</span>
           <span className="flex items-center gap-1"><Activity size={12} className="text-primary"/> Dur: {formatTime(elapsedSeconds)}</span>
        </div>

        <div className="flex-1 flex flex-col justify-center mb-6">
          <BarcodeStickerMock barcode={generatedBarcode} status={collectionStatus} />
        </div>

        <form onSubmit={handleScanVerify} className="relative w-full group/input">
          <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-secondary transition-colors" size={20} />
          <input 
            ref={scanInputRef}
            type="text" 
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Scan barcode..."
            autoFocus
            className={`w-full pl-12 pr-4 py-4 text-sm font-mono bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:ring-4 outline-none transition-all shadow-sm ${scanError ? 'focus:border-red-500 focus:ring-red-100 border-red-200 text-red-600' : 'focus:border-secondary focus:ring-secondary/10 text-gray-700'}`}
          />
          <button type="submit" className="hidden">Submit</button>
        </form>
      </div>
    );
  }

  return null;
};

// --- Main Dashboard Layout ---

export default function PhlebotomyDashboard() {
  const [chairs, setChairs] = useState([1, 2, 3, 4]);
  const [chairModes, setChairModes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  // --- THEME CONFIGURATION ---
  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  const handleModeChange = useCallback((id, mode) => {
    setChairModes(prev => {
      if (prev[id] === mode) return prev;
      return { ...prev, [id]: mode };
    });
  }, []);

  const lastChairId = chairs[chairs.length - 1];
  const isLastChairIdle = chairModes[lastChairId] === 'IDLE' || chairModes[lastChairId] === undefined;
  const canRemove = chairs.length > 1 && isLastChairIdle;

  const handleAddChair = () => {
    setChairs(prev => [...prev, prev.length + 1]);
  };

  const handleRemoveChair = () => {
    if (canRemove) {
      setChairs(prev => prev.slice(0, -1));
      // Cleanup the state for the removed chair
      setChairModes(prev => {
        const newModes = { ...prev };
        delete newModes[lastChairId];
        return newModes;
      });
    }
  };

  // Filter chairs based on search input
  const filteredChairs = chairs.filter(id => 
    id.toString().includes(searchQuery)
  );

  return (
    <div 
      className="min-h-screen bg-slate-50 p-6 md:p-10 flex flex-col space-y-8 fade-in relative"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-xl">
               <Activity className="text-secondary" size={28} />
            </div>
            Central Phlebotomy Station
            <span className="bg-accent/50 text-primary px-3 py-1 rounded-lg text-xs font-bold ml-2 border border-secondary/20 shadow-sm flex items-center gap-1">
              {chairs.length} {chairs.length === 1 ? 'Chair' : 'Chairs'} Active
            </span>
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Multi-Chair Monitoring Dashboard
          </p>
        </div>
      </div>

      {/* Filter / Actions Bar */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col xl:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Chair #..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-medium"
          />
        </div>

        <div className="hidden xl:block w-px bg-gray-200 my-2"></div>

        {/* Actions Group */}
        <div className="flex flex-row gap-2">
          <button 
            onClick={handleRemoveChair}
            disabled={!canRemove}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:hover:bg-red-50 disabled:hover:shadow-sm disabled:cursor-not-allowed"
            title={!isLastChairIdle ? "Cannot remove an active chair" : "Remove Chair"}
          >
            <Minus className="h-4 w-4" /> <span className="hidden sm:inline">Remove</span>
          </button>
          
          <button 
            onClick={handleAddChair}
            className="flex items-center justify-center gap-2 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
            title="Add Chair"
          >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Add Chair</span>
          </button>

          {/* Sync Status */}
          <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 whitespace-nowrap gap-2">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" /> <span className="hidden md:inline">Sync Active</span>
          </div>
        </div>
      </div>

      {/* Dynamic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {filteredChairs.length > 0 ? (
          filteredChairs.map(chairId => (
            <ChairCard key={chairId} chairId={chairId} onModeChange={handleModeChange} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors">
              <FileText className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors" />
            </div>
            <p className="font-medium text-lg">No chairs found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm font-bold text-secondary hover:text-primary hover:underline transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}