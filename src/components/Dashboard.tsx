import { UserStats, GroupStats } from '../types';
import { Trophy, ArrowRight, Target, Flame } from 'lucide-react';

interface Props {
    users: UserStats[];
    groupStats: GroupStats;
    onNavigate: (tab: 'dashboard' | 'leaderboard' | 'group' | 'individual') => void;
}

export default function Dashboard({ users, groupStats, onNavigate }: Props) {
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);
    const topUser = sortedUsers[0];
    const lastUser = sortedUsers[sortedUsers.length - 1];
    const progressPercent = Math.min(100, (groupStats.totalSteps / groupStats.teamGoal) * 100);

    // Dynamic Commentary Logic
    const generateCommentary = () => {
        const isCloseToGoal = progressPercent > 90;
        const isHalfway = progressPercent > 50 && progressPercent < 60;
        const topLeadMargin = topUser.points - sortedUsers[1].points;
        const jokes = [
            `We're officially carrying ${lastUser.name} at this point. Time to take the stairs!`,
            `${lastUser.name} is currently protesting the concept of "movement". Everyone encourage them!`,
            `Does ${lastUser.name} know this is a step challenge and not a sitting competition?`,
            `Someone check on ${lastUser.name}'s pedometer. I think it fell off a week ago.`,
            `We need to duct tape a Fitbit to ${lastUser.name}'s dog.`
        ];

        let prefix = "Team Update: ";
        if (isCloseToGoal) prefix += "We are so close to the goal! Keep pushing! ";
        else if (isHalfway) prefix += "Whoa, halfway there! Livin' on a prayer! ";
        else if (topLeadMargin > 50) prefix += `${topUser.name} is absolutely crushing it and leaving everyone in the dust! `;
        else prefix += "The race is super tight right now! Every step counts! ";

        return prefix + jokes[Math.floor(Math.random() * jokes.length)];
    };

    return (
        <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div className="commentary-banner" style={{
                padding: '16px 24px',
                marginBottom: '24px',
                borderRadius: '12px',
                background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                borderLeft: '4px solid var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
            }}>
                <Flame size={24} color="var(--accent)" />
                <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '500' }}>{generateCommentary()}</p>
            </div>

            <div className="dashboard-grid">
                {/* Top Performer Card */}
                <div className="glass-panel stat-card top-performer-highlight" onClick={() => onNavigate('leaderboard')} style={{ cursor: 'pointer', border: '1px solid var(--primary)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0) 100%)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px', color: 'var(--primary)', opacity: 0.2 }}>
                        <Trophy size={80} />
                    </div>
                    <div className="stat-header" style={{ position: 'relative', zIndex: 1 }}>
                        <Trophy size={20} className="stat-accent" />
                        <span>Current Leader</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                        <img src={topUser.avatar} alt="Avatar" className="avatar" />
                        <div>
                            <h3>{topUser.name}</h3>
                            <p className="stat-value" style={{ fontSize: '1.5rem' }}>{topUser.points.toLocaleString()} pts</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', marginTop: 'auto', paddingTop: '16px' }}>
                        View Leaderboard <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                    </div>
                </div>

                {/* Team Progress Card */}
                <div className="glass-panel stat-card" onClick={() => onNavigate('group')} style={{ cursor: 'pointer' }}>
                    <div className="stat-header">
                        <Target size={20} className="stat-accent" />
                        <span>Team Goal</span>
                    </div>
                    <div className="stat-value">{groupStats.totalSteps.toLocaleString()}</div>
                    <p style={{ color: 'var(--text-muted)' }}>of {groupStats.teamGoal.toLocaleString()} steps</p>

                    <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                {/* Days Remaining */}
                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Flame size={20} className="stat-accent" style={{ color: 'var(--accent)' }} />
                        <span>Challenge Tracker</span>
                    </div>
                    <div className="stat-value">{groupStats.daysRemaining} Days</div>
                    <p style={{ color: 'var(--text-muted)' }}>Left to reach the team goal!</p>
                </div>
            </div>
        </div>
    );
}
