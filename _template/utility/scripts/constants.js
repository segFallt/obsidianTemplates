// Shared constants for Obsidian vault scripts
// Load via: const CONSTANTS = await dv.io.load("utility/scripts/constants.js");

const CONSTANTS = {
  // Project status values
  PROJECT_STATUSES: ["New", "Active", "On Hold", "Complete"],

  // Default statuses to show in Tasks By Project view (excludes Complete)
  DEFAULT_TASK_VIEW_STATUSES: ["New", "Active", "On Hold"]
};

// Return for dv.io.load()
CONSTANTS;
