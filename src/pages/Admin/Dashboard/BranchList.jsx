import React, { useState, useEffect } from "react";
import { 
  Building2, Layers, ChevronDown, ChevronRight, 
  Search, Stethoscope, Activity, User, MapPin
} from "lucide-react";

export default function BranchList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ROLE DETECTION ---
  const rawRole = localStorage.getItem("role")?.toLowerCase() || "";
  const isHospitalRole = rawRole === "hospital" || rawRole === "hp";
  const isDepartmentRole = rawRole === "department" || rawRole === "dp";
  const isAdminRole = !isHospitalRole && !isDepartmentRole;

  // Search & Filter States
  const defaultScope = isAdminRole ? "hospital" : isHospitalRole ? "department" : "staff";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchScope, setSearchScope] = useState(defaultScope); 
  const [activeTab, setActiveTab] = useState("Active"); // Active | Inactive

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // 1. Fetch all data concurrently
        const [hospRes, deptRes, docRes, nurseRes, recRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/hospital/", { headers }),
          fetch("http://127.0.0.1:8000/api/manage/department/", { headers }),
          fetch("http://127.0.0.1:8000/api/manage/staff/?role=doctor", { headers }),
          fetch("http://127.0.0.1:8000/api/manage/staff/?role=nurse", { headers }),
          fetch("http://127.0.0.1:8000/api/manage/staff/?role=receptionist", { headers })
        ]);

        // 2. Parse responses safely
        const [hospData, deptData, docData, nurseData, recData] = await Promise.all([
          hospRes.ok ? hospRes.json() : { hospitals: [] },
          deptRes.ok ? deptRes.json() : { departments: [] },
          docRes.ok ? docRes.json() : { staff: [] },
          nurseRes.ok ? nurseRes.json() : { staff: [] },
          recRes.ok ? recRes.json() : { staff: [] }
        ]);

        // 3. Combine Staff with explicitly tagged roles
        const allStaff = [
          ...(docData.staff || []).map(s => ({ ...s, role: "doctor" })),
          ...(nurseData.staff || []).map(s => ({ ...s, role: "nurse" })),
          ...(recData.staff || []).map(s => ({ ...s, role: "receptionist" }))
        ];

        const rawHospitals = hospData.hospitals || [];
        const rawDepartments = deptData.departments || [];

        // 4. Stitch the hierarchy together: Hospital -> Departments -> Staff
        const builtTree = rawHospitals.map((h) => {
          const hospId = String(h.id || h.Id);
          
          // Find departments for this hospital
          const hDepts = rawDepartments.filter(d => String(d.hospital_id) === hospId);
          
          // Find staff for those departments
          const deptsWithStaff = hDepts.map(d => {
            const deptId = String(d.id || d.Id);
            const dStaff = allStaff.filter(s => String(s.department_id) === deptId);
            return { ...d, staff: dStaff };
          });

          return { ...h, departments: deptsWithStaff };
        });

        setData(builtTree);
      } catch (err) {
        console.error("Failed to stitch directory tree:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- LOCAL SEARCH & FILTER ENGINE ---
  const filteredData = data.map((h) => {
    // Check Status Tab
    const hospStatus = h.Status__c || h.status || "Active";
    if (activeTab === "Active" && hospStatus !== "Active") return null;
    if (activeTab === "Inactive" && hospStatus === "Active") return null;

    if (!searchQuery) return h;
    const query = searchQuery.toLowerCase();

    // Route 1: Search by Hospital Name, District, or State
    if (searchScope === "hospital") {
      const hName = String(h.Name || h.name || "").toLowerCase();
      const hDistrict = String(h.District__r?.Name || h.district || "").toLowerCase();
      const hState = String(h.State__r?.Name || h.state || "").toLowerCase();

      if (hName.includes(query) || hDistrict.includes(query) || hState.includes(query)) {
        return h;
      }
      return null;
    }

    // Route 2: Search by Department Name
    if (searchScope === "department") {
      const matchingDepts = h.departments.filter(d => 
        String(d.name || d.Name || "").toLowerCase().includes(query)
      );
      if (matchingDepts.length > 0) return { ...h, departments: matchingDepts };
      return null;
    }

    // Route 3: Search by Staff Name or ID
    if (searchScope === "staff") {
      const matchingDepts = h.departments.map(d => {
        const matchingStaff = d.staff.filter(s => 
          String(s.name || s.Name || "").toLowerCase().includes(query) || 
          String(s.punch_id || "").includes(query)
        );
        if (matchingStaff.length > 0) return { ...d, staff: matchingStaff };
        return null;
      }).filter(Boolean);

      if (matchingDepts.length > 0) return { ...h, departments: matchingDepts };
      return null;
    }

    return h;
  }).filter(Boolean);

  // Available scopes based on Role
  const availableScopes = isAdminRole 
    ? ['hospital', 'department', 'staff'] 
    : isHospitalRole 
      ? ['department', 'staff']
      : ['staff'];

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans">
      
      {/* Header & Search Area */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-6">
          {isAdminRole ? "Network Directory" : isHospitalRole ? "Branch Directory" : "Department Directory"}
        </h1>
        
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-sm outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-slate-700"
              placeholder={`Search by ${searchScope}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {availableScopes.length > 1 && (
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto w-full md:w-auto">
              {availableScopes.map((s) => (
                <button 
                  key={s}
                  onClick={() => { setSearchScope(s); setSearchQuery(""); }}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    searchScope === s 
                    ? 'bg-white shadow-sm text-teal-800' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 px-2">
        {['Active', 'Inactive'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-colors ${
              activeTab === tab ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab} Branches
          </button>
        ))}
      </div>

      {/* Directory Hierarchy */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Activity className="animate-spin text-teal-600" size={32} />
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
            <Building2 size={32} className="mx-auto mb-3 opacity-50" />
            <p className="font-bold">No records match your current filters.</p>
          </div>
        ) : (
          filteredData.map((hospital) => (
            <BranchNode 
              key={hospital.id || hospital.Id} 
              hospital={hospital} 
              autoExpand={searchQuery !== "" || !isAdminRole} 
              lockOpen={!isAdminRole}
            />
          ))
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR ACCORDION HIERARCHY ---

function BranchNode({ hospital, autoExpand, lockOpen }) {
  // If lockOpen is true (for Hospitals/Departments), we force it open
  const [isOpen, setIsOpen] = useState(autoExpand || lockOpen);
  
  useEffect(() => { 
    if (!lockOpen) setIsOpen(autoExpand); 
  }, [autoExpand, lockOpen]);

  const toggleOpen = () => {
    if (!lockOpen) setIsOpen(!isOpen);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-teal-200">
      <div 
        className={`p-6 flex items-center justify-between transition-colors ${lockOpen ? 'bg-slate-50 border-b border-slate-100 cursor-default' : 'cursor-pointer hover:bg-slate-50'}`}
        onClick={toggleOpen}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl shrink-0">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{hospital.Name || hospital.name}</h3>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 mt-0.5">
               <MapPin size={10}/> {hospital.District__r?.Name || hospital.district || "Location N/A"}
            </p>
          </div>
        </div>
        {!lockOpen && (
          <ChevronDown size={20} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </div>

      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className={`px-6 pb-6 pt-2 ${lockOpen ? 'bg-white' : 'bg-slate-50/50 border-t border-slate-100'}`}>
            {hospital.departments?.length > 0 ? (
              hospital.departments.map(dept => (
                <DepartmentNode key={dept.id || dept.Id} dept={dept} autoExpand={autoExpand} />
              ))
            ) : (
              <p className="text-xs font-bold text-slate-400 py-4 px-2">No departments established.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DepartmentNode({ dept, autoExpand }) {
  const [isOpen, setIsOpen] = useState(autoExpand);

  useEffect(() => { setIsOpen(autoExpand); }, [autoExpand]);
  
  return (
    <div className="mt-4 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div 
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <Layers size={18} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-700">{dept.name || dept.Name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
            {dept.staff?.length || 0} Staff
          </span>
          <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
        </div>
      </div>

      <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 border-t border-slate-100">
            {dept.staff?.length > 0 ? (
              dept.staff.map(member => (
                <div key={member.id} className="bg-white p-3.5 rounded-xl border border-slate-100 flex items-center gap-3 hover:border-teal-200 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-black text-xs shrink-0">
                    {(member.name || member.Name || "U")[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-slate-800 truncate">{member.name || member.Name}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mt-0.5">
                      {member.role === 'doctor' && <Stethoscope size={10} className="text-teal-600" />}
                      {member.role === 'nurse' && <Activity size={10} className="text-blue-500" />}
                      {member.role === 'receptionist' && <User size={10} className="text-amber-500" />}
                      {member.role}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md border border-slate-200">
                      ID:{member.punch_id || "N/A"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-bold text-slate-400 col-span-2 py-2">No staff assigned to this wing.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}