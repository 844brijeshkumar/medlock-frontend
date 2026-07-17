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

// 3. NEW: THE URL EXTRACTOR (THE BOUNCER'S GUEST LIST)
export const extractValidRoutes = (navigationArray) => {
  let validRoutes = [];
  
  navigationArray.forEach(item => {
    // If the main tab has an href, add it
    if (item.href) validRoutes.push(item.href.toLowerCase());
    
    // If it has subItems, extract those hrefs too
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach(sub => {
        if (sub.href) validRoutes.push(sub.href.toLowerCase());
      });
    }
  });
  
  return validRoutes;
};