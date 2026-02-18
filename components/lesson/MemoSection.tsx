import React, { useState } from 'react';
import { PenTool, Save } from 'lucide-react';

interface MemoSectionProps {
  memo: string;
  onMemoChange: (value: string) => void;
}

export const MemoSection: React.FC<MemoSectionProps> = React.memo(({ memo, onMemoChange }) => {
  const [saveFeedback, setSaveFeedback] = useState('');

  const handleManualSave = () => {
    setSaveFeedback('저장 완료!');
    setTimeout(() => setSaveFeedback(''), 2000);
  };

  return (
    <>
      <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-200 shadow-sm print:hidden">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-stone-800 flex items-center gap-2">
            <PenTool size={20} className="text-stone-600" /> 나의 수업 메모
          </h3>
          <div className="flex items-center gap-2">
            {saveFeedback && <span className="text-green-600 text-sm font-bold animate-pulse">{saveFeedback}</span>}
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1 text-xs bg-white border border-yellow-300 px-3 py-1.5 rounded-lg hover:bg-yellow-100 transition-colors text-stone-600 font-medium shadow-sm"
            >
              <Save size={14} /> 저장
            </button>
          </div>
        </div>
        <textarea
          className="w-full p-3 rounded-xl border border-yellow-300 bg-white focus:ring-2 focus:ring-orange-300 outline-none resize-none text-stone-700 placeholder:text-stone-400"
          rows={3}
          placeholder="예: 유튜브 참고 링크, 추가 준비물, 아이들 특이사항 등..."
          value={memo}
          onChange={(e) => onMemoChange(e.target.value)}
        />
      </div>
      {memo && (
        <div className="hidden print:block bg-yellow-50 p-4 border border-yellow-200 rounded-lg mt-4">
          <h4 className="font-bold mb-1">📝 수업 메모</h4>
          <p className="whitespace-pre-wrap">{memo}</p>
        </div>
      )}
    </>
  );
});