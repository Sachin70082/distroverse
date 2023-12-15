import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Box, createTheme, ThemeProvider, useMediaQuery, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const theme = createTheme();

const Footer = () => {
   
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  
   
  return (
    <>
    <Box
      sx={{
        bgcolor: 'black',
        width: '100%',
        height: '100px',
        bottom: 0,
        left: 0,
        borderTop: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }}
    >
      {/* Your footer content goes here */}
      This is the footer
    </Box>
    </>
    
  );
}

export default Footer;
