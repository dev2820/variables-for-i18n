import React, { useRef } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { useJssStyle } from './useJssStyle';
import { useJSuiteStyle } from './useJSuiteStyle';
import * as styles from './SpreadSheet.css';

type SpreadSheetProps = {
  data: any[];
  columns: { title: string; width: string }[];
  onChange: (data: any[]) => void;
};

export function SpreadSheet({ data, columns, onChange }: SpreadSheetProps) {
  const spreadsheet = useRef();

  useJssStyle();
  useJSuiteStyle();

  return (
    <div className={styles.SpreadSheet}>
      <Spreadsheet
        ref={spreadsheet}
        tabs={false}
        toolbar={false}
        allowDeleteWorksheet={false}
        allowRenameWorksheet={false}
        allowMoveWorksheet={false}
        allowCreateWorksheet={false}
        allowAddWorksheet={false}
        onAfterChange={onChange}
      >
        <Worksheet minDimensions={[2, 6]} columns={columns} />
      </Spreadsheet>
    </div>
  );
}
