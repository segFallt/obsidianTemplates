---
obsidianUIMode: preview
---
# Active
```dataview
TABLE WITHOUT ID 
file.link AS "Meeting", start-date as "Start Date", file.mtime as "Modified"
FROM "meetings/recurring"
WHERE (end-date = null OR end-date = "")
SORT file.mtime DESC
```


# Past
```dataview
TABLE WITHOUT ID 
file.link AS "Meeting", start-date as "Start Date", end-date as "End Date"
FROM "meetings/recurring"
WHERE (end-date != null AND end-date != "")
SORT end-date DESC
```


