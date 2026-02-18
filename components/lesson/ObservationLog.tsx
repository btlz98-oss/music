import React from 'react';
import { UserCheck, AlertCircle, Save } from 'lucide-react';

export interface ObservationData {
  excellent: string;
  needsHelp: string;
  memo: string;
}

interface ObservationLogProps {
  data: ObservationData;
  onChange: (data: ObservationData) => void;
}

export const ObservationLog: React.FC<ObservationLogProps> = React.memo(({ data, onChange }) => {
  const handleChange = (field: keyof ObservationData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 shadow-sm mt-6 print:hidden">
      <h3 className="font-bold text-stone-800 flex items-center gap-2 mb-4">
        <UserCheck size={20} /> 학생 관찰 일지 (Mini-LMS)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-green-700 mb-1 flex items-center gap-1"><UserCheck size={12} /> 특별히 잘한 학생</label>
          <textarea 
            value={data.excellent}
            onChange={(e) => handleChange('excellent', e.target.value)}
            className="w-full p-2 text-sm border border-green-200 rounded-lg focus:ring-1 focus:ring-green-400 outline-none resize-none h-20"
            placeholder="이름 (내용)"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-orange-700 mb-1 flex items-center gap-1"><AlertCircle size={12} /> 도움이 필요한 학생</label>
          <textarea 
            value={data.needsHelp}
            onChange={(e) => handleChange('needsHelp', e.target.value)}
            className="w-full p-2 text-sm border border-orange-200 rounded-lg focus:ring-1 focus:ring-orange-400 outline-none resize-none h-20"
            placeholder="이름 (내용)"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-stone-600 mb-1">수업 총평 및 메모</label>
          <textarea 
            value={data.memo}
            onChange={(e) => handleChange('memo', e.target.value)}
            className="w-full p-2 text-sm border border-stone-200 rounded-lg focus:ring-1 focus:ring-stone-400 outline-none resize-none h-16"
            placeholder="오늘 수업 분위기는 어땠나요?"
          />
        </div>
      </div>
      <p className="text-xs text-stone-400 mt-2 text-right">* 내용은 브라우저에 자동 저장됩니다.</p>
    </div>
  );
});