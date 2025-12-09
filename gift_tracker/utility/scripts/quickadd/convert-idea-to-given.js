// convert-idea-to-given.js
// Creates a new Gift Given note from an existing Gift Idea
// Copies individuals, occasion, estimated-cost -> cost, url, notes, store
// Sets from-idea link to original idea
// Pre-populates gift name with idea name
// Sets friendlyName with user-entered name

module.exports = async (params) => {
  const { app, quickAddApi } = params;

  // Get the active file (should be a gift idea)
  const activeFile = app.workspace.getActiveFile();
  if (!activeFile) {
    new Notice('No active file. Open a gift idea first.');
    return;
  }

  // Get metadata from the idea
  const metadata = app.metadataCache.getFileCache(activeFile);
  if (!metadata?.frontmatter) {
    new Notice('No frontmatter found in this file.');
    return;
  }

  const fm = metadata.frontmatter;

  // Verify this is a gift idea
  const tags = fm.tags || [];
  const isGiftIdea = tags.some(t => t === '#gift-idea' || t === 'gift-idea');
  if (!isGiftIdea) {
    new Notice('This file is not a gift idea. Open a gift idea to convert it.');
    return;
  }

  // Pre-populate name prompt with idea name (use friendlyName if available, else basename)
  const defaultName = fm.friendlyName || activeFile.basename;
  const giftName = await quickAddApi.inputPrompt("Gift name:", defaultName);
  if (!giftName) {
    new Notice('Conversion cancelled.');
    return;
  }

  // Create unique filename
  const targetFolder = "gifts/given";
  let uniquePath = `${targetFolder}/${giftName}.md`;

  // Check if file exists and add numeral suffix if needed
  let counter = 1;
  while (await app.vault.adapter.exists(uniquePath)) {
    counter++;
    uniquePath = `${targetFolder}/${giftName} ${counter}.md`;
  }

  // Ensure folder exists
  const folderPath = targetFolder;
  if (!await app.vault.adapter.exists(folderPath)) {
    await app.vault.createFolder(folderPath);
  }

  // Read the Gift Given template
  const templatePath = "utility/templates/New Gift Given.md";
  const templateFile = app.vault.getAbstractFileByPath(templatePath);
  if (!templateFile) {
    new Notice('Gift Given template not found.');
    return;
  }

  let templateContent = await app.vault.read(templateFile);

  // Replace Templater date placeholder with current date
  const today = new Date().toISOString().split('T')[0];
  templateContent = templateContent.replace(/<% tp\.date\.now\(\) %>/g, today);

  // Create the new file
  const newFile = await app.vault.create(uniquePath, templateContent);

  // Update frontmatter with data from the idea
  await app.fileManager.processFrontMatter(newFile, (newFm) => {
    // Set friendlyName with user's entered name
    newFm.friendlyName = giftName;

    // Copy individuals
    if (fm.individuals) {
      newFm.individuals = fm.individuals;
    }

    // Copy occasion
    if (fm.occasion) {
      newFm.occasion = fm.occasion;
    }

    // Copy estimated-cost to cost
    if (fm['estimated-cost']) {
      newFm.cost = fm['estimated-cost'];
    }

    // Copy url
    if (fm.url) {
      newFm.url = fm.url;
    }

    // Copy store if present
    if (fm.store) {
      newFm.store = fm.store;
    }

    // Copy notes
    if (fm.notes) {
      newFm.notes = fm.notes;
    }

    // Set from-idea link
    newFm['from-idea'] = `[[${activeFile.basename}]]`;
  });

  // Open the new file in a new tab
  const leaf = app.workspace.getLeaf('tab');
  await leaf.openFile(newFile);

  new Notice(`Created gift given: ${giftName}`);
};
