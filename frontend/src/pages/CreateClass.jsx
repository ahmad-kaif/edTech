import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeProvider';
import api from '../utils/axios';
import toast from 'react-hot-toast';

export default function CreateClass() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    contentType: 'live',
    contentUrl: '',
    price: 0,
    isPaid: false,
    schedule: '',
    maxStudents: '',
    prerequisites: '',
    materials: '',
    tags: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert tags string to array if needed
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        mentor: currentUser._id
      };

      const response = await api.post('/classes', submitData);
      toast.success('Class created successfully!');
      navigate(`/classes/${response.data._id}`);
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error(error.response?.data?.message || 'Failed to create class');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser || currentUser.role !== 'mentor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-300">Only mentors can create classes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`card ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Create New Class</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Class Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                required
              />
            </div>

            <div>
              <label htmlFor="description" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`input w-full min-h-[100px] ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                required
              >
                <option value="">Select a category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="business">Business</option>
                <option value="personal development">Personal Development</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="contentType" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Content Type *
              </label>
              <select
                id="contentType"
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                required
              >
                <option value="live">Live Sessions</option>
                <option value="video">Pre-recorded Video</option>
                <option value="uploadable">Uploadable Content</option>
              </select>
            </div>

            {formData.contentType !== 'live' && (
              <div>
                <label htmlFor="contentUrl" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Content URL *
                </label>
                <input
                  type="url"
                  id="contentUrl"
                  name="contentUrl"
                  value={formData.contentUrl}
                  onChange={handleChange}
                  className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                  required
                  placeholder="https://example.com/content"
                />
              </div>
            )}

            <div>
              <label htmlFor="price" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPaid"
                name="isPaid"
                checked={formData.isPaid}
                onChange={handleChange}
                className={`h-4 w-4 text-primary ${isDark ? 'bg-gray-700 border-gray-600' : ''}`}
              />
              <label htmlFor="isPaid" className={`ml-2 block text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                This is a paid class
              </label>
            </div>

            <div>
              <label htmlFor="schedule" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Schedule
              </label>
              <input
                type="text"
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                placeholder="e.g., Every Monday and Wednesday, 6-8 PM"
              />
            </div>

            <div>
              <label htmlFor="maxStudents" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Maximum Students
              </label>
              <input
                type="number"
                id="maxStudents"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                min="1"
              />
            </div>

            <div>
              <label htmlFor="prerequisites" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Prerequisites
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                className={`input w-full min-h-[100px] ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                placeholder="List any prerequisites or recommended knowledge"
              />
            </div>

            <div>
              <label htmlFor="materials" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Required Materials
              </label>
              <textarea
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                className={`input w-full min-h-[100px] ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                placeholder="List any required materials or resources"
              />
            </div>

            <div>
              <label htmlFor="tags" className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className={`input w-full ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/classes')}
                className={`btn btn-outline ${isDark ? 'text-white border-white hover:bg-gray-700' : ''}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${isDark ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              >
                {loading ? 'Creating...' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 