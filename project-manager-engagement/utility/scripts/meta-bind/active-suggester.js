// Generates a Meta Bind suggester INPUT with options filtered to active items.
//
// Parameters:
//   engine       - JS Engine engine object (from meta-bind-js-view context)
//   app          - Obsidian app object
//   tag          - Dataview source tag (e.g. '#client')
//   bindTarget   - Frontmatter property to bind to (e.g. 'client')
//   inputType    - Meta Bind input type: 'suggester', 'listSuggester', or 'inlineListSuggester'
//   noItemsLabel - Label for empty state (e.g. 'clients')
export function activeSuggester(engine, app, tag, bindTarget, inputType, noItemsLabel) {
  const dv = app.plugins.plugins['dataview']?.api;
  if (!dv) return engine.markdown.create('*Dataview not loaded*');
  const pages = dv.pages(tag)
    .where(p => p.status === 'Active')
    .sort(p => p.file.name, 'asc');
  const options = pages
    .map(p => `option('[[${p.file.name}]]', '${p.file.name}')`)
    .join(', ');
  if (!options) {
    return engine.markdown.create(`*No active ${noItemsLabel} found*`);
  }

  const inputDecl = `INPUT[${inputType}(${options}):${bindTarget}]`;

  // listSuggester requires code block syntax; inline types use backtick syntax
  if (inputType === 'listSuggester') {
    const mb = engine.markdown.createBuilder();
    mb.createCodeBlock('meta-bind', inputDecl);
    return mb;
  }
  return engine.markdown.create(`\`${inputDecl}\``);
}
