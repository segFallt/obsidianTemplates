---
obsidianUIMode: preview
selectedProjects: []
projectFilter: ""
selectedStatuses:
  - Active
showCompletedTasks: false
clientFilter: []
engagementFilter: []
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
> INPUT[multiSelect(optionQuery(#client), option((Unassigned))):clientFilter]
> ```
>
> **Engagement:**
> ```meta-bind
> INPUT[multiSelect(optionQuery(#engagement), option((Unassigned))):engagementFilter]
> ```

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
  engagementFilter: page.engagementFilter
})
```
