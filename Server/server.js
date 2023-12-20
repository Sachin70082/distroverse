const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');

// Example of using authMiddleware in your routes


const filePath = './JSON DB/allData.json'; 

const { v4: uuidv4 } = require('uuid');

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies



// Set up Multer for handling multipart/form-data (file uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../Client/build')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Define your routes
app.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Replace 'index.html' with your main HTML file
});

// Handle audio upload endpoint using multer
const userDataPath = path.join(__dirname, 'JSON DB', 'userData.json');

app.post('/api/login', (req, res) => {
  const { userID, password } = req.body;

  fs.readFile(userDataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading user data.' });
    }

    try {
      let userData = JSON.parse(data);
      const userIndex = userData.findIndex(user => user.userID === userID);

      if (userIndex === -1) {
        return res.status(401).json({ message: 'Not yet registered. Please contact support.' });
      }

      const user = userData[userIndex];

      if (user.password !== password) {
        return res.status(401).json({ message: 'Password did not match.' });
      }

      const token = jwt.sign({ userID: user.userID }, 'myDistroverseSecretKey');

      // Update the token if it already exists for the user
      if (user.token) {
        user.token = token;
      } else {
        // If no token exists, create a new one
        user.token = token;
      }

      const role = user.role; // Assuming user object has a 'role' property

      // Update the JSON file with the new token
      fs.writeFile(userDataPath, JSON.stringify(userData, null, 2), err => {
        if (err) {
          return res.status(500).json({ message: 'Error updating user data with token.' });
        }
        
        res.json({ token, userId: user.userID, role });
         // Include role in the response
      });

    } catch (parseError) {
      return res.status(500).json({ message: 'Error parsing user data.' });
    }
  });
});


app.get('/api/allData', auth, (req, res) => {
  try {
    const userData = JSON.parse(fs.readFileSync('./JSON DB/userData.json', 'utf8')); // Load userData
    const allData = JSON.parse(fs.readFileSync('./JSON DB/allData.json', 'utf8')); // Load allData

    const authenticatedUserId = req.userId; // Convert req.userId to string if necessary

    // Filter allData based on authenticated user's userId
    const userDataFiltered = allData.filter(data => data.userId === authenticatedUserId);

    if (userDataFiltered.length === 0) {
      
      return res.status(404).json({ message: 'No data found for the authenticated user.' });
    }

    res.json(userDataFiltered); // Send filtered data
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.get('/admin/allData', auth, (req, res) => {
  try {
    const userData = JSON.parse(fs.readFileSync('./JSON DB/userData.json', 'utf8')); // Load userData
    const allData = JSON.parse(fs.readFileSync('./JSON DB/allData.json', 'utf8')); // Load allData

    const authenticatedUserId = req.userId; // Convert req.userId to string if necessary

    // Filter allData based on authenticated user's userId
    const userDataFiltered = allData

    if (userDataFiltered.length === 0) {
      
      return res.status(404).json({ message: 'No data found for the authenticated user.' });
    }

    res.json(userDataFiltered); // Send filtered data
  } catch (error) {
    
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.get('/download-metadata/:id', (req, res) => {
  const id = req.params.id;

  fs.readFile('./JSON DB/allData.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the file');
    }

    try {
      const jsonData = JSON.parse(data);
      const row = jsonData.find((item) => item.id === id);

      if (!row || !row.formData || !row.formData.albumTitle) {
        return res.status(404).send('Data not found or incomplete');
      }

      const textData = `
      ID: ${row.id}
      Label: ${row.formData.label || 'Unknown'}
      Previously Released: ${row.formData.previouslyReleased || 'Unknown'}
      Artist: ${row.formData.artist || 'Unknown'}
      Original Release Date: ${row.formData.originalReleaseDate || 'Unknown'}
      New Release Date: ${row.formData.newReleaseDate || 'Unknown'}
      Artist Spotify URL: ${row.formData.artistSpotifyUrl || 'Unknown'}
      Album Title: ${row.formData.albumTitle || 'Unknown'}
      Album UPC: ${row.formData.albumUPC || 'Unknown'}
      Track Title: ${row.formData.trackTitle || 'Unknown'}
      Track Version: ${row.formData.trackVersion || 'Unknown'}
      Track Artist: ${row.formData.trackArtist || 'Unknown'}
      Featuring Artists: ${row.formData.featuringArtists || 'Unknown'}
      Composer: ${row.formData.composer || 'Unknown'}
      Author: ${row.formData.author || 'Unknown'}
      ISRC Code: ${row.formData.isrcCode || 'Unknown'}
      P Line: ${row.formData.pLine || 'Unknown'}
      C Line: ${row.formData.cLine || 'Unknown'}
      Special Message: ${row.formData.specialMessage || 'Unknown'}
      Select Stores: ${row.formData.selectStores || 'Unknown'}
      
    `;
      
      res.setHeader('Content-Disposition', `attachment; filename=${row.id}_metadata.txt`);
      res.setHeader('Content-Type', 'text/plain');
      res.send(textData);
    } catch (parseError) {
      return res.status(500).send('Error parsing JSON data');
    }
  });
});

// Endpoint to download artwork


app.get('/download-artwork/:id', (req, res) => {

  const jsonData = require('./JSON DB/allData.json');

  const id = req.params.id;

  // Find the item in your JSON data that matches the provided ID
  const matchingItem = jsonData.find((item) => item.id === id);

  if (!matchingItem || !matchingItem.artworkFilePath) {
    return res.status(404).send('Artwork file not found');
  }

  const filePath = matchingItem.artworkFilePath; // Path to the artwork file

  res.download(filePath, `${id}_artwork.jpg`, (err) => {
    if (err) {
      res.status(500).send('Error downloading the file');
    }
  });
});


// Endpoint to download WAV file
app.get('/download-wav/:id', (req, res) => {
  const id = req.params.id;

  // Retrieve the JSON data or require it if it's in a separate file
  const jsonData = require('./JSON DB/allData.json');

  // Find the item in your JSON data that matches the provided ID
  const matchingItem = jsonData.find((item) => item.id === id);

  if (!matchingItem || !matchingItem.audioFilePath) {
    return res.status(404).send('Audio file not found');
  }

  const filePath = matchingItem.audioFilePath; // Path to the audio file

  res.download(filePath, `${id}_audio.wav`, (err) => {
    if (err) {
      res.status(500).send('Error downloading the file');
    }
  });
});


const { promises: fsPromises } = require('fs');

app.post('/api/upload', auth, upload.fields([{ name: 'audio' }, { name: 'artwork' }]), async (req, res) => {
  try {
    if (!req.files || !req.files['audio'] || !req.files['artwork']) {
      return res.status(400).send('Both audio and artwork files are required.');
    }

    const formData = req.body;
    const uniqueId = uuidv4();

    const uploadData = {
      id: uniqueId,
      userId: req.userId,
      fileDetails: {
        audio: { ...req.files['audio'][0] },
        artwork: { ...req.files['artwork'][0] },
      },
      formData,
      audioFilePath: path.join('uploads', req.files['audio'][0].filename),
      artworkFilePath: path.join('uploads', req.files['artwork'][0].filename),
      status: 'Pending'
    };

    let existingData = [];
    if (fs.existsSync(filePath)) {
      const fileContent = await fsPromises.readFile(filePath, 'utf-8');
      if (fileContent.trim() !== '') {
        existingData = JSON.parse(fileContent);
      }
    }

    existingData.push(uploadData);

    await fsPromises.writeFile(filePath, JSON.stringify(existingData, null, 2));

    const audioUploadPath = path.join(__dirname, 'uploads', req.files['audio'][0].filename);
    await fsPromises.rename(req.files['audio'][0].path, audioUploadPath);

    const artworkUploadPath = path.join(__dirname, 'uploads', req.files['artwork'][0].filename);
    await fsPromises.rename(req.files['artwork'][0].path, artworkUploadPath);

    res.status(200).send('Files uploaded and data saved as JSON.');
  } catch (error) {
    console.error('Error during file upload:', error);
    res.status(500).send('An error occurred during file upload.');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
