---
obsidianUIMode: preview
---
```meta-bind-button
style: primary
label: New Project
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
SORT status ASC, file.mtime DESC
```
# On Hold Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE status = "On Hold"
SORT status ASC, file.mtime DESC
```
# New Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE status = "New"
SORT status ASC, file.mtime DESC
```
# Complete Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE (status = "Complete" ) OR (end-date != null AND end-date != "")
SORT end-date DESC
```

