---
notesDirectory: projects/notes
start-date: <% tp.date.now() %>
end-date: 
status: New
tags:
  - "#project"
priority:
---
# Properties
## Start Date
`INPUT[date:start-date]`
## End Date
`INPUT[date:end-date]`
## Priority
```meta-bind
INPUT[select(option(1), option(2), option(3), option(4), option(5)):priority]
```
## Status
```meta-bind
INPUT[select(option(New), option(Active), option(On Hold), option(Complete)):status]
```

---
# Notes


---
# Linked
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

