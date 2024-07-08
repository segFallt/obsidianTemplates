---
obsidianUIMode: preview
---

```meta-bind-button
style: primary
label: New Inbox Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_inbox_note.js
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