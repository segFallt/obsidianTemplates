---
obsidianUIMode: preview
---


# Today
> [!check] Due Today
> ```tasks
> due today
> not done
> sort by priority
> ```

# Past Due
> [!warning] Past Due
> ```tasks
> due before today
> not done
> sort by priority
> sort by due
> ```

# Tomorrow
> [!check] Due Tomorrow
> ```tasks
> due tomorrow
> not done
> ```

## Next 7 Days
> [!check] Next 7 Days
> ```tasks
> (due today) OR ((due after today) AND (due before in 8 days))
> not done
> sort by due
> sort by priority
> ```

# All Upcoming
> [!check] Upcoming
> ```tasks
> due after today
> not done
> sort by due
> sort by priority
> ```

# No Due Date or Tag
> [!check] Upcoming
> ```tasks
> (no due date) AND (no tags)
> not done

# Completed
> [!check] Done Today
> ```tasks
> done today
> ```

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


