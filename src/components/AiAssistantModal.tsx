import React, { useState } from 'react';
import { Priority, Task } from '../types';
import { Sparkles, X, Check, Loader2, Bot, Plus } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Omit<Task, 'id' | 'createdAt'>[]) => void;
  onAddReward: (title: string, description: string, pointsCost: number, icon: string, category: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
  onAddReward,
}) => {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'tasks' | 'rewards'>('tasks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedTasks, setGeneratedTasks] = useState<Array<{
    title: string;
    description: string;
    priority: Priority;
    points: number;
    category: string;
  }>>([]);

  const [generatedRewards, setGeneratedRewards] = useState<Array<{
    title: string;
    description: string;
    pointsCost: number;
    icon: string;
    category: string;
  }>>([]);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setGeneratedTasks([]);
    setGeneratedRewards([]);

    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type: mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get AI suggestions');
      }

      // Parse AI response
      const rawText = data.result || '';
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (mode === 'tasks') {
          setGeneratedTasks(parsed);
        } else {
          setGeneratedRewards(parsed);
        }
      } else {
        // Fallback simple parsing
        if (mode === 'tasks') {
          setGeneratedTasks([
            {
              title: `Action: ${prompt}`,
              description: 'Generated smart breakdown',
              priority: 'high',
              points: 50,
              category: 'Work',
            }
          ]);
        }
      }
    } catch (err: unknown) {
      console.warn('AI Endpoint fallback:', err);
      // Smart Fallback generator if API Key is not set yet
      if (mode === 'tasks') {
        setGeneratedTasks([
          {
            title: `Step 1: Research & outline for ${prompt}`,
            description: 'Break down goals into smaller key deliverables',
            priority: 'medium',
            points: 25,
            category: 'Work',
          },
          {
            title: `Step 2: Draft core execution strategy`,
            description: 'Focus on high impact priorities',
            priority: 'high',
            points: 50,
            category: 'Work',
          },
          {
            title: `Step 3: Final review & polish`,
            description: 'Ensure quality standards are met',
            priority: 'low',
            points: 10,
            category: 'Work',
          }
        ]);
      } else {
        setGeneratedRewards([
          {
            title: '30-Min Gaming or Show Break',
            description: 'Guilt-free relaxation after finishing tasks',
            pointsCost: 150,
            icon: '🎮',
            category: 'Entertainment',
          },
          {
            title: 'Special Specialty Coffee Treat',
            description: 'Enjoy a premium coffee from your favorite cafe',
            pointsCost: 200,
            icon: '☕',
            category: 'Lifestyle',
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImportTasks = () => {
    const tasksToAdd = generatedTasks.map((t) => ({
      title: t.title,
      description: t.description,
      priority: t.priority || 'medium',
      points: t.points || 25,
      category: t.category || 'Work',
      completed: false,
      subtasks: [],
    }));

    onAddTasks(tasksToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#16161e] border border-[#2c2c3e] rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">AI Studio Assistant</h3>
            <p className="text-xs text-zinc-400">Break down big goals into tasks or get reward ideas</p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-[#101016] p-1 rounded-xl border border-[#242432]">
          <button
            type="button"
            onClick={() => setMode('tasks')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'tasks' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400'
            }`}
          >
            Generate Tasks Breakdown
          </button>
          <button
            type="button"
            onClick={() => setMode('rewards')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'rewards' ? 'bg-amber-600 text-white shadow' : 'text-zinc-400'
            }`}
          >
            Generate Reward Ideas
          </button>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <textarea
            rows={3}
            placeholder={
              mode === 'tasks'
                ? "Describe your goal (e.g., 'Learn React and build a portfolio app' or 'Prepare for marathon')"
                : "Describe your hobbies/interests (e.g., 'I love gaming, coffee, books, and weekend hikes')"
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-[#1b1b26] border border-[#28283a] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{loading ? 'AI Thinking...' : 'Generate with Gemini'}</span>
          </button>
        </form>

        {/* Generated Results */}
        {generatedTasks.length > 0 && (
          <div className="space-y-2 pt-2 max-h-52 overflow-y-auto">
            <div className="text-xs font-medium text-zinc-300">Generated Subtasks:</div>
            {generatedTasks.map((t, idx) => (
              <div key={idx} className="bg-[#1f1f2c] p-2.5 rounded-xl text-xs space-y-1 border border-[#2b2b3c]">
                <div className="flex justify-between font-semibold text-white">
                  <span>{t.title}</span>
                  <span className="text-indigo-400 font-number">+{t.points} PTS</span>
                </div>
                <p className="text-[11px] text-zinc-400">{t.description}</p>
              </div>
            ))}
            <button
              onClick={handleImportTasks}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold mt-2"
            >
              Import Tasks to Dashboard
            </button>
          </div>
        )}

        {generatedRewards.length > 0 && (
          <div className="space-y-2 pt-2 max-h-52 overflow-y-auto">
            <div className="text-xs font-medium text-zinc-300">Generated Reward Ideas:</div>
            {generatedRewards.map((r, idx) => (
              <div key={idx} className="bg-[#1f1f2c] p-2.5 rounded-xl text-xs flex items-center justify-between border border-[#2b2b3c]">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{r.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{r.title}</div>
                    <div className="text-[10px] text-zinc-400">{r.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onAddReward(r.title, r.description, r.pointsCost, r.icon, r.category);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-amber-500 text-black text-[11px] font-bold rounded-lg hover:bg-amber-400"
                >
                  Add ({r.pointsCost} PTS)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
