# Directory Structure

Complete reference for the Obsidian vault file organization.

## Top-Level Structure

```
_template/
├── .obsidian/           # Obsidian app configuration (hidden)
├── attachments/         # Media and file attachments
├── daily notes/         # Daily journal entries
├── inbox/               # Quick capture inbox
├── meetings/            # Meeting documentation
├── people/              # Contact/person notes
├── projects/            # Project tracking
├── reference/           # Reference materials
├── utility/             # Templates and scripts
└── views/               # Dashboard pages
```

## Directory Details

### `.obsidian/` - Configuration

Obsidian stores all app settings here. Key subdirectories:

| Path | Purpose |
|------|---------|
| `.obsidian/plugins/` | Community plugin configurations |
| `.obsidian/snippets/` | Custom CSS snippets |
| `.obsidian/app.json` | Core app settings |
| `.obsidian/appearance.json` | Theme and CSS settings |
| `.obsidian/workspace.json` | Layout and pinned tabs |
| `.obsidian/bookmarks.json` | Bookmarked files |
| `.obsidian/types.json` | Custom property types |

### `attachments/` - Media Files

- Stores images, PDFs, and other files referenced by notes
- Configured as default attachment folder in `app.json`
- Empty by default (`.gitkeep` placeholder)

**Configuration** (`app.json`):
```json
{
  "attachmentFolderPath": "attachments"
}
```

### `daily notes/` - Daily Journal

- Automatically created via daily-notes plugin
- Uses template: `utility/templates/Daily Note.md`
- Format: Auto-generated date-based filenames

**Configuration** (`daily-notes.json`):
```json
{
  "folder": "/daily notes",
  "template": "utility/templates/Daily Note"
}
```

### `inbox/` - Quick Capture

- GTD-style capture inbox for new ideas/tasks
- Quick creation via "New Inbox Note" button in `views/Inbox.md`
- Notes have `status` frontmatter for processing workflow

**Associated Files**:
- Template: `utility/templates/New Inbox Note.md`
- View: `views/Inbox.md`
- Script: `utility/scripts/quickadd/trigger_quickadd_create_inbox_note.js`

### `meetings/` - Meeting Notes

Contains two subdirectories for different meeting types:

#### `meetings/recurring/`
- Templates for recurring meetings (standups, 1:1s, weekly syncs)
- Each recurring meeting has a parent page with embedded entries
- New entries appended with date headers

**Associated Files**:
- Index: `meetings/Recurring Meeting Index.md`
- Container Template: `utility/templates/Recurring Meeting - Page.md`
- Entry Template: `utility/templates/Recurring Meeting - Daily Entry.md`

#### `meetings/single/`
- One-time meeting notes
- Full template with attendees, agenda, notes, action items

**Associated Files**:
- Index: `meetings/Single Meeting Index.md`
- Template: `utility/templates/Single Meeting.md`

### `people/` - Contacts

- Notes for people/contacts you work with
- Shows all notes that mention a person via dataview script
- Supports `reports-to` hierarchy tracking

**Associated Files**:
- Template: `utility/templates/New Person.md`
- Script: `utility/scripts/dataview/mentions-table.js`

**Frontmatter Schema**:
```yaml
---
status: Active
title: ""
reports-to: ""
---
```

### `projects/` - Project Tracking

Main project management area with Kanban and table views.

#### `projects/` (root)
- Project files with full metadata
- Status-based workflow: New → Active → On Hold → Complete
- Priority 1-5 scale
- Date tracking (start, end)

#### `projects/notes/`
- Sub-documents for project-specific notes
- Linked via `relatedProject` frontmatter
- Created via "New Project Note" button

**Associated Files**:
- View: `views/Projects.md`
- Template: `utility/templates/New Project.md`
- Note Template: `utility/templates/Project Note.md`
- Script: `utility/scripts/quickadd/create-project-note.js`

**Frontmatter Schema**:
```yaml
---
start-date: 2024-01-01
end-date:
status: New  # New | Active | On Hold | Complete
priority: 3  # 1-5
tags:
  - project
notesDirectory: projects/notes
---
```

### `reference/` - Reference Material

- Static reference documentation
- Cheat sheets, procedures, lookup tables
- Not actively tracked in views

### `utility/` - Templates & Scripts

Core automation and templating hub.

#### `utility/templates/`
| Template | Purpose | Creates In |
|----------|---------|------------|
| `Daily Note.md` | Daily journal | `daily notes/` |
| `New Project.md` | New project | `projects/` |
| `New Inbox Note.md` | Quick capture | `inbox/` |
| `New Person.md` | Contact | `people/` |
| `Project Note.md` | Project sub-note | `projects/notes/` |
| `Single Meeting.md` | One-time meeting | `meetings/single/` |
| `Recurring Meeting - Page.md` | Recurring meeting container | `meetings/recurring/` |
| `Recurring Meeting - Daily Entry.md` | Meeting entry | Embedded |

#### `utility/templates/components/`
Reusable UI components embedded via `meta-bind-embed`. Changes propagate to all embedding notes.

| Component | Purpose | Embedded In |
|-----------|---------|-------------|
| `project-properties.md` | Property inputs (dates, priority, status) | Project files |
| `project-actions.md` | Action buttons (New Project Note) | Project files |

See [templates-system.md](./templates-system.md#meta-bind-component-files) for full documentation.

#### `utility/scripts/`
| Directory | Purpose |
|-----------|---------|
| `quickadd/` | QuickAdd action trigger scripts |
| `dataview/` | Dataview render scripts |
| `meta-bind/` | Meta Bind button/input scripts |

### `views/` - Dashboards

Pinned dashboard pages with live queries.

| View | Purpose |
|------|---------|
| `Task Query.md` | Central task dashboard by due date |
| `Tasks By Tag.md` | Tasks grouped by tags |
| `Projects.md` | Project Kanban/table views |
| `Inbox.md` | Inbox processing |
| `Recurring Meeting Index.md` | Recurring meetings list |
| `Single Meeting Index.md` | Single meetings list |

All views use frontmatter:
```yaml
---
obsidianUIMode: preview
---
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Views | PascalCase with spaces | `Task Query.md` |
| Templates | PascalCase with spaces | `New Project.md` |
| Scripts | kebab-case | `create-project-note.js` |
| Content | User preference | `My Project.md` |

## Empty Directories

Directories using `.gitkeep` placeholder:
- `attachments/`
- `daily notes/`
- `inbox/`
- `people/`
- `reference/`
- `projects/notes/`

These are preserved in git but contain no template content.
