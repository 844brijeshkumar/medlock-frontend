import React, { useState, useEffect, useMemo } from "react";
import { 
  Crown, Building2, Users, Zap, CheckCircle2, 
  Plus, Lock, ArrowRight, ShieldCheck, AlertCircle, X
} from "lucide-react";
import { useToast } from "../../../utils/ToastContext";

export default function SubscriptionPlugins() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingId, setIsProcessingId] = useState(null);
  
  // Plan Change Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedTierLevel, setSelectedTierLevel] = useState(null);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    subscription: null,
    active_plugins: [],
    available_plugins: [],
    subscription_tiers: [] // Dynamically populated from backend
  });

  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
    surface: "#f8fafc"
  }), []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/ad/subscription/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const responseData = await res.json();
      
      if (res.ok && responseData.status) {
        // Fallback mock data for current_branches/staff if backend doesn't send it yet
        const subData = responseData.data.subscription;
        if (subData) {
          subData.current_branches = subData.current_branches || 1;
          subData.current_staff = subData.current_staff || 5;
          subData.tier_level = subData.tier_level || 1;
        }
        setDashboardData({
          ...responseData.data,
          // Ensure tiers are always an array even if missing from initial payload
          subscription_tiers: responseData.data.subscription_tiers || []
        });
      } else {
        throw new Error(responseData.message || "Failed to load dashboard data");
      }
    } catch (err) {
      showToast({ title: "Error", message: err.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivatePlugin = async (pluginId) => {
    setIsProcessingId(pluginId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/ad/subscription/", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ plugin_id: pluginId })
      });
      
      const responseData = await res.json();
      if (res.ok && responseData.status) {
        setDashboardData(prev => {
          const activatedPlugin = prev.available_plugins.find(p => p.id === pluginId);
          const newActivePlugin = { ...activatedPlugin, ...responseData.plugin };
          return {
            ...prev,
            active_plugins: [newActivePlugin, ...prev.active_plugins],
            available_plugins: prev.available_plugins.filter(p => p.id !== pluginId)
          };
        });
        showToast({ title: "Plugin Activated!", message: responseData.message, type: "success" });
      } else {
        throw new Error(responseData.message || "Activation failed");
      }
    } catch (err) {
      showToast({ title: "Action Failed", message: err.message, type: "error" });
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleChangeTier = async () => {
    if (!selectedTierLevel) return;
    setIsUpdatingPlan(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/ad/subscription/", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tier_level: selectedTierLevel })
      });
      
      const responseData = await res.json();
      if (res.ok && responseData.status) {
        showToast({ title: "Plan Updated", message: "Your subscription has been updated successfully.", type: "success" });
        setIsPlanModalOpen(false);
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error(responseData.message || "Failed to update plan");
      }
    } catch (err) {
      showToast({ title: "Update Failed", message: err.message, type: "error" });
    } finally {
      setIsUpdatingPlan(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold tracking-widest uppercase">Loading Workspace...</div>;
  }

  const { subscription, active_plugins, available_plugins, subscription_tiers } = dashboardData;

  // Usage calculations for progress bars
  const branchUsagePercent = subscription ? Math.min(100, (subscription.current_branches / subscription.max_branches) * 100) : 0;
  const staffUsagePercent = subscription ? Math.min(100, (subscription.current_staff / subscription.max_staffs) * 100) : 0;

  // Check if downgrade is valid dynamically using backend tiers
  const validateDowngrade = (targetTierLevel) => {
    if (!subscription) return { isValid: false, reason: "" };
    if (targetTierLevel >= subscription.tier_level) return { isValid: true, reason: "" }; // Upgrade is always valid

    const targetTier = subscription_tiers.find(t => t.level === targetTierLevel);
    
    if (!targetTier) return { isValid: false, reason: "Selected tier is invalid or unavailable." };
    
    if (subscription.current_branches > targetTier.maxBranches) {
      return { isValid: false, reason: `Please deactivate ${subscription.current_branches - targetTier.maxBranches} branches to downgrade to ${targetTier.name}.` };
    }
    if (subscription.current_staff > targetTier.maxStaff) {
      return { isValid: false, reason: `Please deactivate ${subscription.current_staff - targetTier.maxStaff} staff members to downgrade to ${targetTier.name}.` };
    }
    return { isValid: true, reason: "" };
  };

  const validation = selectedTierLevel ? validateDowngrade(selectedTierLevel) : { isValid: true, reason: "" };

  return (
    <div 
      className="max-w-7xl mx-auto space-y-8 py-10 px-4 fade-in min-h-screen font-sans"
      style={{ "--primary": theme.primary, "--secondary": theme.secondary, "--accent": theme.accent }}
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Workspace Billing</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor usage, adjust limits, and power up with plugins.</p>
        </div>
      </div>

      {/* TOP ROW: SUBSCRIPTION USAGE */}
      {subscription && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col lg:flex-row justify-between gap-12">
            
            {/* Plan Info */}
            <div className="lg:w-1/3 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xs font-black uppercase tracking-widest">
                <Crown size={16} /> Tier {subscription.tier_level}
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-800">{subscription.tier_name} Plan</h3>
                <p className="text-slate-500 font-medium mt-2">You are currently on the {subscription.tier_name} tier. You can upgrade at any time to increase your operational limits.</p>
              </div>
              <button 
                onClick={() => setIsPlanModalOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
              >
                Change Plan <ArrowRight size={18} />
              </button>
            </div>

            {/* Usage Progress */}
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Branches Limit */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white text-secondary rounded-lg shadow-sm"><Building2 size={20} /></div>
                    <span className="font-bold text-slate-700">Active Branches</span>
                  </div>
                  <span className="text-sm font-black text-slate-400">{subscription.current_branches} / {subscription.max_branches}</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: `${branchUsagePercent}%` }}></div>
                </div>
              </div>

              {/* Staff Limit */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white text-secondary rounded-lg shadow-sm"><Users size={20} /></div>
                    <span className="font-bold text-slate-700">Active Staff</span>
                  </div>
                  <span className="text-sm font-black text-slate-400">{subscription.current_staff} / {subscription.max_staffs}</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${staffUsagePercent}%` }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PLUGINS BENTO GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* ACTIVE PLUGINS */}
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} className="text-primary" />
            <h3 className="text-xl font-black text-slate-800">Installed Plugins</h3>
          </div>
          
          <div className="space-y-4">
            {active_plugins.length > 0 ? active_plugins.map(plugin => (
              <div key={plugin.id} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-800">{plugin.name}</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Prefix: {plugin.prefix}</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                  <ShieldCheck size={14} /> Active
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm font-medium">No plugins installed yet.</p>
            )}
          </div>
        </div>

        {/* AVAILABLE PLUGINS */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={24} className="text-slate-400" />
            <h3 className="text-xl font-black text-slate-800">Available Upgrades</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {available_plugins.length > 0 ? available_plugins.map(plugin => (
              <div key={plugin.id} className="border border-slate-100 p-5 rounded-2xl hover:border-secondary/30 transition-colors flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800">{plugin.name}</h4>
                  <p className="text-xs text-slate-400 font-medium mb-4 mt-1">Prefix: {plugin.prefix}</p>
                </div>
                <button
                  onClick={() => handleActivatePlugin(plugin.id)}
                  disabled={isProcessingId === plugin.id}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-primary hover:text-white text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  {isProcessingId === plugin.id ? "Activating..." : <><Plus size={14} /> Add</>}
                </button>
              </div>
            )) : (
              <div className="col-span-full p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CheckCircle2 size={32} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold">You have all available plugins!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PLAN CHANGE MODAL */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">Select Subscription Tier</h2>
              <button onClick={() => { setIsPlanModalOpen(false); setSelectedTierLevel(null); }} className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full shadow-sm">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscription_tiers.length > 0 ? (
                subscription_tiers.map((tier) => {
                  const isCurrent = subscription?.tier_level === tier.level;
                  const isSelected = selectedTierLevel === tier.level;
                  
                  return (
                    <div 
                      key={tier.level}
                      onClick={() => !isCurrent && setSelectedTierLevel(tier.level)}
                      className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col
                        ${isCurrent ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed' : 
                          isSelected ? 'border-primary bg-primary/5 shadow-md scale-[1.02]' : 'border-slate-100 hover:border-secondary/40 hover:bg-slate-50'}`}
                    >
                      {isCurrent && <div className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl rounded-tr-xl">Current Plan</div>}
          
                      <h3 className="text-2xl font-black text-slate-800 mb-4">{tier.name}</h3>
                      
                      <div className="space-y-3 mb-6 flex-grow">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Max Branches</span>
                          <span className="font-bold text-slate-700">{tier.maxBranches}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Max Staff</span>
                          <span className="font-bold text-slate-700">{tier.maxStaff}</span>
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100">
                        <div className="text-xl font-black text-slate-800">{tier.price || "$0/mo"}</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full p-8 text-center text-slate-400">
                  <p>No subscription tiers configured in the database.</p>
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                {!validation.isValid && selectedTierLevel && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-semibold border border-rose-100 animate-in slide-in-from-left-4">
                    <AlertCircle size={18} /> {validation.reason}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlanModalOpen(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleChangeTier}
                  disabled={!selectedTierLevel || !validation.isValid || isUpdatingPlan}
                  className={`px-8 py-2.5 rounded-xl text-sm font-black text-white transition-all shadow-md
                    ${(!selectedTierLevel || !validation.isValid || isUpdatingPlan) 
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-primary hover:bg-slate-900 hover:shadow-lg'}`}
                >
                  {isUpdatingPlan ? "Updating..." : "Confirm Change"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}