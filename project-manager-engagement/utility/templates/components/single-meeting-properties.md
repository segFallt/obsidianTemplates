## Engagement
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#engagement', 'engagement', 'suggester', 'engagements');
```

# Attendees
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#person', 'attendees', 'listSuggester', 'persons');
```