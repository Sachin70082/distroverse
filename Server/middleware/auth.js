const jwt = require('jsonwebtoken');
const fs = require('fs'); // Node.js file system module

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization header is missing.');
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    console.log('Invalid authorization header format.');
    return res.status(401).json({ message: 'Invalid authorization header format.' });
  }

  try {
    const decoded = jwt.verify(token, 'myDistroverseSecretKey');

    // Read user data from the JSON file
    const userData = JSON.parse(fs.readFileSync('./JSON DB/userData.json', 'utf8'));

    // Assuming userData is an array of user objects with an 'id' field
    const user = userData.find(user => user.token === token);


    if (!user) {
      console.log('User not found.');
      return res.status(404).json({ message: 'User not found.' });
    }

    req.userId = user.id; // Assuming the 'id' field represents the user ID

    next();
  } catch (error) {
    // Handle token verification errors
    // ...
  }
};

module.exports = auth;
