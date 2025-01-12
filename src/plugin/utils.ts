export async function loadVariables(variableId: string): Promise<Variable[]> {
  return await figma.variables.getLocalVariablesAsync();
}

export function resolveVariableMode(variableId: Variable['id']) {
  // 1) 변수 객체 찾기
  // const variable = figma.variables.getVariableById(variableId);
  // if (!variable) {
  //   console.log('해당 ID의 변수를 찾을 수 없습니다.', variableId);
  //   return;
  // }
  // const mode = variable.valuesByMode
  // // 2) 컬렉션 → 모드 목록 가져오기
  // const modes = figma.variables.getVariableModes(variable.variableCollectionId);
  // if (modes.length === 0) {
  //   console.log('해당 변수에 모드가 없습니다.');
  //   return;
  // }
  // // 가령 첫 번째 모드의 값을 확인 (실 사용 시엔 각 모드별 반복 처리 가능)
  // const modeId = modes[0].id;
  // // 3) Raw Value or Reference
  // const rawValueOrReference = variable.valuesByMode[modeId];
  // console.log('Raw Value or Reference:', rawValueOrReference);
  // // 4) Resolved Value (최종 해석된 값)
  // const resolvedValue = variable.resolveForMode(modeId);
  // console.log('Resolved Value:', resolvedValue);
  // 예) type에 따라 해석
  //   - variable.resolvedType이 "COLOR"면 RGBA
  //   - "STRING"이면 문자열
  //   - "FLOAT"이면 숫자
  //   - "DIMENSION"이면 { value: number, unit: "PX" | ... } 등
}
