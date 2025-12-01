import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MemberAvatar from '../components/MemberAvatar';

const MemberSelection = () => {
  const { selectMember } = useAuth();
  const navigate = useNavigate();

  const members = [
    'Sirazdeen',
    'Rahima Banu', 
    'Isful Shafan',
    'Majeejul Irfan',
    'Mohammed Farhan',
    'All Documents'
  ];

  const handleMemberSelect = (member) => {
    selectMember(member);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-4 sm:p-6 w-full max-w-4xl mx-4">
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3">
            <img 
              src="/logo.png" 
              alt="ISDocHub Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="bg-primary/10 rounded-full p-3 w-12 h-12 mx-auto" style={{display: 'none'}}>
              <Users className="h-6 w-6 text-primary mx-auto" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-gray-800 mb-1">Select Family Member</h1>
          <p className="text-sm text-gray-600">Choose a member to access their documents</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {members.map((member, index) => (
            <div
              key={member}
              onClick={() => handleMemberSelect(member)}
              className="bg-white border border-gray-200 hover:border-primary hover:shadow-xl p-4 sm:p-6 rounded-2xl transition-all duration-300 cursor-pointer group hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="transform group-hover:scale-105 transition-transform duration-300">
                    <MemberAvatar memberName={member} size="xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-semibold text-sm sm:text-base lg:text-lg text-gray-800 leading-tight">{member}</h3>
                  <p className="text-xs sm:text-sm text-gray-500">View documents</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-500 hover:text-primary transition-colors text-sm font-medium px-6 py-2 rounded-full hover:bg-primary/5"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberSelection;