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
  const [isTracing, setIsTracing] = useState(false);
  const [letterPaths, setLetterPaths] = useState<Record<string, string>>({});
  const [goodPile, setGoodPile] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('goodPile') || '[]');
  });
  const [needsWorkPile, setNeedsWorkPile] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('needsWorkPile') || '[]');
  });

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

  const handleTraceComplete = (isCorrect: boolean, similarity: number) => {
    setGoodPile((prev) => {
      const inGoodPile = prev.includes(selectedLetter!);
      if (isCorrect && !inGoodPile) {
        setNeedsWorkPile((needsWorkPrev) =>
          needsWorkPrev.filter((letter) => letter !== selectedLetter!)
        );
        return [...prev, selectedLetter!];
      }
      return prev;
    });

    setNeedsWorkPile((prev) => {
      const inNeedsWorkPile = prev.includes(selectedLetter!);
      if (!isCorrect && !inNeedsWorkPile) {
        setGoodPile((goodPrev) =>
          goodPrev.filter((letter) => letter !== selectedLetter!)
        );
        return [...prev, selectedLetter!];
      }
      return prev;
    });

    setSelectedLetter(null);
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
                <SVGPreview
                  path={letterPaths[selectedLetter]}
                  width={400}
                  height={400}
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
        <>
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
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '800px',
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
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Dark gray for card text
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
    color: '#333', // Dark gray for main titles
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
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    color: '#333',
  },
  pileTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
    textAlign: 'center',
  },
  pileItem: {
    fontSize: '16px',
    padding: '10px 15px',
    backgroundColor: '#e6e6e6',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    width: '100%',
    textAlign: 'center',
    color: '#333',
  },
};

export default LetterGrid;
