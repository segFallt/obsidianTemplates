// Create Project with Auto-Generated Notes Directory
// Creates a new project and automatically sets notesDirectory based on project name
// Triggered by: QuickAdd macro "Project - New"

module.exports = async (params) => {
  // Prompt for project name
  const projectName = await params.quickAddApi.inputPrompt('Project name:');

  if (!projectName) {
    new Notice('No project name provided.');
    return;
  }

  // Query all engagements
  const engagements = app.vault.getMarkdownFiles()
    .filter(file => file.path.startsWith('engagements/'))
    .map(file => {
      const cache = app.metadataCache.getFileCache(file);
      const fm = cache?.frontmatter || {};
      return {
        file: file,
        name: file.basename,
        status: fm.status || 'Active',
        client: fm.client || '',
        hasTag: cache?.tags?.some(t => t.tag === '#engagement') || false
      };
    })
    .filter(e => e.hasTag && e.status === 'Active');

  // Sort by name
  engagements.sort((a, b) => a.name.localeCompare(b.name));

  // Build engagement options
  const engagementOptions = ['(No Engagement)'].concat(
    engagements.map(e => {
      const clientName = e.client ? ` - ${e.client.replace(/\[\[|\]\]/g, '')}` : '';
      return `${e.name}${clientName}`;
    })
  );

  // Prompt for engagement selection
  let selectedEngagement = null;
  if (engagementOptions.length > 1) {
    const engagementChoice = await params.quickAddApi.suggester(
      engagementOptions,
      engagementOptions
    );

    if (engagementChoice && engagementChoice !== '(No Engagement)') {
      // Find engagement whose name matches the start of the selection
      const engagement = engagements.find(e =>
        engagementChoice === e.name || engagementChoice.startsWith(e.name + ' - ')
      );
      if (engagement) {
        selectedEngagement = `[[${engagement.name}]]`;
      }
    }
  }

  // Generate notesDirectory (lowercase snake_case)
  const notesDir = 'projects/notes/' + projectName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');

  // Load and process project template
  const templatePath = 'utility/templates/New Project.md';
  const templateFile = app.vault.getAbstractFileByPath(templatePath);

  if (!templateFile) {
    new Notice('Project template not found at: ' + templatePath);
    return;
  }

  let content = await app.vault.read(templateFile);

  // Process Templater date expressions
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(/<% tp\.date\.now\(\) %>/g, today);

  // Handle filename conflicts
  let projectPath = `projects/${projectName}.md`;
  let counter = 1;
  while (await app.vault.adapter.exists(projectPath)) {
    counter++;
    projectPath = `projects/${projectName} ${counter}.md`;
  }

  // Ensure projects folder exists
  if (!await app.vault.adapter.exists('projects')) {
    await app.vault.createFolder('projects');
  }

  // Create the project file
  const newProject = await app.vault.create(projectPath, content);

  // Update frontmatter with auto-generated notesDirectory and engagement
  await app.fileManager.processFrontMatter(newProject, (fm) => {
    fm.notesDirectory = notesDir;
    if (selectedEngagement) {
      fm.engagement = selectedEngagement;
    }
  });

  // Open the new project
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newProject);

  new Notice(`Created project: ${projectName}`);
};
