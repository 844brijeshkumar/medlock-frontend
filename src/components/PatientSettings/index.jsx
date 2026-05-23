import React, { useState, useRef } from "react";
import {
  User,
  Phone,
  Mail,
  Lock,
  Droplet,
  Calendar,
  Users,
  Save,
  X,
  CreditCard,
  ShieldAlert,
  Contact,
  Heart,
  Camera,
  Upload,
} from "lucide-react";
import { patientSettings } from "../../api/auth";
const token = localStorage.getItem("token");
const PatientSettings = ({
  // Allow passing initial data, or use defaults
  initialData = {
    name: "",
    aadhaar: "",
    phone: "",
    email: "",
    password: "",
    bloodGroup: "",
    dob: "",
    gender: "",
    photo: "",
    ecName: "",
    ecRelation: "",
    ecPhone: "",
    ecEmail: "",
  },
  onClose = () => {},
  onSave = () => {},
}) => {
  const [formData, setFormData] = useState(initialData);
  const [photoPreview, setPhotoPreview] = useState(initialData.photo || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      setFormData((prev) => ({
        ...prev,
        photo: base64, // ✅ BASE64 STRING
      }));

      setPhotoPreview(base64); // for UI preview
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await patientSettings(token, formData);
      onSave(formData);
      setLoading(false);

      alert("Patient details updated successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-300">
        {/* --- Header with MedLock Gradient --- */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6 flex justify-between items-center relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Edit Patient Record
            </h2>
            <p className="text-teal-100 text-sm mt-1 flex items-center gap-2">
              <ShieldAlert size={14} />
              Confidential Medical Record
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm z-10"
          >
            <X size={24} />
          </button>
        </div>

        {/* --- Form --- */}
        <form
          onSubmit={handleSubmit}
          className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar"
        >
          {/* PHOTO UPLOAD SECTION */}
          <div className="flex flex-col items-center mb-10 -mt-2">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 flex items-center justify-center relative ring-4 ring-teal-50 group-hover:ring-teal-100 transition-all">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={64} className="text-gray-300" />
                )}

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="text-white drop-shadow-md" size={32} />
                </div>
              </div>

              <button
                type="button"
                className="absolute bottom-1 right-1 bg-teal-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-teal-700 transition-transform hover:scale-110"
              >
                <Upload size={16} />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            <p className="text-sm text-gray-400 mt-3 font-medium">
              Click to upload patient photo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
            {/* SECTION 1: PERSONAL DETAILS */}
            <div className="lg:col-span-2 pb-2 border-b border-gray-100 mb-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-teal-600" /> Personal
                Information
              </h3>
            </div>
            {/* Patient Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Patient Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled
                  placeholder="Enter full name"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Aadhaar No */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Aadhaar No <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <CreditCard
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  disabled
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar number"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled
                  placeholder="Mobile number"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password Hash <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Date of Birth
              </label>
              <div className="relative group">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-gray-600 shadow-sm"
                />
              </div>
            </div>
            {/* Blood Group */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Blood Group
              </label>
              <div className="relative group">
                <Droplet
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all appearance-none text-gray-600 shadow-sm"
                >
                  <option value="">--None--</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Gender
              </label>
              <div className="relative group">
                <Users
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-500 transition-colors"
                  size={18}
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all appearance-none text-gray-600 shadow-sm"
                >
                  <option value="">--None--</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            {/* SECTION 2: EMERGENCY CONTACT */}
            <div className="lg:col-span-2 pb-2 border-b border-gray-100 mb-2 mt-6 bg-red-50/50 p-3 rounded-xl border border-red-100/50">
              <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider flex items-center gap-2">
                <Contact size={16} /> Emergency Contact Information
              </h3>
            </div>
            {/* Emergency Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Contact Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300 group-focus-within:text-red-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  name="ecName"
                  value={formData.ecName}
                  onChange={handleChange}
                  required
                  placeholder="Relative/Friend Name"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Relationship */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Relation <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Heart
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300 group-focus-within:text-red-500 transition-colors"
                  size={18}
                />
                <select
                  name="ecRelation"
                  value={formData.ecRelation}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none transition-all text-gray-600 appearance-none shadow-sm"
                >
                  <option value="">-- Select Relation --</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Husband">Husband</option>
                  <option value="Wife">Wife</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Emergency Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300 group-focus-within:text-red-500 transition-colors"
                  size={18}
                />
                <input
                  type="tel"
                  name="ecPhone"
                  value={formData.ecPhone}
                  onChange={handleChange}
                  required
                  placeholder="Emergency contact number"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
            {/* Emergency Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Emergency Gmail (Optional)
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-red-300 group-focus-within:text-red-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  name="ecEmail"
                  value={formData.ecEmail}
                  onChange={handleChange}
                  placeholder="contact@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-red-100 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-300 outline-none transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-10 flex gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-200 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientSettings;
