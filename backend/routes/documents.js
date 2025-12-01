const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const Document = require('../models/Document');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get documents by member
router.get('/', async (req, res) => {
  try {
    const { memberName } = req.query;
    
    let query = {};
    if (memberName && memberName !== 'All Documents') {
      query.memberName = memberName;
    }

    const documents = await Document.find(query).sort({ createdAt: -1 });
    console.log(`Found ${documents.length} documents for query:`, query);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
  }
});

// Download document
router.get('/download/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'documents'
    });
    const downloadStream = bucket.openDownloadStream(document.fileReference);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${document.fileName}"`
    });

    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// View document (stream)
router.get('/view/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'documents'
    });
    const downloadStream = bucket.openDownloadStream(document.fileReference);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'File not found' });
    });

    res.set('Content-Type', 'application/pdf');
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;