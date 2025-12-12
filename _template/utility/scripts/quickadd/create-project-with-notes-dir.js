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

  // Update frontmatter with auto-generated notesDirectory
  await app.fileManager.processFrontMatter(newProject, (fm) => {
    fm.notesDirectory = notesDir;
  });

  // Open the new project
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newProject);

  new Notice(`Created project: ${projectName}`);
};
