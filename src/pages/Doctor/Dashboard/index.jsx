import { formatTime } from "../../../utils";

import {
  Users,
  Calendar,
  FileText,
  Clock,
  UserPlus,
  ArrowRight,
} from "lucide-react";
const today = new Date(); // Use the current date to ensure filtering works
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const doctorData = {
  name: "Priya Sharma",
};

// 2. List of all patients
const patientsData = [
  {
    id: "PAT451",
    name: "Aarav Singh",
    // Activity from earlier today
    lastActivityDate: new Date(new Date().setHours(14, 30, 0)).toISOString(),
  },
  {
    id: "PAT452",
    name: "Saanvi Gupta",
    // Activity from this morning
    lastActivityDate: new Date(new Date().setHours(9, 15, 0)).toISOString(),
  },
  {
    id: "PAT453",
    name: "Vihaan Mehta",
    lastActivityDate: new Date(new Date().setHours(8, 0, 0)).toISOString(),
  },
  {
    id: "PAT454",
    name: "Myra Reddy",
    lastActivityDate: new Date(yesterday.setHours(17, 0, 0)).toISOString(),
  },
];

// 3. List of all appointments
const appointmentsData = [
  // Appointments for Today
  {
    id: "APT789",
    patientName: "Aarav Singh",
    reason: "Post-op Follow-up",
    date: new Date(new Date().setHours(10, 0, 0)).toISOString(),
  },
  {
    id: "APT790",
    patientName: "Saanvi Gupta",
    reason: "Annual Physical Exam",
    date: new Date(new Date().setHours(11, 30, 0)).toISOString(),
  },
  {
    id: "APT791",
    patientName: "Ananya Desai",
    reason: "Consultation for fever",
    date: new Date(new Date().setHours(15, 0, 0)).toISOString(),
  },
  // Appointment for tomorrow (will be filtered out)
  {
    id: "APT792",
    patientName: "Vihaan Mehta",
    reason: "Vaccination",
    date: new Date(tomorrow.setHours(9, 0, 0)).toISOString(),
  },
];
const Dashboard = () => {
  const today = new Date();
  const doctorData = localStorage.getItem("dashboardName");
  const todaysAppointments = appointmentsData?.filter((appt) => {
    const apptDate = new Date(appt.date);
    return (
      apptDate.getDate() === today.getDate() &&
      apptDate.getMonth() === today.getMonth() &&
      apptDate.getFullYear() === today.getFullYear()
    );
  });

  // Get recent patient activity
  const recentActivity = patientsData?.slice(0, 3);
  return (
    <div className="fade-in min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50/50">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary via-primary/70 to-primary/60 rounded-2xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back ,{doctorData || " "}!
              </h1>
              <p className="text-stone-100">
                Here's a summary of your activities for today,{" "}
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                .
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-blue-800">
                      {patientsData?.length}
                    </p>
                    <p className="text-blue-700 font-medium">Total Patients</p>
                  </div>
                  <div className="bg-blue-500 p-3 rounded-xl shadow-md">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-white rounded-2xl shadow-lg p-6 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-emerald-800">
                      {todaysAppointments?.length}
                    </p>
                    <p className="text-emerald-700 font-medium">
                      Today's Appointments
                    </p>
                  </div>
                  <div className="bg-emerald-500 p-3 rounded-xl shadow-md">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-white rounded-2xl shadow-lg p-6 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-amber-800">12</p>
                    <p className="text-amber-700 font-medium">
                      Reports to Review
                    </p>
                  </div>
                  <div className="bg-amber-500 p-3 rounded-xl shadow-md">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Patient Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Clock className="h-6 w-6 text-gray-500 mr-3" />
                  Recent Patient Activity
                </h2>
                <button className="text-[#0b4f4a] hover:text-[#1a756f] text-sm font-medium bg-teal-50 px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors">
                  View All Activity
                </button>
              </div>
              <div className="space-y-4">
                {recentActivity?.map((patient) => (
                  <div
                    key={patient.id}
                    className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 p-3 rounded-full">
                          <UserPlus className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            New report uploaded for {patient.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Patient ID: {patient.id}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatTime(patient.lastActivityDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Today's Schedule */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-6 w-6 text-indigo-500 mr-3" />
                Today's Schedule
              </h2>
              <div className="space-y-5">
                {todaysAppointments?.length > 0 ? (
                  todaysAppointments?.map((appt) => (
                    <div
                      key={appt.id}
                      className="flex items-start space-x-4 group"
                    >
                      <div className="flex-shrink-0 w-16 text-right">
                        <p className="font-bold text-indigo-600">
                          {formatTime(appt.date)}
                        </p>
                      </div>
                      <div className="relative w-full pl-6 border-l-2 border-indigo-200 group-hover:border-indigo-400 transition-colors">
                        <div className="absolute -left-[11px] top-1 h-5 w-5 bg-indigo-500 rounded-full border-4 border-white group-hover:bg-indigo-600 transition-colors"></div>
                        <h3 className="font-medium text-gray-800">
                          {appt.patientName}
                        </h3>
                        <p className="text-sm text-gray-500">{appt.reason}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-4 text-gray-600">
                      No appointments scheduled for today.
                    </p>
                  </div>
                )}
              </div>
              <button className="w-full mt-8 text-indigo-600 hover:text-white text-sm font-medium bg-indigo-50 px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center">
                View Full Schedule <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Dashboard;
