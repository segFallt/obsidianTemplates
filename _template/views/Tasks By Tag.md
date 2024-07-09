---
obsidianUIMode: preview
---
> [!check] Tasks by Tag
> ```dataview
> TASK
> WHERE !completed AND length(tags) > 0
> SORT due DESC
> GROUP BY tags
> ```