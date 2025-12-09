// create-gift-received.js
// Creates a new Gift Received with friendlyName set to user-entered name

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  // Prompt for name
  const itemName = await quickAddApi.inputPrompt("Gift name:");
  if (!itemName) {
    new Notice('Creation cancelled.');
    return;
  }

  // Determine unique path with numeral suffix if needed
  const folder = "gifts/received";
  let uniquePath = `${folder}/${itemName}.md`;
  let counter = 1;
  while (await app.vault.adapter.exists(uniquePath)) {
    counter++;
    uniquePath = `${folder}/${itemName} ${counter}.md`;
  }

  // Ensure folder exists
  if (!await app.vault.adapter.exists(folder)) {
    await app.vault.createFolder(folder);
  }

  // Read template
  const templatePath = "utility/templates/New Gift Received.md";
  const templateFile = app.vault.getAbstractFileByPath(templatePath);
  if (!templateFile) {
    new Notice('Gift Received template not found.');
    return;
  }
  let content = await app.vault.read(templateFile);

  // Replace Templater date placeholder with current date
  const today = new Date().toISOString().split('T')[0];
  content = content.replace(/<% tp\.date\.now\(\) %>/g, today);

  // Create file
  const newFile = await app.vault.create(uniquePath, content);

  // Set friendlyName with user's original entry
  await app.fileManager.processFrontMatter(newFile, (fm) => {
    fm.friendlyName = itemName;
  });

  // Open file
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newFile);

  new Notice(`Created gift received: ${itemName}`);
};
