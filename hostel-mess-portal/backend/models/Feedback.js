const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: false }
);

feedbackSchema.index({ student: 1, date: 1, mealType: 1 }, { unique: true });
feedbackSchema.index({ date: -1 });
feedbackSchema.index({ rating: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
