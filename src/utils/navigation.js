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
  return apiNavigationData
    .map((pluginTab) => {
      return {
        name: pluginTab.name,
        // If there are subItems, sort them by name. Otherwise, return an empty array.
        subItems: pluginTab.subItems 
          ? [...pluginTab.subItems].sort((a, b) => a.name.localeCompare(b.name))
          : [],
      };
    })
    // Sort the main Plugin tabs alphabetically
    .sort((a, b) => a.name.localeCompare(b.name));
};