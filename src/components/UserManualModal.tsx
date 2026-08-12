import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckSquare, 
  Gift, 
  FileText, 
  Sparkles, 
  Database, 
  Award, 
  Zap, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  Play
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'dashboard' | 'tasks' | 'notes' | 'rewards' | 'history') => void;
  onOpenAi: () => void;
  onOpenBackup: () => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenAi,
  onOpenBackup,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'tasks' | 'notes' | 'rewards' | 'ai' | 'backup'>('overview');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'overview',
      title: '১. একনজরে NEXUS',
      subtitle: 'গেমের মতো নিজের কাজ সম্পন্ন করুন',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'tasks',
      title: '২. টাস্ক ও গোল ম্যানেজমেন্ট',
      subtitle: 'কাজ সম্পন্ন করে পয়েন্ট ও XP অর্জন করুন',
      icon: <CheckSquare className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'notes',
      title: '৩. নোটস ও আইডিয়া স্পেস',
      subtitle: 'আইডিয়া সেভ করে রাখুন ও পিন করুন',
      icon: <FileText className="w-4 h-4 text-violet-400" />,
    },
    {
      id: 'rewards',
      title: '৪. কাস্টম রিওয়ার্ড শপ',
      subtitle: 'পয়েন্ট খরচ করে নিজের পছন্দের উপহার নিন',
      icon: <Gift className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'ai',
      title: '৫. AI Assistant ব্যবহার',
      subtitle: 'স্মার্ট টাস্ক ও রিওয়ার্ড তৈরি করুন AI দিয়ে',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    },
    {
      id: 'backup',
      title: '৬. ডাটা সেভ ও ব্যাকআপ',
      subtitle: 'JSON ফাইলে ডাটা সেভ ও ইমপোর্ট করুন',
      icon: <Database className="w-4 h-4 text-emerald-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141418] border border-[#272736] rounded-2xl w-full max-w-3xl h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="p-4 bg-[#181822] border-b border-[#242432] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>NEXUS User Manual & Quick Guide</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  ব্যবহারকারীর নির্দেশিকা
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">প্রথমবার অ্যাপ ব্যবহারের সহজ ও ধাপে ধাপে নির্দেশিকা</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#252532] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Left Navigation Sidebar */}
          <div className="w-full sm:w-64 bg-[#111115] border-r border-[#22222d] p-2 space-y-1 overflow-y-auto shrink-0">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 py-1.5">
              গাইড সূচিপত্র
            </div>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-2.5 border ${
                  activeSection === sec.id
                    ? 'bg-indigo-600/15 text-white border-indigo-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#181822] border-transparent'
                }`}
              >
                <div className="shrink-0">{sec.icon}</div>
                <div className="truncate">
                  <div className="font-semibold truncate">{sec.title}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{sec.subtitle}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-[#141418]">
            {/* 1. Overview */}
            {activeSection === 'overview' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-900 border border-indigo-500/20 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                    <Zap className="w-4 h-4 fill-indigo-400" />
                    <span>NEXUS কী এবং কীভাবে কাজ করে?</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    NEXUS একটি **গ্যামিফাইড প্রোডাক্টিভিটি অ্যাপ** (Gamified Productivity System)। এটি আপনার দৈনন্দিন কাজগুলোকে একটি রোমাঞ্চকর গেমের সাথে তুলনা করে, যাতে আপনি কাজ শেষ করার আগ্রহ পান!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#181822] border border-[#272736] p-3 rounded-xl space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                      ১
                    </div>
                    <div className="text-xs font-bold text-white">১. কাজ সম্পন্ন করুন</div>
                    <div className="text-[11px] text-zinc-400">টাস্ক সম্পন্ন করলে সাথে সাথে পয়েন্ট ও XP (অভিজ্ঞতা) মিলবে।</div>
                  </div>

                  <div className="bg-[#181822] border border-[#272736] p-3 rounded-xl space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                      ২
                    </div>
                    <div className="text-xs font-bold text-white">২. লেভেল আপ ও পয়েন্ট</div>
                    <div className="text-[11px] text-zinc-400">XP বাড়লে আপনার লেভেল এবং স্ট্রিক (Streak) বাড়বে।</div>
                  </div>

                  <div className="bg-[#181822] border border-[#272736] p-3 rounded-xl space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                      ৩
                    </div>
                    <div className="text-xs font-bold text-white">৩. রিওয়ার্ড রিডিম করুন</div>
                    <div className="text-[11px] text-zinc-400">অর্জিত পয়েন্ট খরচ করে নিজের পছন্দের রিওয়ার্ড অনলক করুন।</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#222232] flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('dashboard');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <span>ড্যাশবোর্ডে ফিরে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Tasks */}
            {activeSection === 'tasks' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#181822] border border-[#272736] p-4 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    <span>টাস্ক তৈরি ও পরিচালনা করার নিয়ম</span>
                  </h3>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>**নতুন টাস্ক:** "+ New Task" বোতামে চাপ দিয়ে শিরোনাম, ক্যাটাগরি, প্রায়োরিটি ও পয়েন্ট সেট করুন।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>**সাবটাস্ক (Subtasks):** বড় কাজকে ছোট ছোট ধাপে ভাগ করে নিতে সাবটাস্ক যোগ করতে পারেন।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>**কপ্লিট করা:** কাজ শেষ হলে চেক বক্সে ক্লিক করলেই সাথে সাথে সাউন্ড ইফেক্টসহ পয়েন্ট যোগ হবে।</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('tasks');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <span>টাস্ক পেজে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Notes */}
            {activeSection === 'notes' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#181822] border border-[#272736] p-4 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span>নোটস ও আইডিয়া ম্যানেজমেন্ট</span>
                  </h3>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>**নতুন নোটস:** যেকোনো প্রয়োজনীয় তথ্য, মিটিং নোটস বা প্ল্যান সেভ করে রাখতে পারবেন।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>**পিন করা (Pin Notes):** গুরুত্বপূর্ণ নোটগুলোকে উপরে পিন করে রাখতে পিন আইকনে ক্লিক করুন।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                      <span>**ফিল্টার ও ফিল্টারিং:** ক্যাটাগরি এবং সার্চবার ব্যবহার করে দ্রুত নোট খুজে নিন।</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('notes');
                    }}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <span>নোটস পেজে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 4. Rewards */}
            {activeSection === 'rewards' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#181822] border border-[#272736] p-4 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>কাস্টম রিওয়ার্ড শপের ব্যবহার</span>
                  </h3>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>**উপহার সেট করুন:** নিজের পছন্দের উপহার সেট করুন (যেমন: "Watch Movie", "Coffee Break", "Buy Book")।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>**পয়েন্ট প্রাইস:** প্রতিটি উপহার আনলক করতে কত পয়েন্ট লাগবে তা ঠিক করুন।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>**রিডিম করুন:** আপনার ব্যালেন্সে পর্যাপ্ত পয়েন্ট থাকলে "Unlock Reward" এ ক্লিক করে নিজেই নিজের উপহার উপভোগ করুন!</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateTab('rewards');
                    }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <span>রিওয়ার্ড শপে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 5. AI Assistant */}
            {activeSection === 'ai' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#181822] border border-[#272736] p-4 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Assistant (Gemini powered) এর সহায়তা</span>
                  </h3>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>**স্মার্ট সাজেস্ট:** "Generate Daily Tasks" এ চাপ দিলে AI আপনার জন্য টাস্ক সাজেস্ট করবে।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>**রিওয়ার্ড আইডিয়া:** সুন্দর সুন্দর রিওয়ার্ড এর আইডিয়া AI থেকে এক ক্লিকে জেনারেট করে শপে যোগ করা যায়।</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAi();
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Assistant ওপেন করুন</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. Backup */}
            {activeSection === 'backup' && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#181822] border border-[#272736] p-4 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-white flex items-center space-x-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>ডাটা সেভ ও ব্যাকআপ এর নিয়ম</span>
                  </h3>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>**অটো-সেভ:** আপনার সমস্ত পরিবর্তন ব্রাউজারের মেমরিতে স্বয়ংক্রিয়ভাবে সেভ হয়।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>**এক্সপোর্ট (Export JSON):** সাইডবারের "Save / Export Data" ক্লিক করে ব্যাকআপ ফাইল সেভ করুন।</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>**ইমপোর্ট (Import JSON):** অন্য ডিভাইসে বা নতুন ব্রাউজারে JSON ফাইল আপলোড করে তথ্য ফিরিয়ে আনুন।</span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBackup();
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>সেভ ও ইমপোর্ট মেনু খুলুন</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#181822] border-t border-[#242432] flex items-center justify-between text-xs text-zinc-400 shrink-0">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>NEXUS Tasks & Rewards Help Guide</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#252532] hover:bg-[#2f2f40] text-zinc-200 text-xs font-medium transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
