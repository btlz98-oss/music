import React, { useState, useCallback, useEffect } from 'react';
import { Music, Settings, CalendarRange, Maximize2, AlertTriangle, Download, X, ChevronDown } from 'lucide-react';
import { defaultCurriculumData } from './data/curriculum';
import { SettingsModal } from './components/SettingsModal';
import { YearlyPlanModal } from './components/YearlyPlanModal';
import { LessonPlanDisplay } from './components/LessonPlanDisplay';
import { ClassroomModeDisplay } from './components/ClassroomModeDisplay';
import { ResourceSection, ResourceLink } from './components/lesson/ResourceSection';
import { CertificateGenerator } from './components/tools/CertificateGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useLessonPlanGenerator } from './hooks/useLessonPlanGenerator';

const App = () => {
  // ⭐️ Data Persistence
  const [selectedMonth, setSelectedMonth] = useLocalStorage<number>('lessonMonth', 3);
  const [selectedWeek, setSelectedWeek] = useLocalStorage<number>('lessonWeek', 1);
  const [memos, setMemos] = useLocalStorage<Record<string, string>>('lessonMemos', {});
  const [linksMap, setLinksMap] = useLocalStorage<Record<string, ResourceLink[]>>('lessonLinks', {});

  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showYearlyPlan, setShowYearlyPlan] = useState(false);
  const [showClassroomMode, setShowClassroomMode] = useState(false);
  const [showDataWarning, setShowDataWarning] = useState(true);
  
  // Settings & Data State
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [curriculumData, setCurriculumData] = useState(defaultCurriculumData);

  const monthOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
  const lessonKey = `${selectedMonth}-${selectedWeek}`;

  // Hook for Business Logic
  const lessonPlan = useLessonPlanGenerator(curriculumData, selectedMonth, selectedWeek);

  // Handlers
  const handleMemoChange = useCallback((value: string) => {
    setMemos((prev) => ({ ...prev, [lessonKey]: value }));
  }, [lessonKey, setMemos]);

  const handleLinksChange = useCallback((links: ResourceLink[]) => {
    setLinksMap((prev) => ({ ...prev, [lessonKey]: links }));
  }, [lessonKey, setLinksMap]);

  // Load custom curriculum on mount if exists
  useEffect(() => {
    const stored = window.localStorage.getItem('curriculumData');
    if (stored) {
        try { setCurriculumData(JSON.parse(stored)); } catch(e) {}
    }
  }, []);

  return (
    <>
      {/* ⭐️ Classroom Presentation Mode Overlay */}
      {showClassroomMode && lessonPlan && (
        <ClassroomModeDisplay 
            lessonPlan={lessonPlan} 
            onExit={() => setShowClassroomMode(false)}
            selectedMonth={selectedMonth}
            selectedWeek={selectedWeek}
        />
      )}

      <div className={`min-h-screen bg-[#FFFDF9] font-sans text-stone-800 ${showClassroomMode ? 'hidden' : ''}`}>
        
        {/* Data Warning Banner */}
        {showDataWarning && (
            <div className="bg-stone-800 text-white text-xs px-4 py-2 flex justify-between items-center print:hidden">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-yellow-400" />
                    <span>데이터는 브라우저에만 저장됩니다. 중요한 자료는 설정에서 백업 파일을 다운로드하세요.</span>
                </div>
                <button onClick={() => setShowDataWarning(false)}><X size={14} /></button>
            </div>
        )}

        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-b-2xl overflow-hidden border-x border-b border-stone-200 print:shadow-none print:border-none relative mb-12">
          
          {/* Modals */}
          {showSettings && (
            <SettingsModal 
              onClose={() => setShowSettings(false)}
              previewData={previewData}
              setPreviewData={setPreviewData}
              setCurriculumData={(data) => {
                  setCurriculumData(data);
                  window.localStorage.setItem('curriculumData', JSON.stringify(data));
              }}
              defaultCurriculumData={defaultCurriculumData}
              isDragOver={isDragOver}
              setIsDragOver={setIsDragOver}
            />
          )}
          {showYearlyPlan && (
            <YearlyPlanModal 
              onClose={() => setShowYearlyPlan(false)}
              monthOrder={monthOrder}
              curriculumData={curriculumData}
            />
          )}

          {/* Header */}
          <div className="bg-orange-400 p-4 md:p-6 text-white print:bg-white print:text-black print:border-b-2 print:border-orange-400">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><Music className="w-8 h-8" /> 두드림 리듬 탐험대</h1>
                <p className="mt-1 text-orange-100 print:text-gray-600 font-medium text-sm md:text-base">초등돌봄교실 특기적성 프로그램 (강사: 김경미)</p>
              </div>
              <div className="flex gap-2 print:hidden">
                  <button onClick={() => setShowClassroomMode(true)} className="flex items-center gap-1 px-4 py-2 bg-stone-800 hover:bg-stone-900 rounded-full transition-colors text-white font-bold shadow-lg">
                    <Maximize2 size={18} /> <span className="hidden md:inline">수업 모드</span>
                  </button>
                  <button onClick={() => setShowYearlyPlan(true)} className="flex items-center gap-1 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white font-medium">
                    <CalendarRange size={20} /> <span className="hidden md:inline text-sm">연간계획</span>
                  </button>
                  <button onClick={() => setShowSettings(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="설정 및 백업">
                      <Settings size={24} className="text-white" />
                  </button>
              </div>
            </div>
          </div>

          {/* ⭐️ Month/Week Selection (UI Restored) */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 print:hidden">
            <div className="bg-[#FFFBEB] p-6 rounded-2xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              
              {/* Month Selector */}
              <div className="flex-1 w-full md:w-auto">
                  <h3 className="text-stone-800 font-bold mb-3 text-lg">몇 월인가요?</h3>
                  <div className="relative">
                      <select
                          value={selectedMonth}
                          onChange={(e) => { setSelectedMonth(Number(e.target.value)); setSelectedWeek(1); }}
                          className="w-full p-4 pr-10 appearance-none bg-white border-2 border-orange-200 rounded-2xl text-lg font-bold text-stone-700 hover:border-orange-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all cursor-pointer shadow-sm"
                          style={{ backgroundImage: 'none' }}
                      >
                          {monthOrder.map(m => (
                              <option key={m} value={m}>
                                  {m}월 - {curriculumData[m]?.theme}
                              </option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
                          <ChevronDown size={24} strokeWidth={3} />
                      </div>
                  </div>
              </div>

              {/* Week Selector */}
              <div className="w-full md:w-auto">
                  <h3 className="text-stone-800 font-bold mb-3 text-lg">몇째 주인가요?</h3>
                  <div className="flex gap-3">
                      {[1, 2, 3, 4].map(w => (
                          <button
                              key={w}
                              onClick={() => setSelectedWeek(w)}
                              className={`flex-1 md:flex-none px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-sm ${
                                  selectedWeek === w
                                      ? 'bg-orange-500 text-white shadow-orange-200 translate-y-[-2px]'
                                      : 'bg-white border-2 border-orange-100 text-stone-500 hover:border-orange-300 hover:text-orange-500'
                              }`}
                          >
                              {w}주차
                          </button>
                      ))}
                  </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
             {/* Left Column: Lesson Plan Display */}
             <div className="lg:col-span-2 border-r border-stone-200">
                {lessonPlan && (
                    <LessonPlanDisplay 
                        lessonPlan={lessonPlan}
                        selectedMonth={selectedMonth}
                        selectedWeek={selectedWeek}
                        memo={memos[lessonKey] || ''}
                        onMemoChange={handleMemoChange}
                    />
                )}
             </div>

             {/* Right Column: Classroom Tools & Resources (Hidden in Print) */}
             <div className="lg:col-span-1 bg-stone-50 p-6 space-y-6 print:hidden">
                
                {/* 1. Resources */}
                <ResourceSection 
                    links={linksMap[lessonKey] || []} 
                    onLinksChange={handleLinksChange}
                />

                {/* 2. Certificate (Only Week 4) */}
                {selectedWeek === 4 && <CertificateGenerator />}

                <div className="text-center text-stone-400 text-xs mt-8">
                    <p>💡 팁: '수업 모드'를 켜면 큰 화면으로 수업을 진행할 수 있습니다.</p>
                </div>
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default App;