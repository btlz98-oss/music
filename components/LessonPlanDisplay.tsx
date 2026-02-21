import React, { useState } from 'react';
import { Star, CheckCircle, Info, History, MessageCircleQuestion, Smile, Heart } from 'lucide-react';
import { LessonPlan, ResourceLink } from '../types';
import { InstrumentDetailModal } from './InstrumentDetailModal';
import { LessonHeader } from './lesson/LessonHeader';
import { ActivitySection } from './lesson/ActivitySection';
import { PromptSection } from './lesson/PromptSection';
import { MemoSection } from './lesson/MemoSection';
import { ResourceSection } from './lesson/ResourceSection';

interface LessonPlanDisplayProps {
  lessonPlan: LessonPlan;
  selectedMonth: number;
  selectedWeek: number;
  appMode: 'online' | 'offline';
  memo: string;
  onMemoChange: (value: string) => void;
  links: ResourceLink[];
  onLinksChange: (links: ResourceLink[]) => void;
}

export const LessonPlanDisplay: React.FC<LessonPlanDisplayProps> = ({
  lessonPlan, selectedMonth, selectedWeek, appMode, memo, onMemoChange, links, onLinksChange
}) => {
  const [showInstrumentModal, setShowInstrumentModal] = useState(false);

  return (
    <div className="p-8 print:p-0">
      <div className="border-2 border-stone-200 rounded-2xl p-6 print:border-none print:p-0 bg-white">
        
        {/* Header */}
        <LessonHeader 
          lessonPlan={lessonPlan}
          selectedMonth={selectedMonth}
          selectedWeek={selectedWeek}
          appMode={appMode}
          onShowInstrumentModal={() => setShowInstrumentModal(true)}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Info & Ref & Terms & Resources */}
          <div className="md:col-span-2 lg:col-span-1 space-y-6">
            
            {/* 학습 목표 */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3 text-lg"><Star size={20} className="fill-indigo-700" /> 학습 목표</h3>
              <p className="text-stone-700 font-medium leading-relaxed">{lessonPlan.objective}</p>
            </div>

            {/* 준비물 */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3 text-lg"><CheckCircle size={20} /> 준비물</h3>
              <p className="text-stone-700 font-medium leading-relaxed">{lessonPlan.materials}</p>
            </div>

            {/* 어린이 용어 사전 */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 shadow-sm">
              <h3 className="font-bold text-stone-700 flex items-center gap-2 mb-3 text-lg"><MessageCircleQuestion size={20} /> 어린이 용어 사전</h3>
              <ul className="space-y-3">
                {lessonPlan.terms.map((t: any, idx: number) => (
                  <li key={idx} className="text-sm text-stone-700">
                    <span className="font-bold bg-stone-200 px-1.5 py-0.5 rounded text-stone-900 mr-1">{t.term}:</span>
                    {t.desc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reference Section */}
            {lessonPlan.refData && (
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3"><Info size={20} /> 선생님 꿀팁</h3>
                <div className="text-sm text-blue-900 space-y-3">
                  <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 유래</span> {lessonPlan.refData.origin}</p>
                  <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 팁</span> {lessonPlan.refData.tip}</p>
                </div>
              </div>
            )}

            {/* PPT/Prompts Section */}
            <PromptSection 
              lessonPrompts={lessonPlan.lessonSlidePrompts}
              historyPrompts={lessonPlan.historySlidePrompts}
              quizPrompts={lessonPlan.quizSlidePrompts}
            />

            {/* ⭐️ Resources (Moved to Bottom of Left Column) */}
            <ResourceSection 
                links={links} 
                appMode={appMode}
                onLinksChange={onLinksChange}
            />
            
          </div>

          {/* Right Column: Detailed Lesson Plan (Wider now because the outer sidebar is removed) */}
          <div className="md:col-span-2 lg:col-span-2 space-y-6">
            
            {/* Intro */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-green-400 pl-4 flex items-center">도입 (5분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">마음 열기</span></h3>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg">{lessonPlan.intro}</div>
            </div>

            {/* Development */}
            <ActivitySection activities={lessonPlan.main} />

            {/* Conclusion */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-orange-400 pl-4 flex items-center">정리 (5분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">마무리 인사</span></h3>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg">{lessonPlan.conclusion}</div>
            </div>

            {/* 악기 시간 여행 */}
            <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><History size={100} /></div>
              <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4 text-xl relative z-10"><History size={24} /> 악기 시간 여행</h3>
              <div className="text-stone-700 whitespace-pre-line leading-relaxed relative z-10 font-medium">
                {lessonPlan.history}
              </div>
            </div>

            {/* Memo Section */}
            <MemoSection memo={memo} onMemoChange={onMemoChange} />

            {/* 학년별 지도 팁 & 안전 */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-yellow-100 p-5 rounded-2xl border border-yellow-300 flex gap-4 shadow-sm">
                <div className="shrink-0 pt-1"><Smile className="text-orange-600 w-8 h-8" /></div>
                <div>
                  <p className="text-stone-800 font-bold text-lg whitespace-pre-line">{lessonPlan.tip}</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-5 rounded-2xl border border-red-200 flex gap-4 shadow-sm">
                <div className="shrink-0 pt-1"><Heart className="text-red-500 w-8 h-8" /></div>
                <div>
                  <h4 className="font-bold text-red-700 mb-1">오늘의 안전 약속</h4>
                  <p className="text-red-700 text-lg leading-relaxed whitespace-pre-line font-medium">{lessonPlan.safety}</p>
                </div>
              </div>
            </div>

            {/* Supplementary */}
            <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
              <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3"><Star size={20} /> 수준별 예비 활동</h3>
              <div className="text-sm space-y-3">
                <div className="bg-white p-3 rounded-lg border border-green-200"><span className="font-bold text-green-800 block mb-1">A. 심화 활동</span>{lessonPlan.supplementary.A}</div>
                <div className="bg-white p-3 rounded-lg border border-green-200"><span className="font-bold text-green-800 block mb-1">B. 보조 활동</span>{lessonPlan.supplementary.B}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-stone-200 text-center text-stone-400 text-sm hidden print:block">
          <p>물향기초등학교 초등돌봄교실 특기적성 프로그램 | 강사: 김경미</p>
        </div>

        {/* Instrument Detail Modal */}
        <InstrumentDetailModal
          isOpen={showInstrumentModal}
          onClose={() => setShowInstrumentModal(false)}
          instrumentName={lessonPlan.instrumentName}
          refData={lessonPlan.refData}
          history={lessonPlan.history}
        />

      </div>
    </div>
  );
};
