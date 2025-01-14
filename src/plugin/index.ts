import EventType from '../shared/event-type';

function showPluginUI() {
  figma.showUI(__html__, {
    width: 400,
    height: 600,
  });
}

async function getModes() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const i18n = collections.find((col) => col.name === 'i18n');
  const { modes } = i18n;

  return modes;
}

async function getLocalVariables() {
  const localVariables = await figma.variables.getLocalVariablesAsync();

  return localVariables;
}
function setup() {
  figma.on('run', async () => {
    showPluginUI();

    const modes = await getModes();
    const localVariables = await getLocalVariables();

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

  figma.ui.onmessage = async (msg) => {
    if (msg.type === EventType.RequestToJSON) {
      /**
       * convert to json
       */
      const modes = await getModes();
      const localVariables = await getLocalVariables();

      const jsonStrEn = convertToJsonStr(localVariables, modes[0]);

      figma.ui.postMessage({
        type: EventType.SuccessToJSON,
        payload: jsonStrEn,
      });
    }
  };
}

function convertToJsonStr(
  variables: Variable[],
  mode: {
    modeId: string;
    name: string;
  },
) {
  const entries = variables.map((variable) => [
    variable.name,
    variable.valuesByMode[mode.modeId],
  ]);

  return `
{
${entries
  .map(([key, value]) => {
    return `  "${key}": "${value}",`;
  })
  .join('\n')}  
}
`;
}

function main() {
  setup();
}

main();
