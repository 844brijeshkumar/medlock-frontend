import { ShieldCheck, Users, Globe } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

export const mockPatient = {
  id: "1",
  name: "Brijesh Maurya",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  dateOfBirth: new Date("1985-06-15"),
  gender: "male",
  bloodGroup: "A+",
  emergencyContact: {
    name: "Priya Sharma",
    phone: "+91 98765 43211",
    relation: "Wife",
  },
  allergies: ["Penicillin", "Peanuts"],
  chronicConditions: ["Hypertension", "Diabetes Type 2"],
};

export const mockReports = [
  {
    id: "1",
    patientId: "1",
    title: "Complete Blood Count (CBC)",
    category: "lab",
    date: new Date("2024-01-15"),
    doctorName: "Dr. Anjali Gupta",
    hospital: "City General Hospital",
    description:
      "Routine blood work showing normal hemoglobin levels and white cell count.",
    tags: ["routine", "blood-work", "normal"],
    priority: "low",
  },
  {
    id: "2",
    patientId: "1",
    title: "Chest X-Ray",
    category: "imaging",
    date: new Date("2024-01-10"),
    doctorName: "Dr. Vikram Singh",
    hospital: "Metro Medical Center",
    description:
      "Clear lungs, no signs of pneumonia or other respiratory issues.",
    tags: ["chest", "x-ray", "clear", "respiratory"],
    priority: "medium",
  },
  {
    id: "3",
    patientId: "1",
    title: "Diabetes Medication Prescription",
    category: "prescription",
    date: new Date("2024-01-08"),
    doctorName: "Dr. Meera Patel",
    hospital: "Diabetes Care Clinic",
    description: "Metformin 500mg twice daily, continue for 3 months.",
    tags: ["diabetes", "metformin", "prescription"],
    priority: "high",
  },
  {
    id: "4",
    patientId: "1",
    title: "Annual Health Checkup",
    category: "consultation",
    date: new Date("2024-01-05"),
    doctorName: "Dr. Rajesh Kumar",
    hospital: "Wellness Medical Center",
    description:
      "Annual physical examination. Blood pressure slightly elevated, diabetes under control.",
    tags: ["annual", "checkup", "physical", "bp-elevated"],
    priority: "medium",
  },
  {
    id: "5",
    patientId: "1",
    title: "COVID-19 Vaccination Booster",
    category: "vaccination",
    date: new Date("2023-12-20"),
    doctorName: "Nurse Jennifer",
    hospital: "City Vaccination Center",
    description:
      "COVID-19 booster shot administered. No adverse reactions observed.",
    tags: ["covid-19", "vaccination", "booster"],
    priority: "low",
  },
];

export const mockDoctors = [
  {
    id: "1",
    name: "Dr. Anjali Gupta",
    specialization: "Internal Medicine",
    hospital: "City General Hospital",
    email: "anjali.gupta@citygeneral.com",
    phone: "+91 98765 00001",
  },
  {
    id: "2",
    name: "Dr. Vikram Singh",
    specialization: "Radiology",
    hospital: "Metro Medical Center",
    email: "vikram.singh@metromedical.com",
    phone: "+91 98765 00002",
  },
];

export const teamMembers = [
  {
    name: "Brijesh Kumar",
    role: "Founder & CEO",
    imageUrl: "/doctor.jpg",
    bio: "Visionary with experience in India's digital public infrastructure, aiming to do for healthcare what UPI did for payments.",
  },
  {
    name: "Febin Thomas",
    role: "Chief Technology Officer",
    imageUrl: "/doctor.jpg",
    bio: "Expert in scalable, secure systems, ensuring every Indian's health data is safe and accessible.",
  },
  {
    name: "Jijo k Jose",
    role: "Head of Healthcare Alliances",
    imageUrl: "/doctor.jpg",
    bio: "Dedicated to building a nationwide network of hospitals and labs to create a truly unified health ecosystem.",
  },
];

export const coreValues = [
  {
    icon: (
      <ShieldCheck className="w-10 h-10 text-[var(--color-primary)] mb-4" />
    ),
    title: "Security & Privacy",
    description:
      "Your health data is your most personal information. We use bank-grade security and encryption, adhering to Indian data laws.",
  },
  {
    icon: <Globe className="w-10 h-10 text-[var(--color-primary)] mb-4" />,
    title: "Nationwide Access",
    description:
      "Your health records should be accessible anywhere, from a clinic in Kerala to a hospital in Kashmir.",
  },
  {
    icon: <Users className="w-10 h-10 text-[var(--color-primary)] mb-4" />,
    title: "Citizen Empowerment",
    description:
      "We put you in control. Manage, view, and securely share your complete medical history with any doctor you choose.",
  },
];
// Helper function to get the appropriate emoji icon for a report category
export const getCategoryIcon = (category) => {
  switch (category) {
    case "lab":
      return "🧪";
    case "imaging":
      return "�";
    case "prescription":
      return "💊";
    case "consultation":
      return "👨‍⚕️";
    case "surgery":
      return "🏥";
    case "vaccination":
      return "💉";
    default:
      return "📄";
  }
};

// Helper function to format the date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
};
// Helper function to calculate the patient's age
export const getAge = (patient) => {
  console.log("Patient DOB:", patient);
  if (patient === undefined || patient === null) return null;
  const today = new Date();
  const birthDate = new Date(patient);

  let age = today.getFullYear() - birthDate?.getFullYear();
  const monthDiff = today.getMonth() - birthDate?.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const hospitalData = {
  npi_id: "HOSP001",
  name: "City General Hospital",
  location: "123 Health Ave, Metropolis",
  state: "New York",
  country: "United States",
  org_issued_name: "City General Hospital Inc",
  contact: "+1 234 567 8900",
};

export const doctorsData = [
  {
    id: "DOC101",
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    specialization: "Cardiology",
    contact: "priya.sharma@cgh.com",
    email: "priya.sharma@cgh.com",
    phone_no: "+1 234 567 8901",
    address: "456 Medical Center Dr, Metropolis, NY",
    date_of_birth: "1985-03-15",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(11, 0, 0)).toISOString(),
  },
  {
    id: "DOC102",
    name: "Dr. Arjun Patel",
    specialty: "Orthopedics",
    specialization: "Orthopedics",
    contact: "arjun.patel@cgh.com",
    email: "arjun.patel@cgh.com",
    phone_no: "+1 234 567 8902",
    address: "789 Bone St, Metropolis, NY",
    date_of_birth: "1980-07-22",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(9, 30, 0)).toISOString(),
  },
  {
    id: "DOC103",
    name: "Dr. Meera Kapoor",
    specialty: "Neurology",
    specialization: "Neurology",
    contact: "meera.kapoor@cgh.com",
    email: "meera.kapoor@cgh.com",
    phone_no: "+1 234 567 8903",
    address: "123 Brain Ave, Metropolis, NY",
    date_of_birth: "1978-12-05",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(14, 15, 0)).toISOString(),
  },
  {
    id: "DOC104",
    name: "Dr. Rajesh Singh",
    specialty: "Pediatrics",
    specialization: "Pediatrics",
    contact: "rajesh.singh@cgh.com",
    email: "rajesh.singh@cgh.com",
    phone_no: "+1 234 567 8904",
    address: "987 Kids Lane, Metropolis, NY",
    date_of_birth: "1982-06-18",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(10, 45, 0)).toISOString(),
  },
  {
    id: "DOC105",
    name: "Dr. Ananya Verma",
    specialty: "Dermatology",
    specialization: "Dermatology",
    contact: "ananya.verma@cgh.com",
    email: "ananya.verma@cgh.com",
    phone_no: "+1 234 567 8905",
    address: "654 Skin Blvd, Metropolis, NY",
    date_of_birth: "1987-09-30",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(16, 0, 0)).toISOString(),
  },
  {
    id: "DOC106",
    name: "Dr. Karan Mehta",
    specialty: "Oncology",
    specialization: "Oncology",
    contact: "karan.mehta@cgh.com",
    email: "karan.mehta@cgh.com",
    phone_no: "+1 234 567 8906",
    address: "321 Cancer Care Rd, Metropolis, NY",
    date_of_birth: "1975-11-12",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(8, 20, 0)).toISOString(),
  },
  {
    id: "DOC107",
    name: "Dr. Priyanka Rao",
    specialty: "Gynecology",
    specialization: "Gynecology",
    contact: "priyanka.rao@cgh.com",
    email: "priyanka.rao@cgh.com",
    phone_no: "+1 234 567 8907",
    address: "852 Women Health St, Metropolis, NY",
    date_of_birth: "1983-02-27",
    npi_id: "HOSP001",
    lastLogin: new Date(new Date().setHours(12, 30, 0)).toISOString(),
  },
];

export const reportsData = [
  {
    id: "REP201",
    report_id: "REP201",
    patient_adhaar: "123456789012",
    doctor_id: "DOC101",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-25",
    title: "Blood Test Results",
    description: "Routine blood test results for Aarav Singh",
    priority: "High",
    category: "Lab",
    status: "Completed",
  },
  {
    id: "REP202",
    report_id: "REP202",
    patient_adhaar: "987654321098",
    doctor_id: "DOC102",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-24",
    title: "X-Ray Analysis",
    description: "X-Ray results for Saanvi Gupta",
    priority: "Medium",
    category: "Radiology",
    status: "Completed",
  },
  {
    id: "REP203",
    report_id: "REP203",
    patient_adhaar: "112233445566",
    doctor_id: "DOC103",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-23",
    title: "MRI Scan Report",
    description: "MRI scan analysis for Rohan Mehta",
    priority: "High",
    category: "Radiology",
    status: "Pending",
  },
  {
    id: "REP204",
    report_id: "REP204",
    patient_adhaar: "223344556677",
    doctor_id: "DOC104",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-22",
    title: "Pediatric Checkup Summary",
    description: "Annual checkup report for Anika Sharma",
    priority: "Low",
    category: "General",
    status: "Completed",
  },
  {
    id: "REP205",
    report_id: "REP205",
    patient_adhaar: "334455667788",
    doctor_id: "DOC105",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-21",
    title: "Skin Allergy Test",
    description: "Dermatology test results for Kabir Khan",
    priority: "Medium",
    category: "Lab",
    status: "In Progress",
  },
  {
    id: "REP206",
    report_id: "REP206",
    patient_adhaar: "445566778899",
    doctor_id: "DOC106",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-20",
    title: "Oncology Consultation Report",
    description: "Consultation summary for Priya Desai",
    priority: "High",
    category: "Consultation",
    status: "Pending",
  },
  {
    id: "REP207",
    report_id: "REP207",
    patient_adhaar: "556677889900",
    doctor_id: "DOC107",
    npi_id: "HOSP001",
    date_of_issue: "2025-09-19",
    title: "Gynecology Ultrasound Report",
    description: "Ultrasound results for Nisha Verma",
    priority: "Medium",
    category: "Radiology",
    status: "Completed",
  },
];

export const initialDoctorForm = {
  name: "",
  email: "",
  password_hash: "",
  phone_no: "",
  date_of_birth: "",
  address: "",
  specialization: "",
  npi_id: hospitalData.npi_id,
};

export const PrivateRoute = ({ children, allowedRoles, redirectTo }) => {
  // 🔑 We no longer check for 'token' here because it's an HttpOnly cookie
  const role = localStorage.getItem("role");
  const adminSelection = localStorage.getItem("adminSelection");
  const location = useLocation();

  // 1. Check if a role exists (Initial guest check)
  // If there's no role in localStorage, they definitely aren't logged in.
  if (!role) {
    return <Navigate to={redirectTo || "/"} replace />;
  }

  // 2. Access Control for "Select Admin" page (MedLock logic)
  if (role === "patient") {
    if (
      adminSelection === "false" &&
      location.pathname !== "/patient/selectadmin"
    ) {
      return <Navigate to="/patient/selectadmin" replace />;
    }

    if (
      adminSelection === "true" &&
      location.pathname === "/patient/selectadmin"
    ) {
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  // 3. Role Authorization
  if (allowedRoles && !allowedRoles.includes(role)) {
    const dashboards = {
      doctor: "/doctor/dashboard",
      hospital: "/hospital/dashboard",
      receptionist: "/receptionist/dashboard",
      patient: "/patient/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={dashboards[role] || "/"} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const adminSelection = localStorage.getItem("adminSelection");
  const location = useLocation();

  // 1. If no role is found, they are a guest. Let them see the public page (Login/Signup).
  if (!role) {
    return children;
  }

  // 2. MedLock Specific: Handle Patient onboarding redirect
  if (role === "patient" && adminSelection === "false") {
    if (location.pathname !== "/patient/selectadmin") {
      return <Navigate to="/patient/selectadmin" replace />;
    }
    return children; // They are on the right page
  }

  // 3. If they ARE logged in (role exists), redirect them away from Public pages (like Login)
  // We use a mapping to send them to their specific dashboard
  const dashboards = {
    doctor: "/doctor/dashboard",
    hospital: "/hospital/dashboard",
    receptionist: "/receptionist/dashboard",
    patient: "/patient/dashboard",
    admin: "/admin/dashboard",
  };

  return <Navigate to={dashboards[role] || "/patient/dashboard"} replace />;
};

export const newsData = {
  count: 20,
  news: [
    {
      heading:
        "New study reveals sex life impacts are major reasons for contraceptive discontinuation",
      link: "https://www.who.int/news/item/26-09-2025-new-study-reveals-sex-life-impacts-are-major-reasons-for-contraceptive-discontinuation",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/womens-childrens-and-adolescent-health/contraception/group-discussing-sexual-reproductive-health.tmb-768v.jpg?sfvrsn=62cb6679_1",
      date: "26 September 2025",
      category: "Departmental update",
    },
    {
      heading:
        "Countries and global leaders recognized for their action to tackle the obesity crisis",
      link: "https://www.who.int/news/item/26-09-2025-countries-and-global-leaders-recognized-for-their-action-to-tackle-the-obesity-crisis",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/headquarters/teams/uhc-healthier-populations-(hep)/nutrition-and-food-safety-(nfs)/directors-office-(nfd)/2025-uniatf-awards-group-photo.tmb-768v.jpg?sfvrsn=dce5d8d_2",
      date: "26 September 2025",
      category: "Departmental update",
    },
    {
      heading:
        "Recommendations announced for influenza vaccine composition for the 2026 southern hemisphere influenza season",
      link: "https://www.who.int/news/item/26-09-2025-recommendations-announced-for-influenza-vaccine-composition-for-the-2026-southern-hemisphere-influenza-season",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/diseases-and-conditions/vaccines-and-immunization/influenza-vaccination.tmb-768v.jpg?sfvrsn=3fc616c1_1",
      date: "26 September 2025",
      category: "News release",
    },
    {
      heading:
        "Member States advance vital work in support of WHO Pandemic Agreement",
      link: "https://www.who.int/news/item/25-09-2025-member-states-advance-vital-work-in-support-of-who-pandemic-agreement",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/emergencies-disasters-and-deliberate-events/pandemic-agreement/first-meeting-of-igwg-2025.tmb-768v.jpg?sfvrsn=7e7172cb_1",
      date: "25 September 2025",
      category: "News release",
    },
    {
      heading:
        "Updated WHO dashboard offers new insights on antimicrobial resistance and use",
      link: "https://www.who.int/news/item/25-09-2025-updated-who-dashboard-offers-new-insights-on-antimicrobial-resistance-and-use",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/headquarters/teams/antimicrobial-resistance-division-(amr)/surveillance-prevention-and-control-(spc)/control-and-response-strategies-(csr)/who_data_screen_small.tmb-768v.jpg?sfvrsn=f1540e72_1",
      date: "25 September 2025",
      category: "News release",
    },
    {
      heading:
        "Contraceptive use: a catalyst for women’s health and socioeconomic empowerment",
      link: "https://www.who.int/news/item/25-09-2025-contraceptive-use--a-catalyst-for-women-s-health-and-socioeconomic-empowerment",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/womens-childrens-and-adolescent-health/contraception/contraceptive-implant.tmb-768v.jpg?sfvrsn=2ab3975c_1",
      date: "25 September 2025",
      category: "Departmental update",
    },
    {
      heading:
        "Core funders of medical research commit to strengthening clinical trials worldwide",
      link: "https://www.who.int/news/item/25-09-2025-core-funders-of-medical-research-commit-to-strengthening-clinical-trials-worldwide",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/health-systems-and-interventions/clinical-trials/rd-emro-visit-to-tunisia.tmb-768v.jpg?sfvrsn=ba4e17fc_1",
      date: "25 September 2025",
      category: "News release",
    },
    {
      heading: "WHO Traditional Medicine Global Library to launch in 2025",
      link: "https://www.who.int/news/item/25-09-2025-traditional-medicine-global-library-to-launch-in-2025",
      thumbnail:
        "https://www.who.int/images/default-source/wpro/our-work/231205imicams_library_clr23-17.tmb-768v.jpg?Culture=en&sfvrsn=b3ca3d9e_1",
      date: "25 September 2025",
      category: "News release",
    },
    {
      heading:
        "Countries making unprecedented efforts, but billions still lack basic services in health care facilities - WHO/UNICEF new report warns",
      link: "https://www.who.int/news/item/24-09-2025-countries-making-unprecedented-efforts-but-billions-still-lack-basic-services-in-health-care-facilities---who-unicef-new-report-warns",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/health-systems-and-interventions/water-sanitation-and-hygiene/uni555089-2000px.tmb-768v.jpg?sfvrsn=69b596b4_1",
      date: "24 September 2025",
      category: "News release",
    },
    {
      heading: "WHO statement on autism-related issues",
      link: "https://www.who.int/news/item/24-09-2025-who-statement-on-autism-related-issues",
      thumbnail:
        "https://www.who.int/images/default-source/departments/foodborne-diseases/who-hq-logo.tmb-768v.jpg?Culture=en&sfvrsn=a3f00adc_6",
      date: "24 September 2025",
      category: "News release",
    },
    {
      heading:
        "Uncontrolled high blood pressure puts over a billion people at risk",
      link: "https://www.who.int/news/item/23-09-2025-uncontrolled-high-blood-pressure-puts-over-a-billion-people-at-risk",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/diseases-and-conditions/hypertension/nurse-checking-blood-pressure-of-a-patient.tmb-768v.jpg?sfvrsn=7fdaced3_6",
      date: "23 September 2025",
      category: "News release",
    },
    {
      heading:
        "EU renews support for WHO’s Universal Health Coverage Partnership",
      link: "https://www.who.int/news/item/22-09-2025-eu-renews-support-for-who-s-universal-health-coverage-partnership",
      thumbnail:
        "https://www.who.int/images/default-source/wpro/countries/viet-nam/health-topics/immunization/immunization--viet-nam.tmb-768v.jpg?Culture=en&sfvrsn=11aa1353_3",
      date: "22 September 2025",
      category: "News release",
    },
    {
      heading:
        "Message by the Director of the Department of Immunization, Vaccines and Biologicals at WHO - September 2025",
      link: "https://www.who.int/news/item/22-09-2025-message-by-the-director-of-the-department-of-immunization--vaccines-and-biologicals-at-who---september-2025",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/health-and-well-being/disability/blindness-and-vision-impairment/muhammad-cataract-7.tmb-768v.jpg?sfvrsn=48c84421_1",
      date: "22 September 2025",
      category: "News release",
    },
    {
      heading:
        "WHO publishes new R&D landscape analyses highlighting gaps and inequities in cancer research",
      link: "https://www.who.int/news/item/22-09-2025-who-publishes-new-r-d-landscape-analyses-highlighting-gaps-and-inequities-in-cancer-research",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/headquarters/initiatives/cervical-cancer-elimination-initiative/who-field-visit-to-the-national-cancer-hospital--afghanistan.tmb-768v.jpg?sfvrsn=b61ae52d_1",
      date: "22 September 2025",
      category: "News release",
    },
    {
      heading: "Amended International Health Regulations enter into force",
      link: "https://www.who.int/news/item/19-09-2025-amended-international-health-regulations-enter-into-force",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/diseases-and-conditions/coronavirus-disease/who-field-visit-to-covid-19-testing-and-vaccination-centre-bahrain-2021.tmb-768v.jpg?sfvrsn=c26f3aba_6",
      date: "19 September 2025",
      category: "News release",
    },
    {
      heading:
        "WHO publishes full national policy guidance to support, equitable access to controlled medicines",
      link: "https://www.who.int/news/item/19-09-2025-who-publishes-full-guideline-report-to-help-countries-ensure-safe--equitable-access-to-controlled-medicines",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/headquarters/teams/access-to-medicines-and-health-products-(mhp)/health-product-policy-and-standards-(hps)/55052.tmb-768v.jpg?sfvrsn=5eb1b84_1",
      date: "19 September 2025",
      category: "News release",
    },
    {
      heading:
        "WHO urges cost effective solutions on NCDs and mental health amidst slowing progress",
      link: "https://www.who.int/news/item/18-09-2025-who-urges-cost-effective-solutions-on-ncds-and-mental-health-amidst-slowing-progress",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/imported/russia-cvd-cardiovascular-heart.tmb-768v.jpg?sfvrsn=209a6d60_14",
      date: "18 September 2025",
      category: "News release",
    },
    {
      heading:
        '"Patient safety from the start!" — WHO urges global investment in safe paediatric and newborn care',
      link: "https://www.who.int/news/item/17-09-2025-patient-safety-from-the-start!----who-urges-global-investment-in-safe-paediatric-and-newborn-care",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/headquarters/campaigns/world-patient-safety-day/2025/wpsd-2025-key-message-4-image.tmb-768v.jpg?sfvrsn=7fba04a3_6",
      date: "17 September 2025",
      category: "News release",
    },
    {
      heading:
        "Cholera kills more people for second consecutive year, while prevention and treatment available",
      link: "https://www.who.int/news/item/12-09-2025-cholera-kills-more-people-for-second-consecutive-year-while-prevention-and-treatment-available",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/topics/diseases-and-conditions/cholera/testing-for-cholera.tmb-768v.jpg?sfvrsn=f15cf641_6",
      date: "12 September 2025",
      category: "News release",
    },
    {
      heading: "WHO released updated guideline on HIV service delivery",
      link: "https://www.who.int/news/item/12-09-2025-who-released-updated-guideline-on-hiv-service-delivery",
      thumbnail:
        "https://cdn.who.int/media/images/default-source/headquarters/teams/uhc---communicable-noncommunicable-diseases-(ucn)/global-hiv-hepatitis-and-stis-programmes-(hhs)/boosting-efforts-to-transform-care-for-ncd-in-sierra-leone.tmb-768v.jpg?sfvrsn=73252117_1",
      date: "12 September 2025",
      category: "News release",
    },
  ],
};
