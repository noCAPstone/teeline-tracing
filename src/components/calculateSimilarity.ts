import { normalizePoints, normalizeSvgPath } from './normalizePath';

const normalizePointsForSimpleShapes = (points: number[]): number[] => {
  const distinctPoints = [...new Set(points)];
  if (distinctPoints.length <= 2) {
    console.warn("Very simple shape detected. Scaling to default range.");
    const minPoint = Math.min(...points);
    const maxPoint = Math.max(...points) || 1;
    return points.map((p) => (p - minPoint) / (maxPoint - minPoint));
  }
  return normalizePoints(points);
};

const padSimplePaths = (path: number[], minLength: number): number[] => {
  return path.length < minLength
    ? [...path, ...Array(minLength - path.length).fill(0)]
    : path;
};

const calculateEuclideanDistance = (v1: number[], v2: number[], penaltyFactor = 10): number => {
  const maxLength = Math.max(v1.length, v2.length);
  const paddedV1 = padSimplePaths(v1, maxLength);
  const paddedV2 = padSimplePaths(v2, maxLength);

  const sumOfSquares = paddedV1.reduce((sum, val, i) => sum + Math.pow(val - paddedV2[i], 2), 0);
  const distance = Math.sqrt(sumOfSquares);

  // Apply penalty factor to scale the similarity
  const normalizedDistance = distance / maxLength;
  const similarity = Math.max(0, 1 - normalizedDistance * penaltyFactor);

  // Cap the fallback similarity to ensure it's stricter
  return Math.min(similarity);
};

const resamplePath = (path: number[], targetLength: number): number[] => {
  const step = (path.length - 1) / (targetLength - 1);
  return Array.from({ length: targetLength }, (_, i) => {
    const t = i * step;
    const lower = Math.floor(t);
    const upper = Math.min(lower + 1, path.length - 1);
    const weight = t - lower;
    return path[lower] * (1 - weight) + path[upper] * weight;
  });
};

export const calculateSimilarity = (path1: number[], path2: number[]): number => {
  if (path1.length < 2 || path2.length < 2) {
    console.warn("Insufficient points to calculate similarity");
    return 0;
  }

  const normalizedPath1 = normalizePointsForSimpleShapes(path1);
  const normalizedPath2 = normalizePointsForSimpleShapes(path2);

  if (normalizedPath1.every((val) => val === 0) || normalizedPath2.every((val) => val === 0)) {
    console.warn("One or both normalized paths are entirely zeros. Using fallback similarity.");
    return calculateEuclideanDistance(normalizedPath1, normalizedPath2);
  }

  const maxLength = Math.max(normalizedPath1.length, normalizedPath2.length);
  const resampledPath1 = resamplePath(normalizedPath1, maxLength);
  const resampledPath2 = resamplePath(normalizedPath2, maxLength);

  const dotProduct = resampledPath1.reduce((sum, val, i) => sum + val * resampledPath2[i], 0);
  const magnitude1 = Math.sqrt(resampledPath1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(resampledPath2.reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    console.warn("One or both paths have zero magnitude. Using fallback similarity.");
    return calculateEuclideanDistance(normalizedPath1, normalizedPath2);
  }

  return dotProduct / (magnitude1 * magnitude2);
};

export const calculateSimilarityFromSvg = (svgPath1: string, svgPath2: string): number => {
  const path1 = normalizeSvgPath(svgPath1);
  const path2 = normalizeSvgPath(svgPath2);

  if (!path1.length || !path2.length) {
    console.warn("One or both SVG paths could not be parsed or normalized.", { svgPath1, svgPath2 });
    return 0;
  }

  return calculateSimilarity(path1, path2);
};
