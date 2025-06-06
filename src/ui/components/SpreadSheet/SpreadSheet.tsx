import React, { useCallback, useRef } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { useJssStyle } from './useJssStyle';
import { useJSuiteStyle } from './useJSuiteStyle';
import * as styles from './SpreadSheet.css';

type SpreadSheetProps = {
  data: any[]; // [key, mode1, mode2, ...]
  columns: { title: string; width: string }[];
  onChange: (index: number, data: any[]) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number) => void;
};

export function SpreadSheet({
  data,
  columns,
  onChange,
  onAddRow,
  onDeleteRow,
}: SpreadSheetProps) {
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
        onChange?.(index, changedData);
      }
    },
    [],
  );

  const handleDeleteRow = useCallback(
    (spreadsheet: jspreadsheet.WorksheetInstance) => {
      const newData = spreadsheet.getData();
      const oldData = prevData.current;
      const index = newData.findIndex((_, i) => {
        return newData[i].some((v, j) => v !== oldData[i][j]);
      });
      if (index > -1) {
        onDeleteRow?.(index);
      }
    },
    [],
  );

  const contextmenu = (o, x, y, e, _, section) => {
    // Reset all items
    const items = [];
    items.push({
      title: 'Delete Row',
      onclick: function () {
        o.deleteRow(parseInt(y));
        onDeleteRow(parseInt(y));
      },
    });

    return items;
  };

  return (
    <div className={styles.SpreadSheet}>
      {/**
       * add variable 메뉴 추가하기
       * data를 상태화하고, 필터에 따라 데이터 보여주기
       * query를 props로 받고
       * 변경에 따라 spreadsheet.current[0].search('app') 실행
       */}
      <Spreadsheet
        ref={spreadsheetRef}
        tabs={false}
        toolbar={false}
        contextMenu={contextmenu}
        allowDeleteWorksheet={false}
        allowRenameWorksheet={false}
        allowMoveWorksheet={false}
        allowCreateWorksheet={false}
        allowAddWorksheet={false}
        search={true}
        onbeforechange={handleBeforeChange}
        onchange={handleChange}
        onbeforedeleterow={handleBeforeChange}
        ondeleterow={handleDeleteRow}
      >
        <Worksheet
          minDimensions={[2, 6]}
          allowComments={false}
          data={data}
          columns={columns}
        />
      </Spreadsheet>
    </div>
  );
}
