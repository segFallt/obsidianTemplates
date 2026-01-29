const addMetaBindButton = async () => {
  // Ensure Meta Bind Plugin is available
  const metaBindPlugin = app.plugins.getPlugin('obsidian-meta-bind-plugin');
  if (!metaBindPlugin) {
    new Notice('Meta Bind plugin not found.');
    return;
  }

  // Define button configuration
  const buttonConfig = {
    label: "Create Project Note",
    style: "primary",
    action: {
      type: "js",
      file: "utility/scripts/quickadd/trigger_quickadd_create_project_note.js",
    }
  };

  // Add button to the current note
  const activeFile = app.workspace.getActiveFile();
  if (activeFile) {
    await metaBindPlugin.api.addButtonToNote({
      file: activeFile,
      button: buttonConfig
    });
    new Notice('Button added to the note.');
  } else {
    new Notice('No active file found.');
  }
};

addMetaBindButton();