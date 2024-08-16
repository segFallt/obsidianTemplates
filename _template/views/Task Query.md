---
obsidianUIMode: preview
---


# Today
> [!check] Due Today
> ```tasks
> due today
> not done
> ```

# Past Due
> [!warning] Past Due
> ```tasks
> due before today
> not done
> ```

# Tomorrow
> [!check] Due Tomorrow
> ```tasks
> due tomorrow
> not done
> ```

## This Week
> [!check] This Week
> ```tasks
> due this week
> not done
> ```

# All Upcoming
> [!check] Upcoming
> ```tasks
> due after today
> not done
> ```

# No Due Date or Tag
> [!check] Upcoming
> ```tasks
> (no due date) AND (no tags)
> not done
> ```

# Completed
> [!check]- Done
> ```tasks
> done
> ```

# Tagged
## \#Waiting
> [!waiting] Waiting
> ```dataview
> TASK
> WHERE !completed AND contains(tags, "#waiting")
> ```


## \#Someday
> [!someday] Someday
> ```dataview
> TASK
> WHERE !completed AND contains(tags, "#someday")
> ```


