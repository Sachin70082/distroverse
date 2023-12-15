import * as React from 'react';
import { Typography, useMediaQuery, useTheme } from '@mui/material';

const Accounting = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={isSmallScreen ? '80' : '200'}
        height={isSmallScreen ? '80' : '200'}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        style={{ background: 'none', shapeRendering: 'auto' }}
      >
        <g transform="translate(50 50)">
          {[...Array(12)].map((_, index) => (
            <rect
              key={index}
              x="-4"
              y="-40"
              width="8"
              height="20"
              rx="2"
              ry="2"
              fill={`hsl(${index * 30}, 70%, 50%)`}
              transform={`rotate(${index * 30})`}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`0 0 0; 360 0 0`}
                dur="1s"
                repeatCount="indefinite"
                keyTimes="0;1"
                keySplines="0.5 0 0.5 1"
                calcMode="spline"
                additive="sum"
                accumulate="sum"
              />
            </rect>
          ))}
        </g>
      </svg>
      <Typography variant="h4" align="center" sx={{ mt: 8 }}>
        Under Construction
      </Typography>
      <Typography variant="body1" align="center" sx={{ mt: 2 }}>
        We're working on something awesome! Please check back later.
      </Typography>
    </div>
  );
};

export default Accounting;


