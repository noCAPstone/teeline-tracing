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
    background: 'radial-gradient(circle at bottom right, #2F3D38, #6D8B83 40%, #A6C3BB 70%)', 
    padding: '20px',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
    borderRadius: '16px',
    border: '4px dotted #2F3D38',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '36px',
    color: '#2F3D38',
    fontFamily: "'Baloo 2', cursive",
    textShadow: '3px 3px 0px #6D8B83, 5px 5px 0px #A6C3BB',
  },
};


export default App;

