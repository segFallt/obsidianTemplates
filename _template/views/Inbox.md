---
obsidianUIMode: preview
---
```dataview
TABLE WITHOUT ID 
file.link AS "Item", file.ctime as "Created", file.mtime as "Last Modified" 
FROM "inbox"
WHERE status != "Complete"
SORT file.mtime DESC
```



# Inactive
```dataview
TABLE WITHOUT ID 
file.link AS "Item", file.ctime as "Created", file.mtime as "Last Modified" 
FROM "inbox"
WHERE status = "Complete"
SORT file.mtime DESC
```