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
  FiVideo
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [discussions, setDiscussions] = useState([]);
  const [discussionInput, setDiscussionInput] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [rating, setRating] = useState(0);
  const [submittedRating, setSubmittedRating] = useState(false);

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
        } catch {
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
    if (!window.confirm("Are you sure you want to unenroll from this class?")) return;
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
    if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Class deleted successfully");
      navigate("/classes");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete class");
    }
  };

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;

    try {
      const newDiscussion = {
        classId: id,
        userId: currentUser._id,
        comment: discussionInput,
      };
      const res = await api.post("/discussions", newDiscussion);
      setDiscussions([...discussions, res.data]);
      setDiscussionInput("");
      toast.success("Comment posted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to post discussion comment"
      );
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h2 className="text-2xl font-bold text-white">Class not found</h2>
        <Link to="/classes" className="text-blue-400 ml-4">Return to Classes</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 relative">
      {/* Class Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="rounded-xl p-8 mb-8 bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                {classData.title}
              </h1>
              <p className="text-lg text-gray-300 mb-6">{classData.description}</p>
              <div className="flex items-center space-x-6 text-gray-300">
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 mr-2" />
                  <span>{classData.enrolledStudents?.length || 0} Students</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-5 w-5 mr-2" />
                  <span>{classData.schedule || "Schedule TBD"}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col space-y-4">
              {!isEnrolled && currentUser && (
                <button
                  onClick={handleEnroll}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium flex items-center"
                >
                  <FiUsers className="mr-2" />
                  Enroll Now
                </button>
              )}

              {/* Student: Enrolled */}
              {isEnrolled && !isMentor && (
                <>
                  <button
                    onClick={() => window.open("http://localhost:3001", "_blank")}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium flex items-center"
                  >
                    <FiVideo className="mr-2" />
                    Join Live Session
                  </button>
                  <button
                    onClick={handleUnenroll}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium flex items-center"
                  >
                    <FiLogOut className="mr-2" />
                    Unenroll
                  </button>
                </>
              )}

              {/* Mentor */}
              {isMentor && (
                <button
                  onClick={() => window.open("http://localhost:3001", "_blank")}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium flex items-center"
                >
                  <FiClock className="mr-2" />
                  Start Live Session
                </button>
              )}

              {(isMentor || currentUser?.role === "admin") && (
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete Class
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Discussions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-8"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiMessageSquare className="mr-3" /> Class Discussions
            </h2>

            {discussions.length > 0 ? (
              discussions.map((discussion) => (
                <div key={discussion._id} className="mb-6 border-b border-gray-800 pb-4">
                  <div className="flex items-center mb-2 text-sm text-gray-400">
                    {discussion.userId?.name || "Unknown User"}
                  </div>
                  <p className="text-gray-300">{discussion.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No discussions yet. Be the first to comment!</p>
            )}

            <form onSubmit={handleDiscussionSubmit} className="mt-6 flex">
              <input
                type="text"
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-3 rounded-l-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-r-lg text-white font-medium"
              >
                Post
              </button>
            </form>
          </div>

          {/* Rating */}
          {!isMentor && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FiStar className="mr-3" /> Rate this Class
              </h2>

              {!submittedRating ? (
                <>
                  <div className="flex items-center mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        type="button"
                        className={`text-3xl ${
                          rating >= star ? "text-yellow-400" : "text-gray-400"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleRatingSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg text-white font-medium"
                  >
                    Submit Rating
                  </button>
                </>
              ) : (
                <p className="text-green-400">Thank you for your feedback!</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
