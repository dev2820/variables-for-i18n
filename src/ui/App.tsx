import React, {
  useRef,
  useState,
  type MouseEvent,
  useMemo,
  useCallback,
  Fragment,
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
import { prettyPrintJson } from './utils/pretty-print-json';
import { Mode } from '@/shared/types/mode';
import { varsToJson } from '@/shared/utils/vars-to-json';
import { SpreadSheet } from './components/SpreadSheet/SpreadSheet';
import { useUserPermission } from './hooks/useUserPermission';
import { useI18nCollections } from './hooks/useI18nCollections';

Channel.init();

function App() {
  const [jsonList, setJsonList] = useState<object[]>([]);

  const [searchStr, setSearchStr] = useState<string>('');
  const { ref: copyJsonDialogRef, onClose: onCloseDialog } = useDialog();
  const { canEdit } = useUserPermission();
  const { collections, isLoaded } = useI18nCollections();
  const [currentModeName, setCurrentModeName] = useState<
    Mode['name'] | undefined
  >(undefined);

  const filteredJsonList = useMemo(() => {
    const mode = currentModeName ?? collections[0]?.modes[0].name;
    if (collections.length === 0) return [];
    else {
      if (searchStr.length <= 0) {
        return collections.map((c) => varsToJson(c, mode));
      }

      return collections.map((collection) =>
        varsToJson(collection, mode, (name, value) => {
          if (searchStr.length > 0) {
            if (name.indexOf(searchStr) >= 0) return true;
            return value.indexOf(searchStr) >= 0;
          }
          return true;
        }),
      );
    }
  }, [jsonList, searchStr, currentModeName]);

  const handleClickExtract = (e: MouseEvent<HTMLButtonElement>) => {
    const modeName = e.currentTarget.dataset['modeName'];
    setCurrentModeName(modeName);
    const jsonList = collections.map((collection) =>
      varsToJson(collection, modeName, (name, value) => {
        if (searchStr.length > 0) {
          if (name.indexOf(searchStr) >= 0) return true;
          return value.indexOf(searchStr) >= 0;
        }
        return true;
      }),
    );
    setJsonList(jsonList);
    copyJsonDialogRef.current.showModal();
  };

  const cornerRef = useRef<HTMLDivElement>(null);

  const cornerHandlers = useResizeCorner();

  const handleClickCreateDefaultI18n = (collectionId: string) => {
    Channel.sendMessage(EventType.CreateDefaultVariable, {
      collectionId,
    });
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
    <div id="app" className={cn(themeClass, styles.Root)}>
      <section>
        <menu className={styles.ExtractMenu}>
          {collections[0].modes.map((mode) => (
            <li key={mode.modeId}>
              <Button.Primary
                onClick={handleClickExtract}
                data-mode-name={mode.name}
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
      <Dialog.Root ref={copyJsonDialogRef}>
        <Dialog.Header>
          <Dialog.CloseButton onClick={onCloseDialog}>X</Dialog.CloseButton>
          <Dialog.Title>Variables to JSON</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body className={cn(patterns.Display.flex, patterns.FlexCol)}>
          <pre id="extract-result" className={styles.CodeBlock}>
            <h3>preview</h3>
            {filteredJsonList.map((json, index) => (
              <Fragment key={index}>
                <h4>{collections[index].name}</h4>
                <code key={index}>{prettyPrintJson(json)}</code>
                <br />
              </Fragment>
            ))}
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
