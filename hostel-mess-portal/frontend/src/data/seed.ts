import type {
  DayMenu,
  FeedbackReview,
  Meal,
  MealSlot,
  Notice,
  TagDef,
  User,
} from '../types';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const pad = (n: number) => String(n).padStart(2, '0');

export function isoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* ------------------------------------------------------------------ */
/* Demo users                                                          */
/* ------------------------------------------------------------------ */

export const STUDENT_ACCOUNT = {
  email: 'student1@mess.com',
  password: 'student123',
};

export const WARDEN_ACCOUNT = {
  email: 'admin@mess.com',
  password: 'admin123',
};

export const DEMO_USERS: User[] = [
  {
    id: 'u-student-1',
    name: 'Arjun Mehta',
    email: STUDENT_ACCOUNT.email,
    role: 'student',
    block: 'Block A · North Campus',
    campus: 'North Campus',
    studentId: 'FE22CSE047',
    avatarColor: '#f97316',
  },
  {
    id: 'u-warden-1',
    name: 'Warden N. Kulkarni',
    email: WARDEN_ACCOUNT.email,
    role: 'warden',
    block: 'Block B · South Campus',
    campus: 'South Campus',
    avatarColor: '#006c4a',
  },
];

/* ------------------------------------------------------------------ */
/* Menu templates (per weekday, Mon=0 .. Sun=6)                        */
/* ------------------------------------------------------------------ */

function meal(
  slot: MealSlot,
  tag: string,
  title: string,
  schedule: string,
  location: string,
  dietary: string,
  dishes: Meal['dishes'],
): Meal {
  return { slot, tag, title, schedule, location, dietary, dishes };
}

function dish(id: string, name: string, calories: number, description: string) {
  return { id, name, calories, description };
}

const DAY_TEMPLATES: Meal[][] = [
  // Monday
  [
    meal('breakfast', 'Morning Energy', 'Breakfast', '07:00 – 10:00', 'Main Dining Hall', 'Vegan & Gluten-Free Options Available', [
      dish('d1', 'Lemon Poha', 380, 'Flattened rice tossed with turmeric, peanuts, curry leaves and a squeeze of fresh lime.'),
      dish('d2', 'Masala Upma', 320, 'Creamy semolina sautéed with ginger, curry leaves, mustard seeds and green chillies.'),
      dish('d3', 'Steamed Idli + Sambar', 310, 'Soft rice-lentil cakes served with piping hot sambar and coconut chutney.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:00 – 14:30', 'Main Dining Hall', 'High Protein Selection', [
      dish('d4', 'Paneer Butter Masala', 520, 'Cottage cheese cubes simmered in a silky tomato-butter gravy with kasuri methi.'),
      dish('d5', 'Jeera Rice', 280, 'Fragrant basmati rice tempered with cumin seeds and whole spices.'),
      dish('d6', 'Dal Tadka', 210, 'Yellow lentils finished with a sizzling garlic-cumin tadka.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Fresh & Light', [
      dish('d7', 'Samosa + Green Chutney', 360, 'Crisp pastry parcels of spiced potato-pea filling with mint chutney.'),
      dish('d8', 'Masala Chai', 150, 'Cardamom and ginger infused black tea steeped with milk.'),
      dish('d9', 'Sprouted Moong Chaat', 240, 'Tossed bean sprouts with onion, tomato and lemon-tamarind dressing.'),
    ]),
    meal('dinner', 'Evening Comfort', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'Balanced Homestyle Meal', [
      dish('d10', 'Mixed Veg Stew', 290, 'Seasonal vegetables simmered in a mild coconut-onion gravy.'),
      dish('d11', 'Masala Khichdi', 320, 'Rice and moong dal cooked with ghee, cumin and asafoetida.'),
      dish('d12', 'Cucumber Raita', 90, 'Cooled yoghurt with grated cucumber, roasted cumin and coriander.'),
    ]),
  ],
  // Tuesday
  [
    meal('breakfast', 'Morning Energy', 'Breakfast', '07:00 – 10:00', 'Main Dining Hall', 'Protein-Rich Start', [
      dish('d13', 'Paneer Paratha + Curd', 430, 'Stuffed whole-wheat flatbread with cottage cheese, served with chilled curd.'),
      dish('d14', 'Rava Dosa', 340, 'Crisp semolina crepe with onion, curry leaves and coconut chutney.'),
      dish('d15', 'Banana Honey Bowl', 210, 'Fresh bananas sliced over toasted oats with a drizzle of honey.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:00 – 14:30', 'Main Dining Hall', 'Classic Comfort', [
      dish('d16', 'Rajma Masala', 320, 'Red kidney beans slow-cooked in a rich onion-tomato masala.'),
      dish('d17', 'Steamed Rice', 220, 'Light, fluffy basmati rice as the perfect canvas.'),
      dish('d18', 'Tandoori Roti + Salad', 180, 'Charred whole-wheat rotis with a side of kachumber salad.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Classic Café Cravings', [
      dish('d19', 'Bread Pakora', 420, 'Bread slices dipped in spiced gram batter and deep-fried golden.'),
      dish('d20', 'Filter Coffee', 120, 'South Indian style strong filter coffee with frothed milk.'),
      dish('d21', 'Fruit Custard', 260, 'Vanilla custard layered with seasonal tropical fruits.'),
    ]),
    meal('dinner', 'Evening Comfort', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'Paneer Special', [
      dish('d22', 'Kadai Paneer', 360, 'Paneer and peppers tossed in a rustic kadai masala of roasted spices.'),
      dish('d23', 'Butter Naan', 180, 'Leavened tandoor-baked flatbread brushed with butter.'),
      dish('d24', 'Mix Veg Raita', 95, 'Yoghurt mixed with cucumber, onion, tomato and a pinch of chaat masala.'),
    ]),
  ],
  // Wednesday
  [
    meal('breakfast', 'Morning Energy', 'Breakfast', '07:00 – 10:00', 'Main Dining Hall', 'Hearty North-Indian Start', [
      dish('d25', 'Aloo Paratha', 450, 'Whole-wheat paratha stuffed with spiced mashed potato, served with curd.'),
      dish('d26', 'Dahi', 130, 'Freshly set home-style yoghurt.'),
      dish('d27', 'Semolina Dhokla', 280, 'Steamed savoury cake tempered with mustard and curry leaves.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:00 – 14:30', 'Main Dining Hall', 'Street-Favourite Feast', [
      dish('d28', 'Chole Bhature', 520, 'Spicy chickpea curry with fluffy deep-fried bread.'),
      dish('d29', 'Jeera Aloo', 240, 'Baby potatoes tossed with cumin, turmeric and coriander.'),
      dish('d30', 'Onion Salad', 60, 'Crisp onion rings with lemon and chaat masala.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Tangy & Sweet', [
      dish('d31', 'Chana Chaat', 300, 'Chickpeas tossed with potatoes, chutneys and sev.'),
      dish('d32', 'Lemon Iced Tea', 90, 'Iced black tea with fresh lemon and mint.'),
      dish('d33', 'Veg Puff', 350, 'Flaky pastry puffs filled with spiced mixed vegetables.'),
    ]),
    meal('dinner', 'Evening Comfort', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'One-Pot Wonder', [
      dish('d34', 'Veg Biryani + Raita', 520, 'Fragrant layered rice with mixed vegetables, saffron and mint raita.'),
      dish('d35', 'Curd Rice', 280, 'Cool comfort rice tempered with mustard, ginger and curry leaves.'),
    ]),
  ],
  // Thursday
  [
    meal('breakfast', 'Morning Energy', 'Breakfast', '07:00 – 10:00', 'Main Dining Hall', 'South-Indian Classic', [
      dish('d36', 'Mysore Masala Dosa', 410, 'Crisp dosa smeared with spicy red chutney, filled with potato masala.'),
      dish('d37', 'Coconut Chutney + Sambar', 190, 'Velvety coconut chutney alongside hot lentil sambar.'),
      dish('d38', 'Filter Coffee', 120, 'Strong South Indian filter coffee with frothed milk.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:00 – 14:30', 'Main Dining Hall', 'Greens & Grains', [
      dish('d39', 'Palak Paneer', 360, 'Paneer cubes simmered in a smooth spinach gravy with garlic.'),
      dish('d40', 'Tandoori Roti', 140, 'Whole-wheat rotis baked in the tandoor.'),
      dish('d41', 'Kachumber Salad', 85, 'Chopped cucumber, tomato and onion with lemon juice.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Street-Style Bites', [
      dish('d42', 'Corn Bhel', 280, 'Sweet corn tossed with puffed rice, sev, onion and tangy chutneys.'),
      dish('d43', 'Sweet Lassi', 210, 'Thick blended yoghurt drink garnished with cardamom.'),
      dish('d44', 'Veg Spring Roll', 330, 'Crispy rolls stuffed with crunchy vegetables and noodles.'),
    ]),
    meal('dinner', 'Evening Comfort', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'Rajasthani Classic', [
      dish('d45', 'Dal Baati Churma', 480, 'Baked wheat baatis with lentil dal and sweet churma.'),
      dish('d46', 'Gatte Ki Sabzi', 300, 'Gram-flour dumplings simmered in spiced yoghurt gravy.'),
    ]),
  ],
  // Friday
  [
    meal('breakfast', 'Morning Energy', 'Breakfast', '07:00 – 10:00', 'Main Dining Hall', 'Farm-Fresh Start', [
      dish('d47', 'Onion Uttapam', 370, 'Thick savoury pancake topped with onion, tomato and coriander.'),
      dish('d48', 'Mint Chutney + Sambar', 170, 'Mint-coriander chutney with hot sambar.'),
      dish('d49', 'Sprouts Salad', 140, 'Steamed sprouts with lemon, onion and pomegranate seeds.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:00 – 14:30', 'Main Dining Hall', 'Soul Food Friday', [
      dish('d50', 'Veg Pulao', 380, 'Basmati rice cooked with garden vegetables and whole spices.'),
      dish('d51', 'Kadhi Pakoda', 300, 'Gram-flour dumplings in a tangy yoghurt curry tempered with fenugreek.'),
      dish('d52', 'Boondi Raita', 150, 'Yoghurt with crisp boondi pearls and roasted cumin.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Mumbai Special', [
      dish('d53', 'Pav Bhaji', 450, 'Spiced mashed vegetable bhaji served with buttered pav.'),
      dish('d54', 'Masala Lemonade', 95, 'Chilled lemonade with black salt, mint and a hint of spice.'),
      dish('d55', 'Roasted Peanuts', 220, 'Peanuts roasted with salt and chilli flakes.'),
    ]),
    meal('dinner', 'Evening Comfort', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'Chef’s Special', [
      dish('d56', 'Tawa Paneer', 390, 'Char-grilled paneer and peppers in a smoky tawa masala.'),
      dish('d57', 'Butter Garlic Naan', 200, 'Tandoor naan brushed with garlic butter.'),
      dish('d58', 'Gulab Jamun', 150, 'Warm fried milk dumplings soaked in rose-flavoured syrup.'),
    ]),
  ],
  // Saturday
  [
    meal('breakfast', 'Morning Energy', 'Breakfast', '08:00 – 10:30', 'Main Dining Hall', 'Gujarati Favourites', [
      dish('d59', 'Methi Thepla', 330, 'Whole-wheat flatbread with fenugreek leaves, sesame and spices.'),
      dish('d60', 'Curd + Jaggery', 150, 'Chilled curd with a generous spoon of organic jaggery.'),
      dish('d61', 'Masala Chai', 150, 'Ginger-cardamom black tea with milk.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:00 – 14:30', 'Main Dining Hall', 'Saturday Special Thali', [
      dish('d62', 'Paneer Kolhapuri', 400, 'Spiced cottage cheese in a fiery Kolhapuri masala.'),
      dish('d63', 'Bhakri', 200, 'Traditional sorghum flatbread, lightly crisped.'),
      dish('d64', 'Sol Kadhi', 90, 'Cooling kokum and coconut-milk drink with garlic.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Festival Snacks', [
      dish('d65', 'Sabudana Vada', 350, 'Crispy tapioca-pearl patties with peanuts and coriander.'),
      dish('d66', 'Mint Chutney', 60, 'Fresh coriander-mint dip with a tangy kick.'),
      dish('d67', 'Hot Chocolate', 180, 'Rich cocoa steamed milk topped with a marshmallow.'),
    ]),
    meal('dinner', 'Evening Comfort', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'Indo-Chinese Night', [
      dish('d68', 'Veg Manchurian + Fried Rice', 480, 'Veggie dumplings glazed in manchurian sauce with fried rice.'),
      dish('d69', 'Hot & Sour Soup', 140, 'Peppery broth with mushrooms, bamboo shoots and vinegar.'),
    ]),
  ],
  // Sunday
  [
    meal('breakfast', 'Weekend Brunch', 'Breakfast', '08:30 – 11:00', 'Main Dining Hall', 'Brunch Spread', [
      dish('d70', 'Puri Bhaji', 480, 'Golden puffed bread with a lightly spiced potato curry.'),
      dish('d71', 'Sweet Pongal', 320, 'Rice and moong dal cooked with jaggery, ghee and cashews.'),
      dish('d72', 'Filter Coffee', 120, 'Strong South Indian filter coffee.'),
    ]),
    meal('lunch', 'Midday Fuel', 'Lunch', '12:30 – 15:00', 'Main Dining Hall', 'Chef’s Weekend Special', [
      dish('d73', 'Mushroom Masala', 260, 'Button mushrooms simmered in a rich onion-tomato gravy.'),
      dish('d74', 'Ghee Rice', 330, 'Basmati rice cooked with ghee, jeera and whole spices.'),
      dish('d75', 'Mango Lassi', 230, 'Sweet mango blended with thick yoghurt.'),
    ]),
    meal('snacks', 'Afternoon Boost', 'Snacks', '16:30 – 18:00', 'Café Corner', 'Comfort Snacks', [
      dish('d76', 'Vada Pav', 400, 'Mumbai-style crispy potato vada in a soft pav with garlic chutney.'),
      dish('d77', 'Masala Maggi', 340, 'Noodles tossed with veggies and a buttery masala mix.'),
    ]),
    meal('dinner', 'Sunday Feast', 'Dinner', '19:00 – 21:30', 'Main Dining Hall', 'Sunday Feast', [
      dish('d78', 'Paneer Tikka', 430, 'Char-grilled marinated paneer skewers with mint chutney.'),
      dish('d79', 'Lachha Paratha', 210, 'Flaky layered whole-wheat paratha finished with ghee.'),
      dish('d80', 'Kheer', 180, 'Slow-cooked rice pudding with cardamom, saffron and nuts.'),
    ]),
  ],
];

export const WEEK_LABEL = 'Fall Semester • Week 8';

export function buildWeek(): DayMenu[] {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  return DAY_TEMPLATES.map((meals, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      id: isoDate(date),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      monthDay: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      isToday: i === (now.getDay() + 6) % 7,
      meals,
    };
  });
}

export const DINING_LOCATIONS = [
  'Main Dining Hall',
  'Café Corner',
  'North Block Kitchen',
];

/* ------------------------------------------------------------------ */
/* Reviews                                                             */
/* ------------------------------------------------------------------ */

function review(
  id: string,
  student: string,
  studentId: string,
  block: string,
  dishName: string,
  slot: MealSlot,
  daysBack: number,
  time: string,
  rating: number,
  comment: string,
  tags: string[],
  status: FeedbackReview['status'] = 'reviewed',
  adminReply: string | null = null,
): FeedbackReview {
  const d = daysAgo(daysBack);
  return {
    id,
    student,
    studentId,
    block,
    dish: dishName,
    mealItem: dishName,
    slot,
    date: isoDate(d),
    time,
    rating,
    comment,
    tags,
    status,
    adminReply,
    repliedAt: adminReply ? isoDate(daysAgo(Math.max(0, daysBack - 1))) : null,
  };
}

export const SEED_REVIEWS: FeedbackReview[] = [
  // Paneer Butter Masala (aim ~4.7)
  review('r1', 'Arjun Mehta', 'FE22CSE047', 'Block A · North', 'Paneer Butter Masala', 'lunch', 1, '13:10', 5, 'The paneer was creamy and the gravy had just the right smokiness. Easily the best thing on campus right now.', ['#Fresh & Delicious', '#Great Presentation'], 'resolved', 'Noted! Head Chef Raman tweaked the kasuri methi ratio this week.'),
  review('r2', 'Priya Nair', 'FE22ECE112', 'Block C · South', 'Paneer Butter Masala', 'lunch', 2, '12:45', 5, 'Consistent quality every single time. Portion could be a touch bigger though.', ['#Fresh & Delicious', '#Less Portions']),
  review('r3', 'Rohan Gupta', 'FE23MEC021', 'Block B · East', 'Paneer Butter Masala', 'lunch', 3, '12:30', 4, 'Great gravy, paneer was slightly chewy today but still a solid 4.', ['#Great Presentation']),
  review('r4', 'Sneha Iyer', 'FE22BIO008', 'Block A · North', 'Paneer Butter Masala', 'lunch', 4, '13:20', 5, 'Tastes like home. The butter naan pairing was superb.', ['#Fresh & Delicious'], 'resolved', 'Happy you enjoyed it!'),
  review('r5', 'Karan Patel', 'FE23CIV033', 'Block D · West', 'Paneer Butter Masala', 'lunch', 5, '12:55', 4, 'Rich, creamy, mildly spicy. Would love it served with jeera rice more often.', ['#Clean Tables']),
  review('r6', 'Ananya Rao', 'FE22CSD099', 'Block C · South', 'Paneer Butter Masala', 'lunch', 6, '13:05', 5, 'Queue was long but totally worth it.', ['#Fresh & Delicious']),
  review('r7', 'Vikram Singh', 'FE24EEE014', 'Block B · East', 'Paneer Butter Masala', 'lunch', 8, '12:35', 5, 'Outstanding. The counter ran out at 13:00 — please cook more!', ['#Long Queues', '#Fresh & Delicious']),
  review('r8', 'Meera Pillai', 'FE23CSE015', 'Block A · North', 'Paneer Butter Masala', 'lunch', 9, '13:15', 5, 'Best rated dish for a reason. Consistent every week.', ['#Great Presentation']),
  review('r9', 'Aditya Desai', 'FE22AUT040', 'Block D · West', 'Paneer Butter Masala', 'lunch', 10, '12:50', 4, 'Delicious but gravy was a little oily today.', ['#Fresh & Delicious']),

  // Mixed Veg Stew (aim ~2.1)
  review('r10', 'Neha Kapoor', 'FE23MEC045', 'Block A · North', 'Mixed Veg Stew', 'dinner', 1, '19:40', 2, 'Stew was watery and the vegetables were overcooked to mush. Needs serious work.', ['#Too Salty'], 'resolved', 'Notified Head Chef Raman to recalibrate seasoning.'),
  review('r11', 'Aarav Joshi', 'FE22CSE077', 'Block C · South', 'Mixed Veg Stew', 'dinner', 2, '20:10', 2, 'Less flavour than the colour suggests. Came across bland and mushy.', ['#Too Salty']),
  review('r12', 'Ishita Malhotra', 'FE23ECE056', 'Block B · East', 'Mixed Veg Stew', 'dinner', 3, '19:55', 2, 'Not edible tonight — fixed with the khichdi instead.', ['#Cold Food']),
  review('r13', 'Rahul Verma', 'FE24CE020', 'Block D · West', 'Mixed Veg Stew', 'dinner', 4, '20:25', 3, 'Average. The spices were there but the veg was falling apart.', ['#Small Portions']),
  review('r14', 'Sanya Kapoor', 'FE22BIO033', 'Block A · North', 'Mixed Veg Stew', 'dinner', 5, '19:35', 2, 'Watery gravy and salty. Please review the recipe.', ['#Too Salty', '#Late Service'], 'reviewed'),
  review('r15', 'Devansh Shah', 'FE23CSE088', 'Block C · South', 'Mixed Veg Stew', 'dinner', 7, '20:00', 2, 'I wanted to like it. It was lukewarm and bland.', ['#Cold Food']),
  review('r16', 'Anjali Nair', 'FE22MCA011', 'Block B · East', 'Mixed Veg Stew', 'dinner', 8, '19:50', 2, 'The stew needs a serious makeover — too salty for anyone.', ['#Too Salty']),
  review('r17', 'Kabir Singh', 'FE23AUT027', 'Block D · West', 'Mixed Veg Stew', 'dinner', 11, '20:15', 2, 'Served cold by the time we sat down. Disappointing.', ['#Cold Food', '#Late Service']),
  review('r18', 'Tanvi Rao', 'FE24CSD111', 'Block A · North', 'Mixed Veg Stew', 'dinner', 12, '19:45', 3, 'Mild improvement over last week but still muted in flavour.', ['#Small Portions']),

  // Breakfast
  review('r19', 'Arjun Mehta', 'FE22CSE047', 'Block A · North', 'Lemon Poha', 'breakfast', 1, '08:20', 4, 'Fresh and light with a good tang. Peanuts were a nice touch.', ['#Fresh & Delicious'], 'resolved', 'Thanks for the love!'),
  review('r20', 'Priya Nair', 'FE22ECE112', 'Block C · South', 'Masala Upma', 'breakfast', 2, '08:05', 5, 'Perfectly seasoned, not mushy. Best upma on campus.', ['#Great Presentation']),
  review('r21', 'Rohan Gupta', 'FE23MEC021', 'Block B · East', 'Steamed Idli + Sambar', 'breakfast', 3, '08:40', 4, 'Idlis were soft and the sambar had good heat.', ['#Fresh & Delicious']),
  review('r22', 'Sneha Iyer', 'FE22BIO008', 'Block A · North', 'Aloo Paratha', 'breakfast', 5, '08:15', 5, 'Stuffed generously and the curd was fresh. Great start to the day.', ['#Great Presentation']),
  review('r23', 'Karan Patel', 'FE23CIV033', 'Block D · West', 'Mysore Masala Dosa', 'breakfast', 6, '09:00', 4, 'Crisp dosa, spicy chutney. Classic done right.', ['#Fresh & Delicious']),
  review('r24', 'Ananya Rao', 'FE22CSD099', 'Block C · South', 'Paneer Paratha + Curd', 'breakfast', 8, '08:30', 4, 'Hearty and filling. Slightly oily but very tasty.', ['#Less Portions']),
  review('r25', 'Vikram Singh', 'FE24EEE014', 'Block B · East', 'Onion Uttapam', 'breakfast', 10, '08:10', 5, 'Crisp edges, soft centre, lovely topping.', ['#Fresh & Delicious']),

  // Lunch (others)
  review('r26', 'Meera Pillai', 'FE23CSE015', 'Block A · North', 'Chole Bhature', 'lunch', 4, '12:40', 4, 'Fluffy bhature and well-spiced chole.', ['#Fresh & Delicious']),
  review('r27', 'Aditya Desai', 'FE22AUT040', 'Block D · West', 'Rajma Masala', 'lunch', 7, '13:00', 3, 'Comforting but the rajma was a little undercooked.', ['#Late Service']),
  review('r28', 'Neha Kapoor', 'FE23MEC045', 'Block A · North', 'Veg Pulao', 'lunch', 13, '12:35', 4, 'Fragrant and balanced. Raita was a great companion.', ['#Fresh & Delicious']),

  // Snacks
  review('r29', 'Aarav Joshi', 'FE22CSE077', 'Block C · South', 'Samosa + Green Chutney', 'snacks', 2, '17:10', 5, 'Crisp, piping hot, best chutney in the mess. 10/10.', ['#Clean Tables', '#Great Presentation']),
  review('r30', 'Ishita Malhotra', 'FE23ECE056', 'Block B · East', 'Pav Bhaji', 'snacks', 5, '17:25', 4, 'Buttery and rich. Could use more pav.', ['#Small Portions']),
  review('r31', 'Rahul Verma', 'FE24CE020', 'Block D · West', 'Bread Pakora', 'snacks', 9, '17:40', 5, 'Crunchy outside, soft inside. Perfect with filter coffee.', ['#Fresh & Delicious']),
  review('r32', 'Sanya Kapoor', 'FE22BIO033', 'Block A · North', 'Chana Chaat', 'snacks', 14, '17:05', 4, 'Tangy and fresh, chips the craving perfectly.', ['#Fresh & Delicious']),
  review('r33', 'Devansh Shah', 'FE23CSE088', 'Block C · South', 'Sabudana Vada', 'snacks', 16, '17:30', 4, 'Crisp vadas, mild heat. Lovely with mint chutney.', ['#Clean Tables']),

  // Dinner (others)
  review('r34', 'Anjali Nair', 'FE22MCA011', 'Block B · East', 'Veg Biryani + Raita', 'dinner', 2, '20:05', 4, 'Aromatic biryani with a cooling raita. Solid dinner.', ['#Fresh & Delicious']),
  review('r35', 'Kabir Singh', 'FE23AUT027', 'Block D · West', 'Kadai Paneer', 'dinner', 4, '20:30', 3, 'Tasty but the paneer was slightly dense.', ['#Long Queues']),
  review('r36', 'Tanvi Rao', 'FE24CSD111', 'Block A · North', 'Dal Baati Churma', 'dinner', 6, '19:50', 4, 'Authentic taste! The churma was the highlight.', ['#Great Presentation']),
  review('r37', 'Arjun Mehta', 'FE22CSE047', 'Block A · North', 'Veg Manchurian + Fried Rice', 'dinner', 8, '20:15', 4, 'Great Indo-Chinese pairing, sauce could be thicker.', ['#Fresh & Delicious', '#Too Salty']),
];

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const SEED_NOTICES: Notice[] = [
  { id: 'n1', kind: 'chef-special', title: 'Chef’s Special: Sunday Feast', body: 'Paneer Tikka, Lachha Paratha and Kheer this Sunday — come hungry.', time: '2h ago', unread: true },
  { id: 'n2', kind: 'notice', title: 'Mango Lassi is back on the menu', body: 'Sunday lunch sees the return of fresh Mango Lassi in the cold counter.', time: '5h ago', unread: true },
  { id: 'n3', kind: 'alert', title: 'Kitchen deep-clean tonight', body: 'Main kitchen closed for deep-cleaning 22:00–05:00. Dinner service unaffected.', time: '9h ago', unread: true },
  { id: 'n4', kind: 'notice', title: 'Salad counter opens for Lunch', body: 'A fresh salad & sprouts counter is now available during lunch at Main Dining Hall.', time: '1d ago', unread: false },
  { id: 'n5', kind: 'notice', title: 'RO water TDS recalibrated', body: 'Drinking water RO units recalibrated. TDS steady at 42 PPM. Stay hydrated!', time: '2d ago', unread: false },
];

/* ------------------------------------------------------------------ */
/* Complaint tag cloud                                                 */
/* ------------------------------------------------------------------ */

export const COMPLAINT_TAGS: TagDef[] = [
  { tag: '#TooSalty', count: 142 },
  { tag: '#ColdFood', count: 98 },
  { tag: '#LateService', count: 184 },
  { tag: '#LessPortions', count: 76 },
  { tag: '#FreshSalad', count: 112 },
  { tag: '#CleanTables', count: 64 },
  { tag: '#SpicyCurry', count: 89 },
  { tag: '#LongQueues', count: 130 },
];

/* ------------------------------------------------------------------ */
/* Feedback tag quick chips (used in the modal)                        */
/* ------------------------------------------------------------------ */

export const FEEDBACK_QUICK_TAGS = [
  '#Fresh & Delicious',
  '#Too Cold',
  '#Over-seasoned',
  '#Long Queue',
  '#Small Portion',
  '#Great Presentation',
  '#Too Salty',
  '#Clean Tables',
  '#Late Service',
];

export const MEAL_SLOT_META: Record<
  MealSlot,
  { tag: string; title: string; schedule: string; color: string }
> = {
  breakfast: { tag: 'Morning Energy', title: 'Breakfast', schedule: '07:00 – 10:00', color: '#f97316' },
  lunch: { tag: 'Midday Fuel', title: 'Lunch', schedule: '12:00 – 14:30', color: '#9d4300' },
  snacks: { tag: 'Afternoon Boost', title: 'Snacks', schedule: '16:30 – 18:00', color: '#006c4a' },
  dinner: { tag: 'Evening Comfort', title: 'Dinner', schedule: '19:00 – 21:30', color: '#8c7164' },
};