import React, { useRef } from 'react';
import { Settings, X, Upload, Download, Save, RotateCcw } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';

interface SettingsModalProps {
  onClose: () => void;
  previewData: any;
  setPreviewData: (data: any) => void;
  setCurriculumData: (data: any) => void;
  defaultCurriculumData: any;
  isDragOver: boolean;
  setIsDragOver: (state: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  onClose, previewData, setPreviewData, setCurriculumData, defaultCurriculumData, isDragOver, setIsDragOver 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => { 
    e.preventDefault(); 
    setIsDragOver(false); 
    const files = e.dataTransfer.files; 
    if (files.length > 0) processFile(files[0]); 
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const files = e.target.files; 
    if (files && files.length > 0) processFile(files[0]); 
  };
  
  const processFile = (file: File) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      alert("엑셀(.xlsx) 파일은 처리할 수 없습니다. CSV 형식으로 저장하여 업로드해주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        if (rows.length < 2) { alert("데이터가 부족합니다."); return; }
        
        const previewRows = [];
        let hasError = false;
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue; 
          
          const month = parseInt(row[0]);
          const week = parseInt(row[1]);
          const theme = row[2] || "";
          const instKey = row[3] || "";
          const title = row[4] || "";
          const focus = row[5] || "";
          const desc = row[6] || "";
          
          let status = 'valid';
          let message = '';
          if (isNaN(month) || month < 1 || month > 12) { status = 'error'; message = '월 오류'; hasError = true; }
          else if (isNaN(week) || week < 1 || week > 5) { status = 'error'; message = '주차 오류'; hasError = true; }
          else if (!theme || !title) { status = 'error'; message = '필수 정보 누락'; hasError = true; }
          
          previewRows.push({ id: i, month, week, theme, instKey, title, focus, desc, status, message });
        }
        if (previewRows.length === 0) { alert("유효한 데이터가 없습니다."); return; }
        setPreviewData({ rows: previewRows, hasError });
      } catch (error) { 
        console.error(error);
        alert("CSV 파일 처리 중 오류가 발생했습니다."); 
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const applyUpload = () => {
    if (!previewData || !previewData.rows) return;
    const newCurriculum: any = {};
    previewData.rows.forEach((row: any) => {
      if (row.status === 'error') return;
      if (!newCurriculum[row.month]) { newCurriculum[row.month] = { theme: row.theme, instKey: row.instKey, weeks: [] }; }
      newCurriculum[row.month].theme = row.theme;
      newCurriculum[row.month].instKey = row.instKey;
      newCurriculum[row.month].weeks.push({ week: row.week, title: row.title, focus: row.focus, desc: row.desc });
    });
    setCurriculumData(newCurriculum);
    setPreviewData(null);
    onClose();
    alert("연간 계획이 적용되었습니다!");
  };

  const cancelUpload = () => { setPreviewData(null); if (fileInputRef.current) fileInputRef.current.value = ''; };
  const resetCurriculum = () => { if (window.confirm("초기 설정으로 되돌리시겠습니까?")) { setCurriculumData(defaultCurriculumData); alert("초기화되었습니다."); } };
  const downloadSampleCSV = () => {
    const csvContent = "월,주차,월별주제,악기종류(백과사전키워드),수업제목,활동영역,학습목표\n3,1,우리 몸은 악기 (신체 타악기),신체 타악기,내 몸에서 소리가 나요,탐색,신체 부위를 두드려 소리 탐색하기";
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "수업계획서_샘플.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ⭐️ 데이터 백업/복구 로직
  const exportData = () => {
    const data = {
      curriculumData: localStorage.getItem('curriculumData'),
      memos: localStorage.getItem('lessonMemos'),
      links: localStorage.getItem('lessonLinks'),
      observations: localStorage.getItem('lessonObservations')
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `rhythm_explorer_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.curriculumData) localStorage.setItem('curriculumData', data.curriculumData);
        if (data.memos) localStorage.setItem('lessonMemos', data.memos);
        if (data.links) localStorage.setItem('lessonLinks', data.links);
        if (data.observations) localStorage.setItem('lessonObservations', data.observations);
        alert("데이터 복구가 완료되었습니다. 페이지를 새로고침합니다.");
        window.location.reload();
      } catch (err) {
        alert("잘못된 백업 파일입니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="absolute inset-0 bg-white/95 z-50 p-8 flex flex-col items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
        <button onClick={onClose} aria-label="설정 닫기" className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"><X size={32} /></button>
        <div className="w-full max-w-2xl space-y-12 my-8">
        
        {/* 섹션 1: 데이터 백업/관리 */}
        <section className="text-center space-y-4">
            <h3 className="text-lg font-bold text-stone-700 flex items-center justify-center gap-2"><Save size={20} /> 데이터 백업 및 관리</h3>
            <div className="flex gap-3 justify-center">
                <button onClick={exportData} className="px-5 py-3 bg-stone-800 text-white rounded-xl hover:bg-stone-700 font-bold flex items-center gap-2">
                    <Download size={18} /> 백업 파일 저장 (JSON)
                </button>
                <div className="relative">
                    <button className="px-5 py-3 bg-white border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 font-bold flex items-center gap-2">
                        <Upload size={18} /> 백업 파일 불러오기
                    </button>
                    <input type="file" accept=".json" onChange={importData} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
            </div>
            <p className="text-xs text-stone-400">브라우저를 변경하거나 PC를 옮길 때 데이터를 안전하게 이동하세요.</p>
        </section>

        <hr className="border-stone-200" />

        {/* 섹션 2: 커리큘럼 커스텀 */}
        <section className="space-y-4">
            <div className="text-center">
                <Settings className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                <h3 className="text-xl font-bold text-stone-800">커리큘럼 엑셀(CSV) 업로드</h3>
                <p className="text-sm text-stone-500">학교 일정에 맞춰 커리큘럼을 수정하고 싶다면 업로드하세요.</p>
            </div>
            
            {!previewData ? (
                <div className="space-y-4">
                    <div className={`bg-[#FFFDF9] p-8 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer relative group ${isDragOver ? 'border-orange-500 bg-orange-50' : 'border-stone-300 hover:border-orange-400'}`}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <div className="pointer-events-none"><Upload className="w-10 h-10 mx-auto mb-2 text-stone-400" /><p className="font-bold text-stone-700">CSV 파일 드래그 & 드롭</p></div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={downloadSampleCSV} className="flex-1 py-2 bg-white border border-stone-300 rounded-lg text-sm text-stone-600 font-medium">샘플 양식 다운로드</button>
                        <button onClick={resetCurriculum} className="flex-1 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold flex items-center justify-center gap-1"><RotateCcw size={14}/>초기화</button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-stone-100 p-4 rounded-xl font-bold flex justify-between"><span>미리보기 ({previewData.rows.length}개)</span>{previewData.hasError && <span className="text-red-600">오류 포함</span>}</div>
                    <div className="overflow-x-auto max-h-40 border border-stone-200 rounded-lg">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-stone-200 font-bold text-stone-700">
                                <tr>
                                    <th className="p-2">월</th><th className="p-2">주</th><th className="p-2">주제</th><th className="p-2">악기</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.rows.map((row: any) => (
                                    <tr key={row.id} className="border-b">
                                        <td className="p-2">{row.month}</td><td className="p-2">{row.week}</td><td className="p-2 truncate max-w-[100px]">{row.theme}</td><td className="p-2">{row.instKey}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={cancelUpload} className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl">취소</button>
                        <button onClick={applyUpload} disabled={previewData.hasError} className={`flex-1 py-3 text-white rounded-xl ${previewData.hasError ? 'bg-stone-400' : 'bg-blue-600'}`}>적용</button>
                    </div>
                </div>
            )}
        </section>
        </div>
    </div>
  );
};