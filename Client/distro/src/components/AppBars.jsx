import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Box, createTheme, ThemeProvider, useMediaQuery, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const theme = createTheme();

const AppBars = () => {
    const [isBoxOpen, setIsBoxOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const isMobileView = useMediaQuery(theme.breakpoints.down('md'));
  
    const handleClick = () => {
      setIsBoxOpen(!isBoxOpen); // Toggle the state to open/close the box
    };

    const handleLogout = () => {
      setLoading(true);
      localStorage.removeItem('token');
      
      window.location.href = '/login';
      // Redirect to '/login' or perform any other logout actions as needed
    };
    
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ boxShadow: 'none' }} >
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

            {/* Logo */}
            <Typography variant="h6" component="div">
              DSTRO Verse
            </Typography>

            {/* Menu Icon (for mobile view) */}
            <IconButton
              size="large"
              color="inherit"
              aria-label="menu"
              onClick={handleClick}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuIcon />
            </IconButton>

            {isMobileView ? null : (
              <div sx={{ display: 'flex',  }}>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/upload">Upload</Button>
                <Button color="inherit" component={Link} to="/accounting">Accounting</Button>
                <Button color="inherit" component={Link} to="/login" onClick={handleLogout}>Logout</Button>
              </div>
            )}

          </Toolbar>
        </AppBar>
        <Box
      sx={{
        bgcolor: 'white',
        width: '100%',
        height: 'auto',
        display: { xs: isBoxOpen ? 'block' : 'none', md: 'none', borderBottom: '1px solid #ccc' },
        cursor: 'pointer',
      }}
    >
      <Stack direction="column" spacing={4} mt={2} p={1}>
      <Button
      component={Link}
      to="/"
      variant="text"
      color="inherit"
      onClick={handleClick}
      sx={{
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 0,
        },
      }}
    >
      Home
    </Button>
        <Button component={Link} to="/upload"
          variant="text"
          color="inherit"
          onClick={handleClick}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: 0,
            },
          }}
        >
          Upload
        </Button>
        <Button component={Link} to="/accounting"
          variant="text"
          color="inherit"
          onClick={handleClick}
          sx={{
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: 0,
            },
          }}
        >
          Accounting
        </Button>
        <Button
      component="button"
      variant="text"
      color="inherit"
      onClick={handleLogout}
      sx={{
        '&:hover': {
          backgroundColor: 'primary.main',
          color: 'white',
          borderRadius: 0,
        },
      }}
    >
      Logout
    </Button>
      </Stack>
    </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AppBars;
