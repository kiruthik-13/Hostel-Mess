const Feedback = require('../models/Feedback');

const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'];

const STOP_WORDS = new Set([
  'the', 'and', 'was', 'is', 'for', 'with', 'this', 'that', 'but', 'not',
  'are', 'were', 'been', 'have', 'has', 'had', 'they', 'them', 'you', 'your',
  'our', 'out', 'get', 'got', 'very', 'too', 'just', 'also', 'all', 'any',
  'can', 'from', 'into', 'when', 'what', 'while', 'after', 'before', 'food',
  'meal', 'mess', 'today', 'really', 'some', 'than', 'then', 'there', 'here',
  'wasnt', 'dont', 'didnt', 'because', 'would', 'could', 'like', 'only',
]);

const toUTCDate = (input) => {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const daysAgoUTC = (n) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
};

const buildTrend = async (startDate) => {
  const rows = await Feedback.aggregate([
    { $match: { date: { $gte: startDate } } },
    {
      $group: {
        _id: '$date',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return rows.map((r) => ({
    date: r._id,
    averageRating: Math.round(r.averageRating * 100) / 100,
    count: r.count,
  }));
};

const buildTopComplaints = async (startDate) => {
  const negatives = await Feedback.find({
    rating: { $lte: 2 },
    date: { $gte: startDate },
  })
    .select('comment tags')
    .lean();

  const counts = new Map();

  const bump = (word) => {
    const w = word.toLowerCase();
    if (w.length < 3 || STOP_WORDS.has(w)) return;
    counts.set(w, (counts.get(w) || 0) + 1);
  };

  negatives.forEach((fb) => {
    (fb.comment || '')
      .toLowerCase()
      .split(/[^a-z]+/)
      .forEach(bump);
    (fb.tags || []).forEach(bump);
  });

  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 10);
};

exports.getSummary = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();

    const overallAgg = await Feedback.aggregate([
      { $group: { _id: null, averageRating: { $avg: '$rating' } } },
    ]);
    const overallAverage = overallAgg.length
      ? Math.round(overallAgg[0].averageRating * 100) / 100
      : 0;

    const mealAgg = await Feedback.aggregate([
      {
        $group: {
          _id: '$mealType',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
      { $sort: { averageRating: 1 } },
    ]);

    const mealAverages = mealAgg.map((m) => ({
      mealType: m._id,
      averageRating: Math.round(m.averageRating * 100) / 100,
      count: m.count,
    }));

    const byMealType = Object.fromEntries(
      mealAverages.map((m) => [m.mealType, m.averageRating])
    );

    let worstMeal = null;
    let bestMeal = null;
    if (mealAverages.length) {
      const rated = mealAverages.filter((m) => MEAL_TYPES.includes(m.mealType));
      if (rated.length) {
        worstMeal = { mealType: rated[0].mealType, averageRating: rated[0].averageRating };
        bestMeal = {
          mealType: rated[rated.length - 1].mealType,
          averageRating: rated[rated.length - 1].averageRating,
        };
      }
    }

    const trend7 = await buildTrend(daysAgoUTC(6));
    const trend30 = await buildTrend(daysAgoUTC(29));
    const topComplaints = await buildTopComplaints(daysAgoUTC(29));

    return res.json({
      totalFeedback,
      overallAverage,
      mealAverages,
      byMealType,
      worstMeal,
      bestMeal,
      trend7,
      trend30,
      topComplaints,
    });
  } catch (err) {
    console.error('getSummary error:', err);
    return res.status(500).json({ message: 'Failed to build analytics summary.' });
  }
};

exports.getRawFeedback = async (req, res) => {
  try {
    const { mealType, minRating, maxRating, startDate, endDate } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));

    const filter = {};

    if (mealType) {
      if (!MEAL_TYPES.includes(mealType)) {
        return res.status(400).json({ message: 'Invalid mealType filter.' });
      }
      filter.mealType = mealType;
    }

    if (minRating !== undefined && minRating !== '') {
      const min = Number(minRating);
      if (Number.isNaN(min) || min < 1 || min > 5) {
        return res.status(400).json({ message: 'minRating must be between 1 and 5.' });
      }
      filter.rating = { ...(filter.rating || {}), $gte: min };
    }

    if (maxRating !== undefined && maxRating !== '') {
      const max = Number(maxRating);
      if (Number.isNaN(max) || max < 1 || max > 5) {
        return res.status(400).json({ message: 'maxRating must be between 1 and 5.' });
      }
      filter.rating = { ...(filter.rating || {}), $lte: max };
    }

    if (startDate) {
      const s = toUTCDate(startDate);
      if (!s) return res.status(400).json({ message: 'Invalid startDate. Use YYYY-MM-DD.' });
      filter.date = { ...(filter.date || {}), $gte: s };
    }

    if (endDate) {
      const e = toUTCDate(endDate);
      if (!e) return res.status(400).json({ message: 'Invalid endDate. Use YYYY-MM-DD.' });
      filter.date = { ...(filter.date || {}), $lte: e };
    }

    const total = await Feedback.countDocuments(filter);
    const pages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, pages);

    const data = await Feedback.find(filter)
      .populate('student', 'name email hostelBlock')
      .sort({ date: -1, createdAt: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit);

    return res.json({
      data,
      pagination: {
        total,
        page: safePage,
        pages,
        limit,
      },
    });
  } catch (err) {
    console.error('getRawFeedback error:', err);
    return res.status(500).json({ message: 'Failed to load feedback records.' });
  }
};
