import React, { useState } from 'react';
import { Stage, Layer, Line, Path } from 'react-konva';
import { normalizePoints, normalizeSvgPath } from './normalizePath';
import { calculateSimilarity } from './calculateSimilarity';

type WriteOnCardProps = {
  svgPath: string;
  onComplete: (isCorrect: boolean, similarity: number) => void;
};

const WriteOnCard: React.FC<WriteOnCardProps> = ({ svgPath, onComplete }) => {
  const [lines, setLines] = useState<{ points: number[] }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const STAGE_WIDTH = 400; // Width of the tracing stage
  const STAGE_HEIGHT = 400; // Height of the tracing stage

  // Check if the position is within the bounds of the stage
  const isWithinBounds = (pos: { x: number; y: number }) => {
    return pos.x >= 0 && pos.x <= STAGE_WIDTH && pos.y >= 0 && pos.y <= STAGE_HEIGHT;
  };

  const handleMouseDown = (event: any) => {
    const pos = event.target.getStage().getPointerPosition();
    if (isWithinBounds(pos)) {
      setIsDrawing(true);
      setLines([...lines, { points: [pos.x, pos.y] }]);
    }
  };

  const handleMouseMove = (event: any) => {
    if (!isDrawing) return;

    const pos = event.target.getStage().getPointerPosition();
    if (isWithinBounds(pos)) {
      const lastLine = lines[lines.length - 1];
      const newLines = lines.slice(0, lines.length - 1);
      newLines.push({ points: [...lastLine.points, pos.x, pos.y] });
      setLines(newLines);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    // Flatten user-drawn points
    const userPoints = lines.flatMap((line) => line.points);

    // Normalize paths
    const normalizedUserPoints = normalizePoints(userPoints);
    const normalizedSvgPoints = normalizeSvgPath(svgPath);

    // Calculate similarity
    const similarity = calculateSimilarity(normalizedUserPoints, normalizedSvgPoints);

    // Determine correctness (threshold can be adjusted)
    const isCorrect = similarity > 0.7; // Adjust threshold as needed

    onComplete(isCorrect, similarity);
  };

  return (
    <Stage
      width={STAGE_WIDTH} // Use the stage width constant
      height={STAGE_HEIGHT} // Use the stage height constant
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: '1px solid black' }}
    >
      <Layer>
        {/* Render the correct path */}
        <Path
          data={svgPath}
          stroke="gray"
          strokeWidth={4} // Increased stroke width for the guide
          lineJoin="round"
        />

        {/* Render user-drawn lines */}
        {lines.map((line, index) => (
          <Line
            key={index}
            points={line.points}
            stroke="black"
            strokeWidth={6} // Increased stroke width for the pen
            tension={0.5}
            lineCap="round"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default WriteOnCard;

