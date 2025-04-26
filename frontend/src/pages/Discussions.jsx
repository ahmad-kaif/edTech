import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { FiSearch, FiFilter, FiMessageSquare, FiUser, FiClock } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';
import toast from 'react-hot-toast';

export default function Discussions() {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, my-posts, my-replies

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await api.get('/discussions');
        setDiscussions(response.data);
      } catch (error) {
        console.error('Error fetching discussions:', error);
        toast.error('Failed to load discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'my-posts') return matchesSearch && discussion.author._id === currentUser._id;
    if (filter === 'my-replies') {
      return matchesSearch && discussion.replies.some(reply => reply.author._id === currentUser._id);
    }
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Discussions</h1>
          <Link
            to="/discussions/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FiMessageSquare className="mr-2" />
            Start Discussion
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              }`}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              }`}
            >
              <option value="all">All Discussions</option>
              <option value="my-posts">My Posts</option>
              <option value="my-replies">My Replies</option>
            </select>
          </div>
        </div>

        {/* Discussions List */}
        <div className="space-y-4">
          {filteredDiscussions.map(discussion => (
            <Link
              key={discussion._id}
              to={`/discussions/${discussion._id}`}
              className={`block p-6 rounded-xl shadow-sm transition-shadow hover:shadow-md ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {discussion.title}
                  </h3>
                  <p className={`mb-4 line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {discussion.content}
                  </p>
                </div>
                <div className={`flex items-center space-x-2 text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <span className="bg-blue-600/10 text-blue-600 px-2 py-1 rounded">
                    {discussion.replies?.length || 0} replies
                  </span>
                </div>
              </div>
              <div className={`flex items-center justify-between text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <div className="flex items-center">
                  <img
                    src={discussion.author.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.author.name)}&background=random`}
                    alt={discussion.author.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{discussion.author.name}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDiscussions.length === 0 && (
          <div className="text-center py-12">
            <FiMessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No discussions found
            </h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {searchTerm ? 'Try adjusting your search' : 'Be the first to start a discussion!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 