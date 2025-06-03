import React, { useRef } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { useJssStyle } from './useJssStyle';
import { useJSuiteStyle } from './useJSuiteStyle';

export function SpreadSheet() {
  const spreadsheet = useRef();

  useJssStyle();
  useJSuiteStyle();

  return (
    <div>
      <Spreadsheet
        ref={spreadsheet}
        tabs={false}
        toolbar={false}
        allowDeleteWorksheet={false}
        allowRenameWorksheet={false}
        allowMoveWorksheet={false}
        allowCreateWorksheet={false}
        allowAddWorksheet={false}
      >
        <Worksheet minDimensions={[6, 6]} />
      </Spreadsheet>
    </div>
  );
}
