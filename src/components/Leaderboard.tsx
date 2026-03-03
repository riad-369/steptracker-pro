import { UserStats } from '../types';
import { Trophy, Medal, Star } from 'lucide-react';

interface Props {
    users: UserStats[];
    onSelectUser: (id: string) => void;
}

export default function Leaderboard({ users, onSelectUser }: Props) {
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy size={20} color="#fbbf24" />;
            case 1: return <Medal size={20} color="#cbd5e1" />;
            case 2: return <Medal size={20} color="#b45309" />;
            default: return <span>{index + 1}</span>;
        }
    };

    return (
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Star size={28} color="var(--primary)" />
                <h2>Team Leaderboard</h2>
            </div>

            <div className="leaderboard-list">
                {sortedUsers.map((user, index) => (
                    <div
                        key={user.id}
                        className={`leaderboard-item rank-${index + 1} ${index === 0 ? 'first-place-glow' : ''}`}
                        onClick={() => onSelectUser(user.id)}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            animation: 'fadeIn 0.5s ease-out backwards',
                            ...(index === 0 ? { border: '2px solid var(--primary)', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)', transform: 'scale(1.02)' } : {})
                        }}
                    >
                        <div className="rank-badge">
                            {getRankIcon(index)}
                        </div>
                        <div className="user-info">
                            <img src={user.avatar} alt={user.name} className="avatar" />
                            <div className="user-details">
                                <h3>{user.name}</h3>
                                <p>{user.totalSteps.toLocaleString()} Total Steps</p>
                            </div>
                        </div>
                        <div className="points-display">
                            <div className="points-val">{user.points.toLocaleString()}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
