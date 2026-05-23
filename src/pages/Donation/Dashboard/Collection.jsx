import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Legend,
  BarChart, Bar
} from 'recharts';
import { 
  AlertTriangle, TrendingUp, Activity, BarChart3, Database, MessageCircle, 
  AlertCircle, Droplet, Clock, CheckCircle2, Loader2, Filter,
  Users, Calendar, Search, ArrowUpDown
} from 'lucide-react';

/**
 * ANALYTICS COMMAND CENTER
 * Visualizes predictive shortages, logistical entropy, RFM donor clustering, and inventory distribution.
 * UI Refactored to match Clinical Medical History Theme.
 */

// --- Mock API Gateway (Preserved) ---
const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

const fetchAnalyticsCache = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));

  return {
    kpis: {
      active_inventory: 12450,
      projected_demand_7d: 14200,
      system_wastage_rate: 1.8 
    },
    projected_shortages: [
      { blood_type: "O-", days_to_depletion: 4, cluster_anomaly: true, reason: "Trauma Requisition Spike" }
    ],
    wastage_gini: Array.from({ length: 90 }, (_, i) => ({
      day: i + 1,
      gini_index: 0.15 + (Math.random() * 0.3) + (i > 60 ? 0.2 : 0) 
    })),
    blood_inventory_distribution: [
      { type: "O+", current: 4500, projected_demand: 4200 },
      { type: "O-", current: 1200, projected_demand: 1800 },
      { type: "A+", current: 3800, projected_demand: 3600 },
      { type: "A-", current: 800, projected_demand: 950 },
      { type: "B+", current: 1500, projected_demand: 1400 },
      { type: "B-", current: 300, projected_demand: 400 },
      { type: "AB+", current: 250, projected_demand: 200 },
      { type: "AB-", current: 100, projected_demand: 150 },
    ],
    rfm_clusters: {
      loyal_champions: Array.from({ length: 80 }, () => ({ 
        recency: Math.floor(Math.random() * 90), 
        frequency: Math.floor(Math.random() * 15) + 5, 
        volume: Math.floor(Math.random() * 1000) + 500,
        blood_type: BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)]
      })),
      at_risk_churn: Array.from({ length: 60 }, () => ({ 
        recency: Math.floor(Math.random() * 180) + 90, 
        frequency: Math.floor(Math.random() * 8) + 2, 
        volume: Math.floor(Math.random() * 800) + 200,
        blood_type: BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)]
      })),
      inactive: Array.from({ length: 50 }, () => ({ 
        recency: Math.floor(Math.random() * 300) + 180, 
        frequency: Math.floor(Math.random() * 3) + 1, 
        volume: Math.floor(Math.random() * 400) + 100,
        blood_type: BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)]
      }))
    },
    eligible_champions: Array.from({ length: 150 }, (_, i) => ({
      id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
      name: `Donor ${i + 1}`,
      blood_type: BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)],
      days_since_last: Math.floor(Math.random() * 120) + 61,
      lifetime_donations: Math.floor(Math.random() * 20) + 5,
      phone: "+1 (555) 019-" + Math.floor(1000 + Math.random() * 9000)
    }))
  };
};

export default function AnalyticsCommandCenter() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCampaignSending, setIsCampaignSending] = useState(false);
  const [campaignSuccess, setCampaignSuccess] = useState(false);

  // Section Filters (Preserved)
  const [wastageDuration, setWastageDuration] = useState(30);
  const [inventoryDuration, setInventoryDuration] = useState('current');
  const [rfmBloodType, setRfmBloodType] = useState('All');
  const [tableBloodType, setTableBloodType] = useState('O-');

  // --- THEME CONFIGURATION (Injected) ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  useEffect(() => {
    fetchAnalyticsCache().then(res => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const triggerWhatsAppCampaign = async () => {
    setIsCampaignSending(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCampaignSending(false);
    setCampaignSuccess(true);
    setTimeout(() => setCampaignSuccess(false), 5000);
  };

  // Filtered Data Memos (Preserved)
  const filteredWastage = useMemo(() => {
    if (!data) return [];
    return data.wastage_gini.slice(-wastageDuration);
  }, [data, wastageDuration]);

  const filteredRfm = useMemo(() => {
    if (!data) return null;
    if (rfmBloodType === 'All') return data.rfm_clusters;
    return {
      loyal_champions: data.rfm_clusters.loyal_champions.filter(d => d.blood_type === rfmBloodType),
      at_risk_churn: data.rfm_clusters.at_risk_churn.filter(d => d.blood_type === rfmBloodType),
      inactive: data.rfm_clusters.inactive.filter(d => d.blood_type === rfmBloodType),
    };
  }, [data, rfmBloodType]);

  const filteredTable = useMemo(() => {
    if (!data) return [];
    if (tableBloodType === 'All') return data.eligible_champions.sort((a,b) => b.lifetime_donations - a.lifetime_donations);
    return data.eligible_champions.filter(d => d.blood_type === tableBloodType).sort((a,b) => b.lifetime_donations - a.lifetime_donations);
  }, [data, tableBloodType]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-gray-400">
        <Activity className="animate-pulse mb-4 text-secondary" size={48} />
        <h2 className="text-xl font-bold tracking-widest uppercase text-primary">Initializing Command Center</h2>
        <p className="text-sm mt-2">Connecting Analytics Microservice...</p>
      </div>
    );
  }

  const criticalShortages = data.projected_shortages.filter(s => s.cluster_anomaly);

  return (
    <div 
      className="space-y-8 p-10 fade-in bg-slate-50 min-h-screen relative"
      style={{
        "--primary": theme.primary,
        "--secondary": theme.secondary,
        "--accent": theme.accent,
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-primary">
            Analytics Command Center
          </h2>
          <div className="flex items-center gap-2 mt-1">
             <Database size={14} className="text-secondary" />
             <p className="text-xs font-medium text-gray-500">
               Data synced: 02:00 AM (Python ML Worker)
             </p>
          </div>
        </div>
      </div>

      {/* --- PREDICTIVE ALERTS (Red Alert UI) --- */}
      {criticalShortages.length > 0 && (
        <div className="bg-white rounded-[1.5rem] border-l-4 border-red-500 shadow-sm p-6 flex items-start gap-4 animate-in slide-in-from-top duration-500">
           <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
             <AlertTriangle size={28} />
           </div>
           <div>
             <h3 className="text-lg font-bold text-red-600 uppercase tracking-tight">K-Means Anomaly: Supply Warning</h3>
             <p className="text-sm text-gray-600 mt-1">
               Automated projections indicate <span className="font-bold text-red-700">{criticalShortages[0].blood_type}</span> reserves will deplete in <span className="font-bold underline">{criticalShortages[0].days_to_depletion} days</span>. 
               <br/><span className="text-xs italic text-gray-400">Trigger Event: {criticalShortages[0].reason}</span>
             </p>
           </div>
        </div>
      )}

      {/* --- TOP LEVEL KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Global Inventory', value: data.kpis.active_inventory.toLocaleString(), icon: Droplet, trend: '+2.4%', color: 'text-secondary' },
          { label: 'Projected Demand', value: data.kpis.projected_demand_7d.toLocaleString(), icon: Clock, trend: 'Warning', color: 'text-red-600' },
          { label: 'Wastage Rate', value: `${data.kpis.system_wastage_rate}%`, icon: AlertCircle, trend: 'Target: <2%', color: 'text-orange-600' }
        ].map((kpi, idx) => (
          <div key={idx} className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-secondary group-hover:text-white transition-all">
                <kpi.icon size={24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-gray-50 border ${kpi.color}`}>
                {kpi.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Inventory Distribution Chart */}
        <div className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <BarChart3 size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Inventory Analysis</h3>
                <p className="text-xs text-gray-400 font-medium">Holding vs Projected Demand</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
               <Filter size={14} className="ml-2 text-gray-400" />
               <select 
                value={inventoryDuration} 
                onChange={(e) => setInventoryDuration(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-600 py-2 pr-4 outline-none appearance-none cursor-pointer"
              >
                <option value="current">Current Holdings</option>
                <option value="projected">7D Projection</option>
              </select>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.blood_inventory_distribution} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="type" stroke="#94a3b8" tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey={inventoryDuration === 'current' ? 'current' : 'projected_demand'} fill={theme.secondary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wastage/Entropy Chart */}
        <div className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Activity size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Logistical Entropy</h3>
                <p className="text-xs text-gray-400 font-medium">Gini Index of Spoilage Bottlenecks</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
               <Calendar size={14} className="ml-2 text-gray-400" />
               <select 
                value={wastageDuration} 
                onChange={(e) => setWastageDuration(Number(e.target.value))}
                className="bg-transparent text-xs font-bold text-gray-600 py-2 pr-4 outline-none appearance-none cursor-pointer"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
                <option value={90}>Last 90 Days</option>
              </select>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredWastage} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8', fontSize: 12}} tickLine={false} axisLine={false} domain={[0, 1]} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #f1f5f9', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="gini_index" stroke={theme.secondary} strokeWidth={4} dot={false} activeDot={{ r: 8, fill: theme.primary, stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* RFM Segmentation Plot */}
        <div className="group bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Users size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Donor Segmentation</h3>
                <p className="text-xs text-gray-400 font-medium">K-Means Cluster: Recency vs Frequency</p>
              </div>
            </div>
            <select 
              value={rfmBloodType} 
              onChange={(e) => setRfmBloodType(e.target.value)}
              className="bg-gray-50 text-xs font-bold text-gray-600 px-4 py-2.5 rounded-xl border border-gray-100 outline-none cursor-pointer"
            >
              <option value="All">All Blood Types</option>
              {BLOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 0, right: 0, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="recency" name="Recency" stroke="#94a3b8" tick={{fontSize: 12}}>
                  <label value="Recency (Days)" position="insideBottom" offset={-10} fill="#94a3b8" style={{fontSize: '10px', fontWeight: 800}}/>
                </XAxis>
                <YAxis type="number" dataKey="frequency" name="Frequency" stroke="#94a3b8" tick={{fontSize: 12}} />
                <ZAxis type="number" dataKey="volume" range={[40, 150]} />
                <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="top" height={40} wrapperStyle={{ fontSize: '11px', fontWeight: 700 }} />
                
                <Scatter name="Loyal Champions" data={filteredRfm?.loyal_champions} fill="#10b981" />
                <Scatter name="At-Risk Churn" data={filteredRfm?.at_risk_churn} fill="#f59e0b" />
                <Scatter name="Inactive" data={filteredRfm?.inactive} fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Table (Campaign List) */}
        <div className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <MessageCircle size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Campaign Outreach</h3>
                <p className="text-xs text-gray-400 font-medium">Eligible Champions: {tableBloodType} List</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <select 
                value={tableBloodType} 
                onChange={(e) => setTableBloodType(e.target.value)}
                className="bg-gray-50 text-[10px] font-black uppercase tracking-wider text-gray-600 px-4 py-2 rounded-xl border border-gray-100 outline-none"
              >
                <option value="All">All Types</option>
                {BLOOD_TYPES.map(type => <option key={type} value={type}>{type} Priority</option>)}
              </select>
              <button 
                disabled={isCampaignSending || campaignSuccess || filteredTable.length === 0}
                onClick={triggerWhatsAppCampaign}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all flex items-center gap-2 ${campaignSuccess ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-primary text-white hover:bg-secondary active:scale-95 disabled:opacity-50'}`}
              >
                {isCampaignSending ? <Loader2 size={16} className="animate-spin"/> : 
                 campaignSuccess ? <CheckCircle2 size={16}/> : <MessageCircle size={16}/>}
                {campaignSuccess ? 'Deployed' : 'Trigger'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto max-h-[350px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-4 border-b border-gray-50">Donor Identification</th>
                  <th className="p-4 border-b border-gray-50">Status</th>
                  <th className="p-4 border-b border-gray-50 text-right">Recency</th>
                  <th className="p-4 border-b border-gray-50 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredTable.length > 0 ? (
                  filteredTable.slice(0, 10).map((donor) => (
                    <tr key={donor.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900">{donor.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{donor.id}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          {donor.blood_type}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-700 font-bold">
                        {donor.days_since_last}d
                      </td>
                      <td className="p-4 text-right text-secondary font-black">
                        {donor.lifetime_donations}u
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 font-medium italic">
                      No active targets found for current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {filteredTable.length > 0 && (
            <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">
              {filteredTable.length} Priority Targets Identified
            </div>
          )}
        </div>
      </div>
    </div>
  );
}