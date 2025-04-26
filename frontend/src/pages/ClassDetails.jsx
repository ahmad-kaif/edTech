import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { FiUsers, FiCalendar, FiClock, FiBook, FiMessageSquare, FiStar, FiTrash2, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';
import toast from 'react-hot-toast';

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Class not found</h2>
          <Link to="/classes" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to Classes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Class Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl shadow-sm p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{classData.title}</h1>
              <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{classData.description}</p>
              <div className={`flex items-center space-x-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <FiUsers className="mr-2" />
                  Enroll Now
                </button>
              )}
              {isEnrolled && !isMentor && (
                <button
                  onClick={handleUnenroll}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  Unenroll
                </button>
              )}
              {(isMentor || currentUser?.role === 'admin') && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center"
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
              transition={{ delay: 0.2 }}
              className={`rounded-xl shadow-sm p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Course Content</h2>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start space-x-4">
                    <FiBook className={`h-5 w-5 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Content Type</h3>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {classData.contentType === 'live' ? 'Live Sessions' : 
                         classData.contentType === 'video' ? 'Pre-recorded Video' : 
                         'Uploadable Content'}
                      </p>
                      {classData.contentUrl && (
                        <a 
                          href={classData.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mt-2 inline-block"
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
              transition={{ delay: 0.3 }}
              className={`rounded-xl shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Discussions</h2>
                {isEnrolled && (
                  <Link
                    to={`/discussions/create?classId=${id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                    className={`block p-4 rounded-lg transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{discussion.title}</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{discussion.content}</p>
                      </div>
                      <div className={`flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <FiMessageSquare className="h-4 w-4 mr-1" />
                        <span>{discussion.replies?.length || 0} replies</span>
                      </div>
                    </div>
                    <div className={`mt-4 flex items-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
              transition={{ delay: 0.4 }}
              className={`rounded-xl shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Mentor</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={classData.mentor.profilePicture || 'https://via.placeholder.com/50'}
                  alt={classData.mentor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{classData.mentor.name}</h3>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{classData.mentor.bio || 'No bio available'}</p>
                </div>
              </div>
            </motion.div>

            {/* Class Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`rounded-xl shadow-sm p-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Class Info</h2>
              <div className={`space-y-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="capitalize">{classData.category}</p>
                </div>
                {classData.prerequisites && (
                  <div>
                    <h3 className="font-semibold">Prerequisites</h3>
                    <p>{classData.prerequisites}</p>
                  </div>
                )}
                {classData.materials && (
                  <div>
                    <h3 className="font-semibold">Required Materials</h3>
                    <p>{classData.materials}</p>
                  </div>
                )}
                {classData.tags && classData.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {classData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
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