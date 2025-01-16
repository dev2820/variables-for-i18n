import React, { useEffect, useState } from 'react';
import { Button } from './components/Button/Button';
import EventType from '../shared/event-type';
import { Channel } from './utils/channel';
import styles from './App.css';

type LocalVariable = {
  id: Variable['id'];
  resolvedType: Variable['resolvedType'];
  name: Variable['name'];
  valuesByHeader: Variable['valuesByMode'];
  // values: figma.variables.getVariableById(lv.id),
};

type Header = { modeId: string; name: string };
type LoadedLocalVariableTable = {
  headers: Header[];
  rows: LocalVariable[];
};

Channel.init();

function App() {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [rows, setRows] = useState<LocalVariable[]>([]);
  const [jsonStr, setJsonStr] = useState<string>('');
  const [keyStr, setKeyStr] = useState<string>('');
  const [modeStr, setModeStr] = useState<string>('');
  const [valueStr, setValueStr] = useState<string>('');
  // util과 hook으로 분리 필요
  useEffect(() => {
    // 브라우저(iframe)에서 'message' 이벤트(= figma.ui.postMessage()) 수신
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.SuccessToJSON, (payload) => {
        const result = payload as string;
        setJsonStr(result);
      }),
      Channel.onMessage(EventType.LoadedLocalVariableTable, (payload) => {
        const data = payload as LoadedLocalVariableTable;
        setHeaders(data.headers);
        setRows(data.rows);
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
    const targetCell = rows.find((r) => r.name === keyStr);
    const targetMode = headers.find((h) => h.name === modeStr);
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
    const targetCell = rows.find((r) => r.name === keyStr);
    if (targetCell) {
      Channel.sendMessage(EventType.DeleteVariable, {
        key: targetCell.id,
      });
    }
  };

  return (
    <div>
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
        <button type="button" onClick={handleDeleteKeyValue}>
          delete
        </button>
      </fieldset>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            {headers.map((h) => (
              <th key={h.name}>{h.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              {Object.entries(r.valuesByHeader).map((entry) => (
                <td key={entry[0]}>{entry[1]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
