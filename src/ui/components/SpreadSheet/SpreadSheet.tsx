import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import { useJssStyle } from './useJssStyle';
import { useJSuiteStyle } from './useJSuiteStyle';
import * as styles from './SpreadSheet.css';
import { Button } from '../Button';
import { Collection } from '@/shared/types/collection';

type SpreadSheetProps = {
  collections: Collection[]; // [key, mode1, mode2, ...]
  onChange: (collectionId: string, index: number, data: any[]) => void;
  onAddRow: () => void;
  onDeleteRow: (collectionId: string, index: number, numOfRows: number) => void;
  query?: string;
  canEdit: boolean;
};

export function SpreadSheet({
  collections,
  onChange,
  onAddRow,
  onDeleteRow,
  query,
  canEdit,
}: SpreadSheetProps) {
  const spreadsheetRef = useRef<jspreadsheet.WorksheetInstance[] | undefined>();
  const prevData = useRef<{ rows: VariableValue[][]; name: string }[]>([]);

  const data = useMemo(() => {
    return collections.map((collection) => {
      const variables = collection.variables;
      return {
        name: collection.name,
        rows: variables.map((v) => [
          v.name,
          ...collection.modes.map((m) => v.valuesByMode[m.modeId]),
        ]),
      };
    });
  }, [collections]);

  const columnList = useMemo(() => {
    return collections.map((c) => {
      return [
        { title: 'Key', width: '300px' },
        ...c.modes.map((mode) => ({
          title: mode.name,
          width: '200px',
        })),
      ];
    });
  }, [collections]);

  useJssStyle();
  useJSuiteStyle();

  useEffect(() => {
    if (spreadsheetRef.current) {
      prevData.current = data;
      spreadsheetRef.current.forEach((worksheet, index) => {
        worksheet.setData(data[index].rows as string[][]);
      });
    }
  }, [data]);

  useEffect(() => {
    if (spreadsheetRef.current) {
      spreadsheetRef.current.forEach((worksheet) => {
        worksheet.search(query);
      });
    }
  }, [query]);

  const handleBeforeChange = useCallback(
    (spreadsheet: jspreadsheet.WorksheetInstance) => {
      const worksheetName = spreadsheet.options.worksheetName;
      const target = prevData.current.find(
        (sheet) => sheet.name === worksheetName,
      );
      if (target) {
        target.rows = spreadsheet.getData();
      }
    },
    [],
  );

  const handleChange = useCallback(
    (spreadsheet: jspreadsheet.WorksheetInstance) => {
      const worksheetName = spreadsheet.options.worksheetName;
      const collectionId = collections.find(
        (c) => c.name === worksheetName,
      )?.id;
      const oldData = prevData.current.find(
        (c) => c.name === worksheetName,
      )?.rows;
      const newData = spreadsheet.getData();
      const index = newData.findIndex((_, i) => {
        return newData[i].some((v, j) => v !== oldData[i][j]);
      });
      const changedData = newData[index];
      if (changedData) {
        onChange?.(collectionId, index, changedData);
      }
    },
    [],
  );

  const contextmenu = (o, x, y, e, items, section) => {
    // Reset all items
    items = [];

    if (section === 'tabs') return false;
    if (!canEdit) return false;
    const worksheetName = o.options.worksheetName;
    const collectionId = collections.find((c) => c.name === worksheetName)?.id;

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
        onDeleteRow(collectionId, parseInt(y1, 10), numOfRows);
      },
    });

    return items;
  };

  return (
    <div className={styles.SpreadSheet}>
      <div className={styles.SpreadSheetContainer}>
        <Spreadsheet
          ref={spreadsheetRef}
          tabs={true}
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
          {data.map((d, index) => {
            return (
              <Worksheet
                key={d.name}
                minDimensions={[1, 1]}
                allowComments={false}
                data={d.rows}
                columns={columnList[index]}
                worksheetName={d.name}
                worksheetId={d.name}
              />
            );
          })}
        </Spreadsheet>
      </div>
      {canEdit && (
        <Button.Neutral onClick={onAddRow}>Add Variable</Button.Neutral>
      )}
    </div>
  );
}
