// src/App.tsx
import React from 'react';
import CodeEditor from './components/CodeEditor';

const App: React.FC = () => {
  return (
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
  <h1 style={{ textAlign: 'center', margin: '0 1rem' }}>Intelligent Code Completion Tool</h1>
  <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
    <CodeEditor  />
  </div>
</div>
  );
};

export default App;