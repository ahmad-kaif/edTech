import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { FiBook, FiUsers, FiMessageSquare, FiPlus, FiCalendar, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function FuturisticDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    enrolledClasses: 0,
    createdClasses: 0,
    discussions: 0,
    upcomingClasses: 0,
    completedClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(currentUser?.isVerified || false);

  useEffect(() => {
    if (!currentUser) {
      toast.error('User not authenticated');
      setLoading(false);
      return;
    }
  
    const fetchDashboardData = async () => {
      try {
        const [classesRes, discussionsRes] = await Promise.all([
          api.get('/classes'),
          api.get('/discussions')
        ]);
  
        const classes = classesRes.data.classes || [];
        const discussions = discussionsRes.data || [];
  
        const enrolledClasses = classes.filter(c => c.enrolledStudents?.includes(currentUser?._id));
        const createdClasses = classes.filter(c => c.mentor?._id === currentUser?._id);
        const userDiscussions = discussions.filter(d => d.author?._id === currentUser?._id);
  
        // Combine and sort recent activity
        const activity = [
          ...enrolledClasses.map(c => ({ type: 'enrollment', data: c, date: c.createdAt })),
          ...userDiscussions.map(d => ({ type: 'discussion', data: d, date: d.createdAt }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  
        setStats({
          enrolledClasses: enrolledClasses.length,
          createdClasses: createdClasses.length,
          discussions: userDiscussions.length,
          upcomingClasses: enrolledClasses.filter(c => new Date(c.startDate) > new Date()).length,
          completedClasses: enrolledClasses.filter(c => c.status === 'completed').length
        });
        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, [currentUser]);

  const handleVerificationRequest = async () => {
    try {
      
      const response = await api.put(`/admin/verify-mentor/${currentUser._id}`);
      if (response.status === 200) {
        toast.success('Verification request sent to the admin!');
        setVerificationStatus('pending');
        setIsModalOpen(false); // Close the modal after submitting
      }
    } catch (error) {
      toast.error('Failed to send verification request');
    }
  };

  const openVerificationModal = () => {
    setIsModalOpen(true);
  };

  const closeVerificationModal = () => {
    setIsModalOpen(false);
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

  return (
    <div className="min-h-screen bg-black text-white py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 to-transparent"></div>
      <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl animate-float"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-3xl animate-float-slow"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome back {currentUser.role === 'mentor' ? 'Mentor' : 'Learner'}, {currentUser.name}!
          </h1>
          <p className="mt-2 text-lg text-gray-300 tracking-wide">
            Here's what's happening with your learning journey
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
                <FiBook className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300 tracking-wide">Enrolled Classes</p>
                <p className="text-2xl font-semibold text-white">{stats.enrolledClasses}</p>
              </div>
            </div>
          </motion.div>

          {currentUser.role === 'mentor' && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
            >
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-green-500 to-teal-500">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300 tracking-wide">Created Classes</p>
                  <p className="text-2xl font-semibold text-white">{stats.createdClasses}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <FiMessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300 tracking-wide">Discussions</p>
                <p className="text-2xl font-semibold text-white">{stats.discussions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                <FiAward className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300 tracking-wide">Completed Classes</p>
                <p className="text-2xl font-semibold text-white">{stats.completedClasses}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/classes"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-md"
              >
                <FiBook className="h-5 w-5 mr-3" />
                Browse Classes
              </Link>
              <Link
                to="/discussions"
                className="flex items-center p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all shadow-md"
              >
                <FiMessageSquare className="h-5 w-5 mr-3" />
                View Discussions
              </Link>
              {currentUser.role === 'mentor' && (
                <Link
                  to="/classes/create"
                  className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white transition-all shadow-md"
                >
                  <FiPlus className="h-5 w-5 mr-3" />
                  Create New Class
                </Link>
              )}
              {/* Verification Request Button */}
              {currentUser.role === 'mentor' && !verificationStatus && (
                <button
                  onClick={openVerificationModal}
                  className="flex items-center p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white transition-all shadow-md"
                >
                  <FiAward className="h-5 w-5 mr-3" />
                  Request Verification
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4 tracking-wide">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${
                    activity.type === 'enrollment' 
                      ? 'from-blue-500 to-purple-500' 
                      : 'from-purple-500 to-pink-500'
                  }`}>
                    <FiCalendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">{activity.type === 'enrollment' ? 'Enrolled in' : 'Participated in'} a class</p>
                    <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeVerificationModal}
          >
            <div
              className="bg-white p-6 rounded-lg shadow-lg w-1/3"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">Verification Request</h2>
              <p className="text-lg mb-4">Are you sure you want to request verification?</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleVerificationRequest}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Yes
                </button>
                <button
                  onClick={closeVerificationModal}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
