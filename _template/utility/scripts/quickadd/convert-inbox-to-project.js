// Convert Inbox to Project
// Converts an inbox item to a full project with bidirectional linking
// Triggered by: QuickAdd macro "Convert Inbox to Project"

module.exports = async (params) => {
  const activeFile = app.workspace.getActiveFile();

  // Validate we have an active file
  if (!activeFile) {
    new Notice('No active file found. Open an inbox item to convert it.');
    return;
  }

  // Validate it's an inbox item
  if (!activeFile.path.startsWith('inbox/')) {
    new Notice('This file is not an inbox item. Open an inbox item to convert it.');
    return;
  }

  // Prompt for project name (default to inbox item name)
  const projectName = await params.quickAddApi.inputPrompt(
    'Project name:',
    activeFile.basename
  );

  if (!projectName) {
    new Notice('No project name provided.');
    return;
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

  // Update project frontmatter
  await app.fileManager.processFrontMatter(newProject, (fm) => {
    fm.notesDirectory = notesDir;
    fm.convertedFrom = `[[inbox/${activeFile.basename}]]`;
  });

  // Update inbox item frontmatter
  await app.fileManager.processFrontMatter(activeFile, (fm) => {
    fm.status = 'Inactive';
    fm.convertedTo = `[[projects/${projectName}]]`;
  });

  // Open the new project
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newProject);

  new Notice(`Created project: ${projectName}`);
};
