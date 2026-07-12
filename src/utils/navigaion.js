import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  User,
  Users,
  LayoutDashboard,
  Building2,
  Stethoscope,
  Calendar,
  Activity,
  UserCog,
  Settings,
  Contact2,
  Package,
  FileText,
} from "lucide-react";

export const patientNavigation = [
  { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { name: "Report", href: "/patient/report", icon: DocumentTextIcon },
  {
    name: "Appointment",
    href: "/patient/appointment-booking",
    icon: MagnifyingGlassIcon,
  },
  { name: "My Appointment", href: "/patient/my-appointment", icon: Calendar },
  { name: "My Insurance", href: "/patient/my-insurance", icon: Stethoscope },
  { name: "Settings", href: "/patient/settings", icon: Settings },
  {
    name: "Donation",
    icon: FileText,
    subItems: [
      { name: "My Donation", href: "/patient/my-donation", icon: Package },
      {name: "Book Donation", href: "/patient/book-donation", icon: Stethoscope},
    ],
  },
];

export const adminNavigation = [
  { name: "Dashboard", href: "/ad/dashboard", icon: LayoutDashboard },
  { name: "Branch", href: "/ad/branch", icon: Building2 },
  {
    name: "charges",
    href: "/ad/charges",
    icon: DocumentTextIcon,
  },
  {
    name: "Management",
    icon: MagnifyingGlassIcon,
    subItems: [
      {
        name: "Hospitals",
        href: "/ad/management/hospital",
        icon: MagnifyingGlassIcon,
      },
      { name: "Departments", href: "/ad/management/department", icon: Contact2 },
      { name: "Staff", href: "/ad/management/staff", icon: Contact2 },

    ],
  },
  {
    name: "Transfer",
    icon: Users,
    subItems: [
      { name: "Staff", href: "/ad/transfer/staff", icon: Package },
    ],
  },
];

export const doctorNavigation = [
  { name: "Dashboard", href: "/dr/dashboard", icon: LayoutDashboard },
  { name: "Report", href: "/dr/report-upload", icon: DocumentTextIcon },
  { name: "Assign", href: "/dr/assign-report", icon: User },
  { name: "Patients", href: "/dr/patient", icon: Users },
  {
    name: "Insurance",
    icon: FileText,
    subItems: [
      { name: "Clinical Data", href: "/dr/insurance", icon: Package },
      {name: "Status", href: "/dr/status", icon: Stethoscope},
    ],
  },
];

export const receptionistNavigation = [
  { name: "Dashboard", href: "/rs/dashboard", icon: Activity },
  {
    name: "Insurance",
    icon: FileText,
    subItems: [
      { name: "Claims", href: "/rs/claims", icon: Package },
      {name: "Provider", href: "/rs/provider", icon: User},
      {name: "Billing", href: "/rs/billing", icon: FileText},
      {name: "Upload", href: "/rs/upload", icon: Package},
      {name: "Preview", href: "/rs/preview", icon: User},
      {name: "Status", href: "/rs/status", icon: Stethoscope},
    ],
  },
];

export const hospitalNavigation = [
  { name: "Dashboard", href: "/hp/dashboard", icon: LayoutDashboard },
  { name: "Doctors", href: "/hp/doctor-form", icon: Stethoscope },
  { name: "Receptionists", href: "/hp/receptionist-form", icon: UserCog },
  { name: "Profile", href: "/hp/profile", icon: Building2 },
  { name: "Reports", href: "/hp/reports", icon: DocumentTextIcon },
];
