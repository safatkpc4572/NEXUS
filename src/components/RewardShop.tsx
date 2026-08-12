import React, { useState } from 'react';
import { RedemptionRecord, Reward, UserStats } from '../types';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Gift, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Trash2, 
  Edit3,
  X,
  Award
} from 'lucide-react';

interface RewardShopProps {
  rewards: Reward[];
  stats: UserStats;
  onAddReward: (reward: Omit<Reward, 'id' | 'createdAt' | 'unlockedCount'>) => void;
  onRedeemReward: (reward: Reward) => void;
  onDeleteReward: (rewardId: string) => void;
  onUpdateReward?: (reward: Reward) => void;
  isCompact?: boolean;
  isDashboard?: boolean;
  autoOpenAdd?: boolean;
  onResetAutoOpen?: () => void;
  onNavigateAndAdd?: () => void;
}

export const RewardShop: React.FC<RewardShopProps> = ({
  rewards,
  stats,
  onAddReward,
  onRedeemReward,
  onDeleteReward,
  onUpdateReward,
  isCompact = false,
  isDashboard = false,
  autoOpenAdd = false,
  onResetAutoOpen,
  onNavigateAndAdd,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [unlockedReward, setUnlockedReward] = useState<Reward | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pointsCost, setPointsCost] = useState<number>(150);
  const [icon, setIcon] = useState('☕');
  const [category, setCategory] = useState('Lifestyle');

  const emojiOptions = ['☕', '🎮', '🍿', '🎧', '🍕', '✈️', '📚', '🎬', '🚴', '🎁', '🍔', '🎨', '🏆', '💎'];

  const openCreateModal = () => {
    setEditingReward(null);
    setTitle('');
    setDescription('');
    setPointsCost(150);
    setIcon('☕');
    setCategory('Lifestyle');
    setIsAdding(true);
    sound.playClick();
  };

  React.useEffect(() => {
    if (autoOpenAdd) {
      openCreateModal();
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenAdd, onResetAutoOpen]);

  const openEditModal = (reward: Reward) => {
    setEditingReward(reward);
    setTitle(reward.title);
    setDescription(reward.description);
    setPointsCost(reward.pointsCost);
    setIcon(reward.icon);
    setCategory(reward.category);
    setIsAdding(true);
    sound.playClick();
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingReward && onUpdateReward) {
      onUpdateReward({
        ...editingReward,
        title: title.trim(),
        description: description.trim() || 'Custom user milestone reward',
        pointsCost: Math.max(10, pointsCost),
        icon: icon.trim() || '🎁',
        category,
      });
    } else {
      onAddReward({
        title: title.trim(),
        description: description.trim() || 'Custom user milestone reward',
        pointsCost: Math.max(10, pointsCost),
        icon: icon.trim() || '🎁',
        category,
      });
    }

    setTitle('');
    setDescription('');
    setPointsCost(150);
    setIcon('☕');
    setEditingReward(null);
    setIsAdding(false);
    sound.playClick();
  };

  const handleClaimReward = (reward: Reward) => {
    if (stats.pointsBalance < reward.pointsCost) return;

    // Trigger celebration fanfare and confetti!
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#34d399', '#818cf8', '#f472b6']
    });
    sound.playRewardUnlocked();

    onRedeemReward(reward);
    setUnlockedReward(reward);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner - Hidden when on Dashboard view */}
      {!isDashboard && (
        <div className={`bg-gradient-to-r from-[#181822] via-[#1c1c28] to-[#161620] border border-[#272736] rounded-2xl p-4 flex ${isCompact ? 'flex-col gap-3' : 'flex-col sm:flex-row items-start sm:items-center justify-between gap-3'}`}>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Gift className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white tracking-tight">Gamified Reward Shop</h2>
            </div>
            {!isCompact && (
              <p className="text-xs text-zinc-400">
                Set custom rewards for your hard work! Earn points by completing tasks and unlock real-world treats.
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-[#101014] border border-[#272736] px-3 py-1.5 rounded-xl text-right">
              <div className="text-[9px] text-zinc-400 uppercase font-medium">Balance</div>
              <div className="text-xs font-bold text-amber-400 font-number">
                {stats.pointsBalance} PTS
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/10 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Set Custom Reward</span>
            </button>
          </div>
        </div>
      )}

      {/* Set / Edit Custom Reward Overlay Modal (Prevents UI squeezing in columns) */}
      {!isDashboard && isAdding && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <form 
            onSubmit={handleSaveReward} 
            className="bg-[#16161c] border border-amber-500/40 rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#242432]">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingReward ? 'Edit Custom Reward' : 'Create Custom Reward'}
                  </h3>
                  <p className="text-[11px] text-zinc-400">Define personal treats & set target points</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingReward(null);
                }}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Reward Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 Hour Gaming Session, Cold Brew Coffee, Movie Night"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Guilt-free relaxation treat after finishing weekly goals"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Point Cost (PTS) *</label>
                  <input
                    type="number"
                    min={10}
                    step={10}
                    required
                    value={pointsCost}
                    onChange={(e) => setPointsCost(Number(e.target.value))}
                    className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-amber-400 font-number font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Tech & Gear">Tech & Gear</option>
                    <option value="Food & Treats">Food & Treats</option>
                    <option value="Travel">Travel</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              {/* Icon & Emoji Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-zinc-300">Choose Icon or Type Custom Emoji</label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="Type emoji..."
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-20 bg-[#1e1e28] border border-[#2a2a3a] rounded-lg px-2 py-0.5 text-xs text-center text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {emojiOptions.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setIcon(e)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                        icon === e 
                          ? 'bg-amber-500/20 border border-amber-500 scale-110 shadow-sm' 
                          : 'bg-[#1e1e28] border border-transparent hover:bg-[#282838]'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-[#242432]">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingReward(null);
                }}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 bg-[#1e1e28]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20"
              >
                {editingReward ? 'Update Reward' : 'Add Custom Reward'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reward Cards Grid */}
      <div className={`grid grid-cols-1 ${isCompact ? '' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
        {rewards.length === 0 ? (
          <div className="col-span-full bg-[#141418] border border-[#22222a] rounded-2xl p-8 text-center space-y-3">
            <Gift className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-300">No rewards set yet</h4>
            <p className="text-xs text-zinc-500">Create custom treats to redeem with your earned points!</p>
            {isDashboard && onNavigateAndAdd ? (
              <button
                onClick={onNavigateAndAdd}
                className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set First Reward</span>
              </button>
            ) : (
              <button
                onClick={openCreateModal}
                className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Set First Reward</span>
              </button>
            )}
          </div>
        ) : (
          rewards.map((reward) => {
          const canAfford = stats.pointsBalance >= reward.pointsCost;
          const progressPercent = Math.min(100, Math.round((stats.pointsBalance / reward.pointsCost) * 100));
          const ptsNeeded = Math.max(0, reward.pointsCost - stats.pointsBalance);

          return (
            <div
              key={reward.id}
              className={`
                bg-[#141418] border rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 relative group overflow-hidden
                ${canAfford ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-[#22222a] opacity-90'}
              `}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#1d1d26] border border-[#2a2a38] flex items-center justify-center text-xl shadow-inner shrink-0">
                    {reward.icon}
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1e1e28] text-zinc-400 mr-1">
                      {reward.category}
                    </span>

                    {onUpdateReward && (
                      <button
                        onClick={() => openEditModal(reward)}
                        className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-lg hover:bg-[#1f1f2a]"
                        title="Edit reward"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteReward(reward.id)}
                      className="text-zinc-600 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
                      title="Delete reward"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white tracking-tight leading-tight">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                    {reward.description}
                  </p>
                </div>

                {/* Point Cost & Unlocked Count */}
                <div className="flex items-center justify-between pt-2 border-t border-[#22222a]">
                  <div className="text-xs font-semibold text-amber-400 font-number">
                    {reward.pointsCost} PTS
                  </div>
                  {reward.unlockedCount > 0 && (
                    <div className="text-[10px] font-medium text-emerald-400 flex items-center space-x-1 font-number">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked {reward.unlockedCount}x</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar towards points */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-number">
                    <span>Progress</span>
                    <span>{stats.pointsBalance} / {reward.pointsCost} PTS ({progressPercent}%)</span>
                  </div>
                  <div className="w-full bg-[#20202b] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        canAfford 
                          ? 'bg-gradient-to-r from-amber-500 to-emerald-400' 
                          : 'bg-indigo-500/60'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Redeem Button */}
              <div className="pt-4 mt-2">
                <button
                  onClick={() => handleClaimReward(reward)}
                  disabled={!canAfford}
                  className={`
                    w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all
                    ${canAfford
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:brightness-110 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
                      : 'bg-[#1e1e28] text-zinc-500 border border-[#2a2a38] cursor-not-allowed'
                    }
                  `}
                >
                  {canAfford ? (
                    <>
                      <Sparkles className="w-4 h-4 fill-black/20" />
                      <span>Unlock & Claim Reward</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Need {ptsNeeded} PTS More</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        }))}
      </div>

      {/* Reward Unlock Celebration Modal */}
      {unlockedReward && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-[#181822] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-amber-500/20">
              {unlockedReward.icon}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Reward Unlocked! 🎉
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {unlockedReward.title}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {unlockedReward.description}
              </p>
            </div>

            <div className="bg-[#121218] border border-[#242432] rounded-xl p-3 text-xs text-zinc-300 font-number space-y-1">
              <div className="flex justify-between">
                <span>Points Spent:</span>
                <span className="text-amber-400 font-bold">-{unlockedReward.pointsCost} PTS</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Remaining Balance:</span>
                <span>{stats.pointsBalance} PTS</span>
              </div>
            </div>

            <button
              onClick={() => setUnlockedReward(null)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs rounded-xl hover:brightness-110 shadow-lg shadow-amber-500/20"
            >
              Enjoy Your Reward!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

