import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { FiSearch, FiFilter, FiBook, FiUsers, FiClock } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';
import toast from 'react-hot-toast';

export default function Classes() {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, enrolled, created

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data.classes || []);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'enrolled') return matchesSearch && cls.enrolledStudents?.includes(currentUser._id);
    if (filter === 'created') return matchesSearch && cls.mentor._id === currentUser._id;
    
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Classes</h1>
          {currentUser?.role === 'mentor' && (
            <Link
              to="/classes/create"
              className="btn btn-primary flex items-center"
            >
              <FiBook className="mr-2" />
              Create Class
            </Link>
          )}
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <option value="all">All Classes</option>
              <option value="enrolled">Enrolled Classes</option>
              {currentUser?.role === 'mentor' && (
                <option value="created">Created Classes</option>
              )}
            </select>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(cls => (
            <Link
              key={cls._id}
              to={`/classes/${cls._id}`}
              className="card hover:shadow-lg transition-shadow dark:bg-gray-800 dark:text-white dark:border-gray-700"
            >
              <h3 className="text-xl font-semibold mb-2">{cls.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{cls.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  <span>{cls.enrolledStudents?.length || 0} students</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{new Date(cls.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredClasses.length === 0 && (
          <div className="text-center py-12">
            <FiBook className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No classes found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm ? 'Try adjusting your search' : 'Be the first to create a class!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 