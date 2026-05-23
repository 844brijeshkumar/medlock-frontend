import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  XCircle, 
  Mail,
  HeartPulse,
  Loader2
} from 'lucide-react';

export default function App() {
  // Navigation & Loading State
  const [step, setStep] = useState('idle'); // idle, method-select, otp-input, discovering, results
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Real Dynamic Data States
  const [abhaIdInput, setAbhaIdInput] = useState('');
  const [transactionId, setTransactionId] = useState(''); // ABDM Txn ID
  const [otpMethod, setOtpMethod] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [policies, setPolicies] = useState([]); // Will hold real NHCX policies
  const [authModes, setAuthModes] = useState([]); // Available auth modes from ABDM

  // Dynamic Patient State
  const [patient, setPatient] = useState({
    abhaId: "", 
    phoneMasked: "",
    emailMasked: ""
  });

  // Theme Config
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (step === 'otp-input' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && step === 'otp-input') {
      setError('OTP Expired. Please request a new one.');
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- API Handlers ---

  const handleStart = async () => {
    if (!abhaIdInput || abhaIdInput.trim().length < 14) {
      setError('Please enter a valid ABHA ID.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Fetch real auth modes and masked details from ABDM Sandbox
      const response = await fetch(`/api/abdm/fetch-modes?abhaId=${abhaIdInput}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to fetch ABHA details.");

      setAuthModes(data.authModes);
      setPatient({
        abhaId: abhaIdInput,
        phoneMasked: data.maskedPhone,
        emailMasked: data.maskedEmail
      });

      setStep('method-select');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMethod = async (methodType) => {
    setOtpMethod(methodType); // UI ref
    setIsLoading(true);
    setError('');

    try {
      // 2. Generate real OTP via ABDM
      const response = await fetch('/api/abdm/generate-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ abhaId: patient.abhaId, authMode: methodType })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to generate OTP.");

      setTransactionId(data.transactionId);
      setStep('otp-input');
      setTimer(60);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }
    
    setStep('discovering');
    setError('');

    try {
      // 3. Verify OTP and get Token
      const verifyResponse = await fetch('/api/abdm/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, otp: enteredOtp })
      });
      
      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.message || "Invalid OTP");

      // 4. Fetch real policies using the access token
      const discoverResponse = await fetch('/api/abdm/discover-policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          abhaId: patient.abhaId,
          accessToken: verifyData.accessToken
        })
      });

      const discoverData = await discoverResponse.json();
      if (!discoverResponse.ok) throw new Error(discoverData.message || "Failed to discover policies.");

      setPolicies(discoverData.policies || []);
      setStep('results');
    } catch (err) {
      setError(err.message);
      setStep('otp-input');
    }
  };

  const handleClearSession = () => {
    setStep('idle');
    setPolicies([]);
    setAbhaIdInput('');
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="space-y-8 p-4 md:p-10 fade-in bg-slate-50 min-h-screen relative font-sans text-slate-800"
         style={{ "--primary": theme.primary, "--secondary": theme.secondary, "--accent": theme.accent }}>
      
      <main className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
         
        {/* Step 1: Idle / Input State */}
        {step === 'idle' && (
          <div className="p-10 md:p-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2rem] bg-accent text-primary flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Shield size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-black tracking-tight text-primary mb-4">Health Insurance</h2>
            <p className="text-gray-500 max-w-lg mx-auto mb-8 text-lg font-medium">
              Securely fetch and view all your active health insurance policies across India using the NHCX network.
            </p>
            
            <div className="max-w-md mx-auto space-y-4 mb-8">
              <input
                type="text"
                value={abhaIdInput}
                onChange={(e) => setAbhaIdInput(e.target.value)}
                placeholder="Enter 14-digit ABHA ID"
                className="w-full p-4 border-2 border-gray-200 rounded-2xl text-center text-xl font-bold tracking-widest focus:border-secondary focus:ring-4 focus:ring-secondary/20 outline-none transition-all"
              />
              {error && <p className="text-red-500 text-sm font-bold flex items-center justify-center gap-1"><AlertCircle size={16} /> {error}</p>}
            </div>

            <button 
              onClick={handleStart}
              disabled={isLoading || !abhaIdInput}
              className="bg-primary disabled:bg-gray-300 hover:bg-secondary text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto text-lg w-full md:w-auto"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
              {isLoading ? "Verifying..." : "Fetch My Insurance Policies"}
            </button>
          </div>
        )}

        {/* Step 2: Select Auth Method */}
        {step === 'method-select' && (
          <div className="p-8 md:p-16 max-w-lg mx-auto my-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-3xl font-black text-primary tracking-tight mb-2 text-center">Verify Identity</h3>
            <p className="text-sm font-medium text-gray-500 mb-10 text-center">
              Where should we send your consent OTP for ABHA ID <br/>
              <span className="font-mono text-primary bg-accent/50 px-2 py-0.5 rounded-md mt-2 inline-block">{patient.abhaId}</span>?
            </p>
            
            <div className="space-y-4 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              )}

              {/* Dynamically render auth buttons based on what ABDM supports for this user */}
              {authModes.includes('MOBILE_OTP') && (
                <button onClick={() => handleSelectMethod('MOBILE_OTP')} className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] border-2 border-gray-100 hover:border-secondary transition-all text-left group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-secondary group-hover:bg-white"><Smartphone size={26} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-primary">Aadhaar Linked Mobile</h4>
                    <p className="text-xs font-medium text-gray-500 mt-1">SMS sent to {patient.phoneMasked}</p>
                  </div>
                </button>
              )}

              {authModes.includes('AADHAAR_OTP') && (
                <button onClick={() => handleSelectMethod('AADHAAR_OTP')} className="w-full flex items-center gap-5 p-5 rounded-[1.5rem] border-2 border-gray-100 hover:border-secondary transition-all text-left group">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-secondary group-hover:bg-white"><Mail size={26} /></div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-primary">Aadhaar Linked Email</h4>
                    <p className="text-xs font-medium text-gray-500 mt-1">OTP sent to {patient.emailMasked}</p>
                  </div>
                </button>
              )}
            </div>
            
            <button onClick={() => setStep('idle')} className="mt-10 w-full text-center text-sm font-bold text-gray-400 hover:text-primary transition-colors">Cancel Request</button>
          </div>
        )}

        {/* Step 3: OTP Input */}
        {step === 'otp-input' && (
          <div className="p-8 md:p-16 max-w-lg mx-auto text-center my-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-3xl font-black text-primary tracking-tight mb-2">Enter OTP</h3>
            <p className="text-sm font-medium text-gray-500 mb-10">Valid for 10 minutes.</p>
            
            <div className="flex justify-center gap-2 md:gap-3 mb-8">
              {otp.map((digit, idx) => (
                <input
                  key={idx} id={`otp-${idx}`} type="text" maxLength="1" value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-14 md:w-14 md:h-16 text-center text-xl md:text-2xl font-black border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-primary transition-all bg-gray-50/50"
                />
              ))}
            </div>

            {error && <div className="flex items-center justify-center gap-2 text-red-600 text-sm mb-6 bg-red-50 border border-red-100 p-4 rounded-xl font-medium"><AlertCircle size={18} /> {error}</div>}

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-10 font-bold bg-gray-50 py-2 px-4 rounded-full w-max mx-auto border border-gray-100">
               <Clock size={16} className={timer < 10 ? 'text-red-500' : 'text-secondary'} />
              <span className={timer < 10 ? 'text-red-500' : 'text-primary'}>00:{timer < 10 ? `0${timer}` : timer}</span>
            </div>

            <button 
              onClick={handleVerifyOtp} disabled={timer === 0}
              className={`w-full font-bold py-4 px-8 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-lg ${timer === 0 ? 'bg-gray-200 text-gray-400 shadow-none' : 'bg-primary hover:bg-secondary text-white shadow-primary/20'}`}
            >
              Verify & Fetch Policies
            </button>
            <button onClick={() => setStep('method-select')} className="mt-8 w-full text-center text-sm font-bold text-gray-400 hover:text-primary transition-colors">Change Method</button>
          </div>
        )}

        {/* Step 4: Loading State */}
        {step === 'discovering' && (
          <div className="p-20 md:p-32 text-center animate-in fade-in duration-500 flex flex-col items-center">
            <Loader2 className="animate-spin text-secondary mb-6" size={64} />
            <h3 className="text-3xl font-black text-primary tracking-tight mb-4">Broadcasting to NHCX</h3>
            <p className="text-gray-500 font-medium text-lg animate-pulse">Querying Payers securely. Gathering your active policies...</p>
          </div>
        )}

        {/* Step 5: Dynamic Results View */}
        {step === 'results' && (
          <div className="p-8 md:p-12 min-h-[500px] animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-8">
              <div>
                <h3 className="text-3xl font-black tracking-tight text-primary flex items-center gap-3">
                  <CheckCircle2 className="text-secondary" size={32} /> Discovery Complete
                </h3>
                <p className="text-gray-500 mt-2 font-medium">Found {policies.length} active policies linked to your ABHA ID.</p>
              </div>
              <span className="mt-6 md:mt-0 px-5 py-2.5 bg-accent/50 text-primary text-xs font-black rounded-full flex items-center gap-2 shadow-sm uppercase tracking-wider">
                <ShieldCheck size={16} className="text-secondary" /> Stateless View
              </span>
            </div>

            {policies.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-[2rem] border border-gray-100">
                <p className="text-xl font-bold text-gray-500">No active insurance policies found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {policies.map((policy, i) => (
                  <div key={i} className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all duration-300 bg-blue-50 text-blue-600 group-hover:bg-secondary group-hover:text-white`}>
                        <HeartPulse size={26} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{policy.insurer}</h3>
                          <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ml-2 whitespace-nowrap bg-green-50 text-green-600 border-green-100">{policy.status}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-1 group-hover:text-secondary">{policy.type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 p-5 bg-gray-50/50 rounded-2xl border border-gray-50 group-hover:border-secondary/20 transition-colors">
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-1">Plan Name</p>
                        <p className="font-bold text-gray-700">{policy.planName}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-1">Policy Number</p>
                        <p className="font-mono text-sm font-bold text-gray-700">{policy.id}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-1">Sum Insured</p>
                        <p className="font-black text-2xl text-primary">{policy.sumInsured}</p>
                      </div>
                      <div className="text-right flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                        <Clock size={14} className="text-secondary" /> Valid Till: {policy.validTill}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center pt-8 border-t border-gray-100">
              <button onClick={handleClearSession} className="text-gray-400 hover:text-red-500 text-sm font-bold transition-colors flex items-center justify-center gap-2 mx-auto group">
                <XCircle size={18} className="group-hover:scale-110 transition-transform" /> Clear Policies & End Session
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}