// Configuration Data

export const timeSlots = [
  "09:00 AM",
  "09:15 AM",
  "09:30 AM",
  "09:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "02:00 PM",
  "02:15 PM",
  "02:30 PM",
  "02:45 PM",
];

// Mock Logged in User
export const mockPatient = {
  id: "1",
  name: "Brijesh Maurya",
  email: "rahul.sharma@email.com",
  phone: "+91 98765 43210",
  aadhaar: "XXXX-XXXX-8821",
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

// 2. Mock Hospital Data (Simulating a Central Registry)
export const mockHospitals = [
  // Delhi
  {
    id: 1,
    name: "All India Institute of Medical Sciences (AIIMS)",
    state: "Delhi",
    district: "New Delhi",
    location: "Ansari Nagar, New Delhi",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1587351021759-3e566b9af923?auto=format&fit=crop&q=80&w=800",
    specialties: [
      "Cardiology",
      "Neurology",
      "Oncology",
      "General Surgery",
      "Nephrology",
    ],
    nextAvailable: "Today, 11:00 AM",
    idPrefix: "AIIMS-DEL-OPD",
    apiLatency: 1500, // Simulated ms to connect
  },
  {
    id: 2,
    name: "Indraprastha Apollo Hospitals",
    state: "Delhi",
    district: "South Delhi",
    location: "Sarita Vihar, New Delhi",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    specialties: [
      "Transplants",
      "Cardiology",
      "Orthopedics",
      "Robotic Surgery",
    ],
    nextAvailable: "Tomorrow, 10:00 AM",
    idPrefix: "APL-DL",
    apiLatency: 1200,
  },
  {
    id: 3,
    name: "Sir Ganga Ram Hospital",
    state: "Delhi",
    district: "Central Delhi",
    location: "Rajinder Nagar, New Delhi",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0674f66?auto=format&fit=crop&q=80&w=800",
    specialties: ["Gastroenterology", "Surgery", "Pediatrics"],
    nextAvailable: "Today, 4:00 PM",
    idPrefix: "SGRH-DEL",
    apiLatency: 1800,
  },

  // Maharashtra
  {
    id: 4,
    name: "Tata Memorial Hospital",
    state: "Maharashtra",
    district: "Mumbai",
    location: "Parel, Mumbai",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&q=80&w=800",
    specialties: ["Oncology", "Radiology", "Pathology", "Palliative Care"],
    nextAvailable: "Fri, 09:00 AM",
    idPrefix: "TMH-MUM",
    apiLatency: 2000,
  },
  {
    id: 5,
    name: "Kokilaben Dhirubhai Ambani Hospital",
    state: "Maharashtra",
    district: "Mumbai",
    location: "Andheri West, Mumbai",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800",
    specialties: [
      "Robotic Surgery",
      "Neurology",
      "Pediatrics",
      "Sports Medicine",
    ],
    nextAvailable: "Today, 2:30 PM",
    idPrefix: "KDAH-AND",
    apiLatency: 1000,
  },
  {
    id: 6,
    name: "Ruby Hall Clinic",
    state: "Maharashtra",
    district: "Pune",
    location: "Sassoon Road, Pune",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1538108149393-fbbd8189718c?auto=format&fit=crop&q=80&w=800",
    specialties: ["Cardiology", "Cancer Care", "Organ Transplant"],
    nextAvailable: "Tomorrow, 11:30 AM",
    idPrefix: "RHC-PUNE",
    apiLatency: 1400,
  },

  // Karnataka
  {
    id: 7,
    name: "Narayana Health City",
    state: "Karnataka",
    district: "Bangalore",
    location: "Bommasandra, Bangalore",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1596541223126-2a6d863f6960?auto=format&fit=crop&q=80&w=800",
    specialties: ["Cardiac Surgery", "Cardiology", "Nephrology"],
    nextAvailable: "Today, 3:00 PM",
    idPrefix: "NH-BLR",
    apiLatency: 1300,
  },
  {
    id: 8,
    name: "Manipal Hospital",
    state: "Karnataka",
    district: "Bangalore",
    location: "Old Airport Road, Bangalore",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800",
    specialties: ["Internal Medicine", "Surgery", "Pediatrics"],
    nextAvailable: "Mon, 10:00 AM",
    idPrefix: "MAN-OAR",
    apiLatency: 1100,
  },

  // Tamil Nadu
  {
    id: 9,
    name: "Christian Medical College (CMC)",
    state: "Tamil Nadu",
    district: "Vellore",
    location: "Ida Scudder Road, Vellore",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
    specialties: [
      "Hematology",
      "Gastroenterology",
      "Neurology",
      "Rehabilitation",
    ],
    nextAvailable: "Waitlist: 2 Days",
    idPrefix: "CMC-VEL",
    apiLatency: 2200,
  },
  {
    id: 10,
    name: "Apollo Main Hospital",
    state: "Tamil Nadu",
    district: "Chennai",
    location: "Greams Road, Chennai",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800",
    specialties: ["Heart Care", "Transplants", "Critical Care"],
    nextAvailable: "Today, 5:00 PM",
    idPrefix: "APL-CHN",
    apiLatency: 1200,
  },

  // Uttar Pradesh
  {
    id: 11,
    name: "Medanta - The Medicity",
    state: "Uttar Pradesh",
    district: "Lucknow",
    location: "Amar Shaheed Path, Lucknow",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    specialties: ["Cardiology", "Neurology", "Urology"],
    nextAvailable: "Tomorrow, 12:00 PM",
    idPrefix: "MED-LKO",
    apiLatency: 1400,
  },
  {
    id: 12,
    name: "SGPGI",
    state: "Uttar Pradesh",
    district: "Lucknow",
    location: "Raebareli Road, Lucknow",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=800",
    specialties: ["Endocrinology", "Gastroenterology", "Genetics"],
    nextAvailable: "Wed, 09:00 AM",
    idPrefix: "SGPGI-OPD",
    apiLatency: 1900,
  },

  // Telangana
  {
    id: 14,
    name: "Yashoda Hospitals",
    state: "Telangana",
    district: "Hyderabad",
    location: "Secunderabad, Hyderabad",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
    specialties: ["Robotic Science", "Liver Transplant", "Heart"],
    nextAvailable: "Tomorrow, 10:30 AM",
    idPrefix: "YAS-HYD",
    apiLatency: 1100,
  },

  // Kerala
  {
    id: 15,
    name: "Amrita Institute of Medical Sciences",
    state: "Kerala",
    district: "Kochi",
    location: "Ponekkara, Kochi",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&q=80&w=800",
    specialties: ["Transplants", "Cardiology", "Neurology"],
    nextAvailable: "Today, 11:00 AM",
    idPrefix: "AIMS-KOC",
    apiLatency: 1600,
  },
];

export const INITIAL_HOSPITALS = [
  {
    id: "h1",
    name: "MedLock North Clinic",
    location: "New York",
    growth: "+12.5%",
    reports: 450,
    doctors: 12,
    receptionists: 4,
    capacity: "200 Beds",
    npi: "10-223344",
    status: "Active",
  },
  {
    id: "h2",
    name: "MedLock South Center",
    location: "Miami",
    growth: "+8.2%",
    reports: 310,
    doctors: 8,
    receptionists: 3,
    capacity: "150 Beds",
    npi: "20-556677",
    status: "Inactive",
  },
  {
    id: "h3",
    name: "MedLock West Wing",
    location: "Los Angeles",
    growth: "+15.1%",
    reports: 620,
    doctors: 15,
    receptionists: 6,
    capacity: "300 Beds",
    npi: "30-889900",
    status: "Active",
  },
];

export const INITIAL_STAFF = [
  {
    id: "d1",
    name: "Dr. Sarah Connor",
    role: "Doctor",
    hospitalId: "h1",
    specialty: "Cardiology",
    email: "s.connor@medlock.com",
  },
  {
    id: "d2",
    name: "Dr. John Doe",
    role: "Doctor",
    hospitalId: "h2",
    specialty: "Neurology",
    email: "j.doe@medlock.com",
  },
  {
    id: "r1",
    name: "Alice Smith",
    role: "Receptionist",
    hospitalId: "h1",
    email: "alice@medlock.com",
  },
];

export const CHART_DATA = [
  { name: "Mon", reports: 400, growth: 240 },
  { name: "Tue", reports: 300, growth: 139 },
  { name: "Wed", reports: 200, growth: 980 },
  { name: "Thu", reports: 278, growth: 390 },
  { name: "Fri", reports: 189, growth: 480 },
  { name: "Sat", reports: 239, growth: 380 },
  { name: "Sun", reports: 349, growth: 430 },
];
