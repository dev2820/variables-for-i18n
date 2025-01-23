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
Channel.init();

function App() {
  const [jsonStr, setJsonStr] = useState<string>('');
  const [searchStr, setSearchStr] = useState<string>('');
  const { isLoaded, modes, vars } = useI18nVariables();
  const [keyStr, setKeyStr] = useState<string>('');
  const [valueStrObj, setValueStrObj] = useState<Record<string, string>>({});
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

  const handleClickExtractEn = () => {
    Channel.sendMessage(EventType.RequestToJSON, '');
  };

  const cornerRef = useRef<HTMLDivElement>(null);

  const cornerHandlers = useResizeCorner();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [cellEditingInfo, setCellEditingInfo] = useState<
    | {
        type: 'value';
        id: string;
        value: string;
        mode: string;
      }
    | {
        type: 'key';
        id: string;
        value: string;
      }
  >({ type: 'key', id: '', value: '' });

  const inputRef = useRef<HTMLInputElement>(null);
  const handleDbClickCell = (e: MouseEvent<HTMLElement>) => {
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

    if (typeOfCell === 'value') {
      const mode = $target.dataset['mode'];
      setCellEditingInfo({
        type: 'value',
        id: idOfCell,
        value,
        mode,
      });
    }
    if (typeOfCell === 'key') {
      setCellEditingInfo({
        type: 'key',
        id: idOfCell,
        value,
      });
    }
    setIsEditing(true);
  };

  const handleKeyDownCell = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setCellEditingInfo({
        ...cellEditingInfo,
        value: e.currentTarget.value,
      });
      setIsEditing(false);
    }
  };
  const handleBlurCell = (e: FocusEvent<HTMLInputElement>) => {
    if (!inputRef.current) {
      return;
    }

    if (cellEditingInfo.type === 'key') {
      const { value, id } = cellEditingInfo;
      Channel.sendMessage(EventType.ChangeVariableName, {
        name: value,
        key: id,
      });
    } else if (cellEditingInfo.type === 'value') {
      const { value, id, mode } = cellEditingInfo;
      Channel.sendMessage(EventType.ChangeVariableValue, {
        value: value,
        key: id,
        mode: mode,
      });
    }
    inputRef.current.value = '';
    inputRef.current.style.left = `-100%`;
    inputRef.current.style.top = `-100%`;

    setIsEditing(false);
  };

  const handleClickDeleteCell = (e: MouseEvent<HTMLButtonElement>) => {
    Channel.sendMessage(EventType.DeleteVariable, {
      key: e.currentTarget.dataset['id'],
    });
  };

  const handleClickCreateCell = () => {
    if (
      Object.values(valueStrObj).some(
        (v) => typeof v !== 'string' || v.length <= 0,
      )
    ) {
      parent.alert('Please fill all field');
    }
    Channel.sendMessage(EventType.CreateVariable, {
      name: keyStr,
      valuesByMode: valueStrObj,
    });
    setKeyStr('');
    setValueStrObj({});
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [isEditing]);

  if (!isLoaded) {
    return <div>loading...</div>;
  }
  return (
    <div className={themeClass}>
      <menu>
        <li>
          <Button onClick={handleClickExtractEn}>Extract En</Button>
        </li>
      </menu>
      <fieldset>
        <label htmlFor="search">Search</label>
        <input
          id="value"
          type="text"
          onChange={(e) => setSearchStr(e.target.value)}
        />
      </fieldset>
      <Table.Root className={styles.VariablesTable}>
        <Table.Head>
          <Table.Row>
            <Table.Header>Key</Table.Header>
            {modes.map((m) => (
              <Table.Header key={m.name}>{m.name}</Table.Header>
            ))}
            <Table.Header>Delete</Table.Header>
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
                  <div
                    onDoubleClick={handleDbClickCell}
                    data-type="key"
                    data-id={r.id}
                  >
                    {r.name}
                  </div>
                </Table.Cell>
                {Object.entries(r.valuesByMode).map((entry) => (
                  <Table.Cell key={entry[0]}>
                    {
                      <div
                        onDoubleClick={handleDbClickCell}
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
                      삭제
                    </button>
                  }
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      <section>
        <label>
          새 키
          <input value={keyStr} onChange={(e) => setKeyStr(e.target.value)} />
        </label>
        {modes.map((mode, i) => (
          <label key={mode.modeId}>
            {mode.name}
            <input
              value={valueStrObj[mode.modeId] ?? ''}
              onChange={(e) =>
                setValueStrObj({
                  ...valueStrObj,
                  [mode.modeId]: e.target.value,
                })
              }
            />
          </label>
        ))}
        <button onClick={handleClickCreateCell}>생성</button>
      </section>
      <section>
        <h3>Export Result</h3>
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
