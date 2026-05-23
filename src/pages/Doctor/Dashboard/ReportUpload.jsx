import { useState, useMemo } from "react";
import {
  Upload,
  FileText,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  X,
  CloudUpload,
  Type
} from "lucide-react";
import { mockReports } from "../../../utils";
import { createReport } from "../../../api/auth";

const categories = [
  { value: "lab", label: "Lab Tests", icon: "🧪" },
  { value: "imaging", label: "Imaging", icon: "📊" },
  { value: "prescription", label: "Prescriptions", icon: "💊" },
  { value: "consultation", label: "Consultations", icon: "👨‍⚕️" },
  { value: "surgery", label: "Surgery", icon: "🏥" },
  { value: "vaccination", label: "Vaccinations", icon: "💉" },
  { value: "other", label: "Other", icon: "📄" },
];

const priorities = [
  { value: "low", label: "Low", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  { value: "medium", label: "Medium", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  { value: "high", label: "High", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { value: "critical", label: "Critical", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
];

const token = localStorage.getItem("token");

const ReportUpload = () => {
  const [formData, setFormData] = useState({
    aadhaar: "",
    title: "",
    category: "lab",
    dateOfExpire: "",
    description: "",
    priority: "medium",
    tags: "",
  });

  const [reports, setReports] = useState(mockReports);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dateError, setDateError] = useState("");

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  // Logic to disable today and past dates (Minimum date is tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minExpiryDate = tomorrow.toISOString().split("T")[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "dateOfExpire") setDateError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) setUploadedFile(files[0]);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) setUploadedFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Expiry must be a future date
    if (formData.dateOfExpire) {
      const selectedDate = new Date(formData.dateOfExpire);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        setDateError("Expiry date must be a future date.");
        return;
      }
    }

    if (!uploadedFile) {
      alert("Please upload a report file");
      return;
    }
    
    // ... (Existing Logic Preserved) ...
    const patientId = "0015f00000"; 
    const doctorId = "a015f00000"; 
    const hospitalId = "a025f000"; 

    try {
      const formPayload = new FormData();
      formPayload.append("file", uploadedFile);
      formPayload.append("patientId", patientId);
      formPayload.append("doctorId", doctorId);
      formPayload.append("hospitalId", hospitalId);
      formPayload.append("category", formData.category);
      formPayload.append("description", formData.description);
      formPayload.append("expiryDate", formData.dateOfExpire);
      formPayload.append("title", formData.title);
      formPayload.append("priority", formData.priority);
      formPayload.append("tags", formData.tags);
      formPayload.append("aadhaar", formData.aadhaar);

      const res = await createReport(token, formPayload);

      setShowSuccess(true);

      const newReport = {
        id: Date.now().toString(),
        patientName: formData.patientName,
        title: formData.title,
        category: formData.category,
        dateOfExpire: formData.dateOfExpire,
        description: formData.description,
        priority: formData.priority,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length > 0),
        fileUrl: URL.createObjectURL(uploadedFile),
      };

      setReports((prevReports) => [newReport, ...prevReports]);

      setFormData({
        aadhaar: "",
        title: "",
        category: "lab",
        dateOfExpire: "",
        description: "",
        priority: "medium",
        tags: "",
      });

      setUploadedFile(null);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Error uploading report. Please try again.");
    }
  };

  const removeFile = () => setUploadedFile(null);

  // Common Styles
  const labelClass = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1";
  const inputWrapperClass = "relative group";
  const iconClass = "absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors duration-300 pointer-events-none";
  const inputClass = "w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 hover:border-secondary/30";

  return (
    <div 
      className="fade-in max-w-5xl mx-auto px-6 py-10 bg-slate-50 min-h-screen"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Patient report added successfully!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-primary">Upload Report</h1>
        <p className="text-sm font-medium text-gray-500 mt-1">Add medical documents to patient records.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* File Upload Area */}
          <div className="lg:col-span-2">
            <label className={labelClass}>Upload Report File</label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 group cursor-pointer overflow-hidden ${
                dragOver
                  ? "border-secondary bg-secondary/5 scale-[1.01]"
                  : uploadedFile
                  ? "border-emerald-400 bg-emerald-50/30"
                  : "border-gray-200 hover:border-secondary/50 hover:bg-gray-50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {uploadedFile ? (
                <div className="flex items-center justify-center space-x-4 relative z-20">
                  <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600 shadow-sm">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg">{uploadedFile.name}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); removeFile(); }}
                    className="z-30 p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors ml-4"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-secondary/10 group-hover:text-secondary transition-all duration-300 text-gray-400">
                    <CloudUpload className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-bold text-gray-700 group-hover:text-primary transition-colors">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400 mt-2 font-medium">
                    PDF, JPG, PNG (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Patient Aadhaar */}
          <div>
            <label className={labelClass}>Patient Aadhaar</label>
            <div className={inputWrapperClass}>
              <User className={iconClass} />
              <input
                type="text"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleInputChange}
                required
                placeholder="e.g. 1234-5678-9012"
                className={inputClass}
              />
            </div>
          </div>

          {/* Report Title */}
          <div>
            <label className={labelClass}>Report Title</label>
            <div className={inputWrapperClass}>
              <Type className={iconClass} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Blood Test Results"
                className={inputClass}
              />
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label className={labelClass}>Category</label>
            <div className={inputWrapperClass}>
              <Tag className={iconClass} />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className={labelClass}>Expiry Date</label>
            <div className={inputWrapperClass}>
              <Calendar className={iconClass} />
              <input
                type="date"
                name="dateOfExpire"
                min={minExpiryDate}
                value={formData.dateOfExpire}
                onChange={handleInputChange}
                className={`${inputClass} ${dateError ? "border-red-300 ring-red-100" : ""}`}
              />
            </div>
            {dateError && <p className="text-red-500 text-xs font-bold mt-1 ml-1">{dateError}</p>}
          </div>

          {/* Priority Selection */}
          <div className="lg:col-span-2">
            <label className={labelClass}>Priority Level</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {priorities.map((item) => (
                <label
                  key={item.value}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    formData.priority === item.value
                      ? `${item.border} ${item.bg} shadow-md scale-105`
                      : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={item.value}
                    checked={formData.priority === item.value}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <AlertCircle className={`h-6 w-6 mb-2 ${item.color} ${formData.priority === item.value ? 'opacity-100' : 'opacity-50'}`} />
                  <span className={`text-sm font-bold uppercase tracking-wide ${formData.priority === item.value ? item.color : 'text-gray-400'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className={labelClass}>Description / Notes</label>
            <div className="relative group">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter any clinical notes..."
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 resize-none hover:border-secondary/30"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="lg:col-span-2">
            <label className={labelClass}>Tags (Optional)</label>
            <div className={inputWrapperClass}>
              <Tag className={iconClass} />
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. routine, follow-up (comma separated)"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-end pt-6 border-t border-gray-50">
          <button
            type="submit"
            className="group relative overflow-hidden bg-primary text-white px-10 py-4 rounded-2xl font-bold flex items-center shadow-xl shadow-primary/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <Upload className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform" />
            Upload Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportUpload;