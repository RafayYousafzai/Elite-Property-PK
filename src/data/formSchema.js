// -------- Schema ----------
const amenitiesFormSchema = [
  {
    id: "main_features",
    title: "Main Features",
    fields: [
      {
        id: "flooring",
        label: "Flooring",
        type: "select",
        options: ["Tiles", "Marble", "Wooden", "Chip", "Cement", "Other"],
      },
      { id: "electricity_backup", label: "Electricity Backup", type: "text" },
      { id: "view", label: "View", type: "text" },
      { id: "other_main_features", label: "Other Main Features", type: "text" },
      { id: "floors", label: "Floors", type: "text" },
      { id: "built_in_year", label: "Built in Year", type: "number" },
      { id: "parking_spaces", label: "Parking Spaces", type: "number" },
      {
        id: "double_glazed_windows",
        label: "Double Glazed Windows",
        type: "boolean",
      },
      { id: "central_ac", label: "Central Air Conditioning", type: "boolean" },
      { id: "central_heating", label: "Central Heating", type: "boolean" },
      { id: "waste_disposal", label: "Waste Disposal", type: "boolean" },
      { id: "furnished", label: "Furnished", type: "boolean" },
    ],
  },
  {
    id: "rooms",
    title: "Rooms",
    fields: [
      { id: "other_rooms", label: "Other Rooms", type: "text" },
      { id: "bedrooms", label: "Bedrooms", type: "number" },
      { id: "bathrooms", label: "Bathrooms", type: "number" },
      { id: "servant_quarters", label: "Servant Quarters", type: "number" },
      { id: "kitchens", label: "Kitchens", type: "number" },
      { id: "store_rooms", label: "Store Rooms", type: "number" },
      { id: "drawing_room", label: "Drawing Room", type: "boolean" },
      { id: "dining_room", label: "Dining Room", type: "boolean" },
      { id: "study_room", label: "Study Room", type: "boolean" },
      { id: "prayer_room", label: "Prayer Room", type: "boolean" },
      { id: "powder_room", label: "Powder Room", type: "boolean" },
      { id: "gym", label: "Gym", type: "boolean" },
      { id: "steam_room", label: "Steam Room", type: "boolean" },
      { id: "lounge", label: "Lounge or Sitting Room", type: "boolean" },
      { id: "laundry_room", label: "Laundry Room", type: "boolean" },
    ],
  },
  {
    id: "business_and_comm",
    title: "Business & Communication",
    fields: [
      {
        id: "other_business_facilities",
        label: "Other Business and Communication Facilities",
        type: "text",
      },
      {
        id: "broadband_internet",
        label: "Broadband Internet Access",
        type: "boolean",
      },
      {
        id: "satellite_cable_tv",
        label: "Satellite or Cable TV Ready",
        type: "boolean",
      },
      { id: "intercom", label: "Intercom", type: "boolean" },
    ],
  },
  {
    id: "community_features",
    title: "Community Features",
    fields: [
      {
        id: "other_community_facilities",
        label: "Other Community Facilities",
        type: "text",
      },
      {
        id: "community_lawn",
        label: "Community Lawn or Garden",
        type: "boolean",
      },
      {
        id: "community_swimming_pool",
        label: "Community Swimming Pool",
        type: "boolean",
      },
      { id: "community_gym", label: "Community Gym", type: "boolean" },
      {
        id: "first_aid_medical",
        label: "First Aid or Medical Centre",
        type: "boolean",
      },
      { id: "day_care_centre", label: "Day Care Centre", type: "boolean" },
      { id: "kids_play_area", label: "Kids Play Area", type: "boolean" },
      { id: "barbeque_area", label: "Barbeque Area", type: "boolean" },
      { id: "mosque", label: "Mosque", type: "boolean" },
      { id: "community_centre", label: "Community Centre", type: "boolean" },
    ],
  },
  {
    id: "healthcare_recreation",
    title: "Healthcare & Recreation",
    fields: [
      {
        id: "other_healthcare_facilities",
        label: "Other Healthcare and Recreation Facilities",
        type: "text",
      },
      { id: "lawn_garden", label: "Lawn or Garden", type: "boolean" },
      { id: "swimming_pool", label: "Swimming Pool", type: "boolean" },
      { id: "sauna", label: "Sauna", type: "boolean" },
      { id: "jacuzzi", label: "Jacuzzi", type: "boolean" },
    ],
  },
  {
    id: "nearby_locations",
    title: "Nearby Locations & Other Facilities",
    fields: [
      { id: "nearby_schools", label: "Nearby Schools", type: "text" },
      { id: "nearby_hospitals", label: "Nearby Hospitals", type: "text" },
      {
        id: "nearby_shopping_malls",
        label: "Nearby Shopping Malls",
        type: "text",
      },
      { id: "nearby_restaurants", label: "Nearby Restaurants", type: "text" },
      {
        id: "distance_from_airport",
        label: "Distance From Airport (kms)",
        type: "number",
      },
      {
        id: "public_transport_service",
        label: "Nearby Public Transport Service",
        type: "text",
      },
      { id: "other_nearby_places", label: "Other Nearby Places", type: "text" },
    ],
  },
];

export default amenitiesFormSchema;
