import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Download, Music } from 'lucide-react';

export const RhythmCardGenerator: React.FC = () => {
  const [pattern, setPattern] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const notes = [
    { name: 'Ta', symbol: '♩', label: '타' },
    { name: 'Ti-ti', symbol: '♫', label: '티티' },
    { name: 'Rest', symbol: '𝄽', label: '쉼' }
  ];

  const generateRhythm = () => {
    const newPattern = [];
    for (let i = 0; i < 4; i++) {
      const random = Math.random();
      if (random < 0.5) newPattern.push(notes[0]); // 50% Ta
      else if (random < 0.85) newPattern.push(notes[1]); // 35% Ti-ti
      else newPattern.push(notes[2]); // 15% Rest
    }
    setPattern(newPattern.map(n => n.symbol));
  };

  useEffect(() => {
    generateRhythm();
  }, []);

  useEffect(() => {
    if (canvasRef.current && pattern.length > 0) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Clear
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 400, 200);
        
        // Draw Staff
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, 100);
        ctx.lineTo(380, 100);
        ctx.stroke();

        // Draw Notes
        ctx.font = '60px serif';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        pattern.forEach((symbol, i) => {
            ctx.fillText(symbol, 70 + (i * 90), 120);
        });

        // Draw Bar Lines
        ctx.beginPath();
        ctx.moveTo(380, 60);
        ctx.lineTo(380, 140);
        ctx.moveTo(20, 60);
        ctx.lineTo(20, 140);
        ctx.stroke();
      }
    }
  }, [pattern]);

  const downloadImage = () => {
    if (canvasRef.current) {
        const link = document.createElement('a');
        link.download = `rhythm-card-${Date.now()}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm print:hidden">
      <h3 className="font-bold text-stone-800 flex items-center gap-2 mb-3">
        <Music size={20} className="text-pink-500" /> 리듬 카드 생성기
      </h3>
      <div className="flex flex-col items-center gap-4">
        <canvas ref={canvasRef} width={400} height={200} className="w-full max-w-[300px] border border-stone-200 rounded-lg shadow-inner bg-white" />
        <div className="flex gap-2 w-full">
            <button onClick={generateRhythm} className="flex-1 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 font-bold flex items-center justify-center gap-2">
                <RefreshCw size={16} /> <span className="text-sm">새로운 리듬</span>
            </button>
            <button onClick={downloadImage} className="flex-1 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700 font-bold flex items-center justify-center gap-2">
                <Download size={16} /> <span className="text-sm">저장</span>
            </button>
        </div>
      </div>
    </div>
  );
};