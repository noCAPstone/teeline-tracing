import React, { useState, useEffect } from "react";
import WriteOnCard from "./WriteOnCard";
import SVGPreview from "./SVGPreview";
import Auth from "./Auth"; 
import { FaBaby, FaRocket, FaTrophy } from "react-icons/fa6";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, deleteDoc, doc} from "firebase/firestore";
import { auth, app } from "../firebaseConfig";

const db = getFirestore(app);

const letters: string[] = [
  "a", "b", "c", "d", "e", "f", "g",
  "h", "i", "j", "k", "l", "m", "n",
  "o", "p", "q", "r", "s", "t", "u",
  "v", "w", "x", "y", "z",
];
const levels = {
  beginner: { threshold: 0.5, icon: <FaBaby />, tooltip: "Beginner: Tracing needs 50% accuracy." },
  intermediate: { threshold: 0.6, icon: <FaRocket />, tooltip: "Intermediate: Tracing needs 60% accuracy." },
  advanced: { threshold: 0.65, icon: <FaTrophy />, tooltip: "Advanced: Tracing needs 65% accuracy." },
};

const base = "/teeline-tracing";

const LetterGrid: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<keyof typeof levels>("beginner");
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(levels.beginner.threshold);
  const [user, setUser] = useState<User | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [letterPaths, setLetterPaths] = useState<Record<string, string>>({});
  const [goodPile, setGoodPile] = useState<string[]>([]);
  const [needsWorkPile, setNeedsWorkPile] = useState<string[]>([]);
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
  useEffect(() => {
    setSimilarityThreshold(levels[selectedLevel].threshold);
  }, [selectedLevel]);


  
  const addLetterToPile = async (letter: string, pileType: "good" | "needsWork") => {
    if (!user) return;
  
    try {
      const userPilesRef = collection(db, `users/${user.uid}/piles`);
      const snapshot = await getDocs(userPilesRef);
      let existingDocId: string | null = null;
      let existingPileType: string | null = null;
  
      snapshot.forEach((docItem) => {
        const data = docItem.data();
        if (data.letter === letter) {
          existingDocId = docItem.id;
          existingPileType = data.pileType;
        }
      });
  
      
      if (existingPileType === pileType) return;
  
      
      if (existingDocId) {
        await deleteDoc(doc(db, `users/${user.uid}/piles/${existingDocId}`));
      }
  
      
      await addDoc(userPilesRef, {
        pileType,
        letter,
        createdAt: serverTimestamp(),
      });

      
      setGoodPile((prev) =>
        pileType === "good"
          ? [...prev, letter].filter((l, i, arr) => arr.indexOf(l) === i) 
          : prev.filter((l) => l !== letter)
      );
  
      setNeedsWorkPile((prev) =>
        pileType === "needsWork"
          ? [...prev, letter].filter((l, i, arr) => arr.indexOf(l) === i)
          : prev.filter((l) => l !== letter)
      );
  
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

  
  useEffect(() => {
    if (goodPile.length === 0 && needsWorkPile.length === letters.length - 1) {
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 500);
      
      alert("wow i didn't really think it was possible to do this badly. um. keep trying...");
    }
  }, [goodPile, needsWorkPile, letters.length]);

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
  const handleLevelSelect = (level: keyof typeof levels) => {
    setSelectedLevel(level);
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
  
  
  if (!user) {
    return <Auth onAuthChange={setUser} />;
  }

  const styles: Record<string, React.CSSProperties> = {
    levelContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      margin: "20px 0",
    },
    levelTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#D72638",
      fontFamily: "'Baloo 2'",
      marginBottom: "10px",
      textAlign: "center",
    },
    levelIcons: {
      display: "flex",
      gap: "15px",
    },
    levelIcon: {
      fontSize: "32px",
      padding: "10px",
      borderRadius: "50%",
      backgroundColor: "powderblue",
      color: "#311847",
      cursor: "pointer",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      boxShadow: "3px 3px 0px #D72638",
    },
    selectedLevel: {
      transform: "scale(1.2)",
      backgroundColor: "#EE964B",
      boxShadow: "5px 5px 0px #D72638",
    },
    nextButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#EE964B",
      color: "#F8F1E5",
      borderRadius: "16px",
      cursor: "pointer",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      width: "75vw",
      //backgroundColor: "#F8F1E5",
      padding: isMobile ? "15px" : "20px",
      fontFamily: "'Baloo 2'",
      borderRadius: "16px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "repeat(auto-fit, minmax(100px, 1fr))"
        : "repeat(auto-fit, minmax(150px, 1fr))",
      gap: isMobile ? "20px" : "30px",
      width: "100%",
      height: "50%",
      fontFamily: "'Baloo 2'",
      maxWidth: "800px",
      paddingLeft: isMobile ? "50px" : "20px",
    },
    card: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "3px solid #D72638",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #58A4B0, #EE964B)",
      boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.2)",
      width: isMobile ? "100px" : "150px",
      height: isMobile ? "100px" : "150px",
      cursor: "pointer",
      fontSize: isMobile ? "18px" : "24px",
      fontWeight: "bold",
      fontFamily: "'Baloo 2'",
      textAlign: "center",
      color: "#F8F1E5",
      opacity: 0,
      transform: "translateY(-50px)",
      animation: "dropIn 0.5s ease-out forwards",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    cardHover: {
      transform: "translateY(-4px)",
      boxShadow: "8px 8px 0px rgba(0, 0, 0, 0.3)",
      background: "linear-gradient(135deg, #EE964B, #58A4B0)",
    },
    previewContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      padding: "20px",
      borderRadius: "16px",
      background: "#F4D06F",
      boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.3)",
    },
    title: {
      fontSize: isMobile ? "24px" : "28px",
      fontWeight: "bold",
      color: "#311847",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    traceButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#58A4B0",
      color: "#F8F1E5",
      borderRadius: "16px",
      cursor: "pointer",
    },
    backButton: {
      padding: isMobile ? "10px 20px" : "12px 24px",
      backgroundColor: "#D72638",
      color: "#F8F1E5",
      borderRadius: "16px",
      cursor: "pointer",
    },
    letter: {
      fontSize: "48px",
      fontWeight: "bold",
      color: "#311847",
    },
    pilesContainer: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      gap: "20px",
      marginTop: "20px",
      width: "100%",
      maxWidth: "800px",
      paddingLeft: "12px",
    },
    pile: {
      flex: 1,
      border: "3px dashed #EE964B",
      borderRadius: "16px",
      padding: isMobile ? "10px" : "20px",
      backgroundColor: "#F4D06F",
      boxShadow: "6px 6px 0px rgba(0, 0, 0, 0.2)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    logoutButton: {
      width: "30%",
      padding: "12px",
      marginBottom: "20px",
      marginTop: "20px",
      backgroundColor: "#D72638",
      color: "#F8F1E5",
      border: "none",
      borderRadius: "16px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background 0.3s",
    },
};

  return (
    <div style={styles.container}>
      {!selectedLetter && (
        <div style={styles.topBar}>
          <h2 style={styles.title}>Welcome, {user?.email}</h2>
          <div style={styles.levelContainer}>
            <h2 style={styles.levelTitle}>Choose Your Level</h2>
            <div style={styles.levelIcons}>
              {Object.entries(levels).map(([level, data]) => (
                <div
                  key={level}
                  style={{
                    ...styles.levelIcon,
                    ...(selectedLevel === level ? styles.selectedLevel : {}),
                  }}
                  onClick={() => handleLevelSelect(level as keyof typeof levels)}
                  title={data.tooltip} // Tooltip on hover
                >
                  {data.icon}
                </div>
              ))}
            </div>
        </div>
      </div>
      )}
  
      {selectedLetter ? (
        
        <div style={styles.previewContainer}>
          {isTracing ? (<>
            <WriteOnCard
              svgPath={letterPaths[selectedLetter]}
              similarityThreshold={similarityThreshold}
              onComplete={handleTraceComplete}
            />
            <button style={styles.backButton} onClick={() => setSelectedLetter(null)}>
                Back to Grid
              </button>
          </>
           
          ) : (
            <>
              <h2 style={styles.title}>Difficulty: {selectedLevel} </h2>
              <h2 style={styles.title}>Selected Letter: {selectedLetter.toUpperCase()}</h2>
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
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}



export default LetterGrid;

