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
file.link AS "Project", priority as "P", start-date as "Start Date"
FROM #project AND !"utility"
WHERE status = "Active"
SORT priority ASC, file.mtime DESC
```
# On Hold Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", priority as "P", start-date as "Start Date", file.mtime as "Mod Date"
FROM #project AND !"utility"
WHERE status = "On Hold"
SORT priority ASC, file.mtime DESC
```
# New Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", priority as "P"
FROM #project AND !"utility"
WHERE status = "New"
SORT priority ASC, status ASC, file.mtime DESC
```
# Complete Projects
```dataview
TABLE WITHOUT ID 
file.link AS "Project", status as "Status", start-date as "Start Date", end-date as "End Date"
FROM #project AND !"utility"
WHERE (status = "Complete" ) OR (end-date != null AND end-date != "")
SORT end-date DESC
```

