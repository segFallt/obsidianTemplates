---
obsidianUIMode: preview
---

```meta-bind-button
style: primary
label: Create Project Note
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_meeting_recurring.js
```

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


