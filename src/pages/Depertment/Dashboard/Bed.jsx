import React, { useState, useMemo } from 'react';
import { 
  Activity, ShieldAlert, AlertTriangle, CheckCircle, 
  Bed, User, Wrench, Search, Wind, Zap, Lock, 
  Thermometer, Droplets, ArrowRightLeft, Building2, Layers, X,
  UserPlus, Loader2, Filter, AlertCircle, Building, Download,
  PlusCircle, Eye
} from 'lucide-react';

// --- INITIAL DATA: Parsed from the provided YAML specification ---
const rawHospitalData = {
  id: "uuid-hosp-medlock-9901",
  name: "City Central Healthcare",
  status: "emergency",
  active_protocols: ["lockdown", "full"],
  buildings: [
    {
      id: "uuid-bld-A1",
      name: "Main Tower",
      floors: [
        {
          level: 1,
          name: "Ground Floor",
          departments: [
            {
              id: "uuid-dept-ED",
              name: "Emergency Department",
              wards: [
                {
                  id: "uuid-ward-trauma-1",
                  name: "Trauma & Resuscitation",
                  type: "Emergency",
                  status: "emergency",
                  provides: ["oxygen", "vacuum", "medical_air", "power_backup", "ethernet"],
                  bed_groups: [
                    {
                      group_type: "Trauma",
                      shared_features: ["vitals_monitor", "crash_cart"],
                      requires: ["oxygen", "power_backup"],
                      labels: ["ED-T01", "ED-T02", "ED-T03", "ED-T04", "ED-T05"]
                    }
                  ],
                  single_beds: [
                    {
                      id: "uuid-bed-t06-dialysis",
                      label: "ED-T06-CRRT",
                      type: "Trauma Dialysis",
                      features: ["crrt_machine"],
                      requires: ["ro_water", "decon_drain", "ups_power"],
                      state: "occupied"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          level: 2,
          name: "Second Floor",
          departments: [
            {
              id: "uuid-dept-ICU",
              name: "Intensive Care Unit",
              wards: [
                {
                  id: "uuid-ward-iso-1",
                  name: "COVID/Pathogen Isolation",
                  type: "Isolation",
                  status: "quarantine",
                  provides: ["oxygen", "isolation_air", "hepa_filter", "telemetry_wifi", "power_backup"],
                  bed_groups: [
                    {
                      group_type: "ICU",
                      shared_features: ["ventilator", "infusion_pump"],
                      requires: ["oxygen", "isolation_air", "power_backup"],
                      labels: ["ISO-01", "ISO-02", "ISO-03", "ISO-04"]
                    }
                  ],
                  single_beds: [
                    {
                      id: "uuid-bed-iso-05",
                      label: "ISO-05-MAINT",
                      type: "ICU",
                      features: ["ventilator"],
                      requires: ["oxygen"],
                      state: "maintenance"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Flatten data for easier state management in the UI
const generateInitialBeds = (data) => {
  let beds = [];
  data.buildings.forEach(bldg => {
    bldg.floors.forEach(floor => {
      floor.departments.forEach(dept => {
        if (dept.wards) {
          dept.wards.forEach(ward => {
            if (ward.bed_groups) {
              ward.bed_groups.forEach(group => {
                group.labels.forEach(label => {
                  beds.push({
                    id: label,
                    label: label,
                    building: bldg.name,
                    floor: floor.name,
                    department: dept.name,
                    ward: ward.name,
                    wardStatus: ward.status,
                    type: group.group_type,
                    features: [...ward.provides, ...(group.shared_features || [])],
                    requires: group.requires || [],
                    state: "ready", 
                  });
                });
              });
            }
            if (ward.single_beds) {
              ward.single_beds.forEach(bed => {
                const bedState = bed.state || "ready";
                beds.push({
                  id: bed.id,
                  label: bed.label,
                  building: bldg.name,
                  floor: floor.name,
                  department: dept.name,
                  ward: ward.name,
                  wardStatus: ward.status,
                  type: bed.type,
                  features: [...ward.provides, ...(bed.features || [])],
                  requires: bed.requires || [],
                  state: bedState,
                  patient: bedState === 'occupied' ? { name: "Jane Doe", patientId: "PT-8492", age: 52, aadhaar: "4021" } : null
                });
              });
            }
          });
        }
      });
    });
  });
  return beds;
};

// --- COMPONENTS ---

const StatusBadge = ({ status }) => {
  const styles = {
    normal: "bg-green-100 text-green-800 border-green-200",
    emergency: "bg-red-100 text-red-800 border-red-200 animate-pulse",
    lockdown: "bg-orange-100 text-orange-800 border-orange-200",
    quarantine: "bg-purple-100 text-purple-800 border-purple-200",
    full: "bg-gray-800 text-white border-gray-900"
  };

  const icons = {
    emergency: <AlertTriangle className="w-3 h-3 mr-1" />,
    lockdown: <Lock className="w-3 h-3 mr-1" />,
    quarantine: <ShieldAlert className="w-3 h-3 mr-1" />,
    full: <Lock className="w-3 h-3 mr-1" />,
    normal: <CheckCircle className="w-3 h-3 mr-1" />
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
};

const BedStateBadge = ({ state }) => {
  const styles = {
    ready: "bg-green-100 text-green-700 border-green-200",
    occupied: "bg-blue-100 text-blue-700 border-blue-200",
    maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
    removed: "bg-gray-100 text-gray-700 border-gray-200"
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${styles[state]}`}>
      {state}
    </span>
  );
};

const FeatureIcon = ({ feature }) => {
  const iconMap = {
    oxygen: <Wind className="w-3 h-3 text-blue-500" title="Oxygen" />,
    power_backup: <Zap className="w-3 h-3 text-yellow-500" title="Power Backup" />,
    isolation_air: <ShieldAlert className="w-3 h-3 text-purple-500" title="Isolation Air" />,
    ventilator: <Activity className="w-3 h-3 text-red-500" title="Ventilator" />,
    vitals_monitor: <Activity className="w-3 h-3 text-green-500" title="Vitals Monitor" />,
    vacuum: <Droplets className="w-3 h-3 text-gray-500" title="Vacuum" />,
    medical_air: <Wind className="w-3 h-3 text-teal-500" title="Medical Air" />,
  };
  return iconMap[feature] || <span className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded" title={feature}>{feature.substring(0,3).toUpperCase()}</span>;
};

// --- MODALS ---
const AssignPatientModal = ({ bedId, bedLabel, onClose, onAssign }) => {
  const [patientId, setPatientId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [patientData, setPatientData] = useState(null);

  const handleProceed = (e) => {
    e.preventDefault();
    if(!patientId.trim()) return;
    setIsFetching(true);
    setTimeout(() => {
      setIsFetching(false);
      setPatientData({
        patientId: patientId.toUpperCase(),
        name: "Rajesh Kumar", 
        age: 45,              
        aadhaar: "8291"       
      });
      setShowConfirmation(true);
    }, 1200); 
  };

  const handleConfirm = () => {
    onAssign(bedId, patientData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-secondary" /> Admit to {bedLabel}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-all p-2 rounded-xl" disabled={isFetching}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {showConfirmation && patientData ? (
          <div className="p-6">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-6">
              <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-secondary" /> Verify Admission Details
              </h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Patient ID:</span>
                  <span className="font-bold">{patientData.patientId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Full Name:</span>
                  <span className="font-bold">{patientData.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-500">Age:</span>
                  <span className="font-bold">{patientData.age} Years</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="font-medium text-gray-500">Aadhaar (Last 4):</span>
                  <span className="font-bold tracking-widest">**** {patientData.aadhaar}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmation(false)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:text-primary rounded-xl transition-colors shadow-sm"
              >
                Change ID
              </button>
              <button 
                onClick={handleConfirm} 
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-secondary rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Confirm & Assign
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleProceed} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Enter Patient ID</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none uppercase font-bold text-gray-800 transition-all" 
                placeholder="e.g. PT-10492"
                value={patientId}
                onChange={e => setPatientId(e.target.value)}
                disabled={isFetching}
                autoFocus
              />
              <p className="text-xs font-medium text-gray-500 mt-3">
                Patient demographics will be securely fetched from the central registry.
              </p>
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-gray-50 mt-6">
              <button type="button" onClick={onClose} disabled={isFetching} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isFetching || !patientId.trim()} className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-secondary rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center gap-2">
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Fetching...
                  </>
                ) : (
                  'Fetch Details'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const TransferModal = ({ beds, sourceId, onClose, onTransfer }) => {
  const sourceBed = beds.find(b => b.id === sourceId);
  const [selDept, setSelDept] = useState('All');
  const [selWard, setSelWard] = useState('All');
  const [selBedId, setSelBedId] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const availableBeds = beds.filter(b => b.state === 'ready');
  const depts = useMemo(() => ['All', ...new Set(availableBeds.map(b => b.department))], [availableBeds]);
  const wards = useMemo(() => ['All', ...new Set(availableBeds.filter(b => selDept === 'All' || b.department === selDept).map(b => b.ward))], [availableBeds, selDept]);

  const filteredBeds = useMemo(() => availableBeds.filter(b =>
    (selDept === 'All' || b.department === selDept) &&
    (selWard === 'All' || b.ward === selWard)
  ), [availableBeds, selDept, selWard]);

  const handleDeptChange = (e) => {
    setSelDept(e.target.value);
    setSelWard('All');
    setSelBedId('');
    setShowConfirmation(false);
  };

  const handleWardChange = (e) => {
    setSelWard(e.target.value);
    setSelBedId('');
    setShowConfirmation(false);
  };

  const selectedBedLabel = useMemo(() => {
    return availableBeds.find(b => b.id === selBedId)?.label || '';
  }, [availableBeds, selBedId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-secondary" /> Patient Transfer
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-secondary hover:bg-secondary/10 transition-all p-2 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 flex justify-between items-center shadow-sm">
            <div>
              <div className="text-xs text-secondary font-black uppercase tracking-wider mb-1">Current Assignment</div>
              <div className="font-bold text-primary text-xl">{sourceBed?.label}</div>
              <div className="text-sm text-gray-600 flex items-center gap-2 mt-1 font-medium">
                <Building2 className="w-3.5 h-3.5" /> {sourceBed?.department}
                <span className="text-gray-300">•</span>
                <Layers className="w-3.5 h-3.5" /> {sourceBed?.ward}
              </div>
              {sourceBed?.patient && (
                <div className="mt-3 text-xs font-bold text-primary bg-white border border-primary/10 inline-flex items-center px-2.5 py-1 rounded-lg shadow-sm">
                  <User className="w-3 h-3 mr-1.5 text-secondary" /> {sourceBed.patient.name} ({sourceBed.patient.patientId})
                </div>
              )}
            </div>
            <ArrowRightLeft className="w-10 h-10 text-secondary/30" />
          </div>

          <div className="space-y-4 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Destination Department</label>
              <select className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-medium transition-all" value={selDept} onChange={handleDeptChange} disabled={showConfirmation}>
                {depts.map(d => <option key={d} value={d}>{d === 'All' ? 'Any Department' : d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Destination Ward</label>
              <select className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-medium transition-all disabled:bg-gray-100 disabled:text-gray-400" value={selWard} onChange={handleWardChange} disabled={showConfirmation || (selDept === 'All' && wards.length <= 1)}>
                {wards.map(w => <option key={w} value={w}>{w === 'All' ? 'Any Ward' : w}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Available Bed</label>
              <select className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none font-bold text-primary transition-all disabled:bg-gray-100" value={selBedId} onChange={e => {setSelBedId(e.target.value); setShowConfirmation(false);}} disabled={showConfirmation}>
                <option value="" disabled>-- Choose a Ready Bed --</option>
                {filteredBeds.map(b => <option key={b.id} value={b.id}>{b.label} ({b.type})</option>)}
              </select>
              {filteredBeds.length === 0 && <p className="text-xs font-bold text-red-500 mt-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> No available beds match these filters.</p>}
            </div>
          </div>
        </div>

        {showConfirmation ? (
          <div className="p-6 bg-orange-50 border-t border-orange-100 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-orange-900">Verify Transfer</h4>
                <p className="text-sm text-orange-800 mt-1.5">
                  You are about to transfer <strong className="font-black">{sourceBed?.patient?.name || 'the patient'}</strong> from <strong className="font-black">{sourceBed?.label}</strong> to <strong className="font-black">{selectedBedLabel}</strong>. Are you sure you want to proceed?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button 
                onClick={() => setShowConfirmation(false)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
              >
                Go Back
              </button>
              <button 
                onClick={() => onTransfer(selBedId)} 
                className="px-5 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Yes, Complete Transfer
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
            <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm">Cancel</button>
            <button 
              onClick={() => setShowConfirmation(true)} 
              disabled={!selBedId}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-500 rounded-xl transition-colors shadow-lg shadow-primary/20 disabled:shadow-none flex items-center gap-2"
            >
              Proceed to Transfer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DischargeModal = ({ bed, onClose, onConfirm }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" /> Discharge Patient
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all p-2 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {showConfirmation ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-6">
              <h4 className="text-sm font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Final Verification
              </h4>
              <p className="text-sm text-red-800 font-medium">
                You are about to permanently discharge <strong className="font-black">{bed?.patient?.name || 'this patient'}</strong> from <strong className="font-black">{bed?.label}</strong>.
              </p>
              <p className="text-sm text-red-800 font-medium mt-3">
                This will clear their assignment and mark the bed for <strong className="font-black">Maintenance</strong>. This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmation(false)} 
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
              >
                Go Back
              </button>
              <button 
                onClick={() => onConfirm(bed.id)} 
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Confirm Discharge
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-6">
               <h4 className="text-sm font-bold text-primary mb-4">Review Discharge Details</h4>
               {bed?.patient ? (
                 <div className="space-y-3 text-sm text-gray-700">
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span className="font-medium text-gray-500">Patient ID:</span>
                     <span className="font-bold">{bed.patient.patientId}</span>
                   </div>
                   <div className="flex justify-between border-b border-gray-100 pb-2">
                     <span className="font-medium text-gray-500">Full Name:</span>
                     <span className="font-bold">{bed.patient.name}</span>
                   </div>
                   <div className="flex justify-between pb-1">
                     <span className="font-medium text-gray-500">Current Bed:</span>
                     <span className="font-bold">{bed.label}</span>
                   </div>
                 </div>
               ) : (
                 <p className="text-sm font-medium text-gray-600">Unknown Patient from bed <strong className="font-bold text-primary">{bed?.label}</strong></p>
               )}
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowConfirmation(true)} 
                className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-secondary rounded-xl transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
              >
                Proceed to Discharge
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [hospital] = useState(rawHospitalData);
  const [beds, setBeds] = useState(() => generateInitialBeds(rawHospitalData));
  
  // Theme Configuration
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  // Extended Filter States
  const [filterDepartment, setFilterDepartment] = useState('Emergency Department'); 
  const [filterWard, setFilterWard] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterState, setFilterState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [transferSourceId, setTransferSourceId] = useState(null);
  const [assignBedId, setAssignBedId] = useState(null);
  const [dischargeBedId, setDischargeBedId] = useState(null);

  const updateBedState = (id, newState, extraData = null) => {
    setBeds(currentBeds => 
      currentBeds.map(bed => {
        if (bed.id === id) {
          let updatedBed = { ...bed, state: newState };
          if (newState === 'maintenance' || newState === 'ready') {
            updatedBed.patient = null;
          }
          if (newState === 'occupied' && extraData) {
            updatedBed.patient = extraData;
          }
          return updatedBed;
        }
        return bed;
      })
    );
  };

  const handleAssignSubmit = (bedId, patientData) => {
    updateBedState(bedId, 'occupied', patientData);
    setAssignBedId(null);
  };

  const handleTransfer = (targetBedId) => {
    setBeds(currentBeds => {
      const sourceBed = currentBeds.find(b => b.id === transferSourceId);
      return currentBeds.map(bed => {
        if (bed.id === transferSourceId) return { ...bed, state: 'ready', patient: null };
        if (bed.id === targetBedId) return { ...bed, state: 'occupied', patient: sourceBed?.patient || null };
        return bed;
      });
    });
    setTransferSourceId(null);
  };

  const departments = useMemo(() => ['All', ...new Set(beds.map(b => b.department))], [beds]);
  const wards = useMemo(() => ['All', ...new Set(beds.filter(b => filterDepartment === 'All' || b.department === filterDepartment).map(b => b.ward))], [beds, filterDepartment]);
  const bedTypes = useMemo(() => ['All', ...new Set(beds.filter(b => 
    (filterDepartment === 'All' || b.department === filterDepartment) && 
    (filterWard === 'All' || b.ward === filterWard)
  ).map(b => b.type))], [beds, filterDepartment, filterWard]);

  const handleDepartmentChange = (e) => {
    setFilterDepartment(e.target.value);
    setFilterWard('All');
    setFilterType('All');
  };

  const handleWardChange = (e) => {
    setFilterWard(e.target.value);
    setFilterType('All');
  };

  const filteredBeds = useMemo(() => {
    return beds.filter(bed => {
      const matchesDept = filterDepartment === 'All' || bed.department === filterDepartment;
      const matchesWard = filterWard === 'All' || bed.ward === filterWard;
      const matchesType = filterType === 'All' || bed.type === filterType;
      const matchesState = filterState === 'All' || bed.state === filterState.toLowerCase();
      const matchesSearch = 
        bed.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bed.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bed.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesWard && matchesType && matchesState && matchesSearch;
    });
  }, [beds, filterDepartment, filterWard, filterType, filterState, searchQuery]);

  const departmentBeds = useMemo(() => {
    return beds.filter(bed => filterDepartment === 'All' || bed.department === filterDepartment);
  }, [beds, filterDepartment]);

  const stats = {
    total: departmentBeds.length,
    ready: departmentBeds.filter(b => b.state === 'ready').length,
    occupied: departmentBeds.filter(b => b.state === 'occupied').length,
    unavailable: departmentBeds.filter(b => ['maintenance', 'removed'].includes(b.state)).length,
  };

  return (
    <div 
      className="space-y-8 p-4 md:p-10 fade-in bg-slate-50 min-h-screen relative font-sans"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-primary">Bed Management</h2>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-xs font-medium text-gray-500">Manage and assign hospital beds securely</p>
            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-gray-300"></span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Status:</span>
              <StatusBadge status={hospital.status} />
              {hospital.active_protocols.map(protocol => (
                <StatusBadge key={protocol} status={protocol} />
              ))}
            </div>
          </div>
        </div>
        
        <button className="group relative overflow-hidden bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <Download className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform" />
          Export Map
        </button>
      </div>

      <main className="max-w-7xl mx-auto">
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-gray-400 text-[11px] font-black uppercase tracking-wider mb-1">Total Assets</div>
            <div className="text-3xl font-black text-gray-800">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-5 rounded-[1.5rem] shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="text-green-600 text-[11px] font-black uppercase tracking-wider mb-1">Ready to Assign</div>
            <div className="text-3xl font-black text-green-700">{stats.ready}</div>
          </div>
          <div className="bg-blue-50 p-5 rounded-[1.5rem] shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="text-blue-600 text-[11px] font-black uppercase tracking-wider mb-1">Currently Occupied</div>
            <div className="text-3xl font-black text-blue-700">{stats.occupied}</div>
          </div>
          <div className="bg-yellow-50 p-5 rounded-[1.5rem] shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
            <div className="text-yellow-600 text-[11px] font-black uppercase tracking-wider mb-1">Needs Attention</div>
            <div className="text-3xl font-black text-yellow-700">{stats.unavailable}</div>
          </div>
        </div>

        {/* 🔹 FILTER BAR */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col xl:flex-row gap-2 mb-8">
          {/* Search Input */}
          <div className="relative flex-grow group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
            <input
              type="text"
              placeholder="Search by bed, ward, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-medium"
            />
          </div>

          <div className="hidden xl:block w-px bg-gray-200 my-2"></div>

          {/* Filters Group */}
          <div className="flex flex-col md:flex-row gap-2">
            
            {/* Department Filter */}
            <div className="relative md:w-56 group">
              <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
              <select
                value={filterDepartment}
                onChange={handleDepartmentChange}
                className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
                ))}
              </select>
            </div>

            {/* Ward Filter */}
            <div className="relative md:w-48 group">
              <Layers className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
              <select
                value={filterWard}
                onChange={handleWardChange}
                disabled={filterDepartment === 'All' && wards.length <= 1}
                className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600 disabled:opacity-50"
              >
                {wards.map(ward => (
                  <option key={ward} value={ward}>{ward === 'All' ? 'All Wards' : ward}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative md:w-40 group">
              <Bed className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                disabled={filterWard === 'All' && bedTypes.length <= 1}
                className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600 disabled:opacity-50"
              >
                {bedTypes.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Bed Types' : type}</option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div className="relative md:w-40 group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600"
              >
                {['All', 'Ready', 'Occupied', 'Maintenance'].map(state => (
                  <option key={state} value={state}>{state === 'All' ? 'All States' : state}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Count */}
          <div className="flex items-center px-6 py-2 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">
            {filteredBeds.length} beds
          </div>
        </div>

        {/* 🔹 BED GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBeds.map(bed => (
            <div key={bed.id} className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden flex flex-col">
              
              {/* Top Accent Line Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Card Header & Icon */}
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-primary shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300 shrink-0">
                  <Bed className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                      {bed.label}
                    </h3>
                    <BedStateBadge state={bed.state} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><Building2 className="w-3 h-3 text-gray-400" /> {bed.department}</span>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1.5"><Layers className="w-3 h-3 text-gray-400" /> {bed.ward}</span>
                  </div>
                </div>
              </div>

              {/* Card Body - Content */}
              <div className="flex-1 flex flex-col gap-4">
                
                {/* Capabilities Pill List */}
                <div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Capabilities</div>
                  <div className="flex flex-wrap gap-1.5">
                    {bed.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase text-gray-600 transition-colors group-hover:border-secondary/20">
                        <FeatureIcon feature={feat} />
                        {feat.replace('_', ' ')}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Specific Info Grids */}
                {bed.state === 'occupied' && (
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-white shadow-sm p-2 rounded-xl shrink-0">
                        <User className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-secondary uppercase tracking-wider mb-0.5">Assigned Patient</div>
                        {bed.patient ? (
                          <>
                            <div className="text-sm font-bold text-primary leading-tight">
                              {bed.patient.name} <span className="text-xs font-semibold opacity-70">({bed.patient.age}y)</span>
                            </div>
                            <div className="text-xs text-primary/70 font-medium mt-0.5">
                              ID: {bed.patient.patientId}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs font-medium text-primary">Bed is currently in use.</div>
                        )}
                      </div>
                    </div>
                    {/* Integrated Quick Action Buttons */}
                    {bed.patient && (
                      <div className="flex gap-2 mt-1">
                        <a 
                          href={`/department/add-event/${bed.patient.patientId}/${bed.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex justify-center items-center gap-1.5 bg-white text-primary border border-primary/20 hover:bg-primary/5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <PlusCircle className="w-3 h-3" /> Add Event
                        </a>
                        <a 
                          href={`/department/view-event/${bed.patient.patientId}/${bed.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex justify-center items-center gap-1.5 bg-white text-secondary border border-secondary/20 hover:bg-secondary/5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <Eye className="w-3 h-3" /> View Event
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {bed.state === 'maintenance' && (
                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-center gap-3">
                    <div className="bg-white shadow-sm p-2 rounded-xl shrink-0">
                      <Wrench className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-yellow-700 uppercase tracking-wider mb-0.5">Under Maintenance</div>
                      <div className="text-xs font-medium text-yellow-800">Asset listed for maintenance.</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer - Actions */}
              <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-50">
                {bed.state === 'ready' && (
                  <button 
                    onClick={() => setAssignBedId(bed.id)}
                    className="flex-1 flex justify-center items-center gap-2 bg-primary/5 text-primary hover:bg-primary hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <UserPlus className="h-4 w-4" /> Assign
                  </button>
                )}
                
                {bed.state === 'occupied' && (
                  <div className="flex gap-2 w-full">
                    <button 
                      onClick={() => setTransferSourceId(bed.id)}
                      className="flex-1 flex justify-center items-center gap-2 bg-primary/5 text-primary hover:bg-primary hover:text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <ArrowRightLeft className="w-4 h-4" /> Transfer
                    </button>
                    <button 
                      onClick={() => setDischargeBedId(bed.id)}
                      className="flex-1 flex justify-center items-center gap-2 bg-white text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <ShieldAlert className="w-4 h-4" /> Discharge
                    </button>
                  </div>
                )}

                {bed.state === 'maintenance' && (
                  <button 
                    onClick={() => updateBedState(bed.id, 'ready')}
                    className="flex-1 flex justify-center items-center gap-2 bg-green-50 text-green-700 border border-green-100 hover:bg-green-600 hover:text-white hover:border-green-600 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark as Ready
                  </button>
                )}

                {bed.state === 'ready' && (
                  <button 
                    onClick={() => updateBedState(bed.id, 'maintenance')}
                    title="Report Issue"
                    className="ml-3 p-2.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-all duration-300 hover:scale-110"
                  >
                    <Wrench className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredBeds.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
              <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors">
                 <Search className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors" />
              </div>
              <p className="font-medium text-lg">No beds found matching your criteria.</p>
              <button 
                 onClick={() => {setSearchQuery(""); setFilterDepartment("All"); setFilterWard("All"); setFilterType("All"); setFilterState("All");}}
                 className="mt-3 text-sm font-bold text-secondary hover:text-primary hover:underline transition-colors"
              >
                 Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Assign Patient Modal Overlay */}
      {assignBedId && (
        <AssignPatientModal 
          bedId={assignBedId}
          bedLabel={beds.find(b => b.id === assignBedId)?.label}
          onClose={() => setAssignBedId(null)}
          onAssign={handleAssignSubmit}
        />
      )}

      {/* Transfer Modal Overlay */}
      {transferSourceId && (
        <TransferModal 
          beds={beds}
          sourceId={transferSourceId}
          onClose={() => setTransferSourceId(null)}
          onTransfer={handleTransfer}
        />
      )}

      {/* Discharge Modal Overlay */}
      {dischargeBedId && (
        <DischargeModal 
          bed={beds.find(b => b.id === dischargeBedId)}
          onClose={() => setDischargeBedId(null)}
          onConfirm={(id) => {
            updateBedState(id, 'maintenance');
            setDischargeBedId(null);
          }}
        />
      )}
    </div>
  );
}