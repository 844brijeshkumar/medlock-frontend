import React, { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  Edit,
  Trash2,
  Stethoscope,
  Search,
  Calendar,
  X,
  CheckCircle,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { getDoctorsByHospital, doctorRegister } from "../../../api/auth";
import DoctorForm from "./DoctorForm";

// Define initial state keys to prevent undefined errors
const initialDoctorForm = {
  name: "",
  email: "",
  password: "",
  phone_no: "",
  adhaar_no: "",
  date_of_birth: "",
  specialization: "",
  npi_id: "",
};

const token = localStorage.getItem("token");

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(initialDoctorForm);
  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // UI States
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedHospital, setSelectedHospital] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  /* 🔹 LOAD & MAP DATA */
  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await getDoctorsByHospital(token);
        if (res?.status) {
          const mappedDoctors = res.doctors.map((d) => ({
            doctor_id: d.Doctor_Id__c,
            name: d.Name || "",
            email: d.Email__c || "",
            npi_id: d.Hospital__c || "",
            specialization: d.Specialization__c || "General",
            phone_no: d.Phone_No__c || "",
            adhaar_no: d.Adhaar_No__c || "",
            date_of_birth: d.DOB__c || "",
            created_at: d.CreatedDate,
          }));
          setDoctors(mappedDoctors);
        }
      } catch (error) {
        console.error("Error loading doctors:", error);
      }
    }
    loadDoctors();
  }, []);

  /* 🔹 HANDLERS */
  const handleAddNewClick = () => {
    setFormData(initialDoctorForm);
    setEditingDoctorId(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (doctor) => {
    setFormData({
      ...initialDoctorForm,
      ...doctor,
      password: "",
    });
    setEditingDoctorId(doctor.doctor_id);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    if (editingDoctorId) {
      setDoctors((prev) =>
        prev.map((doc) =>
          doc.doctor_id === editingDoctorId ? { ...doc, ...formData } : doc,
        ),
      );
      showToast("Doctor details updated successfully!");
    } else {
      const res = await doctorRegister(token, formData);
      if (res?.status) {
        setDoctors((prev) => [
          {
            ...formData,
            doctor_id: res.id || Date.now().toString(),
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        showToast("New doctor added successfully!");
      }
    }
    setIsFormOpen(false);
  };

  const handleDeleteClick = (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      setDoctors((prev) => prev.filter((doc) => doc.doctor_id !== id));
      showToast("Doctor removed.");
    }
  };

  /* 🔹 FILTER & SORT LOGIC */
  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors.filter((doc) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (doc.name?.toLowerCase() || "").includes(searchLower) ||
        (doc.specialization?.toLowerCase() || "").includes(searchLower) ||
        (doc.email?.toLowerCase() || "").includes(searchLower);

      const matchesSpecialization =
        selectedSpecialization === "all" ||
        doc.specialization === selectedSpecialization;

      const matchesHospital =
        selectedHospital === "all" || doc.npi_id === selectedHospital;

      return matchesSearch && matchesSpecialization && matchesHospital;
    });

    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

    return filtered;
  }, [
    doctors,
    searchTerm,
    selectedSpecialization,
    selectedHospital,
    sortBy,
    sortOrder,
  ]);

  const specializations = [
    "all",
    ...new Set(doctors.map((d) => d.specialization).filter(Boolean)),
  ];

  return (
    <div className="space-y-8 p-10 fade-in bg-gray-50 min-h-screen relative">
      {/* 🔔 TOP NOTIFICATION */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className="bg-[#0b4f4a] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle className="h-5 w-5 text-teal-400" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-primary">Doctors List</h2>
        <button
          onClick={handleAddNewClick}
          className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-medium flex items-center shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* 🔹 SIMPLIFIED SEARCH & FILTER SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex flex-col md:flex-row gap-2">
        {/* Search Input */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
          <input
            type="text"
            placeholder="Search doctors by name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent rounded-xl focus:bg-secondary/25 focus:ring-0 text-primary outline-none placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Divider (Desktop only) */}
        <div className="hidden md:block w-px bg-gray-200 my-2"></div>

        {/* Specialization Filter */}
        <div className="relative md:w-48">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-transparent rounded-xl focus:bg-secondary/25 focus:ring-0 text-gray-600 outline-none appearance-none cursor-pointer"
          >
            <option value="all">All Specialties</option>
            {specializations
              .filter((s) => s !== "all")
              .map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
          </select>
        </div>

        {/* Divider (Desktop only) */}
        <div className="hidden md:block w-px bg-gray-200 my-2"></div>

        {/* Sort Select */}
        <div className="relative md:w-48">
          <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [s, o] = e.target.value.split("-");
              setSortBy(s);
              setSortOrder(o);
            }}
            className="w-full pl-9 pr-4 py-2.5 bg-transparent rounded-xl focus:bg-secondary/25 focus:ring-0 text-gray-600 outline-none appearance-none cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
          </select>
        </div>

        {/* Result Count */}
        <div className="flex items-center px-4 py-2 bg-primary/50 rounded-xl text-xs font-bold text-white whitespace-nowrap">
          {filteredAndSortedDoctors.length} found
        </div>
      </div>

      {/* 🏥 POP-UP MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in zoom-in duration-200">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>

            {/* PASSING DATA TO FORM */}
            <DoctorForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
              editingDoctorId={editingDoctorId}
            />
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedDoctors.map((doctor, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-secondary hover:shadow-2xl hover:shadow-secondary/15 overflow-hidden"
          >
            {/* Top Accent Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">
                {doctor.name}
              </h3>

              {/* Action Buttons with Hover Effects */}
              <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEditClick(doctor)}
                  className="p-2 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Edit"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(doctor.doctor_id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-500">
              <p className="flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-300">
                <strong className="text-primary/70 group-hover:text-primary transition-colors">
                  Email:
                </strong>
                {doctor.email}
              </p>

              <p className="flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-300">
                <strong className="text-primary/70 group-hover:text-primary transition-colors">
                  Specialty:
                </strong>
                <span className="bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider group-hover:bg-secondary/10 group-hover:text-secondary transition-colors duration-300">
                  {doctor.specialization}
                </span>
              </p>

              <p className="flex items-center gap-2 group-hover:text-gray-700 transition-colors duration-300">
                <strong className="text-primary/70 group-hover:text-primary transition-colors">
                  Phone:
                </strong>
                {doctor.phone_no}
              </p>

              {/* Footer / Date Section */}
              <div className="pt-4 mt-2 border-t border-gray-50 group-hover:border-gray-100 transition-colors">
                <p className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-primary transition-colors duration-300">
                  <Calendar className="h-3 w-3 text-gray-300 group-hover:text-secondary transition-colors duration-300" />
                  Joined: {new Date(doctor.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State with Animation */}
        {filteredAndSortedDoctors.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-50 p-6 rounded-full mb-4 group hover:bg-secondary/10 transition-colors duration-300">
              <Search className="h-10 w-10 text-gray-300 group-hover:text-secondary transition-colors duration-300" />
            </div>
            <p className="font-medium text-lg">
              No doctors found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsSection;
