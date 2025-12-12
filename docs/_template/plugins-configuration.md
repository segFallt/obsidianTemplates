# Plugins & Configuration

Reference for all Obsidian plugins and their configurations.

## Core Plugins

Configured in `.obsidian/core-plugins.json`.

### Enabled Core Plugins

| Plugin | Purpose |
|--------|---------|
| file-explorer | File navigation sidebar |
| global-search | Full-text search |
| switcher | Quick file switching (Cmd/Ctrl+O) |
| graph | Graph view of note connections |
| backlink | Show notes linking to current note |
| canvas | Visual canvas for diagrams |
| outgoing-link | Show links from current note |
| tag-pane | Tag browser |
| properties | Frontmatter property editor |
| page-preview | Hover preview of links |
| daily-notes | Daily note creation |
| note-composer | Merge/extract notes |
| command-palette | Command search (Cmd/Ctrl+P) |
| slash-command | Slash command menu |
| editor-status | Word count in status bar |
| bookmarks | Bookmark files/folders |
| outline | Document outline sidebar |
| word-count | Word/character count |
| file-recovery | Snapshot recovery |

### Disabled Core Plugins

| Plugin | Reason |
|--------|--------|
| templates | Replaced by Templater |
| markdown-importer | Not needed |
| zk-prefixer | Not using Zettelkasten IDs |
| random-note | Not needed |
| slides | Not needed |
| audio-recorder | Not needed |
| workspaces | Not needed |
| publish | Not using Obsidian Publish |
| sync | Not using Obsidian Sync |

## Community Plugins

Listed in `.obsidian/community-plugins.json`. Configurations stored in `.obsidian/plugins/<plugin-id>/`.

### Plugin Reference

#### 1. Advanced Tables (`table-editor-obsidian`)

**Purpose**: Spreadsheet-like Markdown table editing

**Features**:
- Tab navigation between cells
- Auto-formatting on tab
- Formula support
- Column/row manipulation

**Configuration**: `.obsidian/plugins/table-editor-obsidian/data.json`

---

#### 2. Dataview (`dataview`)

**Purpose**: SQL-like queries for dynamic note views

**Features**:
- `dataview` code blocks for queries
- `dataviewjs` for JavaScript queries
- Inline queries with `= expression`
- Table, list, task views

**Configuration** (`.obsidian/plugins/dataview/data.json`):
```json
{
  "renderNullAs": "\\-",
  "taskCompletionTracking": false,
  "taskCompletionUseEmojiShorthand": false,
  "taskCompletionText": "completion",
  "taskCompletionDateFormat": "yyyy-MM-dd",
  "recursiveSubTaskCompletion": false,
  "warnOnEmptyResult": true,
  "refreshEnabled": true,
  "refreshInterval": 2500,
  "defaultDateFormat": "YYYY-MM-DD",
  "defaultDateTimeFormat": "YYYY-MM-DD HH:MM A",
  "maxRecursiveRenderDepth": 4,
  "tableIdColumnName": "File",
  "tableGroupColumnName": "Group",
  "showResultCount": true,
  "allowHtml": true,
  "inlineQueryPrefix": "=",
  "inlineJsQueryPrefix": "$=",
  "inlineQueriesInCodeblocks": true,
  "enableInlineDataview": true,
  "enableDataviewJs": true,
  "enableInlineDataviewJs": true
}
```

**Usage Example**:
```dataview
TABLE status, priority
FROM #project
WHERE status = "Active"
SORT priority ASC
```

---

#### 3. Tasks (`obsidian-tasks-plugin`)

**Purpose**: Advanced task management with due dates, priorities, recurrence

**Configuration** (`.obsidian/plugins/obsidian-tasks-plugin/data.json`):
```json
{
  "statusSettings": {
    "coreStatuses": [
      {
        "symbol": " ",
        "name": "Todo",
        "nextStatusSymbol": "x",
        "availableAsCommand": true,
        "type": "TODO"
      },
      {
        "symbol": "x",
        "name": "Done",
        "nextStatusSymbol": " ",
        "availableAsCommand": true,
        "type": "DONE"
      },
      {
        "symbol": "/",
        "name": "In Progress",
        "nextStatusSymbol": "x",
        "availableAsCommand": true,
        "type": "IN_PROGRESS"
      },
      {
        "symbol": "-",
        "name": "Cancelled",
        "nextStatusSymbol": " ",
        "availableAsCommand": true,
        "type": "CANCELLED"
      }
    ]
  },
  "setCreatedDate": true,
  "setDoneDate": true,
  "setCancelledDate": true
}
```

**Task Symbols**:
| Symbol | Status | Next State |
|--------|--------|------------|
| ` ` (space) | Todo | Done |
| `x` | Done | Todo |
| `/` | In Progress | Done |
| `-` | Cancelled | Todo |

**Usage Example**:
```tasks
not done
due before tomorrow
sort by priority
```

---

#### 4. Templater (`templater-obsidian`)

**Purpose**: Dynamic templates with JavaScript and user input

**Configuration** (`.obsidian/plugins/templater-obsidian/data.json`):
```json
{
  "templates_folder": "utility/templates",
  "templates_pairs": [],
  "trigger_on_file_creation": false,
  "auto_jump_to_cursor": true,
  "enable_system_commands": false,
  "shell_path": "",
  "user_scripts_folder": "",
  "enable_folder_templates": true,
  "folder_templates": [],
  "syntax_highlighting": true,
  "enabled_templates_hotkeys": [],
  "startup_templates": [],
  "enable_ribbon_icon": true
}
```

**Template Syntax**:
```markdown
<%*
const title = await tp.system.prompt("Enter title");
-%>
# <% title %>
Created: <% tp.date.now("YYYY-MM-DD") %>
```

---

#### 5. Tag Wrangler (`tag-wrangler`)

**Purpose**: Tag management and bulk operations

**Features**:
- Rename tags across vault
- Merge tags
- Tag hierarchy management

---

#### 6. Force View Mode (`obsidian-view-mode-by-frontmatter`)

**Purpose**: Control note view mode via frontmatter

**Usage**:
```yaml
---
obsidianUIMode: preview  # Always show in preview mode
---
```

Used by all view files to prevent accidental editing.

---

#### 7. QuickAdd (`quickadd`)

**Purpose**: Quick note creation and macro execution

**Configuration** (`.obsidian/plugins/quickadd/data.json`):

**Choices (Actions)**:
| Name | Type | Template | Folder |
|------|------|----------|--------|
| Meeting - Recurring | Template | Recurring Meeting - Page | meetings/recurring |
| Meeting - Single | Template | Single Meeting | meetings/single |
| Project - New | Template | New Project | projects |
| Inbox - New | Template | New Inbox Note | inbox |
| Create Project Note | Macro | (runs create-project-note.js) | - |

**Settings**:
```json
{
  "templateFolderPath": "utility/templates",
  "enableRibbonIcon": true,
  "devMode": false
}
```

---

#### 8. Projects (`obsidian-projects`)

**Purpose**: Kanban boards and table views for project management

**Configuration** (`.obsidian/plugins/obsidian-projects/data.json`):

**Project: "projects"**:
- Source: `projects/` folder
- Views:
  - Table (default)
  - Board (Kanban with Status column)
- Kanban Columns: New → Active → On Hold → Complete

**Project: "Projects - Active"**:
- Filtered view of Active projects only
- Table view

---

#### 9. Meta Bind (`obsidian-meta-bind-plugin`)

**Purpose**: Interactive form inputs and buttons in notes

**Configuration** (`.obsidian/plugins/obsidian-meta-bind-plugin/data.json`):
```json
{
  "devMode": false,
  "enableJs": true,
  "syntaxHighlighting": true,
  "enableEditorRightClickMenu": true,
  "preferredDateFormat": "YYYY-MM-DD",
  "firstWeekday": "monday",
  "syncInterval": 200,
  "maxSyncInterval": 1000,
  "minSyncInterval": 50,
  "inputFieldTemplates": [],
  "buttonTemplates": [],
  "excludedFolders": ["templates"],
  "inputTemplates": [],
  "viewFieldDisplayNullAs": ""
}
```

**Input Syntax**:
```markdown
`INPUT[date:start-date]`
`INPUT[suggester(option(New), option(Active)):status]`
```

**Button Syntax**:
```markdown
`BUTTON[new-project-note]`
```

---

#### 10. JS Engine (`js-engine`)

**Purpose**: Execute JavaScript from notes

**Features**:
- Run scripts from code blocks
- Access Obsidian API
- Custom automation

---

#### 11. Iconize (`obsidian-icon-folder`)

**Purpose**: Add custom icons to files/folders

**Features**:
- Icon packs support
- Folder icons
- File-specific icons

---

## App Configuration

### Core Settings (`.obsidian/app.json`)

```json
{
  "promptDelete": false,
  "newFileFolderPath": "attachments",
  "attachmentFolderPath": "attachments"
}
```

### Appearance (`.obsidian/appearance.json`)

```json
{
  "enabledCssSnippets": [
    "callout_waiting",
    "callout_calendar",
    "callout_someday",
    "someday"
  ]
}
```

### Custom Property Types (`.obsidian/types.json`)

| Property | Type | Purpose |
|----------|------|---------|
| start-date | date | Project/meeting start |
| end-date | date | Project/meeting end |
| date | datetime | Meeting timestamp |
| relatedProject | multitext | Link to parent project |
| related-to | multitext | General note links |
| priority | number | 1-5 priority scale |
| TQ_* | checkbox | Task Query display settings |

### Workspace Layout (`.obsidian/workspace.json`)

**Default Open Tabs**:
1. Task Query (view)
2. Tasks By Tag (view)
3. Projects - obsidian-projects view
4. Projects - dataview view

**Left Sidebar**:
- File explorer
- Bookmarks
- Search

**Right Sidebar**:
- Backlinks
- Outgoing links
- Tags
- Outline
- Properties
- Advanced tables

### Bookmarks (`.obsidian/bookmarks.json`)

Group: "Common Views"
- Task Query
- Tasks By Tag
- Projects
- Inbox
- Recurring Meeting Index
- Single Meeting Index

## CSS Snippets

Located in `.obsidian/snippets/`:

### `callout_waiting.css`
Yellow callout for #waiting tasks:
```css
.callout[data-callout="waiting"] {
  --callout-color: 255, 248, 46;
  --callout-icon: clock;
}
```

### `callout_calendar.css`
Blue callout for calendar items:
```css
.callout[data-callout="calendar"] {
  --callout-color: 0, 115, 255;
  --callout-icon: calendar;
}
```

### `callout_someday.css`
Blue callout for #someday/maybe items:
```css
.callout[data-callout="someday"] {
  --callout-color: 0, 115, 255;
  --callout-icon: bed-single;
}
```

## Adding a New Plugin

1. Install plugin in Obsidian
2. Configure settings in app
3. Add plugin ID to `.obsidian/community-plugins.json`
4. Commit plugin folder: `.obsidian/plugins/<plugin-id>/`
5. Document in this file
