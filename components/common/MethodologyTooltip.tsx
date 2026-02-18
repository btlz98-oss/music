import React, { useState } from 'react';

interface MethodologyTooltipProps {
  name: string;
  children: React.ReactNode;
}

const methodDescriptions: Record<string, string> = {
  "달크로즈": "달크로즈(Dalcroze) 교수법은 음악을 듣고 즉각적으로 신체로 반응하는 '유리드믹스'를 통해 리듬감과 청각 능력을 발달시킵니다.",
  "코다이": "코다이(Kodály) 교수법은 손기호와 리듬 음절(타, 티티)을 사용하여 아이들이 음악을 언어처럼 자연스럽게 익히도록 돕습니다.",
  "오르프": "오르프(Orff) 교수법은 말놀이, 신체 타악기, 즉흥 연주를 통해 아이들이 능동적으로 음악을 창작하고 표현하게 합니다.",
  "고든": "고든(Gordon)의 오디에이션은 마음속으로 음악을 듣고 이해하는 능력을 키우며, 음악적 상상력을 자극합니다.",
  "게이미피케이션": "게임의 재미있는 요소(규칙, 경쟁, 보상)를 수업에 적용하여 아이들의 몰입도와 참여를 높입니다."
};

export const MethodologyTooltip: React.FC<MethodologyTooltipProps> = ({ name, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // 이름에 포함된 키워드로 설명 찾기
  const key = Object.keys(methodDescriptions).find(k => name.includes(k));
  const description = key ? methodDescriptions[key] : null;

  if (!description) return <>{children}</>;

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-stone-800 text-white text-xs rounded-lg shadow-xl z-50 animate-fade-in pointer-events-none text-left leading-relaxed">
          <div className="font-bold mb-1 text-yellow-400">💡 {key} 교수법이란?</div>
          {description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-800"></div>
        </div>
      )}
    </div>
  );
};