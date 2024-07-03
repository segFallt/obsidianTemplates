const triggerQuickAddAction = async () => {
    const actionName = "Create Project Note";  // Change this to any action you want to trigger
  
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
  