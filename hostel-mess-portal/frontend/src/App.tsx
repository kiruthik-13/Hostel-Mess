import { AppProvider, useApp } from './context/AppContext';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import FeedbackModal from './components/FeedbackModal';
import FeedbackDetailModal from './components/FeedbackDetailModal';
import NotificationsDrawer from './components/NotificationsDrawer';
import SystemStatusModal from './components/SystemStatusModal';
import SuccessOverlay from './components/SuccessOverlay';
import { PrivacyModal, SupportModal } from './components/SupportPrivacyModals';
import MenuPage from './pages/MenuPage';
import FeedbackPage from './pages/FeedbackPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';

function Shell() {
  const { isAuthed, tab, modal } = useApp();

  if (!isAuthed) {
    return (
      <>
        <AuthModal />
        <SuccessOverlay />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {tab === 'menu' && <MenuPage />}
        {tab === 'feedback' && <FeedbackPage />}
        {tab === 'dashboard' && <DashboardPage />}
        {tab === 'editor' && <EditorPage />}
      </main>
      <Footer />

      {/* Modals */}
      {modal === 'feedback' && <FeedbackModal />}
      {modal === 'feedbackDetail' && <FeedbackDetailModal />}
      {modal === 'notifications' && <NotificationsDrawer />}
      {modal === 'systemStatus' && <SystemStatusModal />}
      {modal === 'support' && <SupportModal />}
      {modal === 'privacy' && <PrivacyModal />}

      <SuccessOverlay />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}