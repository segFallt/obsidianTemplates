// tasks-by-project.js
// Displays tasks grouped by project with optional filtering
//
// Usage:
//   await dv.view("scripts/dataview/tasks-by-project", {
//     selectedProjects: page.selectedProjects,
//     projectFilter: page.projectFilter,
//     selectedStatuses: page.selectedStatuses
//   })
//
// Input Parameters (optional object):
//   selectedProjects - Array of project names to filter (multi-select)
//   projectFilter    - Fuzzy match filter (case-insensitive contains)
//   selectedStatuses - Array of statuses to include (default: New, Active, On Hold)
//   showCompleted    - Whether to show completed tasks section (default: true)
//   clientFilter     - Array of client names to filter projects by (multi-select)
//   engagementFilter - Array of engagement names to filter projects by (multi-select)
//
// Note: Frontmatter values must be passed explicitly from the calling page
//       since dv.current() context changes in external scripts

// Load shared constants
const CONSTANTS = await dv.io.load("utility/scripts/constants.js");

// Get filter parameters from input
const config = input || {};
const selectedProjects = config.selectedProjects || [];
const filterText = (config.projectFilter || "").toLowerCase();
const showCompleted = config.showCompleted ?? true;
const selectedStatuses = config.selectedStatuses || CONSTANTS.DEFAULT_TASK_VIEW_STATUSES;
const clientFilter = config.clientFilter || [];
const engagementFilter = config.engagementFilter || [];

// Normalize selected projects to file names (handles links, paths, or plain names)
const normalizeToName = (item) => {
  if (!item) return null;
  // If it's a Link object, get the path
  if (item.path) return item.path.split('/').pop().replace(/\.md$/, '');
  // If it's a string like "[[Name]]" or "Name.md" or just "Name"
  const str = String(item);
  return str.replace(/^\[\[/, '').replace(/\]\]$/, '').split('/').pop().replace(/\.md$/, '');
};
const selectedNames = selectedProjects.map(normalizeToName).filter(Boolean);

// Helper to extract client from engagement
const getClientFromEngagement = (engagementLink) => {
  if (!engagementLink) return null;
  // Handle Link objects and string formats
  const engagementName = normalizeToComparableName(engagementLink);
  if (!engagementName) return null;
  const engagementPage = dv.page(`engagements/${engagementName}`);
  return engagementPage?.client || null;
};

// Helper to normalize any link/name format to a comparable string
const normalizeToComparableName = (item) => {
  if (!item) return null;
  // If it's a Link object, get the path
  if (item.path) return item.path.split('/').pop().replace(/\.md$/, '');
  // If it's a string, remove [[]] and .md
  const str = String(item);
  return str.replace(/^\[\[/, '').replace(/\]\]$/, '').split('/').pop().replace(/\.md$/, '');
};

// Helper to check if project matches client filter
const matchesClientFilter = (project, clientFilter) => {
  if (!clientFilter || clientFilter.length === 0) return true;

  // Get client - either directly or through engagement
  let projectClient = project.client;
  if (!projectClient && project.engagement) {
    projectClient = getClientFromEngagement(project.engagement);
  }

  // Normalize client value for comparison
  const normalizedClient = normalizeToComparableName(projectClient);

  // Check if "(Unassigned)" is in filter
  if (clientFilter.includes("(Unassigned)")) {
    if (!normalizedClient) return true;
  }

  // Check against specific clients
  for (const filterClient of clientFilter) {
    if (filterClient === "(Unassigned)") continue;
    const normalizedFilter = normalizeToComparableName(filterClient);
    if (normalizedClient === normalizedFilter) return true;
  }

  return false;
};

// Helper to check if project matches engagement filter
const matchesEngagementFilter = (project, engagementFilter) => {
  if (!engagementFilter || engagementFilter.length === 0) return true;

  const projectEngagement = project.engagement;
  const normalizedEngagement = normalizeToComparableName(projectEngagement);

  // Check if "(Unassigned)" is in filter
  if (engagementFilter.includes("(Unassigned)")) {
    if (!normalizedEngagement) return true;
  }

  // Check against specific engagements
  for (const filterEngagement of engagementFilter) {
    if (filterEngagement === "(Unassigned)") continue;
    const normalizedFilter = normalizeToComparableName(filterEngagement);
    if (normalizedEngagement === normalizedFilter) return true;
  }

  return false;
};

// Query projects filtered by status
let projects = dv.pages('#project AND !"utility"')
  .where(p => selectedStatuses.includes(p.status))
  .sort(p => p.priority, 'asc');

// Apply multi-select filter (match any selected project)
if (selectedNames && selectedNames.length > 0) {
  projects = projects.where(p => selectedNames.includes(p.file.name));
}

// Apply text filter (fuzzy match)
if (filterText) {
  projects = projects.where(p =>
    p.file.name.toLowerCase().includes(filterText)
  );
}

// Apply client filter
if (clientFilter && clientFilter.length > 0) {
  projects = projects.where(p => matchesClientFilter(p, clientFilter));
}

// Apply engagement filter
if (engagementFilter && engagementFilter.length > 0) {
  projects = projects.where(p => matchesEngagementFilter(p, engagementFilter));
}

for (const project of projects) {
  // Get tasks from project page
  const projectTasksIncomplete = project.file.tasks.where(t => !t.completed);
  const projectTasksComplete = project.file.tasks.where(t => t.completed);

  // Get project notes for this project
  const projectNotes = dv.pages()
    .where(p => p.relatedProject &&
           dv.func.contains(p.relatedProject, project.file.link));

  // Collect all tasks from project notes
  let noteTasksIncomplete = [];
  let noteTasksComplete = [];
  for (const note of projectNotes) {
    noteTasksIncomplete.push(...note.file.tasks.where(t => !t.completed));
    noteTasksComplete.push(...note.file.tasks.where(t => t.completed));
  }

  const hasIncompleteTasks = projectTasksIncomplete.length > 0 || noteTasksIncomplete.length > 0;
  const hasCompleteTasks = projectTasksComplete.length > 0 || noteTasksComplete.length > 0;

  // Only show project if it has any tasks
  if (hasIncompleteTasks || hasCompleteTasks) {
    dv.header(2, project.file.link);

    // Show direct project tasks (incomplete)
    if (projectTasksIncomplete.length > 0) {
      dv.taskList(projectTasksIncomplete, false);
    }

    // Show tasks from each project note (incomplete)
    for (const note of projectNotes) {
      const tasks = note.file.tasks.where(t => !t.completed);
      if (tasks.length > 0) {
        dv.header(3, note.file.link);
        dv.taskList(tasks, false);
      }
    }

    // Show completed tasks in collapsed section
    if (showCompleted && hasCompleteTasks) {
      const allComplete = [...projectTasksComplete, ...noteTasksComplete];
      dv.header(4, "Completed (" + allComplete.length + ")");
      dv.taskList(allComplete, false);
    }
  }
}
