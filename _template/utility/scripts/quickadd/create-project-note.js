const fs = require('fs');
const path = require('path');

module.exports = async (params) => {
  const activeFile = app.workspace.getActiveFile();

  if (!activeFile) {
    new Notice("No active file found.");
    return;
  }

  const metadata = app.metadataCache.getFileCache(activeFile);

  if (!metadata || !metadata.frontmatter || !metadata.frontmatter.notesDirectory) {
    new Notice("The current file does not have a notesDirectory property in its frontmatter.");
    return;
  }

  const notesDirectory = metadata.frontmatter.notesDirectory;

  // Prompt for the new note name
  const newNoteName = await params.quickAddApi.inputPrompt("Enter the name of the new project note:");

  if (!newNoteName) {
    new Notice("No note name provided.");
    return;
  }

  // Ensure the notesDirectory exists
  const notesDirPath = app.vault.adapter.getFullPath(notesDirectory);
  if (!fs.existsSync(notesDirPath)) {
    fs.mkdirSync(notesDirPath, { recursive: true });
  }

  // Generate the full path for the new note
  let projectNotePath = `${notesDirectory}/${newNoteName}.md`;
  let uniquePath = projectNotePath;

  // If the file already exists, add a timestamp to make it unique
  if (await app.vault.adapter.exists(uniquePath)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    uniquePath = `${notesDirectory}/${newNoteName}-${timestamp}.md`;
  }

  // Create a new file from the template
  const templateFile = app.vault.getAbstractFileByPath("utility/templates/Project Note.md");

  if (!templateFile) {
    new Notice("Template file not found.");
    return;
  }

  const templateContent = await app.vault.read(templateFile);
  await app.vault.create(uniquePath, templateContent);

  // Get the newly created file
  const newFile = app.vault.getAbstractFileByPath(uniquePath);

  // Update the frontmatter of the new file
  await app.fileManager.processFrontMatter(newFile, (fm) => {
    fm.relatedProject = `[[${activeFile.basename}]]`;
  });

  // Open the new file in a new tab
  const leaf = app.workspace.splitActiveLeaf();
  await leaf.openFile(newFile);
};
