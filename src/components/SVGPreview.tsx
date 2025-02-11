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
    padding: '12px',
    border: '4px dotted #00A878', // Brighter, fun green
    borderRadius: '16px',
    background: '#E6F8D9', // Light pastel green for contrast
    boxShadow: '6px 6px 0px #EE964B', // Playful retro shadow
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
  },
  svg: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    filter: 'drop-shadow(3px 5px 8px rgba(0, 0, 0, 0.3))', // More defined shadow
  },
};

export default SVGPreview;


