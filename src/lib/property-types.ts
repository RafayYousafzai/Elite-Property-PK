// Property type taxonomy shared by the admin form, search filters and queries.
// Kept dependency-free so public pages don't pull in the admin form bundle.
export const propertyTypes = {
  Home: [
    "House",
    "flat/appartment",
    "Farm House",
    "Room",
    "Upper Portion",
    "Lower Portion",
    "Penthouse",
  ],
  Plots: [
    "Residential Plot",
    "Commercial Plot",
    "Agricultural Land",
    "Industrial Land",
    "Plot File",
    "Plot Form",
  ],
  Commercial: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"],
};
