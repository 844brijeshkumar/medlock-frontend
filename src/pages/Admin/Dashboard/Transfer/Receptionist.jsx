import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Hospital as HospitalIcon,
  ArrowRight,
  CheckCircle2,
  Building2,
  ChevronDown,
  Search,
  IdCard,
  User,
  ArrowLeftRight,
  Users,
} from "lucide-react";
import {
  getReceptionistForAdmin,
  getHospitalForAdmin,
  transferDoctor,
  transferReceptionist,
} from "../../../../api/auth";
import { useToast } from "../../../../utils/ToastContext";

export default function ReceptionistTransfer() {
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [targetBranchId, setTargetBranchId] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  const [hospitals, setHospitals] = useState([]);
  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);
  // --- THEME CONFIGURATION ---
  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch both doctors and hospitals (adjust endpoints to your actual routes)
        const [docRes, hospRes] = await Promise.all([
          getReceptionistForAdmin(token),
          getHospitalForAdmin(token),
        ]);

        if (docRes.status) setReceptionists(docRes.receptionists);
        if (hospRes.status) setHospitals(hospRes.hospitals);
      } catch (err) {
        console.error("Failed to load transfer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const staffList = receptionists;

  // Find the selected rece and their current location
  const selectedStaff = staffList?.find((s) => s.Id === selectedStaffId);
  const currentHospital = hospitals?.find(
    (h) => h.Id === selectedStaff?.Hospital__c,
  );

  // Filter out the current hospital so they can't transfer to the same place
  const availableHospitals = hospitals?.filter(
    (h) => h.Id !== selectedStaff?.Hospital__c,
  );

  useEffect(() => {
    setTargetBranchId("");
  }, [selectedStaffId]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!selectedStaffId || !targetBranchId) return;

    setIsProcessing(true);
    const data = {
      receptionistId: selectedStaffId, // The Salesforce ID of the doctor
      newHospitalId: targetBranchId, // The Salesforce ID of the new branch
    };
    try {
      const token = localStorage.getItem("token"); // Assuming your token is stored here

      const response = await transferReceptionist(token, data);

      if (response.status) {
        setIsSuccess(true);
        showToast({
          title: "Success",
          message: "Transfer Successful",
          type: "success",
        });
        // Reset form after success
        setTimeout(() => {
          setIsSuccess(false);
          setSelectedStaffId("");
          setTargetBranchId("");
          setReceptionists((prevReceptionist) =>
            prevReceptionist.map((doc) =>
              doc.Id === selectedStaffId
                ? { ...doc, Hospital__c: targetBranchId } // Update to the new branch locally
                : doc,
            ),
          );
        }, 200);
      } else {
        showToast({
          title: "Error",
          message: "Transfer failed. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      showToast({
        title: "Error",
        message: "Transfer failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="max-w-5xl mx-auto space-y-12 py-8 fade-in min-h-screen"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black tracking-tight text-primary">
          Receptionist Reassignment
        </h2>
        <p className="text-slate-500 font-medium">
          Transfer administrative staff to different branch locations within the
          network.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-secondary/5 p-10 animate-in fade-in slide-in-from-bottom-6 relative overflow-hidden">
        <form onSubmit={handleTransfer} className="space-y-10">
          {/* Section Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="p-4 bg-accent/30 text-secondary rounded-2xl shadow-sm">
              <ArrowLeftRight size={28} strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-primary">
                Transfer Details
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                Select Receptionist and Destination
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Member Search */}
            <div className="space-y-6">
              <SearchableSelect
                label="Search by Name or Receptionist ID"
                placeholder="Type ID or Name..."
                options={staffList?.map((s) => ({
                  id: s.Id,
                  label: s.Name,
                  sub: s.Receptionist_Id__c,
                  detail: "Front Desk Operations",
                }))}
                value={selectedStaffId}
                onChange={setSelectedStaffId}
              />

              {/* Selection Preview */}
              <div className="group">
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest ml-1">
                  Receptionist Profile
                </label>
                {selectedStaff ? (
                  <div className="h-[90px] bg-slate-50 border border-slate-100 rounded-2xl px-6 flex items-center gap-4 animate-in fade-in slide-in-from-right-4 transition-all hover:border-secondary/30">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 leading-none">
                        {selectedStaff.Name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-black text-white bg-secondary px-2 py-0.5 rounded uppercase">
                          {selectedStaff.Receptionist_Id__c}
                        </span>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          Front Desk Operations
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[90px] bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                    Awaiting Receptionist Selection
                  </div>
                )}
              </div>
            </div>

            {/* Transfer Symmetry Section */}
            <div
              className={`flex flex-col justify-between transition-all duration-500 ${!selectedStaffId ? "opacity-30 pointer-events-none grayscale" : "opacity-100"}`}
            >
              <div className="space-y-6">
                {/* Current Branch Display */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">
                    Current Branch
                  </label>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100 h-[80px] flex flex-col justify-center relative overflow-hidden group hover:border-amber-200 transition-colors">
                    <div className="absolute right-0 top-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                      <HospitalIcon size={60} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-sm font-bold text-amber-900 truncate">
                        {currentHospital?.Name || "---"}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-amber-600 ml-5 uppercase mt-1">
                      {currentHospital?.State__r.Name || "---"}
                    </p>
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className="flex justify-center -my-3 relative z-10">
                  <div className="bg-white p-2 rounded-full shadow-lg border border-slate-100 text-secondary">
                    <ArrowRight
                      size={20}
                      strokeWidth={3}
                      className="rotate-90 md:rotate-0"
                    />
                  </div>
                </div>

                {/* Target Branch Select */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2">
                    Target Branch
                  </label>
                  <div className="relative group">
                    <Building2
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-600/50 group-focus-within:text-emerald-600 transition-colors"
                      size={20}
                    />
                    <select
                      className="w-full bg-emerald-50 border-emerald-100 rounded-2xl pl-14 pr-10 h-[80px] text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-100 transition-all border appearance-none text-emerald-900 cursor-pointer hover:border-emerald-200"
                      value={targetBranchId}
                      onChange={(e) => setTargetBranchId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select Destination...
                      </option>
                      {availableHospitals?.map((h, index) => (
                        <option key={index} value={h.Id}>
                          {h.Name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SubmitButton
            label={isProcessing ? "Processing Transfer..." : "Confirm Transfer"}
            disabled={!targetBranchId || isProcessing}
          />
        </form>
      </div>
    </div>
  );
}

// --- Reused Components ---

function SearchableSelect({ label, placeholder, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const selectedOption = options?.find((o) => o.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options?.filter(
    (opt) =>
      opt.label?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      opt.sub?.toLowerCase().includes(searchTerm?.toLowerCase()),
  );

  return (
    <div className="group relative" ref={containerRef}>
      <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest group-focus-within:text-secondary transition-colors ml-1">
        {label}
      </label>
      <div
        className={`w-full bg-slate-50 border-transparent rounded-2xl px-6 py-4 text-sm font-semibold outline-none transition-all border hover:bg-white hover:border-secondary/20 hover:shadow-sm flex items-center justify-between cursor-pointer ${isOpen ? "ring-4 ring-secondary/10 border-secondary" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-slate-900" : "text-slate-300"}>
          {value
            ? `${selectedOption.label} (${selectedOption.sub})`
            : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-secondary" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-slate-50">
            <input
              autoFocus
              className="w-full bg-slate-50 rounded-xl px-4 py-2 text-sm outline-none font-bold placeholder:text-slate-300 text-slate-700"
              placeholder="Filter names or IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((opt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex flex-col gap-0.5 ${
                    value === opt.id
                      ? "bg-accent/30 text-primary"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span>{opt.label}</span>
                    <span className="text-[9px] font-black text-slate-400 bg-white/50 px-1.5 py-0.5 rounded uppercase">
                      {opt.sub}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase opacity-40 tracking-tight font-semibold">
                    {opt.detail}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 font-bold uppercase">
                No records found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SubmitButton({ label, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-4 rounded-2xl font-black transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-sm group ${
        disabled
          ? "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
          : "bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.01] active:scale-[0.99] shadow-secondary/20"
      }`}
    >
      {label}{" "}
      <ArrowRight
        size={18}
        className={
          !disabled ? "group-hover:translate-x-1 transition-transform" : ""
        }
      />
    </button>
  );
}
