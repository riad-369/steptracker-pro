import { UserStats, GroupStats } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Target, ArrowUpRight, ArrowDownRight, Flag, Compass } from 'lucide-react';

interface Props {
    user: UserStats;
    groupStats: GroupStats;
    allUsers: UserStats[];
}

export default function IndividualAnalytics({ user, groupStats, allUsers }: Props) {
    const chartData = [...user.history].slice(-7);
    const avgSteps = Math.round(user.totalSteps / user.history.length);
    const bestDay = [...user.history].sort((a, b) => b.steps - a.steps)[0];

    const teamContributionData = [
        { name: user.name, value: user.totalSteps },
        { name: 'Rest of Team', value: groupStats.totalSteps - user.totalSteps }
    ];

    // The Chase logic
    const sortedUsers = [...allUsers].sort((a, b) => b.points - a.points);
    const currentIndex = sortedUsers.findIndex(u => u.id === user.id);
    const userAhead = currentIndex > 0 ? sortedUsers[currentIndex - 1] : null;
    const userBehind = currentIndex < sortedUsers.length - 1 ? sortedUsers[currentIndex + 1] : null;

    // Projection logic based on last 14 days moving average
    const last14AvgSteps = Math.round(user.history.slice(-14).reduce((sum, entry) => sum + entry.steps, 0) / 14);
    const projectedExtraPoints = Math.floor((last14AvgSteps * groupStats.daysRemaining) / 1000);
    const projectedTotalPoints = user.points + projectedExtraPoints;

    return (
        <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease-out backwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px' }}>
                <img src={user.avatar} alt={user.name} className="avatar" style={{ width: '80px', height: '80px' }} />
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{user.name}'s Analytics</h2>
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={16} /> Rank Point: {user.points} pts</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} /> Total: {user.totalSteps.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Activity size={20} className="stat-accent" />
                        <span>Trend (vs Last Week)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '2rem', fontWeight: 'bold', color: user.improvementPercentage >= 0 ? 'var(--secondary)' : 'var(--accent)' }}>
                        {user.improvementPercentage >= 0 ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
                        {Math.abs(user.improvementPercentage)}%
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>improvement</p>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Activity size={20} className="stat-accent" />
                        <span>Average Daily</span>
                    </div>
                    <div className="stat-value">{avgSteps.toLocaleString()}</div>
                    <p style={{ color: 'var(--text-muted)' }}>steps/day</p>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Target size={20} className="stat-accent" />
                        <span>Personal Best</span>
                    </div>
                    <div className="stat-value">{bestDay.steps.toLocaleString()}</div>
                    <p style={{ color: 'var(--text-muted)' }}>on {bestDay.date}</p>
                </div>

                <div className="glass-panel stat-card" style={{ border: '1px solid var(--secondary)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                    <div className="stat-header">
                        <Compass size={20} color="var(--secondary)" />
                        <span>The Chase</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        {userAhead ? (
                            <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                                Trailing <strong style={{ color: 'var(--text-main)' }}>{userAhead.name}</strong> by <strong style={{ color: 'var(--accent)' }}>{userAhead.points - user.points} pts</strong>
                            </div>
                        ) : (
                            <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 'bold' }}>You are in 1st place!</div>
                        )}
                        {userBehind && (
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                Ahead of {userBehind.name} by {user.points - userBehind.points} pts
                            </div>
                        )}
                    </div>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Flag size={20} color="var(--primary)" />
                        <span>Projected Finish</span>
                    </div>
                    <div className="stat-value" style={{ color: 'var(--primary)' }}>{projectedTotalPoints.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>pts</span></div>
                    <p style={{ color: 'var(--text-muted)' }}>Based on current {last14AvgSteps.toLocaleString()} steps/day pacing.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '48px' }}>
                <div style={{ flex: '2 1 400px' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Activity History (Last 7 Days)</h3>
                    <div className="chart-container glass-panel">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--secondary)" stopOpacity={1} />
                                        <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-muted)" tickMargin={10} />
                                <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--secondary)' }}
                                    cursor={{ fill: 'var(--glass-bg)' }}
                                />
                                <Bar dataKey="steps" fill="url(#colorSteps)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Team Contribution</h3>
                    <div className="chart-container glass-panel" style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={teamContributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="var(--primary)" />
                                    <Cell fill="var(--glass-bg)" />
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                    formatter={(value: number | string | Array<number | string> | undefined) =>
                                        typeof value === 'number' ? value.toLocaleString() : value
                                    }
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {Math.round((user.totalSteps / groupStats.totalSteps) * 100)}%
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>of team total</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
