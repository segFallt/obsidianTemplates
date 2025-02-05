---
notesDirectory: projects/notes
start-date: <% tp.date.now() %>
end-date: 
status: Active
tags:
  - "#project"
priority:
---


---
```meta-bind-button
style: primary
label: New Project Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_project_note.js
```
```dataviewjs
await dv.view("scripts/dataview/related-project-note-table", 1)
```

