import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from "firebase/auth";

const Auth: React.FC<{ onAuthChange: (user: User | null) => void }> = ({ onAuthChange }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      onAuthChange(currentUser); // Directly update the parent component
    });

    return () => unsubscribe();
  }, [onAuthChange]);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  return (
    <div style={styles.fullScreenContainer}>
      <div style={styles.authBox}>
        <h2 style={styles.title}>{isLogin ? "Login" : "Sign Up"}</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button style={styles.authButton} onClick={handleAuth}>
          {isLogin ? "Login" : "Sign Up"}
        </button>
        <button style={styles.toggleButton} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  fullScreenContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#E6F2ED",
    fontFamily: "'Baloo 2', cursive",
    borderRadius: "16px",
  },
  authBox: {
    backgroundColor: "#D1E1DB",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#2F3D38",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "2px solid #A6C3BB",
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "15px",
    textAlign: "center",
  },
  authButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6D8B83",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "10px",
    transition: "background 0.3s",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#2F3D38",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Auth;

