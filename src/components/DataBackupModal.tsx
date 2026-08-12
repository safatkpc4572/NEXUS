import React, { useState, useRef } from 'react';
import { Note, RedemptionRecord, Reward, Task, UserStats } from '../types';
import { INITIAL_HISTORY, INITIAL_NOTES, INITIAL_REWARDS, INITIAL_STATS, INITIAL_TASKS } from '../utils/storage';
import { Download, Upload, RefreshCw, X, Check, Database, ShieldCheck, FileJson, AlertCircle } from 'lucide-react';

interface BackupDataPackage {
  app: string;
  version: string;
  exportedAt: string;
  data: {
    tasks: Task[];
    notes: Note[];
    rewards: Reward[];
    stats: UserStats;
    history: RedemptionRecord[];
  };
}

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  notes: Note[];
  rewards: Reward[];
  stats: UserStats;
  history: RedemptionRecord[];
  onImportAll: (imported: {
    tasks: Task[];
    notes: Note[];
    rewards: Reward[];
    stats: UserStats;
    history: RedemptionRecord[];
  }) => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  tasks,
  notes,
  rewards,
  stats,
  history,
  onImportAll,
}) => {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Export to JSON File
  const handleExport = () => {
    try {
      const backupPackage: BackupDataPackage = {
        app: 'NEXUS Tasks & Rewards',
        version: '1.0',
        exportedAt: new Date().toISOString(),
        data: {
          tasks,
          notes,
          rewards,
          stats,
          history,
        },
      };

      const jsonStr = JSON.stringify(backupPackage, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const dateStr = new Date().toISOString().split('T')[0];
      const link = document.createElement('a');
      link.href = url;
      link.download = `nexus_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setNotification({
        type: 'success',
        message: 'Data backup file downloaded successfully!',
      });
    } catch (err) {
      console.error(err);
      setNotification({
        type: 'error',
        message: 'Failed to generate export file.',
      });
    }
  };

  // Handle Import from JSON File
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        // Flexible validation: check if backup format or direct arrays
        let importedTasks: Task[] = [];
        let importedNotes: Note[] = [];
        let importedRewards: Reward[] = [];
        let importedStats: UserStats = stats;
        let importedHistory: RedemptionRecord[] = [];

        if (parsed.data) {
          importedTasks = Array.isArray(parsed.data.tasks) ? parsed.data.tasks : tasks;
          importedNotes = Array.isArray(parsed.data.notes) ? parsed.data.notes : notes;
          importedRewards = Array.isArray(parsed.data.rewards) ? parsed.data.rewards : rewards;
          importedStats = parsed.data.stats || stats;
          importedHistory = Array.isArray(parsed.data.history) ? parsed.data.history : history;
        } else {
          // Direct fallback check
          if (Array.isArray(parsed.tasks)) importedTasks = parsed.tasks;
          if (Array.isArray(parsed.notes)) importedNotes = parsed.notes;
          if (Array.isArray(parsed.rewards)) importedRewards = parsed.rewards;
          if (parsed.stats) importedStats = parsed.stats;
          if (Array.isArray(parsed.history)) importedHistory = parsed.history;
        }

        onImportAll({
          tasks: importedTasks,
          notes: importedNotes,
          rewards: importedRewards,
          stats: importedStats,
          history: importedHistory,
        });

        setNotification({
          type: 'success',
          message: `Data restored! Loaded ${importedTasks.length} tasks, ${importedNotes.length} notes & ${importedRewards.length} rewards.`,
        });
      } catch (err) {
        console.error('Import error', err);
        setNotification({
          type: 'error',
          message: 'Invalid backup file format. Please upload a valid NEXUS JSON file.',
        });
      }
    };

    reader.readAsText(file);
    // Reset input value so same file can be re-uploaded if needed
    event.target.value = '';
  };

  // Handle Reset to Default Demo State
  const handleResetToDefaults = () => {
    onImportAll({
      tasks: INITIAL_TASKS,
      notes: INITIAL_NOTES,
      rewards: INITIAL_REWARDS,
      stats: INITIAL_STATS,
      history: INITIAL_HISTORY,
    });

    setConfirmReset(false);
    setNotification({
      type: 'success',
      message: 'Workspace reset to initial demo state.',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141418] border border-[#272736] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-[#181822] border-b border-[#242432] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Save, Export & Import Data</h2>
              <p className="text-[11px] text-zinc-400">Manage your task logs, points, notes & shop backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#252532] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Notification Alert */}
          {notification && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start space-x-2.5 animate-fade-in ${
                notification.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {notification.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{notification.message}</div>
              <button
                onClick={() => setNotification(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ×
              </button>
            </div>
          )}

          {/* Auto-Save Status Pill */}
          <div className="bg-[#1a1a24] border border-[#262636] p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-white">Browser Auto-Save Active</div>
                <div className="text-[10px] text-zinc-400">All changes are saved to local storage instantly</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Synced
            </span>
          </div>

          {/* Export / Import Main Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export Action Card */}
            <div className="bg-[#181822] border border-[#272736] hover:border-indigo-500/40 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all group">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Download className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">Export Data Backup</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Download a complete `.json` file containing all tasks, notes, points & rewards.
                </p>
              </div>

              <button
                onClick={handleExport}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/20 transition-all"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>Export JSON File</span>
              </button>
            </div>

            {/* Import Action Card */}
            <div className="bg-[#181822] border border-[#272736] hover:border-violet-500/40 p-4 rounded-xl flex flex-col justify-between space-y-3 transition-all group">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-white">Import / Restore Data</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Upload a previously saved `.json` backup file to restore your workspace.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".json,application/json"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-violet-600/20 transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Select JSON Backup</span>
              </button>
            </div>
          </div>

          {/* Reset Workspace Option */}
          <div className="pt-3 border-t border-[#222232] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-300">Restore Sample Defaults</div>
              <div className="text-[10px] text-zinc-500">Reset workspace back to original starter data</div>
            </div>

            {confirmReset ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetToDefaults}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition-colors"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 rounded-lg bg-[#252532] text-zinc-400 hover:text-white text-[11px] transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 rounded-xl border border-[#2b2b3a] bg-[#1a1a24] text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium flex items-center space-x-1 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Data</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#181822] border-t border-[#242432] text-center">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-xl bg-[#252532] hover:bg-[#2f2f40] text-zinc-300 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
