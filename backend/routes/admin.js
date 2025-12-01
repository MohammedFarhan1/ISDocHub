const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const Document = require('../models/Document');
const MemberImage = require('../models/MemberImage');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload document
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const { title, memberName, category } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create GridFS bucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'documents'
    });

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { title, memberName, category }
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      const document = new Document({
        title,
        memberName,
        category,
        fileReference: uploadStream.id,
        fileName: req.file.originalname,
        fileSize: `${(req.file.size / 1024).toFixed(2)} KB`,
        uploadedBy: req.user.username
      });

      await document.save();
      res.json({ message: 'Document uploaded successfully', document });
    });

    uploadStream.on('error', (error) => {
      res.status(500).json({ message: 'Upload failed' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update document
router.put('/update/:id', adminAuth, async (req, res) => {
  try {
    const { title, memberName, category } = req.body;
    
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { title, memberName, category },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully', document });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete document
router.delete('/delete/:id', adminAuth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'documents'
    });
    await bucket.delete(document.fileReference);

    // Delete from documents collection
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all documents for admin
router.get('/documents', adminAuth, async (req, res) => {
  try {
    const documents = await Document.find().sort({ uploadDate: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload member image
router.post('/upload-member-image', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { memberName } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'memberImages'
    });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: { memberName }
    });
    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      // Delete existing image if any
      try {
        const existingImage = await MemberImage.findOne({ memberName });
        if (existingImage) {
          await bucket.delete(existingImage.imageId);
          await MemberImage.findByIdAndDelete(existingImage._id);
        }
      } catch (deleteError) {
        console.log('No existing image to delete');
      }

      const memberImage = new MemberImage({
        memberName,
        imageId: uploadStream.id,
        fileName: req.file.originalname,
        uploadedBy: req.user.username
      });

      await memberImage.save();
      res.json({ message: 'Member image uploaded successfully', memberImage });
    });

    uploadStream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get member image by name
router.get('/member-image/:memberName', async (req, res) => {
  try {
    const memberImage = await MemberImage.findOne({ memberName: req.params.memberName });
    if (!memberImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'memberImages'
    });
    const downloadStream = bucket.openDownloadStream(memberImage.imageId);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'Image file not found' });
    });

    res.set('Content-Type', 'image/jpeg');
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;