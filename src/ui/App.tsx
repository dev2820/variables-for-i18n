import React, { useEffect, useState } from 'react';
import styles from './App.css';

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
type Row = LocalVariable;
function App() {
  const [headers, setHeaders] = useState<Header[]>([]);
  const [rows, setRows] = useState<LocalVariable[]>([]);

  // util과 hook으로 분리 필요
  useEffect(() => {
    // 브라우저(iframe)에서 'message' 이벤트(= figma.ui.postMessage()) 수신
    window.onmessage = (event) => {
      const { type, payload } = event.data.pluginMessage || {};
      console.log(type, payload);

      if (type === 'loaded-local-variable-table') {
        const _payload = payload as LoadedLocalVariableTable;
        setHeaders(_payload.headers);
        setRows(_payload.rows);
      }
    };
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <TestComponent />
      <table>
        <th>
          <td>Key</td>
          {headers.map((h, i) => (
            <td key={i}>{h.name}</td>
          ))}
        </th>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              {Object.values(r.valuesByHeader).map((value) => (
                <td>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TestComponent = () => {
  return <div className={styles.TestComponent}>Vanilla Extract Test</div>;
};

export default App;
