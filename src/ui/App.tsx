import React, { useEffect, useState } from 'react';
import { Button } from './components/Button/Button';
import EventType from '../shared/event-type';
import { Channel } from './utils/channel';
import styles from './App.css';
import { useI18nVariables } from './hooks/useI18nVariables';
import { Table } from './components/Table/Table';
import { themeClass } from './theme.css';
Channel.init();

function App() {
  const [jsonStr, setJsonStr] = useState<string>('');
  const [keyStr, setKeyStr] = useState<string>('');
  const [modeStr, setModeStr] = useState<string>('');
  const [valueStr, setValueStr] = useState<string>('');
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

  const handleClickCopyEn = () => {
    Channel.sendMessage(EventType.RequestToJSON, '');
  };

  const handleChangeKeyValue = () => {
    /**
     * modify request
     */
    const targetCell = vars.find((r) => r.name === keyStr);
    const targetMode = modes.find((h) => h.name === modeStr);
    if (targetMode && targetCell) {
      Channel.sendMessage(EventType.ChangeVariableValue, {
        key: targetCell.id,
        mode: targetMode.modeId,
        value: valueStr,
      });
    } else {
      alert('modeId not exist');
    }
  };

  const handleDeleteKeyValue = () => {
    /**
     * delete request
     */
    const targetCell = vars.find((r) => r.name === keyStr);
    if (targetCell) {
      Channel.sendMessage(EventType.DeleteVariable, {
        key: targetCell.id,
      });
    }
  };
  const handleCreateKeyValue = () => {
    /**
     * create request
     */
    Channel.sendMessage(EventType.CreateVariable, {
      name: keyStr,
      valuesByMode: {
        [modes[0].modeId]: valueStr,
      },
    });
  };

  if (!isLoaded) {
    return <div>loading...</div>;
  }
  return (
    <div className={themeClass}>
      <menu>
        <li>
          <Button onClick={handleClickCopyEn}>Extract En</Button>
        </li>
      </menu>
      <fieldset>
        <label htmlFor="keyStr">Key</label>
        <input
          id="keyStr"
          type="text"
          onChange={(e) => setKeyStr(e.target.value)}
        />
        <br />
        <label htmlFor="mode">Mode</label>
        <input
          id="mode"
          type="text"
          onChange={(e) => setModeStr(e.target.value)}
        />
        <br />
        <label htmlFor="value">Value</label>
        <input
          id="value"
          type="text"
          onChange={(e) => setValueStr(e.target.value)}
        />
        <br />
        <button type="button" onClick={handleChangeKeyValue}>
          change
        </button>
        <button type="button" onClick={handleCreateKeyValue}>
          create
        </button>
        <button type="button" onClick={handleDeleteKeyValue}>
          delete
        </button>
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
                <Table.Cell>{r.name}</Table.Cell>
                {Object.entries(r.valuesByMode).map((entry) => (
                  <Table.Cell key={entry[0]}>{entry[1]}</Table.Cell>
                ))}
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      <section>
        <h3>Export Result</h3>
        <pre className={styles.CodeBlock}>
          <code>{jsonStr}</code>
        </pre>
      </section>
    </div>
  );
}

export default App;
