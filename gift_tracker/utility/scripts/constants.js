// Shared constants for Gift Tracker vault
// Load via: const CONSTANTS = await dv.io.load("utility/scripts/constants.js");

const CONSTANTS = {
  // Gift occasions (no apostrophes - Meta Bind doesn't parse them well)
  OCCASIONS: [
    "Birthday",
    "Christmas",
    "Hanukkah",
    "Anniversary",
    "Valentines Day",
    "Mothers Day",
    "Fathers Day",
    "Graduation",
    "Wedding",
    "Baby Shower",
    "Housewarming",
    "Thank You",
    "Just Because",
    "Other"
  ],

  // Gift idea statuses
  IDEA_STATUSES: ["Idea", "Considering", "Planned"],

  // Default statuses to show in idea views
  DEFAULT_IDEA_STATUSES: ["Idea", "Considering", "Planned"]
};

// Return for dv.io.load()
CONSTANTS;
