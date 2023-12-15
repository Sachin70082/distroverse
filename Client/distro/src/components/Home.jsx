import React, {useEffect, useState} from 'react';
import { AppBar,Grid,Divider, Toolbar,Container,Skeleton,Pagination,useTheme, Typography,Paper, TextField, IconButton, Button, Menu, MenuItem, Box, createTheme, ThemeProvider, useMediaQuery, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Link} from 'react-router-dom';



const Home = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem('token'); // Get the token from localStorage
  
        if (!storedToken) {
          throw new Error('No token found');
        }
  
        const requestOptions = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        };
  
        const response = await fetch('https://lyf-music-dashboard.onrender.com/api/allData', requestOptions);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const jsonData = await response.json();
  
        // Update state with fetched data
        setData(jsonData); 
      } catch (error) {
        console.error('Error fetching data:', error.message);
        // Handle error scenarios here (e.g., set state for an empty data array)
        setData([]);
      }
    };
  
    fetchData();
  }, []); 
  

  const getStatusColor = (status) => {
    if (status === 'Pending') {
      return '#2196f3'; // Blue color for pending status
    } else if (status === 'Success') {
      return '#4caf50'; // Green color for success status
    } else if (status === 'Rejected') {
      return '#f44336'; // Red color for rejected status
    }
    // You might want to return a default color in case status doesn't match any condition
    return '#000000'; // Black color as a default
  };

  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm')); // Change breakpoint to 'sm' for mobile view
  const statusColor = getStatusColor(data.status);
  const itemsPerPage = 4;
  const [page, setPage] = React.useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };


const renderMobileTable = () => {

  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Simulating data loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust this delay time as needed

    // Clear timeout in case component unmounts or if loading finishes early
    return () => clearTimeout(timeout);
  }, []);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  return (
    <TableContainer>
      <Table aria-label="simple table">
      <TableBody>
      {
  data.slice(startIndex, endIndex).map((row, index) => (
    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
      <TableCell component="th" scope="row">
        <img src={`https://lyf-music-dashboard.onrender.com/${row.artworkFilePath}`} alt="" style={{ width: '50px', height: '50px' }} />
      </TableCell>
      <TableCell>
        <Typography variant="body2">{row.formData.albumUPC}</Typography>
        <Link to={`/mycontent/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="subtitle1">{row.formData.albumTitle}</Typography>
        </Link>
        <Typography variant="body2" sx={{ color: getStatusColor(row.status) }}>
          {row.status}
        </Typography>
      </TableCell>
    </TableRow>
  ))
}

</TableBody>
      </Table>
    </TableContainer>
  );
};

const renderDesktopTable = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Simulating data loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust this delay time as needed

    // Clear timeout in case component unmounts or if loading finishes early
    return () => clearTimeout(timeout);
  }, []);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Artwork</TableCell>
            <TableCell align="left">UPC</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            // Render skeleton when loading
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="rectangular" width={50} height={50} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                  
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                  
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                  
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Render table when not loading
            data.slice(startIndex, endIndex).map((row, index) => (
              <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell component="th" scope="row">
                  <img src={`https://lyf-music-dashboard.onrender.com/${row.artworkFilePath}`} alt="" style={{ width: '50px', height: '50px' }} />
                </TableCell>
                <TableCell variant="body2">{row.formData.albumUPC}</TableCell>
                <TableCell align="left">
                  <Link to={`/mycontent/${row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {row.formData.albumTitle}
                  </Link>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ color: getStatusColor(row.status) }}>
                    {row.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
            
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

return (
  <>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', // Set minimum height of the Box to full viewport height
      }}
    >
     <Container maxWidth="lg" sx={{ flex: 1, bgcolor: '#fff', paddingTop: '40px' }}>
        <Grid container alignItems="center" justifyContent="space-between" marginBottom="20px">
          <Grid item>
            <Typography variant="h4" gutterBottom sx={{ marginBottom: 0 }}>
              My Catalog
            </Typography>
          </Grid>
          {!isMobileView && (
            <Grid item xs={6} sm={6} md={6}>
              <Box sx={{ display: 'flex', }}>
                <TextField
                  id="search"
                  label="Search"
                  variant="standard"
                  size="small"
                  sx={{ mr: 2, borderRadius: 0 }} // Remove rounded border
                  fullWidth
                  disabled
                />
                
              </Box>
            </Grid>
          )}
          <Grid item>
          <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 0, // Remove rounded corners
                boxShadow: 'none', // Remove shadow
              }}
              component={Link} to="/upload"
            >
              Upload New
            </Button>
          </Grid>


        </Grid>
        <Divider />
        {/*Table Content*/}



{isMobileView ? (
      renderMobileTable() // Render mobile layout
    ) : (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={12} md={12}>
          {renderDesktopTable()} {/* Render desktop layout */}
        </Grid>
      </Grid>
    )}


        {/* Rest of your content goes here */}
      
        <Grid container justifyContent={isMobileView ? 'center' : 'flex-start'} sx={{ marginTop: '40px', padding:'0' }}>
  <Grid item xs={12} sm={6} md={4} textAlign={isMobileView ? 'center' : 'right'}>
    <Pagination
      count={Math.ceil(data.length / itemsPerPage)}
      color="primary"
      shape="rounded"
      page={page}
      onChange={handlePageChange}
    />
  </Grid>
</Grid>

     </Container>
    </Box>
  </>
);
};

export default Home;
