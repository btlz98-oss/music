import React, { useRef, useState } from 'react';
import { Award, Download } from 'lucide-react';

export const CertificateGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCertificate = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Background
        ctx.fillStyle = '#fffbeb'; // amber-50
        ctx.fillRect(0, 0, 600, 400);
        
        // Border
        ctx.strokeStyle = '#d97706'; // amber-600
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, 560, 360);
        ctx.lineWidth = 2;
        ctx.strokeRect(35, 35, 530, 330);

        // Title
        ctx.font = 'bold 40px serif';
        ctx.fillStyle = '#92400e'; // amber-800
        ctx.textAlign = 'center';
        ctx.fillText('이달의 리듬 대장', 300, 100);

        // Content
        ctx.font = '20px sans-serif';
        ctx.fillStyle = '#4b5563'; // gray-600
        ctx.fillText('위 어린이는 즐거운 마음으로', 300, 160);
        ctx.fillText('음악 수업에 참여하였으므로', 300, 190);
        ctx.fillText('이 상장을 수여합니다.', 300, 220);

        // Name
        ctx.font = 'bold 50px serif';
        ctx.fillStyle = '#000';
        ctx.fillText(name || '이 름', 300, 300);
        
        // Date & Teacher
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`2024년 ${new Date().getMonth() + 1}월`, 300, 350);
      }
    }
  };

  // Redraw when name changes
  React.useEffect(() => {
    drawCertificate();
  }, [name]);

  const download = () => {
    if (canvasRef.current && name) {
        const link = document.createElement('a');
        link.download = `${name}_수료증.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    } else {
        alert("이름을 입력해주세요!");
    }
  };

  return (
    <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm print:hidden">
      <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
        <Award size={20} /> 이달의 수료증 만들기
      </h3>
      <div className="flex flex-col gap-4">
        <input 
            type="text" 
            placeholder="학생 이름을 입력하세요" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-amber-300 rounded-lg w-full text-center font-bold"
        />
        <canvas ref={canvasRef} width={600} height={400} className="w-full rounded-lg shadow-md bg-white border border-stone-100" />
        <button onClick={download} className="w-full py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold flex items-center justify-center gap-2">
            <Download size={16} /> 수료증 저장하기
        </button>
      </div>
    </div>
  );
};