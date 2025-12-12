# File Reference

Complete listing of all configuration and code files in the Gift Tracker vault.

## Directory Structure

```
gift_tracker/
├── .obsidian/                     # Obsidian configuration
│   └── plugins/                   # Plugin configs and code
├── individuals/                   # Individual records
├── interests/                     # Interest records
├── gifts/
│   ├── ideas/                    # Gift idea records
│   ├── given/                    # Gift given records
│   └── received/                 # Gift received records
├── views/                         # Dashboards and base files
├── utility/
│   ├── templates/                # Note templates
│   │   └── components/           # Reusable property forms
│   └── scripts/
│       ├── quickadd/             # QuickAdd UserScripts and triggers
│       └── dataview/             # Dataview view scripts
├── attachments/                   # Images and files
└── README.md                      # User documentation
```

## Templates

### Main Templates

| File | Entity | Tag |
|------|--------|-----|
| `utility/templates/New Individual.md` | Individual | `#individual` |
| `utility/templates/New Interest.md` | Interest | `#interest` |
| `utility/templates/New Gift Idea.md` | Gift Idea | `#gift-idea` |
| `utility/templates/New Gift Given.md` | Gift Given | `#gift-given` |
| `utility/templates/New Gift Received.md` | Gift Received | `#gift-received` |

### Property Components

Embedded via `meta-bind-embed` in templates.

| File | Purpose |
|------|---------|
| `utility/templates/components/individual-properties.md` | Birthday, interests, notes inputs |
| `utility/templates/components/interest-properties.md` | Notes input |
| `utility/templates/components/gift-idea-properties.md` | For, interests, occasion, cost, URL, status, notes |
| `utility/templates/components/gift-given-properties.md` | To, date, occasion, cost, store, URL, notes |
| `utility/templates/components/gift-received-properties.md` | From, date, occasion, thank-you toggle, notes |
| `utility/templates/components/gift-actions.md` | Convert to Gift Given button |

## Scripts

### QuickAdd UserScripts

Called by QuickAdd Macro choices.

| File | Purpose |
|------|---------|
| `utility/scripts/quickadd/create-gift-idea.js` | Creates Gift Idea with unique naming |
| `utility/scripts/quickadd/create-gift-given.js` | Creates Gift Given with unique naming |
| `utility/scripts/quickadd/create-gift-received.js` | Creates Gift Received with unique naming |
| `utility/scripts/quickadd/convert-idea-to-given.js` | Converts Gift Idea to Gift Given |

### Trigger Scripts

Called by Meta Bind buttons to invoke QuickAdd choices.

| File | Invokes Choice |
|------|----------------|
| `utility/scripts/quickadd/trigger_quickadd_create_individual.js` | Individual - New |
| `utility/scripts/quickadd/trigger_quickadd_create_interest.js` | Interest - New |
| `utility/scripts/quickadd/trigger_quickadd_create_gift_idea.js` | Gift Idea - New |
| `utility/scripts/quickadd/trigger_quickadd_create_gift_given.js` | Gift Given - New |
| `utility/scripts/quickadd/trigger_quickadd_create_gift_received.js` | Gift Received - New |
| `utility/scripts/quickadd/trigger_quickadd_convert_idea.js` | Convert Idea to Given |

### Dataview Scripts

| File | Purpose |
|------|---------|
| `utility/scripts/dataview/related-gifts-table.js` | Shows gifts related to an individual |

## Views

### Dashboards

Markdown files with buttons and embedded base views.

| File | Entity |
|------|--------|
| `views/Individuals.md` | Individuals |
| `views/Interests.md` | Interests |
| `views/Gift Ideas.md` | Gift Ideas |
| `views/Gifts Given.md` | Gifts Given |
| `views/Gifts Received.md` | Gifts Received |

### Base Files

Define table views for dashboards.

| File | Views |
|------|-------|
| `views/Individuals Base.base` | `all_individuals` |
| `views/Interests Base.base` | `all_interests` |
| `views/Gift Ideas Base.base` | `all_ideas`, `ideas_by_status`, `ideas_by_interest` |
| `views/Gifts Given Base.base` | `all_given`, `given_by_occasion` |
| `views/Gifts Received Base.base` | `needs_thank_you`, `all_received` |

## Plugin Configuration

### QuickAdd

**File**: `.obsidian/plugins/quickadd/data.json`

Contains:
- `choices[]` - Template and Macro choice definitions
- `macros[]` - Macro definitions with UserScript commands
- `templateFolderPath` - Template folder path

### Other Plugin Configs

| Plugin | Config File |
|--------|-------------|
| Dataview | `.obsidian/plugins/dataview/data.json` |
| Meta Bind | `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` |
| Bases | `.obsidian/plugins/obsidian-projects/data.json` |
| Templater | `.obsidian/plugins/templater-obsidian/data.json` |
| Icon Folder | `.obsidian/plugins/obsidian-icon-folder/data.json` |

## Modification Guide

### Adding a new property to an entity

1. Update template frontmatter: `utility/templates/New [Entity].md`
2. Add input to properties component: `utility/templates/components/[entity]-properties.md`
3. If needed, add to base view order: `views/[Entity] Base.base`
4. If using UserScript, update script to handle property

### Adding a new view

1. Add view definition to base file: `views/[Entity] Base.base`
2. Embed view in dashboard: `views/[Entity].md`

### Adding a new occasion

Update suggester options in all three files:
- `utility/templates/components/gift-idea-properties.md`
- `utility/templates/components/gift-given-properties.md`
- `utility/templates/components/gift-received-properties.md`

### Adding a new entity type

1. Create folder: `[entity_folder]/`
2. Create template: `utility/templates/New [Entity].md`
3. Create properties component: `utility/templates/components/[entity]-properties.md`
4. Create base file: `views/[Entity] Base.base`
5. Create dashboard: `views/[Entity].md`
6. Create trigger script: `utility/scripts/quickadd/trigger_quickadd_create_[entity].js`
7. Add QuickAdd choice to: `.obsidian/plugins/quickadd/data.json`
8. (Optional) Create UserScript if complex creation needed: `utility/scripts/quickadd/create-[entity].js`
9. (Optional) Add macro to QuickAdd config

## File Naming Conventions

### Templates
- Main: `New [Entity Name].md`
- Components: `[entity-name]-properties.md`, `[entity-name]-actions.md`

### Scripts
- UserScripts: `create-[entity-name].js`, `convert-[source]-to-[target].js`
- Triggers: `trigger_quickadd_create_[entity_name].js`, `trigger_quickadd_convert_[action].js`

### Views
- Dashboard: `[Entity Name]s.md` (plural)
- Base: `[Entity Name]s Base.base` (plural)

### Records
- Created with user-entered name
- Numeral suffix added if duplicate: `Name.md`, `Name 2.md`, `Name 3.md`
