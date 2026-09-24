export type Role = 'student' | 'warden';

export type MealSlot = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type ReviewStatus = 'pending' | 'reviewed' | 'resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  block: string;
  campus: string;
  studentId?: string;
  avatarColor: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  calories: number;
}

export interface Meal {
  slot: MealSlot;
  tag: string;
  title: string;
  schedule: string;
  location: string;
  dietary: string;
  dishes: Dish[];
}

export interface DayMenu {
  id: string;
  weekday: string; // Mon, Tue...
  monthDay: number;
  month: string; // Oct
  year: number;
  isToday: boolean;
  meals: Meal[];
}

export interface FeedbackReview {
  id: string;
  student: string;
  studentId: string;
  block: string;
  dish: string;
  mealItem: string;
  slot: MealSlot;
  date: string; // '2026-09-20'
  time: string;
  rating: number;
  comment: string;
  tags: string[];
  status: ReviewStatus;
  adminReply: string | null;
  repliedAt: string | null;
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  kind: 'notice' | 'chef-special' | 'alert';
}

export interface TagDef {
  tag: string;
  count: number;
}

export type TabKey = 'menu' | 'feedback' | 'dashboard' | 'editor';

export type ModalKey =
  | 'auth'
  | 'feedback'
  | 'feedbackDetail'
  | 'systemStatus'
  | 'notifications'
  | 'support'
  | 'privacy'
  | 'none';

export interface FeedbackModalTarget {
  dayId: string;
  meal: Meal;
}

export interface FilterTimeframe {
  key: string;
  label: string;
}