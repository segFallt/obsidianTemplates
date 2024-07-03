---
notesDirectory: projects/notes
start-date: <% tp.date.now() %>
end-date: 
status: Active
tags:
  - "#project"
---

# Project Related Notes
```button
name Add New Related Project Note
type command
action QuickAdd: Create Project Note
color default
```

```dataview
LIST
WHERE contains(relatedProject, this.file.link)
```

---

# Project Mentions
```dataviewjs
await dv.view("scripts/dataview/mentions-table", 1)
```

---
