import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trim whitespace from inputs
    const trimmedCredentials = {
      username: credentials.username.trim(),
      password: credentials.password.trim()
    };
    
    if (!trimmedCredentials.username || !trimmedCredentials.password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setLoading(true);

    try {
      const response = await authAPI.login(trimmedCredentials);
      login(response.data.token, response.data.user);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-blue-800 p-3 sm:p-4">
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-3 animate-fadeInUp">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/logo.png" 
              alt="ISDocHub Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="bg-primary/10 rounded-full p-3 w-16 h-16 mx-auto animate-pulse" style={{display: 'none'}}>
              <svg className="w-10 h-10 text-primary mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-primary mb-2">ISDocHub</h1>
          <p className="text-sm sm:text-base text-gray-600">Family Document Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-0 transition-all duration-200"
                placeholder="Enter username"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-0 transition-all duration-200"
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !credentials.username.trim() || !credentials.password.trim()}
            className="w-full bg-primary text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 active:scale-95 text-base touch-manipulation"
            onTouchStart={() => {}}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
          <p className="mb-2">Demo Credentials:</p>
          <p><strong>Username:</strong> ISDocHub</p>
          <p><strong>Password:</strong> ISFamily@2025</p>
        </div>
      </div>
    </div>
  );
};

export default Login;