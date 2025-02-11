import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import LetterGrid from './components/LetterGrid';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const styles: Record<string, React.CSSProperties> = {
    appContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '50%',
      background: 'radial-gradient(circle at bottom right, #00A878, #EE964B 40%, #F4D06F 70%)',


      padding: isMobile ? '10px' : '20px', 
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.3)',
      borderRadius: '16px',
      border: '4px dashed #58A4B0', // Retro teal border for a fun pop
      overflow: "inherit"
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      fontSize: isMobile ? '28px' : '36px', 
      color: '#F8F1E5', // Off-white for contrast
      fontFamily: "'Baloo 2'",
      textShadow: '3px 3px 0px #D72638, 5px 5px 0px #EE964B', // Bold retro outline
    },
};


  return (
    <div style={styles.appContainer}>
      {user ? <LetterGrid /> : <HomePage />}
    </div>
  );
};

export default App;


