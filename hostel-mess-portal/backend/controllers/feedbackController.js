const Feedback = require('../models/Feedback');

const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'];

const COMPLAINT_KEYWORDS = [
  'cold', 'oily', 'salty', 'spicy', 'stale', 'undercooked', 'overcooked',
  'burnt', 'burned', 'raw', 'watery', 'bland', 'hard', 'soggy', 'dirty',
  'bitter', 'sour', 'tasteless', 'rubbery', 'greasy', 'frozen', 'uncooked',
];

const STOP_WORDS = new Set([
  'the', 'and', 'was', 'is', 'for', 'with', 'this', 'that', 'but', 'not',
  'are', 'were', 'been', 'have', 'has', 'had', 'they', 'them', 'you', 'your',
  'our', 'out', 'get', 'got', 'very', 'too', 'just', 'also', 'all', 'any',
  'can', 'from', 'into', 'when', 'what', 'while', 'after', 'before', 'food',
  'meal', 'mess', 'today', 'really', 'some', 'than', 'then', 'there', 'here',
]);

const toUTCDate = (input) => {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const extractTags = (comment, rating) => {
  if (rating > 3 || !comment) return [];
  const words = comment.toLowerCase().split(/[^a-z]+/);
  return [...new Set(COMPLAINT_KEYWORDS.filter((k) => words.includes(k)))];
};

exports.submitFeedback = async (req, res) => {
  try {
    const { date, mealType, rating, comment = '' } = req.body;
    const student = req.user.id;

    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }
    if (!MEAL_TYPES.includes(mealType)) {
      return res.status(400).json({ message: 'mealType must be breakfast, lunch, snacks or dinner.' });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    if (typeof comment !== 'string' || comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be a string of at most 500 characters.' });
    }

    const normalizedDate = toUTCDate(date);
    if (!normalizedDate) {
      return res.status(400).json({ message: 'Invalid date. Use YYYY-MM-DD.' });
    }

    const trimmedComment = comment.trim();
    const feedback = await Feedback.findOneAndUpdate(
      { student, date: normalizedDate, mealType },
      {
        $set: {
          rating: numericRating,
          comment: trimmedComment,
          tags: extractTags(trimmedComment, numericRating),
        },
        $setOnInsert: { student, date: normalizedDate, mealType },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.status(201).json({ feedback, message: 'Feedback submitted.' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'You already submitted feedback for this meal today. Update your existing entry instead.',
      });
    }
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0];
      return res.status(400).json({ message: first ? first.message : 'Invalid feedback data.' });
    }
    console.error('submitFeedback error:', err);
    return res.status(500).json({ message: 'Failed to submit feedback.' });
  }
};

exports.getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ student: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json({ feedback });
  } catch (err) {
    console.error('getMyFeedback error:', err);
    return res.status(500).json({ message: 'Failed to load your feedback history.' });
  }
};

exports.extractStopWords = STOP_WORDS;
