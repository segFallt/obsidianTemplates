---
obsidianUIMode: preview
viewMode: context
sortBy: none
contextFilter: []
dueDateFilter: All
priorityFilter: []
showCompleted: false
searchFilter: ""
projectStatusFilter: []
inboxStatusFilter: All
meetingDateFilter: All
---

# Task Dashboard

## View & Sort

**View Mode:**
```meta-bind
INPUT[inlineSelect(option(context, Context), option(date, Due Date), option(priority, Priority), option(tag, Tag)):viewMode]
```

**Sort By:**
```meta-bind
INPUT[inlineSelect(option(none, None), option(dueDate-asc, Due Date ↑), option(dueDate-desc, Due Date ↓), option(priority-asc, Priority ↑), option(priority-desc, Priority ↓)):sortBy]
```

---

## Filters

**Search:** `INPUT[text:searchFilter]`

**Show Completed:** `INPUT[toggle:showCompleted]`

> [!filter]- Context Filters
> **Context Type:**
> ```meta-bind
> INPUT[multiSelect(option(Project), option(Person), option(Meeting), option(Inbox), option(Daily Notes)):contextFilter]
> ```
>
> **Project Status:**
> ```meta-bind
> INPUT[multiSelect(option(New), option(Active), option(On Hold)):projectStatusFilter]
> ```
>
> **Inbox Status:**
> ```meta-bind
> INPUT[inlineSelect(option(All), option(Active), option(Inactive)):inboxStatusFilter]
> ```
>
> **Meeting Date:**
> ```meta-bind
> INPUT[inlineSelect(option(All), option(Today), option(This Week), option(Past)):meetingDateFilter]
> ```

> [!filter]- Date Filters
> **Due Date:**
> ```meta-bind
> INPUT[inlineSelect(option(All), option(Today), option(This Week), option(Overdue), option(No Date)):dueDateFilter]
> ```

> [!filter]- Priority Filters
> **Priority:**
> ```meta-bind
> INPUT[multiSelect(option(1, Urgent), option(2, High), option(3, Medium), option(4, Low), option(5, Someday)):priorityFilter]
> ```

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
  - type: updateMetadata
    bindTarget: sortBy
    evaluate: false
    value: "none"
  - type: updateMetadata
    bindTarget: projectStatusFilter
    evaluate: true
    value: "[]"
  - type: updateMetadata
    bindTarget: inboxStatusFilter
    evaluate: false
    value: "All"
  - type: updateMetadata
    bindTarget: meetingDateFilter
    evaluate: false
    value: "All"
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
  searchFilter: page.searchFilter,
  sortBy: page.sortBy,
  projectStatusFilter: page.projectStatusFilter,
  inboxStatusFilter: page.inboxStatusFilter,
  meetingDateFilter: page.meetingDateFilter
});
```
