import React, { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import api from '../../utils/axios'; // Assuming you have an API utility to fetch data
// import { toast } from 'react-toastify'; // Optional: to display success/error messages

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]); // Default to an empty array
  const [learners, setLearners] = useState([]); // Default to an empty array
  const [classes, setClasses] = useState([]); // Default to an empty array
  const [discussions, setDiscussions] = useState([]); // Default to an empty array
  const [selectedTab, setSelectedTab] = useState('classes'); // Default to 'classes'

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mentorsRes, learnersRes, classesRes, discussionsRes] = await Promise.all([
          api.get('/users/mentors'),
          api.get('/users/learners'),
          api.get('/classes'),
          api.get('/discussions'),
        ]);

        setMentors(mentorsRes.data || []); // Set to an empty array if data is undefined
        setLearners(learnersRes.data || []); // Set to an empty array if data is undefined
        setClasses(classesRes.data?.classes || []); // Set to an empty array if classes are undefined
        setDiscussions(discussionsRes.data || []); // Set to an empty array if data is undefined
      } catch (error) {
        // toast.error('Failed to fetch data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle delete operation
  const handleDelete = async (type, id) => {
    try {
      // Make API call to delete based on type
      const response = await api.delete(`users/${type}/${id}`);
      
      // After successful delete, filter out the deleted item from the state
      if (response.status === 200) {
        if (type === 'mentor') {
          setMentors(mentors.filter(mentor => mentor._id !== id));
        } else if (type === 'learner') {
          setLearners(learners.filter(learner => learner._id !== id));
        } else if (type === 'class') {
          setClasses(classes.filter(classItem => classItem._id !== id));
        } else if (type === 'discussion') {
          setDiscussions(discussions.filter(discussion => discussion._id !== id));
        }

        // Optionally, show a success notification
        // toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting:', error);
      // Optionally, show an error notification
      // toast.error(`Failed to delete ${type}`);
    }
  };

  // Verify or unverify mentor
  const handleVerify = async (mentorId, currentStatus) => {
    try {
      const response = currentStatus 
        ? await api.put(`/admin/unverify-mentor/${mentorId}`)
        : await api.put(`/admin/verify-mentor/${mentorId}`);

      if (response.status === 200) {
        // Update the mentor verification status in the state
        setMentors(mentors.map(mentor => 
          mentor._id === mentorId ? { ...mentor, verified: !currentStatus } : mentor
        ));

        // Optionally, show a success notification
        // toast.success(currentStatus ? 'Mentor unverified successfully' : 'Mentor verified successfully');
      }
    } catch (error) {
      console.error('Error updating mentor status:', error);
      // Optionally, show an error notification
      // toast.error('Failed to update mentor status');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Tab navigation */}
      <div className="tabs">
        <button
          className={`tab ${selectedTab === 'mentors' ? 'active' : ''}`}
          onClick={() => setSelectedTab('mentors')}
        >
          Mentors
        </button>
        <button
          className={`tab ${selectedTab === 'learners' ? 'active' : ''}`}
          onClick={() => setSelectedTab('learners')}
        >
          Learners
        </button>
        <button
          className={`tab ${selectedTab === 'classes' ? 'active' : ''}`}
          onClick={() => setSelectedTab('classes')}
        >
          Classes
        </button>
        <button
          className={`tab ${selectedTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setSelectedTab('discussions')}
        >
          Discussions
        </button>
      </div>

      {/* Loading spinner */}
      {loading && <div className="loading">Loading...</div>}

      {/* Render Mentors Tab */}
      {selectedTab === 'mentors' && !loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mentors.length > 0 ? (
                mentors.map((mentor) => (
                  <tr key={mentor._id} className="hover:bg-dark-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{mentor.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {mentor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {mentor.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {mentor.verified ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleVerify(mentor._id, mentor.verified)}
                        className={`text-${mentor.verified ? 'red' : 'green'}-600 hover:text-${mentor.verified ? 'red' : 'green'}-900`}
                      >
                        {mentor.verified ? 'Unverify' : 'Verify'}
                      </button>
                      <button
                        onClick={() => handleDelete('mentor', mentor._id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No Mentors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Render Learners Tab */}
      {selectedTab === 'learners' && !loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-light uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-light uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {learners.length > 0 ? (
                learners.map((learner) => (
                  <tr key={learner._id} className="hover:bg-dark-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{learner.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {learner.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {learner.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete('learner', learner._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No Learners found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Other Tabs (Classes, Discussions) */}
      {/* Render the Classes and Discussions similar to Mentors and Learners */}
    </div>
  );
};

export default AdminDashboard;
