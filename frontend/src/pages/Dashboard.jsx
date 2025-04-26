import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { FiBook, FiUsers, FiMessageSquare, FiPlus, FiCalendar, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({
    enrolledClasses: 0,
    createdClasses: 0,
    discussions: 0,
    upcomingClasses: 0,
    completedClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [classesRes, discussionsRes] = await Promise.all([
          api.get('/classes'),
          api.get('/discussions')
        ]);

        const classes = classesRes.data.classes || [];
        const discussions = discussionsRes.data || [];

        const enrolledClasses = classes.filter(c => c.enrolledStudents?.includes(currentUser._id));
        const createdClasses = classes.filter(c => c.mentor._id === currentUser._id);
        const userDiscussions = discussions.filter(d => d.author._id === currentUser._id);

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
  }, [currentUser._id]);

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back {currentUser.role === 'mentor' ? 'mentor' : 'learner'}, {currentUser.name}!
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Here's what's happening with your learning journey
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <FiBook className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Enrolled Classes</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.enrolledClasses}</p>
              </div>
            </div>
          </motion.div>

          {currentUser.role === 'mentor' && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                  <FiUsers className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Created Classes</p>
                  <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.createdClasses}</p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <FiMessageSquare className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Discussions</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.discussions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                <FiAward className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Completed Classes</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.completedClasses}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
            <div className="space-y-4">
              <Link
                to="/classes"
                className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} transition-colors`}
              >
                <FiBook className="h-5 w-5 mr-3" />
                Browse Classes
              </Link>
              <Link
                to="/discussions"
                className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'} transition-colors`}
              >
                <FiMessageSquare className="h-5 w-5 mr-3" />
                View Discussions
              </Link>
              {currentUser.role === 'mentor' && (
                <Link
                  to="/classes/create"
                  className={`flex items-center p-3 rounded-lg ${isDark ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' : 'bg-green-50 text-green-600 hover:bg-green-100'} transition-colors`}
                >
                  <FiPlus className="h-5 w-5 mr-3" />
                  Create New Class
                </Link>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'enrollment' 
                      ? isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                      : isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'enrollment' ? <FiBook className="h-4 w-4" /> : <FiMessageSquare className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {activity.type === 'enrollment' 
                        ? `Enrolled in ${activity.data.title}`
                        : `Posted in ${activity.data.title}`
                      }
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 