const Menu = require('../models/Menu');

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const toUTCDate = (input) => {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const normalizeToMondayUTC = (input) => {
  const utc = toUTCDate(input);
  if (!utc) return null;
  const weekday = utc.getUTCDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  utc.setUTCDate(utc.getUTCDate() + diff);
  return utc;
};

const buildDays = (monday, incomingDays) => {
  const days = [];
  for (let i = 0; i < 7; i += 1) {
    const date = new Date(monday);
    date.setUTCDate(date.getUTCDate() + i);
    const src = Array.isArray(incomingDays) ? incomingDays[i] : undefined;
    const meals = (src && src.meals) || {};
    days.push({
      date,
      dayName: DAY_NAMES[i],
      meals: {
        breakfast: typeof meals.breakfast === 'string' ? meals.breakfast.trim() : '',
        lunch: typeof meals.lunch === 'string' ? meals.lunch.trim() : '',
        snacks: typeof meals.snacks === 'string' ? meals.snacks.trim() : '',
        dinner: typeof meals.dinner === 'string' ? meals.dinner.trim() : '',
      },
    });
  }
  return days;
};

exports.getCurrentMenu = async (req, res) => {
  try {
    const now = new Date();
    const thisMonday = normalizeToMondayUTC(now);

    let menu = await Menu.findOne({ weekStartDate: thisMonday }).populate('updatedBy', 'name email');

    if (!menu) {
      menu = await Menu.findOne({ weekStartDate: { $lte: now } })
        .sort({ weekStartDate: -1 })
        .populate('updatedBy', 'name email');
    }

    if (!menu) {
      menu = await Menu.findOne({}).sort({ weekStartDate: -1 }).populate('updatedBy', 'name email');
    }

    if (!menu) {
      return res.status(404).json({ message: 'No menu has been published yet.' });
    }

    return res.json({ menu });
  } catch (err) {
    console.error('getCurrentMenu error:', err);
    return res.status(500).json({ message: 'Failed to load the current menu.' });
  }
};

exports.getMenuByDate = async (req, res) => {
  try {
    const { weekStartDate } = req.query;
    if (!weekStartDate) {
      return res.status(400).json({ message: 'weekStartDate query parameter is required.' });
    }

    const monday = normalizeToMondayUTC(weekStartDate);
    if (!monday) {
      return res.status(400).json({ message: 'Invalid weekStartDate. Use YYYY-MM-DD.' });
    }

    const menu = await Menu.findOne({ weekStartDate: monday }).populate('updatedBy', 'name email');
    return res.json({ menu: menu || null });
  } catch (err) {
    console.error('getMenuByDate error:', err);
    return res.status(500).json({ message: 'Failed to load menu.' });
  }
};

exports.upsertMenu = async (req, res) => {
  try {
    const { weekStartDate, days } = req.body;

    if (!weekStartDate) {
      return res.status(400).json({ message: 'weekStartDate is required.' });
    }

    const monday = normalizeToMondayUTC(weekStartDate);
    if (!monday) {
      return res.status(400).json({ message: 'Invalid weekStartDate. Use YYYY-MM-DD.' });
    }

    const builtDays = buildDays(monday, days);

    const menu = await Menu.findOneAndUpdate(
      { weekStartDate: monday },
      {
        $set: {
          days: builtDays,
          updatedBy: req.user.id,
        },
      },
      { upsert: true, new: true, runValidators: true }
    ).populate('updatedBy', 'name email');

    return res.json({ menu, message: 'Weekly menu saved and published.' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0];
      return res.status(400).json({ message: first ? first.message : 'Invalid menu data.' });
    }
    console.error('upsertMenu error:', err);
    return res.status(500).json({ message: 'Failed to save the menu.' });
  }
};
