import asyncHandler from 'express-async-handler';
import DiscussionPost from '../models/discussionPostModel.js';
import Class from '../models/classModel.js';


export const createDiscussionPost = asyncHandler(async (req, res) => {
  const { title, content, classId } = req.body;


  if (!title || !content || !classId) {
    res.status(400);
    throw new Error('Please provide title, content, and classId');
  }

  const existingClass = await Class.findById(classId);
  if (!existingClass) {
    res.status(404);
    throw new Error('Class not found');
  }

  // Check if user is enrolled in the class
  const isEnrolled = existingClass.enrolledStudents.includes(req.user._id);
  const isMentor = existingClass.mentor.toString() === req.user._id.toString();

  if (!isEnrolled && !isMentor) {
    res.status(403);
    throw new Error('You must be enrolled in the class to participate in discussions');
  }

  const post = await DiscussionPost.create({
    title,
    content,
    author: req.user._id,
    classId,
  });

  res.status(201).json(post);
});

// @desc    Get all discussion posts (optionally by class)
// @route   GET /api/discussions?classId=xxx
// @access  Public
export const getDiscussionPosts = asyncHandler(async (req, res) => {
  const { classId } = req.query;

  let filter = {};
  if (classId) {
    filter = { classId };
  }

  const posts = await DiscussionPost.find(filter)
    .populate('author', 'name profilePicture') // get author name and profile picture
    .populate('classId', 'title') // get class title
    .sort({ createdAt: -1 });

  res.json(posts);
});

// @desc    Get a single discussion post by ID
// @route   GET /api/discussions/:id
// @access  Public
export const getDiscussionPostById = asyncHandler(async (req, res) => {
  const post = await DiscussionPost.findById(req.params.id)
    .populate('author', 'name profilePicture')
    .populate('classId', 'title')
    .populate('replies.author', 'name profilePicture');

  if (!post) {
    res.status(404);
    throw new Error('Discussion post not found');
  }

  res.json(post);
});

// @desc    Add a reply to a discussion post
// @route   POST /api/discussions/:id/replies
// @access  Private
export const addReplyToPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  if (!content) {
    res.status(400);
    throw new Error('Please provide content for the reply');
  }

  const post = await DiscussionPost.findById(postId).populate('classId');
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  // Check if user is enrolled in the class
  const isEnrolled = post.classId.enrolledStudents.includes(req.user._id);
  const isMentor = post.classId.mentor.toString() === req.user._id.toString();

  if (!isEnrolled && !isMentor) {
    res.status(403);
    throw new Error('You must be enrolled in the class to participate in discussions');
  }

  post.replies.push({
    content,
    author: req.user._id,
  });

  await post.save();

  // Return the updated post with populated fields
  const updatedPost = await DiscussionPost.findById(postId)
    .populate('author', 'name profilePicture')
    .populate('classId', 'title')
    .populate('replies.author', 'name profilePicture');

  res.status(201).json(updatedPost);
});
