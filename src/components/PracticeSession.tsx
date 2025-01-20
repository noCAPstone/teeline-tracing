import React, { useState, useEffect } from 'react';

interface Card {
  id: string;
  content: string;
}

const PracticeApp: React.FC = () => {
  const [goodPile, setGoodPile] = useState<Card[]>([]);
  const [needsWorkPile, setNeedsWorkPile] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);

  useEffect(() => {
    const savedGoodPile = localStorage.getItem('goodPile');
    const savedNeedsWorkPile = localStorage.getItem('needsWorkPile');

    if (savedGoodPile) setGoodPile(JSON.parse(savedGoodPile));
    if (savedNeedsWorkPile) setNeedsWorkPile(JSON.parse(savedNeedsWorkPile));
  }, []);

  useEffect(() => {
    localStorage.setItem('goodPile', JSON.stringify(goodPile));
    localStorage.setItem('needsWorkPile', JSON.stringify(needsWorkPile));
  }, [goodPile, needsWorkPile]);

  const handleGood = () => {
    if (currentCard) {
      setGoodPile((prev) => [...prev, currentCard]);
      setCurrentCard(null); // Load the next card
    }
  };

  const handleNeedsWork = () => {
    if (currentCard) {
      setNeedsWorkPile((prev) => [...prev, currentCard]);
      setCurrentCard(null); // Load the next card
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Practice Teeline</h1>

      <div style={styles.cardContainer}>
        {currentCard ? (
          <div style={styles.currentCard}>
            <h2 style={styles.subtitle}>Current Card</h2>
            <div style={styles.cardContent}>{currentCard.content}</div>
            <div style={styles.buttonGroup}>
              <button style={styles.goodButton} onClick={handleGood}>
                Good
              </button>
              <button style={styles.needsWorkButton} onClick={handleNeedsWork}>
                Needs Work
              </button>
            </div>
          </div>
        ) : (
          <div style={styles.noCard}>
            <h2 style={styles.subtitle}>No Card Loaded</h2>
            {/* Add logic to load the next card */}
          </div>
        )}
      </div>

      <div style={styles.pilesContainer}>
        <div style={styles.pile}>
          <h2 style={styles.pileTitle}>Good Pile</h2>
          <ul style={styles.pileList}>
            {goodPile.map((card) => (
              <li key={card.id} style={styles.pileItem}>
                {card.content}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.pile}>
          <h2 style={styles.pileTitle}>Needs Work Pile</h2>
          <ul style={styles.pileList}>
            {needsWorkPile.map((card) => (
              <li key={card.id} style={styles.pileItem}>
                {card.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '80%',
    maxWidth: '600px',
    marginBottom: '20px',
  },
  currentCard: {
    textAlign: 'center',
  },
  noCard: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#555',
  },
  cardContent: {
    fontSize: '18px',
    marginBottom: '20px',
    color: '#444',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  goodButton: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  needsWorkButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  pilesContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: '600px',
  },
  pile: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  pileTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    color: '#333',
  },
  pileList: {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  },
  pileItem: {
    fontSize: '16px',
    marginBottom: '5px',
    padding: '8px 12px',
    backgroundColor: '#e6e6e6',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#333',
  },
};

export default PracticeApp;
