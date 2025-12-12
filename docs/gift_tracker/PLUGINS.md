# Plugin Integration Guide

Details on how each Obsidian plugin is configured and used in the Gift Tracker vault.

## QuickAdd

**Plugin ID**: `quickadd`
**Config File**: `.obsidian/plugins/quickadd/data.json`

### Purpose
Provides quick note creation and macro execution via command palette and API.

### Configuration Structure

```json
{
  "choices": [...],
  "macros": [...],
  "templateFolderPath": "utility/templates",
  "version": "1.13.3"
}
```

### Choice Types

#### Template Choice
Direct template application with folder routing:

```json
{
  "id": "unique-uuid",
  "name": "Individual - New",
  "type": "Template",
  "command": true,
  "templatePath": "utility/templates/New Individual.md",
  "folder": {
    "enabled": true,
    "folders": ["individuals"]
  },
  "openFile": true,
  "fileExistsMode": "Increment the file name"
}
```

**Used for**: Individual, Interest (simple creation)

#### Macro Choice
Executes a UserScript for complex logic:

```json
{
  "id": "unique-uuid",
  "name": "Gift Idea - New",
  "type": "Macro",
  "command": true,
  "macroId": "macro-uuid"
}
```

**Used for**: Gift Idea, Gift Given, Gift Received, Convert Idea to Given

### Macro Structure

```json
{
  "name": "Create Gift Idea",
  "id": "macro-uuid",
  "commands": [
    {
      "name": "create-gift-idea",
      "type": "UserScript",
      "id": "command-uuid",
      "path": "utility/scripts/quickadd/create-gift-idea.js",
      "settings": {}
    }
  ],
  "runOnStartup": false
}
```

### Current Choices

| Choice Name | Type | Template/Script |
|-------------|------|-----------------|
| Individual - New | Template | `New Individual.md` |
| Interest - New | Template | `New Interest.md` |
| Gift Idea - New | Macro | `create-gift-idea.js` |
| Gift Given - New | Macro | `create-gift-given.js` |
| Gift Received - New | Macro | `create-gift-received.js` |
| Convert Idea to Given | Macro | `convert-idea-to-given.js` |

### API Usage

Invoke QuickAdd from JavaScript:
```javascript
const quickAddPlugin = app.plugins.getPlugin("quickadd");
await quickAddPlugin.api.executeChoice("Choice Name");
```

### UserScript Parameters

QuickAdd UserScripts receive:
```javascript
module.exports = async (params) => {
  const { app, quickAddApi } = params;

  // app - Obsidian app instance
  // quickAddApi - QuickAdd API with inputPrompt, suggester, etc.
};
```

Common API methods:
- `quickAddApi.inputPrompt(header, placeholder, value)` - Text input dialog
- `quickAddApi.suggester(displayItems, items)` - Selection dialog

---

## Meta Bind

**Plugin ID**: `obsidian-meta-bind-plugin`
**Config File**: `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`

### Purpose
Provides interactive form inputs bound to frontmatter properties.

### Input Types

#### Inline Inputs (backtick format)
```markdown
`INPUT[type:property]`
```

Supported inline:
- `text` - Single line text
- `textArea` - Multi-line text
- `date` - Date picker
- `number` - Numeric input
- `toggle` - Boolean switch

#### Code Block Inputs
```markdown
```meta-bind
INPUT[type:property]
```
```

**Required** for:
- `list` - Multi-value list
- `listSuggester` - Auto-suggest from query
- `suggester` - Static option suggester
- `select` - Dropdown select

### Input Syntax

#### listSuggester with tag query
```
INPUT[listSuggester(optionQuery(#tag)):property]
```

Queries all notes with specified tag and suggests their names.

#### suggester with static options
```
INPUT[suggester(option(A), option(B), option(C)):property]
```

#### select with static options
```
INPUT[select(option(A), option(B), option(C)):property]
```

### Embeds

Embed reusable property forms:
```markdown
```meta-bind-embed
[[component-name]]
```
```

The component file contains Meta Bind inputs that render inline.

### Buttons

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

Button styles: `primary`, `default`, `destructive`

Action types:
- `js` - Execute JavaScript file
- `command` - Run Obsidian command
- `open` - Open file/URL

### Common Errors

**META_BIND_ERROR: INPUT[list] not allowed in inline code blocks**
- Cause: Using backticks for `list`, `listSuggester`, `suggester`, or `select`
- Fix: Use code block format

---

## Bases (obsidian-projects)

**Plugin ID**: `obsidian-projects`
**Config Files**: `.base` files in vault

### Purpose
Provides table views for displaying and filtering notes.

### Base File Structure

```yaml
properties:
  property.name:
    displayName: Display Label

views:
  - type: table
    name: view_name
    filters:
      and:
        - condition1
        - condition2
    order:
      - property1
      - property2
    sort:
      - property: property_name
        direction: ASC|DESC
```

### Filter Conditions

```yaml
filters:
  and:
    - file.inFolder("folder/path")
    - file.hasTag("tag-name")
```

Other conditions:
- `file.name contains "text"`
- `property = "value"`
- `property > 0`

### Property Display

```yaml
properties:
  file.name:
    displayName: Name
  custom-property:
    displayName: Custom Label
```

**Important**: Only `file.name` creates clickable links. Custom properties display as text only.

### Embedding Views

```markdown
![[Base File.base#view_name]]
```

### Current Base Files

| File | Views |
|------|-------|
| `Individuals Base.base` | `all_individuals` |
| `Interests Base.base` | `all_interests` |
| `Gift Ideas Base.base` | `all_ideas`, `ideas_by_status`, `ideas_by_interest` |
| `Gifts Given Base.base` | `all_given`, `given_by_occasion` |
| `Gifts Received Base.base` | `needs_thank_you`, `all_received` |

---

## Dataview

**Plugin ID**: `dataview`
**Config File**: `.obsidian/plugins/dataview/data.json`

### Purpose
Dynamic queries and JavaScript-powered data views.

### Usage in Gift Tracker

DataviewJS for related gifts on Individual pages:

```javascript
```dataviewjs
await dv.view("scripts/dataview/related-gifts-table", {
  individual: dv.current().file.name
})
```
```

### View Script Pattern

Located in `utility/scripts/dataview/`:

```javascript
const config = input || {};
const individualName = config.individual;

// Query pages by tag
const giftsGiven = dv.pages('#gift-given')
  .where(p => containsIndividual(p.individuals, individualName))
  .sort(p => p.date, 'desc');

// Display table
dv.table(
  ["Column1", "Column2"],
  results.map(r => [r.property1, r.property2])
);
```

### Common Methods

- `dv.pages('#tag')` - Get all pages with tag
- `dv.pages('"folder"')` - Get all pages in folder
- `dv.current()` - Get current page
- `.where(predicate)` - Filter results
- `.sort(property, direction)` - Sort results
- `dv.table(headers, rows)` - Render table
- `dv.header(level, text)` - Render header
- `dv.paragraph(text)` - Render paragraph

---

## Templater

**Plugin ID**: `templater-obsidian`
**Config File**: `.obsidian/plugins/templater-obsidian/data.json`

### Purpose
Dynamic template content with JavaScript execution.

### Usage in Gift Tracker

Date placeholders in templates:
```markdown
date: <% tp.date.now() %>
```

### Processing in Scripts

When creating files via UserScript, replace Templater placeholders:
```javascript
const today = new Date().toISOString().split('T')[0];
templateContent = templateContent.replace(/<% tp\.date\.now\(\) %>/g, today);
```

---

## JS Engine

**Plugin ID**: `js-engine`

### Purpose
Enables JavaScript execution for Meta Bind buttons.

### Configuration
No special configuration required. Enables `action: type: js` in meta-bind-button blocks.

---

## Other Plugins

### Icon Folder (obsidian-icon-folder)
Custom folder icons. Config in `.obsidian/plugins/obsidian-icon-folder/data.json`.

### Table Editor (table-editor-obsidian)
Enhanced markdown table editing.

### Tag Wrangler (tag-wrangler)
Tag management and renaming.

### Tasks (obsidian-tasks-plugin)
Task management (not actively used in Gift Tracker).

### View Mode by Frontmatter (obsidian-view-mode-by-frontmatter)
Enables `obsidianUIMode: preview` in frontmatter to force preview mode on dashboards.
