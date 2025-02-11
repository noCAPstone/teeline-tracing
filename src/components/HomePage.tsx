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
    //backgroundColor: "#E6F8D9", // Fun pastel green
    fontFamily: "'Baloo 2'",
    overflow: "auto",
  },
  title: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#1B4332", // Deep forest green for a retro pop
    marginBottom: "10px",
    //textShadow: "4px 4px 0px #00A878, 6px 6px 0px #D72638", // Playful layered shadow
  },
  description: {
    fontSize: "18px",
    color: "#2F3D38", // Soft retro gray-green
    marginBottom: "20px",
    textAlign: "center",
    maxWidth: "450px",
    backgroundColor: "#F4D06F", // Vintage golden yellow
    padding: "10px 15px",
    borderRadius: "12px",
    border: "3px dashed #D72638", // Fun dashed border
  },
  loginButton: {
    padding: "14px 28px",
    backgroundColor: "#F4D06F", // Brighter, energetic green
    color: "black",
    borderRadius: "16px",
    cursor: "pointer",
    border: "3px solid #D72638", // Deep red accent
    fontSize: "18px",
    fontWeight: "bold",
    boxShadow: "5px 5px 0px #D72638",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  loginButtonHover: {
    transform: "translate(-3px, -3px)",
    boxShadow: "8px 8px 0px #A01A7D", // Darker purple-red for depth
  },
};

export default HomePage;
