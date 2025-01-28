import React, { useState, useEffect } from 'react';
import WriteOnCard from './WriteOnCard';
import SVGPreview from './SVGPreview';
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig"; 
const db = getFirestore(app);

const letters: string[] = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z',
];
const base = '/teeline-tracing';
const LetterGrid: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [letterPaths, setLetterPaths] = useState<Record<string, string>>({});
  const [goodPile, setGoodPile] = useState<string[]>([]);
  const [needsWorkPile, setNeedsWorkPile] = useState<string[]>([]);




  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "piles", "letters");
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched from Firestore:", data);
          setGoodPile((prev) => (prev.length > 0 ? prev : data.goodPile || []));
          setNeedsWorkPile((prev) => (prev.length > 0 ? prev : data.needsWorkPile || []));
         } else {
           console.log("No user data found, initializing...");
           await setDoc(docRef, { goodPile: [], needsWorkPile: [] })
            .then(() => console.log("Document successfully initialized."))
             .catch((error) => console.error("Error initializing Firestore document:", error));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  let previousData = { goodPile: [], needsWorkPile: [] };
  useEffect(() => {
    const debounceSave = setTimeout(async () => {
      try {
        const docRef = doc(db, "piles", "letters");
  
        // Avoid redundant writes
        if (
          JSON.stringify(previousData.goodPile) !== JSON.stringify(goodPile) ||
          JSON.stringify(previousData.needsWorkPile) !== JSON.stringify(needsWorkPile)
        ) {
          await setDoc(docRef, { goodPile, needsWorkPile });
          previousData = { goodPile: [], needsWorkPile: [] }; // Update saved reference
          console.log("Data successfully saved to Firestore:", { goodPile, needsWorkPile });
        }
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    }, 500); // Delay writes by 500ms
  
    return () => clearTimeout(debounceSave); // Clear timeout on dependency change
  }, [goodPile, needsWorkPile]);
  

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const responses = await Promise.all(
          letters.map(letter =>
            fetch(`${base}/normalized_svgs/${letter}.svg`).then(res => res.text())
          )
        );
  
        const paths: Record<string, string> = {};
        responses.forEach((text, index) => {
          const letter = letters[index];
          const match = text.match(/<path[^>]*d="([^"]*)"/);
          if (match) {
            paths[letter] = match[1];
          } else {
            console.warn(`No <path> found in SVG for letter: ${letter}`);
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
      if (isCorrect) {
        setGoodPile((prev) => [...new Set([...prev, selectedLetter])]);
        setNeedsWorkPile((prev) => prev.filter((l) => l !== selectedLetter));
      } else {
        setNeedsWorkPile((prev) => [...new Set([...prev, selectedLetter])]);
        setGoodPile((prev) => prev.filter((l) => l !== selectedLetter));
      }
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

  return (
    <div style={styles.container}>
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
};

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
};

export default LetterGrid;
