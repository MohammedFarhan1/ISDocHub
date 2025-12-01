import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Edit, Trash2, ArrowLeft, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminAPI, documentsAPI } from '../utils/api';
import MemberAvatar from '../components/MemberAvatar';

const AdminPanel = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showImageManager, setShowImageManager] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [memberImages, setMemberImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const navigate = useNavigate();

  const members = [
    'Sirazdeen',
    'Rahima Banu',
    'Isful Shafan', 
    'Majeejul Irfan',
    'Mohammed Farhan'
  ];

  const categories = [
    'Personal Documents',
    'Academic Certificates',
    'Family Records',
    'Bills and Other'
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, selectedMember, selectedCategory]);

  const filterDocuments = () => {
    let filtered = documents;

    if (selectedMember) {
      filtered = filtered.filter(doc => doc.memberName === selectedMember);
    }

    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    setFilteredDocs(filtered);
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsAPI.getDocuments('All Documents');
      setDocuments(response.data);
      setFilteredDocs(response.data);
    } catch (error) {
      toast.error('Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (formData) => {
    try {
      await adminAPI.uploadDocument(formData);
      // Don't show individual success messages for multiple uploads
      // The UploadForm component will handle the success message
    } catch (error) {
      toast.error(`Failed to upload: ${formData.get('title')}`);
      throw error; // Re-throw to stop the upload process
    }
  };

  const handleMultipleUploadComplete = () => {
    toast.success('All documents uploaded successfully');
    setShowUploadForm(false);
    fetchDocuments();
  };

  const handleUpdate = async (id, data) => {
    try {
      await adminAPI.updateDocument(id, data);
      toast.success('Document updated successfully');
      setEditingDoc(null);
      fetchDocuments();
    } catch (error) {
      toast.error('Failed to update document');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await adminAPI.deleteDocument(id);
        toast.success('Document deleted successfully');
        fetchDocuments();
      } catch (error) {
        toast.error('Failed to delete document');
      }
    }
  };

  const handleImageUpload = async (formData) => {
    try {
      await adminAPI.uploadMemberImage(formData);
      toast.success('Member image uploaded successfully');
      setShowImageUpload(false);
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-primary rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img 
                src="/logo.png" 
                alt="ISDocHub Logo" 
                className="h-8 w-8 object-contain"
                onError={(e) => e.target.style.display = 'none'}
              />
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowUploadForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-xl hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </button>
              <button
                onClick={() => setShowImageUpload(true)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Image</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Upload Form Modal */}
        {showUploadForm && (
          <UploadForm
            members={members}
            categories={categories}
            onSubmit={handleUpload}
            onComplete={handleMultipleUploadComplete}
            onClose={() => setShowUploadForm(false)}
          />
        )}

        {/* Image Upload Modal */}
        {showImageUpload && (
          <ImageUploadForm
            members={members}
            onSubmit={handleImageUpload}
            onClose={() => setShowImageUpload(false)}
          />
        )}



        {/* Edit Form Modal */}
        {editingDoc && (
          <EditForm
            document={editingDoc}
            members={members}
            categories={categories}
            onSubmit={(data) => handleUpdate(editingDoc._id, data)}
            onClose={() => setEditingDoc(null)}
          />
        )}

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-sm border p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Documents</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member</label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition-all"
              >
                <option value="">All Members</option>
                {members.map(member => (
                  <option key={member} value={member}>{member}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition-all"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600 font-medium">
              {filteredDocs.length} of {documents.length} documents
            </p>
            {(selectedMember || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedMember('');
                  setSelectedCategory('');
                }}
                className="text-sm text-primary hover:text-blue-800 transition-colors font-medium px-3 py-1 rounded-lg hover:bg-primary/10"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Documents Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Documents</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocs.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{doc.memberName}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{doc.category}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{doc.fileSize}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingDoc(doc)}
                            className="text-primary hover:text-blue-800 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Documents Cards - Mobile/Tablet */}
        <div className="lg:hidden space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-500 font-medium">Loading documents...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No documents found</p>
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <div key={doc._id} className="bg-white rounded-2xl shadow-sm border-2 border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 leading-tight">{doc.title}</h3>
                    <p className="text-sm font-medium text-primary">{doc.memberName}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingDoc(doc)}
                      className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Category</span>
                    <span className="text-sm text-gray-900 font-medium">{doc.category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Size</span>
                    <span className="text-sm text-gray-900 font-medium">{doc.fileSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Date</span>
                    <span className="text-sm text-gray-900 font-medium">{new Date(doc.createdAt || doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

// Upload Form Component
const UploadForm = ({ members, categories, onSubmit, onComplete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    memberName: '',
    category: '',
    files: []
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({...formData, files: selectedFiles});
    
    // Auto-set title from first file if title is empty
    if (!formData.title && selectedFiles.length > 0) {
      const fileName = selectedFiles[0].name;
      const titleFromFile = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
      setFormData(prev => ({...prev, title: titleFromFile, files: selectedFiles}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const membersList = formData.memberName === 'All' ? 
        ['Sirazdeen', 'Rahima Banu', 'Isful Shafan', 'Majeejul Irfan', 'Mohammed Farhan'] : 
        [formData.memberName];
      
      for (let i = 0; i < formData.files.length; i++) {
        const file = formData.files[i];
        
        // Use provided title for first file, or generate from filename for others
        const title = i === 0 && formData.title ? 
          formData.title : 
          file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        
        for (const member of membersList) {
          const data = new FormData();
          data.append('title', title);
          data.append('memberName', member);
          data.append('category', formData.category);
          data.append('file', file);
          
          await onSubmit(data);
        }
      }
      onComplete();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Upload Document(s)</h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Document Title (optional - will use filename if empty)"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
          />
          <select
            value={formData.memberName}
            onChange={(e) => setFormData({...formData, memberName: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select Member</option>
            <option value="All">All Members</option>
            {members.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
          {formData.files.length > 0 && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <p className="font-medium mb-1">{formData.files.length} file(s) selected:</p>
              {formData.files.map((file, index) => (
                <p key={index} className="truncate">• {file.name}</p>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button 
              type="submit" 
              disabled={uploading}
              className="flex-1 bg-primary text-white py-2.5 sm:py-3 text-sm rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : `Upload ${formData.files.length > 1 ? `${formData.files.length} Files` : 'File'}`}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={uploading}
              className="flex-1 bg-gray-300 text-gray-700 py-2.5 sm:py-3 text-sm rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Form Component
const EditForm = ({ document, members, categories, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: document.title,
    memberName: document.memberName,
    category: document.category
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Edit Document</h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            placeholder="Document Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
          <select
            value={formData.memberName}
            onChange={(e) => setFormData({...formData, memberName: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            {members.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button type="submit" className="flex-1 bg-primary text-white py-2.5 sm:py-3 text-sm rounded-lg hover:bg-blue-800 transition-colors">
              Update
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2.5 sm:py-3 text-sm rounded-lg hover:bg-gray-400 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Image Upload Form Component
const ImageUploadForm = ({ members, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    memberName: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [imageScale, setImageScale] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({...formData, image: file});
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setShowPreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('memberName', formData.memberName);
    data.append('image', formData.image);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Upload Member Image</h3>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <select
            value={formData.memberName}
            onChange={(e) => setFormData({...formData, memberName: e.target.value})}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select Member</option>
            {members.filter(m => m !== 'All Documents').map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full p-2.5 sm:p-3 text-sm border rounded-lg focus:ring-2 focus:ring-primary"
            required
          />
          
          {/* Image Preview with Controls */}
          {showPreview && imagePreview && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="text-sm font-medium mb-3 text-center">Adjust image fit:</p>
              
              {/* Preview Circle */}
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 relative bg-white">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${imageScale}) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                    }}
                  />
                </div>
              </div>
              
              {/* Controls */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Zoom: {Math.round(imageScale * 100)}%</label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={imageScale}
                    onChange={(e) => setImageScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Horizontal</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={imagePosition.x}
                      onChange={(e) => setImagePosition({...imagePosition, x: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Vertical</label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={imagePosition.y}
                      onChange={(e) => setImagePosition({...imagePosition, y: parseInt(e.target.value)})}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    setImageScale(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                  className="w-full text-xs bg-gray-200 text-gray-700 py-1 rounded hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2.5 sm:py-3 text-sm rounded-lg hover:bg-green-700 transition-colors">
              Upload & Fit to Circle
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2.5 sm:py-3 text-sm rounded-lg hover:bg-gray-400 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default AdminPanel;