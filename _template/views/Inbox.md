---
obsidianUIMode: preview
---

```button
name New Inbox Note
type command
action QuickAdd: Inbox - New
color default
```

# Active
```dataview
TABLE WITHOUT ID 
file.link AS "Item", file.ctime as "Created", file.mtime as "Last Modified" 
FROM "inbox"
WHERE status != "Complete"
SORT file.mtime DESC
```

---

# Inactive
```dataview
TABLE WITHOUT ID 
file.link AS "Item", file.ctime as "Created", file.mtime as "Last Modified" 
FROM "inbox"
WHERE status = "Complete"
SORT file.mtime DESC
```