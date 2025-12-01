const mongoose = require('mongoose');

const memberImageSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true,
    unique: true
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  fileName: String,
  uploadedBy: String
}, {
  timestamps: true
});

module.exports = mongoose.model('MemberImage', memberImageSchema);