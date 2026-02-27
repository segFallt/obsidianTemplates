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
## Start Date
`INPUT[date:start-date]`
## End Date
`INPUT[date:end-date]`
## Description
`INPUT[textArea:description]`
