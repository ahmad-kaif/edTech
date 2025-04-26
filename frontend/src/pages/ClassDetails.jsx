import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiClock, FiBook, FiMessageSquare, FiStar, FiTrash2, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function FuturisticClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discussions, setDiscussions] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        console.log('Fetching class data for ID:', id);
        const classRes = await api.get(`/classes/${id}`);
        
        console.log('Class data received:', classRes.data);
        if (!classRes.data) {
          throw new Error('No class data received');
        }

        setClassData(classRes.data);
        setIsEnrolled(classRes.data.enrolledStudents?.includes(currentUser?._id));
        setIsMentor(classRes.data.mentor._id === currentUser?._id);

        // Try to fetch discussions, but don't fail if it doesn't work
        try {
          const discussionsRes = await api.get(`/discussions?classId=${id}`);
          setDiscussions(discussionsRes.data || []);
        } catch (discussionError) {
          console.log('Discussions not available yet:', discussionError);
          setDiscussions([]);
        }
      } catch (error) {
        console.error('Error fetching class data:', error);
        console.error('Error response:', error.response);
        toast.error(error.response?.data?.message || 'Failed to load class details');
        setClassData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      setLoading(true);
      fetchClassData();
    }
  }, [id, currentUser?._id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/classes/${id}/enroll`);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in the class!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll in the class');
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm('Are you sure you want to unenroll from this class?')) return;
    
    try {
      await api.post(`/classes/${id}/unenroll`);
      setIsEnrolled(false);
      toast.success('Successfully unenrolled from the class');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unenroll from the class');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) return;
    
    try {
      await api.delete(`/classes/${id}`);
      toast.success('Class deleted successfully');
      navigate('/classes');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete class');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent"></div>
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-bold text-white tracking-wide">Class not found</h2>
          <Link to="/classes" className="text-blue-400 hover:text-blue-300 mt-4 inline-block font-medium tracking-wide">
            Return to Classes
          </Link>
        </div>
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
        {/* Class Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-xl p-8 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-wide">{classData.title}</h1>
              <p className="text-lg text-gray-300 mb-6">{classData.description}</p>
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 mr-2" />
                  <span>{classData.enrolledStudents?.length || 0} Students</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 mr-2" />
                  <span>{classData.schedule || 'Schedule TBD'}</span>
                </div>
                {classData.maxStudents && (
                  <div className="flex items-center">
                    <FiUsers className="h-5 w-5 mr-2" />
                    <span>Max {classData.maxStudents} students</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              {!isEnrolled && currentUser && (
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium tracking-wide shadow-lg shadow-blue-500/30 transition-all flex items-center"
                >
                  <FiUsers className="mr-2" />
                  Enroll Now
                </button>
              )}
              {isEnrolled && !isMentor && (
                <button
                  onClick={handleUnenroll}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium tracking-wide shadow-lg shadow-red-500/30 transition-all flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Unenroll
                </button>
              )}
              {(isMentor || currentUser?.role === 'admin') && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-medium tracking-wide shadow-lg shadow-red-500/30 transition-all flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete Class
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="rounded-xl p-8 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">Course Content</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/10">
                  <div className="flex items-start space-x-4">
                    <FiBook className="h-5 w-5 mt-1 text-blue-400" />
                    <div>
                      <h3 className="font-semibold text-white">Content Type</h3>
                      <p className="text-gray-300">
                        {classData.contentType === 'live' ? 'Live Sessions' : 
                         classData.contentType === 'video' ? 'Pre-recorded Video' : 
                         'Uploadable Content'}
                      </p>
                      {classData.contentUrl && (
                        <a 
                          href={classData.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 mt-2 inline-block font-medium tracking-wide"
                        >
                          Access Content
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Discussions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white tracking-wide">Discussions</h2>
                {isEnrolled && (
                  <Link
                    to={`/discussions/create?classId=${id}`}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium tracking-wide shadow-md transition-all"
                  >
                    Start Discussion
                  </Link>
                )}
              </div>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Link
                    key={discussion._id}
                    to={`/discussions/${discussion._id}`}
                    className="block p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white tracking-wide">{discussion.title}</h3>
                        <p className="text-sm text-gray-300 mt-1 line-clamp-2">{discussion.content}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <FiMessageSquare className="h-4 w-4 mr-1" />
                        <span>{discussion.replies?.length || 0} replies</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-400">
                      <span>Posted by {discussion.author.name}</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Mentor Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">Mentor</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={classData.mentor.profilePicture || 'https://via.placeholder.com/50'}
                  alt={classData.mentor.name}
                  className="w-12 h-12 rounded-full border border-white/20"
                />
                <div>
                  <h3 className="font-semibold text-white tracking-wide">{classData.mentor.name}</h3>
                  <p className="text-gray-300">{classData.mentor.bio || 'No bio available'}</p>
                </div>
              </div>
            </motion.div>

            {/* Class Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
            >
              <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">Class Info</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-semibold text-white">Category</h3>
                  <p className="capitalize">{classData.category}</p>
                </div>
                {classData.prerequisites && (
                  <div>
                    <h3 className="font-semibold text-white">Prerequisites</h3>
                    <p>{classData.prerequisites}</p>
                  </div>
                )}
                {classData.materials && (
                  <div>
                    <h3 className="font-semibold text-white">Required Materials</h3>
                    <p>{classData.materials}</p>
                  </div>
                )}
                {classData.tags && classData.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {classData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}