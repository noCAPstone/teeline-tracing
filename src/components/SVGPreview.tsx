import React from 'react';

interface SVGPreviewProps {
  path: string; // The SVG path data
  width?: number;
  height?: number;
  viewBox?: string; // Allow dynamic viewBox
}

const SVGPreview: React.FC<SVGPreviewProps> = ({
  path,
  width = 400,
  height = 400,
  viewBox = "0 0 720 720", // Default to full size
}) => {
  return (
    <div
      style={{
        ...styles.svgWrapper,
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet" // Ensure centering
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        <path
          d={path}
          stroke="black"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};


const styles: Record<string, React.CSSProperties> = {
  svgWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '12px',
    background: '#fff',
  },
  svg: {
    display: 'block',
  },
};

export default SVGPreview;


