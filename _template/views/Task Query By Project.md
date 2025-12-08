---
obsidianUIMode: preview
selectedProjects: []
projectFilter: ""
---

# Tasks By Project

**Select Projects:**
```meta-bind
INPUT[listSuggester(optionQuery(#project)):selectedProjects]
```
**Search:** `INPUT[text:projectFilter]`

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
```

---

```dataviewjs
const page = dv.current();
await dv.view("scripts/dataview/tasks-by-project", {
  selectedProjects: page.selectedProjects,
  projectFilter: page.projectFilter
})
```
