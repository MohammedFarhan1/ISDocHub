const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;

  // Login endpoint
  if (url === '/api/auth/login' && method === 'POST') {
    const { username, password } = req.body;
    
    if (username === 'ISDocHub' && password === 'ISFamily@2025') {
      const token = jwt.sign(
        { username: 'ISDocHub', role: 'user' },
        process.env.JWT_SECRET || 'ISDocHub_Family_Secret_Key_2025',
        { expiresIn: '24h' }
      );
      
      return res.json({
        token,
        user: { username: 'ISDocHub', role: 'user' }
      });
    }
    
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Documents endpoint
  if (url.startsWith('/api/docs') && method === 'GET') {
    const sampleDocs = [
      {
        _id: '1',
        title: 'Family Photo Album',
        memberName: 'Sirazdeen',
        category: 'Personal Documents',
        fileName: 'photos.pdf',
        fileSize: '2.1 MB',
        uploadDate: new Date('2024-01-15')
      },
      {
        _id: '2',
        title: 'Birth Certificate',
        memberName: 'Rahima Banu',
        category: 'Personal Documents',
        fileName: 'birth_cert.pdf',
        fileSize: '850 KB',
        uploadDate: new Date('2024-02-10')
      },
      {
        _id: '3',
        title: 'Degree Certificate',
        memberName: 'Isful Shafan',
        category: 'Academic Certificates',
        fileName: 'degree.pdf',
        fileSize: '1.5 MB',
        uploadDate: new Date('2024-03-05')
      },
      {
        _id: '4',
        title: 'Passport Copy',
        memberName: 'Majeejul Irfan',
        category: 'Personal Documents',
        fileName: 'passport.pdf',
        fileSize: '1.2 MB',
        uploadDate: new Date('2024-04-12')
      },
      {
        _id: '5',
        title: 'Work Experience Letter',
        memberName: 'Mohammed Farhan',
        category: 'Work & Experience Documents',
        fileName: 'experience.pdf',
        fileSize: '900 KB',
        uploadDate: new Date('2024-05-20')
      }
    ];
    
    return res.json(sampleDocs);
  }

  // Default response
  res.status(200).json({ 
    message: 'ISDocHub API is running!',
    endpoints: ['/api/auth/login', '/api/docs']
  });
};