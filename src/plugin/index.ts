import EventType from '../shared/event-type';
import VariableCollectionSchema from './VariableCollectionSchema';

const i18nCollection = new VariableCollectionSchema('i18n');

function showPluginUI() {
  figma.showUI(__html__, {
    width: 800,
    height: 600,
  });
  figma.clientStorage
    .getAsync('size')
    .then((size) => {
      if (size) figma.ui.resize(size.w, size.h);
    })
    .catch((err) => {});
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
    if (msg.type === EventType.CheckPermission) {
      try {
        const collections =
          await figma.variables.getLocalVariableCollectionsAsync();
        if (collections.length > 0) {
          const firstCollection = collections[0];
          const variableIds = firstCollection.variableIds;

          if (variableIds.length > 0) {
            const firstVariable = await figma.variables.getVariableByIdAsync(
              variableIds[0],
            );
            if (firstVariable) {
              const modeId = Object.keys(firstVariable.valuesByMode)[0];
              if (modeId) {
                const originalValue = firstVariable.valuesByMode[modeId];
                firstVariable.setValueForMode(modeId, originalValue);
              }
            }
          }
        }
        figma.ui.postMessage({
          type: EventType.UserPermission,
          payload: true,
        });
      } catch (err) {
        console.log('err', err);
        // no permission
        figma.ui.postMessage({
          type: EventType.UserPermission,
          payload: false,
        });
      }
    }
    if (msg.type === EventType.ResizeWindow) {
      figma.ui.resize(msg.size.w, msg.size.h);
      figma.clientStorage.setAsync('size', msg.size).catch((err) => {}); // save size
    }
    if (msg.type === EventType.RequestLoadCollectionData) {
      const collections = await i18nCollection.getCollections();

      figma.ui.postMessage({
        type: EventType.ResponseLoadCollectionData,
        payload: collections,
      });
    }
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
      const { modeId } = msg.payload;

      let result = '';
      const modes = await i18nCollection.getModes();
      const mode = modes.find((mode) => mode.modeId === modeId);
      if (mode) {
        const jsonStr = await i18nCollection.toJsonStrByMode(mode.modeId);
        result += jsonStr + '\n';

        figma.ui.postMessage({
          type: EventType.SuccessToJSON,
          payload: result,
        });
      }
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
    if (msg.type === EventType.ChangeVariableName) {
      const { key, name } = msg.payload;
      await i18nCollection.updateVariableNameById(key, name);
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
    if (msg.type === EventType.CreateDefaultVariable) {
      await i18nCollection.createDefaultVariable();
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
