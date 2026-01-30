// Task Dashboard - Advanced task view with filtering and grouping
// Used by: views/Task Dashboard.md
// Call via: await dv.view("scripts/dataview/tasks-dashboard", { ...params })

// Get config from input
const config = input || {};
const viewMode = config.viewMode || "context";
const contextFilter = config.contextFilter || [];
const dueDateFilter = config.dueDateFilter || "All";
const priorityFilter = config.priorityFilter || [];
const showCompleted = config.showCompleted ?? false;
const searchFilter = (config.searchFilter || "").toLowerCase();
const sortBy = config.sortBy || "none";

// Context-specific filters (only apply in context mode)
const projectStatusFilter = config.projectStatusFilter || [];
const inboxStatusFilter = config.inboxStatusFilter || "All";
const meetingDateFilter = config.meetingDateFilter || "All";
const clientFilter = config.clientFilter || [];
const engagementFilter = config.engagementFilter || [];
const includeUnassignedClients = config.includeUnassignedClients ?? false;
const includeUnassignedEngagements = config.includeUnassignedEngagements ?? false;

// Priority emoji mapping
const PRIORITY_EMOJI = {
  "⏫": 1,  // Highest
  "🔼": 2,  // High
  "🔽": 4,  // Low
  "⏬": 5   // Lowest
};

const PRIORITY_DISPLAY = {
  1: "⏫ Urgent",
  2: "🔼 High",
  3: "➖ Medium",
  4: "🔽 Low",
  5: "⏬ Someday"
};

// Context detection based on file path
const getTaskContext = (task) => {
  const path = task.path;
  if (path.startsWith("projects/")) return "Project";
  if (path.startsWith("people/")) return "Person";
  if (path.startsWith("meetings/")) return "Meeting";
  if (path.startsWith("inbox/")) return "Inbox";
  if (path.startsWith("daily notes/")) return "Daily Notes";
  return "Other";
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

// Helper to get the parent project for a page (if it's a project note)
const getParentProject = (pagePath) => {
  const page = dv.page(pagePath);
  if (!page || !page.relatedProject) return null;
  // relatedProject is a link to the parent project
  const projectLink = page.relatedProject;
  if (projectLink?.path) return projectLink.path;
  // Handle string format
  const str = String(projectLink);
  const match = str.match(/\[\[([^\]]+)\]\]/);
  return match ? `projects/${match[1]}.md` : null;
};

// Helper to extract client from engagement
const getClientFromEngagement = (engagementLink) => {
  if (!engagementLink) return null;
  // Handle Link objects and string formats
  const engagementName = normalizeToComparableName(engagementLink);
  if (!engagementName) return null;
  const engagementPage = dv.page(`engagements/${engagementName}`);
  return engagementPage?.client || null;
};

// Helper to check if task matches client filter
const matchesClientFilter = (task, clientFilter, includeUnassigned) => {
  // If no filter and not including unassigned, show all
  if ((!clientFilter || clientFilter.length === 0) && !includeUnassigned) return true;

  const page = dv.page(task.path);
  if (!page) return false;

  // Get client - either directly, through engagement, or from parent project
  let taskClient = page.client;
  if (!taskClient && page.engagement) {
    taskClient = getClientFromEngagement(page.engagement);
  }

  // If still no client, check parent project (for project notes)
  if (!taskClient && page.relatedProject) {
    const parentProjectPath = getParentProject(task.path);
    if (parentProjectPath) {
      const parentProject = dv.page(parentProjectPath);
      if (parentProject) {
        taskClient = parentProject.client;
        if (!taskClient && parentProject.engagement) {
          taskClient = getClientFromEngagement(parentProject.engagement);
        }
      }
    }
  }

  // Normalize client value for comparison
  const normalizedClient = normalizeToComparableName(taskClient);

  // Check if should include unassigned
  if (includeUnassigned && !normalizedClient) return true;

  // If no specific clients selected, only show unassigned if toggle is on
  if (!clientFilter || clientFilter.length === 0) {
    return includeUnassigned ? !normalizedClient : false;
  }

  // Check against specific clients
  for (const filterClient of clientFilter) {
    const normalizedFilter = normalizeToComparableName(filterClient);
    if (normalizedClient === normalizedFilter) return true;
  }

  return false;
};

// Helper to check if task matches engagement filter
const matchesEngagementFilter = (task, engagementFilter, includeUnassigned) => {
  // If no filter and not including unassigned, show all
  if ((!engagementFilter || engagementFilter.length === 0) && !includeUnassigned) return true;

  const page = dv.page(task.path);
  if (!page) return false;

  let taskEngagement = page.engagement;

  // If no engagement, check parent project (for project notes)
  if (!taskEngagement && page.relatedProject) {
    const parentProjectPath = getParentProject(task.path);
    if (parentProjectPath) {
      const parentProject = dv.page(parentProjectPath);
      if (parentProject) {
        taskEngagement = parentProject.engagement;
      }
    }
  }

  const normalizedEngagement = normalizeToComparableName(taskEngagement);

  // Check if should include unassigned
  if (includeUnassigned && !normalizedEngagement) return true;

  // If no specific engagements selected, only show unassigned if toggle is on
  if (!engagementFilter || engagementFilter.length === 0) {
    return includeUnassigned ? !normalizedEngagement : false;
  }

  // Check against specific engagements
  for (const filterEngagement of engagementFilter) {
    const normalizedFilter = normalizeToComparableName(filterEngagement);
    if (normalizedEngagement === normalizedFilter) return true;
  }

  return false;
};

// Get task priority from text (emoji-based)
const getTaskPriority = (task) => {
  const text = task.text || "";
  for (const [emoji, priority] of Object.entries(PRIORITY_EMOJI)) {
    if (text.includes(emoji)) return priority;
  }
  return 3; // Default to medium
};

// Get sort key for a group of tasks (used for sorting contexts and files)
const getGroupSortKey = (tasks, sortBy) => {
  if (sortBy === "none") return 0;
  const isDesc = sortBy.endsWith("-desc");

  if (sortBy.startsWith("dueDate")) {
    const tasksWithDue = tasks.filter(t => t.due);
    if (tasksWithDue.length === 0) return isDesc ? "0000-00-00" : "9999-99-99";
    const dates = tasksWithDue.map(t => t.due?.toString() || (isDesc ? "0000-00-00" : "9999-99-99"));
    return isDesc ? dates.sort().reverse()[0] : dates.sort()[0];
  }

  if (sortBy.startsWith("priority")) {
    const priorities = tasks.map(t => getTaskPriority(t));
    return isDesc ? Math.max(...priorities) : Math.min(...priorities);
  }
  return 0;
};

// Sort tasks array by the specified criteria
const sortTasks = (tasks, sortBy) => {
  if (sortBy === "none") return tasks;
  const isDesc = sortBy.endsWith("-desc");

  if (sortBy.startsWith("dueDate")) {
    return tasks.sort((a, b) => {
      const aDate = a.due?.toString() || (isDesc ? "0000-00-00" : "9999-99-99");
      const bDate = b.due?.toString() || (isDesc ? "0000-00-00" : "9999-99-99");
      return isDesc ? bDate.localeCompare(aDate) : aDate.localeCompare(bDate);
    });
  }

  if (sortBy.startsWith("priority")) {
    return tasks.sort((a, b) => {
      const aPri = getTaskPriority(a);
      const bPri = getTaskPriority(b);
      return isDesc ? bPri - aPri : aPri - bPri;
    });
  }
  return tasks;
};

// Get today's date for comparison
const today = dv.date("today");
const tomorrow = dv.date("today").plus({ days: 1 });
const weekEnd = dv.date("today").plus({ days: 7 });

// Query all tasks from non-utility folders
let allTasks = dv.pages()
  .where(p => !p.file.path.startsWith("utility/"))
  .file.tasks;

// Filter by completion status
if (!showCompleted) {
  allTasks = allTasks.where(t => !t.completed);
}

// Filter by context
if (contextFilter && contextFilter.length > 0) {
  allTasks = allTasks.where(t => contextFilter.includes(getTaskContext(t)));
}

// Filter by due date
if (dueDateFilter && dueDateFilter !== "All") {
  allTasks = allTasks.where(t => {
    const due = t.due;
    switch (dueDateFilter) {
      case "Today":
        return due && dv.date(due).equals(today);
      case "This Week":
        return due && dv.date(due) >= today && dv.date(due) <= weekEnd;
      case "Overdue":
        return due && dv.date(due) < today;
      case "No Date":
        return !due;
      default:
        return true;
    }
  });
}

// Filter by priority
if (priorityFilter && priorityFilter.length > 0) {
  const priorityNums = priorityFilter.map(p => parseInt(p));
  allTasks = allTasks.where(t => priorityNums.includes(getTaskPriority(t)));
}

// Filter by search text
if (searchFilter) {
  allTasks = allTasks.where(t => t.text.toLowerCase().includes(searchFilter));
}

// Filter by client
if (clientFilter.length > 0 || includeUnassignedClients) {
  allTasks = allTasks.where(t => matchesClientFilter(t, clientFilter, includeUnassignedClients));
}

// Filter by engagement
if (engagementFilter.length > 0 || includeUnassignedEngagements) {
  allTasks = allTasks.where(t => matchesEngagementFilter(t, engagementFilter, includeUnassignedEngagements));
}

// Context-specific filters (only apply in context mode)
if (viewMode === "context") {
  // Filter Project tasks by project status
  if (projectStatusFilter && projectStatusFilter.length > 0) {
    allTasks = allTasks.where(t => {
      if (getTaskContext(t) !== "Project") return true; // Don't filter non-project tasks
      const page = dv.page(t.path);
      return page && projectStatusFilter.includes(page.status);
    });
  }

  // Filter Inbox tasks by inbox status
  if (inboxStatusFilter && inboxStatusFilter !== "All") {
    allTasks = allTasks.where(t => {
      if (getTaskContext(t) !== "Inbox") return true;
      const page = dv.page(t.path);
      if (!page) return true;
      const isActive = page.status !== "Complete";
      return inboxStatusFilter === "Active" ? isActive : !isActive;
    });
  }

  // Filter Meeting tasks by meeting date
  if (meetingDateFilter && meetingDateFilter !== "All") {
    allTasks = allTasks.where(t => {
      if (getTaskContext(t) !== "Meeting") return true;
      const page = dv.page(t.path);
      if (!page || !page.date) return meetingDateFilter === "All";
      const meetingDate = dv.date(page.date);
      switch (meetingDateFilter) {
        case "Today":
          return meetingDate.equals(today);
        case "This Week":
          return meetingDate >= today && meetingDate <= weekEnd;
        case "Past":
          return meetingDate < today;
        default:
          return true;
      }
    });
  }
}

// Check if we have any tasks
if (allTasks.length === 0) {
  dv.paragraph("*No tasks match the current filters.*");
} else {
  // Render based on view mode
  switch (viewMode) {
    case "context":
      renderByContext(allTasks);
      break;
    case "date":
      renderByDate(allTasks);
      break;
    case "priority":
      renderByPriority(allTasks);
      break;
    case "tag":
      renderByTag(allTasks);
      break;
    default:
      renderByContext(allTasks);
  }
}

// Render functions

function renderByContext(tasks) {
  const contexts = ["Project", "Person", "Meeting", "Inbox", "Daily Notes", "Other"];

  // Build context groups with sort keys
  const contextGroups = [];
  for (const context of contexts) {
    const contextTasks = tasks.where(t => getTaskContext(t) === context);
    if (contextTasks.length === 0) continue;

    // Group by file within context (with parent project handling)
    const byFile = {};
    const projectNoteMapping = {}; // Maps project path -> { note path -> [tasks] }

    for (const task of contextTasks) {
      const filePath = task.link.path;

      // For Project context, check if this is a project note
      if (context === "Project") {
        const parentProject = getParentProject(filePath);
        if (parentProject) {
          // Group under parent project
          if (!byFile[parentProject]) {
            byFile[parentProject] = [];
            projectNoteMapping[parentProject] = {};
          }
          // Track tasks by their source note
          if (!projectNoteMapping[parentProject][filePath]) {
            projectNoteMapping[parentProject][filePath] = [];
          }
          projectNoteMapping[parentProject][filePath].push(task);
          byFile[parentProject].push(task);
          continue;
        }
      }

      // Default: group by file
      if (!byFile[filePath]) byFile[filePath] = [];
      byFile[filePath].push(task);
    }

    // Calculate sort key for the entire context (based on "best" task)
    const contextSortKey = getGroupSortKey([...contextTasks], sortBy);

    contextGroups.push({
      context,
      byFile,
      projectNoteMapping,
      sortKey: contextSortKey
    });
  }

  // Sort context groups if sorting is enabled
  if (sortBy !== "none") {
    const isDesc = sortBy.endsWith("-desc");
    contextGroups.sort((a, b) => {
      if (typeof a.sortKey === "string") {
        return isDesc ? b.sortKey.localeCompare(a.sortKey) : a.sortKey.localeCompare(b.sortKey);
      }
      return isDesc ? b.sortKey - a.sortKey : a.sortKey - b.sortKey;
    });
  }

  // Render each context group
  for (const group of contextGroups) {
    dv.header(2, group.context);

    // Build file groups with sort keys
    const fileGroups = Object.entries(group.byFile).map(([filePath, fileTasks]) => ({
      filePath,
      fileTasks,
      sortKey: getGroupSortKey(fileTasks, sortBy)
    }));

    // Sort file groups within context
    if (sortBy !== "none") {
      const isDesc = sortBy.endsWith("-desc");
      fileGroups.sort((a, b) => {
        if (typeof a.sortKey === "string") {
          return isDesc ? b.sortKey.localeCompare(a.sortKey) : a.sortKey.localeCompare(b.sortKey);
        }
        return isDesc ? b.sortKey - a.sortKey : a.sortKey - b.sortKey;
      });
    }

    // Render each file's tasks
    for (const fileGroup of fileGroups) {
      const page = dv.page(fileGroup.filePath);
      const displayName = page ? page.file.name : fileGroup.filePath;
      dv.header(3, dv.fileLink(fileGroup.filePath, false, displayName));

      // For Project context with notes mapping
      if (group.context === "Project" && group.projectNoteMapping[fileGroup.filePath]) {
        // First render direct project tasks (tasks where source === project file)
        const directTasks = fileGroup.fileTasks.filter(t => t.link.path === fileGroup.filePath);
        if (directTasks.length > 0) {
          const sortedDirect = sortTasks([...directTasks], sortBy);
          dv.taskList(sortedDirect, false);
        }

        // Then render each project note's tasks as sub-section
        const noteTasks = group.projectNoteMapping[fileGroup.filePath];
        for (const [notePath, tasks] of Object.entries(noteTasks)) {
          const notePage = dv.page(notePath);
          const noteDisplayName = notePage ? notePage.file.name : notePath;
          dv.header(4, dv.fileLink(notePath, false, noteDisplayName));
          const sortedNoteTasks = sortTasks([...tasks], sortBy);
          dv.taskList(sortedNoteTasks, false);
        }
      } else {
        // Standard rendering for non-project or projects without notes
        const sortedTasks = sortTasks([...fileGroup.fileTasks], sortBy);
        dv.taskList(sortedTasks, false);
      }
    }
  }
}

function renderByDate(tasks) {
  // Overdue
  const overdue = tasks.where(t => t.due && dv.date(t.due) < today);
  if (overdue.length > 0) {
    dv.header(2, "⚠️ Overdue");
    dv.taskList(overdue.sort(t => t.due), false);
  }

  // Today
  const todayTasks = tasks.where(t => t.due && dv.date(t.due).equals(today));
  if (todayTasks.length > 0) {
    dv.header(2, "📅 Today");
    dv.taskList(todayTasks.sort(t => getTaskPriority(t)), false);
  }

  // Tomorrow
  const tomorrowTasks = tasks.where(t => t.due && dv.date(t.due).equals(tomorrow));
  if (tomorrowTasks.length > 0) {
    dv.header(2, "📆 Tomorrow");
    dv.taskList(tomorrowTasks.sort(t => getTaskPriority(t)), false);
  }

  // This Week (excluding today and tomorrow)
  const thisWeek = tasks.where(t => {
    if (!t.due) return false;
    const due = dv.date(t.due);
    return due > tomorrow && due <= weekEnd;
  });
  if (thisWeek.length > 0) {
    dv.header(2, "📋 This Week");
    dv.taskList(thisWeek.sort(t => t.due), false);
  }

  // Upcoming (after this week)
  const upcoming = tasks.where(t => t.due && dv.date(t.due) > weekEnd);
  if (upcoming.length > 0) {
    dv.header(2, "🔮 Upcoming");
    dv.taskList(upcoming.sort(t => t.due), false);
  }

  // No Due Date
  const noDue = tasks.where(t => !t.due);
  if (noDue.length > 0) {
    dv.header(2, "📝 No Due Date");
    dv.taskList(noDue.sort(t => getTaskPriority(t)), false);
  }
}

function renderByPriority(tasks) {
  for (let priority = 1; priority <= 5; priority++) {
    const priorityTasks = tasks.where(t => getTaskPriority(t) === priority);
    if (priorityTasks.length === 0) continue;

    dv.header(2, PRIORITY_DISPLAY[priority]);
    dv.taskList(priorityTasks.sort(t => t.due || "9999-99-99"), false);
  }

  // Unset priority (if any - should map to medium but just in case)
  const unsetPriority = tasks.where(t => {
    const p = getTaskPriority(t);
    return p < 1 || p > 5;
  });
  if (unsetPriority.length > 0) {
    dv.header(2, "❓ Unset Priority");
    dv.taskList(unsetPriority, false);
  }
}

function renderByTag(tasks) {
  // Collect all tags from tasks
  const tagMap = {};
  const untagged = [];

  for (const task of tasks) {
    const taskTags = task.tags || [];
    if (taskTags.length === 0) {
      untagged.push(task);
    } else {
      for (const tag of taskTags) {
        if (!tagMap[tag]) tagMap[tag] = [];
        tagMap[tag].push(task);
      }
    }
  }

  // Sort tags alphabetically
  const sortedTags = Object.keys(tagMap).sort();

  // Render each tag's tasks
  for (const tag of sortedTags) {
    dv.header(2, tag);
    dv.taskList(tagMap[tag], false);
  }

  // Untagged tasks
  if (untagged.length > 0) {
    dv.header(2, "📌 Untagged");
    dv.taskList(untagged, false);
  }
}
