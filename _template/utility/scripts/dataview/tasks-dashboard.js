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

// Get task priority from text (emoji-based)
const getTaskPriority = (task) => {
  const text = task.text || "";
  for (const [emoji, priority] of Object.entries(PRIORITY_EMOJI)) {
    if (text.includes(emoji)) return priority;
  }
  return 3; // Default to medium
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

  for (const context of contexts) {
    const contextTasks = tasks.where(t => getTaskContext(t) === context);
    if (contextTasks.length === 0) continue;

    dv.header(2, context);

    // Group by file within context
    const byFile = {};
    for (const task of contextTasks) {
      const fileName = task.link.path;
      if (!byFile[fileName]) byFile[fileName] = [];
      byFile[fileName].push(task);
    }

    // Render each file's tasks
    for (const [filePath, fileTasks] of Object.entries(byFile)) {
      const page = dv.page(filePath);
      const displayName = page ? page.file.name : filePath;
      dv.header(3, dv.fileLink(filePath, false, displayName));
      dv.taskList(fileTasks, false);
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
