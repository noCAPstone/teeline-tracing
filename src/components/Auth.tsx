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
    //background: "radial-gradient(circle at bottom right, #00A878, #F4D06F 40%, #EE964B 70%)", // Fun retro gradient
    fontFamily: "'Baloo 2'",
    //borderRadius: "16px",
  },
  authBox: {
    backgroundColor: "#F4D06F", // Soft cream for vintage look
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "6px 6px 0px #D72638", // Playful deep red shadow
    textAlign: "center",
    width: "320px",
    border: "3px dashed #00A878", // Fun green dashed border
  },
  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#D72638", // Cherry red pop
    marginBottom: "20px",
    textShadow: "3px 3px 0px #F4D06F, 5px 5px 0px #00A878", // Layered retro text shadow
  },
  input: {
    width: "100%",
    padding: "12px",
    paddingRight: "3px",
    border: "3px solid #00A878", // Fun bright green border
    borderRadius: "12px",
    fontSize: "16px",
    marginBottom: "15px",
    textAlign: "center",
    backgroundColor: "white", // Warm vintage yellow
    color: "#311847", // Deep purple for retro contrast
    fontWeight: "bold",
    boxShadow: "4px 4px 0px #EE964B", // Warm orange shadow
  },
  authButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#EE964B", // Bright jade green for fun contrast
    color: "black",
    border: "3px solid #D72638", // Deep red accent
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "10px",
    fontWeight: "bold",
    boxShadow: "5px 5px 0px #D72638",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  authButtonHover: {
    transform: "translate(-3px, -3px)",
    boxShadow: "8px 8px 0px #A01A7D", // Deeper red shadow for depth
  },
  toggleButton: {
    backgroundColor: "#EE964B",
    border: "none",
    color: "#2F3D38",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
    transition: "color 0.2s ease-in-out",
  },
  toggleButtonHover: {
    color: "#D72638", // Turns red when hovered
  },
};


export default Auth;

