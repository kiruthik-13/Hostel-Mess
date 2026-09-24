require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Menu = require('../models/Menu');
const Feedback = require('../models/Feedback');

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MENU_TEMPLATE = [
  {
    breakfast: 'Poha with Sev, Boiled Eggs & Masala Chai',
    lunch: 'Dal Tadka, Jeera Rice, Tawa Roti, Onion Salad',
    snacks: 'Aloo Samosa with Green Chutney & Chai',
    dinner: 'Rajma Masala, Steamed Rice, Roti, Papad',
  },
  {
    breakfast: 'Aloo Paratha with Curd & Butter, Lassi',
    lunch: 'Chole Masala, Steamed Rice, Roti, Kachumber Salad',
    snacks: 'Bread Pakoda with Tamarind Chutney & Tea',
    dinner: 'Kadhi Pakoda, Jeera Rice, Roti, Boondi Raita',
  },
  {
    breakfast: 'Masala Upma, Boiled Egg & Masala Chai',
    lunch: 'Paneer Butter Masala, Jeera Rice, Tawa Roti, Salad',
    snacks: 'Idli with Sambar & Coconut Chutney',
    dinner: 'Veg Pulau, Raita, Dal Fry, Papad',
  },
  {
    breakfast: 'Bread Butter Jam, Omelette/Boiled Egg & Tea',
    lunch: 'Dal Fry, Steamed Rice, Roti, Bhindi Fry',
    snacks: 'Dhokla with Green Chutney & Chai',
    dinner: 'Malai Kofta, Roti, Jeera Rice, Salad',
  },
  {
    breakfast: 'Poori with Aloo Rasedar & Chai',
    lunch: 'Rajma Chawal, Roti, Cucumber Salad, Pickle',
    snacks: 'Veg Grilled Sandwich with Ketchup & Tea',
    dinner: 'Veg Biryani with Raita & Masala Papad',
  },
  {
    breakfast: 'Chole Bhature, Onion Salad & Lassi',
    lunch: 'Mix Veg, Steamed Rice, Roti, Dal Tadka',
    snacks: 'Vada Pav with Fried Chillies & Chai',
    dinner: 'Egg Curry/Paneer Tikka, Roti, Jeera Rice',
  },
  {
    breakfast: 'Sooji Halwa, Puri & Masala Chai',
    lunch: 'Special Sunday Thali: Dal Makhani, Rice, Roti, Salad, Halwa',
    snacks: 'Cheese Corn Pizza Slice & Milk',
    dinner: 'Dal Khichdi, Fried Papad, Pickle, Curd',
  },
];

const utcMidnight = (offsetDays = 0) => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d;
};

const mondayOfCurrentWeek = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  const weekday = d.getUTCDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
};

const buildDays = (monday) =>
  MENU_TEMPLATE.map((meals, i) => {
    const date = new Date(monday);
    date.setUTCDate(date.getUTCDate() + i);
    return { date, dayName: DAY_NAMES[i], meals };
  });

const FEEDBACK_SAMPLES = [
  { daysAgo: 0, mealType: 'breakfast', rating: 4, comment: 'Poha was fresh and well spiced today.' },
  { daysAgo: 0, mealType: 'lunch', rating: 2, comment: 'The dal was cold and the rice was undercooked.' },
  { daysAgo: 0, mealType: 'snacks', rating: 3, comment: 'Samosa was average, chutney was watery.' },
  { daysAgo: 0, mealType: 'dinner', rating: 5, comment: 'Rajma was excellent, best dinner this week!' },
  { daysAgo: 1, mealType: 'breakfast', rating: 5, comment: 'Aloo paratha with curd was amazing.' },
  { daysAgo: 1, mealType: 'lunch', rating: 3, comment: 'Chole was good but roti was a bit hard.' },
  { daysAgo: 1, mealType: 'snacks', rating: 1, comment: 'Bread pakoda was oily and stale, very disappointing.' },
  { daysAgo: 1, mealType: 'dinner', rating: 2, comment: 'Kadhi was too salty and rice was bland.' },
  { daysAgo: 2, mealType: 'breakfast', rating: 3, comment: 'Upma was dry, egg was fine though.' },
  { daysAgo: 2, mealType: 'lunch', rating: 5, comment: 'Paneer butter masala was delicious and roti was soft.' },
  { daysAgo: 2, mealType: 'dinner', rating: 2, comment: 'Pulau was oily and raita tasted sour.' },
  { daysAgo: 3, mealType: 'breakfast', rating: 2, comment: 'Bread was stale and the tea was cold.' },
  { daysAgo: 3, mealType: 'lunch', rating: 4, comment: 'Bhindi fry was tasty, good portion size.' },
  { daysAgo: 3, mealType: 'snacks', rating: 4, comment: 'Dhokla was soft and chutney was spicy, liked it.' },
  { daysAgo: 4, mealType: 'breakfast', rating: 3, comment: 'Poori was a bit oily but aloo sabzi was good.' },
  { daysAgo: 4, mealType: 'lunch', rating: 1, comment: 'Rajma was undercooked and salad looked unclean.' },
  { daysAgo: 4, mealType: 'dinner', rating: 5, comment: 'Veg biryani was aromatic and perfectly cooked.' },
  { daysAgo: 5, mealType: 'breakfast', rating: 4, comment: 'Chole bhature was fresh, lassi was cold.' },
  { daysAgo: 5, mealType: 'lunch', rating: 2, comment: 'Dal was watery and the rotis were cold.' },
  { daysAgo: 5, mealType: 'dinner', rating: 3, comment: 'Egg curry was okay, could use less oil.' },
  { daysAgo: 6, mealType: 'breakfast', rating: 5, comment: 'Halwa puri on Sunday, exactly what we wanted.' },
  { daysAgo: 6, mealType: 'lunch', rating: 4, comment: 'Sunday thali was great overall, halwa was perfect.' },
  { daysAgo: 6, mealType: 'dinner', rating: 1, comment: 'Khichdi was tasteless and burnt at the bottom.' },
];

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_mess';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Seeding...');

    await Promise.all([
      User.deleteMany({}),
      Menu.deleteMany({}),
      Feedback.deleteMany({}),
    ]);

    const admin = await User.create({
      name: 'Mess Admin',
      email: 'admin@mess.com',
      password: 'admin123',
      role: 'admin',
      hostelBlock: 'Administration',
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'student1@mess.com',
      password: 'student123',
      role: 'student',
      hostelBlock: 'Block A',
    });

    const student2 = await User.create({
      name: 'Diya Patel',
      email: 'student2@mess.com',
      password: 'student123',
      role: 'student',
      hostelBlock: 'Block B',
    });

    const monday = mondayOfCurrentWeek();
    const menu = await Menu.create({
      weekStartDate: monday,
      days: buildDays(monday),
      updatedBy: admin._id,
    });

    const students = [student1, student2];
    const feedbackDocs = FEEDBACK_SAMPLES.map((sample, index) => ({
      student: students[index % 2]._id,
      date: utcMidnight(sample.daysAgo),
      mealType: sample.mealType,
      rating: sample.rating,
      comment: sample.comment,
      createdAt: new Date(Date.now() - sample.daysAgo * 24 * 60 * 60 * 1000),
    }));

    await Feedback.insertMany(feedbackDocs);

    console.log('Seed complete:');
    console.log('  Admin   -> admin@mess.com / admin123');
    console.log('  Student -> student1@mess.com / student123');
    console.log('  Student -> student2@mess.com / student123');
    console.log(`  Menu week starting: ${menu.weekStartDate.toISOString().slice(0, 10)}`);
    console.log(`  Feedback entries: ${feedbackDocs.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

run();
