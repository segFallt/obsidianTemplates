---
obsidianUIMode: preview
selectedProjects: []
projectFilter: ""
selectedStatuses:
  - Active
showCompletedTasks: false
clientFilter: []
engagementFilter: []
includeUnassignedClients: false
includeUnassignedEngagements: false
---

# Tasks By Project

**Filter by Projects:**
```meta-bind
INPUT[listSuggester(optionQuery(#project)):selectedProjects]
```
**Search:** `INPUT[text:projectFilter]`

**Filter by Project Status:**
```meta-bind
INPUT[multiSelect(option(New), option(Active), option(On Hold), option(Complete)):selectedStatuses]
```

**Show Completed Tasks**
```meta-bind
INPUT[toggle:showCompletedTasks]
```

> [!filter]- Client/Engagement Filters
> **Client:**
> ```meta-bind
> INPUT[inlineListSuggester(optionQuery(#client)):clientFilter]
> ```
> **Include Unassigned Clients:** `INPUT[toggle:includeUnassignedClients]`
>
> **Engagement:**
> ```meta-bind
> INPUT[inlineListSuggester(optionQuery(#engagement)):engagementFilter]
> ```
> **Include Unassigned Engagements:** `INPUT[toggle:includeUnassignedEngagements]`

```meta-bind-button
style: destructive
label: Clear Filters
actions:
  - type: updateMetadata
    bindTarget: selectedProjects
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: projectFilter
    evaluate: false
    value: ""
  - type: updateMetadata
    bindTarget: selectedStatuses
    evaluate: true
    value: '["Active"]'
  - type: updateMetadata
    bindTarget: clientFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: engagementFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: includeUnassignedClients
    evaluate: true
    value: "false"
  - type: updateMetadata
    bindTarget: includeUnassignedEngagements
    evaluate: true
    value: "false"
```

---

```dataviewjs
const page = dv.current();
await dv.view("scripts/dataview/tasks-by-project", {
  selectedProjects: page.selectedProjects,
  projectFilter: page.projectFilter,
  selectedStatuses: page.selectedStatuses,
  showCompleted: page.showCompletedTasks,
  clientFilter: page.clientFilter,
  engagementFilter: page.engagementFilter,
  includeUnassignedClients: page.includeUnassignedClients,
  includeUnassignedEngagements: page.includeUnassignedEngagements
})
```
