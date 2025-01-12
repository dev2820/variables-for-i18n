import React from 'react';
import styles from './App.css';

function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <TestComponent />
    </div>
  );
}

const TestComponent = () => {
  return <div className={styles.TestComponent}>Vanilla Extract Test</div>;
};

export default App;
