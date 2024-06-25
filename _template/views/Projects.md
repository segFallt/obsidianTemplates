---
obsidianUIMode: preview
---

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

