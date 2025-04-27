import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { FiSearch, FiFilter, FiMessageSquare, FiUser, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Discussions() {
  const { currentUser } = useAuth();
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
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent"></div>
      <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl animate-float"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-3xl animate-float-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 tracking-wide">Discussions</h1>
          <Link
            to="/discussions/create"
            className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium tracking-wide shadow-lg shadow-blue-500/30 transition-all"
          >
            <FiMessageSquare className="mr-2 h-5 w-5" />
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
              className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
              className="block p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all shadow-lg shadow-blue-500/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">{discussion.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{discussion.content}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {discussion.replies?.length || 0} replies
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <img
                    src={discussion.author.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(discussion.author.name)}&background=random`}
                    alt={discussion.author.name}
                    className="w-6 h-6 rounded-full border border-white/20 mr-2"
                  />
                  <span>{discussion.author.name}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1 h-4 w-4" />
                  <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDiscussions.length === 0 && (
          <div className="text-center py-12">
            <FiMessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white tracking-wide">No discussions found</h3>
            <p className="text-gray-300">
              {searchTerm ? 'Try adjusting your search' : 'Be the first to start a discussion!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}