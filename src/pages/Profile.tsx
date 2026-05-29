import { useApp } from '../context/AppContext';
import { User, Save, Camera, Music, Award, Calendar, Target, Flame } from 'lucide-react';
import { useState } from 'react';
import { instrumentOptions } from '../data/mockData';

export default function Profile() {
  const { student, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: student.name,
    bio: student.bio,
    dailyPracticeGoal: student.dailyPracticeGoal,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      name: form.name,
      bio: form.bio,
      dailyPracticeGoal: form.dailyPracticeGoal,
      avatar: form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const instrumentLabel = instrumentOptions.find((i) => i.id === student.instrument)?.name ?? student.instrument;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-surface-900 mb-1">Student Profile</h2>
          <p className="text-surface-500">Manage your account settings and preferences</p>
        </div>
        <button onClick={handleSave} className={`btn-primary transition-all duration-300 ${saved ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : ''}`}>
          <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Avatar & basic info */}
      <div className="card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="relative group">
            <div className="w-28 h-28 gradient-brand rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-brand-700/25 ring-4 ring-brand-50">
              {student.avatar}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-brand-700/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left w-full space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="input-label">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field resize-none" rows={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-50 rounded-xl flex items-center justify-center ring-2 ring-brand-200/50 shadow-md">
              <Music className="w-5 h-5 text-brand-700" />
            </div>
            <div><p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Instrument</p><p className="font-bold text-surface-900 text-lg">{instrumentLabel}</p></div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-50 rounded-xl flex items-center justify-center ring-2 ring-accent-200/50 shadow-md">
              <Award className="w-5 h-5 text-accent-700" />
            </div>
            <div><p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Grade Level</p><p className="font-bold text-surface-900 text-lg">Grade {student.gradeLevel}</p></div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center ring-2 ring-amber-200/50 shadow-md">
              <Flame className="w-5 h-5 text-amber-700" />
            </div>
            <div><p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Current Streak</p><p className="font-bold text-surface-900 text-lg">{student.streak} days</p></div>
          </div>
        </div>
        <div className="card p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-surface-100 to-surface-50 rounded-xl flex items-center justify-center ring-2 ring-surface-200/50 shadow-md">
              <Calendar className="w-5 h-5 text-surface-600" />
            </div>
            <div><p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Member Since</p><p className="font-bold text-surface-900 text-lg">{new Date(student.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p></div>
          </div>
        </div>
      </div>

      {/* Practice goal */}
      <div className="card p-7">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-50 rounded-xl flex items-center justify-center ring-2 ring-brand-200/50 shadow-md">
            <Target className="w-5 h-5 text-brand-700" />
          </div>
          <div>
            <h3 className="section-title">Daily Practice Goal</h3>
            <p className="text-sm text-surface-500 mt-0.5">Set your target practice duration per day</p>
          </div>
        </div>
        <div className="space-y-5">
          <div className="flex items-center gap-6">
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={form.dailyPracticeGoal}
              onChange={(e) => setForm({ ...form, dailyPracticeGoal: Number(e.target.value) })}
              className="flex-1 h-3 bg-brand-100 rounded-full appearance-none cursor-pointer accent-brand-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-brand-500 [&::-webkit-slider-thumb]:to-brand-700 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-brand-700/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
            />
            <div className="text-center min-w-[80px] px-4 py-2 bg-gradient-to-br from-brand-100 to-brand-50 rounded-xl border-2 border-brand-200 shadow-sm">
              <span className="text-xl font-bold text-brand-700">{form.dailyPracticeGoal}</span>
              <span className="text-sm text-brand-600 font-medium ml-1">min</span>
            </div>
          </div>
          <div className="flex justify-between text-xs font-medium text-surface-400 px-1">
            <span>15 min</span>
            <span>60 min</span>
            <span>120 min</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card p-7">
        <h3 className="section-title mb-5">Recent Achievements</h3>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Flame, label: '10 Day Streak', desc: 'Practiced 10 days in a row', gradient: 'from-amber-400 to-amber-600', bg: 'bg-gradient-to-br from-amber-50 to-amber-100/50' },
            { icon: Award, label: 'Scale Master', desc: 'Completed all Grade 3 scales', gradient: 'from-brand-400 to-brand-600', bg: 'bg-gradient-to-br from-brand-50 to-brand-100/50' },
            { icon: User, label: 'Dedicated Learner', desc: '30 exercises completed', gradient: 'from-sky-400 to-sky-600', bg: 'bg-gradient-to-br from-sky-50 to-sky-100/50' },
          ].map((a) => (
            <div key={a.label} className={`text-center p-5 rounded-xl ${a.bg} border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
              <div className={`w-14 h-14 bg-gradient-to-br ${a.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                <a.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-bold text-surface-900">{a.label}</p>
              <p className="text-xs text-surface-500 mt-1">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
