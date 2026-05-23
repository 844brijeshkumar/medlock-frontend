import React, { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  Edit,
  Trash2,
  Search,
  Calendar,
  X,
  CheckCircle,
  ArrowUpDown,
  Phone,
  CreditCard,
  User,
  Users
} from "lucide-react";

import {
  getReceptionistsByHospital,
  registerReceptionist,
} from "../../../api/auth";
import ReceptionistForm from "./ReceptionistForm";

const initialReceptionistForm = {
  name: "",
  phone_no: "",
  adhaar_no: "",
  date_of_birth: "",
};

const token = localStorage.getItem("token");

const ReceptionistSection = () => {
  const [receptionists, setReceptionists] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialReceptionistForm);
  const [editingId, setEditingId] = useState(null);

  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  /* 🔹 LOAD DATA */
  useEffect(() => {
    async function loadReceptionists() {
      try {
        const res = await getReceptionistsByHospital(token);
        if (res?.status) {
          const mapped = res.receptionists.map((r) => ({
            id: r.Receptionist_Id__c,
            name: r.Name || "",
            phone_no: r.Phone_No__c || "",
            adhaar_no: r.Adhaar_No__c || "",
            date_of_birth: r.Date_of_Birth__c || "",
            created_at: r.CreatedDate,
          }));
          setReceptionists(mapped);
        }
      } catch (err) {
        console.error("Load receptionists error:", err);
      }
    }
    loadReceptionists();
  }, []);

  /* 🔹 HANDLERS */
  const handleAddNew = () => {
    setFormData(initialReceptionistForm);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (rec) => {
    setFormData(rec);
    setEditingId(rec.id);
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (editingId) {
      setReceptionists((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...formData } : r))
      );
      showToast("Receptionist updated successfully!");
    } else {
      const res = await registerReceptionist(token, formData);
      if (res?.status) {
        setReceptionists((prev) => [
          {
            ...formData,
            id: res.id || Date.now().toString(),
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        showToast("Receptionist added successfully!");
      }
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this receptionist?")) {
      setReceptionists((prev) => prev.filter((r) => r.id !== id));
      showToast("Receptionist removed.");
    }
  };

  /* 🔹 FILTER & SORT */
  const filteredReceptionists = useMemo(() => {
    let data = receptionists.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    data.sort((a, b) => {
      const da = new Date(a.created_at).getTime();
      const db = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? da - db : db - da;
    });

    return data;
  }, [receptionists, searchTerm, sortOrder]);

  return (
    <div 
      className="space-y-8 p-10 fade-in bg-slate-50 min-h-screen relative"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* 🔔 Toast */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle className="h-5 w-5 text-secondary" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black tracking-tight text-primary">Receptionists</h2>
        <button
          onClick={handleAddNew}
          className="group relative overflow-hidden bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300"
        >
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <UserPlus className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
          Add Receptionist
        </button>
      </div>

      {/* 🔹 FILTER BAR */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col md:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-medium"
            placeholder="Search receptionist by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-200 my-2"></div>

        {/* Sort Toggle Button */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="relative md:w-48 group flex items-center justify-between px-4 py-3 bg-gray-50/50 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 font-medium transition-all"
        >
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-secondary transition-colors" />
            <span>{sortOrder === "asc" ? "Oldest First" : "Newest First"}</span>
          </div>
        </button>

        {/* Result Count */}
        <div className="flex items-center px-6 py-2 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {filteredReceptionists.length} found
        </div>
      </div>

      {/* 🔹 CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceptionists.map((r, index) => (
          <div 
            key={r.id} 
            className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden"
          >
            {/* Top Accent Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                 {/* Icon Avatar */}
                 <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 group-hover:rotate-6 shadow-sm">
                    <User className="h-6 w-6" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                     {r.name}
                   </h3>
                   <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/5 px-2 py-1 rounded-md">
                     Front Desk
                   </span>
                 </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                 <Phone className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" />
                 <span>{r.phone_no}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                 <CreditCard className="w-4 h-4 text-gray-300 group-hover:text-secondary transition-colors" />
                 <span>Aadhaar: <span className="font-mono text-gray-600">{r.adhaar_no}</span></span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 group-hover:border-gray-100 transition-colors">
               <div className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-primary transition-colors">
                  <Calendar className="h-3 w-3 group-hover:text-secondary transition-colors" />
                  {new Date(r.created_at).toLocaleDateString()}
               </div>
               
               <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(r)}
                  className="p-2 text-secondary hover:bg-secondary/10 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(r.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredReceptionists.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors">
               <Search className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors" />
            </div>
            <p className="font-medium text-lg">No receptionists found.</p>
            <button 
               onClick={() => setSearchTerm("")}
               className="mt-2 text-sm font-bold text-secondary hover:text-primary hover:underline transition-colors"
            >
               Clear Search
            </button>
          </div>
        )}
      </div>

      {/* 🏥 POP-UP MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-primary/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 border-4 border-white">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Form Component */}
            <ReceptionistForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => setIsFormOpen(false)}
              editingId={editingId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistSection;