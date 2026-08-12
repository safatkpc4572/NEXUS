import React from 'react';
import { RedemptionRecord, Task, UserStats } from '../types';
import { History, Award, Gift, CheckCircle2, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

interface HistoryLogProps {
  tasks: Task[];
  history: RedemptionRecord[];
  stats: UserStats;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ tasks, history, stats }) => {
  const completedTasks = tasks.filter((t) => t.completed && t.completedAt);

  // Combine completions and redemptions into unified timeline
  const timeline = [
    ...completedTasks.map((t) => ({
      id: `task-item-${t.id}`,
      type: 'task' as const,
      title: t.title,
      points: t.points,
      timestamp: t.completedAt || t.createdAt,
      category: t.category,
      icon: '✅',
    })),
    ...history.map((h) => ({
      id: `history-item-${h.id}`,
      type: 'redemption' as const,
      title: h.rewardTitle,
      points: -h.pointsSpent,
      timestamp: h.redeemedAt,
      category: 'Reward Claimed',
      icon: h.icon || '🎁',
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      {/* Activity Summary Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#141418] border border-[#22222a] rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium uppercase">Total Points Earned</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-number">
            +{stats.totalPointsEarned} PTS
          </div>
        </div>

        <div className="bg-[#141418] border border-[#22222a] rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium uppercase">Total Rewards Unlocked</span>
            <Gift className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-number">
            {history.length} Claimed
          </div>
        </div>

        <div className="bg-[#141418] border border-[#22222a] rounded-2xl p-4">
          <div className="flex items-center justify-between text-zinc-400 mb-1">
            <span className="text-xs font-medium uppercase">Level Rank</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 font-number">
            Level {stats.level}
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-[#141418] border border-[#22222a] rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#22222a]">
          <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
            <History className="w-4 h-4 text-indigo-400" />
            <span>Activity & Points Timeline</span>
          </h3>
          <span className="text-xs text-zinc-400 font-number">
            {timeline.length} Total Events
          </span>
        </div>

        {timeline.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No activity logged yet. Complete tasks or unlock rewards to see your timeline!
          </div>
        ) : (
          <div className="space-y-3">
            {timeline.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a22] border border-[#242432] rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#22222e] flex items-center justify-center text-sm shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-200">{item.title}</div>
                    <div className="text-[10px] text-zinc-400 flex items-center space-x-2 mt-0.5">
                      <span className="px-1.5 py-0.2 rounded bg-[#262634] text-zinc-300">{item.category}</span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>

                <div className={`font-bold text-sm font-number ${item.points > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {item.points > 0 ? `+${item.points}` : item.points} PTS
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
