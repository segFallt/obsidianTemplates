---
notesDirectory: projects/notes
start-date: <% tp.date.now() %>
end-date: 
status: Active
tags:
  - "#project"
---

# Project Related Notes
```meta-bind-button
style: primary
label: New Project Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_project_note.js
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
