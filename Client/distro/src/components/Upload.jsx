import React, {useState, useRef} from 'react';
import { Grid,Divider,Alert,AlertTitle,FormGroup,Button,FormControlLabel,Checkbox,Radio,RadioGroup,LinearProgress,
  Snackbar, Container,Skeleton,useTheme, Typography,TextField, Box, ThemeProvider, useMediaQuery } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';


const fileTypes = ["JPG", "PNG", "GIF"];

const AppBars = () => {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  
  const fileInputRef = useRef(null);

  const [selectedValue, setSelectedValue] = useState('');
  const [upcCode, setUpcCode] = useState('');
  const [upcRequired, setUpcRequired] = useState(false);
  const [artworkFile, setArtworkFile] = useState(null);
  const [artworkFileName, setArtworkFileName] = useState(null);
const [audioFile, setAudioFile] = useState(null);
const [audioFileName, setAudioFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [selectedCheckValues, setSelectedCheckValues] = useState([
    "Spotify",
    "Amazon",
    "Itunes/Apple Music",
    "Facebook/Instagram",
    "TikTok",
    "Napster",
    "Saavn",
    "Youtube Music",
  ]);
  

  const [formValues, setFormValues] = useState({
    label: '',
    selectStores: [], // Array of selected stores (handled by checkboxes)
    previouslyReleased: '', // 'yes' or 'no'
    artist: '', // Artist Name
    originalRleaseDate: null,
    newRleaseDate: null, // New Release Date
    artistSpotifyUrl: '', // Artist Spotify Url
    albumTitle: '', // Album Title
    artwork: '', // Artwork (Image file)
    albumUPC: 'Service will assign', // Album UPC
    trackTitle: '', // Track Title
    trackVersion: '', // Track Version
    trackArtist: '', // Track Artist (Primary Artist)
    featuringArtists: '', // Array of featuring artists
    audioFile: null, // Audio file (WAV or MP3)
    composer: '', // Composer
    author: '', // Author
    isrcCode: '', // Track ISRC
    pLine: '', // P-Line
    cLine: '', // C-Line
    specialMessage: '', // Special Message
    // You might need additional state values for some fields that accept arrays or files.
});


  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCheckValues((prevSelectedCheckValues) => {
      if (checked && !prevSelectedCheckValues.includes(value)) {
        // Add the value if it's checked and not already present
        return [...prevSelectedCheckValues, value];
      } else if (!checked && prevSelectedCheckValues.includes(value)) {
        // Remove the value if it's unchecked and already present
        return prevSelectedCheckValues.filter(
          (selectedCheckValue) => selectedCheckValue !== value
        );
      }
      return prevSelectedCheckValues; // Return the previous state if no change needed
    });
  };
  
  

  const handleReleaseChange = (event) => {
    const newValue = event.target.value;
    if (newValue === 'yes' && !upcCode) {
      setUpcRequired(true);
    } else {
      setUpcRequired(false);
    }

    setSelectedValue(newValue);
  };

  const handleUpcCodeChange = (event) => {
    const value = event.target.value;
    setUpcCode(value);

    if (selectedValue === 'yes' && !value) {
      setUpcRequired(true);
      alert('UPC code cannot be empty if previously released.');
    } else {
      setUpcRequired(false);
    }
  };


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return; // No file selected
  
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const MIN_DIMENSION = 3000;
  
    if (!allowedTypes.includes(file.type)) {
      // File type is not supported
      event.target.value = '';
      alert('Please upload a JPEG, JPG, or PNG file.');
      return;
    }
  
    const img = new Image();
    img.onload = () => {
      if (img.width >= MIN_DIMENSION && img.height >= MIN_DIMENSION) {
        // Image meets the minimum dimensions requirement
        setArtworkFile(file);
        setArtworkFileName(file.name);
      } else {
        // Image dimensions are below 3000px either in width or height
        event.target.value = '';
        alert('Please upload an image with a minimum dimension of 3000 pixels for both width and height.');
      }
    };
  
    img.src = URL.createObjectURL(file);
  };


  const handleAudioFileChange = (event) => {
    const file = event.target.files[0];
  
    if (!file) return; // No file selected
  
    const allowedTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/x-mpeg'];
  
    if (!allowedTypes.includes(file.type)) {
      // File type is not supported, clear the selection
      event.target.value = ''; // Clear the file input
      alert('Please upload a WAV or MP3 file.');
      return;
    }
  
    // Update state with the selected audio file name and file object
    setAudioFile(file);
    setAudioFileName(file.name);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


   const handleAccept = () => {
    handleClose();
    setTermsAccepted(true); // Set terms as accepted
  };


 
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormValues({ ...formValues, [name]: value });
};
const handleDateChange = (date, field) => {
  setFormValues({ ...formValues, [field]: date });
};
  /* SUBMIT CODE.............................. */

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!termsAccepted) {
      alert('Please read all terms and conditions and accept first.');
      return;
    }
  
    setUploadComplete(false);
    setUploadProgress(0);
  
    const completeFormData = new FormData();
  
    // Add all form data to completeFormData
    completeFormData.append('label', formValues.label);
    completeFormData.append('selectStores', JSON.stringify(selectedCheckValues));
    completeFormData.append('previouslyReleased', selectedValue);
    completeFormData.append('artist', formValues.artist);
    completeFormData.append('originalReleaseDate', formValues.originalReleaseDate);
    completeFormData.append('newReleaseDate', formValues.newReleaseDate);
    completeFormData.append('artistSpotifyUrl', formValues.artistSpotifyUrl);
    completeFormData.append('albumTitle', formValues.albumTitle);
    completeFormData.append('artwork', artworkFile);
    completeFormData.append('albumUPC', formValues.albumUPC);
    completeFormData.append('trackTitle', formValues.trackTitle);
    completeFormData.append('trackVersion', formValues.trackVersion);
    completeFormData.append('trackArtist', formValues.trackArtist);
    completeFormData.append('featuringArtists', formValues.featuringArtists);
    completeFormData.append('composer', formValues.composer);
    completeFormData.append('author', formValues.author);
    completeFormData.append('isrcCode', formValues.isrcCode);
    completeFormData.append('pLine', formValues.pLine);
    completeFormData.append('cLine', formValues.cLine);
    completeFormData.append('specialMessage', formValues.specialMessage);
    // Add other form fields similarly...
  
    completeFormData.append('audio', audioFile);
  
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://lyf-music-dashboard.onrender.com/upload');

    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      alert('No token found');
      return;
    }
  
    xhr.setRequestHeader('Authorization', `Bearer ${storedToken}`);
  
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete); // Update upload progress state
      }
    };
  
    xhr.onload = () => {
      if (xhr.status === 200) {
        // Upload completed successfully
        setUploadComplete(true);
        // Show success snackbar
        setSnackbarOpen(true);
        setTimeout(() => {
          window.location.reload(); // This reloads the current page
        }, 2000);
      } else {
        // Some error occurred during upload
        setSnackbarError(true);
      }
    };
  
    xhr.onerror = () => {
      // Error during upload
      setSnackbarError(true);
    };
  
    xhr.send(completeFormData); // Send completeFormData with audio file to server
  };
  


  // Function to close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
   
  return (
    <ThemeProvider theme={theme}>
     
<Container maxWidth="lg" sx={{ flex: 1, bgcolor: '#fff', paddingTop: '40px' }}>
      <Box sx={{ width: '100%', bgcolor: '#1a1a1a', padding: '5px 0', textAlign: 'center' }}>
        
        <Typography variant="h6"  sx={{color:'white'}}>
          Upload Music
        </Typography>
        
      </Box>

    <form onSubmit={handleSubmit}>  
    <Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Label</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="Label"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          required
          name="label"
          value={formValues.label}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />

      <Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px',textAlign: 'center', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Select Stores</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <FormGroup>
      <FormControlLabel control={<Checkbox size="small" defaultChecked value="Spotify" onChange={handleCheckboxChange} />} label="Spotify" />
      <FormControlLabel control={<Checkbox size="small" defaultChecked value="Amazon" onChange={handleCheckboxChange}  />} label="Amazon" />
      <FormControlLabel control={<Checkbox size="small" defaultChecked value="Itunes/Apple Music" onChange={handleCheckboxChange} />} label="Itunes/Apple Music" />
      <FormControlLabel control={<Checkbox size="small" defaultChecked value="Facebook/Instagram" onChange={handleCheckboxChange} />} label="Facebook/Instagram" />
      <FormControlLabel control={<Checkbox size="small" defaultChecked value="TikTok" onChange={handleCheckboxChange} />} label="TikTok" />
    </FormGroup>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <FormGroup>
             
              <FormControlLabel control={<Checkbox size="small" defaultChecked value="Napster" onChange={handleCheckboxChange} />} label="Napster" />
              <FormControlLabel control={<Checkbox size="small" defaultChecked value="Saavn" onChange={handleCheckboxChange}/>} label="Saavn" />
              <FormControlLabel control={<Checkbox size="small" defaultChecked value="Youtube Music" onChange={handleCheckboxChange}/>} label="YouTube Music" />
              <FormControlLabel control={<Checkbox size="small" value="YT Content ID" onChange={handleCheckboxChange} />} label="YouTube Content ID" />
              <FormControlLabel control={<Checkbox size="small" value="150+ more." onChange={handleCheckboxChange} />} label="150+ more outlets..." />
          </FormGroup>
      </Grid>
    </Grid>

    <Divider />
    
    
    <Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', textAlign: 'center', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Previously Released ?</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      
           <RadioGroup value={selectedValue} onChange={handleReleaseChange}>
           <FormControlLabel value="no" control={<Radio size="small"/>} label="No" />
               <FormControlLabel value="yes" control={<Radio size="small"/>} label="Yes" />
               
           </RadioGroup>

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>

<Divider />


    <Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Artist Name</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="Artist"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          required
          name="artist"
          value={formValues.artist}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Artist Spotify Url</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="Spotify Url"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='Optional'
          name="artistSpotifyUrl"
          value={formValues.artistSpotifyUrl}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />


<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: 'auto' }}>
        <Typography sx={{}}>Release Date</Typography>
        <Typography variant="caption" sx={{}}>If previously not released, original and new released date must be same.</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label="Original Released Date"
      value={formValues.originalReleaseDate || null}
      onChange={(date) => handleDateChange(date, 'originalReleaseDate')}
      name="originalReleaseDate"
    />
  </LocalizationProvider>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      label="New Release Date"
      value={formValues.newReleaseDate || null}
      onChange={(date) => handleDateChange(date, 'newReleaseDate')}
      name="newReleaseDate"
    />
  </LocalizationProvider>
      </Grid>
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Album Title</Typography>
      </Grid>
      <Grid item xs={12} sm={8} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="Album Title"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          required
          name="albumTitle"
          value={formValues.albumTitle}
            onChange={handleInputChange}
        />

      </Grid>
     
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Artwork</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>

      <FormControl fullWidth variant="outlined">
      <OutlinedInput
        id="image-upload"
        type="file"
        accept=".jpeg,.jpg"
        onChange={handleImageChange}
        name="artwork"
        endAdornment={<InputAdornment position="end">Upload</InputAdornment>}
        aria-describedby="upload-helper-text"
      />
      <FormHelperText id="upload-helper-text">Upload a JPG image (min 3000x3000 pixels).</FormHelperText>
    </FormControl>

      </Grid>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 'auto': 'auto' }}>
        <Typography component="div" sx={{textAlign: 'left'}}>
          Artwork must be :
      <ul>
        <li>TIF or JPG format</li>
        <li>Square</li>
        <li>Minimum size: 3000 x 3000 pixels</li>
        <li>Maximum size: 6000 x 6000 pixels</li>
        <li>300 DPI in RGB format</li>
        <li>If you’re scanning a CD, remove product stickers and crop marks</li>
      </ul>
    </Typography>
      
      </Grid>
     
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height:'auto' }}>
        <Typography sx={{}}>Album UPC</Typography>
        <Typography variant="caption" sx={{}}>If not available, service will assign new.</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="UPC Code"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='Optional'
          required={upcRequired}
          name="albumUPC"
          value={formValues.albumUPC}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Track Title/Version</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="Track Title"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          required
          name="trackTitle"
          value={formValues.trackTitle}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="Version"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='Optional'
          name="trackVersion"
          value={formValues.trackVersion}
            onChange={handleInputChange}
        />

      </Grid>
     
    </Grid>


<Divider />


<Grid container sx={{paddingTop:'20px', paddingBottom:'20px'}} spacing={4}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Track Artist</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="Primary Artist"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          required
          name="trackArtist"
          value={formValues.trackArtist}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
      label="Featuring Artists"
      id="outlined-size-small"
      size="small"
      fullWidth
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      placeholder='Optional'
      name="featuringArtists"
          value={formValues.featuringArtists}
            onChange={handleInputChange}
    />

      </Grid>
     
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Select Audio</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="WAV or MP3"
          type='file'
          id="outlined-size-small"
          accept=".wav,.mp3"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          ref={fileInputRef}
          onChange={handleAudioFileChange}
          required
        />

      </Grid>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: 'auto' }}>
      <Typography component="div" sx={{textAlign: 'left'}}>
          Audio must be :
      <ul>
        <li>Wav or Mp3 format</li>
        <li>16-24 bit or 320kbps</li>
        <li>Sample rate 44100Hz</li>
        <li>Minimum length 1 min</li>
        <li>Maximum length: 12 min</li>
        <li>Podcasts not supported.</li>
      </ul>
    </Typography>
      </Grid>
     
    </Grid>


<Divider />

<Grid container sx={{paddingTop:'20px', paddingBottom:'20px'}} spacing={4}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Composer/Author</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="Composer"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          required
          name="composer"
          value={formValues.composer}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
      label="Author"
      id="outlined-size-small"
      size="small"
      fullWidth
      InputLabelProps={{ shrink: true }}
      variant="outlined"
      required
      name="author"
      value={formValues.author}
        onChange={handleInputChange}
    />

      </Grid>
     
    </Grid>

<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: 'auto' }}>
        <Typography sx={{}}>Track ISRC</Typography>
        <Typography variant="caption" sx={{}}>If not available, service will assign new.</Typography>
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="ISRC Code"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='Optional'
          name="isrcCode"
      value={formValues.isrcCode}
        onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height:'auto' }}>
        <Typography sx={{}}>P-Line</Typography>
       
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="P-Line"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='2023 John Doe'
          required
          name="pLine"
          value={formValues.pLine}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height:'auto' }}>
        <Typography sx={{}}>C-Line</Typography>
       
      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
      <TextField
          label="C-Line"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='2023 John Doe'
          required
          name="cLine"
          value={formValues.cLine}
            onChange={handleInputChange}
        />

      </Grid>
      <Grid item xs={12} sm={4} style={{ backgroundColor: '', }}>
     
      </Grid>
    </Grid>


<Divider />

<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: isSmallScreen ? 50 : 'auto' }}>
        <Typography sx={{}}>Special Message</Typography>
      </Grid>
      
      <Grid item xs={12} sm={8} style={{ backgroundColor: '',textAlign: 'left' }}>
      <TextField
          label="Message"
          id="outlined-size-small"
          size="small"
          fullWidth  // Ensures the TextField takes the full width
          InputLabelProps={{ shrink: true }} // Keeps the label at the top when focused
          variant="outlined"
          placeholder='Optional'
          name="specialMessage"
          value={formValues.specialMessage}
            onChange={handleInputChange}
          
        />

      </Grid>
     
    </Grid>

    <Divider />
{/* term and condition and submit btn............. */}
<Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px', marginBottom:'80px'}}>
      <Grid item xs={12} sm={4} sx={{paddingTop:'8px', backgroundColor: '', height: 'auto' }}>
        <Typography sx={{}}>Term & Conditions</Typography>
      </Grid>
      <Grid item xs={12} sm={6} style={{ backgroundColor: '', }}>
      
      <Button variant="outlined" onClick={handleClickOpen} sx={{ width: '100%', marginLeft: 0, justifyContent: 'flex-start'}}>
        Read all the terms and conditions before submitting.
      </Button>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Digital Audio Release Distribution Terms and Conditions"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          By clicking "I Accept," you confirm your understanding and acceptance of Distroverse's digital audio release distribution services. This agreement delineates the provision of services including audio content upload, distribution across online music platforms, metadata optimization, and performance analytics. You retain ownership and rights to your content while granting Distroverse the necessary licenses for distribution. Compensation terms, distribution duration, confidentiality clauses, and adherence to platform terms are encompassed. Your agreement to these terms marks acknowledgment of responsibilities and rights concerning your content's distribution. For a detailed understanding, contact to the support.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Decline</Button>
          <Button onClick={handleAccept}>I Accept</Button>
        </DialogActions>
      </Dialog>

      </Grid>
      <Grid item xs={12} sm={2} style={{ backgroundColor: '', }}>
      <Button type="submit" variant="contained" disableElevation sx={{width:'100%'}}>
  Submit
</Button>


      </Grid>
    </Grid>

{/* Progressbar................. */}
    <Grid container spacing={4} sx={{paddingTop:'20px', paddingBottom:'20px', marginBottom:'50px'}}>
      <Grid item xs={12} sm={12} sx={{paddingTop:'8px', backgroundColor: '', height: 'auto' }}>
      
{uploadProgress > 0 && !uploadComplete && 
  <LinearProgress
  variant="determinate"
  value={uploadProgress}
  sx={{
    height: '20px',
    overflow: 'hidden', // Hide overflowing stripes
    '& .MuiLinearProgress-bar': {
      backgroundImage: 'linear-gradient(45deg, transparent 33.33%, rgba(0, 0, 0, 0.1) 33.33%, rgba(0, 0, 0, 0.1) 66.66%, transparent 66.66%)',
      backgroundSize: '20px 20px', // Adjust the stripe size and angle
      animation: 'progress-stripes 1s linear infinite', // Apply the animation
    },
    '@keyframes progress-stripes': {
      '0%': { backgroundPosition: '0 0' },
      '100%': { backgroundPosition: '20px 0' }, // Adjust the width of stripes
    },
  }}
/>

}
      </Grid>
      
    </Grid>

</form>

<Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
>
  {uploadComplete ? (
    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
      <AlertTitle>Success</AlertTitle>
      Content under review by team. <strong>Upload more.</strong>
    </Alert>
  ) : (
    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
      <AlertTitle>Error</AlertTitle>
      Upload failed due to a technical issue or internet problem. Please try again.
    </Alert>
  )}
</Snackbar>



</Container>

    </ThemeProvider>
  );
}

export default AppBars;
