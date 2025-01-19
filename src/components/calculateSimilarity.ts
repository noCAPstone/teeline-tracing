export const calculateSimilarity = (path1: number[], path2: number[]): number => {
  const minLength = Math.min(path1.length, path2.length);

  let totalDifference = 0;
  for (let i = 0; i < minLength; i++) {
    totalDifference += Math.abs(path1[i] - path2[i]);
  }

  const maxPossibleDifference = minLength; // Path values normalized to 0-1
  const similarity = 1 - totalDifference / maxPossibleDifference;
  return Math.max(0, similarity); // Ensure it's not negative
};
