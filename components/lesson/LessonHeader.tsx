import React, { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { LessonPlan } from '../../types';
import { getOfflineInstrumentImage, getOnlineInstrumentImage } from '../../utils/instrumentImage';

interface LessonHeaderProps {
  lessonPlan: LessonPlan;
  selectedMonth: number;
  selectedWeek: number;
  appMode: 'online' | 'offline';
  onShowInstrumentModal: () => void;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  lessonPlan,
  selectedMonth,
  selectedWeek,
  appMode,
  onShowInstrumentModal
}) => {
  const onlineFallback = useMemo(() => getOnlineInstrumentImage(lessonPlan.instrumentName), [lessonPlan.instrumentName]);
  const offlineSrc = useMemo(() => getOfflineInstrumentImage(lessonPlan.instrumentName), [lessonPlan.instrumentName]);

  const prefersLocalPlaceholder = lessonPlan.refData.imageUrl === '/instrument-placeholder.svg';
  const onlineSrc = prefersLocalPlaceholder
    ? onlineFallback
    : (lessonPlan.refData.imageUrl || onlineFallback);

  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [lessonPlan.instrumentName, appMode]);

  const imageSrc = appMode === 'offline' ? offlineSrc : (hasImageError ? onlineFallback : onlineSrc);

  return (
    <div className="border-b-2 border-stone-800 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div className="flex items-start gap-6">
        {lessonPlan.refData?.imageUrl && (
          <img
            src={imageSrc}
            alt={lessonPlan.instrumentName}
            loading="lazy"
            className="w-24 h-24 rounded-2xl object-cover border border-stone-200 shadow-sm hidden sm:block print:hidden"
            onError={() => setHasImageError(true)}
          />
        )}
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold print:border print:border-orange-600">
              {selectedMonth}월 {selectedWeek}주차
            </span>
            <button
              onClick={onShowInstrumentModal}
              className="px-3 py-1 rounded-full text-sm font-bold border bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 flex items-center gap-1 transition-colors"
              title="클릭하여 악기 상세 정보 보기"
            >
              <Info size={14} /> 악기: {lessonPlan.instrumentName}
            </button>
            <span className="px-3 py-1 rounded-full text-sm font-bold border bg-green-100 text-green-800 border-green-200">
              활동: {lessonPlan.focus}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-bold border bg-stone-100 text-stone-600 border-stone-300">
              시간: 40분
            </span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight">{lessonPlan.title}</h2>
          <p className="text-stone-500 mt-1 font-bold text-lg">{lessonPlan.theme}</p>
        </div>
      </div>
      <div className="text-right hidden md:block print:block">
        <div className="text-sm text-stone-500 font-medium">강사</div>
        <div className="text-2xl font-bold font-serif text-stone-800">김 경 미</div>
      </div>
    </div>
  );
};
