export type Priority = 'low' | 'medium' | 'high' | 'epic';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  points: number; // e.g. low=10, medium=25, high=50, epic=100
  category: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  subtasks: SubTask[];
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string; // Emoji or Lucide icon name
  category: string;
  unlockedCount: number;
  createdAt: string;
}

export interface RedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  redeemedAt: string;
  icon: string;
}

export interface UserStats {
  pointsBalance: number;
  totalPointsEarned: number;
  totalTasksCompleted: number;
  currentStreak: number;
  lastActiveDate: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'notes' | 'rewards' | 'history';
