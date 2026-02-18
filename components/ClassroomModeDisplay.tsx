import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, Music } from 'lucide-react';
import { LessonPlan } from '../types';
import { Timer } from './common/Timer';

interface ClassroomModeDisplayProps {
  lessonPlan: LessonPlan;
  onExit: () => void;
  selectedMonth: number;
  selectedWeek: number;
}

export const ClassroomModeDisplay: React.FC<ClassroomModeDisplayProps> = ({ lessonPlan, onExit, selectedMonth, selectedWeek }) => {
  const [step, setStep] = useState(0);

  // Flattened steps for linear navigation
  const steps = [
    { title: "수업 준비", type: "intro", content: lessonPlan.objective, sub: "학습 목표" },
    { title: "도입: 마음 열기", type: "intro", content: lessonPlan.intro, sub: "5분" },
    ...lessonPlan.main.map((activity, idx) => ({
      title: `전개 활동 ${idx + 1}: ${activity.title}`,
      type: "main",
      content: activity.steps,
      sub: "10분",
      method: activity.method
    })),
    { title: "정리: 마무리", type: "conclusion", content: lessonPlan.conclusion, sub: "5분" }
  ];

  const currentStep = steps[step];

  const nextStep = () => { if (step < steps.length - 1) setStep(step + 1); };
  const prevStep = () => { if (step > 0) setStep(step - 1); };

  return (
    <div className="fixed inset-0 bg-stone-900 z-50 flex flex-col text-white animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-stone-800 border-b border-stone-700">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-lg"><Music size={24} /></div>
          <div>
            <h1 className="font-bold text-lg">{lessonPlan.title}</h1>
            <p className="text-stone-400 text-sm">{selectedMonth}월 {selectedWeek}주차 - {currentStep.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
            <Timer initialMinutes={5} />
            <button onClick={onExit} className="p-2 hover:bg-stone-700 rounded-full text-stone-400 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-4xl w-full text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-stone-700 text-orange-400 font-bold mb-6 border border-stone-600">
                {currentStep.sub}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-12 leading-tight text-stone-100">
                {currentStep.title}
            </h2>
            
            <div className="text-2xl md:text-3xl text-stone-300 leading-relaxed font-medium bg-stone-800/50 p-8 rounded-3xl border border-stone-700 backdrop-blur-sm">
                {Array.isArray(currentStep.content) ? (
                    <ol className="text-left space-y-6 list-decimal pl-8 inline-block">
                        {currentStep.content.map((s, i) => (
                            <li key={i}>{s}</li>
                        ))}
                    </ol>
                ) : (
                    <p className="whitespace-pre-line">{currentStep.content}</p>
                )}
            </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-6 bg-stone-800 border-t border-stone-700 flex justify-between items-center">
        <button 
            onClick={prevStep} 
            disabled={step === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-stone-700 hover:bg-stone-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
            <ChevronLeft /> 이전 단계
        </button>
        
        <div className="flex gap-2">
            {steps.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === step ? 'bg-orange-500 scale-125' : 'bg-stone-600'}`} />
            ))}
        </div>

        <button 
            onClick={nextStep} 
            disabled={step === steps.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-900/20"
        >
            다음 단계 <ChevronRight />
        </button>
      </div>
    </div>
  );
};