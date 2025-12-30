# Entity Reference

Complete reference for all entity types in the Gift Tracker vault.

## Individual

People profiles for gift exchange tracking.

### Location
- **Folder**: `individuals/`
- **Template**: `utility/templates/New Individual.md`
- **Properties Component**: `utility/templates/components/individual-properties.md`

### Tag
```yaml
tags:
  - "#individual"
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `tags` | list | Contains `#individual` |
| `birthday` | date | Person's birthday |
| `interests` | list | Links to Interest records |
| `notes` | text | Free-form notes |

### Frontmatter Example
```yaml
---
tags:
  - "#individual"
birthday: 2000-01-15
interests:
  - "[[Photography]]"
  - "[[Board Games]]"
notes: Prefers handmade gifts
---
```

### Meta Bind Inputs
- `birthday`: `INPUT[date:birthday]`
- `interests`: `INPUT[listSuggester(optionQuery(#interest)):interests]`
- `notes`: `INPUT[textArea:notes]`

### Views
- **Dashboard**: `views/Individuals.md`
- **Base File**: `views/Individuals Base.base`
- **Views**: `all_individuals`

### Related Content
Individual pages display related gifts via dataviewjs:
- Gifts Given (to this person)
- Gifts Received (from this person)
- Gift Ideas (for this person)

---

## Interest

Normalized interest/hobby records for tagging individuals and gift ideas.

### Location
- **Folder**: `interests/`
- **Template**: `utility/templates/New Interest.md`
- **Properties Component**: `utility/templates/components/interest-properties.md`

### Tag
```yaml
tags:
  - "#interest"
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `tags` | list | Contains `#interest` |
| `notes` | text | Details about this interest |

### Frontmatter Example
```yaml
---
tags:
  - "#interest"
notes: Enjoys landscape and portrait photography
---
```

### Meta Bind Inputs
- `notes`: `INPUT[textArea:notes]`

### Views
- **Dashboard**: `views/Interests.md`
- **Base File**: `views/Interests Base.base`
- **Views**: `all_interests`

### Usage
Interests are referenced by:
- Individuals (via `listSuggester(optionQuery(#interest))`)
- Gift Ideas (via `listSuggester(optionQuery(#interest))`)

---

## Gift Idea

Potential gift ideas with status tracking.

### Location
- **Folder**: `gifts/ideas/`
- **Template**: `utility/templates/New Gift Idea.md`
- **Properties Component**: `utility/templates/components/gift-idea-properties.md`
- **Actions Component**: `utility/templates/components/gift-actions.md`

### Tag
```yaml
tags:
  - "#gift-idea"
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `tags` | list | Contains `#gift-idea` |
| `friendlyName` | text | User-entered name (before numeral suffix) |
| `individuals` | list | Links to Individual records |
| `interests` | list | Links to Interest records |
| `occasion` | text | Target occasion |
| `estimated-cost` | number | Budget estimate |
| `url` | text | Product link |
| `status` | text | Idea / Considering / Planned |
| `notes` | text | Free-form notes |

### Frontmatter Example
```yaml
---
tags:
  - "#gift-idea"
friendlyName: Camera Lens
individuals:
  - "[[John]]"
interests:
  - "[[Photography]]"
occasion: Birthday
estimated-cost: 200
url: https://example.com/lens
status: Considering
notes: 50mm prime lens
---
```

### Meta Bind Inputs
- `individuals`: `INPUT[listSuggester(optionQuery(#individual)):individuals]`
- `interests`: `INPUT[listSuggester(optionQuery(#interest)):interests]`
- `occasion`: `INPUT[suggester(option(Birthday), ...):occasion]`
- `estimated-cost`: `INPUT[number:estimated-cost]`
- `url`: `INPUT[text:url]`
- `status`: `INPUT[select(option(Idea), option(Considering), option(Planned)):status]`
- `notes`: `INPUT[textArea:notes]`

### Views
- **Dashboard**: `views/Gift Ideas.md`
- **Base File**: `views/Gift Ideas Base.base`
- **Views**: `all_ideas`, `ideas_by_status`, `ideas_by_interest`

### Actions
- **Convert to Gift Given**: Creates a Gift Given record with copied properties

### Creation Flow
Uses `create-gift-idea.js` UserScript:
1. Prompts for gift idea name
2. Creates file with unique name (appends numeral if exists)
3. Sets `friendlyName` via `processFrontMatter`

---

## Gift Given

Records of gifts given to others.

### Location
- **Folder**: `gifts/given/`
- **Template**: `utility/templates/New Gift Given.md`
- **Properties Component**: `utility/templates/components/gift-given-properties.md`

### Tag
```yaml
tags:
  - "#gift-given"
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `tags` | list | Contains `#gift-given` |
| `friendlyName` | text | User-entered name |
| `individuals` | list | Links to Individual records (recipients) |
| `date` | date | Date gift was given |
| `occasion` | text | Occasion for the gift |
| `cost` | number | Actual cost |
| `store` | text | Where purchased |
| `url` | text | Product link |
| `notes` | text | Free-form notes |
| `from-idea` | link | Reference to original Gift Idea (if converted) |

### Frontmatter Example
```yaml
---
tags:
  - "#gift-given"
friendlyName: Camera Lens
individuals:
  - "[[John]]"
date: 2024-01-15
occasion: Birthday
cost: 189
store: Amazon
url: https://example.com/lens
notes: 50mm f/1.8 prime lens
from-idea: "[[Camera Lens]]"
---
```

### Meta Bind Inputs
- `individuals`: `INPUT[listSuggester(optionQuery(#individual)):individuals]`
- `date`: `INPUT[date:date]`
- `occasion`: `INPUT[suggester(option(Birthday), ...):occasion]`
- `cost`: `INPUT[number:cost]`
- `store`: `INPUT[text:store]`
- `url`: `INPUT[text:url]`
- `notes`: `INPUT[textArea:notes]`

### Views
- **Dashboard**: `views/Gifts Given.md`
- **Base File**: `views/Gifts Given Base.base`
- **Views**: `all_given`, `given_by_occasion`

### Creation Flow
Can be created two ways:

**Direct creation** (`create-gift-given.js`):
1. Prompts for gift name
2. Creates file with unique name
3. Sets `friendlyName` and current date

**Conversion from idea** (`convert-idea-to-given.js`):
1. Pre-populates prompt with idea's friendlyName
2. Copies: individuals, occasion, estimated-cost → cost, url, notes, store
3. Sets `from-idea` link to original idea

---

## Gift Received

Records of gifts received from others.

### Location
- **Folder**: `gifts/received/`
- **Template**: `utility/templates/New Gift Received.md`
- **Properties Component**: `utility/templates/components/gift-received-properties.md`

### Tag
```yaml
tags:
  - "#gift-received"
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `tags` | list | Contains `#gift-received` |
| `friendlyName` | text | User-entered name |
| `individuals` | list | Links to Individual records (givers) |
| `date` | date | Date gift was received |
| `occasion` | text | Occasion for the gift |
| `estimated-cost` | number | Estimated value of gift |
| `notes` | text | Free-form notes |
| `thank-you-sent` | boolean | Whether thank-you was sent |

### Frontmatter Example
```yaml
---
tags:
  - "#gift-received"
friendlyName: Cookbook
individuals:
  - "[[Mom]]"
date: 2024-12-25
occasion: Christmas
estimated-cost: 35
notes: Italian recipes
thank-you-sent: true
---
```

### Meta Bind Inputs
- `individuals`: `INPUT[listSuggester(optionQuery(#individual)):individuals]`
- `date`: `INPUT[date:date]`
- `occasion`: `INPUT[suggester(option(Birthday), ...):occasion]`
- `estimated-cost`: `INPUT[number:estimated-cost]`
- `thank-you-sent`: `INPUT[toggle:thank-you-sent]`
- `notes`: `INPUT[textArea:notes]`

### Views
- **Dashboard**: `views/Gifts Received.md`
- **Base File**: `views/Gifts Received Base.base`
- **Views**: `needs_thank_you`, `all_received`

### Creation Flow
Uses `create-gift-received.js` UserScript:
1. Prompts for gift name
2. Creates file with unique name
3. Sets `friendlyName` and current date

---

## Occasions

Pre-defined occasion options used across gift entities:

- Birthday
- Christmas
- Hanukkah
- Anniversary
- Valentines Day
- Mothers Day
- Fathers Day
- Graduation
- Wedding
- Baby Shower
- Housewarming
- Thank You
- Just Because
- Other

Defined in suggester inputs within:
- `gift-idea-properties.md`
- `gift-given-properties.md`
- `gift-received-properties.md`
