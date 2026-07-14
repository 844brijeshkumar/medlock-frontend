import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import Layout from "../components/Layout/index.jsx";
import HomeLayout from "../components/HomeLayout/index.jsx";

import PhlebotomyDashboard from "../pages/Donation/Dashboard/Collecting.jsx";
import AnalyticsCommandCenter from "../pages/Donation/Dashboard/Collection.jsx";
import Bed from "../pages/Depertment/Dashboard/Bed.jsx";
import AddEvent from "../pages/Depertment/Dashboard/AddEvent.jsx";
import ViewEvent from "../pages/Depertment/Dashboard/ViewEvent.jsx";
import BloodLab from "../pages/Donation/Dashboard/BloodLab.jsx";

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

const Insurance = lazy(
  () => import("../pages/Doctor/Dashboard/Insurance.jsx"),
);

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

const TransferStaff = lazy(
  () => import("../pages/Admin/Dashboard/Transfer"),
);

const ManagementStaff = lazy(
  () => import("../pages/Admin/Dashboard/Management/Staff.jsx"),
);

const ManagementDepartment = lazy(
  () => import("../pages/Admin/Dashboard/Management/Department.jsx"),
);


const AdminSelection = lazy(
  () => import("../pages/Patient/Dashboard/AdminSelection.jsx"),
);

const DepartmentCharges = lazy(
  () => import("../pages/Admin/Dashboard/Charges.jsx"),
);

import Home from "../pages/Home";
const Features = lazy(() => import("../pages/Features"));
const Plugins = lazy(() => import("../pages/Plugins"));
const Pricing = lazy(() => import("../pages/Pricing"));
const Solutions = lazy(() => import("../pages/Solutions"));
const NotFound = lazy(() => import("../pages/NotFound"));

const PatientDashboard = lazy(
  () => import("../pages/Patient/Dashboard"),
);

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

const DoctorDashboard = lazy(
  () => import("../pages/Doctor/Dashboard"),
);

const DoctorStatus = lazy(
  () => import("../pages/Doctor/Dashboard/status.jsx"),
);

const AdminDashboard = lazy(
  () => import("../pages/Admin/Dashboard"),
);

const AdminSubscription = lazy(
  () => import("../pages/Admin/Dashboard/Subscription.jsx"),
);

const HospitalDashboard = lazy(
  () => import("../pages/Hospital/Dashboard"),
);

const LoginPatient = lazy(
  () => import("../pages/Patient/Login"),
);

const Login = lazy(
  () => import("../pages/login/index.jsx"),
);

const doctor = "Doctor";
const patient = "Patient";
const hospital = "Hospital";
const receptionist = "Receptionist";
const admin = "Admin";

const router = createBrowserRouter([
  // --- PUBLIC FRONT DESK PAGES ---
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "features", element: <Features /> },
      { path: "plugins", element: <Plugins /> },
      { path: "pricing", element: <Pricing /> },
      { path: "solutions", element: <Solutions /> },
      { path: "services", element: <Service /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },
    ],
  },

  // --- INTERNAL DASHBOARDS AND OTHER ROUTES ---
  {
    path: "/bed",
    element: <Bed />,
  },

  {
    path: "/add-event/:patientId/:bedId",
    element: <AddEvent />,
  },

  {
    path: "/view-event/:patientId/:bedId",
    element: <ViewEvent />,
  },

  {
    path: "/blood-lab",
    element: <BloodLab />,
  },

  {
    path: "/patient/dashboard",
    element: (
      <Layout name={patient}>
        <PatientDashboard />
      </Layout>
    ),
  },

  {
    path: "/patient/report",
    element: (
      <Layout name={patient}>
        <MedicalHistory />
      </Layout>
    ),
  },

  {
    path: "/patient/appointment-booking",
    element: (
      <Layout name={patient}>
        <AppointmentBooking />
      </Layout>
    ),
  },

  {
    path: "/patient/my-appointment",
    element: (
      <Layout name={patient}>
        <MyAppointment />
      </Layout>
    ),
  },

  {
    path: "/patient/my-insurance",
    element: (
      <Layout name={patient}>
        <MyInsurance />
      </Layout>
    ),
  },

  {
    path: "/patient/my-donation",
    element: (
      <Layout name={patient}>
        <MyDonation />
      </Layout>
    ),
  },

  {
    path: "/patient/book-donation",
    element: (
      <Layout name={patient}>
        <BookDonation />
      </Layout>
    ),
  },

  {
    path: "/patient/selectadmin",
    element: <AdminSelection />,
  },

  {
    path: "/patient/settings",
    element: (
      <Layout name={patient}>
        <PatientSettingsPage />
      </Layout>
    ),
  },

  {
    path: "/dr-dashboard",
    element: (
      <Layout name={doctor}>
        <DoctorDashboard />
      </Layout>
    ),
  },

  {
    path: "/clinical-ins-dashboard",
    element: (
      <Layout name={doctor}>
        <Insurance />
      </Layout>
    ),
  },

  {
    path: "/clinical-ins-status",
    element: (
      <Layout name={doctor}>
        <DoctorStatus />
      </Layout>
    ),
  },

  {
    path: "/report-upload",
    element: (
      <Layout name={doctor}>
        <ReportUpload />
      </Layout>
    ),
  },

  {
    path: "/patient-lookup",
    element: (
      <Layout name={doctor}>
        <PatientLookUp />
      </Layout>
    ),
  },

  {
    path: "/assign-report",
    element: (
      <Layout name={doctor}>
        <AssignReport />
      </Layout>
    ),
  },

  {
    path: "/hp-dashboard",
    element: (
      <Layout name={hospital}>
        <HospitalDashboard />
      </Layout>
    ),
  },

  {
    path: "/hp/doctor-form",
    element: (
      <Layout name={hospital}>
        <DoctorsSection />
      </Layout>
    ),
  },

  {
    path: "/hp/receptionist-form",
    element: (
      <Layout name={hospital}>
        <ReceptionistSection />
      </Layout>
    ),
  },

  {
    path: "/hp/reports",
    element: (
      <Layout name={hospital}>
        <ReportsSection />
      </Layout>
    ),
  },

  {
    path: "/hp/profile",
    element: (
      <Layout name={hospital}>
        <ProfileSection />
      </Layout>
    ),
  },

  {
    path: "/ad-dashboard",
    element: (
      <Layout name={admin}>
        <AdminDashboard />
      </Layout>
    ),
  },

  {
    path: "/subscription",
    element: (
      <Layout name={admin}>
        <AdminSubscription />
      </Layout>
    ),
  },

  {
    path: "/charges",
    element: (
      <Layout name={admin}>
        <DepartmentCharges />
      </Layout>
    ),
  },

  {
    path: "/branch",
    element: (
      <Layout name={admin}>
        <BranchList />
      </Layout>
    ),
  },

  {
    path: "/management/hospital",
    element: (
      <Layout name={admin}>
        <ManagementHospital />
      </Layout>
    ),
  },
  {
    path: "/management/department",
    element: (
      <Layout name={admin}>
        <ManagementDepartment />
      </Layout>
    ),
  },

  {
    path: "/management/staff",
    element: (
      <Layout name={admin}>
        <ManagementStaff />
      </Layout>
    ),
  },

  {
    path: "/transfer/staff",
    element: (
      <Layout name={admin}>
        <TransferStaff />
      </Layout>
    ),
  },

  {
    path: "/rs-dashboard",
    element: (
      <Layout name={receptionist}>
        <ReceptionistDashboard />
      </Layout>
    ),
  },

  {
    path: "/adminal-billing",
    element: (
      <Layout name={receptionist}>
        <ReceptionistBilling />
      </Layout>
    ),
  },

  {
    path: "/adminal-claims",
    element: (
      <Layout name={receptionist}>
        <ReceptionistClaims />
      </Layout>
    ),
  },

  {
    path: "/adminal-report-upload",
    element: (
      <Layout name={receptionist}>
        <ReceptionistUpload />
      </Layout>
    ),
  },

  {
    path: "/adminal-status",
    element: (
      <Layout name={receptionist}>
        <ReceptionistStatus />
      </Layout>
    ),
  },

  {
    path: "/adminal-provider",
    element: (
      <Layout name={receptionist}>
        <ReceptionistProvider />
      </Layout>
    ),
  },

  {
    path: "/adminal-preview",
    element: (
      <Layout name={receptionist}>
        <ReceptionistPreview />
      </Layout>
    ),
  },

  {
    path: "/login/patient",
    element: <LoginPatient />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/blood-collecting",
    element: <PhlebotomyDashboard />,
  },

  {
    path: "/blood-collection",
    element: <AnalyticsCommandCenter />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;