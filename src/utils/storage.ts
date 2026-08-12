import { Note, RedemptionRecord, Reward, Task, UserStats } from '../types';

const STORAGE_KEYS = {
  TASKS: 'nexus_tasks_v1',
  NOTES: 'nexus_notes_v1',
  REWARDS: 'nexus_rewards_v1',
  STATS: 'nexus_stats_v1',
  HISTORY: 'nexus_history_v1',
};

// Priority to points mapping
export const PRIORITY_POINTS = {
  low: 10,
  medium: 25,
  high: 50,
  epic: 100,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design minimalist dashboard wireframe',
    description: 'Refine bento grid layout with crisp tabular numbers and dark aesthetic',
    priority: 'high',
    points: 50,
    category: 'Work',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    subtasks: [
      { id: 'sub-1', title: 'Color contrast check', completed: true },
      { id: 'sub-2', title: 'Bento grid responsive layout', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Complete 30-minute high intensity cardio',
    description: 'Keep heart rate in zone 3-4 and track steps',
    priority: 'high',
    points: 50,
    category: 'Health',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    subtasks: [
      { id: 'sub-3', title: 'Stretching routine', completed: true },
      { id: 'sub-4', title: 'Main cardio workout', completed: false }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Read 20 pages of Deep Work',
    description: 'Focus on rules for intense focus and eliminating digital distractions',
    priority: 'low',
    points: 10,
    category: 'Personal',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Prepare quarterly strategy deck',
    description: 'Draft key metrics, ROI analysis, and Q3 milestones for executive team',
    priority: 'epic',
    points: 100,
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    subtasks: [
      { id: 'sub-5', title: 'Outline key objectives', completed: false },
      { id: 'sub-6', title: 'Format slides with clean charts', completed: false }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Organize study notes for system architecture',
    description: 'Group notes by database design, cache layers, and microservices',
    priority: 'medium',
    points: 25,
    category: 'Study',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    subtasks: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Gamification & Dopamine Loops',
    content: `## Principles of Habit Building
1. **Immediate Feedback**: Awarding points instantly upon completing a task creates a clear dopamine reward loop.
2. **Custom Milestones**: Allowing custom real-world rewards (coffee, movies, trip) makes abstract productivity tangible.
3. **Clean Visual Hierarchy**: Minimalist UI with tabular numbers keeps focus high without cognitive clutter.`,
    category: 'Productivity',
    color: '#818cf8', // Indigo
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'note-2',
    title: 'Weekly Training & Fitness Schedule',
    content: `- **Monday**: Upper Body Strength + Core (45 mins)
- **Wednesday**: High Intensity Cardio (30 mins)
- **Friday**: Lower Body & Mobility (45 mins)
- **Sunday**: Rest & Recovery Walk (60 mins)`,
    category: 'Health',
    color: '#34d399', // Emerald
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note-3',
    title: 'Book List & Key Insights',
    content: `- *Atomic Habits* by James Clear: Focus on 1% daily improvements rather than lofty targets.
- *Deep Work* by Cal Newport: Schedule uninterrupted 90-minute blocks for high-value tasks.`,
    category: 'Personal',
    color: '#f472b6', // Pink
    isPinned: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew-1',
    title: '30-Min Gaming Session',
    description: 'Unwind with your favorite video game guilt-free.',
    pointsCost: 100,
    icon: '🎮',
    category: 'Entertainment',
    unlockedCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rew-2',
    title: 'Artisan Espresso Treat',
    description: 'Enjoy a specialty cold brew or cappuccino at your favorite cafe.',
    pointsCost: 150,
    icon: '☕',
    category: 'Lifestyle',
    unlockedCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rew-3',
    title: 'Movie Night & Snacks',
    description: 'Watch a movie or new series episode with gourmet popcorn.',
    pointsCost: 250,
    icon: '🍿',
    category: 'Entertainment',
    unlockedCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rew-4',
    title: 'New Wireless Headphones',
    description: 'Treat yourself to premium audio gear after reaching major milestone.',
    pointsCost: 800,
    icon: '🎧',
    category: 'Tech & Gear',
    unlockedCount: 0,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rew-5',
    title: 'Weekend Getaway Escapade',
    description: 'Full day trip or relaxing weekend retreat.',
    pointsCost: 1500,
    icon: '✈️',
    category: 'Travel',
    unlockedCount: 0,
    createdAt: new Date().toISOString(),
  }
];

export const INITIAL_STATS: UserStats = {
  pointsBalance: 175,
  totalPointsEarned: 250,
  totalTasksCompleted: 2,
  currentStreak: 4,
  lastActiveDate: new Date().toISOString().split('T')[0],
  level: 2,
  xp: 75,
  xpToNextLevel: 150,
};

export const INITIAL_HISTORY: RedemptionRecord[] = [
  {
    id: 'red-1',
    rewardId: 'rew-2',
    rewardTitle: 'Artisan Espresso Treat',
    pointsSpent: 150,
    redeemedAt: new Date(Date.now() - 86400000).toISOString(),
    icon: '☕',
  }
];

// Helper functions for LocalStorage
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (e) {
    console.error('Error loading from localStorage', e);
  }
  return fallback;
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export const Storage = {
  getTasks: (): Task[] => loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: Task[]): void => saveToStorage(STORAGE_KEYS.TASKS, tasks),

  getNotes: (): Note[] => loadFromStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES),
  saveNotes: (notes: Note[]): void => saveToStorage(STORAGE_KEYS.NOTES, notes),

  getRewards: (): Reward[] => loadFromStorage(STORAGE_KEYS.REWARDS, INITIAL_REWARDS),
  saveRewards: (rewards: Reward[]): void => saveToStorage(STORAGE_KEYS.REWARDS, rewards),

  getStats: (): UserStats => loadFromStorage(STORAGE_KEYS.STATS, INITIAL_STATS),
  saveStats: (stats: UserStats): void => saveToStorage(STORAGE_KEYS.STATS, stats),

  getHistory: (): RedemptionRecord[] => loadFromStorage(STORAGE_KEYS.HISTORY, INITIAL_HISTORY),
  saveHistory: (history: RedemptionRecord[]): void => saveToStorage(STORAGE_KEYS.HISTORY, history),
};

// Calculate level based on total XP
export function calculateLevel(totalXp: number): { level: number; xpInCurrentLevel: number; xpForNextLevel: number } {
  // Base XP curve: Level N requires N * 100 XP
  let level = 1;
  let xpRemaining = totalXp;
  let xpForNext = 100;

  while (xpRemaining >= xpForNext) {
    xpRemaining -= xpForNext;
    level++;
    xpForNext = level * 100;
  }

  return {
    level,
    xpInCurrentLevel: xpRemaining,
    xpForNextLevel: xpForNext,
  };
}
