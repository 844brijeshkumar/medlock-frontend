import React, { useState, useEffect } from "react";
import {
  Search,
  ShieldCheck,
  AlertCircle,
  Fingerprint,
  MessageSquare,
  Activity,
  FileText,
  Download,
  BrainCircuit,
  ArrowRight,
  Lock,
  ChevronLeft,
} from "lucide-react";
import {
  sendOtpForReport,
  verifyOtpForReport,
  verifyPatientAdhaar,
} from "../../../api/auth";
const token = localStorage.getItem("token");
const PatientLookUp = () => {
  const [step, setStep] = useState(1);
  const [reports, setReports] = useState();
  const [aadhaar, setAadhaar] = useState("");
  const [otp, setOtp] = useState(""); // New state for OTP input
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(true);

  // --- Step Handlers ---
  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const verifyPatient = async () => {
    try {
      setIsVerifying(true);

      const result = await verifyPatientAdhaar(token, aadhaar);
      if (!result.status) {
        setIsVerifying(false);
      }
      if (result.status) {
        handleNext();
        setIsVerifying(false);
      }
    } catch (error) {
      setIsVerifying(false);

      console.error("Failed to send OTP", error);
    }
  };

  // Connect to Backend to "Send" OTP
  const triggerSendOtp = async () => {
    setIsVerifying(true);
    try {
      const result = await sendOtpForReport(token, aadhaar);

      // In simulation, we stay on Step 3 but stop the spinner to show OTP input
      setIsVerifying(false);
      handleNext();
    } catch (error) {
      console.error("Failed to send OTP", error);
      setIsVerifying(false);
    }
  };

  // Connect to Backend to "Verify" OTP
  const verifyOtp = async () => {
    setIsVerifying(true);
    const data = {
      aadhaar,
      otp,
    };
    try {
      const response = await verifyOtpForReport(token, data);
      console.log(response);

      if (response.status) {
        setIsVerifying(false);
        setReports(response?.groupedReports);
        handleNext(); // Move to Dashboard (Step 4)
      } else {
        alert("Invalid OTP");
        setIsVerifying(false);
      }
    } catch (error) {
      console.error("Verification error", error);
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => setIsAiThinking(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // --- UI Components ---
  const Header = () => (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <div className="bg-secondary p-2 rounded-xl">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">
          MedLock
        </h1>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
          Session Security: High
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Terminal ID: ML-8829-QX
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-50 p-6 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl shadow-blue-100 border border-slate-100 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-1 bg-slate-100 flex">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-full transition-all duration-500 ${step >= i ? "bg-primary w-1/4" : "w-0"}`}
            />
          ))}
        </div>

        <div className="p-10">
          <Header />

          {/* STEP 1: LOOKUP */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="max-w-md mx-auto text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Patient Lookup
                </h2>
                <p className="text-slate-500 mb-8">
                  Enter the patient's 12-digit Aadhaar to begin record
                  retrieval.
                </p>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="0000 0000 0000"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-xl font-mono focus:border-secondary focus:outline-none transition-all"
                    value={aadhaar}
                    onChange={(e) =>
                      setAadhaar(e.target.value.replace(/\D/g, ""))
                    }
                  />
                </div>
                <button
                  disabled={aadhaar.length !== 12}
                  onClick={verifyPatient}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-primary via-primary/70 to-primary/60 text-white rounded-2xl font-bold disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-primary/80 transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <>
                      Verify Identity <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GATEWAY */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in zoom-in-95 duration-300">
              <div
                onClick={triggerSendOtp}
                className="group p-8 border-2 border-slate-100 rounded-[2rem] hover:border-primary transition-all cursor-pointer bg-white shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-blue-50 text-[#2563eb] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Fingerprint size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  Patient Self-Verify
                </h3>
                <p className="text-slate-500 text-sm">
                  Requires OTP or Biometric consent from the patient's linked
                  device.
                </p>
              </div>

              <div
                onClick={handleNext}
                className="group p-8 border-2 border-slate-100 rounded-[2rem] hover:border-primary transition-all cursor-pointer bg-white shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <AlertCircle size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2 text-emerald-700">
                  Emergency Bypass
                </h3>
                <p className="text-slate-500 text-sm">
                  Immediate access for critical care. Actions are flagged for
                  ethical review.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: AUTHENTICATION */}
          {step === 3 && (
            <div className="text-center py-10 animate-in fade-in">
              {isVerifying ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Processing Secure Request...
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="max-w-sm mx-auto space-y-4">
                  <Lock className="mx-auto text-slate-300 mb-4" size={48} />
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="ENTER 4-DIGIT OTP"
                    className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center text-2xl font-mono tracking-widest focus:border-primary focus:outline-none transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                  <button
                    disabled={otp.length !== 4}
                    onClick={verifyOtp}
                    className="w-full py-4 bg-gradient-to-r from-primary via-primary/70 to-primary/60 text-white rounded-2xl font-bold hover:bg-primary/80 transition-all disabled:opacity-50"
                  >
                    Confirm Verification
                  </button>
                  <p className="text-[10px] text-slate-400 pt-6 uppercase">
                    Check your server console for the simulated OTP code.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: DASHBOARD (UI remains the same) */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {/* ... (Keep your original Dashboard code here) ... */}
              <div className="p-[2px] rounded-3xl bg-gradient-to-r from-primary via-primary/70 to-primary/60 ">
                <div className="bg-white rounded-[calc(1.5rem-1px)] p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="text-secondary" size={20} />
                    <h3 className="font-bold text-slate-800 uppercase tracking-tight">
                      AI Clinical Insights
                    </h3>
                  </div>
                  {isAiThinking ? (
                    <div className="flex items-center gap-3 text-slate-400 py-4 animate-pulse">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-sm italic">
                        Analyzing history...
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-1000">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-primary uppercase mb-1">
                            Clinical Brief
                          </p>
                          <p className="text-sm text-black leading-relaxed">
                            Patient shows chronic Type-2 Diabetes management.
                            Last three consults indicate stable glucose levels
                            but increasing BMI trends.
                          </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-primary uppercase mb-1">
                            Key Trends
                          </p>
                          <ul className="text-sm text-black space-y-1">
                            <li>↑ BP: 142/90 (Last 30 days)</li>
                            <li>↓ LDL: 110mg/dL (Improving)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* ... (Vitals Grid & Report Vault remains same) ... */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    label: "BP",
                    value: "120/80",
                    unit: "mmHg",
                    icon: Activity,
                    color: "text-rose-500",
                  },
                  {
                    label: "Heart Rate",
                    value: "72",
                    unit: "bpm",
                    icon: Activity,
                    color: "text-emerald-500",
                  },
                  {
                    label: "SpO2",
                    value: "98",
                    unit: "%",
                    icon: Activity,
                    color: "text-blue-500",
                  },
                ].map((v, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm"
                  >
                    <v.icon className={v.color} size={20} />
                    <p className="text-2xl font-bold text-slate-800 mt-2">
                      {v.value}
                    </p>
                    <p className="text-xs text-slate-400 uppercase font-bold">
                      {v.label} ({v.unit})
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Reports</h3>
                  <button className="text-primary text-sm font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {reports?.map((report, i) => (
                    <div
                      key={i}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <FileText size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {report.Title__c}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {report.Date_of_expire__c} • {report.Category__c}
                          </p>
                        </div>
                      </div>
                      <a
                        href={report?.URL__c?.replace(
                          "/upload/",
                          "/upload/fl_attachment/",
                        )}
                        download
                        className="p-2 hover:bg-white rounded-full transition-shadow border border-slate-100 shadow-sm"
                      >
                        <Download size={16} className="text-secondary" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest pt-4">
                End of Encrypted Record • Audit Hash: 0x992...22B1
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step > 1 && step < 4 && (
          <div className="px-10 pb-10">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors font-bold text-sm"
            >
              <ChevronLeft size={16} /> Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLookUp;
