import React, { useState, useRef, useEffect } from "react";
import {
  X,
  CheckCircle,
  Globe,
  QrCode,
  AlertCircle,
  Share2,
  Download,
  Building,
  Stethoscope,
  ChevronDown,
  Calendar,
  ArrowRight,
  Loader2,
  Phone,
  User,
  Copy,
  Check,
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
// import { Hospital, BookingFormData, BookingReceipt } from '../types';
import { timeSlots, mockPatient } from "../../utils/constants";
import { createOpdTicket } from "../../api/auth";
const token = localStorage.getItem("token");

const BookingModal = ({ hospital, onClose }) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Simulating Connection, 3: Success
  const [formData, setFormData] = useState({
    department: "",
    date: new Date().toISOString().split("T")[0],
    slot: "",
    patientName: localStorage.getItem("dashboardName") || "",
    aadhaar: mockPatient.aadhaar,
  });

  const [loadingStatus, setLoadingStatus] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareSupported, setShareSupported] = useState(
    typeof navigator !== "undefined" && !!navigator.share
  );
  const [copied, setCopied] = useState(false);

  const receiptRef = useRef(null);
  const specialties = [
    "Cardiology",
    "Neurology",
    "Oncology",
    "General Surgery",
    "Nephrology",
  ];

  const handleBook = () => {
    setStep(2);

    const runSimulation = async () => {
      setLoadingStatus(`Establishing secure connection to ${hospital.Name}...`);
      await new Promise((r) => setTimeout(r, 1000));

      setLoadingStatus(`Verifying availability for ${formData.slot}...`);
      await new Promise((r) => setTimeout(r, hospital.apiLatency));

      setLoadingStatus("Generating Official OPD Ticket...");
      await new Promise((r) => setTimeout(r, 800));

      const res = await createOpdTicket(
        token,
        hospital.Id,
        formData.slot,
        formData.department,
        hospital.Name
      );

      // Generate "Official" ID
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const officialId = res?.ticket?.appointmentId || `OPD${randomNum}`;

      setBookingDetails({
        ...formData,
        id: officialId,
        timestamp: new Date().toLocaleString(),
        hospitalName: hospital?.Name,
        hospitalLocation: hospital?.Address__c,
        hospitalDistrict: hospital?.District__r.Name,
        hospitalState: hospital?.State__r.Name,
        patientName: localStorage.getItem("dashboardName"),
      });
      setStep(3);
    };

    runSimulation();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current || !bookingDetails) return;
    setIsDownloading(true);

    try {
      // Wait a moment for icons to render fully
      await new Promise((r) => setTimeout(r, 500));

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        height: receiptRef.current.scrollHeight,
        windowHeight: receiptRef.current.scrollHeight + 50, // Ensure full height capture
      });

      const imgData = canvas.toDataURL("image/png");

      // PDF Setup
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Fit to page logic: if image is taller than page, scale it down
      if (imgHeight > pageHeight) {
        const scaleFactor = pageHeight / imgHeight;
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = pageHeight;
        const xOffset = (pageWidth - scaledWidth) / 2; // Center horizontally

        pdf.addImage(imgData, "PNG", xOffset, 0, scaledWidth, scaledHeight);
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`MedLock-Receipt-${bookingDetails.id}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!bookingDetails) return;
    setIsSharing(true);

    const shareData = {
      title: "MedLock OPD Booking",
      text: `OPD Booking Confirmed for ${bookingDetails.patientName} at ${bookingDetails.hospitalName}. \nSlot: ${bookingDetails.date} @ ${bookingDetails.slot}\nID: ${bookingDetails.id}`,
      url: window.location.href, // Ideally this would be a deep link to the booking
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing", error);
    } finally {
      setIsSharing(false);
    }
  };

  // --- STEP 3: OFFICIAL RECEIPT ---
  if (step === 3 && bookingDetails) {
    const qrData = JSON.stringify({
      id: bookingDetails.id,
      hospital: bookingDetails.hospitalName,
      patient: bookingDetails.patientName,
      date: bookingDetails.date,
      slot: bookingDetails.slot,
    });
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      qrData
    )}`;

    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white z-50 bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="bg-[#0f766e] p-8 text-center relative rounded-t-3xl">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">
                Ticket Booked
              </h2>
              <p className="text-sm text-emerald-100 mt-1">
                Your booking was successful
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-8 text-center bg-gray-50 rounded-b-3xl">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                  Ticket ID
                </p>
                <p className="text-xl font-mono font-bold text-gray-800">
                  {bookingDetails.id}
                </p>
              </div>

              <div className="pt-4 border-t border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                  Patient Name
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {bookingDetails.patientName}
                </p>
              </div>

              <div className="pt-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                  ✔ Confirmed
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-xl bg-[#0f766e] text-white font-bold hover:bg-[#115e59] transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: CONNECTING LOADER ---
  if (step === 2) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
            <Building className="absolute inset-0 m-auto text-teal-600 w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            MedLock Secure Connect
          </h3>
          <p className="text-sm text-gray-500 font-medium animate-pulse">
            {loadingStatus}
          </p>
          <div className="mt-6 flex justify-center space-x-1">
            <span
              className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "0s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 1: FORM ---
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-teal-700 p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-100 text-[10px] font-bold border border-green-400/30 uppercase tracking-wider">
                Online
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-100 text-[10px] font-bold border border-blue-400/30 uppercase tracking-wider">
                Verified
              </span>
            </div>
            <h2 className="text-2xl font-bold flex items-center">
              {hospital.Name}
            </h2>
            <p className="text-teal-100 text-sm mt-1 flex items-center opacity-90">
              <Building className="w-4 h-4 mr-1.5" />
              Official Booking Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-teal-100 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form className="space-y-6">
            {/* Department Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Department
              </label>
              <div className="relative group">
                <Stethoscope className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <select
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none appearance-none bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  <option value="">Choose Specialty...</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Preferred Date
              </label>
              <div className="relative group">
                <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 hover:bg-white transition-colors cursor-pointer"
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  value={formData.date}
                />
              </div>
            </div>

            {/* Time Slot Selection */}
            <div>
              <label className=" text-sm font-bold text-gray-700 mb-3 flex justify-between">
                Available Slots
                <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  Live Status: Open
                </span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData({ ...formData, slot: slot })}
                    className={`px-2 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      formData.slot === slot
                        ? "bg-teal-600 text-white border-teal-600 shadow-md transform scale-105"
                        : "bg-white text-gray-600 border-gray-200 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
              {formData.patientName.charAt(0)}
            </div>
            <div className="text-sm">
              <div className="font-bold text-gray-800 flex items-center gap-2">
                {formData.patientName}
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-[10px] font-normal text-gray-600">
                  You
                </span>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                {formData.aadhaar}
              </div>
            </div>
          </div>

          <button
            onClick={handleBook}
            disabled={!formData.department || !formData.date || !formData.slot}
            className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-lg shadow-teal-200 flex items-center transition-all transform active:scale-95 ${
              !formData.department || !formData.date || !formData.slot
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-teal-600 hover:bg-teal-700 hover:-translate-y-0.5"
            }`}
          >
            Confirm Booking
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
