import React, { useState, useEffect } from "react";
import LetterGrid from "./LetterGrid";
import Auth from "./Auth"; 
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false); // Toggles the login form

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // If the user is logged in, render the main app (LetterGrid)
  if (user) {
    return <LetterGrid />;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to Teeline Tracers</h1>
      <p style={styles.description}>
        Learn and practice Teeline shorthand effortlessly!
      </p>

      {!showAuth ? (
        <button style={styles.loginButton} onClick={() => setShowAuth(true)}>
          Get started
        </button>
      ) : (
        <Auth onAuthChange={setUser} />
      )}
    </div>
  );
};

// Inline styles for the homepage
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
