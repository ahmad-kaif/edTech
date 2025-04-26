import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  
  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
    enum: ['programming', 'design', 'marketing', 'business', 'personal development', 'other'], // you can expand as needed
  },

  contentType: {
    type: String,
    required: true,
    enum: ['live', 'video', 'uploadable'], // Live sessions, pre-recorded videos, or uploadable content
  },

  contentUrl: {
    type: String,
    required: function () {
      return this.contentType !== 'live'; // Only required for video/uploadable content
    },
  },

  price: {
    type: Number,
    default: 0, // Free by default
  },

  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  isPaid: {
    type: Boolean,
    default: false, // If the class is paid
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  tags: {
    type: [String], // Keywords for searching classes
    default: [],
  },

  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ],

}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

export default Class;
