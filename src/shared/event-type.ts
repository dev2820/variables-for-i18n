const EventType = {
  CheckPermission: 'CheckPermission',
  UserPermission: 'UserPermission',
  ResizeWindow: 'ResizeWindow',
  RequestToJSON: 'RequestToJSON',
  SuccessToJSON: 'SuccessToJSON',
  RequestLoadCollectionData: 'RequestLoadCollectionData',
  ResponseLoadCollectionData: 'ResponseLoadCollectionData',
  ChangeVariableValue: 'ChangeVariableValue',
  ChangeVariableName: 'ChangeVariableName',
  CreateVariable: 'CreateVariable',
  CreateDefaultVariable: 'CreateDefaultVariable',
  DeleteVariable: 'DeleteVariable',
  LoadedLocalVariableTable: 'LoadedLocalVariableTable',
} as const;

export default EventType;
