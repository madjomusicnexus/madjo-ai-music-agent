import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Instruments from './pages/Instruments';
import PracticeRoutine from './pages/PracticeRoutine';
import Generate from './pages/Generate';

function AppContent() {
  const { page } = useApp();

  const pages = { dashboard: Dashboard, profile: Profile, instruments: Instruments, routine: PracticeRoutine, generate: Generate };
  const Page = pages[page];

  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <main className="lg:ml-64 min-h-screen">
        <div className="pt-16 lg:pt-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-6xl">
          <Page />
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
