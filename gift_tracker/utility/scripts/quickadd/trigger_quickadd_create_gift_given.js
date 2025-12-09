const triggerQuickAddAction = async () => {
  const actionName = "Gift Given - New";

  const quickAddPlugin = app.plugins.getPlugin("quickadd");
  if (!quickAddPlugin) {
    new Notice('QuickAdd plugin not found.');
    return;
  }

  const quickAddApi = quickAddPlugin.api;
  await quickAddApi.executeChoice(actionName);
};

triggerQuickAddAction();
