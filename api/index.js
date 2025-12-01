const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

app.post('/api/auth/login', async (req, res) => {
  await connectDB();
  
  try {
    const { username, password } = req.body;
    
    if (username === 'ISDocHub' && password === 'ISFamily@2025') {
      const token = jwt.sign(
        { username: 'ISDocHub', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.json({
        token,
        user: { username: 'ISDocHub', role: 'user' }
      });
    }
    
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/docs', async (req, res) => {
  try {
    const sampleDocs = [
      {
        _id: '1',
        title: 'Sample Document 1',
        memberName: 'Sirazdeen',
        category: 'Personal Documents',
        fileName: 'sample1.pdf',
        fileSize: '1.2 MB',
        uploadDate: new Date()
      }
    ];
    
    res.json(sampleDocs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('*', (req, res) => {
  res.send(`
    <html>
    <head><title>ISDocHub</title></head>
    <body style="font-family: Arial; text-align: center; padding: 50px;">
      <h1>ISDocHub API</h1>
      <p>Family Document Management System</p>
      <p>API is running!</p>
    </body>
    </html>
  `);
});

module.exports = app;