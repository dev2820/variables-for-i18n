import EventType from '../shared/event-type';
import VariableCollectionSchema from './VariableCollectionSchema';

const i18nCollection = new VariableCollectionSchema('i18n');

function showPluginUI() {
  figma.showUI(__html__, {
    width: 800,
    height: 600,
  });
}

const toVariableData = (variable: Variable) => {
  return {
    id: variable.id,
    resolvedType: variable.resolvedType,
    name: variable.name,
    key: variable.key,
    description: variable.description,
    valuesByMode: variable.valuesByMode,
  };
};
function setup() {
  figma.on('run', async () => {
    showPluginUI();
  });

  figma.ui.onmessage = async (msg) => {
    if (msg.type === EventType.RequestLoadVariableData) {
      const modes = await i18nCollection.getModes();
      const vars = await i18nCollection.getVariables();

      figma.ui.postMessage({
        type: EventType.UpdateVariableData,
        payload: {
          modes: modes,
          vars: vars.map(toVariableData),
        },
      });
    }
    if (msg.type === EventType.RequestToJSON) {
      /**
       * convert to json
       */
      const modes = await i18nCollection.getModes();

      let result = '';
      for (const mode of modes) {
        const jsonStr = await i18nCollection.toJsonStrByMode(mode.modeId);
        result += `/* ${mode.name} */` + jsonStr + '\n';
      }

      figma.ui.postMessage({
        type: EventType.SuccessToJSON,
        payload: result,
      });
    }
    if (msg.type === EventType.ChangeVariableValue) {
      const { key, mode, value } = msg.payload;
      await i18nCollection.updateVariableById(key, mode, value);
      const modes = await i18nCollection.getModes();
      const vars = await i18nCollection.getVariables();

      figma.ui.postMessage({
        type: EventType.UpdateVariableData,
        payload: {
          modes: modes,
          vars: vars.map(toVariableData),
        },
      });
    }
    if (msg.type === EventType.CreateVariable) {
      const { name, valuesByMode } = msg.payload;
      await i18nCollection.createVariable(name, valuesByMode);
      const modes = await i18nCollection.getModes();
      const vars = await i18nCollection.getVariables();

      figma.ui.postMessage({
        type: EventType.UpdateVariableData,
        payload: {
          modes: modes,
          vars: vars.map(toVariableData),
        },
      });
    }
    if (msg.type === EventType.DeleteVariable) {
      const { key } = msg.payload;
      await i18nCollection.deleteVariableById(key);
      const modes = await i18nCollection.getModes();
      const vars = await i18nCollection.getVariables();

      figma.ui.postMessage({
        type: EventType.UpdateVariableData,
        payload: {
          modes: modes,
          vars: vars.map(toVariableData),
        },
      });
    }
  };
}

function main() {
  setup();
}

main();
