// tasks-by-project.js
// Displays tasks grouped by project with optional filtering
//
// Usage:
//   await dv.view("scripts/dataview/tasks-by-project")
//   await dv.view("scripts/dataview/tasks-by-project", { selectedProject: "Name" })
//   await dv.view("scripts/dataview/tasks-by-project", { showCompleted: false })
//
// Input Parameters (optional object):
//   selectedProject - Exact match filter by project name
//   projectFilter   - Fuzzy match filter (case-insensitive contains)
//   showCompleted   - Whether to show completed tasks section (default: true)
//
// If no input provided, reads filter values from calling page's frontmatter

// Get filter parameters from input or current page frontmatter
const page = dv.current();
const config = input || {};
const selectedProject = config.selectedProject ?? page.selectedProject;
const filterText = (config.projectFilter ?? page.projectFilter ?? "").toLowerCase();
const showCompleted = config.showCompleted ?? true;

// Query all non-Complete projects
let projects = dv.pages('#project AND !"utility"')
  .where(p => p.status !== "Complete")
  .sort(p => p.priority, 'asc');

// Apply dropdown filter (exact match)
if (selectedProject) {
  projects = projects.where(p => p.file.name === selectedProject);
}

// Apply text filter (fuzzy match)
if (filterText) {
  projects = projects.where(p =>
    p.file.name.toLowerCase().includes(filterText)
  );
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
