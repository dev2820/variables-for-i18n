import React, {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { Button } from './components/Button/Button';
import EventType from '../shared/event-type';
import { Channel } from './utils/channel';
import styles from './App.css';
import { useI18nVariables } from './hooks/useI18nVariables';
import { Table } from './components/Table/Table';
import { themeClass } from './theme.css';
import { Corner } from './components/Corner/Corner';
import { useResizeCorner } from './hooks/useResizeCorner';
import { SearchInput } from './components/Input/SearchInput';
import { cn } from './utils/cn';
import { fullStyle } from './atom.css';
import { Dialog } from './components/Dialog/Dialog';
import { useDialog } from './hooks/useDialog';
import { copyContentOfNode } from './utils/copy';

Channel.init();

function App() {
  const [jsonStr, setJsonStr] = useState<string>('');
  const [searchStr, setSearchStr] = useState<string>('');
  const { ref: copyJsonDialogRef, onClose: onCloseDialog } = useDialog();
  const { isLoaded, modes, vars } = useI18nVariables();
  // util과 hook으로 분리 필요
  useEffect(() => {
    // 브라우저(iframe)에서 'message' 이벤트(= figma.ui.postMessage()) 수신
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.SuccessToJSON, async (payload) => {
        const result = payload as string;
        setJsonStr(result);
      }),
    );

    return () => {
      removeListeners.forEach((l) => l());
    };
  }, []);

  const handleClickExtract = (e: MouseEvent<HTMLButtonElement>) => {
    const modeId = e.currentTarget.dataset['mode'];
    Channel.sendMessage(EventType.RequestToJSON, { modeId: modeId });

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
      const mode = $target.dataset['mode'];
      inputRef.current.dataset['mode'] = mode;
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
      const mode = $target.dataset['mode'];

      Channel.sendMessage(EventType.ChangeVariableValue, {
        value: value,
        key: id,
        mode: mode,
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
          {modes.map((mode) => (
            <li key={mode.modeId}>
              <Button onClick={handleClickExtract} data-mode={mode.modeId}>
                Extract JSON ({mode.name})
              </Button>
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
        <Table.Root className={styles.VariablesTable}>
          <Table.Head>
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
                  {Object.entries(r.valuesByMode).map((entry) => (
                    <Table.Cell
                      key={entry[0]}
                      className={styles.VariablesModeColumn}
                    >
                      {
                        <div
                          onClick={handleClickCell}
                          data-type="value"
                          data-mode={entry[0]}
                          data-id={r.id}
                          className={fullStyle}
                        >
                          {entry[1]}
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
          <Table.Foot>
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
        <Dialog.Body>
          <pre id="extract-result" className={styles.CodeBlock}>
            <code>{jsonStr}</code>
          </pre>
        </Dialog.Body>
        <Dialog.Footer>
          <button onClick={() => copyContentOfNode('#extract-result')}>
            Copy
          </button>
          <button onClick={onCloseDialog}>Close</button>
        </Dialog.Footer>
      </Dialog.Root>
      <Corner ref={cornerRef} {...cornerHandlers} />
    </div>
  );
}

export default App;
