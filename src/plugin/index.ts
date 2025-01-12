function showPluginUI() {
  figma.showUI(__html__, {
    width: 400,
    height: 600,
  });
}

function setup() {
  figma.on('run', async () => {
    showPluginUI();

    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const i18n = collections.find((col) => col.name === 'i18n');
    const modes = i18n.modes;
    const localVariables = await figma.variables.getLocalVariablesAsync();

    const localVars = localVariables.map((v) => {
      return {
        id: v.id,
        resolvedType: v.resolvedType,
        name: v.name,
        valuesByHeader: v.valuesByMode,
      };
    });

    figma.ui.postMessage({
      type: 'loaded-local-variable-table',
      payload: {
        headers: modes,
        rows: localVars,
      },
    });
  });

  figma.ui.onmessage = (msg) => {
    // handle msg
  };
}

function main() {
  setup();
}

main();
