import React, { useCallback, useRef } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { useJssStyle } from './useJssStyle';
import { useJSuiteStyle } from './useJSuiteStyle';
import * as styles from './SpreadSheet.css';

type SpreadSheetProps = {
  data: any[]; // [key, mode1, mode2, ...]
  columns: { title: string; width: string }[];
  onChange: (data: any[], index: number) => void;
};

export function SpreadSheet({ data, columns, onChange }: SpreadSheetProps) {
  const spreadsheetRef = useRef<jspreadsheet.WorksheetInstance>();
  const prevData = useRef<any[]>([]);

  useJssStyle();
  useJSuiteStyle();

  const handleBeforeChange = useCallback(
    (spreadsheet: jspreadsheet.WorksheetInstance) => {
      prevData.current = spreadsheet.getData();
    },
    [],
  );

  const handleChange = useCallback(
    (spreadsheet: jspreadsheet.WorksheetInstance) => {
      const newData = spreadsheet.getData();
      const oldData = prevData.current;
      const index = newData.findIndex((_, i) => {
        return newData[i].some((v, j) => v !== oldData[i][j]);
      });
      const changedData = newData[index];
      if (changedData) {
        onChange?.(changedData, index);
      }
    },
    [],
  );

  return (
    <div className={styles.SpreadSheet}>
      <Spreadsheet
        ref={spreadsheetRef}
        tabs={false}
        toolbar={false}
        allowDeleteWorksheet={false}
        allowRenameWorksheet={false}
        allowMoveWorksheet={false}
        allowCreateWorksheet={false}
        allowAddWorksheet={false}
        onchange={handleChange}
        onbeforechange={handleBeforeChange}
      >
        <Worksheet
          minDimensions={[2, 6]}
          allowComments={false}
          allowMoveWorksheet={false}
          data={data}
          columns={columns}
        />
      </Spreadsheet>
    </div>
  );
}
