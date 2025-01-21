class VariableCollectionSchema {
  private collectionName: string;
  private cachedCollectionId: string;
  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async getCollection() {
    const collections =
      await figma.variables.getLocalVariableCollectionsAsync();
    const collection = collections.find(
      (col) => col.name === this.collectionName,
    );

    return collection;
  }

  async getCollectionId() {
    if (this.cachedCollectionId) {
      return this.cachedCollectionId;
    }
    const collection = await this.getCollection();
    const { id } = collection;

    this.cachedCollectionId = id;
    return id;
  }
  async getCollectionName() {
    const collection = await this.getCollection();
    const { name } = collection;

    return name;
  }
  async getModes() {
    const collection = await this.getCollection();
    const { modes } = collection;

    return modes;
  }
  async getVariables() {
    const collectionId = await this.getCollectionId();
    const localVariables = await figma.variables.getLocalVariablesAsync();
    return localVariables.filter(
      (v) => v.variableCollectionId === collectionId,
    );
  }
  async getVariableById(variableKey: Variable['key']) {
    return await figma.variables.getVariableByIdAsync(variableKey);
  }
  async updateVariableById(
    variableKey: Variable['key'],
    modeId: string,
    newValue: VariableValue,
  ) {
    try {
      const variable = await figma.variables.getVariableByIdAsync(variableKey);
      if (!variable) {
        throw Error('variable not found');
      }
      variable.setValueForMode(modeId, newValue);
      return true;
    } catch (err) {
      return false;
    }
  }
  async deleteVariableById(variableKey: Variable['key']) {
    try {
      const variable = await figma.variables.getVariableByIdAsync(variableKey);
      if (variable) {
        variable.remove();
      }
    } catch (err) {
      return false;
    }
  }
  async toJsonStrByMode(modeId: string) {
    const variables = await this.getVariables();
    const entries = variables.map((variable) => [
      variable.name,
      variable.valuesByMode[modeId],
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
}

export default VariableCollectionSchema;
