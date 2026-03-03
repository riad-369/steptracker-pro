export interface StepEntry {
  date: string; // ISO format YYYY-MM-DD
  steps: number;
}

export interface UserStats {
  id: string;
  name: string;
  avatar: string;
  totalSteps: number;
  points: number;
  improvementPercentage: number;
  history: StepEntry[];
}

export interface GroupStats {
  totalSteps: number;
  teamGoal: number;
  daysRemaining: number;
}
