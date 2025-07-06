import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { useJssStyle } from './useJssStyle';
import { useJSuiteStyle } from './useJSuiteStyle';
import * as styles from './SpreadSheet.css';
import { Button } from '../Button';

type SpreadSheetProps = {
  data: any[]; // [key, mode1, mode2, ...]
  columns: { title: string; width: string }[];
  onChange: (index: number, data: any[]) => void;
  onAddRow: () => void;
  onDeleteRow: (index: number, numOfRows: number) => void;
  query?: string;
  canEdit: boolean;
};

export function SpreadSheet({
  data,
  columns,
  onChange,
  onAddRow,
  onDeleteRow,
  query,
  canEdit,
}: SpreadSheetProps) {
  const spreadsheetRef = useRef<jspreadsheet.WorksheetInstance>();
  const prevData = useRef<any[]>([]);

  useJssStyle();
  useJSuiteStyle();

  useEffect(() => {
    if (spreadsheetRef.current) {
      prevData.current = data;
      spreadsheetRef.current[0].setData(data);
    }
  }, [data]);

  useEffect(() => {
    if (spreadsheetRef.current) {
      spreadsheetRef.current[0].search(query);
    }
  }, [query]);

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

  const contextmenu = (o, x, y, e, items, section) => {
    // Reset all items
    items = [];

    items.push({
      title: 'Delete Row',
      onclick: function () {
        const [_, y1, __, y2] = o.getSelection();
        const numOfRows = y2 - y1 + 1;

        if (o.rows.length === 1 || numOfRows === o.rows.length) {
          alert('Cannot delete the last row');
          return;
        }
        o.deleteRow(parseInt(y1, 10), numOfRows);
        onDeleteRow(parseInt(y1, 10), numOfRows);
      },
    });

    return items;
  };

  return (
    <div className={styles.SpreadSheet}>
      <div className={styles.SpreadSheetContainer}>
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
          allowDeleteColumn={false}
          allowInsertColumn={false}
          allowInsertRow={false}
          allowManualInsertColumn={false}
          allowManualInsertRow={false}
          allowSelect={false}
          search={true}
          onbeforechange={handleBeforeChange}
          onchange={handleChange}
          onbeforedeleterow={handleBeforeChange}
        >
          <Worksheet
            minDimensions={[1, 1]}
            allowComments={false}
            data={data}
            columns={columns}
          />
        </Spreadsheet>
      </div>
      {canEdit && (
        <Button.Neutral onClick={onAddRow}>Add Variable</Button.Neutral>
      )}
    </div>
  );
}
