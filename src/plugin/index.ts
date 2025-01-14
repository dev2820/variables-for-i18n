import EventType from '../shared/event-type';

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
    const { modes } = i18n;
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
      type: EventType.LoadedLocalVariableTable,
      payload: {
        headers: modes,
        rows: localVars,
      },
    });
  });

  figma.ui.onmessage = (msg) => {
    if (msg.type === EventType.CopyEnRequest) {
      figma.ui.postMessage({
        type: EventType.CopyEnSuccess,
      });
    }
  };
}

function main() {
  setup();
}

main();
