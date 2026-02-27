# Templates System

Reference for Templater templates and QuickAdd integration.

## Overview

Templates are stored in `utility/templates/` and are triggered via:
1. **QuickAdd**: Main method for creating notes from templates
2. **Templater**: Direct template insertion
3. **Daily Notes**: Automatic daily note creation

## Template Reference

### Daily Note.md

**Purpose**: Daily journal/note template
**Created In**: `daily notes/`
**Triggered By**: Daily Notes core plugin (automatic on new day)

**Content**:
```markdown
# Progress Notes
-

# Quick Notes
-

# Action Items
-
```

**Frontmatter**: None

**Sections**:
- Progress Notes: Track what was accomplished
- Quick Notes: Capture random thoughts
- Action Items: Tasks that arose during the day

---

### New Project.md

**Purpose**: Full project with metadata and tracking
**Created In**: `projects/`
**Triggered By**: QuickAdd "Project - New"

**Frontmatter**:
```yaml
---
notesDirectory:
start-date: <% tp.date.now() %>
end-date:
status: New
tags:
  - "#project"
priority:
convertedFrom:
---
```

| Property | Type | Description |
|----------|------|-------------|
| notesDirectory | text | Auto-generated as `projects/notes/<snake_case_name>` |
| start-date | date | Project start (auto-filled) |
| end-date | date | Project completion |
| status | select | New, Active, On Hold, Complete |
| tags | multitext | Always includes #project |
| priority | number | 1-5 scale |
| convertedFrom | link | Link to inbox item if converted from inbox |

**Body Structure**:
```markdown
# Properties
```meta-bind-embed
[[project-properties]]
```

---
# Notes

---
# Linked
---
```meta-bind-embed
[[project-actions]]
```
[Dataview: related-project-note-table]
```

**Features**:
- Uses **Meta Bind Embeds** to reference centralized component files
- Properties and actions are defined once and shared across all projects
- Changes to components propagate automatically to all existing projects
- Dataview table showing related project notes

**Meta Bind Embeds**:
This template uses `meta-bind-embed` to include reusable components. The input fields in embedded components bind to the **containing note's frontmatter**, not the component file's. This allows centralized UI definitions while maintaining per-file data.

See [Meta Bind Components](#meta-bind-component-files) for details on the embedded files.

**Templater Expressions**:
- `<% tp.date.now() %>`: Current date in default format

---

### New Inbox Note.md

**Purpose**: Quick capture note with conversion capability
**Created In**: `inbox/`
**Triggered By**: QuickAdd "Inbox - New"

**Frontmatter**:
```yaml
---
status: Active
convertedTo:
---
```

| Property | Type | Description |
|----------|------|-------------|
| status | select | Active or Inactive |
| convertedTo | link | Link to project if converted |

**Body Structure**:
```markdown
# Properties
```meta-bind-embed
[[inbox-properties]]
```

---
```meta-bind-button
style: primary
label: Convert to Project
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_convert_inbox.js
```

# Notes
```

**Features**:
- Uses Meta Bind Embeds for property inputs
- "Convert to Project" button for promoting to full project
- Bidirectional linking when converted

**Workflow**:
1. Create via button in `views/Inbox.md`
2. Add content in Notes section
3. Set status via property controls
4. Either:
   - Mark as Inactive when done
   - Click "Convert to Project" to promote to full project

---

### New Person.md

**Purpose**: Contact/person profile
**Created In**: `people/`
**Triggered By**: QuickAdd "Person - New"

**Frontmatter**:
```yaml
---
obsidianUIMode: preview
tags:
  - "#person"
status: Active
title:
reports-to:
notes:
---
```

| Property | Type | Description |
|----------|------|-------------|
| obsidianUIMode | text | Forces preview mode |
| tags | array | Always includes #person |
| status | select | Active or Inactive |
| title | text | Job title |
| reports-to | link | Manager/supervisor (auto-suggests from #person) |
| notes | text | Additional details |

**Body**:
```markdown
# Profile
```meta-bind-embed
[[person-properties]]
```

---
# Mentions
```dataviewjs
await dv.view("scripts/dataview/mentions-table", 3)
```
```

**Features**:
- Uses Meta Bind Embeds for property inputs
- Shows all notes that mention this person
- Uses `mentions-table.js` dataview script
- `#person` tag enables auto-suggestion in other templates

---

### New Client.md

**Purpose**: Client/organization profile for consulting/contracting work
**Created In**: `clients/`
**Triggered By**: QuickAdd "Client - New"

**Frontmatter**:
```yaml
---
obsidianUIMode: preview
tags:
  - "#client"
status: Active
contact-name:
contact-email:
contact-phone:
notes:
---
```

| Property | Type | Description |
|----------|------|-------------|
| obsidianUIMode | text | Forces preview mode |
| tags | array | Always includes #client |
| status | select | Active or Inactive |
| contact-name | text | Primary contact name |
| contact-email | text | Contact email address |
| contact-phone | text | Contact phone number |
| notes | textarea | Additional details about the client |

**Body**:
```markdown
# Properties
```meta-bind-embed
[[client-properties]]
```

---
# Engagements
```dataviewjs
await dv.view("scripts/dataview/client-engagements-table")
```

---
# People
```dataviewjs
await dv.view("scripts/dataview/client-people-table")
```

---
# Notes

```

**Features**:
- Uses Meta Bind Embeds for property inputs
- Shows all engagements linked to this client
- Shows all people linked to this client
- `#client` tag enables auto-suggestion in engagement and person templates

---

### New Engagement.md

**Purpose**: Specific project engagement or contract for a client
**Created In**: `engagements/`
**Triggered By**: QuickAdd "Engagement - New"

**Frontmatter**:
```yaml
---
obsidianUIMode: preview
tags:
  - "#engagement"
client:
status: Active
start-date: <% tp.date.now() %>
end-date:
description:
---
```

| Property | Type | Description |
|----------|------|-------------|
| obsidianUIMode | text | Forces preview mode |
| tags | array | Always includes #engagement |
| client | link | Link to parent client (auto-suggests from #client) |
| status | select | Active or Inactive |
| start-date | date | Engagement start date (auto-filled) |
| end-date | date | Engagement completion date |
| description | textarea | Engagement scope and description |

**Body**:
```markdown
# Properties
```meta-bind-embed
[[engagement-properties]]
```

---
# Projects
```dataviewjs
await dv.view("scripts/dataview/engagement-projects-table")
```

---
# Notes

```

**Features**:
- Uses Meta Bind Embeds for property inputs
- Links to parent client
- Shows all projects scoped to this engagement
- `#engagement` tag enables auto-suggestion in project, inbox, meeting, and daily note templates
- Engagement hierarchy enables filtering tasks by client/engagement in Task Dashboard

---

### Project Note.md

**Purpose**: Sub-note linked to a parent project
**Created In**: `projects/notes/`
**Triggered By**: QuickAdd macro "Create Project Note"

**Frontmatter**:
```yaml
---
relatedProject: "[[<% tp.file.title %>]]"
---
```

| Property | Type | Description |
|----------|------|-------------|
| relatedProject | multitext | Wikilink to parent project |

**Templater Expressions**:
- `<% tp.file.title %>`: Filled by `create-project-note.js` with parent project name

**Workflow**:
1. Open a project file
2. Click "New Project Note" button
3. Enter note name in prompt
4. Script creates note with `relatedProject` set to parent
5. Note appears in parent's "Linked" section

---

### Single Meeting.md

**Purpose**: One-time meeting notes
**Created In**: `meetings/single/`
**Triggered By**: QuickAdd "Meeting - Single"

**Frontmatter**:
```yaml
---
date: <% tp.date.now("YYYY-MM-DDTHH:mm:ss") %>
attendees: []
---
```

| Property | Type | Description |
|----------|------|-------------|
| date | datetime | Full timestamp of meeting |
| attendees | list | Array of person links |

**Body**:
```markdown
# Attendees
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#person', 'attendees', 'listSuggester', 'persons');
```

# Invitation Message


# Notes
-
```

**Sections**:
- Attendees: Interactive list with auto-suggestion from active `#person` tagged notes
- Invitation Message: Calendar invite content
- Notes: Meeting discussion

**Features**:
- `attendees` property uses `meta-bind-js-view` with the shared `active-suggester.js` module to show only active persons in the list suggester
- Selected attendees are stored as links in frontmatter
- Requires JS Engine and Dataview plugins

---

### Recurring Meeting - Page.md

**Purpose**: Container for recurring meeting entries
**Created In**: `meetings/recurring/`
**Triggered By**: QuickAdd "Meeting - Recurring"

**Frontmatter**:
```yaml
---
start-date: <% tp.date.now() %>
end-date:
---
```

| Property | Type | Description |
|----------|------|-------------|
| start-date | date | When recurring meeting started |
| end-date | date | When recurring meeting ended (if no longer active) |

**Body**: Empty (entries are appended)

**Usage**:
1. Create recurring meeting page (e.g., "Weekly Standup")
2. Use "Recurring Meeting - Daily Entry" template to add entries
3. Entries are appended to the page with date headers

---

### Recurring Meeting - Daily Entry.md

**Purpose**: Individual entry for a recurring meeting
**Created In**: Embedded in recurring meeting page
**Triggered By**: Manual insertion

**Content**:
```markdown
# <% tp.date.now() %>
attendees::

## Notes
-


---
```

**Templater Expressions**:
- `<% tp.date.now() %>`: Current date as header

**Dataview Inline Properties**:
- `attendees::`: Dataview inline property for per-entry attendee tracking

**Usage**:
1. Open recurring meeting page
2. Insert template at bottom
3. Add attendees as links: `attendees:: [[Person A]], [[Person B]]`
4. Fill in notes

**Note**: Since daily entries are embedded sections (not separate files), they cannot have YAML frontmatter. The `attendees::` syntax is a Dataview inline property that can be queried across the vault.

---

## Meta Bind Component Files

Component files are reusable UI elements stored in `utility/templates/components/`. They are included in templates and notes using `meta-bind-embed`. When embedded, input fields bind to the **containing note's frontmatter**, not the component file's.

**Benefits**:
- **Single source of truth**: Edit a component once, all embedded instances update
- **Consistency**: All notes using a component have identical UI
- **Maintainability**: No need to manually update each file when changing UI elements

**Location**: `utility/templates/components/`

### project-properties.md

**Purpose**: Centralized property inputs for project files
**Embedded In**: Project files via `[[project-properties]]`

**Content**:
```markdown
## Engagement
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#engagement', 'engagement', 'suggester', 'engagements');
```
## Start Date
`INPUT[date:start-date]`
## End Date
`INPUT[date:end-date]`
## Priority
```meta-bind
INPUT[select(option(1), option(2), option(3), option(4), option(5)):priority]
```
## Status
```meta-bind
INPUT[select(option(New), option(Active), option(On Hold), option(Complete)):status]
```
```

**Inputs Provided**:
| Input | Type | Binds To |
|-------|------|----------|
| Engagement | suggester (via `active-suggester.js` module) | `engagement` frontmatter |
| Start Date | date picker | `start-date` frontmatter |
| End Date | date picker | `end-date` frontmatter |
| Priority | select (1-5) | `priority` frontmatter |
| Status | select | `status` frontmatter |

**Note**: The Engagement field uses `meta-bind-js-view` with the shared `active-suggester.js` module to dynamically filter to only active engagements. Requires JS Engine and Dataview plugins.

---

### project-actions.md

**Purpose**: Centralized action buttons for project files
**Embedded In**: Project files via `[[project-actions]]`

**Content**:
```markdown
```meta-bind-button
style: primary
label: New Project Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_project_note.js
```
```

**Actions Provided**:
- "New Project Note" button that triggers QuickAdd macro to create a linked project note

---

### inbox-properties.md

**Purpose**: Centralized property inputs for inbox files
**Embedded In**: Inbox files via `[[inbox-properties]]`

**Content**:
```markdown
## Engagement
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#engagement', 'engagement', 'suggester', 'engagements');
```
## Status
```meta-bind
INPUT[select(option(Active), option(Inactive)):status]
```
```

**Inputs Provided**:
| Input | Type | Binds To |
|-------|------|----------|
| Engagement | suggester (via `active-suggester.js` module) | `engagement` frontmatter |
| Status | select (Active/Inactive) | `status` frontmatter |

**Note**: The Engagement field uses `meta-bind-js-view` with the shared `active-suggester.js` module to dynamically filter to only active engagements. Requires JS Engine and Dataview plugins.

---

### person-properties.md

**Purpose**: Centralized property inputs for person files
**Embedded In**: Person files via `[[person-properties]]`

**Content**:
```markdown
## Client
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#client', 'client', 'suggester', 'clients');
```
## Status
```meta-bind
INPUT[select(option(Active), option(Inactive)):status]
```
## Title
`INPUT[text:title]`
## Reports To
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#person', 'reports-to', 'suggester', 'persons');
```
## Notes
`INPUT[textArea:notes]`
```

**Inputs Provided**:
| Input | Type | Binds To |
|-------|------|----------|
| Client | suggester (via `active-suggester.js` module) | `client` frontmatter |
| Status | select (Active/Inactive) | `status` frontmatter |
| Title | text | `title` frontmatter |
| Reports To | suggester (via `active-suggester.js` module) | `reports-to` frontmatter |
| Notes | textArea | `notes` frontmatter |

**Note**: The Client and Reports To fields use `meta-bind-js-view` with the shared `active-suggester.js` module to dynamically filter to only active items. Requires JS Engine and Dataview plugins.

---

### client-properties.md

**Purpose**: Centralized property inputs for client files
**Embedded In**: Client files via `[[client-properties]]`

**Content**:
```markdown
## Status
```meta-bind
INPUT[select(option(Active), option(Inactive)):status]
```
## Contact Name
`INPUT[text:contact-name]`
## Contact Email
`INPUT[text:contact-email]`
## Contact Phone
`INPUT[text:contact-phone]`
## Notes
`INPUT[textArea:notes]`
```

**Inputs Provided**:
| Input | Type | Binds To |
|-------|------|----------|
| Status | select (Active/Inactive) | `status` frontmatter |
| Contact Name | text | `contact-name` frontmatter |
| Contact Email | text | `contact-email` frontmatter |
| Contact Phone | text | `contact-phone` frontmatter |
| Notes | textArea | `notes` frontmatter |

---

### engagement-properties.md

**Purpose**: Centralized property inputs for engagement files
**Embedded In**: Engagement files via `[[engagement-properties]]`

**Content**:
```markdown
## Client
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#client', 'client', 'suggester', 'clients');
```
## Status
```meta-bind
INPUT[select(option(Active), option(Inactive)):status]
```
## Start Date
`INPUT[date:start-date]`
## End Date
`INPUT[date:end-date]`
## Description
`INPUT[textArea:description]`
```

**Inputs Provided**:
| Input | Type | Binds To |
|-------|------|----------|
| Client | suggester (via `active-suggester.js` module) | `client` frontmatter |
| Status | select (Active/Inactive) | `status` frontmatter |
| Start Date | date picker | `start-date` frontmatter |
| End Date | date picker | `end-date` frontmatter |
| Description | textArea | `description` frontmatter |

**Note**: The Client field uses `meta-bind-js-view` with the shared `active-suggester.js` module to dynamically filter to only active clients. Requires JS Engine and Dataview plugins.

---

### Using Meta Bind Embeds

**Syntax**:
````markdown
```meta-bind-embed
[[component-name]]
```
````

**Key Points**:
- The link uses the file name only (not the full path)
- Component file names should be unique across the vault
- Input fields in the component bind to the embedding note's frontmatter
- Changes to the component file propagate instantly to all embedded locations

**Creating New Components**:
1. Create a new `.md` file in `utility/templates/components/`
2. Add Meta Bind inputs, buttons, or other UI elements
3. Reference the component using `meta-bind-embed` in templates or notes
4. Document the component in this section

---

## QuickAdd Configuration

### Choices (Actions)

| Choice Name | Type | Template | Folder |
|-------------|------|----------|--------|
| Meeting - Recurring | Template | Recurring Meeting - Page | meetings/recurring |
| Meeting - Single | Template | Single Meeting | meetings/single |
| Project - New | Template | New Project | projects |
| Person - New | Template | New Person | people |
| Inbox - New | Template | New Inbox Note | inbox |
| Create Project Note | Macro | (calls create-project-note.js) | - |

### Template Choice Settings

Each template choice has:
```json
{
  "type": "Template",
  "name": "Choice Name",
  "templatePath": "utility/templates/Template Name.md",
  "folder": {
    "enabled": true,
    "folders": ["target/folder"],
    "chooseWhenCreatingNote": false
  },
  "fileNameFormat": {
    "enabled": true,
    "format": "{{VALUE}}"  // Prompts for filename
  }
}
```

### Macro Choice Settings

The "Create Project Note" macro:
```json
{
  "type": "Macro",
  "name": "Create Project Note",
  "macroId": "...",
  "macro": {
    "commands": [{
      "type": "UserScript",
      "path": "utility/scripts/quickadd/create-project-note.js"
    }]
  }
}
```

## Templater Configuration

**Settings** (`.obsidian/plugins/templater-obsidian/data.json`):
```json
{
  "templates_folder": "utility/templates",
  "trigger_on_file_creation": false,
  "auto_jump_to_cursor": true,
  "enable_system_commands": false,
  "enable_folder_templates": true,
  "folder_templates": [],
  "enable_ribbon_icon": true
}
```

### Templater Syntax Reference

| Expression | Result |
|------------|--------|
| `<% tp.date.now() %>` | Current date (YYYY-MM-DD) |
| `<% tp.date.now("format") %>` | Current date in format |
| `<% tp.file.title %>` | Current file name |
| `<% tp.file.path() %>` | Current file path |
| `<%* code %>` | JavaScript execution (no output) |
| `<% await tp.system.prompt("text") %>` | User input prompt |

### Date Format Tokens

| Token | Output |
|-------|--------|
| YYYY | 4-digit year |
| MM | 2-digit month |
| DD | 2-digit day |
| HH | 24-hour |
| mm | minutes |
| ss | seconds |
| A | AM/PM |

## Creating a New Template

1. Create file in `utility/templates/`
2. Add frontmatter with required properties
3. Add body structure with sections
4. Add Templater expressions for dynamic content
5. Add QuickAdd choice in plugin settings
6. Create trigger script if needed (see scripts-automation.md)
7. Add button in relevant view if applicable

### Template Checklist

- [ ] Frontmatter includes all needed properties
- [ ] Property types defined in `.obsidian/types.json`
- [ ] QuickAdd choice created with correct folder
- [ ] Trigger script created (if button-triggered)
- [ ] View updated with creation button
- [ ] Document in this file
