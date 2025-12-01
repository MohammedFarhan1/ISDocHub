import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Eye, Settings, LogOut, FileText, Filter, Share2, CheckSquare, Square, X } from 'lucide-react';
import { toast } from 'react-toastify';

import { documentsAPI } from '../utils/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareDoc, setShareDoc] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  
  const user = { role: 'user' }; // Default user
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState('All Documents');

  const members = [
    'All Documents',
    'Sirazdeen',
    'Banu',
    'Shafan', 
    'Irfan',
    'Farhan'
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
  }, [documents, searchTerm, selectedCategory, selectedMember]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      console.log('Fetching documents...');
      const response = await documentsAPI.getDocuments('All Documents');
      console.log('Documents fetched:', response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error(`Failed to fetch documents: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;

    // Filter by member (except 'All Documents' and shared categories)
    if (selectedMember && selectedMember !== 'All Documents') {
      const memberMap = {
        'Sirazdeen': 'Sirazdeen',
        'Banu': 'Rahima Banu',
        'Shafan': 'Isful Shafan',
        'Irfan': 'Majeejul Irfan',
        'Farhan': 'Mohammed Farhan'
      };
      const actualMemberName = memberMap[selectedMember] || selectedMember;
      
      filtered = filtered.filter(doc => 
        doc.memberName === actualMemberName || 
        doc.category === 'Family Records' || 
        doc.category === 'Bills and Other'
      );
    }

    if (searchTerm) {
      const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
      filtered = filtered.filter(doc => {
        const searchableText = `${doc.title} ${doc.category} ${doc.memberName}`.toLowerCase();
        return searchWords.every(word => searchableText.includes(word));
      });
    }

    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    setFilteredDocs(filtered);
  };

  const handleDownload = async (doc) => {
    try {
      const response = await documentsAPI.downloadDocument(doc._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.fileName || doc.title);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleView = (doc) => {
    navigate(`/document/${doc._id}`);
  };

  const toggleDocSelection = (docId) => {
    setSelectedDocs(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleMultiDownload = async () => {
    if (selectedDocs.length === 0) {
      toast.warning('Please select documents to download');
      return;
    }

    toast.info(`Downloading ${selectedDocs.length} documents...`);
    
    for (const docId of selectedDocs) {
      const doc = documents.find(d => d._id === docId);
      if (doc) {
        try {
          await handleDownload(doc);
          await new Promise(resolve => setTimeout(resolve, 500)); // Delay between downloads
        } catch (error) {
          console.error(`Failed to download ${doc.title}`);
        }
      }
    }
    
    setSelectedDocs([]);
    setIsMultiSelectMode(false);
    toast.success('All documents downloaded!');
  };

  const handleShare = (doc) => {
    setShareDoc(doc);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/document/${shareDoc._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
    setShowShareModal(false);
  };

  const shareViaEmail = () => {
    const subject = `Document: ${shareDoc.title}`;
    const body = `I'm sharing this document with you: ${shareDoc.title}\n\nView it here: ${window.location.origin}/document/${shareDoc._id}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setShowShareModal(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin@123') {
      navigate('/admin');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 gap-3">
              <img src="/logo.png" alt="ISDocHub" className="h-8 w-8 sm:h-10 sm:w-10" />
              <h1 className="text-lg sm:text-2xl font-heading font-bold text-primary truncate">ISDocHub</h1>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center px-2 sm:px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-4 md:px-6 lg:px-8">
        {/* Simple Member Filter */}
        <div className="mb-4">
          <div className="bg-white rounded-2xl p-2 shadow-sm border">
            <div className="grid grid-cols-3 gap-1">
              {members.slice(0, 6).map(member => (
                <button
                  key={member}
                  onClick={() => setSelectedMember(member)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all ${
                    selectedMember === member
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-bold text-base">{member === 'All Documents' ? 'All' : member.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simple Search & Filter */}
        <div className="mb-4 space-y-3">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-0 transition-all duration-200 bg-white shadow-sm"
          />
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Simple Multi-Select */}
          {isMultiSelectMode ? (
            <div className="bg-blue-50 p-3 rounded-2xl flex items-center justify-between">
              <span className="text-sm text-blue-700">{selectedDocs.length} selected</span>
              <div className="flex gap-2">
                {selectedDocs.length > 0 && (
                  <button
                    onClick={handleMultiDownload}
                    className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMultiSelectMode(false);
                    setSelectedDocs([]);
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl text-sm font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setIsMultiSelectMode(true)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
              >
                Select Multiple
              </button>
            </div>
          )}
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No documents found</p>
          </div>
        ) : (
          <>
            {/* Mobile List View */}
            <div className="space-y-3 md:hidden">
              {filteredDocs.map((doc, index) => (
                <div 
                  key={doc._id} 
                  className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                    selectedDocs.includes(doc._id) ? 'border-primary bg-blue-50' : 'border-gray-100'
                  } ${isMultiSelectMode ? 'cursor-pointer' : ''}`}
                  onClick={() => isMultiSelectMode && toggleDocSelection(doc._id)}
                >
                  <div className="flex items-center gap-4">
                    {isMultiSelectMode && (
                      <div className="flex-shrink-0">
                        {selectedDocs.includes(doc._id) ? (
                          <CheckSquare className="h-6 w-6 text-primary" />
                        ) : (
                          <Square className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                      <p className="text-base font-black text-gray-900">{doc.memberName}</p>
                    </div>
                    
                    {!isMultiSelectMode && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="p-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Grid View */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
              {filteredDocs.map((doc, index) => (
                <div 
                  key={doc._id} 
                  className={`bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                    selectedDocs.includes(doc._id) ? 'ring-2 ring-primary shadow-lg' : ''
                  } ${isMultiSelectMode ? 'cursor-pointer' : ''}`}
                  onClick={() => isMultiSelectMode && toggleDocSelection(doc._id)}
                >
                  <div className="p-4 relative flex flex-col items-center justify-between h-full min-h-[200px]">
                    {isMultiSelectMode && (
                      <div className="absolute top-2 right-2 z-10">
                        {selectedDocs.includes(doc._id) ? (
                          <CheckSquare className="h-5 w-5 text-primary" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-lg mx-auto mb-3">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center text-center px-2">
                      <h3 className="font-semibold text-gray-900 mb-2 leading-tight" title={doc.title}>
                        <span className="line-clamp-2">{doc.title}</span>
                      </h3>
                      
                      <p className="text-sm font-black text-gray-900 mb-3">{doc.memberName}</p>
                    </div>
                    
                    {!isMultiSelectMode && (
                      <div className="flex-shrink-0 w-full">
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleView(doc)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleShare(doc)}
                            className="flex items-center justify-center px-2 py-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Admin Access</h3>
                <button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminCredentials({ username: '', password: '' });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 touch-manipulation"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <input
                  type="text"
                  placeholder="Username"
                  value={adminCredentials.username}
                  onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                  className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white touch-manipulation"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={adminCredentials.password}
                  onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                  className="w-full px-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-0 transition-all duration-200 bg-gray-50 focus:bg-white touch-manipulation"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold text-base shadow-lg transform active:scale-95 touch-manipulation"
                >
                  Access Admin Panel
                </button>
              </form>

            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && shareDoc && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-slideInUp">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share Document</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Document:</p>
                <p className="font-medium text-gray-900">{shareDoc.title}</p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={copyShareLink}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-800 transition-all duration-200 transform hover:scale-105"
                >
                  <Share2 className="h-4 w-4" />
                  Copy Share Link
                </button>
                
                <button
                  onClick={shareViaEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Share via Email
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;