import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  FileText,
  Activity,
  Download,
  X,
  Stethoscope,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { getAppointmentsByPatient } from "../../../api/auth";

const token = localStorage.getItem("token");

// --- THEME & STYLES ---
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Successful: "bg-teal-50 text-teal-700 border-teal-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
};

const AppointmentCard = ({ appointment }) => {
  return (
    <div className="group relative bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/10 hover:border-secondary overflow-hidden">
      {/* Decorative accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${
          appointment.Status__c === "Successful"
            ? "bg-secondary"
            : appointment.Status__c === "Pending" 
                ? "bg-amber-400"
                : "bg-red-400"
        }`}
      ></div>

      <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center pl-4">
        {/* Left: Ticket & Hospital Info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100 font-mono">
              {appointment.Name}
            </span>
            <StatusBadge status={appointment.Status__c} />
          </div>

          <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors">
            {appointment.Hospital__r.Name}
          </h3>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors">
            <div className="p-1.5 bg-accent/30 rounded-lg text-secondary">
                <Stethoscope size={14} />
            </div>
            <span>
              {appointment.Doctor__r?.Name
                ? `Dr. ${appointment.Doctor__r?.Name}`
                : "Doctor Not Assigned"}
            </span>
          </div>
        </div>

        {/* Middle: Clinical Details */}
        <div className="flex-1 md:border-l md:border-r border-gray-100 md:px-8 py-2 md:py-0">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Department
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Activity size={16} className="text-secondary" />
                {appointment.Department__c}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Date
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <Calendar size={16} className="text-secondary" />
                {appointment.Date__c}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col gap-3 min-w-[160px]">
          {appointment.Status__c === "Pending" ? (
            <button className="flex items-center justify-center gap-2 w-full py-2.5 font-bold text-xs uppercase tracking-wide rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-100 cursor-default">
              <Clock size={16} />
              Awaiting Approval
            </button>
          ) : (
            <>
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95">
                <FileText size={16} />
                View Ticket
                </button>
                {appointment.Status__c === "Successful" && (
                <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-white text-gray-600 font-bold text-xs uppercase tracking-wide rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all active:scale-95">
                    <Download size={16} />
                    Prescription
                </button>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All"); 
  const [searchMonth, setSearchMonth] = useState(""); 
  
  const themeString = localStorage.getItem("theme");
  const themeObj = themeString ? JSON.parse(themeString) : null;
  const id = themeObj?.id;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getAppointmentsByPatient(token, id);
        setAppointments(data.appointments);
      } catch (error) {
        console.error("Failed to load appointments", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter Logic
  const filteredAppointments = appointments?.filter((apt) => {
    if (searchMonth) {
      return apt?.Date__c.startsWith(searchMonth);
    }
    if (filter === "All") return true;
    const aptDate = new Date(apt.Date__c);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "Upcoming") return aptDate >= today;
    if (filter === "Past") return aptDate < today;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">
              My Appointments
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Manage your OPD tickets and hospital visits
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
          {/* Tab Filters */}
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-3xl w-full md:w-auto">
            {["All", "Upcoming", "Past"].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setSearchMonth(""); 
                }}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                  filter === f && !searchMonth
                    ? "bg-white text-primary shadow-md transform scale-105 ring-1 ring-black/5"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200"></div>

          {/* Month Search Input */}
          <div className="relative group w-full md:w-auto px-2 pb-2 md:pb-0 md:px-0">
            <div
              className={`flex items-center bg-gray-50 border border-transparent rounded-2xl px-4 py-2.5 transition-all group-hover:bg-white group-hover:border-secondary/30 ${
                searchMonth
                  ? "bg-white border-secondary ring-4 ring-secondary/10"
                  : ""
              }`}
            >
              <Calendar
                size={18}
                className={`mr-3 transition-colors ${searchMonth ? "text-secondary" : "text-gray-400 group-hover:text-secondary"}`}
              />
              <input
                type="month"
                value={searchMonth}
                onChange={(e) => setSearchMonth(e.target.value)}
                className="w-full md:w-40 text-sm font-bold text-gray-700 placeholder-gray-400 bg-transparent outline-none"
              />
              {searchMonth && (
                <button
                  onClick={() => setSearchMonth("")}
                  className="p-1 ml-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear filter"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 bg-white rounded-[2rem] animate-pulse border border-gray-100 shadow-sm"
              ></div>
            ))}
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            {filteredAppointments.map((apt) => (
              <AppointmentCard key={apt.Id} appointment={apt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-400 font-medium max-w-sm mx-auto mb-8">
              {searchMonth
                ? `No appointments found for ${new Date(
                    searchMonth + "-01",
                  ).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}`
                : "You haven't booked any appointments in this category."}
            </p>
            <button
              onClick={() => {
                setFilter("All");
                setSearchMonth("");
              }}
              className="bg-primary text-white px-8 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}