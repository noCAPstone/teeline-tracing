import React, { useState, useEffect } from 'react';
import WriteOnCard from './WriteOnCard';
import SVGPreview from './SVGPreview'; // Import the SVGPreview component

const letters: string[] = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z',
];

const LetterGrid: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [letterPaths, setLetterPaths] = useState<Record<string, string>>({});

  // Load SVG paths dynamically
  useEffect(() => {
    const loadPaths = async () => {
      const paths: Record<string, string> = {};
  
      for (const letter of letters) {
        try {
          const response = await fetch(`/normalized_svgs/${letter}.svg`);
          const text = await response.text();
  
          // Log the response and path extraction
          console.log(`SVG for ${letter}:`, text);
  
          const match = text.match(/<path[^>]*d="([^"]*)"/);
          if (match) {
            paths[letter] = match[1];
          } else {
            console.error(`Path data not found in SVG for letter ${letter}`);
          }
        } catch (error) {
          console.error(`Failed to load SVG for letter ${letter}:`, error);
        }
      }
  
      console.log('Loaded paths:', paths);
      setLetterPaths(paths);
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

  const handleTraceComplete = (isCorrect: boolean, similarity: number) => {
    alert(
      `Trace ${isCorrect ? 'successful!' : 'needs improvement.'} ` +
      `Similarity: ${(similarity * 100).toFixed(2)}%`
    );
    setSelectedLetter(null); // Deselect the letter
    setIsTracing(false); // Exit tracing mode
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
                <SVGPreview
                  path={letterPaths[selectedLetter]}
                  width={400} // Dynamically set preview width
                  height={400} // Dynamically set preview height
                />
              ) : (
                <p>Loading Teeline version...</p>
              )}
              <button style={styles.traceButton} onClick={handleStartTracing}>
                Start Tracing
              </button>
              <button style={styles.backButton} onClick={() => setSelectedLetter(null)}>
                Back to Grid
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={styles.grid}>
          {letters.map((letter) => (
            <div
              key={letter}
              style={styles.card}
              onClick={() => handleCardClick(letter)}
            >
              <span style={styles.letter}>{letter.toUpperCase()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '800px',
    justifyContent: 'center',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ccc',
    borderRadius: '10px',
    background: '#f9f9f9',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.1)',
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  traceButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  letter: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default LetterGrid;
