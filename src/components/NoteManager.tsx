import React, { useState } from 'react';
import { Note } from '../types';
import { sound } from '../utils/sound';
import { 
  FileText, 
  Plus, 
  Search, 
  Pin, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Tag, 
  Sparkles,
  Calendar
} from 'lucide-react';

interface NoteManagerProps {
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePinNote: (noteId: string) => void;
  isDashboard?: boolean;
  autoOpenAdd?: boolean;
  onResetAutoOpen?: () => void;
  onNavigateAndAdd?: () => void;
}

export const NoteManager: React.FC<NoteManagerProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onTogglePinNote,
  isDashboard = false,
  autoOpenAdd = false,
  onResetAutoOpen,
  onNavigateAndAdd,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    if (autoOpenAdd) {
      setEditingNote(null);
      setTitle('');
      setContent('');
      setIsAdding(true);
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenAdd, onResetAutoOpen]);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Productivity');
  const [color, setColor] = useState('#818cf8'); // Indigo default
  const [isPinned, setIsPinned] = useState(false);

  const categories = ['All', 'Productivity', 'Health', 'Personal', 'Work', 'Study'];
  const colorOptions = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#38bdf8'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        category,
        color,
        isPinned,
        updatedAt: new Date().toISOString(),
      });
      setEditingNote(null);
    } else {
      onAddNote({
        title: title.trim() || 'Untitled Note',
        content: content.trim(),
        category,
        color,
        isPinned,
      });
    }

    // Reset Form
    setTitle('');
    setContent('');
    setCategory('Productivity');
    setColor('#818cf8');
    setIsPinned(false);
    setIsAdding(false);
    sound.playClick();
  };

  const handleEditClick = (note: Note) => {
    if (isDashboard && onNavigateAndAdd) {
      onNavigateAndAdd();
      return;
    }
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setColor(note.color);
    setIsPinned(note.isPinned);
    setIsAdding(true);
  };

  const handleCopyNote = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
              placeholder="Search notes & tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1c1c24] border border-[#272734] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Category Filters */}
          <div className="flex items-center space-x-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-[#1c1c24] text-zinc-400 hover:text-zinc-200 hover:bg-[#252530]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* New Note Button */}
          <button
            onClick={() => {
              setEditingNote(null);
              setTitle('');
              setContent('');
              setIsAdding(!isAdding);
              sound.playClick();
            }}
            className="w-full md:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 shadow-md shadow-violet-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      )}

      {/* Add / Edit Note Form - Hidden on Dashboard view */}
      {!isDashboard && isAdding && (
        <form onSubmit={handleCreateNote} className="bg-[#16161c] border border-violet-500/30 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[#242432]">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-violet-400" />
              <span>{editingNote ? 'Edit Note' : 'Create New Note'}</span>
            </h3>

            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                isPinned ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-[#22222d] text-zinc-400'
              }`}
            >
              <Pin className="w-3 h-3" />
              <span>{isPinned ? 'Pinned' : 'Pin Note'}</span>
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Note Title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <textarea
                rows={5}
                placeholder="Write your note, ideas, or markdown points..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none font-sans leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#242432]">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="flex items-center space-x-1">
                  <span className="text-[11px] text-zinc-400 mr-1">Tag Color:</span>
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        color === c ? 'scale-125 border-white ring-2 ring-violet-500/40' : 'border-transparent opacity-80'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-[#1e1e28] border border-[#2a2a3a] rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 bg-[#1e1e28]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/20"
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Note Cards Grid */}
      <div className={isDashboard ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
        {filteredNotes.length === 0 ? (
          <div className="col-span-full bg-[#141418] border border-[#22222a] rounded-2xl p-8 text-center space-y-3">
            <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-semibold text-zinc-300">No notes found</h4>
            <p className="text-xs text-zinc-500">Capture ideas, project guides, or study notes here.</p>
            {isDashboard && onNavigateAndAdd && (
              <button
                onClick={onNavigateAndAdd}
                className="mt-2 inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-violet-600/20 text-violet-300 border border-violet-500/30 text-xs font-semibold hover:bg-violet-600/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Note</span>
              </button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-[#141418] border border-[#22222a] hover:border-[#333342] transition-all rounded-2xl p-4 flex flex-col justify-between group shadow-sm relative"
            >
              <div className="space-y-2.5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: note.color }}
                    />
                    <h3 className="text-sm font-semibold text-white truncate">
                      {note.title}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => onTogglePinNote(note.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        note.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-zinc-600 hover:text-zinc-300'
                      }`}
                      title={note.isPinned ? 'Unpin' : 'Pin note'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Preview */}
                <p className="text-xs text-zinc-300 whitespace-pre-wrap line-clamp-6 leading-relaxed font-sans">
                  {note.content}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 mt-3 border-t border-[#22222a] flex items-center justify-between text-[10px] text-zinc-500">
                <span className="px-2 py-0.5 rounded-md bg-[#1e1e28] text-zinc-400">
                  {note.category}
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleCopyNote(note.id, `${note.title}\n\n${note.content}`)}
                    className="p-1.5 rounded-lg hover:bg-[#22222d] text-zinc-400 hover:text-white transition-colors"
                    title="Copy note"
                  >
                    {copiedId === note.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleEditClick(note)}
                    className="p-1.5 rounded-lg hover:bg-[#22222d] text-zinc-400 hover:text-white transition-colors"
                    title="Edit note"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
