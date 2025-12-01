const mongoose = require('mongoose');
const GridFSBucket = require('mongodb').GridFSBucket;
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');

let gfs, gridfsBucket;

const conn = mongoose.connection;
conn.once('open', () => {
  gridfsBucket = new GridFSBucket(conn.db, {
    bucketName: 'documents'
  });
  gfs = gridfsBucket;
});

const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'documents'
    };
  }
});

const upload = multer({ storage });

module.exports = { gfs: () => gfs, gridfsBucket: () => gridfsBucket, upload };