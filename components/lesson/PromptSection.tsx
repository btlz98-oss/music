import React, { useState } from 'react';
import { Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard';

interface PromptSectionProps {
  lessonPrompts: string[];
  historyPrompts: string[];
  quizPrompts: string[];
}

interface PromptListProps {
  title: string;
  prompts: string[];
  groupKey: string;
  copyToClipboard: (text: string, id: string) => void;
  copyStatus: string | number | null;
}

const PromptList: React.FC<PromptListProps> = ({ title, prompts, groupKey, copyToClipboard, copyStatus }) => (
  <div className="flex flex-col gap-2 mb-4 pt-3 border-t border-purple-200 first:border-t-0 first:pt-0">
    <div className="flex justify-between items-center px-1">
      <h4 className="font-bold text-sm text-purple-800">{title}</h4>
      <button
        onClick={() => copyToClipboard(prompts.join('\n\n'), `${groupKey}-all`)}
        className={`text-xs px-2 py-1 border rounded transition-colors ${
          copyStatus === `${groupKey}-all` ? 'bg-green-100 text-green-700 border-green-200 font-bold' : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-100'
        }`}
      >
        {copyStatus === `${groupKey}-all` ? '복사완료!' : '전체 복사'}
      </button>
    </div>
    <ul className="text-sm text-purple-900 space-y-2">
      {prompts.map((prompt, idx) => (
        <li
          key={`${groupKey}-${idx}`}
          onClick={() => copyToClipboard(prompt, `${groupKey}-${idx}`)}
          className="bg-white border border-purple-100 p-2 rounded-lg cursor-pointer hover:bg-purple-100 relative group whitespace-pre-wrap text-xs"
        >
          <span className="leading-snug">{prompt}</span>
          {copyStatus === `${groupKey}-${idx}` && (
            <span className="absolute right-2 top-2 text-green-600 text-xs font-bold">복사됨!</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export const PromptSection: React.FC<PromptSectionProps> = ({ lessonPrompts, historyPrompts, quizPrompts }) => {
  const { copyStatus, copyToClipboard } = useClipboard();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-purple-50 rounded-2xl border border-purple-100 print:hidden relative shadow-sm overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center hover:bg-purple-100/50 transition-colors text-left"
      >
        <h3 className="font-bold text-purple-700 flex items-center gap-2 text-lg">
          <Monitor size={20} /> PPT/미리캔버스 프롬프트
        </h3>
        {isOpen ? <ChevronUp className="text-purple-400" /> : <ChevronDown className="text-purple-400" />}
      </button>
      
      {isOpen && (
        <div className="p-5 pt-0 animate-fade-in">
          <PromptList
            title="1. 수업 진행 슬라이드"
            prompts={lessonPrompts}
            groupKey="lesson"
            copyToClipboard={copyToClipboard}
            copyStatus={copyStatus}
          />
          <PromptList
            title="2. 악기 시간 여행 슬라이드"
            prompts={historyPrompts}
            groupKey="history"
            copyToClipboard={copyToClipboard}
            copyStatus={copyStatus}
          />
          <PromptList
            title="3. 악기 퀴즈 슬라이드"
            prompts={quizPrompts}
            groupKey="quiz"
            copyToClipboard={copyToClipboard}
            copyStatus={copyStatus}
          />
        </div>
      )}
    </div>
  );
};