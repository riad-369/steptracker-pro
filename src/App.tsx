import { useState } from 'react';
import { Dashboard, Leaderboard, GroupAnalytics, IndividualAnalytics } from './components';
import { mockUsers, mockGroupStats } from './data/mockData';
import { Activity, Users, Trophy, BarChart3 } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leaderboard' | 'group' | 'individual'>('dashboard');
  const [selectedUserId, setSelectedUserId] = useState<string>(mockUsers[0].id);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard users={mockUsers} groupStats={mockGroupStats} onNavigate={setActiveTab} />;
      case 'leaderboard':
        return <Leaderboard users={mockUsers} onSelectUser={(id: string) => { setSelectedUserId(id); setActiveTab('individual'); }} />;
      case 'group':
        return <GroupAnalytics stats={mockGroupStats} users={mockUsers} />;
      case 'individual':
        return <IndividualAnalytics user={mockUsers.find(u => u.id === selectedUserId) || mockUsers[0]} groupStats={mockGroupStats} allUsers={mockUsers} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <nav className="glass-nav">
        <div className="nav-brand">
          <Activity className="brand-icon" />
          <h1>StepTracker Pro</h1>
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <BarChart3 size={18} /> Dashboard
          </button>
          <button className={`nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <Trophy size={18} /> Leaderboard
          </button>
          <button className={`nav-btn ${activeTab === 'group' ? 'active' : ''}`} onClick={() => setActiveTab('group')}>
            <Users size={18} /> Team Analytics
          </button>
        </div>
      </nav>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
