
import asyncHandler from 'express-async-handler';
import Discussion from '../models/discussionPostModel.js';
import Review from '../models/reviewModel.js';
import User from '../models/usersModel.js';


export const getFlaggedDiscussions = asyncHandler(async (req, res) => {
  const discussions = await Discussion.find({ flagged: true });
  res.json(discussions);
});


export const deleteFlaggedDiscussion = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion) {
    res.status(404);
    throw new Error('Discussion not found');
  }
  await discussion.deleteOne();
  res.json({ message: 'Flagged discussion deleted' });
});


export const getFlaggedReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ flagged: true });
  res.json(reviews);
});


export const deleteFlaggedReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await review.deleteOne();
  res.json({ message: 'Flagged review deleted' });
});


export const verifyMentor = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isVerifiedMentor = true;
  await user.save();
  res.json({ message: 'Mentor verified successfully' });
});
