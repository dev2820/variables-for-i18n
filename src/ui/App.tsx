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

Channel.init();

function App() {
  const [jsonStr, setJsonStr] = useState<string>('');
  const [searchStr, setSearchStr] = useState<string>('');
  const { isLoaded, modes, vars } = useI18nVariables();
  // util과 hook으로 분리 필요
  useEffect(() => {
    // 브라우저(iframe)에서 'message' 이벤트(= figma.ui.postMessage()) 수신
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.SuccessToJSON, (payload) => {
        const result = payload as string;
        setJsonStr(result);
      }),
    );

    return () => {
      removeListeners.forEach((l) => l());
    };
  }, []);

  const handleClickExtractEn = (e: MouseEvent<HTMLButtonElement>) => {
    const modeId = e.currentTarget.dataset['mode'];
    Channel.sendMessage(EventType.RequestToJSON, { modeId: modeId });
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
  };

  const handleClickDeleteCell = (e: MouseEvent<HTMLButtonElement>) => {
    Channel.sendMessage(EventType.DeleteVariable, {
      key: e.currentTarget.dataset['id'],
    });
  };

  const handleClickCreateDefaultI18n = () => {
    Channel.sendMessage(EventType.CreateDefaultVariable);
  };

  if (!isLoaded) {
    return <div>Please create a variable collection called 'i18n' first</div>;
  }
  return (
    <div className={themeClass}>
      <SearchInput
        id="search"
        placeholder="search"
        className={styles.SearchInput}
        onChange={(e) => setSearchStr(e.target.value)}
      />
      <Table.Root className={styles.VariablesTable}>
        <Table.Head>
          <Table.Row>
            <Table.Header className={styles.CellKeyHeader}>Key</Table.Header>
            {modes.map((m) => (
              <Table.Header key={m.name}>{m.name}</Table.Header>
            ))}
            <Table.Header className={styles.CellDeleteHeader}>
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
                <Table.Cell>
                  <div onClick={handleClickCell} data-type="key" data-id={r.id}>
                    {r.name}
                  </div>
                </Table.Cell>
                {Object.entries(r.valuesByMode).map((entry) => (
                  <Table.Cell key={entry[0]}>
                    {
                      <div
                        onClick={handleClickCell}
                        data-type="value"
                        data-mode={entry[0]}
                        data-id={r.id}
                      >
                        {entry[1]}
                      </div>
                    }
                  </Table.Cell>
                ))}
                <Table.Cell>
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
            <Table.Cell colSpan={modes.length + 2}>
              <button onClick={handleClickCreateDefaultI18n}>+ Add i18n</button>
            </Table.Cell>
          </Table.Row>
        </Table.Foot>
      </Table.Root>

      <section>
        <h3>Export Result</h3>
        <menu className={styles.ExtractMenu}>
          {modes.map((mode) => (
            <li key={mode.modeId}>
              <Button onClick={handleClickExtractEn} data-mode={mode.modeId}>
                Extract JSON ({mode.name})
              </Button>
            </li>
          ))}
        </menu>
        <pre className={styles.CodeBlock}>
          <code>{jsonStr}</code>
        </pre>
      </section>
      <input
        ref={inputRef}
        className={styles.CellEditor}
        onKeyDown={handleKeyDownCell}
        onBlur={handleBlurCell}
      />
      <Corner ref={cornerRef} {...cornerHandlers} />
    </div>
  );
}

export default App;
