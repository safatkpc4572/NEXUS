import React, { useState, useEffect } from 'react';
import { ActiveTab, Note, RedemptionRecord, Reward, Task, UserStats } from './types';
import { Storage, calculateLevel, PRIORITY_POINTS } from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { HeaderStats } from './components/HeaderStats';
import { TaskManager } from './components/TaskManager';
import { NoteManager } from './components/NoteManager';
import { RewardShop } from './components/RewardShop';
import { HistoryLog } from './components/HistoryLog';
import { AiAssistantModal } from './components/AiAssistantModal';
import { DataBackupModal } from './components/DataBackupModal';
import { UserManualModal } from './components/UserManualModal';
import { Menu, Sparkles, Zap, Award, Gift, Plus, Database, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [stats, setStats] = useState<UserStats>(Storage.getStats());
  const [history, setHistory] = useState<RedemptionRecord[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-open creation forms when navigating from Dashboard
  const [autoOpenTaskAdd, setAutoOpenTaskAdd] = useState(false);
  const [autoOpenNoteAdd, setAutoOpenNoteAdd] = useState(false);
  const [autoOpenRewardAdd, setAutoOpenRewardAdd] = useState(false);

  const handleGoToTasksAndAdd = () => {
    setActiveTab('tasks');
    setAutoOpenTaskAdd(true);
  };

  const handleGoToNotesAndAdd = () => {
    setActiveTab('notes');
    setAutoOpenNoteAdd(true);
  };

  const handleGoToRewardsAndAdd = () => {
    setActiveTab('rewards');
    setAutoOpenRewardAdd(true);
  };

  // Load initial data
  useEffect(() => {
    setTasks(Storage.getTasks());
    setNotes(Storage.getNotes());
    setRewards(Storage.getRewards());
    setStats(Storage.getStats());
    setHistory(Storage.getHistory());
  }, []);

  // Save changes to storage
  useEffect(() => {
    Storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    Storage.saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    Storage.saveRewards(rewards);
  }, [rewards]);

  useEffect(() => {
    Storage.saveStats(stats);
  }, [stats]);

  useEffect(() => {
    Storage.saveHistory(history);
  }, [history]);

  // Task Handlers
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newlyCompleted = !task.completed;
          const pointsDelta = task.points;

          if (newlyCompleted) {
            // Update Stats for completion
            setStats((prev) => {
              const newTotalEarned = prev.totalPointsEarned + pointsDelta;
              const newBalance = prev.pointsBalance + pointsDelta;
              const newXp = prev.xp + pointsDelta;
              const levelInfo = calculateLevel(newXp);

              return {
                ...prev,
                pointsBalance: newBalance,
                totalPointsEarned: newTotalEarned,
                totalTasksCompleted: prev.totalTasksCompleted + 1,
                level: levelInfo.level,
                xp: levelInfo.xpInCurrentLevel,
                xpToNextLevel: levelInfo.xpForNextLevel,
              };
            });

            return {
              ...task,
              completed: true,
              completedAt: new Date().toISOString(),
            };
          } else {
            // Uncheck task (deduct points)
            setStats((prev) => ({
              ...prev,
              pointsBalance: Math.max(0, prev.pointsBalance - pointsDelta),
              totalTasksCompleted: Math.max(0, prev.totalTasksCompleted - 1),
            }));

            return {
              ...task,
              completed: false,
              completedAt: undefined,
            };
          }
        }
        return task;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return t;
      })
    );
  };

  // Note Handlers
  const handleAddNote = (newNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      ...newNoteData,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleTogglePinNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Reward Handlers
  const handleAddReward = (rewardData: Omit<Reward, 'id' | 'createdAt' | 'unlockedCount'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: `rew-${Date.now()}`,
      unlockedCount: 0,
      createdAt: new Date().toISOString(),
    };
    setRewards([newReward, ...rewards]);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (stats.pointsBalance < reward.pointsCost) return;

    // Deduct points
    setStats((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance - reward.pointsCost,
    }));

    // Update reward unlock count
    setRewards((prev) =>
      prev.map((r) => (r.id === reward.id ? { ...r, unlockedCount: r.unlockedCount + 1 } : r))
    );

    // Add to redemption history log
    const newRecord: RedemptionRecord = {
      id: `red-${Date.now()}`,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsSpent: reward.pointsCost,
      redeemedAt: new Date().toISOString(),
      icon: reward.icon,
    };
    setHistory([newRecord, ...history]);
  };

  const handleDeleteReward = (rewardId: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== rewardId));
  };

  const handleUpdateReward = (updatedReward: Reward) => {
    setRewards((prev) => prev.map((r) => (r.id === updatedReward.id ? updatedReward : r)));
  };

  const handleAiAddTasks = (newTasks: Omit<Task, 'id' | 'createdAt'>[]) => {
    const created: Task[] = newTasks.map((t, idx) => ({
      ...t,
      id: `task-ai-${Date.now()}-${idx}`,
      createdAt: new Date().toISOString(),
    }));
    setTasks([...created, ...tasks]);
  };

  return (
    <div className="min-h-screen bg-[#0d0d10] text-[#e4e4e7] flex flex-col lg:flex-row antialiased selection:bg-indigo-500/30">
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#121216] border-b border-[#22222a] p-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-[#1a1a22] text-zinc-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              N
            </div>
            <span className="font-semibold text-sm text-white">NEXUS</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsManualOpen(true)}
            className="p-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
            title="User Manual & Guide"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsBackupOpen(true)}
            className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
            title="Save / Backup Data"
          >
            <Database className="w-4 h-4" />
          </button>
          <div className="bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 font-number">
            {stats.pointsBalance} PTS
          </div>
          <button
            onClick={() => setIsAiOpen(true)}
            className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sidebar Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenManual={() => setIsManualOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main App Content Area */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full overflow-y-auto">
        {/* Top Header Bento Stats (Visible on All Main Pages) */}
        <HeaderStats
          stats={stats}
          tasks={tasks}
          notesCount={notes.length}
          rewards={rewards}
          onSelectRewardTab={() => setActiveTab('rewards')}
          onSelectTaskTab={() => setActiveTab('tasks')}
          onSelectNoteTab={() => setActiveTab('notes')}
        />

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Dashboard Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Tasks Manager */}
              <div className="lg:col-span-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Tasks & To-Dos</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleGoToTasksAndAdd}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Task</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('tasks')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <TaskManager
                  tasks={tasks.slice(0, 5)}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                  onToggleSubtask={handleToggleSubtask}
                  isDashboard={true}
                  onNavigateAndAdd={handleGoToTasksAndAdd}
                />
              </div>

              {/* Middle Column: Quick Notes Preview */}
              <div className="lg:col-span-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    <span>Notes & Ideas</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleGoToNotesAndAdd}
                      className="px-2.5 py-1 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Note</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('notes')}
                      className="text-xs text-violet-400 hover:text-violet-300 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <NoteManager
                  notes={notes.slice(0, 4)}
                  onAddNote={handleAddNote}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                  onTogglePinNote={handleTogglePinNote}
                  isDashboard={true}
                  onNavigateAndAdd={handleGoToNotesAndAdd}
                />
              </div>

              {/* Right Column: Reward Shop */}
              <div className="lg:col-span-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Reward Shop</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleGoToRewardsAndAdd}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Set Reward</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('rewards')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                    >
                      View All →
                    </button>
                  </div>
                </div>
                <RewardShop
                  rewards={rewards}
                  stats={stats}
                  onAddReward={handleAddReward}
                  onRedeemReward={handleRedeemReward}
                  onDeleteReward={handleDeleteReward}
                  onUpdateReward={handleUpdateReward}
                  isCompact={true}
                  isDashboard={true}
                  onNavigateAndAdd={handleGoToRewardsAndAdd}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Tasks & Goals</h2>
                <p className="text-xs text-zinc-400">Complete tasks to earn points and level up!</p>
              </div>
            </div>
            <TaskManager
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
              onToggleSubtask={handleToggleSubtask}
              autoOpenAdd={autoOpenTaskAdd}
              onResetAutoOpen={() => setAutoOpenTaskAdd(false)}
            />
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Notes & Ideas</h2>
                <p className="text-xs text-zinc-400">Organize your thoughts, study guides, and project specs.</p>
              </div>
            </div>
            <NoteManager
              notes={notes}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
              onTogglePinNote={handleTogglePinNote}
              autoOpenAdd={autoOpenNoteAdd}
              onResetAutoOpen={() => setAutoOpenNoteAdd(false)}
            />
          </div>
        )}

        {activeTab === 'rewards' && (
          <RewardShop
            rewards={rewards}
            stats={stats}
            onAddReward={handleAddReward}
            onRedeemReward={handleRedeemReward}
            onDeleteReward={handleDeleteReward}
            onUpdateReward={handleUpdateReward}
            autoOpenAdd={autoOpenRewardAdd}
            onResetAutoOpen={() => setAutoOpenRewardAdd(false)}
          />
        )}

        {activeTab === 'history' && (
          <HistoryLog
            tasks={tasks}
            history={history}
            stats={stats}
          />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onAddTasks={handleAiAddTasks}
        onAddReward={(title, description, pointsCost, icon, category) => {
          handleAddReward({ title, description, pointsCost, icon, category });
        }}
      />

      {/* Data Backup & Restore Modal */}
      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        tasks={tasks}
        notes={notes}
        rewards={rewards}
        stats={stats}
        history={history}
        onImportAll={({ tasks, notes, rewards, stats, history }) => {
          setTasks(tasks);
          setNotes(notes);
          setRewards(rewards);
          setStats(stats);
          setHistory(history);
        }}
      />

      {/* Interactive User Manual & Guide Modal */}
      <UserManualModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />
    </div>
  );
}
