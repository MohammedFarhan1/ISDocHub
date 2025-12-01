import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { documentsAPI, adminAPI } from '../utils/api';

const DocumentViewer = () => {
  const [document, setDocument] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      
      // Get document metadata
      const docsResponse = await documentsAPI.getDocuments();
      const doc = docsResponse.data.find(d => d._id === id);
      setDocument(doc);

      // Get document file
      const fileResponse = await documentsAPI.viewDocument(id);
      const url = URL.createObjectURL(fileResponse.data);
      setDocumentUrl(url);
    } catch (error) {
      toast.error('Failed to load document');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await documentsAPI.downloadDocument(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document?.fileName || document?.title);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Document downloaded successfully');
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center min-w-0 flex-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-2 sm:mr-4 p-2 text-gray-600 hover:text-primary flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-xl font-heading font-bold text-primary truncate">{document?.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">{document?.memberName} • {document?.category}</p>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              className="flex items-center px-2 sm:px-4 py-2 bg-accent text-white rounded-lg hover:bg-green-700 transition-colors flex-shrink-0 ml-2"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      </header>

      {/* Document Viewer */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {documentUrl ? (
            <iframe
              src={documentUrl}
              className="w-full h-[60vh] sm:h-[70vh] lg:h-screen"
              title={document?.title}
            />
          ) : (
            <div className="flex items-center justify-center h-64 sm:h-96">
              <div className="text-center p-4">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-600 mb-4">Unable to display document</p>
                <button
                  onClick={handleDownload}
                  className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Download to View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Document Metadata */}
        {document && (
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Document Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-xs sm:text-sm text-gray-900 break-words">{document.title}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Member</label>
                <p className="mt-1 text-xs sm:text-sm text-gray-900">{document.memberName}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Category</label>
                <p className="mt-1 text-xs sm:text-sm text-gray-900">{document.category}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">File Size</label>
                <p className="mt-1 text-xs sm:text-sm text-gray-900">{document.fileSize}</p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Upload Date</label>
                <p className="mt-1 text-xs sm:text-sm text-gray-900">
                  {new Date(document.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700">Uploaded By</label>
                <p className="mt-1 text-xs sm:text-sm text-gray-900">{document.uploadedBy}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DocumentViewer;