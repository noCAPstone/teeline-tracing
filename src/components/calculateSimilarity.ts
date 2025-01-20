export const calculateSimilarity = (path1: number[], path2: number[]): number => {
  const maxLength = Math.max(path1.length, path2.length);

  // Pad shorter path with zeros
  const paddedPath1 = [...path1, ...Array(maxLength - path1.length).fill(0)];
  const paddedPath2 = [...path2, ...Array(maxLength - path2.length).fill(0)];

  let totalDifference = 0;
  for (let i = 0; i < maxLength; i++) {
    totalDifference += Math.abs(paddedPath1[i] - paddedPath2[i]);
  }

  const maxPossibleDifference = maxLength; // Normalized to range [0, 1]
  const similarity = 1 - totalDifference / maxPossibleDifference;
  return Math.max(0, similarity);
};

