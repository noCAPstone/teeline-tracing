import fs from 'fs';
import { JSDOM } from 'jsdom';

function calculateBoundingBox(pathData) {
  const commands = pathData.match(/[MLCSTQAHVZ][^MLCSTQAHVZ]*/gi); // Match SVG path commands
  const points = [];

  commands.forEach((cmd) => {
    const coords = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);
    for (let i = 0; i < coords.length; i += 2) {
      points.push([coords[i], coords[i + 1]]);
    }
  });

  const xValues = points.map((p) => p[0]);
  const yValues = points.map((p) => p[1]);

  return {
    minX: Math.min(...xValues),
    minY: Math.min(...yValues),
    maxX: Math.max(...xValues),
    maxY: Math.max(...yValues),
  };
}

function normalizeSvg(svgFilePath, outputFilePath) {
  const svgContent = fs.readFileSync(svgFilePath, 'utf-8');
  const dom = new JSDOM(svgContent);
  const svg = dom.window.document.querySelector('svg');
  const path = svg.querySelector('path');

  const pathData = path.getAttribute('d');
  const bbox = calculateBoundingBox(pathData);

  const viewBoxWidth = bbox.maxX - bbox.minX;
  const viewBoxHeight = bbox.maxY - bbox.minY;

  // Set the viewBox based on the bounding box
  svg.setAttribute('viewBox', `${bbox.minX} ${bbox.minY} ${viewBoxWidth} ${viewBoxHeight}`);

  // Remove the transform attribute if present
  path.removeAttribute('transform');

  // Write the updated SVG content to the output file
  fs.writeFileSync(outputFilePath, dom.serialize(), 'utf-8');
}

const inputFolder = './public/svgs'; // Your input folder
const outputFolder = './public/normalized_svgs'; // Output folder

// Ensure the output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Process each SVG in the input folder
fs.readdirSync(inputFolder).forEach((file) => {
  if (file.endsWith('.svg')) {
    normalizeSvg(`${inputFolder}/${file}`, `${outputFolder}/${file}`);
  }
});

console.log('SVG normalization complete!');
