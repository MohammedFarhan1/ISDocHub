const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Personal Documents', 'Academic Certificates', 'Family Records', 'Bills and Other']
  },
  fileReference: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true
  },
  fileName: String,
  fileSize: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);