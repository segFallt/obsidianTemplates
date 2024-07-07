---
obsidianUIMode: preview
---

```meta-bind-button
style: primary
label: New Single Meeting
id: create-project-note
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_meeting_single.js
```

```dataview
TABLE WITHOUT ID 
file.link AS "Meeting", date as "Date"
FROM "meetings/single"
SORT date DESC, time DESC
```

