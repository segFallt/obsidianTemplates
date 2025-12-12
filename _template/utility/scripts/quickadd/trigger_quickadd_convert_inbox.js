const triggerQuickAddAction = async () => {
  const actionName = "Convert Inbox to Project";

  // Access QuickAdd plugin
  const quickAddPlugin = app.plugins.getPlugin("quickadd");

  if (!quickAddPlugin) {
    new Notice('QuickAdd plugin not found.');
    return;
  }

  const quickAddApi = quickAddPlugin.api;
  if (!quickAddApi) {
    new Notice('QuickAdd API not found.');
    return;
  }

  await quickAddApi.executeChoice(actionName);
};

triggerQuickAddAction();
