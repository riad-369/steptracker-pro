import { GroupStats, UserStats } from '../types';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, TrendingUp, Trophy, ArrowUpRight, ArrowDownRight, Activity, Zap } from 'lucide-react';

interface Props {
    stats: GroupStats;
    users: UserStats[];
}

export default function GroupAnalytics({ stats, users }: Props) {
    // Helper to calculate variance
    const calcVariance = (history: { steps: number }[]) => {
        const mean = history.reduce((sum, entry) => sum + entry.steps, 0) / history.length;
        const squareDiffs = history.map(entry => {
            const diff = entry.steps - mean;
            return diff * diff;
        });
        return Math.sqrt(squareDiffs.reduce((sum, sq) => sum + sq, 0) / history.length);
    };

    // Helper for 7-day rolling average
    const calculateRollingAverage = (users: UserStats[], days: number = 7) => {
        return users[0].history.map((_, i) => {
            const dataPoint: any = { date: users[0].history[i].date };
            users.forEach((u, index) => {
                let sum = 0;
                let count = 0;
                for (let j = Math.max(0, i - days + 1); j <= i; j++) {
                    sum += u.history[j].steps;
                    count++;
                }
                dataPoint[`User${index}`] = Math.round(sum / count);
            });
            return dataPoint;
        });
    };

    // Aggregate daily steps across all users, for main chart
    const last7DaysIndexStart = 7;
    const aggregatedData = users[0].history.slice(last7DaysIndexStart, 14).map((_, i) => {
        const dataPoint: any = { date: users[0].history[last7DaysIndexStart + i].date };
        let dailyTotal = 0;
        users.forEach((u, index) => {
            dataPoint[`User${index}`] = u.history[last7DaysIndexStart + i].steps;
            dailyTotal += u.history[last7DaysIndexStart + i].steps;
        });
        dataPoint.total = dailyTotal;
        return dataPoint;
    });

    const mostImprovedUser = [...users].sort((a, b) => b.improvementPercentage - a.improvementPercentage)[0];

    // Consistency Kings logic
    const usersWithVariance = users.map(u => ({ ...u, variance: calcVariance(u.history) }));
    const sortedByVariance = [...usersWithVariance].sort((a, b) => a.variance - b.variance);
    const mostConsistent = sortedByVariance[0];
    const weekendWarrior = sortedByVariance[sortedByVariance.length - 1]; // Highest variance

    const rollingAvgData = calculateRollingAverage(users);

    const colors = ['#8b5cf6', '#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#06b6d4'];

    return (
        <div className="glass-panel" style={{ animation: 'fadeIn 0.5s ease-out backwards' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <Users size={28} color="var(--primary)" />
                <h2>Team Analytics Overview</h2>
            </div>

            <div className="dashboard-grid">
                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <TrendingUp size={20} className="stat-accent" />
                        <span>Average Daily Steps</span>
                    </div>
                    <div className="stat-value">
                        {Math.round(stats.totalSteps / users.length / 14).toLocaleString()}
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>steps per person</p>
                </div>

                <div className="glass-panel stat-card" style={{ border: '1px solid var(--primary)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)' }}>
                    <div className="stat-header">
                        <Trophy size={20} color="var(--primary)" />
                        <span>Most Improved</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                        <img src={mostImprovedUser.avatar} alt={mostImprovedUser.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{mostImprovedUser.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', color: mostImprovedUser.improvementPercentage >= 0 ? 'var(--secondary)' : 'var(--accent)', fontWeight: 'bold' }}>
                                {mostImprovedUser.improvementPercentage >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                {Math.abs(mostImprovedUser.improvementPercentage)}% vs last week
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Activity size={20} color="var(--secondary)" />
                        <span>Most Consistent</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                        <img src={mostConsistent.avatar} alt={mostConsistent.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{mostConsistent.name}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Rock solid pace</div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel stat-card">
                    <div className="stat-header">
                        <Zap size={20} color="var(--accent)" />
                        <span>Weekend Warrior</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                        <img src={weekendWarrior.avatar} alt={weekendWarrior.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                        <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weekendWarrior.name}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Highest Variance</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '48px' }}>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>7-Day Rolling Average Trend</h3>
                <div className="chart-container glass-panel">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rollingAvgData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                            <XAxis dataKey="date" stroke="var(--text-muted)" tickMargin={10} minTickGap={30} />
                            <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            {users.map((user, index) => (
                                <Line
                                    key={user.id}
                                    type="monotone"
                                    dataKey={`User${index}`}
                                    name={user.name}
                                    stroke={colors[index]}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ marginTop: '48px' }}>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Participant Breakdown (Last 7 Days)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {users.map((user, idx) => (
                        <div key={user.id} className="glass-panel" style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors[idx] }} />
                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{user.name}</span>
                            </div>
                            <div style={{ height: '60px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={user.history.slice(7, 14)}>
                                        <Bar dataKey="steps" fill={colors[idx]} radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '48px' }}>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>Combined Team Activity (Last 7 Days)</h3>
                <div className="chart-container glass-panel">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={aggregatedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                {colors.map((color, idx) => (
                                    <linearGradient key={`colorU${idx}`} id={`colorU${idx}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                            <XAxis dataKey="date" stroke="var(--text-muted)" tickMargin={10} />
                            <YAxis stroke="var(--text-muted)" tickFormatter={(value) => `${value / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            {users.map((user, index) => (
                                <Area
                                    key={user.id}
                                    type="monotone"
                                    dataKey={`User${index}`}
                                    name={user.name}
                                    stackId="1"
                                    stroke={colors[index]}
                                    fill={`url(#colorU${index})`}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
