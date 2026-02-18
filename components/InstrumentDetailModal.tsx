import React from 'react';
import { X, BookOpen, History, Music2 } from 'lucide-react';
import { InstrumentRefData } from '../types';

interface InstrumentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  instrumentName: string;
  refData: InstrumentRefData;
  history: string;
}

export const InstrumentDetailModal: React.FC<InstrumentDetailModalProps> = ({
  isOpen, onClose, instrumentName, refData, history
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200 print:hidden">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="닫기"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6 border-b pb-4 border-stone-100">
            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
              <Music2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-800">{instrumentName}</h2>
              <p className="text-stone-500 text-sm">악기 상세 정보 & 역사</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 백과사전 정보 */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <BookOpen size={20} className="text-blue-500" />
                악기 백과
              </h3>
              <div className="bg-blue-50/50 rounded-xl p-5 space-y-4 text-stone-700">
                <div>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm mr-2 align-middle">유래</span>
                  <span className="align-middle">{refData.origin}</span>
                </div>
                <div>
                  <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm mr-2 align-middle">종류</span>
                  <span className="align-middle">{refData.types.join(', ')}</span>
                </div>
                <div className="flex items-start">
                   <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-sm mr-2 shrink-0 mt-0.5">연주 팁</span>
                   <span>{refData.tip}</span>
                </div>
              </div>
            </section>

             {/* 역사 시간 여행 */}
             <section className="space-y-4">
              <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                <History size={20} className="text-orange-500" />
                악기 시간 여행
              </h3>
              <div className="bg-orange-50/50 rounded-xl p-6 text-stone-700 whitespace-pre-line leading-relaxed border border-orange-100">
                {history}
              </div>
            </section>
          </div>
          
          <div className="mt-8 pt-6 border-t border-stone-100 text-center">
             <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-stone-800 text-white rounded-xl font-medium hover:bg-stone-700 transition-colors"
             >
                닫기
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};