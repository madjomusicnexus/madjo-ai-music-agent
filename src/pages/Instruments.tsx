import { useApp } from '../context/AppContext';
import { instrumentOptions } from '../data/mockData';
import { Check, Music, Piano, Guitar, Mic, Drum, Wind } from 'lucide-react';

type GradeLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Piano, Guitar, Music, Mic, Drum, Wind,
};

const instrumentIcons: Record<string, string> = {
  piano: 'Piano', guitar: 'Guitar', violin: 'Music', drums: 'Drum',
  vocals: 'Mic', bass: 'Music', flute: 'Wind', saxophone: 'Music',
  cello: 'Music', trumpet: 'Music',
};

export default function Instruments() {
  const { student, setInstrument, setGradeLevel, navigate } = useApp();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-surface-900">Choose Your Instrument</h2>
        <p className="text-surface-500 mt-1">Select your primary instrument and grade level to personalize your practice routines.</p>
      </div>

      {/* Instrument grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {instrumentOptions.map((inst) => {
          const isSelected = student.instrument === inst.id;
          const IconComp = iconMap[instrumentIcons[inst.id]] || Music;
          return (
            <button
              key={inst.id}
              onClick={() => setInstrument(inst.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all duration-200 text-center group ${
                isSelected
                  ? 'border-brand-500 bg-brand-50 shadow-md shadow-brand-500/10'
                  : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 gradient-brand rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2.5 ${
                isSelected ? 'gradient-brand text-white shadow-md shadow-brand-600/20' : 'bg-surface-100 text-surface-500 group-hover:bg-surface-200'
              }`}>
                <IconComp className="w-6 h-6" />
              </div>
              <p className={`font-semibold text-sm ${isSelected ? 'text-brand-700' : 'text-surface-800'}`}>{inst.name}</p>
              <p className="text-xs text-surface-400 mt-0.5 hidden sm:block">{inst.description}</p>
            </button>
          );
        })}
      </div>

      {/* Grade level */}
      <div className="card p-6">
        <h3 className="section-title mb-1">Grade Level</h3>
        <p className="text-sm text-surface-500 mb-5">Your current examination grade. This determines exercise difficulty.</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {([1, 2, 3, 4, 5, 6, 7, 8] as GradeLevel[]).map((grade) => {
            const isSelected = student.gradeLevel === grade;
            return (
              <button
                key={grade}
                onClick={() => setGradeLevel(grade)}
                className={`py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                  isSelected ? 'gradient-brand text-white shadow-md shadow-brand-600/20' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 gradient-brand rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
              <Music className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-surface-900">
                {instrumentOptions.find((i) => i.id === student.instrument)?.name} - Grade {student.gradeLevel}
              </p>
              <p className="text-sm text-surface-500">Your practice routines will be tailored to this selection</p>
            </div>
          </div>
          <button onClick={() => navigate('generate')} className="btn-primary">Generate Routine</button>
        </div>
      </div>
    </div>
  );
}
