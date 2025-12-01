# ISDocHub - Family Document Management System

A secure family document management portal built with React.js, Node.js, and MongoDB.

## Features

- **Single Login System**: All family members use one credential (ISDocHub / ISFamily@2025)
- **Member Selection**: Choose family member after login to view their documents
- **Document Gallery**: Clean, responsive grid layout with search and filter
- **Admin Panel**: Upload, edit, and delete documents (admin only)
- **GridFS Storage**: All documents stored securely in MongoDB
- **Role-Based Access**: Admin can manage, others can view/download only
- **JWT Authentication**: Secure token-based authentication

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + GridFS
- **Authentication**: JWT

## Project Structure

```
ISDocHub/
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   └── Document.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── documents.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── config/
│   │   └── gridfs.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── MemberSelection.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AdminPanel.js
│   │   │   └── DocumentViewer.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running on localhost:27017)

### Step 1: Clone & Install Dependencies

```bash
# Backend
cd backend
npm install --legacy-peer-deps

# Frontend
cd ../frontend
npm install
```

### Step 2: Environment Configuration

Create `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/isdochub
JWT_SECRET=ISDocHub_Family_Secret_Key_2025
PORT=5000
```

### Step 3: Start MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### Step 4: Start Backend Server

```bash
cd backend
npm start
```

Server runs on: http://localhost:5000

### Step 5: Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on: http://localhost:3000

## Usage

### Login Credentials
- **Username**: ISDocHub
- **Password**: ISFamily@2025

### Family Members
1. Sirazdeen
2. Rahima Banu
3. Isful Shafan
4. Majeejul Irfan
5. Mohammed Farhan
6. All Documents

### Document Categories
- Personal Documents
- Academic Certificates
- Family Records
- Work & Experience Documents

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Documents
- `GET /api/docs?memberName=` - Get documents by member
- `GET /api/docs/download/:id` - Download document
- `GET /api/docs/view/:id` - View document

### Admin (Protected)
- `POST /api/admin/upload` - Upload document
- `PUT /api/admin/update/:id` - Update document
- `DELETE /api/admin/delete/:id` - Delete document
- `GET /api/admin/documents` - Get all documents

## Database Schema

### Admin Collection
```javascript
{
  _id: ObjectId,
  username: "ISDocHub",
  passwordHash: "bcrypt_hash",
  role: "admin"
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  title: String,
  memberName: String,
  category: String,
  fileId: ObjectId, // GridFS reference
  uploadedBy: "admin",
  uploadDate: Date,
  fileSize: String,
  fileName: String
}
```

## Features Overview

### User Features
- Login with single credential
- Select family member
- View documents in gallery format
- Search and filter documents
- Download documents
- View documents in browser

### Admin Features
- All user features
- Upload new documents
- Edit document metadata
- Delete documents
- Manage all family documents

## Security Features

- JWT-based authentication
- Role-based access control
- Secure file storage in MongoDB GridFS
- Input validation and sanitization
- Protected admin routes

## Production Deployment

### Environment Variables
```
NODE_ENV=production
MONGODB_URI=mongodb://your-mongo-url/isdochub
JWT_SECRET=your-secure-jwt-secret
PORT=5000
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy
- Backend: Deploy to services like Heroku, AWS, or DigitalOcean
- Frontend: Deploy build folder to Netlify, Vercel, or serve from Express
- Database: Use MongoDB Atlas for cloud database

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **CORS Issues**
   - Verify backend CORS configuration
   - Check API base URL in frontend

3. **File Upload Issues**
   - Ensure GridFS is properly configured
   - Check file size limits

4. **Authentication Issues**
   - Verify JWT secret matches
   - Check token expiration

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.

## Deployment

### Quick Deploy
1. **Frontend**: Deploy to [Netlify](https://netlify.com) (drag & drop `frontend/build` folder)
2. **Backend**: Deploy to [Railway](https://railway.app) (connect GitHub repo)
3. **Database**: Use [MongoDB Atlas](https://mongodb.com/atlas) free tier

### Environment Variables
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=ISDocHub_Family_Secret_Key_2025
PORT=5000
```

## License

This project is licensed under the MIT License.