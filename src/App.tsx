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
    backgroundColor: '#e8f8f5', // Light seafoam green background
    padding: '20px',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '36px', // Slightly larger for better emphasis
    color: '#66cdaa', // Seafoam green for the title text
    fontFamily: "'Baloo 2', cursive", // Playful and retro font
    textShadow: '3px 3px 0px #b2e3d9, 6px 6px 0px #d5f5f0', // Soft retro shadow
  },
};

export default App;


