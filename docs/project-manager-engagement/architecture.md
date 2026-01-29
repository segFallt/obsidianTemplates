# Architecture

System design, data flow, and component relationships.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Obsidian Vault                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │   Views     │    │  Templates  │    │   Scripts   │             │
│  │ (Dashboards)│    │ (Templater) │    │(QuickAdd/JS)│             │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘             │
│         │                  │                   │                    │
│         ▼                  ▼                   ▼                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Plugin Layer                              │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │   │
│  │  │Dataview │ │  Tasks  │ │QuickAdd │ │Templater│ │MetaBind│ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│         │                  │                   │                    │
│         ▼                  ▼                   ▼                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Content Layer                             │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌────────┐ │   │
│  │  │Projects │ │  Inbox  │ │Meetings │ │ People  │ │  Daily │ │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Relationships

### View → Query → Content Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  View File   │────▶│ Query Engine │────▶│Content Files │
│  (Projects)  │     │  (Dataview)  │     │  (#project)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │
       │                    ▼
       │             ┌──────────────┐
       └────────────▶│  Meta Bind   │
                     │  (Buttons)   │
                     └──────────────┘
```

### Button → Script → Template Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Meta Bind    │────▶│   Trigger    │────▶│   QuickAdd   │
│   Button     │     │   Script     │     │   Choice     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                     ┌──────────────┐     ┌──────────────┐
                     │  New Note    │◀────│  Templater   │
                     │  Created     │     │   Template   │
                     └──────────────┘     └──────────────┘
```

### Project Note Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ User clicks "New Project Note" button in Project file          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Meta Bind executes: trigger_quickadd_create_project_note.js    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Script calls QuickAdd API: executeChoice("Create Project Note")│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ QuickAdd macro runs: create-project-note.js                    │
│ - Reads notesDirectory from active file frontmatter            │
│ - Prompts for note name                                        │
│ - Creates note from Project Note.md template                   │
│ - Updates frontmatter with relatedProject link                 │
│ - Opens new note in tab                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ Result: New note in projects/notes/ with [[Parent Project]]    │
│ Parent project shows note in "Related Notes" dataview table    │
└─────────────────────────────────────────────────────────────────┘
```

## Data Model

### Entity Relationships

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Client    │──────▶│ Engagement  │──────▶│   Project   │
│  (#client)  │ 1:N   │(#engagement)│ 1:N   │  (#project) │
└─────────────┘       └─────────────┘       └──────┬──────┘
      │                     │                      │
      │ 1:N                 │ 1:N                  │ 1:N
      ▼                     ▼                      ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Person    │       │   Meeting   │       │Project Note │
│  (people/)  │       │ (meetings/) │       │(relatedProj)│
└─────────────┘       └─────────────┘       └─────────────┘
                            │                      │
                            │                      │ contains
                            ├──────────────────────┤
                            ▼                      ▼
                      ┌─────────────┐
                      │    Tasks    │
                      │  (checkbox) │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│  Recurring  │──────▶│Daily Entry  │
│  Meeting    │ 1:N   │ (embedded)  │
└─────────────┘       └─────────────┘

Notes:
- Client → Engagement (1:N): A client can have multiple engagements
- Client → Person (1:N): People are linked to clients only, not engagements
- Engagement → Project (1:N): An engagement can have multiple projects
- Engagement → Meeting (1:N): Meetings can be scoped to engagements
- Engagement → Inbox (1:N): Inbox items can be scoped to engagements
- Engagement → Daily Notes (1:N): Daily notes can be scoped to engagements
```

### Metadata Schema

```
Client
├── status: enum [Active, Inactive]
├── contact-name: string
├── contact-email: string
├── contact-phone: string
├── notes: string
└── tags: array [#client]

Engagement
├── client: link [[Client]]
├── status: enum [Active, Inactive]
├── start-date: date
├── end-date: date
├── description: string
└── tags: array [#engagement]

Project
├── engagement: link [[Engagement]]
├── notesDirectory: string (path)
├── start-date: date
├── end-date: date
├── status: enum [New, Active, On Hold, Complete]
├── priority: number [1-5]
└── tags: array [#project]

Project Note
├── engagement: link [[Engagement]] (inherited from parent)
└── relatedProject: link [[Project]]

Inbox Note
├── engagement: link [[Engagement]]
└── status: enum [Active, Complete]

Person
├── client: link [[Client]]
├── status: string
├── title: string
└── reports-to: string

Single Meeting
├── engagement: link [[Engagement]]
└── date: datetime

Recurring Meeting
├── engagement: link [[Engagement]]
├── start-date: date
└── end-date: date

Daily Note
└── engagement: link [[Engagement]]
```

## Plugin Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                        Core Plugins                              │
│  daily-notes, bookmarks, properties, file-explorer              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Query Layer                                  │
│                                                                 │
│  ┌─────────────┐              ┌─────────────┐                   │
│  │  Dataview   │              │    Tasks    │                   │
│  │ (metadata)  │              │ (checkboxes)│                   │
│  └─────────────┘              └─────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Automation Layer                               │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Templater  │  │  QuickAdd   │  │  Meta Bind  │             │
│  │ (templates) │  │  (actions)  │  │ (buttons)   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│                   ┌─────────────┐                               │
│                   │  JS Engine  │                               │
│                   │  (scripts)  │                               │
│                   └─────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Support Layer                                 │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │Tag Wrangler │  │Force View   │  │  Iconize    │             │
│  │ (tag mgmt)  │  │(preview)    │  │  (icons)    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │  Projects   │  │Adv Tables   │                              │
│  │ (kanban)    │  │(editing)    │                              │
│  └─────────────┘  └─────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Organization Pattern

```
Content Files (User-Created)
│
├── inbox/              ← Capture first
│   └── *.md
│
├── projects/           ← Organize & track
│   ├── *.md           (Project files)
│   └── notes/         (Sub-documents)
│       └── *.md
│
├── meetings/           ← Document interactions
│   ├── recurring/
│   └── single/
│
├── people/             ← Contact management
│   └── *.md
│
├── reference/          ← Static reference
│   └── *.md
│
└── daily notes/        ← Daily journal
    └── YYYY-MM-DD.md

System Files (Template-Managed)
│
├── views/              ← Dashboard pages
│   └── *.md
│
└── utility/            ← Automation
    ├── templates/
    │   └── *.md
    └── scripts/
        ├── quickadd/
        ├── dataview/
        └── meta-bind/
```

## Workflow States

### Project Lifecycle

```
    ┌─────┐
    │ New │
    └──┬──┘
       │
       ▼
   ┌───────┐    ┌─────────┐
   │Active │◀──▶│ On Hold │
   └───┬───┘    └─────────┘
       │
       ▼
  ┌──────────┐
  │ Complete │
  └──────────┘
```

### Task Lifecycle

```
    ┌──────┐
    │ Todo │ (space)
    └──┬───┘
       │
       ├────────────▶ ┌─────────────┐
       │              │ In Progress │ (/)
       │              └──────┬──────┘
       │                     │
       ▼                     ▼
   ┌───────────┐        ┌──────┐
   │ Cancelled │        │ Done │ (x)
   └───────────┘ (-)    └──────┘
```

### Inbox Processing

```
┌─────────┐    ┌─────────┐    ┌───────────────────────┐
│ Capture │───▶│ Process │───▶│ Move to:              │
│ (inbox) │    │ (review)│    │ - projects/           │
└─────────┘    └─────────┘    │ - meetings/           │
                              │ - people/             │
                              │ - reference/          │
                              │ - delete              │
                              │ - mark Complete       │
                              └───────────────────────┘
```

## Extension Points

### Adding New Note Type

1. **Template**: Create in `utility/templates/`
2. **QuickAdd Choice**: Add in plugin settings
3. **Trigger Script**: Create in `utility/scripts/quickadd/`
4. **View**: Create or update in `views/`
5. **Folder**: Create if new category
6. **Property Types**: Define in `.obsidian/types.json`

### Adding New View

1. **Query Design**: Determine dataview/tasks queries
2. **Button**: Link to creation script
3. **Sections**: Organize by status/date/priority
4. **Bookmark**: Add to Common Views group
5. **Workspace**: Consider default tab

### Adding New Script

1. **Script File**: Create in appropriate `utility/scripts/` subfolder
2. **QuickAdd Integration**: Create choice/macro if needed
3. **Button Integration**: Add to templates/views
4. **Error Handling**: Include notices for failures
5. **Documentation**: Update scripts-automation.md

### Adding New Plugin

1. **Installation**: Install via Obsidian
2. **Configuration**: Set options in plugin settings
3. **Integration**: Connect to existing workflows
4. **Git Tracking**: Commit plugin folder
5. **Documentation**: Update plugins-configuration.md

## Configuration Files Map

```
.obsidian/
├── app.json                    ← Core app settings
├── appearance.json             ← Theme, CSS snippets
├── bookmarks.json              ← Bookmarked files
├── community-plugins.json      ← Enabled plugins list
├── core-plugins.json           ← Core plugins on/off
├── daily-notes.json            ← Daily notes config
├── graph.json                  ← Graph view settings
├── templates.json              ← Core templates folder
├── types.json                  ← Custom property types
├── workspace.json              ← Layout, tabs, sidebars
│
├── plugins/
│   ├── dataview/data.json      ← Query settings
│   ├── obsidian-tasks-plugin/data.json ← Task symbols
│   ├── quickadd/data.json      ← Choices, macros
│   ├── templater-obsidian/data.json ← Template folder
│   ├── obsidian-meta-bind-plugin/data.json ← Inputs
│   ├── obsidian-projects/data.json ← Project boards
│   └── .../
│
└── snippets/
    ├── callout_waiting.css
    ├── callout_calendar.css
    └── callout_someday.css
```
