import React, {
  useRef,
  useState,
  type MouseEvent,
  type FocusEvent,
  type KeyboardEvent,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { Button } from './components/Button';
import EventType from '../shared/event-type';
import { Channel } from './utils/channel';
import styles from './App.css';
import { themeClass } from './theme.css';
import * as patterns from './pattern.css';
import { Corner } from './components/Corner/Corner';
import { useResizeCorner } from './hooks/useResizeCorner';
import { SearchInput } from './components/Input/SearchInput';
import { cn } from './utils/cn';
import { Dialog } from './components/Dialog/Dialog';
import { useDialog } from './hooks/useDialog';
import { copyContentOfNode } from './utils/copy';
import { prettyPrintJson } from './utils/pretty-print-json';
import { Mode } from '@/shared/types/mode';
import { varsToJson } from '@/shared/utils/vars-to-json';
import { SpreadSheet } from './components/SpreadSheet/SpreadSheet';
import { useUserPermission } from './hooks/useUserPermission';
import { useI18nCollections } from './hooks/useI18nCollections';

Channel.init();

function App() {
  const [json, setJson] = useState<object>({});
  const [currentMode, setCurrentMode] = useState<Mode['modeId'] | undefined>(
    undefined,
  );

  const [searchStr, setSearchStr] = useState<string>('');
  const { ref: copyJsonDialogRef, onClose: onCloseDialog } = useDialog();
  const { canEdit } = useUserPermission();
  const { collections, isLoaded } = useI18nCollections();
  const [isCheckedOnlySearchedResult, setIsCheckedOnlySearchedResult] =
    useState<boolean>(true);

  const filteredJson = useMemo(() => {
    const vars = collections[0].variables;
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
    setJson(varsToJson(collections[0].variables, modeId));
    copyJsonDialogRef.current.showModal();
  };

  const cornerRef = useRef<HTMLDivElement>(null);

  const cornerHandlers = useResizeCorner();

  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleClickCreateDefaultI18n = (collectionId: string) => {
    Channel.sendMessage(EventType.CreateDefaultVariable, {
      collectionId,
    });
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

  const handleChangeSpreadSheet = useCallback(
    (collectionId: string, index: number, d: string[]) => {
      // 일단 변화는 1개만 일어난다고 가정한다.
      const collection = collections.find((c) => c.id === collectionId);
      const originalData = collection.variables[index];
      const id = originalData.id;
      if (originalData) {
        if (originalData.name !== d[0]) {
          Channel.sendMessage(EventType.ChangeVariableName, {
            name: d[0],
            key: id,
          });
        }
      }
      for (let i = 0; i < collection.modes.length; i++) {
        if (
          d[i + 1] !== originalData.valuesByMode[collection.modes[i].modeId]
        ) {
          Channel.sendMessage(EventType.ChangeVariableValue, {
            value: d[i + 1],
            key: id,
            mode: collection.modes[i].modeId,
          });
        }
      }
    },
    [],
  );

  const handleDeleteRow = (
    collectionId: string,
    index: number,
    numOfRows: number,
  ) => {
    const deletedKeys = [];
    const collection = collections.find((c) => c.id === collectionId);
    for (let i = 0; i < numOfRows; i++) {
      deletedKeys.push(collection.variables[index + i].id);
    }
    Channel.sendMessage(EventType.DeleteVariable, {
      key: deletedKeys,
    });
  };

  if (!isLoaded) {
    return <div>Please create a variable collection called 'i18n' first</div>;
  }
  return (
    <div
      id="app"
      className={cn(themeClass, styles.Root)}
      onClickCapture={handleClickOutside}
    >
      <section>
        <menu className={styles.ExtractMenu}>
          {collections[0].modes.map((mode) => (
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
          canEdit={canEdit}
          collections={collections}
          onChange={handleChangeSpreadSheet}
          onDeleteRow={handleDeleteRow}
          onAddRow={handleClickCreateDefaultI18n}
          query={searchStr}
        />
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
