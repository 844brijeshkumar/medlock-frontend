import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Loader2,
  ShieldAlert
} from 'lucide-react';

/**
 * INTAKE BOOKING FLOW (/donate)
 * Part 1: Eligibility Gatekeeper
 * Part 2: Slot Booking
 */

// --- Native Date Helpers (Replacing date-fns) ---
const getFutureIsoDate = (daysToAdd) => {
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString();
};

const formatToShortDate = (isoString) => {
  return new Date(isoString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const formatToLongDate = (dateObj) => {
  return dateObj.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// --- Mock Axios ---
const mockAxios = {
  post: async (url, payload, config) => {
    await new Promise(r => setTimeout(r, 1200));
    if (!config?.headers?.Authorization) throw new Error("401 Unauthorized");
    return { data: { success: true, message: "Operation successful" } };
  },
  get: async (url, config) => {
    await new Promise(r => setTimeout(r, 1000));
    if (!config?.headers?.Authorization) throw new Error("401 Unauthorized");
    
    return {
      data: {
        slots: [
          { id: 's1', date: getFutureIsoDate(1), time: '09:00 AM', location: 'Main Clinic', zone: 'Zone 1' },
          { id: 's2', date: getFutureIsoDate(1), time: '10:30 AM', location: 'Main Clinic', zone: 'Zone 1' },
          { id: 's3', date: getFutureIsoDate(2), time: '01:00 PM', location: 'North Branch', zone: 'Zone 2' },
          { id: 's4', date: getFutureIsoDate(3), time: '11:15 AM', location: 'East Wing', zone: 'Zone 3' },
          { id: 's5', date: getFutureIsoDate(3), time: '02:00 PM', location: 'Main Clinic', zone: 'Zone 1' },
        ]
      }
    };
  }
};

const QUESTIONS = [
  { id: 'infection', text: "Are you currently taking antibiotics or recovering from an infection?", deferralDays: 14, trigger: "ACTIVE_INFECTION" },
  { id: 'tattoo', text: "Have you had a tattoo, piercing, or acupuncture in the last 6 months?", deferralDays: 180, trigger: "RECENT_TATTOO" },
  { id: 'travel', text: "Have you traveled outside the country in the last 3 months?", deferralDays: 90, trigger: "INTERNATIONAL_TRAVEL" }
];

// --- Sub-Components ---

const DeferralAlert = ({ reason, days }) => {
  const eligibleDate = new Date();
  eligibleDate.setDate(eligibleDate.getDate() + (days || 0));

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-lg w-full animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-amber-500 h-2 w-full" />
      <div className="p-8 text-center">
        <div className="mx-auto bg-amber-100 text-amber-600 w-16 h-16 flex items-center justify-center rounded-full mb-6">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Temporary Deferral</h2>
        <p className="text-slate-600 mb-6">
          For your safety and the safety of patients, we must pause your booking process.
        </p>
        
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-left space-y-3">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Reason Triggered</span>
            <p className="font-medium text-slate-800">{reason}</p>
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Next Eligible Date</span>
            <div className="flex items-center gap-2 font-bold text-emerald-600">
              <CalendarIcon size={16} />
              {formatToLongDate(eligibleDate)}
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()} 
          className="text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

const SlotBooking = ({ onBookingComplete }) => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState(null);

  // Filter States
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedHospital, setSelectedHospital] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    let isMounted = true;
    mockAxios.get('/api/v1/clinics/slots', { headers: { Authorization: 'Bearer mock_jwt' } })
      .then(res => {
        if (isMounted) {
          setSlots(res.data.slots);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Failed to fetch slots", err);
          setLoading(false);
        }
      });
      return () => { isMounted = false; };
  }, []);

  const handleBook = async (slotId) => {
    setBookingSlotId(slotId);
    try {
      await mockAxios.post('/api/v1/appointments/book', { slot_id: slotId }, { headers: { Authorization: 'Bearer mock_jwt' } });
      onBookingComplete();
    } catch (err) {
      alert("This slot was just booked by someone else! Please select another.");
      setBookingSlotId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center py-12">
        <Loader2 className="animate-spin text-red-600 mb-4" size={32} />
        <p className="text-slate-500 font-medium">Finding available slots near you...</p>
      </div>
    );
  }

  // Filter Logic
  const availableZones = ['All', ...new Set(slots.map(s => s.zone))];
  const availableHospitals = ['All', ...new Set(slots
    .filter(s => selectedZone === 'All' || s.zone === selectedZone)
    .map(s => s.location)
  )];
  
  const filteredSlots = slots.filter(slot => {
    const slotDateStr = new Date(slot.date).toISOString().split('T')[0];
    const matchZone = selectedZone === 'All' || slot.zone === selectedZone;
    const matchHospital = selectedHospital === 'All' || slot.location === selectedHospital;
    const matchDate = !selectedDate || slotDateStr === selectedDate;
    return matchZone && matchHospital && matchDate;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-2xl w-full">
      <div className="bg-emerald-500 h-2 w-full" />
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">You're Eligible!</h2>
            <p className="text-slate-500 text-sm">Select a hospital zone, specific hospital, and date to find available time slots.</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hospital Zone</label>
            <select 
              value={selectedZone}
              onChange={(e) => {
                setSelectedZone(e.target.value);
                setSelectedHospital('All');
              }}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {availableZones.map(zone => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Hospital</label>
            <select 
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              {availableHospitals.map(hospital => (
                <option key={hospital} value={hospital}>{hospital}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Specific Date</label>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredSlots.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <CalendarIcon className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-500 font-medium">No slots found for this selection.</p>
              <button 
                onClick={() => { setSelectedZone('All'); setSelectedHospital('All'); setSelectedDate(''); }}
                className="text-emerald-600 text-sm font-semibold mt-2 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredSlots.map(slot => (
              <div key={slot.id} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between hover:border-emerald-300 hover:shadow-sm transition-all gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
                  <div className="flex items-center gap-2 text-slate-800 font-bold w-36">
                    <CalendarIcon size={18} className="text-slate-400 shrink-0" />
                    {formatToShortDate(slot.date)}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 w-24">
                    <Clock size={18} className="text-slate-400 shrink-0" />
                    {slot.time}
                  </div>
                  <div className="text-sm text-slate-700 bg-slate-100 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                    <span className="text-emerald-600 font-bold">{slot.zone}:</span> {slot.location}
                  </div>
                </div>
                <button
                  onClick={() => handleBook(slot.id)}
                  disabled={bookingSlotId !== null}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {bookingSlotId === slot.id ? <Loader2 size={16} className="animate-spin" /> : 'Select'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [deferralData, setDeferralData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flowComplete, setFlowComplete] = useState(false);

  const isGatekeeperComplete = stepIndex >= QUESTIONS.length;
  // Safely fallback if out of bounds
  const currentQuestion = QUESTIONS[stepIndex] || QUESTIONS[QUESTIONS.length - 1];

  const handleAnswer = async (answer) => {
    if (answer === 'yes') {
      setIsProcessing(true);
      try {
        const eligibleDate = new Date();
        eligibleDate.setDate(eligibleDate.getDate() + (currentQuestion?.deferralDays || 0));
        
        await mockAxios.post('/api/v1/user/deferral', {
          deferral_trigger: currentQuestion?.trigger,
          calculated_eligibility_date: eligibleDate.toISOString()
        }, { headers: { Authorization: 'Bearer mock_jwt' } });
        
        setDeferralData({ reason: currentQuestion?.text, days: currentQuestion?.deferralDays });
      } catch (err) {
        // Fail gracefully
        setDeferralData({ reason: currentQuestion?.text, days: currentQuestion?.deferralDays });
      } finally {
        setIsProcessing(false);
      }
    } else {
      setStepIndex(prev => prev + 1);
    }
  };

  if (flowComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="mx-auto bg-emerald-100 text-emerald-600 w-20 h-20 flex items-center justify-center rounded-full mb-6">
            <Heart size={40} className="fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Appointment Confirmed</h2>
          <p className="text-slate-600">Thank you for scheduling your life-saving donation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {deferralData ? (
        <DeferralAlert reason={deferralData.reason} days={deferralData.days} />
      ) : isGatekeeperComplete ? (
        <SlotBooking onBookingComplete={() => setFlowComplete(true)} />
      ) : (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 max-w-lg w-full">
          {/* Progress Bar safely cast to string */}
          <div className="bg-slate-100 h-1.5 w-full">
            <div 
              className="bg-red-600 h-full transition-all duration-300 ease-out" 
              style={{ width: (((stepIndex + 1) / QUESTIONS.length) * 100) + '%' }}
            />
          </div>

          <div className="p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              Safety Check — Question {stepIndex + 1} of {QUESTIONS.length}
            </div>

            <h2 className="text-2xl font-bold text-slate-800 leading-tight mb-8 min-h-[5rem]">
              {currentQuestion?.text}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
                disabled={isProcessing}
                onClick={() => handleAnswer('yes')}
                className="py-5 px-4 rounded-xl border-2 border-slate-100 hover:border-red-200 hover:bg-red-50 text-slate-700 font-bold transition-all text-center disabled:opacity-50"
              >
                {isProcessing ? <Loader2 size={24} className="animate-spin mx-auto text-red-500" /> : 'Yes'}
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleAnswer('no')}
                className="py-5 px-4 rounded-xl border-2 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 text-slate-700 font-bold transition-all text-center disabled:opacity-50"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}