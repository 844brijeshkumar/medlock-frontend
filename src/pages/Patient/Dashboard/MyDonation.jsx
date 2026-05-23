import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Droplet, 
  Activity, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  AlertCircle,
  Loader2,
  Stethoscope,
  Search,
  Filter
} from 'lucide-react';

/**
 * DONATION HISTORY DASHBOARD
 * /my-donations Tracking Page
 */

// --- Mock Axios & API Service ---
// In a real app, this would be: import axios from 'axios';
const mockAxios = {
  get: async (url, config) => {
    console.log(`[Axios GET] ${url}`, config);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate checking for the Authorization header
    if (!config?.headers?.Authorization) {
      throw new Error("401 Unauthorized: Missing JWT Token");
    }

    // Mock API Response Payload
    return {
      data: {
        eligibility_status: "Eligible", // Toggle to "Deferred" to see the other state
        next_eligible_date: "2026-06-12T00:00:00.000Z",
        total_donations: 4,
        donation_records: [
          {
            id: 'don_8923',
            date: '2026-04-10T09:30:00.000Z',
            location: 'Downtown Medical Center',
            blood_type: 'O+',
            status: 'Testing'
          },
          {
            id: 'don_7451',
            date: '2025-11-05T14:15:00.000Z',
            location: 'Mobile Drive - Tech Campus',
            blood_type: 'O+',
            status: 'Transfused'
          },
          {
            id: 'don_6102',
            date: '2025-06-20T10:00:00.000Z',
            location: 'Downtown Medical Center',
            blood_type: 'O+',
            status: 'Transfused'
          }
        ]
      }
    };
  }
};

// --- Sub-Components ---

const ImpactCard = ({ totalDonations }) => {
  const livesSavedEstimate = totalDonations * 3;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 text-slate-50 opacity-50 pointer-events-none">
        <Heart size={200} className="fill-current" />
      </div>

      <div className="flex items-center gap-5 relative z-10">
        <div className="bg-red-50 p-4 rounded-full text-red-600">
          <Droplet size={32} className="fill-current" />
        </div>
        <div>
          <h2 className="text-slate-500 font-semibold uppercase tracking-wider text-sm mb-1">Your Lifetime Impact</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-800">{totalDonations}</span>
            <span className="text-slate-600 font-medium">Lifetime Donations</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-xl flex items-center gap-4 relative z-10 w-full sm:w-auto">
        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
          <Heart size={24} className="fill-current" />
        </div>
        <div>
          <div className="text-3xl font-bold text-emerald-700">{livesSavedEstimate}</div>
          <div className="text-emerald-700 text-sm font-semibold">Estimated Lives Saved</div>
        </div>
      </div>
    </div>
  );
};

const EligibilityBanner = ({ status, nextDate }) => {
  const isEligible = status === 'Eligible';

  if (isEligible) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-emerald-900 font-bold text-lg">You are Eligible to Donate</h3>
            <p className="text-emerald-700 text-sm mt-1">Your healthy baseline is cleared. Patients are waiting.</p>
          </div>
        </div>
        <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
          Book Now <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // Deferred State
  const formattedDate = new Date(nextDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-amber-100 p-3 rounded-full text-amber-600">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="text-amber-900 font-bold text-lg">Temporary Health Deferral</h3>
          <p className="text-amber-700 text-sm mt-1">
            For your safety, you are currently deferred.
          </p>
        </div>
      </div>
      <div className="bg-white border border-amber-200 px-5 py-3 rounded-xl flex items-center gap-3 text-amber-800 w-full sm:w-auto">
        <Calendar size={18} />
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold text-amber-600">Eligible After</span>
          <span className="font-bold">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

const JourneyTracker = ({ status }) => {
  const PIPELINE = [
    { id: 'Collected', icon: Droplet, label: 'Collected' },
    { id: 'Testing', icon: Activity, label: 'Testing' },
    { id: 'Available', icon: ShieldCheck, label: 'Available' },
    { id: 'Transfused', icon: Heart, label: 'Transfused' }
  ];

  const currentIndex = PIPELINE.findIndex(step => step.id === status);
  // Fallback in case of unexpected status
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="mt-6 pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 -z-10 rounded-full" />
        
        {/* Active Line Fill */}
        <div 
          className="absolute top-5 left-6 h-1 bg-red-500 -z-10 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `calc(${(safeIndex / (PIPELINE.length - 1)) * 100}% - 24px)` }}
        />

        {PIPELINE.map((step, index) => {
          const isCompleted = index <= safeIndex;
          const isActive = index === safeIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10 w-24">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                  isCompleted 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'bg-white border-slate-200 text-slate-300'
                } ${isActive ? 'ring-4 ring-red-100' : ''}`}
              >
                <Icon size={18} className={isCompleted ? (isActive ? 'animate-pulse' : '') : ''} />
              </div>
              <span className={`text-xs font-semibold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main Application Component ---

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulating Auth Token retrieval from LocalStorage/Context
        const token = "mock_jwt_token_12345";
        
        const response = await mockAxios.get('/api/v1/user/donations/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="animate-spin text-red-600 mb-4" size={48} />
          <p className="text-slate-500 font-medium">Securing connection & loading health data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // Derived state for filtering
  const availableYears = data ? [...new Set(data.donation_records.map(r => new Date(r.date).getFullYear().toString()))].sort((a, b) => b - a) : [];

  const filteredRecords = data ? data.donation_records.filter(record => {
    const matchesSearch = searchTerm === '' ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.location.toLowerCase().includes(searchTerm.toLowerCase());

    const recordYear = new Date(record.date).getFullYear().toString();
    const matchesDate = dateFilter === '' || recordYear === dateFilter;

    return matchesSearch && matchesDate;
  }) : [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Donations</h1>
          <p className="text-slate-500 mt-1">Track your impact and upcoming eligibility.</p>
        </div>

        {/* Component 1 & 2: Impact Card & Eligibility Banner */}
        <div className="space-y-6">
          <EligibilityBanner 
            status={data.eligibility_status} 
            nextDate={data.next_eligible_date} 
          />
          <ImpactCard totalDonations={data.totalDonations} />
        </div>

        {/* Component 3: Journey Timeline / History */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope size={24} className="text-slate-400" />
              Donation History
            </h2>
            
            {/* Filters */}
            {data && data.donation_records.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Location or Number..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-64"
                  />
                </div>
                <div className="relative flex-1 sm:flex-initial">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none bg-white w-full"
                  >
                    <option value="">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {data.donation_records.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Droplet className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-medium">No donations found on this account yet.</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
              <Search className="mx-auto text-slate-300 mb-3" size={40} />
              <p className="text-slate-500 font-medium">No donations match your current filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setDateFilter(''); }}
                className="mt-4 text-red-600 font-semibold text-sm hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                          {record.blood_type}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg">
                          {new Date(record.date).toLocaleDateString('en-US', { 
                            month: 'long', day: 'numeric', year: 'numeric' 
                          })}
                        </h3>
                      </div>
                      <p className="text-slate-500 text-sm flex items-center gap-1.5">
                        <Calendar size={14} /> {record.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
                        Status ID
                      </span>
                      <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {record.id}
                      </span>
                    </div>
                  </div>
                  
                  {/* The specific record's status pipeline */}
                  <JourneyTracker status={record.status} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}