import React, { useState } from 'react';
import { Stage, Layer, Line, Path } from 'react-konva';
import { normalizePoints, normalizeSvgPath } from './normalizePath';
import { calculateSimilarity } from './calculateSimilarity';

type WriteOnCardProps = {
  svgPath: string;
  onComplete: (isCorrect: boolean, similarity: number) => void;
  onBack: () => void; // Function to handle going back
};

const WriteOnCard: React.FC<WriteOnCardProps> = ({ svgPath, onComplete, onBack }) => {
  const [lines, setLines] = useState<{ points: number[] }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const STAGE_WIDTH = 400;
  const STAGE_HEIGHT = 400;

  const isWithinBounds = (pos: { x: number; y: number }) =>
    pos.x >= 0 && pos.x <= STAGE_WIDTH && pos.y >= 0 && pos.y <= STAGE_HEIGHT;

  const handleMouseDown = (event: any) => {
    const pos = event.target.getStage().getPointerPosition();
    if (isWithinBounds(pos)) {
      setIsDrawing(true);
      if (!isErasing) {
        setLines([...lines, { points: [pos.x, pos.y] }]);
      }
    }
  };

  const handleMouseMove = (event: any) => {
    if (!isDrawing) return;
  
    const pos = event.target.getStage().getPointerPosition();
    if (isWithinBounds(pos)) {
      if (isErasing) {
        const newLines = lines.map((line) => {
          const filteredPoints = [];
          for (let i = 0; i < line.points.length; i += 2) {
            const pointX = line.points[i];
            const pointY = line.points[i + 1];
            const distance = Math.hypot(pos.x - pointX, pos.y - pointY);

            if (distance >= 10) {
              filteredPoints.push(pointX, pointY);
            }
          }
          return { points: filteredPoints };
        }).filter((line) => line.points.length > 0);
        setLines(newLines);
      } else {
        const lastLine = lines[lines.length - 1];
        const newLines = lines.slice(0, lines.length - 1);
        newLines.push({ points: [...lastLine.points, pos.x, pos.y] });
        setLines(newLines);
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSubmitTracing = () => {
    if (lines.length === 0) {
      setFeedback('Please draw something on the canvas before submitting!');
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    const userPoints = lines.flatMap((line) => line.points);
    const normalizedUserPoints = normalizePoints(userPoints);
    const normalizedSvgPoints = normalizeSvgPath(svgPath);

    const similarity = calculateSimilarity(normalizedUserPoints, normalizedSvgPoints);
    const isCorrect = similarity > 0.5;

    setFeedback(
      isCorrect
        ? `Great job! Similarity: ${(similarity * 100).toFixed(2)}%`
        : `Keep practicing! Similarity: ${(similarity * 100).toFixed(2)}%`
    );

    setTimeout(() => {
      setFeedback(null);
      onComplete(isCorrect, similarity);
    }, 2000);
  };

  const toggleEraser = () => {
    setIsErasing((prev) => !prev);
  };

  return (
    <div style={styles.container}>
      <Stage
        width={STAGE_WIDTH}
        height={STAGE_HEIGHT}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: '1px solid black' }}
      >
        <Layer>
          <Path data={svgPath} stroke="gray" strokeWidth={4} lineJoin="round" />
          {lines.map((line, index) => (
            <Line
              key={index}
              points={line.points}
              stroke="black"
              strokeWidth={6}
              tension={0.5}
              lineCap="round"
            />
          ))}
        </Layer>
      </Stage>

      <div style={styles.controls}>
        <button style={isErasing ? styles.activeButton : styles.button} onClick={toggleEraser}>
          {isErasing ? 'Disable Eraser' : 'Enable Eraser'}
        </button>
        <button style={styles.button} onClick={handleSubmitTracing}>
          Done Tracing
        </button>
        <button style={styles.backButton} onClick={onBack}>
          Back
        </button>
      </div>

      {feedback && (
        <div style={styles.feedbackPopup}>
          <p style={styles.feedbackText}>{feedback}</p>
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
    gap: '20px',
  },
  controls: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  activeButton: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  feedbackPopup: {
    marginTop: '20px',
    padding: '15px 20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '2px solid #ccc',
    textAlign: 'center',
  },
  feedbackText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default WriteOnCard;
