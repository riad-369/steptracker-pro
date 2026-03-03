import { UserStats, GroupStats, StepEntry } from '../types';

const generateStepData = (baseSteps: number, variance: number): StepEntry[] => {
    const data: StepEntry[] = [];
    const start = new Date('2026-01-12T12:00:00Z');
    const end = new Date('2026-03-03T12:00:00Z');

    // Calculate total days between start and end
    const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Base increment to simulate consistent effort and some randomness
    for (let i = 0; i < totalDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const steps = Math.max(1000, Math.floor(baseSteps + (Math.random() * variance * 2 - variance)));
        data.push({
            date: d.toISOString().split('T')[0],
            steps
        });
    }
    return data;
};

const calculateInitialStats = (baseSteps: number, variance: number) => {
    const history = generateStepData(baseSteps, variance);
    const totalSteps = history.reduce((sum, entry) => sum + entry.steps, 0);
    const points = Math.floor(totalSteps / 1000);

    // Calculate improvement percentage vs last week (last 14 days vs previous 14 days if we have them, else just use standard 7-day windows)
    const last14 = history.slice(-14);
    const week1Steps = last14.slice(0, 7).reduce((sum, entry) => sum + entry.steps, 0);
    const week2Steps = last14.slice(7, 14).reduce((sum, entry) => sum + entry.steps, 0);
    const improvementPercentage = Math.round(((week2Steps - week1Steps) / week1Steps) * 100) || 0;

    return { history, totalSteps, points, improvementPercentage };
};

const names = ['Riad', 'Keith (1)', 'Victoria', 'Keith (2)', 'Leigeme', 'Derek'];

export const mockUsers: UserStats[] = names.map((name, idx) => {
    const baseSteps = Math.floor(Math.random() * 5000) + 5000; // 5k to 10k base
    const variance = 2000; // +/- 2000
    const stats = calculateInitialStats(baseSteps, variance);

    return {
        id: `user-${idx}`,
        name,
        avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`,
        ...stats
    };
});

const teamTotal = mockUsers.reduce((sum, user) => sum + user.totalSteps, 0);

const calculateDaysRemaining = () => {
    const end = new Date('2026-03-31T23:59:59Z');
    const today = new Date('2026-03-03T12:00:00Z');
    return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
};

export const mockGroupStats: GroupStats = {
    totalSteps: teamTotal,
    teamGoal: 2000000, // 2 Million
    daysRemaining: calculateDaysRemaining(),
};
