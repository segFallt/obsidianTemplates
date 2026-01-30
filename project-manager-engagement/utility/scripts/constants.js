// Shared constants for Obsidian vault scripts
// Load via: const CONSTANTS = await dv.io.load("utility/scripts/constants.js");

const CONSTANTS = {
  // Client status values
  CLIENT_STATUSES: ["Active", "Inactive"],

  // Engagement status values
  ENGAGEMENT_STATUSES: ["Active", "Inactive"],

  // Project status values
  PROJECT_STATUSES: ["New", "Active", "On Hold", "Complete"],

  // Default statuses to show in Tasks By Project view (excludes Complete)
  DEFAULT_TASK_VIEW_STATUSES: ["New", "Active", "On Hold"],

  // Task context types (based on folder location)
  TASK_CONTEXTS: ["Project", "Person", "Meeting", "Inbox", "Daily Notes"],

  // Task priority levels
  TASK_PRIORITIES: [1, 2, 3, 4, 5],

  // Priority display labels
  PRIORITY_LABELS: {
    1: "Urgent",
    2: "High",
    3: "Medium",
    4: "Low",
    5: "Someday"
  },

  // Priority emoji mapping (Obsidian Tasks format)
  PRIORITY_EMOJI: {
    "⏫": 1,  // Highest
    "🔼": 2,  // High
    "🔽": 4,  // Low
    "⏬": 5   // Lowest
    // No emoji = 3 (Medium)
  }
};

// Return for dv.io.load()
CONSTANTS;
