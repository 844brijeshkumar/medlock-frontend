
// 1. HARDCODED PATIENT NAVIGATION
export const patientNavigation = [
  { name: "Dashboard", href: "/patient/dashboard" },
  { name: "Report", href: "/patient/report" },
  { name: "Appointment", href: "/patient/appointment-booking" },
  { name: "My Appointment", href: "/patient/my-appointment" },
  { name: "My Insurance", href: "/patient/my-insurance" },
  { name: "Settings", href: "/patient/settings" },
  {
    name: "Donation",
    subItems: [
      { name: "My Donation", href: "/patient/my-donation" },
      { name: "Book Donation", href: "/patient/book-donation" },
    ],
  },
];

// 2. DYNAMIC NAVIGATION PARSER FOR STAFF
export const buildDynamicNavigation = (apiNavigationData) => {
  if (!apiNavigationData || !Array.isArray(apiNavigationData)) return [];

  return apiNavigationData.map((item) => {
    return {
      name: item.name,
      href: item.href,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
};

