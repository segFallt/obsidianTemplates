---
obsidianUIMode: preview
selectedProject:
projectFilter: ""
---

# Tasks By Project

**Select Project:** `INPUT[suggester(optionQuery(#project)):selectedProject]`
**Search:** `INPUT[text:projectFilter]`

---

```dataviewjs
await dv.view("scripts/dataview/tasks-by-project")
```
