import React, { useState } from "react";
import { 
  Send, User, Phone, CreditCard, Calendar, Mail 
} from "lucide-react";

const ReceptionistForm = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  editingId 
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInternal = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  // Helper classes - Exact match to DoctorForm
  const inputWrapperClass = "relative flex items-center";
  const iconClass = "absolute left-3 w-3.5 h-3.5 text-primary pointer-events-none";
  const inputClass = "w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-secondary focus:border-primary outline-none transition-all duration-200 placeholder-gray-400 text-gray-700";
  const labelClass = "block text-[11px] font-bold text-black uppercase tracking-wider mb-1 ml-0.5";

  return (
    <div className="p-5 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <div>
          <h3 className="text-lg font-bold text-primary">
            {editingId ? "Edit Receptionist" : "New Receptionist"}
          </h3>
          <p className="text-[11px] text-black font-bold mt-0.5">Enter the receptionist's personal details below.</p>
        </div>
        <div className="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center text-primary">
          <User className="w-4 h-4" />
        </div>
      </div>

      <form onSubmit={handleSubmitInternal} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className={labelClass}>Full Name</label>
            <div className={inputWrapperClass}>
              <User className={iconClass} />
              <input 
                type="text" 
                name="name" 
                value={formData.name || ""} 
                onChange={handleChange} 
                required 
                className={inputClass} 
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>
            <div className={inputWrapperClass}>
              <Phone className={iconClass} />
              <input 
                type="text" 
                name="phone_no" 
                value={formData.phone_no || ""} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <div className={inputWrapperClass}>
              <Mail className={iconClass} />
              <input 
                type="email" 
                name="email" 
                value={formData.email || ""} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="receptionist@hospital.com"
              />
            </div>
          </div>

          {/* Aadhaar */}
          <div>
            <label className={labelClass}>Aadhaar Number</label>
            <div className={inputWrapperClass}>
              <CreditCard className={iconClass} />
              <input 
                type="text" 
                name="adhaar_no" 
                value={formData.adhaar_no || ""} 
                onChange={handleChange} 
                className={inputClass} 
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClass}>Date of Birth</label>
            <div className={inputWrapperClass}>
              <Calendar className={iconClass} />
              <input 
                type="date" 
                name="date_of_birth" 
                value={formData.date_of_birth || ""} 
                onChange={handleChange} 
                className={`${inputClass} pl-9`} 
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-2">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 text-xs bg-white border border-primary rounded-lg text-black hover:bg-secondary/50 font-bold transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-5 py-2 text-xs bg-gradient-to-r from-primary/70 to-secondary/70 text-white rounded-lg flex items-center gap-2 hover:from-primary hover:to-secondary font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> 
                {editingId ? "Update" : "Save"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceptionistForm;