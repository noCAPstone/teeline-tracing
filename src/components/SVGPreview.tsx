import React from 'react';

interface SVGPreviewProps {
  path: string;
  width?: number;
  height?: number;
  viewBox?: string; 
}

const SVGPreview: React.FC<SVGPreviewProps> = ({
  path,
  width = 400,
  height = 400,
  viewBox = "-100 -100 300 400", 
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
        preserveAspectRatio="xMidYMid meet"
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
    border: '4px dotted #A6C3BB', // Seafoam-grey dotted border
    borderRadius: '16px',
    background: '#E6F2ED', // Lightest seafoam-green background
    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
  },
  svg: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))', // Soft drop shadow
  },
};

export default SVGPreview;


