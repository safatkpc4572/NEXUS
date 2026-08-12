import React, { useState } from 'react';
import { Priority, Task } from '../types';
import { PRIORITY_POINTS } from '../utils/storage';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { 
  Plus, 
  Check, 
  Search, 
  Calendar, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Tag, 
  Clock, 
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (task: Task) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  isDashboard?: boolean;
  autoOpenAdd?: boolean;
  onResetAutoOpen?: () => void;
  onNavigateAndAdd?: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onUpdateTask,
  onToggleSubtask,
  isDashboard = false,
  autoOpenAdd = false,
  onResetAutoOpen,
  onNavigateAndAdd,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  React.useEffect(() => {
    if (autoOpenAdd) {
      setIsAdding(true);
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenAdd, onResetAutoOpen]);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const categories = ['All', 'Work', 'Health', 'Personal', 'Study', 'Fitness'];

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || t.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      points: PRIORITY_POINTS[priority],
      category,
      dueDate,
      completed: false,
      subtasks,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Work');
    setSubtasks([]);
    setIsAdding(false);
    sound.playClick();
  };

  const handleTaskCheck = (task: Task) => {
    if (!task.completed) {
      // Confetti & Chime sound for completing a task!
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#818cf8', '#34d399', '#f472b6', '#fbbf24']
      });
      sound.playTaskComplete();
    } else {
      sound.playClick();
    }
    onToggleTask(task.id);
  };

  const handleAddSubtaskItem = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false }
    ]);
    setNewSubtaskTitle('');
  };

  const priorityColors: Record<Priority, { bg: string; text: string; border: string }> = {
    low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    epic: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  };

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar - Hidden on Dashboard view */}
      {!isDashboard && (
        <div className="bg-[#141418] border border-[#22222a] p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1c1c24] border border-[#272734] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Pill Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#1c1c24] text-zinc-400 hover:text-zinc-200 hover:bg-[#252530]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* New Task Button */}
          <button
            onClick={() => {
              setIsAdding(!isAdding);
              sound.playClick();
            }}
            className="w-full md:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      )}

      {/* Add Task Form Modal / Expansion - Hidden on Dashboard view */}
      {!isDashboard && isAdding && (
        <form onSubmit={handleCreateTask} className="bg-[#16161c] border border-indigo-500/30 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#242432]">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Create New Task</span>
            </h3>
            <span className="text-xs text-indigo-400 font-number font-medium">
              +{PRIORITY_POINTS[priority]} PTS Reward
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Complete project proposal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add details, steps, or goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Priority & Points</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    <option value="low">Low (+10 PTS)</option>
                    <option value="medium">Medium (+25 PTS)</option>
                    <option value="high">High (+50 PTS)</option>
                    <option value="epic">Epic (+100 PTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Subtasks inline */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Subtasks Checklist</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add step..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtaskItem}
                    className="px-3 py-1.5 bg-[#282838] hover:bg-[#323246] text-xs font-medium text-zinc-200 rounded-xl"
                  >
                    Add
                  </button>
                </div>
                {subtasks.length > 0 && (
                  <ul className="mt-2 space-y-1 max-h-24 overflow-y-auto">
                    {subtasks.map((st) => (
                      <li key={st.id} className="text-xs text-zinc-300 flex items-center justify-between bg-[#1b1b24] px-2 py-1 rounded-lg">
                        <span>• {st.title}</span>
                        <button
                          type="button"
                          onClick={() => setSubtasks(subtasks.filter((s) => s.id !== st.id))}
                          className="text-zinc-500 hover:text-rose-400"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-[#242432]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 bg-[#1e1e28] hover:bg-[#282838]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#141418] border border-[#22222a] rounded-2xl p-8 text-center space-y-3">
            <Check className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-300">No tasks found</h4>
            <p className="text-xs text-zinc-500">Create a new task to earn points and unlock custom rewards!</p>
            {isDashboard && onNavigateAndAdd && (
              <button
                onClick={onNavigateAndAdd}
                className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Task</span>
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const pStyle = priorityColors[task.priority];
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`
                  bg-[#141418] border rounded-2xl p-3.5 transition-all duration-200 group
                  ${task.completed ? 'border-[#1e1e26] opacity-70' : 'border-[#22222a] hover:border-[#333342]'}
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {/* Custom Minimalist Checkbox */}
                    <button
                      onClick={() => handleTaskCheck(task)}
                      className={`
                        w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200
                        ${task.completed 
                          ? 'bg-emerald-500 border-emerald-500 text-black shadow-sm shadow-emerald-500/20' 
                          : 'border-[#38384a] bg-[#1a1a22] hover:border-indigo-500 text-transparent'
                        }
                      `}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className={`text-xs font-semibold ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                          {task.title}
                        </span>

                        {/* Category Badge */}
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1e1e28] text-zinc-400">
                          {task.category}
                        </span>

                        {/* Points Reward Badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-number ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
                          +{task.points} PTS
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Due date & Subtask indicators */}
                      <div className="flex items-center space-x-3 text-[10px] text-zinc-500 pt-1">
                        {task.dueDate && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Due {task.dueDate}</span>
                          </span>
                        )}

                        {task.subtasks.length > 0 && (
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className="flex items-center space-x-1 text-indigo-400 hover:text-indigo-300 font-medium"
                          >
                            <Layers className="w-3 h-3" />
                            <span>
                              Subtasks ({task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length})
                            </span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtask Details */}
                {isExpanded && task.subtasks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#22222a] pl-8 space-y-1.5">
                    {task.subtasks.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => onToggleSubtask(task.id, st.id)}
                        className="flex items-center space-x-2 text-xs text-zinc-300 cursor-pointer hover:text-white"
                      >
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${st.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-zinc-600'}`}>
                          {st.completed && <Check className="w-2.5 h-2.5" />}
                        </div>
                        <span className={st.completed ? 'line-through text-zinc-500' : ''}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
