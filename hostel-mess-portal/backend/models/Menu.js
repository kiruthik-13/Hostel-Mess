const mongoose = require('mongoose');

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const mealSlotSchema = new mongoose.Schema(
  {
    breakfast: { type: String, default: '' },
    lunch: { type: String, default: '' },
    snacks: { type: String, default: '' },
    dinner: { type: String, default: '' },
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    dayName: { type: String, required: true, enum: DAY_NAMES },
    meals: { type: mealSlotSchema, default: () => ({}) },
  },
  { _id: false }
);

const menuSchema = new mongoose.Schema(
  {
    weekStartDate: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    days: {
      type: [daySchema],
      validate: [(v) => v.length === 0 || v.length === 7, 'A menu must contain exactly 7 days'],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

menuSchema.pre('validate', function (next) {
  if (this.weekStartDate) {
    const d = new Date(this.weekStartDate);
    const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    const weekday = utc.getUTCDay();
    const diff = weekday === 0 ? -6 : 1 - weekday;
    utc.setUTCDate(utc.getUTCDate() + diff);
    this.weekStartDate = utc;
  }
  next();
});

module.exports = mongoose.model('Menu', menuSchema);
