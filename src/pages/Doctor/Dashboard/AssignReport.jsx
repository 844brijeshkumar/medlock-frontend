import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Download,
  Eye,
  Clock,
  User,
  ClipboardCheck,
  FileText,
  Building,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { getCategoryIcon, formatDate, getPriorityColor } from "../../../utils";
import { getReportsByDoctor } from "../../../api/auth";

const token = localStorage.getItem("token");

const AssignReport = () => {
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

  // Define categories and priorities for the filter options
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "lab", label: "Lab Tests" },
    { value: "imaging", label: "Imaging" },
    { value: "prescription", label: "Prescriptions" },
    { value: "consultation", label: "Consultations" },
  ];

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "critical", label: "Critical" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  useEffect(() => {
    async function loadReports() {
      const res = await getReportsByDoctor(token);
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
            patient_name: r?.Patient__r?.Name || "Unknown",
            doctorName: r?.Doctor__r?.Name || "N/A",
            npi_id: r?.Hospital__r?.NPI_id__c,
            hospital: r?.Hospital__r?.Name || "",
          }))
        );
      }
    }
    loadReports();
  }, []);

  // Use useMemo to filter and sort reports efficiently
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports?.filter((report) => {
      const matchesSearch =
        (report.patient_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (report.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (report.description?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (report.hospital?.toLowerCase() || "").includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || report.category === selectedCategory;
      const matchesPriority =
        selectedPriority === "all" || report.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    });

    // Sort reports based on selected criteria
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date_of_issue).getTime();
        const dateB = new Date(b.date_of_issue).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "priority") {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityA = priorityOrder[a.priority?.toLowerCase()] || 0;
        const priorityB = priorityOrder[b.priority?.toLowerCase()] || 0;
        return sortOrder === "desc"
          ? priorityB - priorityA
          : priorityA - priorityB;
      }
      return 0;
    });

    return filtered;
  }, [reports, searchTerm, selectedCategory, selectedPriority, sortBy, sortOrder]);

  // Helper to map old getPriorityColor classes to new theme styles if needed, 
  // or use directly. We will stick to the existing utils function but wrap it for the badge style.

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
        <div>
            <h2 className="text-3xl font-black tracking-tight text-primary">Manage & Assign</h2>
            <p className="text-xs font-medium text-gray-500 mt-1">Manage report access for your patients</p>
        </div>
        
        <button className="group relative overflow-hidden bg-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <Download className="h-5 w-5 mr-2 group-hover:-translate-y-1 transition-transform" />
          Export View
        </button>
      </div>

      {/* 🔹 FILTER BAR */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-gray-100 p-2 flex flex-col xl:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
          <input
            type="text"
            placeholder="Search by patient, title, or hospital..."
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
          {filteredAndSortedReports.length} reports
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
                    {getCategoryIcon(report.category)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                            {report.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ml-2 whitespace-nowrap ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 group-hover:text-gray-600 transition-colors">
                        {report.description}
                    </p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-50 group-hover:border-secondary/10 transition-colors">
                <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <User className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                    <span className="truncate font-medium">{report.patient_name}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                    <Building className="w-4 h-4 text-gray-300 group-hover:text-secondary" />
                    <span className="truncate">{report.hospital || "Hospital"}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Last updated: {formatDate(report.date_of_issue)}</span>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-2">
                <button className="flex items-center gap-2 bg-primary/5 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md">
                    <ClipboardCheck className="h-4 w-4" />
                    Assign
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.open(report.fileUrl, "_blank")}
                        className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-xl transition-all duration-300 hover:scale-110"
                        title="View Report"
                    >
                        <Eye className="h-5 w-5" />
                    </button>
                    <a
                        href={report?.fileUrl?.replace("/upload/", "/upload/fl_attachment/")}
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

export default AssignReport;
