import React, { useEffect, useState } from 'react';
import { Button } from './components/Button/Button';
import EventType from '../shared/event-type';
import { Channel } from './utils/channel';

type LocalVariable = {
  id: Variable['id'];
  resolvedType: Variable['resolvedType'];
  name: Variable['name'];
  valuesByHeader: Variable['valuesByMode'];
  // values: figma.variables.getVariableById(lv.id),
};

type LoadedLocalVariableTable = {
  headers: { id: string; name: string }[];
  rows: LocalVariable[];
};
type Header = { id: string; name: string };

Channel.init();

function App() {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [rows, setRows] = useState<LocalVariable[]>([]);

  // util과 hook으로 분리 필요
  useEffect(() => {
    // 브라우저(iframe)에서 'message' 이벤트(= figma.ui.postMessage()) 수신
    const removeListeners = [];
    removeListeners.push(
      Channel.onMessage(EventType.CopyEnSuccess, () => {
        window.alert('hello');
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
    Channel.sendMessage(EventType.CopyEnRequest, { foo: 'bar' });
  };

  return (
    <div>
      <menu>
        <li>
          <Button onClick={handleClickCopyEn}>Copy En</Button>
        </li>
      </menu>
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
    </div>
  );
}

export default App;
