# Obsidian Templates

## Client-Engagement-Project Hierarchy

The vault uses a three-level hierarchy to organise work:

```
Client
  └── Engagement
        └── Project
```

- **Client** (`clients/` folder, `#client` tag): The organisation or individual you are working with.
- **Engagement** (`engagements/` folder, `#engagement` tag): A contract, retainer, or scope of work under a client.
- **Project** (`projects/` folder, `#project` tag): A discrete unit of work delivered within an engagement.

### Establishing Relationships

Relationships are set via frontmatter wikilinks on the child entity:

| Child entity | Frontmatter property | Points to |
|---|---|---|
| Engagement | `client` | `[[Client Name]]` |
| Project | `engagement` | `[[Engagement Name]]` |

When you create a project via the **Project - New** QuickAdd action, it prompts you to select an active engagement and writes the `engagement` link automatically.

### Auto-Populating Relationship Tables

Each entity page displays a table of its children, populated automatically by Dataview render scripts:

| Page | Script | Table shown |
|---|---|---|
| Client | `client-engagements-table.js` | Engagements linked to this client |
| Client | `client-people-table.js` | People linked to this client |
| Engagement | `engagement-projects-table.js` | Projects linked to this engagement |

The tables update in real time as you add or modify frontmatter links — no manual maintenance required.

---

## Task Views and Filtering

### Task Query By Project

The **Task Query By Project** view (`views/Task Query By Project.md`) provides powerful filtering options to help you focus on the tasks that matter:

#### Available Filters

1. **Filter by Projects**: Multi-select dropdown to choose specific projects
2. **Search**: Text search to fuzzy-match project names (case-insensitive)
3. **Filter by Project Status**: Select which project statuses to show (New, Active, On Hold, Complete)
4. **Show Completed Tasks**: Toggle to display completed tasks within each project
5. **Client Filter**: Filter projects by client (directly assigned or via engagement)
6. **Engagement Filter**: Filter projects by engagement

#### Client and Engagement Filtering

The Client and Engagement filters are located in a collapsible panel and offer advanced filtering capabilities:

- **Client Filter**:
  - Use the suggester to select one or more clients from your vault (type to search)
  - Toggle "Include Unassigned Clients" to show projects without a client
  - If a project doesn't have a direct client but has an engagement, the client is derived from the engagement

- **Engagement Filter**:
  - Use the suggester to select one or more engagements from your vault (type to search)
  - Toggle "Include Unassigned Engagements" to show projects without an engagement

- **Combined Filtering**:
  - When both client and engagement filters are active, projects must match **both** criteria (AND logic)
  - You can select multiple clients or engagements within each filter (OR logic within the same filter)
  - The toggles work independently - you can show unassigned clients without selecting specific clients, or combine them

#### Clear Filters

Use the **Clear Filters** button to reset all filters to their default values:
- Clears project selection
- Clears search text
- Resets status to "Active"
- Clears client and engagement filters
- Resets "Include Unassigned" toggles to off

### Task Dashboard

The **Task Dashboard** view (`views/Task Dashboard.md`) also includes client and engagement filtering with the same capabilities described above. These filters work across all view modes (Context, Due Date, Priority, Tag).

For more detailed technical documentation, see:
- [Views & Dashboards Documentation](./docs/project-manager-engagement/views-dashboards.md)
- [Scripts & Automation Documentation](./docs/project-manager-engagement/scripts-automation.md)
