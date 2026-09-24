import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  DayMenu,
  FeedbackModalTarget,
  FeedbackReview,
  MealSlot,
  ModalKey,
  Notice,
  ReviewStatus,
  TabKey,
  User,
} from '../types';
import {
  buildWeek,
  DEMO_USERS,
  SEED_NOTICES,
  SEED_REVIEWS,
  STUDENT_ACCOUNT,
  WARDEN_ACCOUNT,
} from '../data/seed';

export type TimeframeKey = '7d' | 'month' | 'semester';

export interface ReviewDraft {
  studentName: string;
  studentId: string;
  block: string;
  dish: string;
  slot: MealSlot;
  rating: number;
  comment: string;
  tags: string[];
}

interface AppContextValue {
  /* auth + role */
  user: User | null;
  role: 'student' | 'warden';
  isWarden: boolean;
  isAuthed: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRole: () => void;
  demoCredentials: { email: string; password: string }[];

  /* data */
  menu: DayMenu[];
  reviews: FeedbackReview[];
  notices: Notice[];

  /* nav */
  tab: TabKey;
  setTab: (t: TabKey) => void;

  /* modal system */
  modal: ModalKey;
  feedbackTarget: FeedbackModalTarget | null;
  detailReview: FeedbackReview | null;
  openModal: (key: ModalKey) => void;
  openFeedbackModal: (target: FeedbackModalTarget) => void;
  openDetailModal: (reviewId: string) => void;
  closeModal: () => void;

  /* success overlay */
  success: { title: string; message: string } | null;
  showSuccess: (title: string, message: string) => void;

  /* actions */
  addReview: (draft: ReviewDraft) => void;
  setReviewResolution: (id: string, status: ReviewStatus, reply: string | null) => void;
  updateMeal: (dayId: string, slot: MealSlot, patch: Partial<DayMenu['meals'][number]>) => void;
  replaceMealDishes: (dayId: string, slot: MealSlot, dishes: DayMenu['meals'][number]['dishes']) => void;
  markAllNoticesRead: () => void;

  /* dashboard filters */
  timeframe: TimeframeKey;
  setTimeframe: (t: TimeframeKey) => void;
  tableSearch: string;
  setTableSearch: (s: string) => void;
  slotFilter: '' | MealSlot;
  setSlotFilter: (s: '' | MealSlot) => void;
  ratingFilter: '' | number;
  setRatingFilter: (r: '' | number) => void;
  activeTag: string | null;
  setActiveTag: (t: string | null) => void;
  page: number;
  setPage: (p: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [menu, setMenu] = useState<DayMenu[]>(() => buildWeek());
  const [reviews, setReviews] = useState<FeedbackReview[]>(SEED_REVIEWS);
  const [notices, setNotices] = useState<Notice[]>(SEED_NOTICES);
  const [tab, setTab] = useState<TabKey>('menu');
  const [modal, setModal] = useState<ModalKey>('none');
  const [feedbackTarget, setFeedbackTarget] = useState<FeedbackModalTarget | null>(null);
  const [detailReview, setDetailReview] = useState<FeedbackReview | null>(null);
  const [success, setSuccess] = useState<{ title: string; message: string } | null>(null);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [timeframe, setTimeframe] = useState<TimeframeKey>('7d');
  const [tableSearch, setTableSearch] = useState('');
  const [slotFilter, setSlotFilter] = useState<'' | MealSlot>('');
  const [ratingFilter, setRatingFilter] = useState<'' | number>('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const role = user?.role ?? 'student';
  const isWarden = role === 'warden';
  const isAuthed = user !== null;

  const login = useCallback((u: User) => {
    setUser(u);
    setModal('none');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTab('menu');
  }, []);

  const switchRole = useCallback(() => {
    setUser((prev) => {
      if (!prev || (prev.role ?? 'student') === 'student') {
        return DEMO_USERS.find((u) => u.role === 'warden') ?? null;
      }
      return DEMO_USERS.find((u) => u.role === 'student') ?? null;
    });
    setModal('none');
  }, []);

  const openModal = useCallback((key: ModalKey) => setModal(key), []);
  const openFeedbackModal = useCallback((target: FeedbackModalTarget) => {
    setFeedbackTarget(target);
    setModal('feedback');
  }, []);
  const openDetailModal = useCallback(
    (reviewId: string) => {
      const found = reviews.find((r) => r.id === reviewId);
      if (found) setDetailReview(found);
      setModal('feedbackDetail');
    },
    [reviews],
  );
  const closeModal = useCallback(() => {
    setModal('none');
    setFeedbackTarget(null);
    setDetailReview(null);
  }, []);

  const showSuccess = useCallback((title: string, message: string) => {
    if (successTimer.current) clearTimeout(successTimer.current);
    setSuccess({ title, message });
    successTimer.current = setTimeout(() => setSuccess(null), 2600);
  }, []);

  const addReview = useCallback(
    (draft: ReviewDraft) => {
      const id = `live-${Date.now()}`;
      const now = new Date();
      const review: FeedbackReview = {
        id,
        student: draft.studentName,
        studentId: draft.studentId,
        block: draft.block,
        dish: draft.dish,
        mealItem: draft.dish,
        slot: draft.slot,
        date: now.toISOString().slice(0, 10),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        rating: draft.rating,
        comment: draft.comment,
        tags: draft.tags,
        status: 'pending',
        adminReply: null,
        repliedAt: null,
      };
      setReviews((prev) => [review, ...prev]);
    },
    [],
  );

  const setReviewResolution = useCallback(
    (id: string, status: ReviewStatus, reply: string | null) => {
      setReviews((prev) =>
        prev.map((r) => {
          if (r.id !== id) return r;
          const base = { ...r, status };
          if (reply !== null) {
            base.adminReply = reply;
            base.repliedAt = new Date().toISOString().slice(0, 10);
          }
          return base;
        }),
      );
      setDetailReview((cur) => {
        if (!cur || cur.id !== id) return cur;
        const next = { ...cur, status };
        if (reply !== null) {
          next.adminReply = reply;
          next.repliedAt = new Date().toISOString().slice(0, 10);
        }
        return next;
      });
    },
    [],
  );

  const updateMeal = useCallback(
    (dayId: string, slot: MealSlot, patch: Partial<DayMenu['meals'][number]>) => {
      setMenu((prev) =>
        prev.map((day) =>
          day.id !== dayId
            ? day
            : {
                ...day,
                meals: day.meals.map((m) => (m.slot === slot ? { ...m, ...patch } : m)),
              },
        ),
      );
    },
    [],
  );

  const replaceMealDishes = useCallback(
    (dayId: string, slot: MealSlot, dishes: DayMenu['meals'][number]['dishes']) => {
      setMenu((prev) =>
        prev.map((day) =>
          day.id !== dayId
            ? day
            : {
                ...day,
                meals: day.meals.map((m) => (m.slot === slot ? { ...m, dishes } : m)),
              },
        ),
      );
    },
    [],
  );

  const markAllNoticesRead = useCallback(() => {
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      role,
      isWarden,
      isAuthed,
      login,
      logout,
      switchRole,
      demoCredentials: [
        { email: STUDENT_ACCOUNT.email, password: STUDENT_ACCOUNT.password },
        { email: WARDEN_ACCOUNT.email, password: WARDEN_ACCOUNT.password },
      ],
      menu,
      reviews,
      notices,
      tab,
      setTab,
      modal,
      feedbackTarget,
      detailReview,
      openModal,
      openFeedbackModal,
      openDetailModal,
      closeModal,
      success,
      showSuccess,
      addReview,
      setReviewResolution,
      updateMeal,
      replaceMealDishes,
      markAllNoticesRead,
      timeframe,
      setTimeframe,
      tableSearch,
      setTableSearch,
      slotFilter,
      setSlotFilter,
      ratingFilter,
      setRatingFilter,
      activeTag,
      setActiveTag,
      page,
      setPage,
    }),
    [
      user, role, isWarden, isAuthed, login, logout, switchRole,
      menu, reviews, notices, tab, modal, feedbackTarget, detailReview,
      openModal, openFeedbackModal, openDetailModal, closeModal,
      success, showSuccess, addReview, setReviewResolution,
      updateMeal, replaceMealDishes, markAllNoticesRead,
      timeframe, tableSearch, slotFilter, ratingFilter, activeTag, page,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}