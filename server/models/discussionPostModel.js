import mongoose, { Schema, model, Types } from 'mongoose';

const discussionPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classId: {
      type: Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    replies: [
      {
        content: {
          type: String,
          required: true,
        },
        author: {
          type: Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const DiscussionPost = model('DiscussionPost', discussionPostSchema);

export default DiscussionPost;
