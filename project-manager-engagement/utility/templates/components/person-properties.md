## Client
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#client', 'client', 'suggester', 'clients');
```
## Status
```meta-bind
INPUT[select(option(Active), option(Inactive)):status]
```
## Title
`INPUT[text:title]`
## Reports To
```meta-bind-js-view

---
const {activeSuggester} = await engine.importJs('utility/scripts/meta-bind/active-suggester.js');
return activeSuggester(engine, app, '#person', 'reports-to', 'suggester', 'persons');
```
## Notes
`INPUT[textArea:notes]`
