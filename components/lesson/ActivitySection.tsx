import React, { useState } from 'react';
import { Info, Activity, Music2, Sparkles, Gamepad2, Star, Ear, Layers, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { LessonActivity } from '../../types';
import { Timer } from '../common/Timer';

interface ActivitySectionProps {
  activities: LessonActivity[];
}

const methodDetails: Record<string, { desc: string }> = {
  "달크로즈": { desc: "음악을 듣고 즉각적으로 반응하는 '유리드믹스'로 리듬감을 키워요." },
  "코다이": { desc: "손기호와 리듬 음절(타, 티티)로 음악을 언어처럼 자연스럽게 익혀요." },
  "오르프": { desc: "말놀이와 신체 타악기, 즉흥 연주로 창의력을 발휘해요." },
  "고든": { desc: "마음속으로 음악을 상상하는 '오디에이션' 능력을 발달시켜요." },
  "게이미피케이션": { desc: "게임의 규칙과 재미를 더해 아이들의 몰입을 이끌어내요." },
  "통합 예술": { desc: "음악, 미술, 이야기를 하나로 연결하여 풍부한 경험을 만들어요." }
};

export const ActivitySection: React.FC<ActivitySectionProps> = ({ activities }) => {
  const [collapsedIndices, setCollapsedIndices] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setCollapsedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  
  const getMethodConfig = (methodName: string) => {
    const name = methodName.trim();
    if (name.includes('달크로즈')) {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-900',
        badge: 'bg-blue-600 text-white',
        icon: <Activity className="w-5 h-5" />
      };
    }
    if (name.includes('코다이')) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        textColor: 'text-red-900',
        badge: 'bg-red-600 text-white',
        icon: <Music2 className="w-5 h-5" />
      };
    }
    if (name.includes('오르프')) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        textColor: 'text-green-900',
        badge: 'bg-green-600 text-white',
        icon: <Sparkles className="w-5 h-5" />
      };
    }
    if (name.includes('고든') || name.includes('오디에이션')) {
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        textColor: 'text-yellow-900',
        badge: 'bg-yellow-600 text-white',
        icon: <Ear className="w-5 h-5" />
      };
    }
    if (name.includes('게임') || name.includes('게이미피케이션')) {
      return {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        textColor: 'text-purple-900',
        badge: 'bg-purple-600 text-white',
        icon: <Gamepad2 className="w-5 h-5" />
      };
    }
    return {
      bg: 'bg-stone-50',
      border: 'border-stone-200',
      iconBg: 'bg-stone-100',
      iconColor: 'text-stone-600',
      textColor: 'text-stone-900',
      badge: 'bg-stone-600 text-white',
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
            <div key={idx} className={`relative rounded-2xl border shadow-sm transition-all duration-300 break-inside-avoid activity-card ${isExpanded ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-stone-200 hover:border-indigo-300'}`}>
              <div 
                className={`p-4 flex items-center gap-4 cursor-pointer transition-colors rounded-t-2xl ${isExpanded ? 'bg-indigo-50/50' : 'bg-white hover:bg-stone-50'}`}
                onClick={() => toggleAccordion(idx)}
              >
                <div className={`p-2.5 rounded-xl shadow-sm shrink-0 ${mainConfig.iconBg} ${mainConfig.iconColor}`}>
                  {methods.length > 1 ? <Layers className="w-6 h-6" /> : React.cloneElement(mainConfig.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-lg text-stone-800">{activity.title}</h4>
                    <div className="flex items-center gap-2">
                        {/* Method Badges (collapsed view) */}
                        {!isExpanded && (
                            <div className="flex gap-1">
                                {methods.slice(0, 2).map((m, i) => (
                                    <div key={i} className={`px-2 py-0.5 rounded-md text-[11px] font-bold shadow-sm ${m.config.badge}`}>
                                        {m.name}
                                    </div>
                                ))}
                                {methods.length > 2 && <span className="text-xs text-stone-400">...</span>}
                            </div>
                        )}
                        {isExpanded ? <ChevronUp size={20} className="text-stone-400" /> : <ChevronDown size={20} className="text-stone-400" />}
                    </div>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-6 pt-2 animate-fade-in bg-white rounded-b-2xl">
                  
                  {/* Distinct Method Cards */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 sm:pl-16">
                     {methods.map((m, i) => {
                       const descKey = Object.keys(methodDetails).find(k => m.name.includes(k));
                       const description = descKey ? methodDetails[descKey].desc : "다양한 감각을 활용하여 음악을 경험해요.";
                       
                       return (
                         <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${m.config.bg} ${m.config.border}`}>
                           <div className={`p-2 rounded-full shrink-0 mt-0.5 ${m.config.iconBg} ${m.config.iconColor}`}>
                             {m.config.icon}
                           </div>
                           <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h5 className={`font-bold text-sm ${m.config.textColor}`}>{m.name}</h5>
                                {m.feature && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/60 rounded text-stone-600 border border-stone-100 truncate max-w-[120px]">
                                        {m.feature}
                                    </span>
                                )}
                             </div>
                             <p className="text-xs text-stone-600 leading-snug font-medium opacity-90">
                               {description}
                             </p>
                           </div>
                         </div>
                       );
                     })}
                  </div>

                  <div className="bg-white rounded-xl p-0 sm:pl-16">
                     <div className="flex justify-between items-center mb-3 border-b border-stone-100 pb-2">
                         <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1"><Lightbulb size={12}/> Activity Steps</span>
                         <Timer initialMinutes={10} />
                     </div>
                    <ol className="list-decimal pl-5 space-y-3">
                      {activity.steps.map((step, stepIdx) => (
                        <li key={stepIdx} className="pl-2 leading-relaxed font-medium text-stone-700 marker:text-stone-400 marker:font-bold text-base">
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