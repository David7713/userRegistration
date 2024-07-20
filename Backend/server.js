import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Helper function to read users from file
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync('users.json', 'utf-8'));
  } catch (error) {
    console.error('Error reading users file:', error); // Log file read errors
    return []; // Return an empty array if there's an error reading the file
  }
};

// Endpoint to register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Registration failed: Username or password missing'); // Log missing data
    return res.status(400).send('Username and password are required.');
  }

  const users = readUsers();

  if (users.find(user => user.username === username)) {
    console.log('Registration failed: User already exists', username); // Log existing user
    return res.status(400).send('User already exists.');
  }

  users.push({ username, password });
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  console.log('User registered successfully:', username); // Log successful registration
  res.status(201).send('User registered successfully.');
});

// Endpoint to log in a user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Login failed: Username or password missing'); // Log missing data
    return res.status(400).send('Username and password are required.');
  }

  const users = readUsers();

  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    console.log('Login failed: Invalid username or password', username); // Log invalid login attempt
    return res.status(400).send('Invalid username or password.');
  }

  console.log('User logged in successfully:', username); // Log successful login
  res.status(200).send('User logged in successfully.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
