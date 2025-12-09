# Personal Productivity Vault

A comprehensive Obsidian vault template for personal productivity, project management, and task tracking.

## Features

- **Projects**: Track projects with status, priority, dates, and linked notes
- **Tasks**: Centralized task management with due dates, priorities, and tags
- **Meetings**: Separate templates for one-time and recurring meetings
- **People**: Contact profiles showing all notes that mention them
- **Inbox**: Quick capture for ideas and notes to process later
- **Daily Notes**: Automatic daily journal entries
- **Dashboard Views**: Live-updating views using Obsidian Bases

---

## Getting Started

### Opening the Vault

1. Open Obsidian
2. Click "Open folder as vault"
3. Select the `_template` folder
4. Trust the plugins when prompted

### Your First Project

1. Open `views/Projects Base View.md` from the file explorer
2. Click the **New Project** button
3. Enter a project name when prompted
4. Fill in the properties:
   - **Start Date**: When the project begins
   - **Priority**: 1 (highest) to 5 (lowest)
   - **Status**: New → Active → On Hold → Complete

### Adding Project Notes

1. Open a project file
2. Click **New Project Note**
3. Enter a name for the note
4. The note is automatically linked to the parent project

### Creating Tasks

Add tasks anywhere in your notes using standard Obsidian task syntax:

```markdown
- [ ] Task description
- [ ] Task with due date 📅 2024-12-25
- [ ] Task with priority ⏫
- [ ] Task with tag #waiting
```

View all tasks in `views/Task Query.md`.

---

## Folder Structure

| Folder | Purpose |
|--------|---------|
| `projects/` | Project files |
| `projects/notes/` | Notes linked to projects |
| `inbox/` | Quick capture notes |
| `meetings/recurring/` | Recurring meeting series |
| `meetings/single/` | One-time meetings |
| `people/` | Contact profiles |
| `daily notes/` | Daily journal entries |
| `reference/` | Static reference materials |
| `views/` | Dashboard pages |
| `utility/` | Templates and scripts (don't edit) |
| `attachments/` | Images and files |

---

## Views & Dashboards

### Projects Base View
Shows all projects organized by status:
- **Active**: Currently in progress
- **New**: Not yet started
- **On Hold**: Paused projects
- **Complete**: Finished projects

### Task Query
Central task dashboard organized by:
- Today's tasks
- Past due
- Tomorrow
- This week
- Upcoming
- No due date
- Tagged tasks (#waiting, #someday)
- Completed tasks

### Task Query By Project
View tasks grouped by project with filters for:
- Specific projects (multi-select)
- Project status
- Text search
- Show/hide completed tasks

### Inbox
Quick capture processing:
- **Active**: Notes to process
- **Inactive**: Completed items

### Meeting Indexes
- **Recurring Meetings**: Active and past recurring series
- **Single Meetings**: One-time meeting notes

---

## Quick Actions

### Keyboard Shortcuts
Open the command palette (`Ctrl/Cmd + P`) and search for:
- `QuickAdd: Project - New`
- `QuickAdd: Inbox - New`
- `QuickAdd: Meeting - Single`
- `QuickAdd: Meeting - Recurring`

### Buttons
Each view has creation buttons at the top for quick entry.

---

## Project Workflow

### Status Flow
```
New → Active → On Hold → Complete
         ↑         ↓
         └─────────┘
```

### Priority Scale
| Priority | Meaning |
|----------|---------|
| 1 | Urgent/Critical |
| 2 | High |
| 3 | Medium |
| 4 | Low |
| 5 | Someday |

### Linking Notes to Projects
Project notes are stored in `projects/notes/` and linked via the `relatedProject` property. Use the **New Project Note** button from within a project to create linked notes automatically.

---

## Task Management

### Task Syntax
The vault uses the Obsidian Tasks plugin. Common formats:

```markdown
- [ ] Basic task
- [ ] Due today 📅 2024-01-15
- [ ] High priority ⏫
- [ ] Medium priority 🔼
- [ ] Low priority 🔽
- [ ] Recurring 🔁 every week
- [ ] With tag #waiting
- [x] Completed task ✅ 2024-01-10
```

### Special Tags
- `#waiting` - Tasks waiting on someone else
- `#someday` - Tasks for the future (no urgency)

These appear in dedicated sections in the Task Query view.

---

## Meetings

### Recurring Meetings
For regular meetings (standups, 1:1s, weekly syncs):
1. Create a recurring meeting page (e.g., "Weekly Team Sync")
2. Add entries using the Daily Entry template
3. Each entry is dated and appended to the page

### Single Meetings
For one-time meetings:
1. Create via **New Single Meeting**
2. Fill in attendees, agenda, and notes
3. Track action items and open questions

---

## People/Contacts

Create a profile for each person you work with:
1. Navigate to `people/`
2. Create a new note with their name
3. Add title, reports-to, and other details

Each person's page shows all notes that mention them.

---

## Daily Notes

Daily notes are created automatically when you open Obsidian. They include sections for:
- **Progress Notes**: What you accomplished
- **Quick Notes**: Random thoughts and captures
- **Action Items**: Tasks that came up during the day

---

## Tips

### Quick Capture
Use the Inbox for anything you need to capture quickly. Process inbox items later by:
- Moving them to the appropriate folder
- Converting to projects or tasks
- Marking as complete

### Using Filters
The Task Query By Project view has powerful filters:
- **Select Projects**: Choose specific projects to view
- **Search**: Filter by project name
- **Status**: Show only Active, New, or On Hold projects
- **Clear Filters**: Reset to defaults

### Keyboard Navigation
- `Ctrl/Cmd + O`: Quick open any file
- `Ctrl/Cmd + P`: Command palette
- `Ctrl/Cmd + Shift + F`: Search across vault

---

## Customization

### Adding Project Statuses
Edit `utility/scripts/constants.js` to modify the available statuses.

### Modifying Property Forms
Edit files in `utility/templates/components/` to change the input fields shown on projects.

### Customizing Views
Base files (`.base`) in `views/` control table columns, filters, and sorting.

### Adding Templates
Create new templates in `utility/templates/` and add corresponding QuickAdd choices in the plugin settings.

---

## Plugins Used

This vault uses the following community plugins:

| Plugin | Purpose |
|--------|---------|
| **Dataview** | Dynamic queries and tables |
| **Templater** | Template generation with variables |
| **QuickAdd** | Quick note creation |
| **Meta Bind** | Interactive form controls |
| **Obsidian Projects** | Base views for tables |
| **Obsidian Tasks** | Task management and queries |
| **JS Engine** | JavaScript execution for buttons |
| **Tag Wrangler** | Tag management |
| **Table Editor** | Enhanced table editing |
| **Icon Folder** | Custom folder icons |
| **View Mode by Frontmatter** | Auto-preview for dashboards |

All plugins are pre-configured and ready to use.

---

## Troubleshooting

### Views Not Loading
Ensure all plugins are enabled in Settings → Community plugins.

### Tasks Not Appearing
Check that your task syntax matches the Obsidian Tasks format. Tasks need the checkbox format `- [ ]`.

### Buttons Not Working
Verify that JS Engine and Meta Bind plugins are enabled with JavaScript execution allowed.

### Templates Not Processing
Ensure Templater is enabled and the template folder is set to `utility/templates`.
