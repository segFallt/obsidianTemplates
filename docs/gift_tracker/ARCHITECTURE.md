# Gift Tracker Architecture

This document describes the technical architecture of the Gift Tracker Obsidian vault for future reference and maintenance.

## Overview

The Gift Tracker is an Obsidian vault that uses a normalized data model with five entity types: Individuals, Interests, Gift Ideas, Gifts Given, and Gifts Received. The system leverages several Obsidian plugins to provide interactive forms, dynamic views, and quick data entry.

## Core Concepts

### Entity Model

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Interest   │◄────│ Individual  │◄────│  Gift Idea  │
│  #interest  │     │ #individual │     │  #gift-idea │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                          │                    │
                          │                    │ converts to
                          ▼                    ▼
                   ┌─────────────┐     ┌─────────────┐
                   │Gift Received│     │ Gift Given  │
                   │#gift-received│    │ #gift-given │
                   └─────────────┘     └─────────────┘
```

### Tag-Based Entity Identification

Each entity type uses a unique tag for identification:
- `#individual` - People profiles
- `#interest` - Hobbies/interests library
- `#gift-idea` - Gift ideas/wishlist items
- `#gift-given` - Gifts given to others
- `#gift-received` - Gifts received from others

Tags are stored in frontmatter with the hash prefix:
```yaml
tags:
  - "#individual"
```

### Folder Organization

| Folder | Entity Type | Tag |
|--------|-------------|-----|
| `individuals/` | Individual | `#individual` |
| `interests/` | Interest | `#interest` |
| `gifts/ideas/` | Gift Idea | `#gift-idea` |
| `gifts/given/` | Gift Given | `#gift-given` |
| `gifts/received/` | Gift Received | `#gift-received` |

## Plugin Architecture

### QuickAdd

**Purpose**: Note creation and macro execution

**Configuration**: `.obsidian/plugins/quickadd/data.json`

**Choice Types**:
1. **Template Choices** - Direct template application (Individual, Interest)
2. **Macro Choices** - UserScript execution (Gift Idea, Gift Given, Gift Received, Convert Idea)

**Template Choices** use QuickAdd's built-in templating:
```json
{
  "type": "Template",
  "templatePath": "utility/templates/New Individual.md",
  "folder": { "enabled": true, "folders": ["individuals"] }
}
```

**Macro Choices** execute UserScripts for complex logic:
```json
{
  "type": "Macro",
  "macroId": "b1c2d3e4-2222-2222-2222-222222222222"
}
```

### Meta Bind

**Purpose**: Interactive form controls in notes

**Input Types Used**:
- `INPUT[text:property]` - Single-line text (inline)
- `INPUT[textArea:property]` - Multi-line text (inline)
- `INPUT[date:property]` - Date picker (inline)
- `INPUT[number:property]` - Numeric input (inline)
- `INPUT[toggle:property]` - Boolean toggle (inline)
- `INPUT[list:property]` - Multi-value list (code block required)
- `INPUT[listSuggester(optionQuery(#tag)):property]` - Auto-suggest from tagged notes (code block required)
- `INPUT[suggester(option(A), option(B)):property]` - Static option suggester (code block required)

**Important**: `list` and `listSuggester` inputs MUST use code block format:
```markdown
```meta-bind
INPUT[listSuggester(optionQuery(#individual)):individuals]
```
```

Inline format (backticks) will cause META_BIND_ERROR for these input types.

**Embeds**: Properties components are embedded using:
```markdown
```meta-bind-embed
[[component-name]]
```
```

**Buttons**: Action buttons use:
```markdown
```meta-bind-button
style: primary
label: Button Text
id: unique-id
action:
  type: js
  file: path/to/script.js
```
```

### Bases (obsidian-projects)

**Purpose**: Table views for dashboards

**Configuration**: `.base` files in `views/` folder

**Structure**:
```yaml
properties:
  file.name:
    displayName: Display Label
views:
  - type: table
    name: view_name
    filters:
      and:
        - file.inFolder("folder")
        - file.hasTag("tag")
    order:
      - property1
      - property2
    sort:
      - property: file.name
        direction: ASC
```

**Embedding**: Views are embedded in markdown files:
```markdown
![[Base File.base#view_name]]
```

**Clickability**: Only `file.name` property creates clickable links. Custom properties are not clickable.

### Dataview

**Purpose**: Dynamic queries and JavaScript-powered views

**Usage**: Individual profile pages use dataviewjs for related gifts:
```javascript
await dv.view("scripts/dataview/related-gifts-table", {
  individual: dv.current().file.name
})
```

### Templater

**Purpose**: Dynamic template content

**Usage**: Date placeholders in templates:
```markdown
date: <% tp.date.now() %>
```

### JS Engine

**Purpose**: JavaScript execution for Meta Bind buttons

Enables the `action: type: js` functionality in meta-bind-button blocks.

## File Structure

```
gift_tracker/
├── .obsidian/
│   └── plugins/
│       ├── quickadd/
│       │   └── data.json          # QuickAdd configuration
│       ├── obsidian-meta-bind-plugin/
│       ├── obsidian-projects/     # Bases plugin
│       ├── dataview/
│       ├── templater-obsidian/
│       └── js-engine/
├── individuals/                    # Individual records
├── interests/                      # Interest records
├── gifts/
│   ├── ideas/                     # Gift idea records
│   ├── given/                     # Gift given records
│   └── received/                  # Gift received records
├── views/
│   ├── Individuals.md             # Dashboard
│   ├── Individuals Base.base      # Table definitions
│   ├── Interests.md
│   ├── Interests Base.base
│   ├── Gift Ideas.md
│   ├── Gift Ideas Base.base
│   ├── Gifts Given.md
│   ├── Gifts Given Base.base
│   ├── Gifts Received.md
│   └── Gifts Received Base.base
├── utility/
│   ├── templates/
│   │   ├── New Individual.md
│   │   ├── New Interest.md
│   │   ├── New Gift Idea.md
│   │   ├── New Gift Given.md
│   │   ├── New Gift Received.md
│   │   └── components/
│   │       ├── individual-properties.md
│   │       ├── interest-properties.md
│   │       ├── gift-idea-properties.md
│   │       ├── gift-given-properties.md
│   │       ├── gift-received-properties.md
│   │       └── gift-actions.md
│   └── scripts/
│       ├── quickadd/
│       │   ├── create-gift-idea.js
│       │   ├── create-gift-given.js
│       │   ├── create-gift-received.js
│       │   ├── convert-idea-to-given.js
│       │   ├── trigger_quickadd_create_individual.js
│       │   ├── trigger_quickadd_create_interest.js
│       │   ├── trigger_quickadd_create_gift_idea.js
│       │   ├── trigger_quickadd_create_gift_given.js
│       │   ├── trigger_quickadd_create_gift_received.js
│       │   └── trigger_quickadd_convert_idea.js
│       └── dataview/
│           └── related-gifts-table.js
├── attachments/
└── README.md
```

## Script Patterns

### Trigger Scripts (for Meta Bind buttons)

Used to invoke QuickAdd choices from buttons:

```javascript
const triggerQuickAddAction = async () => {
  const actionName = "Choice Name";

  const quickAddPlugin = app.plugins.getPlugin("quickadd");
  if (!quickAddPlugin) {
    new Notice('QuickAdd plugin not found.');
    return;
  }

  const quickAddApi = quickAddPlugin.api;
  await quickAddApi.executeChoice(actionName);
};

triggerQuickAddAction();
```

**Important**: Must call function directly at end (no `module.exports`).

### Create Scripts (QuickAdd UserScripts)

Used for complex note creation with unique naming:

```javascript
module.exports = async (params) => {
  const { app, quickAddApi } = params;

  // 1. Prompt for name
  const itemName = await quickAddApi.inputPrompt("Name:");
  if (!itemName) return;

  // 2. Generate unique path
  const folder = "target/folder";
  let uniquePath = `${folder}/${itemName}.md`;
  let counter = 1;
  while (await app.vault.adapter.exists(uniquePath)) {
    counter++;
    uniquePath = `${folder}/${itemName} ${counter}.md`;
  }

  // 3. Read template
  const templateFile = app.vault.getAbstractFileByPath("utility/templates/Template.md");
  let content = await app.vault.read(templateFile);

  // 4. Create file
  const newFile = await app.vault.create(uniquePath, content);

  // 5. Update frontmatter
  await app.fileManager.processFrontMatter(newFile, (fm) => {
    fm.friendlyName = itemName;
  });

  // 6. Open file
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newFile);
};
```

### Convert Script Pattern

Copies data from one entity to another:

```javascript
module.exports = async (params) => {
  const { app, quickAddApi } = params;

  // Get active file and validate
  const activeFile = app.workspace.getActiveFile();
  const metadata = app.metadataCache.getFileCache(activeFile);
  const fm = metadata.frontmatter;

  // Create new file from template
  // ...

  // Copy properties via processFrontMatter
  await app.fileManager.processFrontMatter(newFile, (newFm) => {
    newFm.individuals = fm.individuals;
    newFm.occasion = fm.occasion;
    newFm['from-idea'] = `[[${activeFile.basename}]]`;
  });
};
```

## Template Structure

### Entity Template Pattern

```markdown
---
tags:
  - "#entity-tag"
property1:
property2: []
---
# Section Header
```meta-bind-embed
[[entity-properties]]
```
```

### Properties Component Pattern

```markdown
## Property Label
`INPUT[type:property-name]`

## List Property
```meta-bind
INPUT[listSuggester(optionQuery(#tag)):property-name]
```
```

## View Dashboard Pattern

```markdown
---
obsidianUIMode: preview
---

```meta-bind-button
style: primary
label: New Entity
id: create-entity
action:
  type: js
  file: utility/scripts/quickadd/trigger_quickadd_create_entity.js
```

# Section Header
![[Entity Base.base#view_name]]
```

## Adding New Entities

To add a new entity type:

1. **Create folder**: `entity_folder/`
2. **Create template**: `utility/templates/New Entity.md`
3. **Create properties component**: `utility/templates/components/entity-properties.md`
4. **Create base view**: `views/Entity Base.base`
5. **Create dashboard**: `views/Entity.md`
6. **Create trigger script**: `utility/scripts/quickadd/trigger_quickadd_create_entity.js`
7. **Update QuickAdd config**: Add choice to `.obsidian/plugins/quickadd/data.json`

If the entity needs complex creation logic (unique naming, friendlyName):
8. **Create UserScript**: `utility/scripts/quickadd/create-entity.js`
9. **Add Macro** to QuickAdd config instead of Template choice

## Common Issues

### META_BIND_ERROR for list inputs
- **Cause**: Using inline backticks for `list` or `listSuggester`
- **Fix**: Use code block format with ```meta-bind

### Buttons not working
- **Cause**: Using `module.exports` pattern in trigger scripts
- **Fix**: Call function directly at end of script

### listSuggester showing no options
- **Cause**: No records exist with the queried tag
- **Fix**: Create at least one record with the tag, or use `INPUT[list]` as fallback

### Views not clickable
- **Cause**: Using custom property instead of `file.name`
- **Fix**: Bases only supports clickable links for `file.name` property
