import React, { useState } from 'react';
import { Info, Activity, Music2, Sparkles, Gamepad2, Star, Ear, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { LessonActivity } from '../../types';
import { MethodologyTooltip } from '../common/MethodologyTooltip';
import { Timer } from '../common/Timer';

interface ActivitySectionProps {
  activities: LessonActivity[];
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({ activities }) => {
  // 모든 항목이 기본적으로 펼쳐져 있도록 설정 (닫힌 항목의 인덱스만 저장)
  const [collapsedIndices, setCollapsedIndices] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setCollapsedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) // 이미 닫혀있으면 목록에서 제거 (펼치기)
        : [...prev, index] // 펼쳐져 있으면 목록에 추가 (닫기)
    );
  };
  
  const getMethodConfig = (methodName: string) => {
    const name = methodName.trim();
    if (name.includes('달크로즈')) {
      return {
        bg: 'bg-blue-50',
        border: 'border-l-blue-500',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-900',
        badge: 'bg-blue-600 text-white shadow-blue-200',
        icon: <Activity className="w-5 h-5" />
      };
    }
    if (name.includes('코다이')) {
      return {
        bg: 'bg-red-50',
        border: 'border-l-red-500',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
        badge: 'bg-red-600 text-white shadow-red-200',
        icon: <Music2 className="w-5 h-5" />
      };
    }
    if (name.includes('오르프')) {
      return {
        bg: 'bg-green-50',
        border: 'border-l-green-500',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
        badge: 'bg-green-600 text-white shadow-green-200',
        icon: <Sparkles className="w-5 h-5" />
      };
    }
    if (name.includes('고든') || name.includes('오디에이션')) {
      return {
        bg: 'bg-yellow-50',
        border: 'border-l-yellow-500',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-900',
        badge: 'bg-yellow-600 text-white shadow-yellow-200',
        icon: <Ear className="w-5 h-5" />
      };
    }
    if (name.includes('게임') || name.includes('게이미피케이션')) {
      return {
        bg: 'bg-purple-50',
        border: 'border-l-purple-500',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-900',
        badge: 'bg-purple-600 text-white shadow-purple-200',
        icon: <Gamepad2 className="w-5 h-5" />
      };
    }
    return {
      bg: 'bg-stone-50',
      border: 'border-l-stone-400',
      iconBg: 'bg-stone-100',
      iconColor: 'text-stone-600',
      textColor: 'text-stone-900',
      badge: 'bg-stone-600 text-white shadow-stone-200',
      icon: <Star className="w-5 h-5" />
    };
  };

  const parseMethods = (methodString: string) => {
    return methodString.split(',').map(part => {
      const match = part.match(/([^(]+)(?:\((.*)\))?/);
      if (!match) return { name: part.trim(), feature: '', config: getMethodConfig(part) };
      const name = match[1].trim();
      const feature = match[2] ? match[2].trim() : '';
      return { name, feature, config: getMethodConfig(name) };
    });
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-stone-800 mb-4 border-l-8 border-indigo-400 pl-4 flex items-center justify-between">
        <div>전개 (30분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded hidden sm:inline-block">통합 예술 교수법 활동</span></div>
        <Timer initialMinutes={30} />
      </h3>
      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const methods = parseMethods(activity.method);
          const mainConfig = methods[0].config;
          const isExpanded = !collapsedIndices.includes(idx);

          return (
            <div key={idx} className={`relative rounded-2xl border-l-8 shadow-sm transition-all duration-300 break-inside-avoid activity-card ${mainConfig.bg} ${mainConfig.border}`}>
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/30 transition-colors rounded-t-2xl"
                onClick={() => toggleAccordion(idx)}
              >
                <div className={`p-2 rounded-lg shadow-sm shrink-0 ${mainConfig.iconBg} ${mainConfig.iconColor}`}>
                  {methods.length > 1 ? <Layers className="w-5 h-5" /> : mainConfig.icon}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className={`font-bold text-lg ${mainConfig.textColor}`}>{activity.title}</h4>
                    <div className="flex items-center gap-2">
                        {/* Method Badges (Visible even when collapsed) */}
                        <div className="flex gap-1">
                            {methods.slice(0, 2).map((m, i) => (
                                <MethodologyTooltip key={i} name={m.name}>
                                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-sm cursor-help ${m.config.badge}`}>
                                        {m.name}
                                    </div>
                                </MethodologyTooltip>
                            ))}
                            {methods.length > 2 && <span className="text-xs text-stone-500">...</span>}
                        </div>
                        {isExpanded ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
                    </div>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-6 pt-0 animate-fade-in">
                  {/* Feature Highlights */}
                  {methods.some(m => m.feature) && (
                    <div className="mb-4 flex flex-wrap gap-2 pl-14">
                       {methods.map((m, i) => m.feature && (
                         <div key={i} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 border border-white/50 shadow-sm backdrop-blur-sm">
                           <Info size={14} className={m.config.iconColor} />
                           <span className={`text-xs font-bold ${m.config.textColor} opacity-90`}>
                             {m.name} 핵심: {m.feature}
                           </span>
                         </div>
                       ))}
                    </div>
                  )}

                  <div className="bg-white/90 rounded-xl p-5 border border-white/60 shadow-sm ml-0 sm:ml-14">
                     <div className="flex justify-between items-center mb-3 border-b border-stone-100 pb-2">
                         <span className="text-xs font-bold text-stone-400 uppercase">Step by Step</span>
                         <Timer initialMinutes={10} />
                     </div>
                    <ol className="list-decimal pl-5 space-y-2.5">
                      {activity.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="pl-2 leading-relaxed font-medium text-stone-700 marker:text-stone-400 marker:font-bold activity-step">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};