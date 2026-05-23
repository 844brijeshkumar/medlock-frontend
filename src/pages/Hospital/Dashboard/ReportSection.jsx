import React, { useState, useMemo, useEffect } from "react";
import { formatDate } from "../../../utils";
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Stethoscope,
  Building,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { getReportsByHospital } from "../../../api/auth";

const token = localStorage.getItem("token");

const ReportsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [reports, setReports] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");

  // --- THEME CONFIGURATION ---
  const theme = useMemo(() => ({
    primary: "#0b4f4a",
    secondary: "#2a9b94",
    accent: "#d1e8e5",
  }), []);

  useEffect(() => {
    async function loadReports() {
      const res = await getReportsByHospital(token);
      if (res?.status) {
        setReports(
          res.reports.map((r) => ({
            report_id: r.Id,
            title: r?.Title__c,
            category: r?.Category__c,
            description: r?.Notes__c,
            fileUrl: r?.URL__c,
            date_of_issue: r?.Date_of_issue__c,
            priority: r?.Priority__c || "Medium",
            status: "Completed",
            patient_name: r?.Patient__r?.Name || "Unknown Patient",
            doctorName: r?.Doctor__r?.Name || "N/A",
            npi_id: r?.Hospital__r?.NPI_id__c,
          }))
        );
      }
    }
    loadReports();
  }, []);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Lab Test", label: "Lab Tests" },
    { value: "Imaging", label: "Imaging" },
    { value: "Prescription", label: "Prescriptions" }, // Fixed case to match API usually
    { value: "Consultation", label: "Consultations" },
    { value: "Surgery", label: "Surgery" },
    { value: "Vaccination", label: "Vaccinations" },
    { value: "Other", label: "Other" },
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" },
  ];

  // Filter and sort reports
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "all" || report.category === selectedCategory;
      const matchesPriority =
        selectedPriority === "all" || report.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date_of_issue).getTime();
        const dateB = new Date(b.date_of_issue).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        const priorityA = priorityOrder[a.priority] || 0;
        const priorityB = priorityOrder[b.priority] || 0;
        return sortOrder === "desc"
          ? priorityB - priorityA
          : priorityA - priorityB;
      }
      return 0;
    });

    return filtered;
  }, [reports, searchTerm, selectedCategory, selectedPriority, sortBy, sortOrder]);

  // Priority Badge Styling
  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Medium": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Low": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div 
      className="space-y-8 p-10 fade-in bg-slate-50 min-h-screen relative"
      style={{ 
        "--primary": theme.primary, 
        "--secondary": theme.secondary, 
        "--accent": theme.accent 
      }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black tracking-tight text-primary">Medical Reports</h2>
        <button className="group relative overflow-hidden bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <Download className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform" />
          Export All Data
        </button>
      </div>

      {/* 🔹 FILTER BAR */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col xl:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search reports, patients, doctors..."
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
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
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
                    <option key={pri.value} value={pri.value}>{pri.label}</option>
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
          {filteredAndSortedReports.length} found
        </div>
      </div>

      {/* 🔹 REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedReports.map((report, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden"
          >
            {/* Top Accent Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            {/* Card Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex gap-4">
                    {/* Icon Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 group-hover:rotate-6 shadow-sm shrink-0">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {report.title}
                        </h3>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-secondary transition-colors">
                            {report.category || "General"}
                        </span>
                    </div>
                </div>
                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                </span>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <User className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                    <span className="truncate"><span className="font-semibold text-gray-400 text-xs uppercase mr-1">Patient:</span> {report.patient_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <Stethoscope className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                    <span className="truncate"><span className="font-semibold text-gray-400 text-xs uppercase mr-1">Doctor:</span> {report.doctorName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <Building className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                    <span className="truncate"><span className="font-semibold text-gray-400 text-xs uppercase mr-1">NPI:</span> {report.npi_id}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50 group-hover:border-gray-100 transition-colors">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-primary transition-colors">
                    <Calendar className="h-3 w-3 group-hover:text-secondary transition-colors" />
                    {formatDate(report.date_of_issue)}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                    report.status === "Completed" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${report.status === "Completed" ? "bg-green-500" : "bg-yellow-500"}`} />
                    {report.status}
                </div>
            </div>

            {/* Hover View/Action Overlay (Optional Hint) */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}

        {filteredAndSortedReports.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors">
               <FileText className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors" />
            </div>
            <p className="font-medium text-lg">No reports found matching your criteria.</p>
            <button 
               onClick={() => {setSearchTerm(""); setSelectedCategory("all"); setSelectedPriority("all");}}
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

export default ReportsSection;