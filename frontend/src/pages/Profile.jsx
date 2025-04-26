import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiBook, FiEdit, FiMessageSquare, FiArrowRight } from 'react-icons/fi';
import { useTheme } from '../context/ThemeProvider';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    profilePicture: currentUser?.profilePicture || '',
    bio: currentUser?.bio || ''
  });
  const [loading, setLoading] = useState(false);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [createdClasses, setCreatedClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // Fetch enrolled classes
        const enrolledResponse = await api.get('/classes/enrolled');
        setEnrolledClasses(enrolledResponse.data);

        // Fetch created classes if user is a mentor
        if (currentUser?.role === 'mentor') {
          const createdResponse = await api.get('/classes/created');
          setCreatedClasses(createdResponse.data);
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
      } finally {
        setLoadingClasses(false);
      }
    };

    if (currentUser) {
      fetchClasses();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <p className="text-center text-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-xl shadow-sm p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-start mb-8">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg border flex items-center ${
                isDark 
                  ? 'text-white border-white hover:bg-gray-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              <FiEdit className="mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <img
                src={currentUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>

            {/* Profile Information */}
            <div className="flex-grow">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="profilePicture" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Profile Picture URL
                    </label>
                    <input
                      type="url"
                      id="profilePicture"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark 
                          ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 rounded-lg border min-h-[100px] ${
                        isDark 
                          ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      }`}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-lg text-white font-semibold ${
                      loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Name</h3>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser.name}</p>
                  </div>

                  <div>
                    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</h3>
                    <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser.email}</p>
                  </div>

                  <div>
                    <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role</h3>
                    <p className={`text-lg capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser.role}</p>
                  </div>

                  {currentUser.bio && (
                    <div>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bio</h3>
                      <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{currentUser.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <FiBook className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Classes</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser.role === 'mentor' ? createdClasses.length : enrolledClasses.length}
                </p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'}`}>
                <FiMessageSquare className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Discussions</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Started</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm p-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${isDark ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                <FiUser className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Member Since</p>
                <p className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        {currentUser.role === 'mentor' ? (
          <div className={`rounded-xl shadow-sm p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Created Classes</h2>
            {loadingClasses ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : createdClasses.length > 0 ? (
              <div className="space-y-4">
                {createdClasses.map(classItem => (
                  <Link
                    key={classItem._id}
                    to={`/classes/${classItem._id}`}
                    className={`block p-4 rounded-lg transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{classItem.title}</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{classItem.description}</p>
                      </div>
                      <FiArrowRight className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                You haven't created any classes yet.
              </p>
            )}
          </div>
        ) : (
          <div className={`rounded-xl shadow-sm p-8 mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Enrolled Classes</h2>
            {loadingClasses ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : enrolledClasses.length > 0 ? (
              <div className="space-y-4">
                {enrolledClasses.map(classItem => (
                  <Link
                    key={classItem._id}
                    to={`/classes/${classItem._id}`}
                    className={`block p-4 rounded-lg transition-colors ${
                      isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{classItem.title}</h3>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{classItem.description}</p>
                      </div>
                      <FiArrowRight className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                You haven't enrolled in any classes yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 