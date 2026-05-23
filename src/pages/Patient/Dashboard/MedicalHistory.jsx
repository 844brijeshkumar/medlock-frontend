import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Clock,
  User,
  FileText,
  Building,
  ArrowUpDown,
  AlertCircle,
} from "lucide-react";
import { getReportsByPatient } from "../../../api/auth";
import { mockPatient, mockReports } from "../../../utils"; // Keeping existing imports

// Helper functions
const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "lab":
      return "🧪";
    case "imaging":
      return "📊";
    case "prescription":
      return "💊";
    case "consultation":
      return "👨‍⚕️";
    case "surgery":
      return "🔪";
    case "vaccination":
      return "💉";
    default:
      return "📄";
  }
};

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getPriorityColor = (priority) => {
  const p = priority?.toLowerCase() || "medium";
  switch (p) {
    case "critical":
      return "text-red-600 bg-red-50 border-red-100";
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-100";
    case "medium":
      return "text-blue-600 bg-blue-50 border-blue-100";
    case "low":
      return "text-green-600 bg-green-50 border-green-100";
    default:
      return "text-gray-600 bg-gray-50 border-gray-100";
  }
};

const token = localStorage.getItem("token");

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [reports, setReports] = useState([]);

  // --- THEME CONFIGURATION ---
  const theme = useMemo(
    () => ({
      primary: "#0b4f4a",
      secondary: "#2a9b94",
      accent: "#d1e8e5",
    }),
    [],
  );

  // Filter Options
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "lab", label: "Lab Tests" },
    { value: "imaging", label: "Imaging" },
    { value: "prescription", label: "Prescriptions" },
    { value: "consultation", label: "Consultations" },
    { value: "surgery", label: "Surgery" },
    { value: "vaccination", label: "Vaccinations" },
    { value: "other", label: "Other" },
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  // Logic to get ID from theme in localStorage
  const themeString = localStorage.getItem("theme");
  const themeObj = themeString ? JSON.parse(themeString) : null;
  const id = themeObj?.id;

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await getReportsByPatient(token, id);
        if (res?.status) {
          setReports(res.reports);
        }
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    }
    loadReports();
  }, [id]);

  // Filtering and Sorting
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports?.filter((report) => {
      const matchesSearch =
        (report.Category__c?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (report.Doctor__r?.Name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (report.Hospital__r?.Name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        ) ||
        (report.Title__c?.toLowerCase() || "").includes(
          searchTerm.toLowerCase(),
        );

      const matchesCategory =
        selectedCategory === "all" || report.Category__c === selectedCategory;

      // Note: Assuming API returns Priority__c, otherwise this defaults to passing if undefined
      const matchesPriority =
        selectedPriority === "all" ||
        (report.Priority__c || "Medium") === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.Date_of_issue__c).getTime();
        const dateB = new Date(b.Date_of_issue__c).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "priority") {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityA =
          priorityOrder[a.Priority__c?.toLowerCase() || "medium"] || 0;
        const priorityB =
          priorityOrder[b.Priority__c?.toLowerCase() || "medium"] || 0;
        return sortOrder === "desc"
          ? priorityB - priorityA
          : priorityA - priorityB;
      }
      return 0;
    });

    return filtered;
  }, [
    reports,
    searchTerm,
    selectedCategory,
    selectedPriority,
    sortBy,
    sortOrder,
  ]);

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
            Medical History
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-1">
            Complete timeline of your healthcare journey
          </p>
        </div>
      </div>

      {/* 🔹 FILTER BAR */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col xl:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search reports, doctors, or hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none text-gray-700 placeholder-gray-400 transition-all font-medium"
          />
        </div>

        <div className="hidden xl:block w-px bg-gray-200 my-2"></div>

        {/* Filters Group */}
        <div className="flex flex-col md:flex-row gap-2">
          {/* Category Filter */}
          <div className="relative md:w-48 group">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="relative md:w-40 group">
            <AlertCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600"
            >
              {priorities.map((pri) => (
                <option key={pri.value} value={pri.value}>
                  {pri.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="relative md:w-48 group">
            <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split("-");
                setSortBy(sort);
                setSortOrder(order);
              }}
              className="w-full pl-10 pr-8 py-3 bg-gray-50/50 rounded-xl focus:bg-white border border-transparent focus:border-secondary focus:ring-4 focus:ring-secondary/10 outline-none appearance-none cursor-pointer font-medium text-gray-600"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="priority-desc">High Priority First</option>
              <option value="priority-asc">Low Priority First</option>
            </select>
          </div>
        </div>

        {/* Result Count */}
        <div className="flex items-center px-6 py-2 bg-gray-50 rounded-xl text-xs font-black uppercase tracking-wider text-gray-400 whitespace-nowrap">
          {filteredAndSortedReports.length} records
        </div>
      </div>

      {/* 🔹 REPORTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedReports.map((report, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden"
          >
            {/* Top Accent Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex items-start gap-4 mb-4">
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-2xl shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                {getCategoryIcon(report.Category__c)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                    {report.Title__c}
                  </h3>
                  {/* Display Category as badge if priority isn't main focus, or use Priority if available */}
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ml-2 whitespace-nowrap ${getPriorityColor(report.Priority__c || "Medium")}`}
                  >
                    {report.Category__c}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1 group-hover:text-gray-600 transition-colors">
                  {report.Notes__c || "No description provided."}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group-hover:border-secondary/10 transition-colors">
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                <User className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                <span className="truncate font-medium">
                  Dr. {report.Doctor__r?.Name || "N/A"}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                <Building className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                <span className="truncate">
                  {report.Hospital__r?.Name || "Hospital"}
                </span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-xs text-gray-400 mt-1">
                <Clock className="w-3 h-3" />
                <span>Issued: {formatDate(report.Date_of_issue__c)}</span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(report.URL__c, "_blank")}
                  className="flex items-center gap-2 bg-secondary/5 text-secondary hover:bg-secondary hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <a
                  href={report?.URL__c?.replace(
                    "/upload/",
                    "/upload/fl_attachment/",
                  )}
                  download
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Download"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {filteredAndSortedReports.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors">
              <FileText className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors" />
            </div>
            <p className="font-medium text-lg">No medical records found.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedPriority("all");
              }}
              className="mt-2 text-sm font-bold text-secondary hover:text-primary hover:underline transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
