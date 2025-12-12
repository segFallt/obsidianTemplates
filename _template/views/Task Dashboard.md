---
obsidianUIMode: preview
viewMode: context
contextFilter: []
dueDateFilter: All
priorityFilter: []
showCompleted: false
searchFilter: ""
---

# Task Dashboard

## Filters

**View Mode:**
```meta-bind
INPUT[inlineSelect(option(context, Context), option(date, Due Date), option(priority, Priority), option(tag, Tag)):viewMode]
```

**Context:**
```meta-bind
INPUT[multiSelect(option(Project), option(Person), option(Meeting), option(Inbox), option(Daily Notes)):contextFilter]
```

**Due Date:**
```meta-bind
INPUT[inlineSelect(option(All), option(Today), option(This Week), option(Overdue), option(No Date)):dueDateFilter]
```

**Priority:**
```meta-bind
INPUT[multiSelect(option(1, Urgent), option(2, High), option(3, Medium), option(4, Low), option(5, Someday)):priorityFilter]
```

**Search:** `INPUT[text:searchFilter]`

**Show Completed:** `INPUT[toggle:showCompleted]`

```meta-bind-button
style: default
label: Clear Filters
actions:
  - type: updateMetadata
    bindTarget: contextFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: dueDateFilter
    evaluate: false
    value: "All"
  - type: updateMetadata
    bindTarget: priorityFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: searchFilter
    evaluate: false
    value: ""
  - type: updateMetadata
    bindTarget: showCompleted
    evaluate: true
    value: "false"
```

---

## Tasks

```dataviewjs
const page = dv.current();
await dv.view("scripts/dataview/tasks-dashboard", {
  viewMode: page.viewMode,
  contextFilter: page.contextFilter,
  dueDateFilter: page.dueDateFilter,
  priorityFilter: page.priorityFilter,
  showCompleted: page.showCompleted,
  searchFilter: page.searchFilter
});
```
