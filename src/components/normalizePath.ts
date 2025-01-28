export const normalizePoints = (points: number[]): number[] => {
  const xPoints = points.filter((_, i) => i % 2 === 0);
  const yPoints = points.filter((_, i) => i % 2 === 1);

  const minX = Math.min(...xPoints);
  const maxX = Math.max(...xPoints);
  const minY = Math.min(...yPoints);
  const maxY = Math.max(...yPoints);

  const rangeX = maxX - minX || 1; 
  const rangeY = maxY - minY || 1; 

  return points.map((val, i) =>
    i % 2 === 0 ? (val - minX) / rangeX : (val - minY) / rangeY
  );
};


export const normalizeSvgPath = (svgPath: string): number[] => {
  const commands = svgPath.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
  let currentX = 0;
  let currentY = 0;
  const points: number[] = [];

  commands?.forEach((cmd) => {
    const type = cmd[0];
    const values = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((v) => !isNaN(v));

    if (type === "M" || type === "L") {
      
      currentX = values[0];
      currentY = values[1];
      points.push(currentX, currentY);
    } else if (type === "H") {
      // Horizontal line
      currentX = values[0];
      points.push(currentX, currentY);
    } else if (type === "V") {
      // Vertical line
      currentY = values[0];
      points.push(currentX, currentY);
    }
  });

  return normalizePoints(points);
};

