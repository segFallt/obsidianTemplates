# Gift Tracker Vault

A personal gift tracking system built in Obsidian for managing gift ideas, gifts given, and gifts received.

## Features

- **Individuals**: Keep profiles of people you exchange gifts with, including birthdays and interests
- **Interests**: Maintain a library of interests to tag individuals and gift ideas
- **Gift Ideas**: Track gift ideas with estimated costs, links, and status
- **Gifts Given**: Record gifts you've given with date, occasion, cost, and recipient
- **Gifts Received**: Track gifts received and whether you've sent a thank-you
- **Quick Entry**: Buttons and QuickAdd commands for fast data entry
- **Smart Views**: Filterable dashboards using Obsidian Bases
- **Idea Conversion**: One-click conversion of ideas into given gifts

---

## Getting Started

### Opening the Vault

1. Open Obsidian
2. Click "Open folder as vault"
3. Select the `gift_tracker` folder
4. Trust the plugins when prompted

### Creating Interests

Before adding individuals, set up some interests that can be reused across your vault.

1. Open `views/Interests.md` from the file explorer
2. Click the **New Interest** button
3. Enter the interest name (e.g., "Photography", "Cooking", "Board Games")
4. Add optional notes about the interest

Interests are used to:
- Tag individuals with their hobbies/preferences
- Associate gift ideas with relevant interests
- Help find gift ideas based on someone's interests

### Creating Your First Individual

1. Open `views/Individuals.md` from the file explorer
2. Click the **New Individual** button
3. Enter the person's name when prompted
4. Fill in their birthday
5. Select interests from your interest library (auto-suggests from existing interests)

### Adding a Gift Idea

1. Open `views/Gift Ideas.md`
2. Click **New Gift Idea**
3. Enter a name for the idea
4. Use the form to select:
   - **For**: Choose from your individuals list
   - **Interests**: Tag relevant interests (auto-suggests from existing interests)
   - **Occasion**: Select from common occasions
   - **Estimated Cost**: Enter a budget
   - **URL**: Add a product link
   - **Status**: Idea → Considering → Planned

### Recording a Gift Given

1. Open `views/Gifts Given.md`
2. Click **New Gift Given**
3. Fill in the recipient, date, occasion, and cost

**Or convert from an idea:**
1. Open a gift idea
2. Click **Convert to Gift Given**
3. The idea's details are copied to a new "given" record

### Recording a Gift Received

1. Open `views/Gifts Received.md`
2. Click **New Gift Received**
3. Select who gave the gift, the date, and occasion
4. Check **Thank You Sent** once you've thanked them

---

## Folder Structure

| Folder | Purpose |
|--------|---------|
| `individuals/` | People profiles |
| `interests/` | Interest/hobby records |
| `gifts/ideas/` | Gift ideas and wishlists |
| `gifts/given/` | Gifts you've given |
| `gifts/received/` | Gifts you've received |
| `views/` | Dashboard pages |
| `utility/` | Templates and scripts (don't edit) |
| `attachments/` | Images and files |

---

## Views & Dashboards

### Interests
A master list of all interests in your vault. Use this to:
- Add new interests
- See all available interests at a glance
- Manage your interest library

### Individuals
Shows all people in your gift network. Each individual's page displays:
- Profile information (birthday, interests)
- Gift history (given to them, received from them)
- Active gift ideas for them

### Gift Ideas
Two views:
- **All Ideas**: Recently modified first
- **By Status**: Grouped by Idea/Considering/Planned

### Gifts Given
- **All Given**: Sorted by date (newest first)
- **By Occasion**: Grouped by occasion type

### Gifts Received
- **Needs Thank You**: Gifts where thank-you hasn't been sent
- **All Received**: Complete history

---

## Quick Actions

### Keyboard Shortcuts
Open the command palette (`Ctrl/Cmd + P`) and search for:
- `QuickAdd: Interest - New`
- `QuickAdd: Individual - New`
- `QuickAdd: Gift Idea - New`
- `QuickAdd: Gift Given - New`
- `QuickAdd: Gift Received - New`

### Buttons
Each view has a creation button at the top for quick entry.

---

## Occasions

Pre-configured occasions include:
- Birthday
- Christmas
- Hanukkah
- Anniversary
- Valentine's Day
- Mother's Day / Father's Day
- Graduation
- Wedding
- Baby Shower
- Housewarming
- Thank You
- Just Because
- Other

---

## Tips

### Managing Interests
- Create interests before individuals for better organization
- Use broad categories (e.g., "Outdoor Activities") or specific hobbies (e.g., "Rock Climbing")
- Interests auto-suggest when editing individuals or gift ideas

### Linking Multiple People
A gift can be associated with multiple individuals. Use the suggester to add more than one person.

### Tracking Budget
- Gift Ideas have **Estimated Cost**
- Gifts Given have **Cost** (actual amount spent)
- Use the Bases filter/sort to analyze spending

### Finding Gift History
Open any individual's page to see:
- All gifts you've given them
- All gifts they've given you
- Current ideas you have for them

### Thank-You Reminders
The "Needs Thank You" section in Gifts Received helps you track unacknowledged gifts.

### Interest-Based Gift Finding
Tag gift ideas with interests to easily find relevant ideas when shopping for someone with specific hobbies.

---

## Customization

### Adding Occasions
Edit the suggester options in:
- `utility/templates/components/gift-idea-properties.md`
- `utility/templates/components/gift-given-properties.md`
- `utility/templates/components/gift-received-properties.md`

### Modifying Views
Base files (`.base`) in `views/` control table columns, filters, and sorting. Edit these to customize the dashboards.

---

## Plugins Used

This vault uses the following community plugins:
- **Dataview** - Dynamic queries and tables
- **Templater** - Template generation
- **QuickAdd** - Quick note creation
- **Meta Bind** - Interactive form controls
- **Bases** - Table views for dashboards
- **JS Engine** - JavaScript execution for buttons

All plugins are pre-configured and ready to use.
