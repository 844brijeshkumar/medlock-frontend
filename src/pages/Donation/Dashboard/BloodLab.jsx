import React, { useState, useEffect } from 'react';
import { 
  ScanLine, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Activity,
  ShieldAlert,
  Beaker,
  ArrowRight,
  Plus,
  FileText,
  AlertCircle,
  ClipboardList,
  Upload
} from 'lucide-react';

// Main Application Component
export default function App() {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [bagData, setBagData] = useState(null);

  // Expanded Default Markers
  const defaultMarkers = {
    'HIV I/II': 'Pending',
    'HBV (Hepatitis B)': 'Pending',
    'HCV (Hepatitis C)': 'Pending',
    'Syphilis': 'Pending',
    'Malaria': 'Pending',
    'HTLV I/II': 'Pending',
    'West Nile Virus': 'Pending',
    'Chagas Disease': 'Pending',
    'Zika Virus': 'Pending',
    'CMV': 'Pending'
  };

  // Form State
  const [abo1, setAbo1] = useState('');
  const [abo2, setAbo2] = useState('');
  const [markers, setMarkers] = useState(defaultMarkers);
  const [notes, setNotes] = useState('');
  const [reportFile, setReportFile] = useState(null); // Updated to store actual file
  const [isDragging, setIsDragging] = useState(false); // Drag and drop state
  
  // Custom Disease State
  const [isAddingDisease, setIsAddingDisease] = useState(false);
  const [newDiseaseName, setNewDiseaseName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Dropdown Options
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setReportFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setReportFile(e.target.files[0]);
    }
  };

  // Handle Scanner Simulation
  const handleScan = (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    setIsScanning(true);
    
    // Simulate API Call: GET /api/v1/lab/pending/{barcode}
    setTimeout(() => {
      const now = new Date();
      // Mocking different expiries for components (testing Red Alert)
      const plateletExpiry = new Date(now.getTime() + (47 * 60 * 60 * 1000) + (30 * 60 * 1000)); // ~47 hours
      const rbcExpiry = new Date(now.getTime() + (42 * 24 * 60 * 60 * 1000)); // 42 days
      const plasmaExpiry = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
      
      setBagData({
        bag_barcode: barcodeInput,
        collection_time: new Date(now.getTime() - (24 * 60 * 60 * 1000)).toISOString(), // Collected 24h ago
        platelet_expiry: plateletExpiry.toISOString(),
        rbc_expiry: rbcExpiry.toISOString(),
        plasma_expiry: plasmaExpiry.toISOString(),
      });
      setIsScanning(false);
    }, 1000);
  };

  const handleMarkerChange = (disease, value) => {
    setMarkers(prev => ({ ...prev, [disease]: value }));
  };

  const handleAddDisease = () => {
    const diseaseName = newDiseaseName.trim();
    if (diseaseName && !markers[diseaseName]) {
      setMarkers(prev => ({ ...prev, [diseaseName]: 'Pending' }));
      setNewDiseaseName('');
      setIsAddingDisease(false);
    }
  };

  const handleDiseaseInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDisease();
    }
  };

  const resetForm = () => {
    setBagData(null);
    setBarcodeInput('');
    setAbo1('');
    setAbo2('');
    setMarkers(defaultMarkers);
    setNotes('');
    setReportFile(null);
    setIsAddingDisease(false);
    setNewDiseaseName('');
    setSubmitSuccess(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Call: POST /api/v1/lab/results/{barcode}
    setTimeout(() => {
      const isAnyPositive = Object.values(markers).some(m => m === 'Positive');
      setIsSubmitting(false);
      setSubmitSuccess({
        status: isAnyPositive ? 'quarantined' : 'available',
        message: isAnyPositive 
          ? 'Critical: Positive marker detected. Unit quarantined & Donor flagged.'
          : 'Success: Unit marked as Available. Verified ABO recorded.'
      });
    }, 1500);
  };

  // Validation Logic (Including new Report File field)
  const isAboMatched = abo1 !== '' && abo2 !== '' && abo1 === abo2;
  const isAboMismatch = abo1 !== '' && abo2 !== '' && abo1 !== abo2;
  const areMarkersCompleted = Object.values(markers).every(m => m === 'Negative' || m === 'Positive');
  const isFormValid = isAboMatched && areMarkersCompleted && reportFile !== null;

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl shadow-secondary/10 p-10 text-center border border-gray-100 fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
          <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${submitSuccess.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {submitSuccess.status === 'available' ? <CheckCircle2 size={40} /> : <ShieldAlert size={40} />}
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Results Submitted</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">{submitSuccess.message}</p>
          <button onClick={resetForm} className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.02]">
            Scan Next Unit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 relative">
      <main className="max-w-7xl mx-auto px-6 pt-10">
        {!bagData ? (
          /* SCANNER INTERFACE */
          <div className="max-w-xl mx-auto mt-16 group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-secondary/15 border border-gray-100 p-10 transition-all duration-500 hover:-translate-y-2 overflow-hidden relative fade-in">
            {/* Top Accent Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="text-center mb-10">
              <div className="w-24 h-24 rounded-[2rem] bg-secondary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm text-secondary">
                <ScanLine size={48} />
              </div>
              <h2 className="text-3xl font-black text-primary tracking-tight">Awaiting Scan</h2>
              <p className="text-gray-500 mt-2 font-medium">Scan blood bag barcode to begin infectious disease and ABO verification protocol.</p>
            </div>
            
            <form onSubmit={handleScan} className="space-y-6">
              <div className="relative group/input">
                <ScanLine className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within/input:text-secondary transition-colors" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. W1234-5678-9"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50/50 rounded-2xl focus:bg-white border-2 border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-black text-center text-2xl tracking-widest uppercase shadow-inner"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value.toUpperCase())}
                  disabled={isScanning}
                />
              </div>
              <button 
                type="submit" 
                disabled={!barcodeInput || isScanning}
                className="w-full group/btn relative overflow-hidden bg-primary text-white font-bold py-5 rounded-2xl transition-all duration-300 flex justify-center items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] disabled:bg-gray-300 disabled:shadow-none disabled:hover:scale-100 text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover/btn:opacity-30 transition-opacity duration-500" />
                {isScanning ? 'Retrieving Record...' : 'Process Unit'}
                {!isScanning && <ArrowRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />}
              </button>
            </form>
          </div>
        ) : (
          /* DATA ENTRY INTERFACE */
          <div className="space-y-8 fade-in">
            
            {/* Header Title Match */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
              <div>
                  <h2 className="text-3xl font-black tracking-tight text-primary">Blind Entry Protocol</h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">Verify ABO/Rh and input pathogenic screening results</p>
              </div>
            </div>

            {/* READ-ONLY HEADER */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative overflow-hidden group hover:border-secondary/30 transition-colors duration-300">
               <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
              
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Unit Barcode</p>
                <div className="text-3xl font-mono font-black text-primary bg-secondary/10 px-5 py-2 rounded-xl inline-block border border-secondary/20 tracking-wider">
                  {bagData.bag_barcode}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-5 flex-grow xl:flex-grow-0 min-w-[200px] shadow-sm">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Clock size={12} /> Collection Time
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {new Date(bagData.collection_time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </p>
                </div>
                
                <CountdownTimer label="Platelets" expiryDate={bagData.platelet_expiry} />
                <CountdownTimer label="RBCs" expiryDate={bagData.rbc_expiry} />
                <CountdownTimer label="Plasma" expiryDate={bagData.plasma_expiry} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: ABO, REPORT TEST FILE & NOTES */}
              <div className="space-y-8">
                {/* DUAL-DROPDOWN FAILSAFE */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-5 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Beaker className="text-secondary" size={20} />
                    </div>
                    <h3 className="font-black text-gray-800 tracking-tight text-lg">ABO/Rh Verification</h3>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-600">
                        1. Select Lab-Verified ABO/Rh
                      </label>
                      <select 
                        className="w-full pl-6 pr-8 py-4 bg-gray-50/80 rounded-xl focus:bg-white border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-bold text-gray-700 transition-all shadow-sm"
                        value={abo1}
                        onChange={(e) => setAbo1(e.target.value)}
                      >
                        <option value="" disabled>-- Select Blood Type --</option>
                        {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-bold text-gray-600">
                        2. Confirm Lab-Verified ABO/Rh
                      </label>
                      <select 
                        className={`w-full pl-6 pr-8 py-4 rounded-xl border-2 focus:ring-4 outline-none appearance-none cursor-pointer font-bold transition-all shadow-sm ${
                          isAboMismatch 
                            ? 'border-red-400 bg-red-50 text-red-700 focus:ring-red-100' 
                            : isAboMatched 
                              ? 'border-green-400 bg-green-50 text-green-700 focus:ring-green-100' 
                              : 'bg-gray-50/80 border-gray-200 text-gray-700 focus:bg-white focus:border-secondary focus:ring-secondary/10'
                        }`}
                        value={abo2}
                        onChange={(e) => setAbo2(e.target.value)}
                      >
                        <option value="" disabled>-- Confirm Blood Type --</option>
                        {bloodTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>

                    {/* Failsafe Alerts */}
                    {isAboMismatch && (
                      <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-bold border border-red-200 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle size={18} />
                        <p>Mismatch detected. Both selections must be identical.</p>
                      </div>
                    )}
                    {isAboMatched && (
                      <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl text-sm font-bold border border-green-200 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 size={18} />
                        <p>ABO/Rh visually confirmed and matched.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* REPORT TEST FILE */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-5 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <ClipboardList className="text-secondary" size={20} />
                    </div>
                    <h3 className="font-black text-gray-800 tracking-tight text-lg">Report Test File</h3>
                  </div>
                  <div className="p-8">
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${isDragging ? 'border-secondary bg-secondary/5 scale-[1.02]' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'}`}
                    >
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3 w-full h-full">
                        <div className={`p-4 rounded-full ${isDragging ? 'bg-secondary/10 text-secondary' : 'bg-white text-gray-400 shadow-sm'} transition-colors`}>
                          <Upload size={32} className={isDragging ? 'animate-bounce' : ''} />
                        </div>
                        
                        {reportFile ? (
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-800 block truncate max-w-xs">{reportFile.name}</span>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">Ready for upload</span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-700 block">Click to upload or drag and drop</span>
                            <span className="text-xs font-medium text-gray-400">PDF, JPG, PNG (Max 10MB)</span>
                          </div>
                        )}
                      </label>
                      {reportFile && (
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setReportFile(null); }}
                          className="mt-4 text-xs bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold px-4 py-2 rounded-lg transition-colors"
                        >
                          Remove file
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* TECHNICIAN NOTES */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-5 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText className="text-secondary" size={20} />
                    </div>
                    <h3 className="font-black text-gray-800 tracking-tight text-lg">Technician Notes</h3>
                  </div>
                  <div className="p-8">
                    <textarea 
                      placeholder="Add any irregularities, visual observations, or additional context here..."
                      className="w-full p-5 bg-gray-50/80 rounded-xl focus:bg-white border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-medium min-h-[120px] resize-y shadow-inner"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: INFECTIOUS DISEASE MARKERS */}
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow duration-300 h-fit">
                <div className="bg-gray-50/50 border-b border-gray-100 px-8 py-5 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <ShieldAlert className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 tracking-tight text-lg">Infectious Disease Markers</h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">Strict binary input required.</p>
                  </div>
                </div>
                
                <div className="p-2">
                  <div className="divide-y divide-gray-100/60">
                    {Object.keys(markers).map((disease) => (
                      <div key={disease} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors rounded-xl">
                        <span className="font-bold text-gray-700 text-sm">{disease}</span>
                        <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200 w-full sm:w-auto shadow-inner">
                          {['Negative', 'Pending', 'Positive'].map((status) => {
                            const isSelected = markers[disease] === status;
                            let btnClass = 'text-gray-500 hover:text-gray-700 hover:bg-white/50';
                            
                            if (isSelected) {
                              if (status === 'Negative') btnClass = 'bg-green-500 text-white shadow-md font-bold ring-1 ring-black/5';
                              else if (status === 'Positive') btnClass = 'bg-red-500 text-white shadow-md font-bold ring-1 ring-black/5';
                              else btnClass = 'bg-white text-gray-800 shadow-sm border border-gray-200 font-bold';
                            }

                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => handleMarkerChange(disease, status)}
                                className={`flex-1 sm:px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${btnClass}`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Disease Section */}
                  <div className="p-6 mt-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 m-2">
                    {isAddingDisease ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in zoom-in duration-300">
                        <input
                          type="text"
                          value={newDiseaseName}
                          onChange={(e) => setNewDiseaseName(e.target.value)}
                          onKeyDown={handleDiseaseInputKeyDown}
                          placeholder="Type disease name..."
                          className="w-full sm:flex-1 p-3.5 bg-white rounded-xl border border-gray-200 text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none transition-shadow font-bold shadow-sm"
                          autoFocus
                        />
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button 
                            type="button" 
                            onClick={handleAddDisease} 
                            disabled={!newDiseaseName.trim()}
                            className="flex-1 sm:flex-none bg-primary text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-md"
                          >
                            Add
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setIsAddingDisease(false)} 
                            className="flex-1 sm:flex-none text-gray-500 px-5 py-3.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-700 text-sm font-bold transition-colors shadow-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingDisease(true)} 
                        className="flex items-center justify-center w-full gap-2 text-secondary hover:text-primary bg-white border border-gray-200 hover:border-secondary/30 px-4 py-4 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md"
                      >
                        <Plus size={18} /> Add Custom Protocol Marker
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between bg-white rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sm:p-8 mt-4">
                <div className="mb-4 sm:mb-0 w-full sm:w-auto text-center sm:text-left">
                  <button type="button" onClick={resetForm} className="text-gray-500 hover:text-red-600 font-bold px-4 py-2 transition-colors">
                    Cancel & Clear Form
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  {!isFormValid && (
                    <span className="text-sm font-bold text-orange-500 flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl">
                      <AlertCircle size={16} />
                      Complete all required fields.
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="w-full sm:w-auto bg-primary hover:bg-secondary disabled:bg-gray-200 disabled:text-gray-400 text-white font-black px-10 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:shadow-none hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {isSubmitting ? 'Securing Record...' : 'Sign & Submit Results'}
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  );
}

// Subcomponent: Live Countdown Timer (Maintains Red Alert Logic)
function CountdownTimer({ label, expiryDate }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const total = Date.parse(expiryDate) - Date.parse(new Date());
      
      if (total <= 0) {
        setTimeLeft('EXPIRED');
        setIsUrgent(true);
        return;
      }

      const days = Math.floor(total / (1000 * 60 * 60 * 24));
      const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((total / 1000 / 60) % 60);
      const seconds = Math.floor((total / 1000) % 60);

      // Warning color if under 48 hours (The Red Alert Logic)
      setIsUrgent(total < 48 * 60 * 60 * 1000);

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  return (
    <div className={`rounded-2xl p-5 flex-grow xl:flex-grow-0 min-w-[160px] flex items-center gap-3 transition-colors duration-500 shadow-sm border ${
      isUrgent ? 'bg-red-50 border-red-200 text-red-800 shadow-red-100' : 'bg-gray-50/80 border-gray-200 text-gray-800'
    }`}>
      <div className={`p-2 rounded-lg ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-white text-gray-400 shadow-sm'}`}>
        <Clock size={20} className={isUrgent ? 'animate-pulse' : ''} />
      </div>
      <div>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
          {label} Expiry
        </p>
        <p className={`font-mono font-black tracking-tight text-lg ${isUrgent ? 'text-red-700' : 'text-gray-800'}`}>
          {timeLeft}
        </p>
      </div>
    </div>
  );
}