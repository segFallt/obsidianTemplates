---
obsidianUIMode: preview
---

```button
name New Meeting
type command
action QuickAdd: Meeting - Single
color default
```

```dataview
TABLE WITHOUT ID 
file.link AS "Meeting", date as "Date"
FROM "meetings/single"
SORT date DESC, time DESC
```

