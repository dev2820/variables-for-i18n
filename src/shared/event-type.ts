const EventType = {
  ResizeWindow: 'ResizeWindow',
  RequestToJSON: 'RequestToJSON',
  SuccessToJSON: 'SuccessToJSON',
  RequestLoadVariableData: 'RequestLoadVariableData',
  UpdateVariableData: 'UpdateVariableData',
  ChangeVariableValue: 'ChangeVariableValue',
  ChangeVariableName: 'ChangeVariableName',
  CreateVariable: 'CreateVariable',
  DeleteVariable: 'DeleteVariable',
  LoadedLocalVariableTable: 'LoadedLocalVariableTable',
} as const;

export default EventType;
