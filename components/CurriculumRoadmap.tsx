import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CurriculumRoadmapProps {
  monthOrder: number[];
  selectedMonth: number;
  selectedWeek: number;
  setSelectedMonth: (m: number) => void;
  setSelectedWeek: (w: number) => void;
  curriculumData: any;
}

export const CurriculumRoadmap: React.FC<CurriculumRoadmapProps> = ({
  monthOrder, selectedMonth, selectedWeek, setSelectedMonth, setSelectedWeek, curriculumData
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to active item on mount/update
  useEffect(() => {
    if (scrollRef.current) {
        const activeItem = scrollRef.current.querySelector('.active-item');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }
  }, [selectedMonth, selectedWeek]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group bg-white border-b border-stone-200 shadow-sm">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white to-transparent px-2 hover:bg-stone-50/50 text-stone-400 hover:text-stone-800 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto custom-scrollbar py-4 px-8 gap-4 snap-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        {monthOrder.map((m) => (
            <div key={m} className="flex gap-1 shrink-0 snap-start">
                <div className={`flex flex-col justify-center px-4 rounded-xl border ${selectedMonth === m ? 'bg-orange-50 border-orange-200' : 'bg-stone-50 border-stone-100'}`}>
                    <span className={`text-xs font-bold ${selectedMonth === m ? 'text-orange-600' : 'text-stone-400'}`}>{m}월</span>
                    <span className="text-xs text-stone-500 font-medium truncate w-16">{curriculumData[m].instKey}</span>
                </div>
                {curriculumData[m].weeks.map((w: any) => {
                    const isActive = selectedMonth === m && selectedWeek === w.week;
                    return (
                        <button
                            key={`${m}-${w.week}`}
                            onClick={() => { setSelectedMonth(m); setSelectedWeek(w.week); }}
                            className={`active-item flex flex-col items-start justify-center w-32 p-2 rounded-xl border transition-all duration-200 ${
                                isActive 
                                ? 'bg-orange-500 border-orange-600 text-white shadow-md scale-105 z-10' 
                                : 'bg-white border-stone-200 text-stone-600 hover:border-orange-300 hover:bg-orange-50'
                            }`}
                        >
                            <span className="text-xs font-medium opacity-80">{w.week}주차</span>
                            <span className="text-xs font-bold truncate w-full text-left">{w.title}</span>
                        </button>
                    );
                })}
            </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white to-transparent px-2 hover:bg-stone-50/50 text-stone-400 hover:text-stone-800 transition-colors"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};