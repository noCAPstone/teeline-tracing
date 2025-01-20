import React from 'react';
import LetterGrid from './components/LetterGrid';

const App: React.FC = () => {
  return (
    <div style={styles.appContainer}>
      <h1 style={styles.title}>Teeline Alphabet</h1>
      <LetterGrid />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '32px',
    color: '#333',
  },
};

export default App;

