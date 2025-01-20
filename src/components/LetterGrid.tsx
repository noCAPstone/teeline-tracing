import React, { useState, useEffect } from 'react';
import WriteOnCard from './WriteOnCard';
import SVGPreview from './SVGPreview';

const letters: string[] = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g',
  'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u',
  'v', 'w', 'x', 'y', 'z',
];

const LetterGrid: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const [letterPaths, setLetterPaths] = useState<Record<string, string>>({});
  const [goodPile, setGoodPile] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('goodPile') || '[]')
  );
  const [needsWorkPile, setNeedsWorkPile] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('needsWorkPile') || '[]')
  );

  useEffect(() => {
    localStorage.setItem('goodPile', JSON.stringify(goodPile));
  }, [goodPile]);

  useEffect(() => {
    localStorage.setItem('needsWorkPile', JSON.stringify(needsWorkPile));
  }, [needsWorkPile]);

  useEffect(() => {
    const loadPaths = async () => {
      const paths: Record<string, string> = {};
      for (const letter of letters) {
        try {
          const response = await fetch(`/normalized_svgs/${letter}.svg`);
          const text = await response.text();
          const match = text.match(/<path[^>]*d="([^"]*)"/);
          if (match) {
            paths[letter] = match[1];
          }
        } catch (error) {
          console.error(`Failed to load SVG for letter ${letter}:`, error);
        }
      }
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

  const handleTraceComplete = (isCorrect: boolean) => {
    if (selectedLetter) {
      if (isCorrect) {
        setGoodPile((prev) => [...new Set([...prev, selectedLetter])]);
        setNeedsWorkPile((prev) => prev.filter((l) => l !== selectedLetter));
      } else {
        setNeedsWorkPile((prev) => [...new Set([...prev, selectedLetter])]);
        setGoodPile((prev) => prev.filter((l) => l !== selectedLetter));
      }
      setSelectedLetter(null);
    }
    setIsTracing(false);
  };

  return (
    <div style={styles.container}>
      {selectedLetter ? (
        <div style={styles.previewContainer}>
          {isTracing ? (
            <WriteOnCard
              svgPath={letterPaths[selectedLetter]}
              onComplete={handleTraceComplete}
              onBack={() => setSelectedLetter(null)}
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
              <h3>Good Pile</h3>
              {goodPile.map((letter) => (
                <div key={letter}>{letter.toUpperCase()}</div>
              ))}
            </div>
            <div style={styles.pile}>
              <h3>Needs Work Pile</h3>
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
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#e8f8f5',
    padding: '20px',
    gap: '20px',
    fontFamily: "'Baloo 2', cursive",
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '30px',
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#d5f5f0',
    border: '4px dashed #66cdaa',
    borderRadius: '16px',
    padding: '20px',
    boxShadow: '6px 6px 0px #b2e3d9',
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid #66cdaa',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #e8f8f5, #cfece6)',
    boxShadow: '6px 6px 0px #a3dbcc',
    width: '150px',
    height: '150px',
    cursor: 'pointer',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2f4f4f',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '8px 8px 0px #66cdaa',
    background: 'linear-gradient(135deg, #d5f5f0, #e8f8f5)',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    border: '4px dotted #66cdaa',
    borderRadius: '16px',
    background: '#f0fcf9',
    boxShadow: '6px 6px 0px #b2e3d9',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#66cdaa',
    textShadow: '3px 3px 0px #b2e3d9, 6px 6px 0px #d5f5f0',
  },
  traceButton: {
    padding: '12px 24px',
    backgroundColor: '#66cdaa',
    color: '#ffffff',
    border: '2px solid #a3dbcc',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '4px 4px 0px #b2e3d9',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: '#b2e3d9',
    color: '#2f4f4f',
    border: '2px solid #66cdaa',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    boxShadow: '4px 4px 0px #a3dbcc',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  letter: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#66cdaa',
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
    border: '3px dashed #66cdaa',
    borderRadius: '16px',
    padding: '20px',
    backgroundColor: '#f0fcf9',
    boxShadow: '6px 6px 0px #b2e3d9',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
};

export default LetterGrid;
