# Scripts & Automation

Reference for JavaScript automation scripts used throughout the vault.

## Overview

Scripts are organized by plugin/purpose:
- `utility/scripts/quickadd/` - QuickAdd action triggers and macros
- `utility/scripts/dataview/` - Dataview render scripts
- `utility/scripts/meta-bind/` - Meta Bind button utilities

## QuickAdd Scripts

### Trigger Scripts

All trigger scripts follow the same pattern to execute QuickAdd choices from buttons.

#### Pattern: QuickAdd Trigger

```javascript
const triggerQuickAddAction = async () => {
  const actionName = "Action Name";  // QuickAdd choice name

  // Access QuickAdd plugin
  const quickAddPlugin = app.plugins.getPlugin("quickadd");

  if (!quickAddPlugin) {
    new Notice('QuickAdd plugin not found.');
    return;
  }

  const quickAddApi = quickAddPlugin.api;
  if (!quickAddApi) {
    new Notice('QuickAdd API not found.');
    return;
  }

  await quickAddApi.executeChoice(actionName);
};

triggerQuickAddAction();
```

#### Available Trigger Scripts

| Script | Action Name | Purpose |
|--------|-------------|---------|
| `trigger_quickadd_create_project.js` | "Project - New" | Create new project |
| `trigger_quickadd_create_person.js` | "Person - New" | Create new person |
| `trigger_quickadd_create_inbox_note.js` | "Inbox - New" | Create inbox note |
| `trigger_quickadd_create_project_note.js` | "Create Project Note" | Create linked project note |
| `trigger_quickadd_create_meeting_single.js` | "Meeting - Single" | Create single meeting |
| `trigger_quickadd_create_meeting_recurring.js` | "Meeting - Recurring" | Create recurring meeting |
| `trigger_quickadd_convert_inbox.js` | "Convert Inbox to Project" | Convert inbox item to project |

---

### create-project-note.js

**Purpose**: Create a sub-note linked to the current project

**Location**: `utility/scripts/quickadd/create-project-note.js`

**Triggered By**: QuickAdd macro "Create Project Note"

**Flow**:
1. Get active file (must be a project)
2. Read `notesDirectory` from frontmatter
3. Prompt user for note name
4. Create directory if needed
5. Create note from `Project Note.md` template
6. Update frontmatter with `relatedProject` link
7. Open new note in new tab

**Code Walkthrough**:

```javascript
module.exports = async (params) => {
  // Get the active file (the project we're adding a note to)
  const activeFile = app.workspace.getActiveFile();

  if (!activeFile) {
    new Notice("No active file found.");
    return;
  }

  // Read frontmatter to get the notes directory
  const metadata = app.metadataCache.getFileCache(activeFile);

  if (!metadata?.frontmatter?.notesDirectory) {
    new Notice("The current file does not have a notesDirectory property.");
    return;
  }

  const notesDirectory = metadata.frontmatter.notesDirectory;

  // Prompt for note name
  const newNoteName = await params.quickAddApi.inputPrompt(
    "Enter the name of the new project note:"
  );

  if (!newNoteName) {
    new Notice("No note name provided.");
    return;
  }

  // Ensure directory exists
  const notesDirPath = app.vault.adapter.getFullPath(notesDirectory);
  if (!fs.existsSync(notesDirPath)) {
    fs.mkdirSync(notesDirPath, { recursive: true });
  }

  // Generate unique path (add timestamp if exists)
  let projectNotePath = `${notesDirectory}/${newNoteName}.md`;
  if (await app.vault.adapter.exists(projectNotePath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    projectNotePath = `${notesDirectory}/${newNoteName}-${timestamp}.md`;
  }

  // Create from template
  const templateFile = app.vault.getAbstractFileByPath(
    "utility/templates/Project Note.md"
  );
  const templateContent = await app.vault.read(templateFile);
  await app.vault.create(projectNotePath, templateContent);

  // Update frontmatter with project link
  const newFile = app.vault.getAbstractFileByPath(projectNotePath);
  await app.fileManager.processFrontMatter(newFile, (fm) => {
    fm.relatedProject = `[[${activeFile.basename}]]`;
  });

  // Open in new tab
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newFile);
};
```

**Dependencies**:
- Project must have `notesDirectory` in frontmatter
- Template `utility/templates/Project Note.md` must exist
- QuickAdd plugin with macro configured

---

### convert-inbox-to-project.js

**Purpose**: Convert an inbox item to a full project with bidirectional linking

**Location**: `utility/scripts/quickadd/convert-inbox-to-project.js`

**Triggered By**: QuickAdd macro "Convert Inbox to Project"

**Flow**:
1. Validate active file is in `inbox/` folder
2. Prompt for project name (defaults to inbox item name)
3. Generate `notesDirectory` as lowercase snake_case
4. Create project from `New Project.md` template
5. Update project frontmatter with `notesDirectory` and `convertedFrom` link
6. Update inbox item: set `status: Inactive` and `convertedTo` link
7. Open new project in tab

**Key Code**:
```javascript
// Generate notesDirectory (lowercase snake_case)
const notesDir = 'projects/notes/' + projectName
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')
  .replace(/\s+/g, '_');

// Update project frontmatter
await app.fileManager.processFrontMatter(newProject, (fm) => {
  fm.notesDirectory = notesDir;
  fm.convertedFrom = `[[${activeFile.basename}]]`;
});

// Update inbox item
await app.fileManager.processFrontMatter(activeFile, (fm) => {
  fm.status = 'Inactive';
  fm.convertedTo = `[[${projectName}]]`;
});
```

**Dependencies**:
- Active file must be in `inbox/` folder
- Template `utility/templates/New Project.md` must exist
- QuickAdd plugin with macro configured

---

### create-project-with-notes-dir.js

**Purpose**: Create a new project with auto-generated notesDirectory

**Location**: `utility/scripts/quickadd/create-project-with-notes-dir.js`

**Triggered By**: QuickAdd macro "Project - New"

**Flow**:
1. Prompt for project name
2. Generate `notesDirectory` as lowercase snake_case of project name
3. Load and process `New Project.md` template
4. Handle filename conflicts (add numeric suffix)
5. Create project file
6. Update frontmatter with `notesDirectory`
7. Open new project in tab

**notesDirectory Generation**:
```javascript
// "My New Project" → "projects/notes/my_new_project"
const notesDir = 'projects/notes/' + projectName
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, '')  // Remove special chars
  .replace(/\s+/g, '_');         // Spaces to underscores
```

**Dependencies**:
- Template `utility/templates/New Project.md` must exist
- QuickAdd plugin with macro configured

---

## Dataview Scripts

Dataview scripts are called using `dv.view()` and render tables/content.

### related-project-note-table.js

**Purpose**: Display notes related to the current project

**Location**: `utility/scripts/dataview/related-project-note-table.js`

**Used In**: `New Project.md` template

**Parameters**:
- `input` (number): Header level for section titles (optional)

**Code**:
```javascript
if (input) {
  const name = dv.current().file.name.replace(/^@/, '')
  dv.header(input, 'Related Notes')
}

let currentFileLink = dv.current().file.link;

// Table 1: Notes with relatedProject pointing to this file
dv.table(
  ["Note", "Modified"],
  dv.pages()
    .where(b => dv.func.contains(b.relatedProject, currentFileLink))
    .sort(b => b.file.mtime, 'desc')
    .map(b => [b.file.link, b.file.mtime])
)

dv.paragraph("---");

if (input) {
  const name = dv.current().file.name.replace(/^@/, '')
  dv.header(input, 'Notes referencing ' + name)
}

// Table 2: Notes that link to this file but aren't in relatedProject
dv.table(
  ["Note", "Location"],
  dv.pages("[[" + dv.current().file.name + "]]")
    .where(b => !dv.func.contains(b.relatedProject, dv.current().file.link))
    .sort(b => b.file.mtime, 'desc')
    .map(b => [b.file.link, b.file.folder.replace(/\//g, ' ‣ ').replace(/^\d+ (.+)/, '$1')])
)
```

**Output**:
1. "Related Notes" table - Notes with `relatedProject` linking to current file
2. "Notes referencing X" table - Other notes that link to current file

**Usage**:
```markdown
```dataviewjs
await dv.view("scripts/dataview/related-project-note-table", 1)
```
```

---

### mentions-table.js

**Purpose**: Show all notes that mention/link to the current note

**Location**: `utility/scripts/dataview/mentions-table.js`

**Used In**: `New Person.md` template

**Parameters**:
- `input` (number): Header level for section title (optional)

**Code**:
```javascript
if (input) {
  const name = dv.current().file.name.replace(/^@/, '')
  dv.header(input, 'Notes referencing ' + name)
}

dv.table(
  ["Note", "Location"],
  dv.pages("[[" + dv.current().file.name + "]]")
    .sort(b => b.file.mtime, 'desc')
    .map(b => [
      b.file.link,
      b.file.folder.replace(/\//g, ' ‣ ').replace(/^\d+ (.+)/, '$1')
    ])
)
```

**Output**: Table showing all notes linking to current file with folder path

**Usage**:
```markdown
```dataviewjs
await dv.view("Scripts/Dataview/mentions-table", 3)
```
```

---

### tasks-by-project.js

**Purpose**: Display tasks grouped by project with optional filtering

**Location**: `utility/scripts/dataview/tasks-by-project.js`

**Used In**: `views/Task Query By Project.md`

**Parameters** (optional object):
| Parameter | Type | Description |
|-----------|------|-------------|
| selectedProjects | array | Array of project names to filter (multi-select) |
| projectFilter | string | Fuzzy match filter (case-insensitive contains) |
| selectedStatuses | array | Array of project statuses to include (default: New, Active, On Hold) |
| showCompleted | boolean | Whether to show completed tasks section (default: true) |
| clientFilter | array | Array of client names to filter projects by (multi-select) |
| engagementFilter | array | Array of engagement names to filter projects by (multi-select) |

Frontmatter values must be passed explicitly from the calling page (see usage examples).

**Usage Examples**:
```markdown
```dataviewjs
// Pass frontmatter values from calling page
const page = dv.current();
await dv.view("scripts/dataview/tasks-by-project", {
  selectedProjects: page.selectedProjects,
  projectFilter: page.projectFilter,
  selectedStatuses: page.selectedStatuses,
  showCompleted: page.showCompletedTasks,
  clientFilter: page.clientFilter,
  engagementFilter: page.engagementFilter
})

// Filter to specific projects (hardcoded array)
await dv.view("scripts/dataview/tasks-by-project", {
  selectedProjects: ["Project A", "Project B"]
})

// Hide completed tasks
await dv.view("scripts/dataview/tasks-by-project", { showCompleted: false })

// Filter by client
await dv.view("scripts/dataview/tasks-by-project", {
  clientFilter: ["Acme Corp", "(Unassigned)"]
})
```
```

**Note**: Frontmatter values must be passed explicitly via `dv.current()` in the calling page, as `dv.current()` context changes when executing external scripts.

**Client/Engagement Filtering**:
- Client filter derives client from engagement if not directly set on project
- Selecting "(Unassigned)" shows projects without client/engagement
- Multiple clients/engagements can be selected simultaneously
- Filters operate with AND logic (projects must match both if both are set)

**Helper Functions**:
- `getClientFromEngagement(engagementLink)`: Extracts client from engagement page
- `normalizeToComparableName(item)`: Normalizes Link objects and string formats for comparison
- `matchesClientFilter(project, clientFilter)`: Checks if project matches client filter
- `matchesEngagementFilter(project, engagementFilter)`: Checks if project matches engagement filter

**Output**:
- H2: Project name (clickable link)
- Task list: Incomplete tasks from project file
- H3: Project note name (for each note with tasks)
- Task list: Incomplete tasks from project note
- H4: Completed section with count (if showCompleted is true)

**Query Logic**:
1. Gets projects from `#project` tag (excluding utility folder)
2. Filters by status (default: New, Active, On Hold)
3. Applies selected projects filter if provided
4. Applies text filter if provided
5. Applies client filter if provided (checks project.client or derives from project.engagement)
6. Applies engagement filter if provided
7. For each project, finds related project notes via `relatedProject` frontmatter
8. Renders hierarchical task lists

---

### tasks-dashboard.js

**Purpose**: Advanced task dashboard with filtering and multiple view modes

**Location**: `utility/scripts/dataview/tasks-dashboard.js`

**Used In**: `views/Task Dashboard.md`

**Parameters** (optional object):
| Parameter | Type | Description |
|-----------|------|-------------|
| viewMode | string | Grouping mode: `context`, `date`, `priority`, `tag` (default: `context`) |
| contextFilter | array | Array of contexts to show (Project, Person, Meeting, Inbox, Daily Notes) |
| dueDateFilter | string | Date filter: `All`, `Today`, `This Week`, `Overdue`, `No Date` (default: `All`) |
| priorityFilter | array | Array of priority levels (1-5) |
| showCompleted | boolean | Whether to include completed tasks (default: `false`) |
| searchFilter | string | Text search filter (case-insensitive) |

**Usage Examples**:
```markdown
```dataviewjs
// Pass frontmatter values from calling page
const page = dv.current();
await dv.view("scripts/dataview/tasks-dashboard", {
  viewMode: page.viewMode,
  contextFilter: page.contextFilter,
  dueDateFilter: page.dueDateFilter,
  priorityFilter: page.priorityFilter,
  showCompleted: page.showCompleted,
  searchFilter: page.searchFilter
});

// View by priority, show only urgent and high
await dv.view("scripts/dataview/tasks-dashboard", {
  viewMode: "priority",
  priorityFilter: [1, 2]
});

// View overdue tasks from projects only
await dv.view("scripts/dataview/tasks-dashboard", {
  viewMode: "date",
  contextFilter: ["Project"],
  dueDateFilter: "Overdue"
});
```
```

**View Modes**:

| Mode | Description |
|------|-------------|
| `context` | Groups by source folder (Project, Person, Meeting, Inbox, Daily Notes) with sub-grouping by file |
| `date` | Groups by due date category (Overdue, Today, Tomorrow, This Week, Upcoming, No Date) |
| `priority` | Groups by priority level (1-5) with emoji labels |
| `tag` | Groups by task tags with Untagged section |

**Context Detection**:
Contexts are determined by file path prefix:
- `projects/` → Project
- `people/` → Person
- `meetings/` → Meeting
- `inbox/` → Inbox
- `daily notes/` → Daily Notes
- Other → Other

**Priority Detection**:
Uses Obsidian Tasks emoji format:
- ⏫ = 1 (Urgent)
- 🔼 = 2 (High)
- (none) = 3 (Medium)
- 🔽 = 4 (Low)
- ⏬ = 5 (Someday)

**Output Structure**:

By Context:
- H2: Context name (Project, Person, etc.)
  - H3: File name (clickable link)
    - Task list from that file

By Date:
- H2: Date category with emoji
  - Task list sorted by due date or priority

By Priority:
- H2: Priority level with emoji (e.g., "⏫ Urgent")
  - Task list sorted by due date

By Tag:
- H2: Tag name
  - Task list
- H2: Untagged (for tasks without tags)

---

## Meta Bind Scripts

### add-create-project-note-button.js

**Purpose**: Programmatically add a button to a note

**Location**: `utility/scripts/meta-bind/add-create-project-note-button.js`

**Note**: This script is a utility example. Buttons are typically added via template markdown, not dynamically.

**Code**:
```javascript
const addMetaBindButton = async () => {
  const metaBindPlugin = app.plugins.getPlugin('obsidian-meta-bind-plugin');
  if (!metaBindPlugin) {
    new Notice('Meta Bind plugin not found.');
    return;
  }

  const buttonConfig = {
    label: "Create Project Note",
    style: "primary",
    action: {
      type: "js",
      file: "utility/scripts/quickadd/trigger_quickadd_create_project_note.js",
    }
  };

  const activeFile = app.workspace.getActiveFile();
  if (activeFile) {
    await metaBindPlugin.api.addButtonToNote({
      file: activeFile,
      button: buttonConfig
    });
    new Notice('Button added to the note.');
  } else {
    new Notice('No active file found.');
  }
};

addMetaBindButton();
```

---

## Obsidian API Reference

Common API patterns used in scripts:

### App Object

```javascript
// Get active file
const activeFile = app.workspace.getActiveFile();

// Get file metadata
const metadata = app.metadataCache.getFileCache(activeFile);

// Read frontmatter
const frontmatter = metadata.frontmatter;

// Get file by path
const file = app.vault.getAbstractFileByPath("path/to/file.md");

// Read file content
const content = await app.vault.read(file);

// Create file
await app.vault.create("path/to/new.md", content);

// Update frontmatter
await app.fileManager.processFrontMatter(file, (fm) => {
  fm.property = "value";
});

// Open file in new tab
const leaf = app.workspace.getLeaf('tab');
await leaf.openFile(file);

// Show notice
new Notice("Message to user");
```

### Plugin Access

```javascript
// Get plugin instance
const plugin = app.plugins.getPlugin("plugin-id");

// Get plugin API
const api = plugin.api;

// QuickAdd API
await quickAddApi.executeChoice("Choice Name");
await quickAddApi.inputPrompt("Prompt message");

// Meta Bind API
await metaBindPlugin.api.addButtonToNote({...});
```

### Dataview API (in dataviewjs blocks)

```javascript
// Current file
dv.current()
dv.current().file.name
dv.current().file.link
dv.current().file.folder

// Query pages
dv.pages()                    // All pages
dv.pages("#tag")             // By tag
dv.pages("[[Link]]")         // Linking to
dv.pages('"folder"')         // In folder

// Filter and sort
.where(b => condition)
.sort(b => b.field, 'desc')
.map(b => [b.field1, b.field2])

// Output
dv.table(["Col1", "Col2"], data)
dv.list(data)
dv.header(level, "Text")
dv.paragraph("Text")

// Functions
dv.func.contains(array, value)
```

---

## Creating a New Script

### QuickAdd Trigger Script

1. Create file: `utility/scripts/quickadd/trigger_quickadd_<action>.js`
2. Copy trigger pattern, update `actionName`
3. Ensure QuickAdd choice exists with matching name
4. Test via Meta Bind button or command

### Dataview Render Script

1. Create file: `utility/scripts/dataview/<name>.js`
2. Use `dv.` API for queries and output
3. Accept `input` parameter for options
4. Call via: `await dv.view("scripts/dataview/<name>", params)`

### QuickAdd Macro Script

1. Create file: `utility/scripts/quickadd/<name>.js`
2. Export async function: `module.exports = async (params) => { ... }`
3. Use `params.quickAddApi` for prompts
4. Create QuickAdd macro pointing to script
5. Create trigger script to call macro

---

## Script Checklist

When adding a new script:

- [ ] Script is in correct directory for its type
- [ ] Error handling with `new Notice()` for user feedback
- [ ] Plugin existence checks before API calls
- [ ] File existence checks before operations
- [ ] QuickAdd choice/macro exists (if trigger)
- [ ] Button added to template/view (if needed)
- [ ] Documented in this file
