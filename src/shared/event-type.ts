const EventType = {
  RequestToJSON: 'RequestToJSON',
  SuccessToJSON: 'SuccessToJSON',
  ChangeVariableValue: 'ChangeVariableValue',
  DeleteVariable: 'DeleteVariable',
  LoadedLocalVariableTable: 'LoadedLocalVariableTable',
} as const;

export default EventType;
