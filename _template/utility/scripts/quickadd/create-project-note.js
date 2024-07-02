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
    
    // Function to format the current date and time
    const formatDate = () => {
      const now = new Date();
      const pad = (num) => num.toString().padStart(2, '0');
      return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    };
  
    const projectNotePath = `${notesDirectory}/${formatDate()}_ProjectNote.md`;
  
    // Create a new file from the template
    const templateFile = app.vault.getAbstractFileByPath("utility/templates/Project Note.md");
  
    if (!templateFile) {
      new Notice("Template file not found.");
      return;
    }
  
    const templateContent = await app.vault.read(templateFile);
    await app.vault.create(projectNotePath, templateContent);
  
    // Get the newly created file
    const newFile = app.vault.getAbstractFileByPath(projectNotePath);
  
    // Update the frontmatter of the new file
    await app.fileManager.processFrontMatter(newFile, (fm) => {
      fm.relatedProject = `[[${activeFile.basename}]]`;
    });
  
    // Open the new file in a new tab
    const leaf = app.workspace.splitActiveLeaf();
    await leaf.openFile(newFile);
  };
  