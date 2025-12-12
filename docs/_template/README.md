# Obsidian Templates Documentation

This documentation provides a comprehensive reference for the Obsidian Vault template located in `/workspace/obsidianTemplates/_template`. Use this guide when making feature additions or modifications to the project.

## Quick Reference

| Document | Description |
|----------|-------------|
| [Directory Structure](./directory-structure.md) | File and folder organization |
| [Plugins & Configuration](./plugins-configuration.md) | Community plugins and settings |
| [Templates System](./templates-system.md) | Templater templates and QuickAdd actions |
| [Scripts & Automation](./scripts-automation.md) | JavaScript automation scripts |
| [Views & Dashboards](./views-dashboards.md) | Dashboard pages and queries |
| [Architecture](./architecture.md) | System design and data flow |

## Project Overview

This is a templated Obsidian Vault designed as a starter template for:
- Personal knowledge management (PKM)
- Project portfolio tracking
- Task management with priorities and due dates
- Meeting documentation (recurring and single)
- Contact/people management
- GTD (Getting Things Done) workflows

## Core Workflow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Capture │ -> │ Process │ -> │  Track  │ -> │ Archive │
│ (Inbox) │    │(Organize│    │ (Views) │    │(Complete│
│         │    │ + Tag)  │    │         │    │   )     │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

1. **Capture**: Quick notes via Inbox
2. **Process**: Move to Projects, People, Meetings, or Reference
3. **Track**: View in dashboards with real-time queries
4. **Archive**: Mark complete for history

## Key Technologies

| Category | Plugin | Purpose |
|----------|--------|---------|
| Task Management | obsidian-tasks-plugin | Due dates, recurrence, priorities |
| Data Queries | dataview | SQL-like queries for dynamic views |
| Template Engine | templater-obsidian | Dynamic note generation |
| Quick Actions | quickadd | Template triggers and macros |
| Project Board | obsidian-projects | Kanban and table views |
| Interactive Elements | obsidian-meta-bind-plugin | Buttons and form inputs |
| Custom Scripts | js-engine | JavaScript execution in notes |

## File Structure Summary

```
_template/
├── .obsidian/           # Obsidian configuration
│   ├── plugins/         # Community plugin configs
│   └── snippets/        # Custom CSS
├── attachments/         # Media files
├── daily notes/         # Daily journal entries
├── inbox/               # Quick capture
├── meetings/            # Meeting notes
│   ├── recurring/
│   └── single/
├── people/              # Contact notes
├── projects/            # Project tracking
│   └── notes/           # Project sub-documents
├── reference/           # Reference material
├── utility/             # Templates and scripts
│   ├── templates/
│   └── scripts/
└── views/               # Dashboard pages
```

## Metadata Schema

All notes use frontmatter properties:

| Property | Type | Values | Used By |
|----------|------|--------|---------|
| status | text | New, Active, On Hold, Complete | Projects, Inbox |
| priority | number | 1-5 | Projects |
| start-date | date | YYYY-MM-DD | Projects, Meetings |
| end-date | date | YYYY-MM-DD | Projects, Meetings |
| tags | multitext | #project, #waiting, #someday | All |
| relatedProject | multitext | [[Project Name]] | Project Notes |

## Development Environment

The project includes a VS Code dev container configuration:
- Base: Debian Bullseye
- Node.js for tooling
- Claude Code CLI pre-installed
- Extensions: Docker, ESLint, Prettier

## Adding New Features

When adding features to this template:

1. **New Note Type**: Create template in `utility/templates/`, add QuickAdd action
2. **New View**: Add to `views/`, use dataview queries, bookmark in workspace
3. **New Script**: Add to `utility/scripts/`, document in scripts-automation.md
4. **New Plugin**: Add to community-plugins.json, configure in plugins folder
5. **New CSS**: Add snippet to `.obsidian/snippets/`, enable in appearance.json
