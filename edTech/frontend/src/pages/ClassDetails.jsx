import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiClock,
  FiBook,
  FiMessageSquare,
  FiStar,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";
import toast from "react-hot-toast";
import LiveKitVideo from '../components/LiveKitVideo';

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discussions, setDiscussions] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);
  const [isLiveSessionActive, setIsLiveSessionActive] = useState(false);

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classRes = await api.get(`/classes/${id}`);
        if (!classRes.data) throw new Error("No class data received");

        setClassData(classRes.data);
        setIsEnrolled(
          classRes.data.enrolledStudents?.includes(currentUser?._id)
        );
        setIsMentor(classRes.data.mentor._id === currentUser?._id);

        try {
          const discussionsRes = await api.get(`/discussions?classId=${id}`);
          setDiscussions(discussionsRes.data || []);
        } catch (discussionError) {
          setDiscussions([]);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to load class details"
        );
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

  const startDiscussion = async () => {
    try {
      // Call the backend API to create a discussion or perform the desired action
      const response = await api.post(`/discussions/start`, { classId: id });
      setDiscussions([...discussions, response.data]); // Add the new discussion to the state
      toast.success("Discussion started successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to start discussion"
      );
    }
  };

  const handleEnroll = async () => {
    try {
      await api.post(`/classes/${id}/enroll`);
      setIsEnrolled(true);
      toast.success("Successfully enrolled in the class!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to enroll in the class"
      );
    }
  };

  const handleUnenroll = async () => {
    if (!window.confirm("Are you sure you want to unenroll from this class?"))
      return;

    try {
      await api.post(`/classes/${id}/unenroll`);
      setIsEnrolled(false);
      toast.success("Successfully unenrolled from the class");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to unenroll from the class"
      );
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this class? This action cannot be undone."
      )
    )
      return;

    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted successfully");
      navigate("/classes");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete class");
    }
  };

  const handleRatingSubmit = async () => {
    if (!rating) {
      toast.error("Please select a rating before submitting!");
      return;
    }
    try {
      await api.post(`/classes/${id}/rate`, { rating });
      setSubmittedRating(true);
      toast.success("Thank you for your rating!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit rating");
    }
  };

  const startLiveSession = async () => {
    try {
      // Create LiveKit room
      await api.post('/livekit/create-room', { roomName: id });
      
      // Start live session
      await api.post(`/classes/${id}/start-live-session`);
      setIsLiveSessionActive(true);
      toast.success("Live session has started!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to start the live session"
      );
    }
  };

  const endLiveSession = async () => {
    try {
      // Delete LiveKit room
      await api.delete(`/livekit/delete-room/${id}`);
      
      // End live session
      await api.post(`/classes/${id}/end-live-session`);
      setIsLiveSessionActive(false);
      toast.success("Live session has ended!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to end the live session"
      );
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
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Class not found
          </h2>
          <Link
            to="/classes"
            className="text-blue-400 hover:text-blue-300 mt-4 inline-block font-medium tracking-wide"
          >
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Live Session View */}
        {isLiveSessionActive ? (
          <div className="fixed inset-0 z-50 bg-black">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={endLiveSession}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium tracking-wide shadow-lg shadow-red-500/30 transition-all flex items-center"
              >
                <FiLogOut className="mr-2" />
                End Session
              </button>
            </div>
            <LiveKitVideo
              roomName={id}
              participantName={currentUser?.name}
              isMentor={isMentor}
            />
          </div>
        ) : (
          <>
            {/* Class Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="rounded-xl p-8 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 tracking-wide">
                    {classData.title}
                  </h1>
                  <p className="text-lg text-gray-300 mb-6">
                    {classData.description}
                  </p>
                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center">
                      <FiUsers className="h-5 w-5 mr-2" />
                      <span>
                        {classData.enrolledStudents?.length || 0} Students
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="h-5 w-5 mr-2" />
                      <span>{classData.schedule || "Schedule TBD"}</span>
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
                      Enroll Nowc
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
                  {isMentor && (
                    <button
                      // onClick={startLiveSession}
                      onClick={() => {window.open(`http://localhost:3001`)}}

                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium tracking-wide shadow-lg shadow-green-500/30 transition-all flex items-center"
                    >
                      <FiClock className="mr-2" />
                      Start Live Session
                    </button>
                  )}
                  {(isMentor || currentUser?.role === "admin") && (
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
              <div className="lg:col-span-2 space-y-8">
                {/* Course Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
                    Course Content
                  </h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/10">
                      <div className="flex items-start space-x-4">
                        <FiBook className="h-5 w-5 mt-1 text-blue-400" />
                        <div>
                          <h3 className="font-semibold text-white">Content Type</h3>
                          <p className="text-gray-300">
                            {classData.contentType === "live"
                              ? "Live Sessions"
                              : "Pre-recorded Videos"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Rating Section */}
                {isEnrolled && !submittedRating && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1 }}
                    className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
                  >
                    <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
                      Rate the Course
                    </h2>
                    <div className="flex space-x-4 items-center">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setRating(value)}
                          className={`text-${
                            value <= rating ? "yellow" : "gray"
                          }-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRatingSubmit}
                      className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium tracking-wide shadow-lg shadow-blue-500/30 transition-all"
                    >
                      Submit Rating
                    </button>
                  </motion.div>
                )}

                {/* Discussions */}
                {/* Discussions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
                    Class Discussions
                  </h2>

                  {/* Check if the user is enrolled before showing the start discussion button */}
                  {isEnrolled && (
                    <button
                      onClick={() => startDiscussion()}
                      className="mb-6 px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium tracking-wide shadow-lg shadow-green-500/30 transition-all"
                    >
                      Start Discussion
                    </button>
                  )}

                  {discussions.length === 0 ? (
                    <p className="text-white">
                      No discussions yet. Be the first to start one!
                    </p>
                  ) : (
                    <ul className="space-y-4">
                      {discussions.map((discussion) => (
                        <li key={discussion._id} className="text-white">
                          <strong>{discussion.title}</strong>: {discussion.content}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </div>

              {/* Mentor's Info */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="rounded-xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg shadow-blue-500/20"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
                    Mentor Information
                  </h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={classData.mentor.avatar}
                      alt={classData.mentor.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-white">
                        {classData.mentor.name}
                      </h3>
                      <p className="text-gray-300">{classData.mentor.bio}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
