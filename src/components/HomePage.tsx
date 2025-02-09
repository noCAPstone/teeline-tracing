import React, { useState, useEffect } from "react";
import LetterGrid from "./LetterGrid";
import Auth from "./Auth"; 
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false); 

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  
  if (user) {
    return <LetterGrid />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Teeline Tracers</h1>
  
      {!showAuth && (
        <p style={styles.description}>
          Inspired by classic note-taking methods and modern language-learning techniques, 
          this app helps you practice tracing Teeline characters just like learning a new alphabet. 
          Whether you're a journalist, student, or just fascinated by antiquated forms of communication, 
          our tracing exercises will help you master Teeline one stroke at a time. 
          Start practicing today and bring shorthand into the digital age!
        </p>
      )}
  
      {!showAuth ? (
        <button style={styles.loginButton} onClick={() => setShowAuth(true)}>
          Get started
        </button>
      ) : (
        <Auth onAuthChange={setUser} />
      )}
    </div>
  )
}


const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#E6F2ED",
    fontFamily: "'Baloo 2'",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#2F3D38",
    marginBottom: "10px",
  },
  description: {
    fontSize: "18px",
    color: "#4A5F56",
    marginBottom: "20px",
    textAlign: "center",
    maxWidth: "400px",
  },
  loginButton: {
    padding: "12px 24px",
    backgroundColor: "#4CAF50",
    color: "#FFFFFF",
    borderRadius: "16px",
    cursor: "pointer",
    border: "none",
    fontSize: "18px",
  },
};

export default HomePage;
