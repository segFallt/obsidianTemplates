---
obsidianUIMode: preview
---
```meta-bind-button
style: primary
label: Create Project Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_project.js
```
# Active Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE status = "Active"
SORT file.mtime DESC
```

# Inactive Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE status != "Active" OR (end-date != null AND end-date != "")
SORT end-date DESC
```

