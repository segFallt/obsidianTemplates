# Views & Dashboards

Reference for dashboard pages and their queries.

## Overview

Views are located in `views/` and provide live dashboards using:
- **Dataview**: SQL-like queries for metadata
- **Tasks**: Task-specific queries with filtering
- **Meta Bind**: Interactive buttons

All views use `obsidianUIMode: preview` frontmatter to prevent accidental editing.

## View Reference

### Task Query.md

**Purpose**: Central task management dashboard organized by due date

**Sections**:

| Section | Query Type | Filter |
|---------|------------|--------|
| Today | tasks | `due today`, `not done` |
| Past Due | tasks | `due before today`, `not done` |
| Tomorrow | tasks | `due tomorrow`, `not done` |
| This Week | tasks | `due this week`, `not done` |
| All Upcoming | tasks | `due after today`, `not done` |
| No Due Date or Tag | tasks | `(no due date) AND (no tags)`, `not done` |
| Completed | tasks | `done` |
| #Waiting | dataview | `!completed AND contains(tags, "#waiting")` |
| #Someday | dataview | `!completed AND contains(tags, "#someday")` |

**Query Examples**:

```markdown
# Today
> [!check] Due Today
> ```tasks
> due today
> not done
> sort by priority
> ```

# Past Due
> [!warning] Past Due
> ```tasks
> due before today
> not done
> sort by priority
> sort by due
> ```

# Tagged - #Waiting
> [!waiting] Waiting
> ```dataview
> TASK
> WHERE !completed AND contains(tags, "#waiting")
> ```
```

**Callouts Used**:
- `[!check]` - Standard task sections
- `[!warning]` - Past due (urgent)
- `[!waiting]` - Custom yellow callout (from CSS snippet)
- `[!someday]` - Custom blue callout (from CSS snippet)

**Sorting**:
- Priority: Ascending (1 = highest)
- Due date: Chronological

---

### Tasks By Tag.md

**Purpose**: View all incomplete tasks grouped by their tags

**Query**:
```markdown
> [!check] Tasks by Tag
> ```tasks
> not done
> filter by function task.tags.length > 0
> group by function task.tags
> ```
```

**Features**:
- Only shows tasks with at least one tag
- Groups tasks under each tag they belong to
- Useful for context-based task views

---

### Task Query By Project.md

**Purpose**: View tasks organized by project with sub-grouping for project notes

**Features**:
- Shows tasks from non-Complete projects (New, Active, On Hold)
- Groups tasks hierarchically by project
- Sub-groups by project notes within each project
- Completed tasks shown in a separate section per project
- **Interactive filtering** via dropdown and text search

**Query Type**: External DataviewJS script

**Script**: `utility/scripts/dataview/tasks-by-project.js`

**Frontmatter Properties**:
```yaml
---
obsidianUIMode: preview
selectedProjects: []   # Bound to multi-select filter (array)
projectFilter: ""      # Bound to text search filter
---
```

**Filter UI**:
```markdown
**Select Projects:**
```meta-bind
INPUT[listSuggester(optionQuery(#project)):selectedProjects]
```
**Search:** `INPUT[text:projectFilter]`
```

Note: `listSuggester` requires a code block, not inline syntax.

| Filter | Type | Behavior |
|--------|------|----------|
| Select Projects | Multi-select list | Shows all #project files, filters to selected projects |
| Search | Text | Fuzzy matches project names (case-insensitive) |

**DataviewJS Call**:
```markdown
```dataviewjs
const page = dv.current();
await dv.view("scripts/dataview/tasks-by-project", {
  selectedProjects: page.selectedProjects,
  projectFilter: page.projectFilter
})
```
```

Frontmatter values are passed explicitly to the external script. See [scripts-automation.md](./scripts-automation.md#tasks-by-projectjs) for full script documentation

---

### Projects.md

**Purpose**: Project portfolio dashboard with status-based views

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Project
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_project.js
```
```

**Sections**:

#### Active Projects
```dataview
TABLE WITHOUT ID
file.link AS "Project", priority as "P", start-date as "Start Date"
FROM #project AND !"utility"
WHERE status = "Active"
SORT priority ASC, file.mtime DESC
```

#### On Hold Projects
```dataview
TABLE WITHOUT ID
file.link AS "Project", priority as "P", start-date as "Start Date", file.mtime as "Mod Date"
FROM #project AND !"utility"
WHERE status = "On Hold"
SORT priority ASC, file.mtime DESC
```

#### New Projects
```dataview
TABLE WITHOUT ID
file.link AS "Project", priority as "P"
FROM #project AND !"utility"
WHERE status = "New"
SORT priority ASC, status ASC, file.mtime DESC
```

#### Complete Projects
```dataview
TABLE WITHOUT ID
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE (status = "Complete" ) OR (end-date != null AND end-date != "")
SORT end-date DESC
```

**Key Query Patterns**:
- `FROM #project AND !"utility"` - All #project tagged files, excluding utility folder
- `TABLE WITHOUT ID` - Hide file path column
- `file.link AS "Project"` - Clickable link with alias
- `priority as "P"` - Short column header

---

### Inbox.md

**Purpose**: Quick capture processing dashboard

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Inbox Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_inbox_note.js
```
```

**Sections**:

#### Active
```dataview
TABLE WITHOUT ID
file.link AS "Item", file.ctime as "Created", file.mtime as "Last Modified"
FROM "inbox"
WHERE status != "Complete"
SORT file.mtime DESC
```

#### Inactive
```dataview
TABLE WITHOUT ID
file.link AS "Item", file.ctime as "Created", file.mtime as "Last Modified"
FROM "inbox"
WHERE status = "Complete"
SORT file.mtime DESC
```

**Key Query Patterns**:
- `FROM "inbox"` - Only files in inbox folder
- `file.ctime` - File creation time
- `file.mtime` - File modification time

---

### Recurring Meeting Index.md

**Purpose**: Track recurring meeting series

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Recurring Meeting
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_meeting_recurring.js
```
```

**Sections**:

#### Active (No end date)
```dataview
TABLE WITHOUT ID
file.link AS "Meeting", start-date as "Start Date", file.mtime as "Modified"
FROM "meetings/recurring"
WHERE (end-date = null OR end-date = "")
SORT file.mtime DESC
```

#### Past (Has end date)
```dataview
TABLE WITHOUT ID
file.link AS "Meeting", start-date as "Start Date", end-date as "End Date"
FROM "meetings/recurring"
WHERE (end-date != null AND end-date != "")
SORT end-date DESC
```

**Key Query Patterns**:
- Null/empty check: `end-date = null OR end-date = ""`
- Non-null check: `end-date != null AND end-date != ""`

---

### Single Meeting Index.md

**Purpose**: Track one-time meetings

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Single Meeting
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_meeting_single.js
```
```

**Query**:
```dataview
TABLE WITHOUT ID
file.link AS "Meeting", date as "Date"
FROM "meetings/single"
SORT date DESC, time DESC
```

---

### Task Dashboard.md

**Purpose**: Advanced task management with interactive filtering, sorting, and multiple view modes

**Features**:
- Multiple view modes: Context, Due Date, Priority, Tag
- **Sorting**: Sort by Due Date or Priority (ascending/descending)
- **Collapsible filter panels**: Filters organized into expandable sections
- **Context-specific filters**: Project status, Inbox status, Meeting date
- Interactive filters: Context, Due Date, Priority, Search, Show Completed
- Groups tasks hierarchically by source file within each category
- Clear Filters button to reset all filters and sorting

**Query Type**: External DataviewJS script

**Script**: `utility/scripts/dataview/tasks-dashboard.js`

**Frontmatter Properties**:
```yaml
---
obsidianUIMode: preview
viewMode: context          # context | date | priority | tag
sortBy: none               # none | dueDate-asc | dueDate-desc | priority-asc | priority-desc
contextFilter: []          # Array of contexts to show
dueDateFilter: All         # All | Today | This Week | Overdue | No Date
priorityFilter: []         # Array of priority levels (1-5)
showCompleted: false       # Whether to include completed tasks
searchFilter: ""           # Text search filter
projectStatusFilter: []    # Array of project statuses (New, Active, On Hold)
inboxStatusFilter: All     # All | Active | Inactive
meetingDateFilter: All     # All | Today | This Week | Past
clientFilter: []           # Array of clients (includes (Unassigned) option)
engagementFilter: []       # Array of engagements (includes (Unassigned) option)
---
```

**View Modes**:

| Mode | Grouping | Description |
|------|----------|-------------|
| Context | By source folder | Groups by Project, Person, Meeting, Inbox, Daily Notes |
| Due Date | By date category | Overdue, Today, Tomorrow, This Week, Upcoming, No Date |
| Priority | By priority level | Urgent (1), High (2), Medium (3), Low (4), Someday (5) |
| Tag | By task tags | Groups under each tag, plus Untagged section |

**Sorting (Context Mode)**:

When sorting is enabled in Context mode, the dashboard performs full hierarchy sorting:

1. **Context groups** are reordered based on the "best" task within each context
2. **Files within each context** are reordered similarly
3. **Tasks within each file** are sorted by the selected criteria

| Sort Option | Behavior |
|-------------|----------|
| None | Default order (no sorting) |
| Due Date ↑ | Earliest due dates first; contexts/files with soonest tasks bubble up |
| Due Date ↓ | Latest due dates first; contexts/files with latest tasks bubble up |
| Priority ↑ | Highest priority (1=Urgent) first |
| Priority ↓ | Lowest priority (5=Someday) first |

**Tasks without due dates** are sorted to the end (ascending) or beginning (descending).

**Context-Specific Filters**:

These filters only apply when `viewMode: context` and only affect their respective context types:

| Property | Affects | Values | Behavior |
|----------|---------|--------|----------|
| `clientFilter` | All tasks | Client names, (Unassigned) | Filters by client (directly or via engagement) |
| `engagementFilter` | All tasks | Engagement names, (Unassigned) | Filters by engagement property |
| `projectStatusFilter` | Project tasks | New, Active, On Hold | Filter by project's status property |
| `inboxStatusFilter` | Inbox tasks | All, Active, Inactive | Active = status ≠ Complete |
| `meetingDateFilter` | Meeting tasks | All, Today, This Week, Past | Filter by meeting's date property |

**Client/Engagement Filtering**:
- Client filter derives client from engagement if not directly set on task
- Selecting "(Unassigned)" shows tasks without client/engagement
- Multiple clients/engagements can be selected simultaneously
- Tasks from other contexts pass through unfiltered

**Collapsible Filter Panels**:

Filters are organized into collapsible callouts using Obsidian's syntax:

```markdown
> [!filter]- Panel Title
> Filter content here...
```

The `-` suffix creates a collapsed-by-default callout. Panels:
- **Context Filters**: Context type, client, engagement, project status, inbox status, meeting date
- **Date Filters**: Due date range
- **Priority Filters**: Priority levels

**Filter UI**:
```markdown
**View Mode:**
```meta-bind
INPUT[inlineSelect(option(context, Context), option(date, Due Date), option(priority, Priority), option(tag, Tag)):viewMode]
```

**Sort By:**
```meta-bind
INPUT[inlineSelect(option(none, None), option(dueDate-asc, Due Date ↑), option(dueDate-desc, Due Date ↓), option(priority-asc, Priority ↑), option(priority-desc, Priority ↓)):sortBy]
```

**Search:** `INPUT[text:searchFilter]`

**Show Completed:** `INPUT[toggle:showCompleted]`

> [!filter]- Context Filters
> **Context Type:** `INPUT[multiSelect(...):contextFilter]`
> **Project Status:** `INPUT[multiSelect(...):projectStatusFilter]`
> **Inbox Status:** `INPUT[inlineSelect(...):inboxStatusFilter]`
> **Meeting Date:** `INPUT[inlineSelect(...):meetingDateFilter]`

> [!filter]- Date Filters
> **Due Date:** `INPUT[inlineSelect(...):dueDateFilter]`

> [!filter]- Priority Filters
> **Priority:** `INPUT[multiSelect(...):priorityFilter]`
```

**Clear Filters Button**:
```markdown
```meta-bind-button
style: default
label: Clear Filters
actions:
  - type: updateMetadata
    bindTarget: contextFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: dueDateFilter
    value: "All"
  - type: updateMetadata
    bindTarget: priorityFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: searchFilter
    value: ""
  - type: updateMetadata
    bindTarget: showCompleted
    evaluate: true
    value: "false"
  - type: updateMetadata
    bindTarget: sortBy
    value: "none"
  - type: updateMetadata
    bindTarget: projectStatusFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: inboxStatusFilter
    value: "All"
  - type: updateMetadata
    bindTarget: meetingDateFilter
    value: "All"
```
```

**DataviewJS Call**:
```markdown
```dataviewjs
const page = dv.current();
await dv.view("scripts/dataview/tasks-dashboard", {
  viewMode: page.viewMode,
  contextFilter: page.contextFilter,
  dueDateFilter: page.dueDateFilter,
  priorityFilter: page.priorityFilter,
  showCompleted: page.showCompleted,
  searchFilter: page.searchFilter,
  sortBy: page.sortBy,
  projectStatusFilter: page.projectStatusFilter,
  inboxStatusFilter: page.inboxStatusFilter,
  meetingDateFilter: page.meetingDateFilter
});
```
```

**Context Detection Logic**:
Tasks are assigned to contexts based on file path:
- `projects/` or `projects/notes/` → Project
- `people/` → Person
- `meetings/single/` or `meetings/recurring/` → Meeting
- `inbox/` → Inbox
- `daily notes/` → Daily Notes
- Other paths → Other

**Priority Detection**:
Uses Obsidian Tasks emoji format:
- ⏫ = Urgent (1)
- 🔼 = High (2)
- (no emoji) = Medium (3)
- 🔽 = Low (4)
- ⏬ = Someday (5)

**Sorting Implementation**:
The script uses helper functions for sorting:
- `getGroupSortKey(tasks, sortBy)`: Calculates a sort key for a group of tasks based on the "best" task (earliest/latest date or highest/lowest priority)
- `sortTasks(tasks, sortBy)`: Sorts an array of tasks by the specified criteria
- `renderByContext()` builds sortable groups at each level before rendering

See [scripts-automation.md](./scripts-automation.md#tasks-dashboardjs) for full script documentation.

---

### People.md

**Purpose**: People/contacts dashboard

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Person
id: create-person
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_person.js
```
```

**Sections**:

#### Active People
Embedded from `People Base.base#people_active`
- Filters: `file.inFolder("people")`, `file.hasTag("person")`, `status == "Active"`
- Columns: Name, Title
- Sort: Name ascending

#### All People
Embedded from `People Base.base#people_all`
- Filters: `file.inFolder("people")`, `file.hasTag("person")`
- Columns: Name, Title, Status
- Sort: Name ascending

**Base File**: `views/People Base.base`

---

### Clients.md

**Purpose**: Client management dashboard for consulting/contracting workflows

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Client
id: create-client
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_client.js
```
```

**Sections**:

#### Active Clients
Embedded from `Clients Base.base#clients_active`
- Filters: `file.inFolder("clients")`, `file.hasTag("client")`, `status == "Active"`
- Columns: Name, Contact Name, Contact Email
- Sort: Name ascending

#### Inactive Clients
Embedded from `Clients Base.base#clients_inactive`
- Filters: `file.inFolder("clients")`, `file.hasTag("client")`, `status == "Inactive"`
- Columns: Name, Contact Name, Contact Email
- Sort: Name ascending

**Base File**: `views/Clients Base.base`

**Related Views**:
- Client pages show linked engagements via `client-engagements-table.js`
- Client pages show linked people via `client-people-table.js`

---

### Engagements.md

**Purpose**: Engagement tracking dashboard for client projects/contracts

**Button**:
```markdown
```meta-bind-button
style: primary
label: New Engagement
id: create-engagement
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_engagement.js
```
```

**Sections**:

#### Active Engagements
Embedded from `Engagements Base.base#engagements_active`
- Filters: `file.inFolder("engagements")`, `file.hasTag("engagement")`, `status == "Active"`
- Columns: Name, Client, Start Date, End Date
- Sort: Name ascending

#### Inactive Engagements
Embedded from `Engagements Base.base#engagements_inactive`
- Filters: `file.inFolder("engagements")`, `file.hasTag("engagement")`, `status == "Inactive"`
- Columns: Name, Client, Start Date, End Date
- Sort: Name ascending

**Base File**: `views/Engagements Base.base`

**Related Views**:
- Engagement pages show linked projects via `engagement-projects-table.js`
- Projects, meetings, inbox items, and daily notes can be scoped to engagements
- Task Dashboard can filter by client and engagement

**Hierarchy**:
```
Client (1) → Engagements (N) → Projects, Meetings, Inbox, Daily Notes (N)
Client (1) → People (N)  [People link to Client only, not Engagement]
```

---

## Query Reference

### Tasks Plugin Queries

```tasks
# Filter by date
due today
due tomorrow
due this week
due before today
due after today
no due date

# Filter by status
not done
done

# Filter by tags
has tag
no tags
filter by function task.tags.length > 0

# Compound filters
(no due date) AND (no tags)
!completed AND contains(tags, "#waiting")

# Sorting
sort by priority
sort by due
sort by created

# Grouping
group by function task.tags
group by due
group by filename
```

### Dataview Queries

```dataview
# Basic table
TABLE property1, property2
FROM "folder" OR #tag
WHERE condition
SORT field ASC/DESC

# Table without ID column
TABLE WITHOUT ID
file.link AS "Name", ...

# Task queries
TASK
WHERE !completed AND contains(tags, "#tag")

# File metadata
file.link    - Clickable link
file.name    - Filename
file.folder  - Folder path
file.ctime   - Creation time
file.mtime   - Modification time

# Filters
WHERE status = "Active"
WHERE priority < 3
WHERE (end-date = null OR end-date = "")

# Sources
FROM "folder"
FROM #tag
FROM [[Link]]
FROM "folder" AND #tag
FROM #tag AND !"exclude"
```

### Meta Bind Buttons

```markdown
```meta-bind-button
style: primary           # primary | default | destructive
label: Button Text
id: unique-id
action:
  type: js               # js | command | open | input
  file: path/to/script.js
```
```

---

## Creating a New View

1. Create file in `views/` folder
2. Add frontmatter:
   ```yaml
   ---
   obsidianUIMode: preview
   ---
   ```
3. Add button for related creation action
4. Add dataview/tasks queries
5. Use callouts for visual organization
6. Add to bookmarks in `.obsidian/bookmarks.json`
7. Document in this file

### View Checklist

- [ ] `obsidianUIMode: preview` in frontmatter
- [ ] Creation button with trigger script
- [ ] Queries filter correctly (test with sample data)
- [ ] Appropriate sorting (priority, date, etc.)
- [ ] Clear section headers
- [ ] Added to bookmarks group
- [ ] Documented here
