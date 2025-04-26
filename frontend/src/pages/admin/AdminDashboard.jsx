import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiUsers, FiBook, FiMessageSquare, FiTrash2, FiEdit } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classesRes, discussionsRes] = await Promise.all([
          axios.get('http://localhost:8081/api/users'),
          axios.get('http://localhost:8081/api/classes'),
          axios.get('http://localhost:8081/api/discussions')
        ]);

        setUsers(usersRes.data);
        setClasses(classesRes.data);
        setDiscussions(discussionsRes.data);
      } catch (error) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/classes/${classId}`);
      setClasses(classes.filter(c => c._id !== classId));
      toast.success('Class deleted successfully');
    } catch (error) {
      toast.error('Failed to delete class');
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    if (!window.confirm('Are you sure you want to delete this discussion?')) return;

    try {
      await axios.delete(`http://localhost:8081/api/discussions/${discussionId}`);
      setDiscussions(discussions.filter(d => d._id !== discussionId));
      toast.success('Discussion deleted successfully');
    } catch (error) {
      toast.error('Failed to delete discussion');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <FiUsers className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground-light">Total Users</p>
                <p className="text-2xl font-semibold text-foreground">{users.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary/10 text-secondary">
                <FiBook className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground-light">Total Classes</p>
                <p className="text-2xl font-semibold text-foreground">{classes.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-accent/10 text-accent">
                <FiMessageSquare className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground-light">Total Discussions</p>
                <p className="text-2xl font-semibold text-foreground">{discussions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-border">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('users')}
                className={`${
                  selectedTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground-light hover:text-foreground hover:border-foreground-light'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Users
              </button>
              <button
                onClick={() => setSelectedTab('classes')}
                className={`${
                  selectedTab === 'classes'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground-light hover:text-foreground hover:border-foreground-light'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Classes
              </button>
              <button
                onClick={() => setSelectedTab('discussions')}
                className={`${
                  selectedTab === 'discussions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground-light hover:text-foreground hover:border-foreground-light'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Discussions
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="card">
          {selectedTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.profilePicture || 'https://via.placeholder.com/40'}
                            alt=""
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-foreground-light">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-light">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTab === 'classes' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {classes.map(classItem => (
                    <tr key={classItem._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{classItem.title}</div>
                        <div className="text-sm text-foreground-light">{classItem.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{classItem.mentor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground-light">
                        {classItem.enrolledStudents.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteClass(classItem._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedTab === 'discussions' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Discussion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-foreground-light uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discussions.map(discussion => (
                    <tr key={discussion._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-foreground">{discussion.title}</div>
                        <div className="text-sm text-foreground-light">{discussion.content}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{discussion.author.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{discussion.class.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteDiscussion(discussion._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 