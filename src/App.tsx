import React, { useState, useEffect } from 'react';
import LetterGrid from './components/LetterGrid';

const App: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    appContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // minHeight: '100vh',
      height: '50%',
      background: 'radial-gradient(circle at bottom right, #2F3D38, #6D8B83 40%, #A6C3BB 70%)', 
      padding: isMobile ? '10px' : '20px', // Example of using isMobile
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      borderRadius: '16px',
      border: '4px dotted #2F3D38',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: isMobile ? '28px' : '36px', // Smaller title font for mobile
      color: '#2F3D38',
      fontFamily: "'Baloo 2', cursive",
      textShadow: '3px 3px 0px #6D8B83, 5px 5px 0px #A6C3BB',
    },
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.title}>Teeline Alphabet</h1>
      <LetterGrid />
    </div>
  );
};

export default App;


