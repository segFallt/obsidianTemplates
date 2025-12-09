---
obsidianUIMode: preview
selectedProjects: []
projectFilter: ""
selectedStatuses:
  - Active
showCompletedTasks: false
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
```

---

```dataviewjs
const page = dv.current();
await dv.view("scripts/dataview/tasks-by-project", {
  selectedProjects: page.selectedProjects,
  projectFilter: page.projectFilter,
  selectedStatuses: page.selectedStatuses,
  showCompleted: page.showCompletedTasks
})
```
