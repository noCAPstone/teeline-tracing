export const normalizePoints = (points: number[]): number[] => {
  const xPoints = points.filter((_, i) => i % 2 === 0);
  const yPoints = points.filter((_, i) => i % 2 === 1);

  const minX = Math.min(...xPoints);
  const maxX = Math.max(...xPoints);
  const minY = Math.min(...yPoints);
  const maxY = Math.max(...yPoints);

  return points.map((val, i) =>
    i % 2 === 0 ? (val - minX) / (maxX - minX) : (val - minY) / (maxY - minY)
  );
};

export const normalizeSvgPath = (svgPath: string): number[] => {
  const commands = svgPath.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/g);
  const points = commands
    ?.flatMap((cmd) => cmd.slice(1).trim().split(/[\s,]+/).map(Number))
    .filter((p) => !isNaN(p)) || [];

  return normalizePoints(points);
};
