const EventType = {
  RequestToJSON: 'RequestToJSON',
  SuccessToJSON: 'SuccessToJSON',
  RequestLoadVariableData: 'RequestLoadVariableData',
  UpdateVariableData: 'UpdateVariableData',
  ChangeVariableValue: 'ChangeVariableValue',
  CreateVariable: 'CreateVariable',
  DeleteVariable: 'DeleteVariable',
  LoadedLocalVariableTable: 'LoadedLocalVariableTable',
} as const;

export default EventType;
