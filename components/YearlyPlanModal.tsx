import React from 'react';
import { X, CalendarRange, Printer } from 'lucide-react';

interface YearlyPlanModalProps {
  onClose: () => void;
  monthOrder: number[];
  curriculumData: any;
}

export const YearlyPlanModal: React.FC<YearlyPlanModalProps> = ({ onClose, monthOrder, curriculumData }) => {
  return (
    <div className="absolute inset-0 bg-white z-50 p-8 flex flex-col items-center justify-start animate-in fade-in duration-200 overflow-y-auto">
        <div className="w-full max-w-6xl relative">
        <button onClick={onClose} aria-label="닫기" className="absolute top-0 right-0 text-stone-500 hover:text-stone-800 print:hidden"><X size={32} /></button>
        <div className="text-center mb-8 mt-4">
            <h2 className="text-3xl font-bold text-stone-800 flex items-center justify-center gap-3"><CalendarRange className="w-8 h-8 text-orange-500" /> 두드림 리듬 탐험대 연간 지도 계획</h2>
            <p className="text-stone-500 mt-2">1년 동안의 수업 주제와 활동 내용을 한눈에 확인하세요.</p>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-lg">
            <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-orange-100 text-orange-900">
                <tr>
                <th className="border-b border-r border-orange-200 p-4 font-bold text-center w-24">월</th>
                <th className="border-b border-r border-orange-200 p-4 font-bold w-48">주제 (악기)</th>
                <th className="border-b border-r border-orange-200 p-4 font-bold">1주차</th>
                <th className="border-b border-r border-orange-200 p-4 font-bold">2주차</th>
                <th className="border-b border-r border-orange-200 p-4 font-bold">3주차</th>
                <th className="border-b border-orange-200 p-4 font-bold">4주차</th>
                </tr>
            </thead>
            <tbody className="bg-white">
                {monthOrder.map((m) => {
                const data = curriculumData[m];
                return (
                    <tr key={m} className="hover:bg-orange-50/50 transition-colors">
                    <td className="border-b border-r border-stone-200 p-4 text-center">
                        <span className="text-xl font-bold text-stone-800">{m}월</span>
                    </td>
                    <td className="border-b border-r border-stone-200 p-4">
                        <div className="font-bold text-stone-800 mb-1">{data.theme.split('(')[0]}</div>
                        <div className="text-xs font-bold text-orange-600 bg-orange-100 inline-block px-2 py-0.5 rounded-full">{data.instKey}</div>
                    </td>
                    {data.weeks.map((w: any) => (
                        <td key={w.week} className="border-b border-r border-stone-200 p-3 align-top last:border-r-0">
                        <div className="font-bold text-stone-700 mb-1 text-sm">{w.title}</div>
                        <div className="text-xs text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded inline-block">{w.focus}</div>
                        </td>
                    ))}
                    </tr>
                );
                })}
            </tbody>
            </table>
        </div>
        <div className="mt-6 text-center print:hidden">
            <button onClick={() => window.print()} className="px-6 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 font-bold flex items-center gap-2 mx-auto"><Printer size={18} /> 연간 계획표 인쇄</button>
        </div>
        </div>
    </div>
  );
};
