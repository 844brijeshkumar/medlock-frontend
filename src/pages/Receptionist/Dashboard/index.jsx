import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  User,
  Phone,
  FileText,
  Activity,
  Users,
  LogOut,
  ChevronRight,
  Menu,
  Stethoscope,
  Briefcase,
  AlertCircle,
  History,
  CreditCard,
} from "lucide-react";
import {
  getAppointmentsByReceptionist,
  updateAppointmentsByReceptionist,
} from "../../../api/auth";

// --- SALESFORCE MOCK DATA SERVICE ---
const CURRENT_HOSPITAL_ID = "HOSP-001";
const CURRENT_HOSPITAL_NAME = "City General Hospital - Main Branch";

const mockSalesforceService = {
  fetchData: async (hospitalId) => {
    // Simulating network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const doctors = [
      {
        Id: "DOC-001",
        Name: "Dr. Sarah Smith",
        Department__c: "Cardiology",
        Hospital_Ref__c: "HOSP-001",
        Status__c: "Available",
      },
      {
        Id: "DOC-002",
        Name: "Dr. James Wilson",
        Department__c: "Neurology",
        Hospital_Ref__c: "HOSP-001",
        Status__c: "In Surgery",
      },
      {
        Id: "DOC-003",
        Name: "Dr. Anita Ray",
        Department__c: "General Medicine",
        Hospital_Ref__c: "HOSP-001",
        Status__c: "Available",
      },
      {
        Id: "DOC-004",
        Name: "Dr. Robert Chen",
        Department__c: "Dermatology",
        Hospital_Ref__c: "HOSP-001",
        Status__c: "On Leave",
      },
      {
        Id: "DOC-005",
        Name: "Dr. Emily Stone",
        Department__c: "Cardiology",
        Hospital_Ref__c: "HOSP-001",
        Status__c: "Available",
      },
    ];

    // Generate appointments for the last 7 days
    const today = new Date();
    const appointments = Array.from({ length: 25 }).map((_, i) => {
      const dateOffset = i % 8; // 0 (today) to 7 days ago
      const aptDate = new Date(today);
      aptDate.setDate(today.getDate() - dateOffset);
      const dateString = aptDate.toISOString().split("T")[0];

      // Generate Aadhaar Number
      const aadhaarRaw = `${2000 + i} ${4500 + i} ${8900 + i}`;

      return {
        Id: `APT-${1000 + i}`,
        Patient_Name__c: [
          "John Doe",
          "Alice Johnson",
          "Michael Brown",
          "Emily Davis",
          "Chris Wilson",
          "Sarah Parker",
          "Tom Hanks",
        ][i % 7],
        Age__c: 20 + i * 2,
        Gender__c: i % 2 === 0 ? "Male" : "Female",
        Phone__c: `+91 98765 432${i % 10}`,
        Aadhaar__c: aadhaarRaw,
        Department__c: [
          "Cardiology",
          "General Medicine",
          "Dermatology",
          "Neurology",
        ][i % 4],
        Assigned_Doctor_Ref__c: i % 3 === 0 ? "DOC-001" : null,
        Doctor_Name_Snapshot: i % 3 === 0 ? "Dr. Sarah Smith" : null,
        // Status is only Pending or Successful now
        Status__c: i % 3 === 0 ? "Successful" : "Pending",
        Date__c: dateString,
        Notes__c:
          dateOffset > 0
            ? "Missed original slot, requesting reschedule."
            : "Walk-in patient registration via App.",
      };
    });

    const hospitalDoctors = doctors.filter(
      (d) => d.Hospital_Ref__c === hospitalId
    );
    return {
      appointments,
      doctors: hospitalDoctors,
      hospitalName: CURRENT_HOSPITAL_NAME,
    };
  },
};

const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
    Successful: "bg-green-50 text-green-700 border-green-100",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${
        styles[status] || styles.Pending
      } shadow-sm`}
    >
      {status}
    </span>
  );
};

const token = localStorage.getItem("token");
const Dashboard = () => {
  // State
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitalInfo, setHospitalInfo] = useState({ name: "", id: "" });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [timeFilter, setTimeFilter] = useState("Today");

  // Selection
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getAppointmentsAndDoctors = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentsByReceptionist(token);
        console.log("Appointments fetched:", data);
        setAppointments(data.appointments);
        setDoctors(data.doctors);
        setHospitalInfo({ name: data.hospital.name, id: data.hospital.npi });
      } catch (error) {
        console.error("Failed to fetch Salesforce data", error);
      } finally {
        setLoading(false);
      }
    };
    getAppointmentsAndDoctors();
  }, []);

  // 2. Filter Logic
  const filteredAppointments = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];

    return appointments
      ?.filter((apt) => {
        // Time Filter
        const isToday = apt?.Date__c === todayStr;
        const timeMatch = timeFilter === "Today" ? isToday : true;

        const matchesSearch =
          apt?.Patient__r?.Name.toLowerCase().includes(
            searchTerm.toLowerCase()
          ) ||
          apt?.Patient__r?.Aadhaar_No__c.replace(/\s/g, "").includes(
            searchTerm
          );
        const matchesStatus =
          selectedStatus === "All" || apt.Status__c === selectedStatus;

        return timeMatch && matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.Date__c) - new Date(a.Date__c));
  }, [appointments, searchTerm, selectedStatus, timeFilter]);

  // 3. Stats
  const stats = {
    total: filteredAppointments.length,
    pending: filteredAppointments.filter((a) => a.Status__c === "Pending")
      .length,
    successful: filteredAppointments.filter((a) => a.Status__c === "Successful")
      .length,
    activeDoctors: doctors.filter((d) => d.Status__c === "Available").length,
  };

  // 4. Handlers
  const handleAssignDoctorAndConfirm = async () => {
    if (!selectedDoctorId || !selectedAppointment) return;

    const AssignData = {
      appointmentId: selectedAppointment.Id,
      doctorId: selectedDoctorId,
    };
    try {
      const res = await updateAppointmentsByReceptionist(token, AssignData);

      // const data = await res.json();/
      if (!res.status) throw new Error(res.error);

      // ✅ Update UI after backend success
      const doctorDetails = doctors.find((d) => d.Id === selectedDoctorId);

      setAppointments((prev) =>
        prev.map((apt) =>
          apt.Id === selectedAppointment.Id
            ? {
                ...apt,
                Status__c: "Successful",
                Doctor__r: { Name: doctorDetails.Name },
              }
            : apt
        )
      );

      setSelectedAppointment((prev) => ({
        ...prev,
        Status__c: "Successful",
        Doctor__r: { Name: doctorDetails.Name },
      }));

      setSelectedDoctorId("");
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment");
    }
  };

  const getDoctorsForDepartment = (dept) =>
    doctors.filter((doc) => doc.Specialization__c === dept);

  // Helper to mask Aadhaar (Disabled: now showing full number)
  const formatAadhaar = (str) => {
    return str || "";
  };

  return (
    <div className="min-h-screen fade-in bg-gray-50 flex font-sans text-black">
      <div className="flex-1 min-w-0 overflow-hidden  p-4 lg:p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Total Patients"
            value={stats.total}
            icon={Calendar}
            color="teal"
            subtext={timeFilter === "Today" ? "Today" : "Last 7 Days"}
          />
          <StatsCard
            label="Pending Action"
            value={stats.pending}
            icon={AlertCircle}
            color="amber"
            subtext="Requires Assignment"
          />
          <StatsCard
            label="Doctors Available"
            value={stats.activeDoctors}
            icon={Stethoscope}
            color="cyan"
            subtext="Currently On Duty"
          />
          <StatsCard
            label="Successful Visits"
            value={stats.successful}
            icon={CheckCircle}
            color="emerald"
            subtext="Tickets Issued"
          />
        </div>

        {/* Main Appointment Board */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100%-200px)] min-h-[500px]">
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-gray-50/50">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-primary">Patient Queue</h2>
              <span className="px-2 py-0.5 rounded-md bg-gray-200 text-black text-xs font-bold">
                {filteredAppointments.length}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
              {/* Time Filter Toggle */}
              <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm">
                <button
                  onClick={() => setTimeFilter("Today")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    timeFilter === "Today"
                      ? "bg-secondary text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setTimeFilter("Week")}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
                    timeFilter === "Week"
                      ? "bg-secondary text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <History size={14} /> Past Week
                </button>
              </div>

              <div className="h-8 w-px bg-gray-300 hidden sm:block mx-1"></div>

              {/* Search */}
              <div className="relative group grow sm:grow-0">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search Aadhaar or Name..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 focus:border-secondary rounded-lg text-sm w-full sm:w-64 outline-none shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 bg-white border border-gray-200 focus:border-secondary rounded-lg text-sm w-full outline-none shadow-sm cursor-pointer transition-all hover:border-gray-300"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Successful">Successful</option>
                </select>
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                />
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-auto max-h-[521px] flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-gray-200 text-xs uppercase text-black tracking-wider">
                  <th className="p-4 font-semibold bg-gray-50">Date</th>
                  <th className="p-4 font-semibold bg-gray-50">Aadhaar No.</th>
                  <th className="p-4 font-semibold bg-gray-50">Patient</th>
                  <th className="p-4 font-semibold bg-gray-50">Department</th>
                  <th className="p-4 font-semibold bg-gray-50">
                    Assigned Doctor
                  </th>
                  <th className="p-4 font-semibold bg-gray-50">Status</th>
                  <th className="p-4 font-semibold text-right bg-gray-50">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-secondary/70 border-t-secondary rounded-full animate-spin"></div>
                        <span className="font-medium animate-pulse">
                          Syncing with Hospital Database...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Users size={32} className="opacity-50" />
                        </div>
                        <p className="font-medium text-gray-600">
                          No appointments found
                        </p>
                        <p className="text-sm mt-1">
                          Try adjusting your filters or date range.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt, index) => (
                    <tr
                      key={index}
                      onClick={() => {
                        setSelectedAppointment(apt);
                        setSelectedDoctorId(""); // Reset
                      }}
                      className={`hover:bg-teal-50/40 transition-colors cursor-pointer group ${
                        selectedAppointment?.Id === apt.Id
                          ? "bg-teal-50/60"
                          : ""
                      }`}
                    >
                      <td className="p-4">
                        <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          {apt.Date__c ===
                          new Date().toISOString().split("T")[0] ? (
                            <span className="text-primary font-medium bg-teal-50 px-2 py-0.5 rounded">
                              Today
                            </span>
                          ) : (
                            apt.Date__c
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">
                          <CreditCard size={14} className="text-gray-400" />
                          {formatAadhaar(apt.Patient__r?.Aadhaar_No__c)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 text-primary flex items-center justify-center text-sm font-bold shadow-sm">
                            {apt.Patient__r?.Name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {apt.Patient__r?.Name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {apt.Age__c} yrs • {apt.Gender__c}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {apt.Department__c}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {apt.Doctor__r?.Name ? (
                          <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium">
                            <Stethoscope size={14} className="text-secondary" />
                            {apt.Doctor__r?.Name}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-400">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={apt.Status__c} />
                      </td>
                      <td className="p-4 text-right">
                        <ChevronRight
                          size={18}
                          className="text-gray-300 ml-auto group-hover:text-secondary transition-colors"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Slide-over */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedAppointment(null)}
          ></div>

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Appointment Details
                </h3>
                <span className="text-xs font-mono text-gray-400">
                  ID: {selectedAppointment.Id}
                </span>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Warning */}
              {selectedAppointment.Date__c !==
                new Date().toISOString().split("T")[0] && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 items-start">
                  <History
                    className="text-amber-500 shrink-0 mt-0.5"
                    size={18}
                  />
                  <div>
                    <p className="text-sm font-bold text-amber-800">
                      Past Appointment
                    </p>
                    <p className="text-xs text-amber-600">
                      This appointment was scheduled for{" "}
                      {selectedAppointment.Date__c}. Verify patient details
                      carefully.
                    </p>
                  </div>
                </div>
              )}

              {/* Patient Profile */}
              <div className="bg-gradient-to-br from-primary to-secondary p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center text-2xl font-bold shadow-md border-2 border-primary/30">
                    {selectedAppointment.Patient__r?.Name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">
                      {selectedAppointment.Patient__r?.Name}
                    </h4>
                    <p className="text-teal-50 opacity-90 text-sm">
                      {selectedAppointment.Gender__c},{" "}
                      {selectedAppointment.Age__c} years
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm bg-white/20 px-2 py-1 rounded-lg w-fit backdrop-blur-sm">
                      <Phone size={14} />{" "}
                      {selectedAppointment.Patient__r?.Phone__c}
                    </div>
                  </div>
                </div>
              </div>

              {/* Aadhaar Info */}
              <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl flex flex-col gap-1">
                <label className="text-xs text-primary font-bold uppercase tracking-wider">
                  Aadhaar Number
                </label>
                <div className="flex items-center gap-3">
                  <CreditCard className="text-primary" size={20} />
                  <span className="text-lg font-mono font-bold text-gray-800 tracking-wide">
                    {formatAadhaar(
                      selectedAppointment.Patient__r?.Aadhaar_No__c
                    )}
                  </span>
                  <span className="ml-auto text-xs px-2 py-1 bg-green-100 text-secondary font-bold rounded">
                    VERIFIED
                  </span>
                </div>
              </div>

              {/* Info Blocks */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 border border-gray-100 rounded-xl bg-gray-50">
                  <label className="text-xs text-gray-500 font-medium uppercase">
                    Date of Visit
                  </label>
                  <p className="font-semibold text-gray-800 flex items-center gap-2 mt-1">
                    <Calendar size={16} className="text-secondary" />{" "}
                    {selectedAppointment.Date__c}
                  </p>
                </div>
              </div>

              {/* Department & Doctor */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Stethoscope size={16} className="text-secondary" /> Clinical
                  Details
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Department</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedAppointment.Department__c}
                    </span>
                  </div>

                  <div className="p-4 bg-white">
                    {selectedAppointment.Status__c === "Pending" ? (
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                          Assign Doctor
                        </label>
                        <select
                          className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-secondary outline-none transition-shadow"
                          value={selectedDoctorId}
                          onChange={(e) => setSelectedDoctorId(e.target.value)}
                        >
                          <option value="">Choose available doctor...</option>
                          {getDoctorsForDepartment(
                            selectedAppointment.Department__c
                          ).map((doc, index) => (
                            <option
                              key={index}
                              value={doc.Id}
                              disabled={doc.Status__c !== "Available"}
                            >
                              {doc.Name} ({doc.Status__c})
                            </option>
                          ))}
                        </select>
                        {getDoctorsForDepartment(
                          selectedAppointment.Department__c
                        ).length === 0 && (
                          <p className="text-xs text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded">
                            <AlertCircle size={12} /> No doctors available
                            currently.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-50 text-primary flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {selectedAppointment.Doctor__r?.Name || "Unknown"}
                          </p>
                          <p className="text-xs text-teal-600 font-medium">
                            Attending Physician
                          </p>
                        </div>
                        <CheckCircle
                          className="ml-auto text-emerald-500"
                          size={20}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              {selectedAppointment.Status__c === "Pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={handleAssignDoctorAndConfirm}
                    disabled={!selectedDoctorId}
                    className="flex-[2] py-3 bg-gradient-to-r from-primary to-secondary disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl hover:shadow-lg hover:shadow-teal-200 transition-all text-sm flex justify-center items-center gap-2"
                  >
                    Assign & Issue Ticket
                  </button>
                </div>
              )}

              {selectedAppointment.Status__c === "Successful" && (
                <div className="w-full py-3 bg-emerald-50 text-secondary border border-emerald-100 font-bold rounded-xl text-center text-sm cursor-default flex items-center justify-center gap-2">
                  <CheckCircle size={16} /> Ticket Issued
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for stats cards
const StatsCard = ({ label, value, icon: Icon, color, subtext }) => {
  const colorClasses = {
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-3 rounded-xl ${colorClasses[color]} bg-opacity-50`}>
          <Icon size={24} />
        </div>
        {subtext && (
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            {subtext}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mt-2">{value}</h3>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  );
};

// Helper Icon
const BuildingIcon = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M8 14h.01"></path>
    <path d="M16 14h.01"></path>
  </svg>
);

export default Dashboard;
