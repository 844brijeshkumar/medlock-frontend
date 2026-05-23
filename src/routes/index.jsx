import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { PrivateRoute, PublicRoute } from "../utils";
import Layout from "../components/Layout/index.jsx";
import {
  doctorNavigation,
  hospitalNavigation,
  patientNavigation,
  receptionistNavigation,
  adminNavigation,
} from "../utils/navigaion.js";
import PhlebotomyDashboard from "../pages/Donation/Dashboard/Collecting.jsx";
import AnalyticsCommandCenter from "../pages/Donation/Dashboard/Collection.jsx";
import Bed from "../pages/Depertment/Dashboard/Bed.jsx"
import AddEvent from "../pages/Depertment/Dashboard/AddEvent.jsx"
import ViewEvent from "../pages/Depertment/Dashboard/ViewEvent.jsx"
import BloodLab from "../pages/Donation/Dashboard/BloodLab.jsx"

const Contact = lazy(() => import("../pages/ContactUs"));
const About = lazy(() => import("../pages/AboutUs"));
const Service = lazy(() => import("../pages/Services"));
const PrivacyPolicy = lazy(() => import("../pages/Privacy"));
const TermsOfService = lazy(() => import("../pages/Terms"));
const MedicalHistory = lazy(
  () => import("../pages/Patient/Dashboard/MedicalHistory.jsx"),
);
const AppointmentBooking = lazy(
  () => import("../pages/Patient/Dashboard/AppointmentBooking.jsx"),
);
const ReportUpload = lazy(
  () => import("../pages/Doctor/Dashboard/ReportUpload.jsx"),
);
const MyAppointment = lazy(
  () => import("../pages/Patient/Dashboard/MyAppointment.jsx"),
);
const MyInsurance = lazy(
  () => import("../pages/Patient/Dashboard/MyInsurance.jsx"),
);
const MyDonation = lazy(
  () => import("../pages/Patient/Dashboard/MyDonation.jsx"),
);
const BookDonation = lazy(
  () => import("../pages/Patient/Dashboard/Donating.jsx"),
);
const AssignReport = lazy(
  () => import("../pages/Doctor/Dashboard/AssignReport.jsx"),
);
const Insurance = lazy(() => import("../pages/Doctor/Dashboard/Insurance.jsx"));
const DoctorsSection = lazy(
  () => import("../pages/Hospital/Dashboard/DoctorSection.jsx"),
);
const ReportsSection = lazy(
  () => import("../pages/Hospital/Dashboard/ReportSection.jsx"),
);
const ProfileSection = lazy(
  () => import("../pages/Hospital/Dashboard/ProfileSection.jsx"),
);
const ReceptionistSection = lazy(
  () => import("../pages/Hospital/Dashboard/ReceptionistsSection.jsx"),
);
const PatientSettingsPage = lazy(
  () => import("../pages/Patient/Dashboard/PatientSettingsPage.jsx"),
);
const PatientLookUp = lazy(
  () => import("../pages/Doctor/Dashboard/PatientLookUp.jsx"),
);
const BranchList = lazy(
  () => import("../pages/Admin/Dashboard/BranchList.jsx"),
);
const ManagementHospital = lazy(
  () => import("../pages/Admin/Dashboard/Management"),
);
const TransferDoctor = lazy(() => import("../pages/Admin/Dashboard/Transfer"));
const ManagementDoctor = lazy(
  () => import("../pages/Admin/Dashboard/Management/Doctors.jsx"),
);
const ManagementReceptionist = lazy(
  () => import("../pages/Admin/Dashboard/Management/Receptionists.jsx"),
);
const Receptionist = lazy(
  () => import("../pages/Admin/Dashboard/Transfer/Receptionist.jsx"),
);
const AdminSelection = lazy(
  () => import("../pages/Patient/Dashboard/AdminSelection.jsx"),
);
const DepartmentCharges = lazy(
  () => import("../pages/Admin/Dashboard/Charges.jsx"),
);
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));
const PatientDashboard = lazy(() => import("../pages/Patient/Dashboard"));
const ReceptionistDashboard = lazy(
  () => import("../pages/Receptionist/Dashboard"),
);
const ReceptionistBilling = lazy(
  () => import("../pages/Receptionist/Dashboard/billing.jsx"),
);
const ReceptionistClaims = lazy(
  () => import("../pages/Receptionist/Dashboard/claims.jsx"),
);
const ReceptionistStatus = lazy(
  () => import("../pages/Receptionist/Dashboard/status.jsx"),
);
const ReceptionistUpload = lazy(
  () => import("../pages/Receptionist/Dashboard/upload.jsx"),
);
const ReceptionistProvider = lazy(
  () => import("../pages/Receptionist/Dashboard/provider.jsx"),
);
const ReceptionistPreview = lazy(
  () => import("../pages/Receptionist/Dashboard/preview.jsx"),
);
const DoctorDashboard = lazy(() => import("../pages/Doctor/Dashboard"));
const DoctorStatus = lazy(() => import("../pages/Doctor/Dashboard/status.jsx"));
const AdminDashboard = lazy(() => import("../pages/Admin/Dashboard"));
const HospitalDashboard = lazy(() => import("../pages/Hospital/Dashboard"));
const LoginPatient = lazy(() => import("../pages/Patient/Login"));
const Login = lazy(() => import("../pages/login/index.jsx"));
const HospitalHomePage = lazy(() => import("../pages/Hospital/Home"));

const doctor = "Doctor";
const patient = "Patient";
const hospital = "Hospital";
const receptionist = "Receptionist";
const admin = "Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Home />
      </PublicRoute>
    ),
  },
  {
    path: "/department/bed",
    element: (
      <PublicRoute>
        <Bed />
      </PublicRoute>
    ),
  },
  {
    path: "/department/add-event/:patientId/:bedId",
    element: (
      <PublicRoute>
        <AddEvent />
      </PublicRoute>
    ),
  },
  {
    path: "/department/view-event/:patientId/:bedId",
    element: (
      <PublicRoute>
        <ViewEvent />
      </PublicRoute>
    ),
  },
  {
    path: "/blood-lab",
    element: (
      <PublicRoute>
        <BloodLab />
      </PublicRoute>
    ),
  },
  {
    path: "/patient/dashboard",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <PatientDashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/report",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <MedicalHistory />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/appointment-booking",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <AppointmentBooking />
        </Layout>
      </PrivateRoute>
    ),
  },

  {
    path: "/patient/my-appointment",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <MyAppointment />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/my-insurance",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <MyInsurance />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/my-donation",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <MyDonation />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/book-donation",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <BookDonation />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/selectadmin",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <AdminSelection />
      </PrivateRoute>
    ),
  },
  {
    path: "/patient/settings",
    element: (
      <PrivateRoute allowedRoles={["patient"]} redirectTo="/login/patient">
        <Layout navigation={patientNavigation} name={patient}>
          <PatientSettingsPage />
        </Layout>
      </PrivateRoute>
    ),
  },

  {
    path: "/doctor/dashboard",
    element: (
      <PrivateRoute allowedRoles={["doctor"]} redirectTo="/login">
        <Layout navigation={doctorNavigation} name={doctor}>
          {" "}
          <DoctorDashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/doctor/insurance",
    element: (
      <PrivateRoute allowedRoles={["doctor"]} redirectTo="/login">
        <Layout navigation={doctorNavigation} name={doctor}>
          {" "}
          <Insurance />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/doctor/status",
    element: (
      <PrivateRoute allowedRoles={["doctor"]} redirectTo="/login">
        <Layout navigation={doctorNavigation} name={doctor}>
          {" "}
          <DoctorStatus />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/doctor/report-upload",
    element: (
      <PrivateRoute allowedRoles={["doctor"]} redirectTo="/login">
        <Layout navigation={doctorNavigation} name={doctor}>
          {" "}
          <ReportUpload />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/doctor/patient",
    element: (
      <PrivateRoute allowedRoles={["doctor"]} redirectTo="/login">
        <Layout navigation={doctorNavigation} name={doctor}>
          {" "}
          <PatientLookUp />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/doctor/assign-report",
    element: (
      <PrivateRoute allowedRoles={["doctor"]} redirectTo="/login">
        <Layout navigation={doctorNavigation} name={doctor}>
          {" "}
          <AssignReport />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/hospital/dashboard",
    element: (
      <PrivateRoute allowedRoles={["hospital"]} redirectTo="/login">
        <Layout navigation={hospitalNavigation} name={hospital}>
          <HospitalDashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/hospital/doctor-form",
    element: (
      <PrivateRoute allowedRoles={["hospital"]} redirectTo="/login">
        <Layout navigation={hospitalNavigation} name={hospital}>
          <DoctorsSection />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/hospital/receptionist-form",
    element: (
      <PrivateRoute allowedRoles={["hospital"]} redirectTo="/login">
        <Layout navigation={hospitalNavigation} name={hospital}>
          <ReceptionistSection />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/hospital/reports",
    element: (
      <PrivateRoute allowedRoles={["hospital"]} redirectTo="/login">
        <Layout navigation={hospitalNavigation} name={hospital}>
          <ReportsSection />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/hospital/profile",
    element: (
      <PrivateRoute allowedRoles={["hospital"]} redirectTo="/login">
        <Layout navigation={hospitalNavigation} name={hospital}>
          <ProfileSection />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <AdminDashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/charges",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <DepartmentCharges />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/branch",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <BranchList />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/management/hospital",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <ManagementHospital />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/management/doctor",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <ManagementDoctor />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/management/receptionist",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <ManagementReceptionist />
        </Layout>
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/transfer/doctor",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <TransferDoctor />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/transfer/receptionist",
    element: (
      <PrivateRoute allowedRoles={["admin"]} redirectTo="/login">
        <Layout navigation={adminNavigation} name={admin}>
          <Receptionist />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/dashboard",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistDashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/billing",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistBilling />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/claims",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistClaims />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/upload",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistUpload />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/status",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistStatus />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/provider",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistProvider />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/receptionist/preview",
    element: (
      <PrivateRoute
        allowedRoles={["receptionist"]}
        redirectTo="/login"
      >
        <Layout navigation={receptionistNavigation} name={receptionist}>
          <ReceptionistPreview />
        </Layout>
      </PrivateRoute>
    ),
  },

  { path: "/contact", element: <Contact /> },
  { path: "/about", element: <About /> },
  { path: "/services", element: <Service /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms-of-service", element: <TermsOfService /> },
  
  {
    path: "/login/patient",
    element: (
      <PublicRoute>
        <LoginPatient />
      </PublicRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/hospital",
    element: (
      <PublicRoute>
        <HospitalHomePage />
      </PublicRoute>
    ),
  },
  {
    path: "/blood-collecting",
    element: (
      <PublicRoute>
        <PhlebotomyDashboard />
      </PublicRoute>
    ),
  },
  {
    path: "/blood-collection",
    element: (
      <PublicRoute>
        <AnalyticsCommandCenter />
      </PublicRoute>
    ),
  },

  { path: "*", element: <NotFound /> },
]);

export default router;