import React, {
  useRef,
  useState,
  type MouseEvent,
  type FocusEvent,
  type KeyboardEvent,
  useMemo,
} from 'react';
import { Button } from './components/Button';
import EventType from '../shared/event-type';
import { Channel } from './utils/channel';
import styles from './App.css';
import { useI18nVariables } from './hooks/useI18nVariables';
import { Table } from './components/Table/Table';
import { themeClass } from './theme.css';
import * as patterns from './pattern.css';
import { Corner } from './components/Corner/Corner';
import { useResizeCorner } from './hooks/useResizeCorner';
import { SearchInput } from './components/Input/SearchInput';
import { cn } from './utils/cn';
import { fullStyle } from './atom.css';
import { Dialog } from './components/Dialog/Dialog';
import { useDialog } from './hooks/useDialog';
import { copyContentOfNode } from './utils/copy';
import { prettyPrintJson } from './utils/pretty-print-json';
import { Mode } from '@/shared/types/mode';
import { varsToJson } from '@/shared/utils/vars-to-json';
import { SpreadSheet } from './components/SpreadSheet/SpreadSheet';

Channel.init();

function App() {
  const [json, setJson] = useState<object>({});
  const [currentMode, setCurrentMode] = useState<Mode['modeId'] | undefined>(
    undefined,
  );

  const [searchStr, setSearchStr] = useState<string>('');
  const { ref: copyJsonDialogRef, onClose: onCloseDialog } = useDialog();
  const { isLoaded, modes, vars } = useI18nVariables();
  const [isCheckedOnlySearchedResult, setIsCheckedOnlySearchedResult] =
    useState<boolean>(true);

  const filteredJson = useMemo(() => {
    if (!isCheckedOnlySearchedResult) return varsToJson(vars, currentMode);
    else {
      if (searchStr.length <= 0) {
        return varsToJson(vars, currentMode);
      }

      return varsToJson(
        vars.filter((r) => {
          if (searchStr.length > 0) {
            if (r.name.indexOf(searchStr) >= 0) return true;
            return Object.values(r.valuesByMode).some(
              (v) => v.toString().indexOf(searchStr) >= 0,
            );
          }
          return true;
        }),
        currentMode,
      );
    }
  }, [json, isCheckedOnlySearchedResult, searchStr, currentMode]);

  const handleClickExtract = (e: MouseEvent<HTMLButtonElement>) => {
    const modeId = e.currentTarget.dataset['modeId'];
    setCurrentMode(modeId);
    setJson(varsToJson(vars, modeId));
    copyJsonDialogRef.current.showModal();
  };

  const cornerRef = useRef<HTMLDivElement>(null);

  const cornerHandlers = useResizeCorner();

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClickCell = (e: MouseEvent<HTMLElement>) => {
    if (!inputRef.current) {
      return;
    }

    const $target = e.currentTarget;
    const value = $target.textContent;
    const typeOfCell = $target.dataset['type'];
    const idOfCell = $target.dataset['id'];

    const rect = $target.getBoundingClientRect();
    inputRef.current.value = value;
    inputRef.current.style.left = `${rect.left}px`;
    inputRef.current.style.top = `${rect.top}px`;
    inputRef.current.style.width = `${rect.width}px`;
    inputRef.current.style.height = `${rect.height}px`;
    inputRef.current.dataset['type'] = typeOfCell;
    inputRef.current.dataset['id'] = idOfCell;
    inputRef.current.dataset['hidden'] = 'false';

    if (typeOfCell === 'value') {
      const mode = $target.dataset['modeId'];
      inputRef.current.dataset['modeId'] = mode;
    }
  };

  const handleKeyDownCell = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.currentTarget.blur();
    }
  };
  const handleBlurCell = (e: FocusEvent<HTMLInputElement>) => {
    const $target = e.currentTarget;
    if (!inputRef.current) {
      return;
    }

    if ($target.dataset['type'] === 'key') {
      const value = $target.value;
      const id = $target.dataset['id'];

      Channel.sendMessage(EventType.ChangeVariableName, {
        name: value,
        key: id,
      });
    } else if ($target.dataset['type'] === 'value') {
      const value = $target.value;
      const id = $target.dataset['id'];
      const modeId = $target.dataset['modeId'];
      Channel.sendMessage(EventType.ChangeVariableValue, {
        value: value,
        key: id,
        mode: modeId,
      });
    }
    inputRef.current.value = '';
    inputRef.current.style.left = `-100%`;
    inputRef.current.style.top = `-100%`;
    inputRef.current.dataset['hidden'] = 'true';
  };

  const handleClickDeleteCell = (e: MouseEvent<HTMLButtonElement>) => {
    Channel.sendMessage(EventType.DeleteVariable, {
      key: e.currentTarget.dataset['id'],
    });
  };

  const handleClickCreateDefaultI18n = () => {
    Channel.sendMessage(EventType.CreateDefaultVariable);
  };

  const handleClickOutside = (e: MouseEvent<HTMLElement>) => {
    if (inputRef.current) {
      if (inputRef.current.dataset['hidden'] !== 'true') {
        if (e.target !== inputRef.current) {
          inputRef.current.dataset['hidden'] = 'true';
          inputRef.current.value = '';
          inputRef.current.style.left = `-100%`;
          inputRef.current.style.top = `-100%`;
        }
      }
    }
  };

  const toggleCopyOnlyTheSearched = () => {
    setIsCheckedOnlySearchedResult((isChecked) => !isChecked);
  };

  const handleChangeSpreadSheet = (data: any[]) => {
    console.log(data);
  };

  if (!isLoaded) {
    return <div>Please create a variable collection called 'i18n' first</div>;
  }

  const columns = [
    { title: 'Key', width: '300px' },
    ...modes.map((mode) => ({
      title: mode.name,
      width: '100px',
    })),
  ];

  return (
    <div
      id="app"
      className={cn(themeClass, styles.Root)}
      onClickCapture={handleClickOutside}
    >
      <section>
        <menu className={styles.ExtractMenu}>
          {modes.map((mode) => (
            <li key={mode.modeId}>
              <Button.Primary
                onClick={handleClickExtract}
                data-mode-id={mode.modeId}
              >
                Extract JSON ({mode.name})
              </Button.Primary>
            </li>
          ))}
        </menu>
      </section>
      <SearchInput
        id="search"
        placeholder="search"
        className={styles.SearchInput}
        onChange={(e) => setSearchStr(e.target.value)}
      />
      <div className={styles.VariablesContainer}>
        <SpreadSheet
          data={vars}
          columns={columns}
          onChange={handleChangeSpreadSheet}
        />
        <Table.Root className={styles.VariablesTable}>
          <Table.Head className={styles.VariablesTableHead}>
            <Table.Row>
              <Table.Header className={cn(styles.VariablesKeyColumn)}>
                Key
              </Table.Header>
              {modes.map((m) => (
                <Table.Header
                  key={m.name}
                  className={styles.VariablesModeColumn}
                >
                  {m.name}
                </Table.Header>
              ))}
              <Table.Header className={styles.VariablesDelColumn}>
                Delete
              </Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {vars
              .filter((r) => {
                if (searchStr.length > 0) {
                  if (r.name.indexOf(searchStr) >= 0) return true;
                  return Object.values(r.valuesByMode).some(
                    (v) => v.toString().indexOf(searchStr) >= 0,
                  );
                }
                return true;
              })
              .map((r) => (
                <Table.Row key={r.id}>
                  <Table.Cell className={styles.VariablesKeyColumn}>
                    <div
                      onClick={handleClickCell}
                      data-type="key"
                      data-id={r.id}
                    >
                      {r.name}
                    </div>
                  </Table.Cell>
                  {modes.map((mode) => (
                    <Table.Cell
                      key={r.valuesByMode[mode.modeId] as string}
                      className={styles.VariablesModeColumn}
                    >
                      {
                        <div
                          onClick={handleClickCell}
                          data-type="value"
                          data-mode-id={mode.modeId}
                          data-id={r.id}
                          className={fullStyle}
                        >
                          {r.valuesByMode[mode.modeId]}
                        </div>
                      }
                    </Table.Cell>
                  ))}
                  <Table.Cell className={styles.VariablesDelColumn}>
                    {
                      <button
                        className={styles.CellDeleteBtn}
                        onClick={handleClickDeleteCell}
                        data-id={r.id}
                      >
                        Del
                      </button>
                    }
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
          <Table.Foot className={styles.VariablesTableFooter}>
            <Table.Row>
              <Table.Cell className={fullStyle}>
                <button
                  className={styles.AddDefaultI18nBtn}
                  onClick={handleClickCreateDefaultI18n}
                >
                  + Add i18n
                </button>
              </Table.Cell>
            </Table.Row>
          </Table.Foot>
        </Table.Root>
      </div>
      <input
        ref={inputRef}
        className={styles.CellEditor}
        onKeyDown={handleKeyDownCell}
        onBlur={handleBlurCell}
        data-hidden="true"
      />
      <Dialog.Root ref={copyJsonDialogRef}>
        <Dialog.Header>
          <Dialog.CloseButton onClick={onCloseDialog}>X</Dialog.CloseButton>
          <Dialog.Title>Variables to JSON</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className={cn(patterns.Display.flex, patterns.FlexCol)}>
          <label>
            Copy only the search results
            <input
              type="checkbox"
              name="copy-only-the-searched"
              onChange={toggleCopyOnlyTheSearched}
              checked={isCheckedOnlySearchedResult}
            />
          </label>
          <div className={cn(patterns.Display.flex, patterns.FlexRowReverse)}>
            <Button.Primary
              type="button"
              onClick={() => copyContentOfNode('#extract-result > code')}
            >
              Copy
            </Button.Primary>
          </div>
          <pre id="extract-result" className={styles.CodeBlock}>
            <h3>preview</h3>
            <code>{prettyPrintJson(filteredJson)}</code>
          </pre>
        </Dialog.Body>
        <Dialog.Footer>
          <button onClick={onCloseDialog}>Close</button>
        </Dialog.Footer>
      </Dialog.Root>
      <Corner ref={cornerRef} {...cornerHandlers} />
    </div>
  );
}

export default App;
