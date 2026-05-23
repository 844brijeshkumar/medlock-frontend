// import { Hospital, LocationData } from "../types";
import { mockHospitals } from "../utils/constants";

// --- API FUNCTIONS ---

export const fetchLocations = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json"
    );
    if (!response.ok) throw new Error("Failed to fetch location data");

    const data = await response.json();
    const transformedData = {};

    if (data && data.states) {
      data.states.forEach((item) => {
        transformedData[item.state] = item.districts;
      });
    }
    return transformedData;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return {};
  }
};

export const fetchHospitals = async (state, district, searchQuery) => {
  // Simulate API network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Filter Logic using local Mock Data
  const filteredHospitals = mockHospitals.filter((h) => {
    const queryLower = searchQuery.toLowerCase();

    const matchesSearch =
      h.name.toLowerCase().includes(queryLower) ||
      h.location.toLowerCase().includes(queryLower) ||
      h.specialties.some((s) => s.toLowerCase().includes(queryLower));

    // Note: We use flexible matching for state/district because the dropdowns
    // come from one API (Locations) and the mock data is hardcoded.
    // In a real app, IDs would be used.
    const matchesState = state
      ? h.state.toLowerCase() === state.toLowerCase()
      : true;
    const matchesDistrict = district
      ? h.district.toLowerCase() === district.toLowerCase()
      : true;

    return matchesSearch && matchesState && matchesDistrict;
  });

  return filteredHospitals;
};
