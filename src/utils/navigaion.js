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
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Branch", href: "/admin/branch", icon: Building2 },
  {
    name: "charges",
    href: "/admin/charges",
    icon: DocumentTextIcon,
  },
  {
    name: "Management",
    icon: MagnifyingGlassIcon,
    subItems: [
      {
        name: "Hospitals",
        href: "/admin/management/hospital",
        icon: MagnifyingGlassIcon,
      },
      { name: "Doctors", href: "/admin/management/doctor", icon: Contact2 },
      {
        name: "Receptionists",
        href: "/admin/management/receptionist",
        icon: Contact2,
      },
    ],
  },
  {
    name: "Transfer",
    icon: Users,
    subItems: [
      { name: "Doctor", href: "/admin/transfer/doctor", icon: Package },
      {
        name: "Receptionist",
        href: "/admin/transfer/receptionist",
        icon: FileText,
      },
    ],
  },
];

export const doctorNavigation = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Report", href: "/doctor/report-upload", icon: DocumentTextIcon },
  { name: "Assign", href: "/doctor/assign-report", icon: User },
  { name: "Patients", href: "/doctor/patient", icon: Users },
  {
    name: "Insurance",
    icon: FileText,
    subItems: [
      { name: "Clinical Data", href: "/doctor/insurance", icon: Package },
      {name: "Status", href: "/doctor/status", icon: Stethoscope},
    ],
  },
];

export const receptionistNavigation = [
  { name: "Dashboard", href: "/receptionist/dashboard", icon: Activity },
  {
    name: "Insurance",
    icon: FileText,
    subItems: [
      { name: "Claims", href: "/receptionist/claims", icon: Package },
      {name: "Provider", href: "/receptionist/provider", icon: User},
      {name: "Billing", href: "/receptionist/billing", icon: FileText},
      {name: "Upload", href: "/receptionist/upload", icon: Package},
      {name: "Preview", href: "/receptionist/preview", icon: User},
      {name: "Status", href: "/receptionist/status", icon: Stethoscope},
    ],
  },
];

export const hospitalNavigation = [
  { name: "Dashboard", href: "/hospital/dashboard", icon: LayoutDashboard },
  { name: "Doctors", href: "/hospital/doctor-form", icon: Stethoscope },
  { name: "Receptionists", href: "/hospital/receptionist-form", icon: UserCog },
  { name: "Profile", href: "/hospital/profile", icon: Building2 },
  { name: "Reports", href: "/hospital/reports", icon: DocumentTextIcon },
];
