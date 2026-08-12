import React from 'react';
import { Reward, Task, UserStats } from '../types';
import { Award, CheckCircle2, FileText, Gift, Flame, TrendingUp } from 'lucide-react';

interface HeaderStatsProps {
  stats: UserStats;
  tasks: Task[];
  notesCount: number;
  rewards: Reward[];
  onSelectRewardTab: () => void;
  onSelectTaskTab: () => void;
  onSelectNoteTab: () => void;
}

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  stats,
  tasks,
  notesCount,
  rewards,
  onSelectRewardTab,
  onSelectTaskTab,
  onSelectNoteTab,
}) => {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Next reward target calculation
  const affordableRewards = rewards.filter((r) => r.pointsCost <= stats.pointsBalance);
  const nextTargetReward = rewards
    .filter((r) => r.pointsCost > stats.pointsBalance)
    .sort((a, b) => a.pointsCost - b.pointsCost)[0] || rewards[0];

  const targetProgress = nextTargetReward
    ? Math.min(100, Math.round((stats.pointsBalance / nextTargetReward.pointsCost) * 100))
    : 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Points Balance */}
      <div className="bg-[#141418] border border-[#22222a] hover:border-[#333342] transition-all rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Award className="w-16 h-16 text-indigo-400" />
        </div>
        <div>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Points Balance</span>
            <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-number tracking-tight">
              {stats.pointsBalance}
            </span>
            <span className="text-xs font-semibold text-indigo-400 font-number uppercase">PTS</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#22222a] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Total Earned: <strong className="text-zinc-200 font-number">{stats.totalPointsEarned}</strong></span>
          <span className="text-emerald-400 font-number flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Lvl {stats.level}</span>
          </span>
        </div>
      </div>

      {/* Card 2: Task Completion */}
      <div 
        onClick={onSelectTaskTab}
        className="bg-[#141418] border border-[#22222a] hover:border-[#333342] transition-all rounded-2xl p-4 flex flex-col justify-between shadow-sm cursor-pointer relative overflow-hidden group"
      >
        <div>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Tasks Done</span>
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-number tracking-tight">
              {completedTasks}<span className="text-zinc-600 text-xl font-normal">/{totalTasks}</span>
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-number">
              {taskPercent}%
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#22222a] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Streak</span>
          <span className="text-amber-400 font-semibold font-number flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
            <span>{stats.currentStreak} Days</span>
          </span>
        </div>
      </div>

      {/* Card 3: Notes Summary */}
      <div 
        onClick={onSelectNoteTab}
        className="bg-[#141418] border border-[#22222a] hover:border-[#333342] transition-all rounded-2xl p-4 flex flex-col justify-between shadow-sm cursor-pointer relative overflow-hidden group"
      >
        <div>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Active Notes</span>
            <span className="p-1.5 bg-violet-500/10 text-violet-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-number tracking-tight">
              {notesCount}
            </span>
            <span className="text-xs text-zinc-400 font-medium">Saved Items</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[#22222a] flex items-center justify-between text-[11px] text-zinc-400">
          <span>Organized & Pinned</span>
          <span className="text-violet-400 font-semibold font-number flex items-center space-x-1">
            <span>View Notes</span>
            <span>→</span>
          </span>
        </div>
      </div>

      {/* Card 4: Reward Milestones */}
      <div 
        onClick={onSelectRewardTab}
        className="bg-[#141418] border border-[#22222a] hover:border-[#333342] transition-all rounded-2xl p-4 flex flex-col justify-between shadow-sm cursor-pointer relative overflow-hidden group"
      >
        <div>
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Rewards</span>
            <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Gift className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-bold text-white font-number tracking-tight">
                {affordableRewards.length}
              </span>
              <span className="text-xs text-amber-400 font-medium">Ready to Unlock</span>
            </div>
            {nextTargetReward && (
              <span className="text-lg">{nextTargetReward.icon}</span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#22222a] space-y-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span className="truncate max-w-[130px] text-zinc-300 font-medium">Target: {nextTargetReward?.title}</span>
            <span className="font-number font-semibold text-amber-400">{targetProgress}%</span>
          </div>
          <div className="w-full bg-[#242432] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${targetProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
