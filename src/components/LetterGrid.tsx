import React, { useState, useEffect } from "react";
import WriteOnCard from "./WriteOnCard";
import SVGPreview from "./SVGPreview";
import Auth from "./Auth"; // Import the authentication component
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, app } from "../firebaseConfig";

const db = getFirestore(app);

const letters: string[] = [
  "a", "b", "c", "d", "e", "f", "g",
  "h", "i", "j", "k", "l", "m", "n",
  "o", "p", "q", "r", "s", "t", "u",
  "v", "w", "x", "y", "z",
];

const base = "/teeline-tracing";

const LetterGrid: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [letterPaths, setLetterPaths] = useState<Record<string, string>>({});
  const [goodPile, setGoodPile] = useState<string[]>([]);
  const [needsWorkPile, setNeedsWorkPile] = useState<string[]>([]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user-specific data when logged in
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const userPilesRef = collection(db, `users/${user.uid}/piles`);
        const snapshot = await getDocs(userPilesRef);

        const goodPileData: string[] = [];
        const needsWorkPileData: string[] = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.pileType === "good") {
            goodPileData.push(data.letter);
          } else {
            needsWorkPileData.push(data.letter);
          }
        });

        setGoodPile(goodPileData);
        setNeedsWorkPile(needsWorkPileData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [user]);

  // Add a letter to the appropriate pile in Firestore
  const addLetterToPile = async (letter: string, pileType: "good" | "needsWork") => {
    if (!user) return;

    try {
      const userPilesRef = collection(db, `users/${user.uid}/piles`);
      const snapshot = await getDocs(userPilesRef);
      let exists = false;

      snapshot.forEach((docItem) => {
        if (docItem.data().letter === letter && docItem.data().pileType === pileType) {
          exists = true;
        }
      });

      if (!exists) {
        await addDoc(userPilesRef, {
          pileType,
          letter,
          createdAt: serverTimestamp(),
        });

        setGoodPile((prev) => (pileType === "good" ? [...prev, letter] : prev.filter((l) => l !== letter)));
        setNeedsWorkPile((prev) => (pileType === "needsWork" ? [...prev, letter] : prev.filter((l) => l !== letter)));
      }
    } catch (error) {
      console.error("Error adding letter to pile:", error);
    }
  };

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const responses = await Promise.all(
          letters.map((letter) =>
            fetch(`${base}/normalized_svgs/${letter}.svg`).then((res) => res.text())
          )
        );

        const paths: Record<string, string> = {};
        responses.forEach((text, index) => {
          const letter = letters[index];
          const match = text.match(/<path[^>]*d="([^"]*)"/);
          if (match) {
            paths[letter] = match[1];
          }
        });

        setLetterPaths(paths);
      } catch (error) {
        console.error("Error loading SVG paths:", error);
      }
    };

    loadPaths();
  }, []);

  const handleCardClick = (letter: string) => {
    setSelectedLetter(letter);
    setIsTracing(false);
  };

  const handleStartTracing = () => {
    setIsTracing(true);
  };

  const handleTraceComplete = (isCorrect: boolean) => {
    if (selectedLetter) {
      addLetterToPile(selectedLetter, isCorrect ? "good" : "needsWork");
    }
    setIsTracing(false);
  };

  const handleNextLetter = () => {
    if (selectedLetter) {
      const currentIndex = letters.indexOf(selectedLetter);
      const nextIndex = (currentIndex + 1) % letters.length;
      setSelectedLetter(letters[nextIndex]);
      setIsTracing(false);
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
  };
  
  // If no user is logged in, show authentication form
  if (!user) {
    return <Auth onAuthChange={setUser} />;
  }


  return (
    <div style={styles.container}>
      {/* Hide top bar when a letter is selected */}
      {!selectedLetter && (
        <div style={styles.topBar}>
          <h2 style={styles.title}>Welcome, {user?.email}</h2>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
  
      {selectedLetter ? (
        <div style={styles.previewContainer}>
          {isTracing ? (
            <WriteOnCard
              svgPath={letterPaths[selectedLetter]}
              onComplete={handleTraceComplete}
            />
          ) : (
            <>
              <h2 style={styles.title}>Teeline Version: {selectedLetter.toUpperCase()}</h2>
              {letterPaths[selectedLetter] ? (
                <SVGPreview path={letterPaths[selectedLetter]} width={400} height={400} />
              ) : (
                <p>Loading Teeline version...</p>
              )}
              <button style={styles.traceButton} onClick={handleStartTracing}>
                Start Tracing
              </button>
              <button style={styles.nextButton} onClick={handleNextLetter}>
                Move to Next Letter
              </button>
              <button style={styles.backButton} onClick={() => setSelectedLetter(null)}>
                Back to Grid
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {letters.map((letter, index) => (
              <div
                key={letter}
                style={{
                  ...styles.card,
                  ...(hoveredCardIndex === index ? styles.cardHover : {}),
                  animationDelay: `${index * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                onClick={() => handleCardClick(letter)}
              >
                <span style={styles.letter}>{letter.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div style={styles.pilesContainer}>
            <div style={styles.pile}>
              <h3>Good To Go</h3>
              {goodPile.map((letter) => (
                <div key={letter}>{letter.toUpperCase()}</div>
              ))}
            </div>
            <div style={styles.pile}>
              <h3>Needs Work</h3>
              {needsWorkPile.map((letter) => (
                <div key={letter}>{letter.toUpperCase()}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  
  nextButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    borderRadius: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#E6F2ED',
    padding: '20px',
    fontFamily: "'Baloo 2', cursive",
    borderRadius: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '30px',
    width: '100%',
    maxWidth: '800px',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #D1E1DB',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #A6C3BB, #D1E1DB)',
    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.1)',
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F3D38',
    opacity: 0,
    transform: 'translateY(-50px)',
    animation: 'dropIn 0.5s ease-out forwards',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.3)',
    background: 'linear-gradient(135deg, #D1E1DB, #A6C3BB)',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    borderRadius: '16px',
    background: '#E6F2ED',
    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2F3D38',
  },
  traceButton: {
    padding: '12px 24px',
    backgroundColor: '#6D8B83',
    color: '#FFFFFF',
    borderRadius: '16px',
    cursor: 'pointer',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#A6C3BB',
    color: '#2F3D38',
    borderRadius: '16px',
    cursor: 'pointer',
  },
  letter: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#2F3D38',
  },
  pilesContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '20px',
    width: '100%',
    maxWidth: '800px',
  },
  pile: {
    flex: 1,
    border: '3px dashed #A6C3BB',
    borderRadius: '16px',
    padding: '20px',
    backgroundColor: '#E6F2ED',
    boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  logoutButton: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    backgroundColor: "#A6C3BB",
    color: "#2F3D38",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s",
  },
};

export default LetterGrid;
