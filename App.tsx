import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Music, Star, CheckCircle, Printer, Smile, Heart, Monitor, Info, Copy, Check, Settings, Upload, RotateCcw, FileText, X, AlertTriangle, FileSpreadsheet, ArrowRight } from 'lucide-react';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<string | number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // 파일 업로드 관련 상태
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null); // 업로드 미리보기 데이터
  
  // 기본 커리큘럼 데이터 (Hardcoded Default)
  const defaultCurriculumData: any = {
    3: {
      theme: "우리 몸은 악기 (신체 타악기)",
      instKey: "신체 타악기",
      weeks: [
        { week: 1, title: "내 몸에서 소리가 나요", focus: "탐색", desc: "신체 부위를 두드려 다양한 소리 찾기" },
        { week: 2, title: "쿵쿵 짝짝 박자 놀이", focus: "기초", desc: "발(쿵)과 손(짝)으로 걷기 박자 맞추기" },
        { week: 3, title: "몸으로 인사해요", focus: "응용", desc: "친구와 마주 보고 손뼉 치며 리듬으로 대화하기" },
        { week: 4, title: "몸 튼튼 오케스트라", focus: "심화/합주", desc: "모둠별로 다른 동작을 맡아 멋진 합주하기" }
      ]
    },
    4: {
      theme: "촥촥! 흔들흔들 쉐이커",
      instKey: "쉐이커",
      weeks: [
        { week: 1, title: "달걀이 노래해요", focus: "탐색", desc: "에그 쉐이커를 탐색하고 쥐는 법 익히기" },
        { week: 2, title: "크게 흔들! 작게 흔들!", focus: "기초", desc: "소리의 크기(셈여림) 조절하며 흔들기" },
        { week: 3, title: "그대로 멈춰라!", focus: "응용", desc: "음악이 멈추면 쉐이커도 딱! 멈추는 순발력 게임" },
        { week: 4, title: "봄바람 합주", focus: "심화/합주", desc: "봄 노래에 맞춰 살랑살랑 흔들며 연주하기" }
      ]
    },
    5: {
      theme: "딱딱! 나무 친구들",
      instKey: "우드블록/캐스터네츠",
      weeks: [
        { week: 1, title: "말발굽 소리일까?", focus: "탐색", desc: "우드블록 소리 들어보고 어떤 동물인지 맞히기" },
        { week: 2, title: "따따따따 걷기", focus: "기초", desc: "일정한 박자로 또랑또랑하게 치는 연습" },
        { week: 3, title: "묻고 답하기 놀이", focus: "응용", desc: "선생님이 '똑똑' 치면 학생이 '네네' 치기" },
        { week: 4, title: "숲속 연주회", focus: "심화/합주", desc: "동물 흉내 내며 이야기 속 효과음 연주하기" }
      ]
    },
    6: {
      theme: "찰랑찰랑 탬버린",
      instKey: "탬버린",
      weeks: [
        { week: 1, title: "흔들까? 칠까?", focus: "탐색", desc: "탬버린의 두 가지 소리(찰랑찰랑, 탕탕) 비교하기" },
        { week: 2, title: "엉덩이에 탬버린", focus: "기초", desc: "신체 부위에 탬버린을 대고 재미있게 치기" },
        { week: 3, title: "탬버린 춤", focus: "응용", desc: "신나는 음악에 맞춰 춤추며 자유롭게 연주하기" },
        { week: 4, title: "반짝반짝 엔딩", focus: "심화/합주", desc: "마르르르(트레몰로) 흔들며 멋지게 마무리하기" }
      ]
    },
    7: {
      theme: "띠링~ 트라이앵글",
      instKey: "트라이앵글",
      weeks: [
        { week: 1, title: "세모 모양 은방울", focus: "탐색", desc: "트라이앵글 줄 잡는 법 배우고 예쁜 소리 내기" },
        { week: 2, title: "소리를 잡아라!", focus: "기초", desc: "울리는 소리를 손으로 잡아 멈추기 (뮤트 놀이)" },
        { week: 3, title: "왈츠 춤을 춰요", focus: "응용", desc: "강-약-약 3박자 리듬 익히기" },
        { week: 4, title: "별빛 합주", focus: "심화/합주", desc: "다른 악기 소리 사이에서 포인트 소리 내주기" }
      ]
    },
    8: {
      theme: "신나는 여름 축제",
      instKey: "라틴 퍼커션",
      weeks: [
        { week: 1, title: "뜨거운 태양 리듬", focus: "탐색", desc: "신나는 남미 음악 듣고 몸 흔들기" },
        { week: 2, title: "신기한 종소리", focus: "기초", desc: "카우벨과 아고고 소리 탐색하기" },
        { week: 3, title: "칙칙폭폭 기차 놀이", focus: "응용", desc: "기차 대형으로 서서 발 맞추며 행진하기" },
        { week: 4, title: "삼바 카니발", focus: "심화/합주", desc: "가면 쓰고 축제처럼 신나게 두드리기" }
      ]
    },
    9: {
      theme: "리듬이랑 놀자",
      instKey: "창의 리듬",
      weeks: [
        { week: 1, title: "내 이름 리듬", focus: "탐색", desc: "자기 이름 글자 수에 맞춰 악기 치기 (김-경-미 짝짝짝)" },
        { week: 2, title: "맛있는 리듬", focus: "기초", desc: "사과(쿵쿵), 바나나(쿵쿵쿵) 과일 이름 치기" },
        { week: 3, title: "기분 소리 내기", focus: "응용", desc: "화난 소리, 기쁜 소리 악기로 표현하기" },
        { week: 4, title: "리듬 빙고", focus: "심화/합주", desc: "소리 듣고 어떤 리듬인지 맞히기 게임" }
      ]
    },
    10: {
      theme: "둥둥둥 북소리",
      instKey: "북(젬베/소고)",
      weeks: [
        { week: 1, title: "심장이 쿵쿵", focus: "탐색", desc: "북을 두드리며 큰 울림 느껴보기" },
        { week: 2, title: "다 같이 둥둥", focus: "기초", desc: "모두 똑같은 속도로 북 치기 연습" },
        { week: 3, title: "정글 탐험", focus: "응용", desc: "동물 발자국 소리 흉내 내기 (코끼리 쿵, 토끼 톡)" },
        { week: 4, title: "난타 대잔치", focus: "심화/합주", desc: "신나게 두드리며 스트레스 날리기" }
      ]
    },
    11: {
      theme: "우리 모두 다 같이",
      instKey: "앙상블",
      weeks: [
        { week: 1, title: "나무랑 쇠랑", focus: "탐색", desc: "서로 다른 재료의 악기 소리 섞어보기" },
        { week: 2, title: "높고 낮은 소리", focus: "기초", desc: "아빠 소리(저음)와 아기 소리(고음) 나누어 연주하기" },
        { week: 3, title: "혼자랑 같이랑", focus: "응용", desc: "혼자 연주할 때와 같이 연주할 때 구분하기" },
        { week: 4, title: "꼬마 지휘자", focus: "심화/합주", desc: "지휘자 친구의 손짓 보고 연주하기" }
      ]
    },
    12: {
      theme: "겨울 음악 여행",
      instKey: "앙상블",
      weeks: [
        { week: 1, title: "호두까기 인형", focus: "탐색", desc: "음악 동화 듣고 어울리는 악기 고르기" },
        { week: 2, title: "징글벨 딸랑", focus: "기초", desc: "방울 소리로 크리스마스 분위기 내기" },
        { week: 3, title: "겨울왕국 놀이", focus: "응용", desc: "눈보라 소리, 얼음 깨지는 소리 표현하기" },
        { week: 4, title: "우리끼리 음악회 1", focus: "심화/합주", desc: "가장 자신 있는 악기 골라 연습하기" }
      ]
    },
    1: {
      theme: "내가 만든 동요",
      instKey: "창의 리듬",
      weeks: [
        { week: 1, title: "노래 가사 바꾸기", focus: "탐색", desc: "익숙한 노래 가사를 재미있게 바꿔 부르기" },
        { week: 2, title: "재미있는 소리", focus: "기초", desc: "가사에 맞는 엉뚱한 효과음 넣기" },
        { week: 3, title: "우리끼리 음악회 2", focus: "응용", desc: "무대에서 인사하고 퇴장하는 법 연습하기" },
        { week: 4, title: "리허설", focus: "심화/합주", desc: "의상 입고 진짜처럼 연습해보기" }
      ]
    },
    2: {
      theme: "안녕, 리듬 친구들",
      instKey: "앙상블",
      weeks: [
        { week: 1, title: "두근두근 발표회", focus: "탐색", desc: "친구들 앞에서 씩씩하게 연주하기" },
        { week: 2, title: "칭찬 합시다", focus: "기초", desc: "친구의 연주에 큰 박수 쳐주기" },
        { week: 3, title: "제일 좋았어!", focus: "응용", desc: "1년 동안 가장 좋았던 악기 다시 연주하기" },
        { week: 4, title: "마지막 인사", focus: "심화/합주", desc: "다 같이 노래 부르며 수업 마치기" }
      ]
    }
  };

  const [curriculumData, setCurriculumData] = useState(defaultCurriculumData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 학사 일정 순서 (3월 ~ 다음해 2월)
  const monthOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

  // 악기별 백과사전 데이터
  const instrumentEncyclopedia: any = {
    "신체 타악기": { origin: "가장 오래된 악기예요. 도구 없이 몸으로 소리를 내요.", types: ["손뼉(짝짝)", "발구르기(쿵쿵)", "무릎치기(투닥)", "어깨치기(톡톡)"], tip: "아프지 않게 살살 치면서 소리의 차이를 느껴보게 해주세요." },
    "쉐이커": { origin: "열매 속에 씨앗을 넣어 흔들던 것에서 시작됐어요.", types: ["마라카스(손잡이)", "에그 쉐이커(달걀 모양)"], tip: "손목을 이용해 '촥촥' 소리를 내야 예쁜 소리가 나요." },
    "우드블록/캐스터네츠": { origin: "나무로 만든 악기예요. 맑고 또랑또랑한 소리가 나요.", types: ["우드블록(말발굽 소리)", "캐스터네츠(조개 모양)"], tip: "너무 세게 치지 않고 통통 튀기듯이 연주해요." },
    "탬버린": { origin: "북처럼 칠 수도 있고, 찰랑찰랑 흔들 수도 있어요.", types: ["가죽 탬버린", "리듬 탬버린(테두리만 있음)"], tip: "흔들 때와 칠 때의 소리가 어떻게 다른지 비교해요." },
    "트라이앵글": { origin: "세모난 금속 악기예요. 은방울처럼 고운 소리가 나요.", types: ["강철 트라이앵글"], tip: "줄을 잡아야 소리가 길게 울려요. 악기를 손으로 잡으면 소리가 멈춰요." },
    "라틴 퍼커션": { origin: "더운 나라에서 온 신나는 리듬 악기들이에요.", types: ["카우벨(종)", "아고고", "귀로(빨래판 소리)"], tip: "몸을 흔들면서 신나게 연주해요." },
    "창의 리듬": { origin: "우리 주변의 모든 물건이 악기가 될 수 있어요.", types: ["책상 드럼", "필통 흔들기", "종이 비기기"], tip: "정답은 없어요! 아이들의 상상력을 칭찬해주세요." },
    "북(젬베/소고)": { origin: "동물의 가죽으로 만든 악기예요. 심장 소리처럼 둥둥 울려요.", types: ["큰 북(쿵)", "작은 북(탁)"], tip: "손바닥을 펴서 칠 때와 손가락으로 칠 때 소리가 달라요." },
    "앙상블": { origin: "친구들과 마음을 모아 함께 연주하는 것을 말해요.", types: ["합주", "이어치기"], tip: "내 소리보다 친구의 소리를 잘 듣는 게 제일 중요해요." }
  };

  const handleCopy = async (text: string, statusId: string | number) => {
    const doFallbackCopy = () => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (success) {
          setCopyStatus(statusId);
          setTimeout(() => setCopyStatus(null), 2000);
        } else {
           alert("복사에 실패했습니다. (브라우저 권한 문제)");
        }
      } catch (err) {
        console.error("Fallback copy failed", err);
        alert("복사에 실패했습니다.");
      }
    };

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        setCopyStatus(statusId);
        setTimeout(() => setCopyStatus(null), 2000);
      } catch (err) {
        console.warn("Clipboard API blocked, using fallback", err);
        doFallbackCopy();
      }
    } else {
      doFallbackCopy();
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // CSV 파싱 헬퍼 함수
  const parseCSV = (text: string) => {
    const rawRows = text.split(/\r?\n/);
    const rows = [];
    
    for (let i = 0; i < rawRows.length; i++) {
      const line = rawRows[i].trim();
      if (!line) continue;

      const cells = [];
      let currentCell = '';
      let insideQuotes = false;
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        
        if (char === '"') {
          if (insideQuotes && line[j + 1] === '"') {
            currentCell += '"'; 
            j++; 
          } else {
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          cells.push(currentCell.trim());
          currentCell = '';
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim());
      rows.push(cells);
    }
    return rows;
  };

  // 파일 처리 및 미리보기 생성 (CSV 전용)
  const processFile = (file: File) => {
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      alert("죄송합니다. 현재 환경에서는 엑셀(.xlsx) 파일을 직접 처리할 수 없습니다.\n엑셀에서 'CSV(쉼표로 분리)' 형식으로 저장하여 업로드해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        
        if (rows.length < 2) {
          alert("파일에 데이터가 충분하지 않습니다.");
          return;
        }

        const previewRows = [];
        let hasError = false;

        // 데이터 검증 및 미리보기 생성 (헤더 제외 index 1부터)
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

          // 유효성 검사
          if (isNaN(month) || month < 1 || month > 12) {
            status = 'error';
            message = '월(Month) 오류';
            hasError = true;
          } else if (isNaN(week) || week < 1 || week > 5) {
            status = 'error';
            message = '주차(Week) 오류';
            hasError = true;
          } else if (!theme || !title) {
            status = 'error';
            message = '필수 데이터 누락';
            hasError = true;
          }

          previewRows.push({
            id: i,
            month, week, theme, instKey, title, focus, desc,
            status, message
          });
        }

        if (previewRows.length === 0) {
          alert("유효한 데이터가 없습니다.");
          return;
        }

        setPreviewData({ rows: previewRows, hasError });

      } catch (error) {
        console.error(error);
        alert("파일 처리 중 오류가 발생했습니다. 올바른 CSV 형식이 아닙니다.");
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // 미리보기 데이터 적용
  const applyUpload = () => {
    if (!previewData || !previewData.rows) return;

    const newCurriculum: any = {};
    
    previewData.rows.forEach((row: any) => {
      if (row.status === 'error') return;

      if (!newCurriculum[row.month]) {
        newCurriculum[row.month] = {
          theme: row.theme,
          instKey: row.instKey,
          weeks: []
        };
      }
      
      newCurriculum[row.month].theme = row.theme;
      newCurriculum[row.month].instKey = row.instKey;

      newCurriculum[row.month].weeks.push({
        week: row.week,
        title: row.title,
        focus: row.focus,
        desc: row.desc
      });
    });

    setCurriculumData(newCurriculum);
    setPreviewData(null);
    setShowSettings(false);
    alert("연간 계획이 성공적으로 적용되었습니다!");
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelUpload = () => {
    setPreviewData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetCurriculum = () => {
    if (window.confirm("초기 설정(기본 데이터)으로 되돌리시겠습니까?")) {
      setCurriculumData(defaultCurriculumData);
      alert("초기화되었습니다.");
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = "월,주차,월별주제,악기종류(백과사전키워드),수업제목,활동영역,학습목표\n3,1,우리 몸은 악기 (신체 타악기),신체 타악기,내 몸에서 소리가 나요,탐색,신체 부위를 두드려 소리 탐색하기\n3,2,우리 몸은 악기 (신체 타악기),신체 타악기,쿵쿵 짝짝 박자 놀이,기초,발과 손으로 박자 맞추기\n3,3,우리 몸은 악기 (신체 타악기),신체 타악기,몸으로 인사해요,응용,친구와 리듬으로 대화하기\n3,4,우리 몸은 악기 (신체 타악기),신체 타악기,몸 튼튼 오케스트라,심화/합주,모둠별 신체 타악기 합주하기";
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "수업계획서_샘플.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 프롬프트 TXT 다운로드 기능
  const downloadPromptsAsTxt = () => {
    if (!lessonPlan || !lessonPlan.slidePrompts) return;

    const content = lessonPlan.slidePrompts
      .map((prompt: string, idx: number) => 
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n슬라이드 ${idx + 1}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${prompt}`
      ).join('\n\n');
    
    const header = `${lessonPlan.title} - 수업 슬라이드 프롬프트\n생성일: ${new Date().toLocaleDateString('ko-KR')}\n월/주차: ${selectedMonth}월 ${selectedWeek}주차\n\n사용 방법:\n1. 미리캔버스 접속 (www.miricanvas.com)\n2. AI 프레젠테이션 기능 선택\n3. 아래 프롬프트를 차례대로 입력\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    const fullContent = header + content;
    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedMonth}월${selectedWeek}주_${lessonPlan.title}_슬라이드프롬프트.txt`;
    link.click();
  };

  // ---------- 업그레이드된 함수들 (도입, 정리, 본활동, 수준별 예비활동) ----------
  
  // 월별/주제별 분위기 텍스트
  const getMonthVibe = (month: number) => {
    if (month === 3) return "새 학기의 설렘을 가득 담아 밝게";
    if (month === 4 || month === 5) return "따뜻한 봄바람처럼 부드럽게";
    if (month === 6 || month === 7 || month === 8) return "여름의 뜨거운 태양처럼 에너지를 담아";
    if (month === 9 || month === 10) return "가을의 풍성함처럼 여유롭게";
    if (month === 11 || month === 12) return "겨울의 포근함과 크리스마스의 설렘으로";
    return "한 해를 마무리하는 차분하고 감사한 마음으로";
  };

  const generateIntro = (month: number, week: number, instKey: string, theme: string) => {
    const vibe = getMonthVibe(month);
    let specific = "";

    if (month === 3 && week === 1) {
      specific = `• [첫 만남] "반가워요! 우리 모두 리듬 탐험대가 되어볼까요?" 선생님과 눈을 맞추며 반갑게 인사해요.\n• [약속] 악기 친구들을 소중히 다루기로 손가락 걸고 약속해요.`;
    } else if (month === 2 && week === 4) {
      specific = `• [추억] "1년 동안 어떤 악기가 제일 좋았나요?" 즐거웠던 음악 수업을 떠올려봐요.\n• [감사] 함께 연주해준 친구들에게 "고마웠어"라고 인사해요.`;
    } else {
      if (week === 1) specific = `• [탐색] "오늘 만날 친구는 ${instKey}예요!" 상자 속에서 들리는 소리를 듣고 어떤 악기일지 상상해봐요.\n• [호기심] ${theme}와 관련된 짧은 동화나 그림을 보며 흥미를 유발해요.`;
      else if (week === 2) specific = `• [복습] "지난주에 배운 ${instKey} 소리 기억나나요?" 선생님이 내는 리듬을 듣고 똑같이 흉내 내봐요.\n• [몸풀기] 간단한 스트레칭과 함께 박수로 리듬 감각을 깨워요.`;
      else if (week === 3) specific = `• [응용] "음악에 맞춰 몸을 흔들어볼까요?" 굳어있던 몸과 마음을 가볍게 풀어요.\n• [상상] ${instKey}로 어떤 이야기를 표현할 수 있을지 아이디어를 나눠요.`;
      else specific = `• [준비] "오늘은 우리가 멋진 오케스트라가 되는 날!" 지휘자 선생님을 보며 호흡을 맞춰요.\n• [다짐] 서로를 바라보며 '하나'가 되는 마음을 약속해요.`;
    }

    return `• [분위기 조성] ${vibe} 인사해요.\n${specific}\n• [출석] 이름을 부르면 리듬으로 대답해요. (예: "네! 네! 네!")\n• [노래] 오늘의 주제와 관련된 짧은 인사 노래를 부르며 시작해요. (예: "안녕 안녕 선생님, 안녕 안녕 친구들~")`;
  };

  const generateConclusion = (month: number, week: number, instKey: string, theme: string) => {
    const vibe = getMonthVibe(month);
    let closing = "";

    if (month === 12 && week === 3) closing = `• [계절] "메리 크리스마스!" 캐롤을 부르며 즐겁게 마쳐요.\n• [나눔] 오늘 배운 ${instKey} 연주를 가족에게 선물한다면? 이야기해봐요.`;
    else if (week === 4) closing = `• [성취감] "오늘 공연 최고였어요!" 서로에게 큰 박수를 보내요.\n• [발표] 한 명씩 앞에 나와서 짧은 솔로 연주를 해보고 칭찬 스티커를 받아요.`;
    else closing = `• [칭찬] "오늘 집중하는 모습이 정말 멋졌어요!" 참 잘했어요 도장 꾹!\n• [다짐] 다음 시간에는 더 재미있는 ${instKey} 놀이를 기약해요.`;

    return `• [느낌 나누기] "오늘 어떤 소리가 제일 재미있었나요?" (O/X 손들기 또는 짧은 발표)\n${closing}\n• [정리] "악기 친구들아 잘 자~" 악기를 제자리에 예쁘게 정리해요. (하나하나 건네주며 개수 확인)\n• [인사] 배꼽 손 하고 "감사합니다" 인사하며 마쳐요.`;
  };

  // 수준별 보조 활동 (A/B) – 세밀화된 버전
  const generateSupplementary = (instKey: string, week: number, focus: string, theme: string) => {
    const baseA = (activity: string) => `[심화-리듬 리더] ${activity} (악기: ${instKey}, 주제: ${theme})`;
    const baseB = (activity: string) => `[기초-함께해요] ${activity} (악기: ${instKey}, 주제: ${theme})`;

    if (week === 1) { // 탐색 단계
      return {
        A: baseA(`선생님이 연주하는 다양한 ${instKey} 리듬을 듣고, 어떤 동작(걷기/뛰기/제자리)을 해야 할지 몸으로 표현해요. 예를 들어, 긴 리듬은 천천히 걷고, 짧고 빠른 리듬은 깡충깡충 뛰어요. 그 후에 자신이 만든 리듬을 친구들 앞에서 시범 보여요.`),
        B: baseB(`큰 북이나 탬버린 등 소리가 명확한 악기를 교사가 직접 아이 손을 잡고 함께 연주하며 '따라해요' 놀이를 해요. 악기의 촉감과 진동을 온몸으로 느끼게 하고, '멈춤' 신호에 즉시 멈추는 연습을 반복해요.`)
      };
    } else if (week === 2) { // 기초 단계
      return {
        A: baseA(`입으로는 "쿵쿵" (4분음표), 손으로는 ${instKey}로 "짝짝짝짝" (8분음표) 서로 다른 리듬을 동시에 연주하며 폴리리듬에 도전해요. 익숙해지면 친구와 역할을 바꿔 이어쳐요.`),
        B: baseB(`교사와 마주 앉아 '거울 놀이'를 해요. 교사가 아주 느린 템포로 ${instKey}를 칠 때 아이가 거울처럼 똑같이 따라 치며 박자 감각을 익혀요. 점차 속도를 높여가며 성취감을 느끼게 해요.`)
      };
    } else if (week === 3) { // 응용 단계
      return {
        A: baseA(`친구가 즉흥적으로 연주한 2마디 리듬을 듣고, 그 리듬에 어울리는 나만의 리듬 2마디를 만들어 '리듬 대화'를 주고받아요. 마치 음악으로 말을 거는 활동이에요.`),
        B: baseB(`신호등 게임 (초록불-연주, 빨간불-멈춤)을 통해 집중력을 길러요. 점차 '노란불'을 추가하여 천천히 연주하는 단계를 만들고, 교사의 손짓에 따라 셈여림을 조절하는 연습을 해요.`)
      };
    } else { // 심화/합주 단계
      return {
        A: baseA(`'꼬마 지휘자'가 되어 앞에 나와서 빠르기와 셈여림을 지휘해요. 지휘자의 손짓에 따라 다른 친구들이 ${instKey}로 즉시 반응하며 합주를 완성해요. 지휘자는 다양한 표정과 몸짓으로 음악을 이끌어요.`),
        B: baseB(`오스티나토(되풀이 리듬) 파트를 맡아, 예를 들어 '쿵 쿵 쿵 쿵' 같은 단순한 리듬을 반복 연주하며 전체 합주의 기초를 든든하게 받쳐줘요. 친구들의 연주를 들으며 자신의 박자를 유지하는 연습을 해요.`)
      };
    }
  };

  const generateLessonPlan = useCallback(() => {
    const monthData = curriculumData[selectedMonth];
    if (!monthData) return;

    const weekData = monthData.weeks.find((w: any) => w.week === parseInt(selectedWeek.toString()));
    if (!weekData) return;

    const instKey = monthData.instKey || "신체 타악기";
    const theme = monthData.theme || "리듬 탐험";

    // 본 활동 템플릿 – 달크로즈 기반, 악기/주제 자연스럽게 통합, 세밀화
    const mainActivityTemplates: any = {
      1: `
        [활동 1] 소리 탐험대 (유리드믹스 반응) (10분)
        - 목표: 소리가 날 때만 움직이고, 멈추면 그대로 정지하는 '즉각 반응(Reaction)'을 익힙니다.
        - 교사 멘트: "선생님이 ${instKey} 소리를 낼 때만 걸어다닐 수 있어요. 소리가 멈추면 얼음!"
        - 진행:
          1. 교사가 ${instKey}를 일정하게 칩니다. 아이들은 박자에 맞춰 자유롭게 걷습니다.
          2. 소리가 멈추면 아이들도 동작을 멈춥니다. (움직이면 탈락 놀이)
          3. 응용: "이번엔 소리가 크면 거인처럼, 작으면 생쥐처럼 걸어보자!"

        [활동 2] 내 몸은 악기 (신체 감각 깨우기) (10분)
        - 목표: ${instKey}를 연주하기 전, 신체 리듬감을 깨웁니다.
        - 교사 멘트: "악기를 연주하려면 우리 몸이 먼저 준비되어야 해요."
        - 진행:
          1. 머리, 어깨, 무릎을 두드리며 4박자 리듬을 만듭니다.
          2. 교사가 보여주는 리듬(예: 쿵-쿵-짝)을 아이들이 따라합니다 (메아리 모방).
          3. ${instKey} 연주 자세를 흉내 내며 '에어(Air) 연주'를 해봅니다.

        [활동 3] 악기랑 인사해요 (악기 탐색) (10분)
        - 목표: 실제 ${instKey}의 촉감과 소리를 탐색하고 특징을 발견합니다.
        - 교사 멘트: "이제 진짜 악기 친구를 만나볼까요? 눈으로 먼저 인사해요."
        - 진행:
          1. 악기를 바닥에 내려놓고 눈으로 관찰합니다. (만지지 않기 약속)
          2. '검지 손가락' 하나로만 살짝 만져보며 차가운지, 거친지 이야기합니다.
          3. 자유롭게 소리 내어 보되, 교사의 '주먹 신호(침묵)'에 즉시 멈추는 연습을 합니다.
      `,
      2: `
        [활동 1] 무거움과 가벼움 (에너지와 뉘앙스) (10분)
        - 목표: 소리의 셈여림(Dynamics)을 신체 에너지의 무게감으로 표현합니다.
        - 교사 멘트: "코끼리 발걸음은 쿵! 쿵! 무겁고, 병아리 발걸음은 쫑! 쫑! 가벼워요."
        - 진행:
          1. 교사가 큰 소리(f)를 내면 무거운 돌을 든 것처럼 둔탁하게 걷습니다.
          2. 작은 소리(p)를 내면 풍선처럼 가볍게 날아다니듯 걷습니다.
          3. ${instKey}로 크고 작은 소리를 조절하며 직접 연주해봅니다.

        [활동 2] 꼬마 지휘자 (지휘에 따른 연주) (10분)
        - 목표: 시각적 신호(지휘)를 청각적 결과(연주)로 연결합니다.
        - 교사 멘트: "선생님 손이 커지면 소리도 커지고, 작아지면 소리도 작아져요."
        - 진행:
          1. 교사의 손동작 크기에 맞춰 박수를 칩니다. (크레센도/데크레센도)
          2. ${instKey}를 들고 지휘에 맞춰 연주합니다.
          3. '멈춤(Cut-off)' 신호를 주면 악기 소리의 울림을 손으로 잡아 정확히 멈춥니다.

        [활동 3] 그림 악보 연주 (기초 독보) (10분)
        - 목표: 그림 기호를 보고 약속된 ${instKey} 소리를 냅니다.
        - 교사 멘트: "사과 그림이 나오면 '쿵', 바나나 그림이 나오면 '짝짝' 이에요."
        - 진행:
          1. 칠판에 과일이나 동물 그림 카드를 붙여 리듬 패턴을 만듭니다.
          2. 입으로 먼저 리듬을 읽고("사-과-바나나"), 그 리듬을 악기로 연주합니다.
          3. 카드의 순서를 바꿔 새로운 리듬을 만들어 연주합니다.
      `,
      3: `
        [활동 1] 리듬 대화 (즉흥 연주/Improvisation) (10분)
        - 목표: 정해진 답이 아닌, 나만의 리듬으로 대답하며 창의성을 기릅니다.
        - 교사 멘트: "말 대신 악기로 대화해볼까요? 선생님이 '똑똑?' 물어보면 여러분이 대답해주세요."
        - 진행:
          1. 교사가 먼저 리듬 질문(예: 쿵.쿵.쿵?)을 던집니다.
          2. 아이들은 ${instKey}로 각자 다른 리듬 대답(예: 짝!짝!, 타타타 등)을 연주합니다.
          3. 짝꿍과 마주 보고 '악기 대화'를 나누게 합니다.

        [활동 2] 청개구리 놀이 (내적 청감/Inhibition) (10분)
        - 목표: 들리는 소리를 즉시 억제하거나 반대로 행동하며 집중력을 높입니다.
        - 교사 멘트: "이번엔 청개구리가 되어볼 거예요. 선생님이 치는 거랑 반대로 쳐보세요!"
        - 진행:
          1. 교사가 '큰 소리'를 내면 아이들은 '작은 소리'로 칩니다.
          2. 교사가 '빠르게' 치면 아이들은 '느리게' 칩니다.
          3. '금지된 리듬' 정하기: 특정 리듬이 나오면 절대 치지 않고 머리 위로 동그라미를 그립니다.

        [활동 3] 돌림 노래 움직임 (캐논/Canon) (10분)
        - 목표: 다른 모둠의 소리를 들으며 내 파트를 유지하는 다성부 감각을 익힙니다.
        - 교사 멘트: "파도타기처럼 앞 친구가 한 동작을 뒤따라서 해볼까요?"
        - 진행:
          1. '곰 세 마리' 같은 단순한 노래에 맞춰 1분단이 먼저 동작(만세)을 시작합니다.
          2. 2마디 후에 2분단이 똑같은 동작을 시작합니다. (시각적 캐논)
          3. 익숙해지면 ${instKey} 연주로 돌림 노래(돌림 연주)를 시도합니다.
      `,
      4: `
        [활동 1] 움직이는 그림 (Plastique Animée) (10분)
        - 목표: 음악의 형식을 신체 대형과 움직임으로 시각화합니다.
        - 교사 멘트: "우리가 음악이 되어 움직여봐요. A음악에는 둥글게, B음악에는 기차처럼!"
        - 진행:
          1. A-B-A 형식의 음악을 듣고 각 부분의 느낌을 이야기합니다.
          2. A부분: 제자리에서 ${instKey}를 부드럽게 연주합니다.
          3. B부분: 친구들과 손을 잡고 원을 그리거나 행진하며 박자에 맞춰 걷습니다.
          4. 다시 A부분: 처음 동작으로 돌아옵니다.

        [활동 2] 파트 나누기 (오케스트레이션) (10분)
        - 목표: 역할을 나누어 합주하며 조화를 이룹니다.
        - 교사 멘트: "한쪽은 쿵쿵 심장 소리, 한쪽은 찰랑찰랑 빗소리를 맡아주세요."
        - 진행:
          1. 모둠을 두 그룹으로 나눕니다. (리듬팀 vs 효과음팀)
          2. 리듬팀은 일정한 박(Ostinato)을 계속 연주합니다.
          3. 효과음팀은 교사의 신호에 맞춰 포인트 소리를 넣어줍니다.
          4. 역할을 바꿔서 합주해봅니다.

        [활동 3] 작은 음악회 (발표 및 감상) (10분)
        - 목표: 무대 예절을 배우고 성취감을 느낍니다.
        - 교사 멘트: "멋진 연주자가 되어 무대에 서볼까요? 관객 친구들은 귀를 쫑긋!"
        - 진행:
          1. 앞 무대로 나와 인사하는 법(배꼽 인사)을 연습합니다.
          2. 피아노 반주나 배경 음악에 맞춰 준비한 ${instKey} 합주를 선보입니다.
          3. 연주가 끝나면 관객 친구들은 큰 박수와 환호를 보냅니다.
      `
    };

    const introText = generateIntro(selectedMonth, selectedWeek, instKey, theme);
    const conclusionText = generateConclusion(selectedMonth, selectedWeek, instKey, theme);
    const mainText = mainActivityTemplates[selectedWeek] || mainActivityTemplates[1];
    const supplementary = generateSupplementary(instKey, selectedWeek, weekData.focus, theme);
    const refData = instrumentEncyclopedia[instKey] || instrumentEncyclopedia["신체 타악기"];

    // ✨ 준비물 자동 생성 로직 (구체화)
    const getMaterials = () => {
      const basic = "스피커, 출석부";
      const instrument = instKey === "신체 타악기" ? "편안한 복장" : `${instKey} (학생 수만큼)`;
      
      let specific = "";
      switch (parseInt(selectedWeek.toString())) {
        case 1: specific = "악기 사진 자료, 소리 상자(탐색용), 돋보기 그림, 촉감 카드"; break;
        case 2: specific = "리듬 카드(과일 그림), 메트로놈, 셈여림 표시 막대"; break;
        case 3: specific = "멈춤 신호판(신호등 그림), 스티커, 즉흥 연주 녹음기"; break;
        case 4: specific = "지휘봉, 나비넥타이 소품, 녹음기, 무대 배경 천"; break;
        default: specific = "활동지, 필기도구";
      }

      return `${basic}, ${instrument}, ${specific}`;
    };

    const materials = getMaterials();

    const getSlidePrompts = () => {
      const weekNum = selectedWeek;
      const title = weekData.title;
      const objective = weekData.desc;
      const focus = weekData.focus;
      
      const activityType: any = {
        1: { action: "탐색하기", icon: "🔍", method: "만져보고 관찰", verb: "찾아요" },
        2: { action: "연습하기", icon: "💪", method: "반복해서 쳐보기", verb: "쳐봐요" },
        3: { action: "놀이하기", icon: "🎮", method: "게임으로 즐기기", verb: "놀아요" },
        4: { action: "발표하기", icon: "🎭", method: "함께 합주", verb: "보여줘요" }
      }[weekNum] || ({} as any);

      const instrumentEmoji: any = {
        "신체 타악기": "👏",
        "쉐이커": "🥚",
        "우드블록/캐스터네츠": "🪵",
        "탬버린": "🎵",
        "트라이앵글": "🔺",
        "라틴 퍼커션": "🎺",
        "창의 리듬": "🎨",
        "북(젬베/소고)": "🥁",
        "앙상블": "🎼"
      }[instKey] || "🎵";

      const colorTheme: any = {
        1: { bg: "#FFF9E6", primary: "#FF6B35", secondary: "#2E5090" }, 
        2: { bg: "#E3F2FD", primary: "#E53935", secondary: "#1976D2" }, 
        3: { bg: "#FCE4EC", primary: "#C2185B", secondary: "#4A148C" }, 
        4: { bg: "#FFF8E1", primary: "#FF6F00", secondary: "#3E2723" } 
      }[weekNum] || ({} as any);

      return [
        // 슬라이드 1: 표지
        `**슬라이드 1 - 표지**\n학년: 초등 1-2학년\n주제: "${title}"\n목적: 오늘 수업의 주제를 흥미롭게 소개\n디자인 지침:\n- 배경색: ${colorTheme.bg || '#ffffff'} (단색, 패턴 없음)\n- 레이아웃: 3단 구조 (상단-중앙-하단)\n텍스트 요소:\n1. 상단 (화면 상단에서 30% 위치):\n   - 내용: "오늘의 음악 놀이"\n   - 크기: 90pt\n   - 색상: ${colorTheme.secondary || '#000000'}\n   - 정렬: 가운데\n2. 중앙 (화면 중심 50% 위치):\n   - 내용: "${title}"\n   - 크기: 150pt\n   - 색상: ${colorTheme.primary || '#000000'}\n   - 두께: 볼드체\n   - 정렬: 가운데\n3. 하단 (화면 하단에서 20% 위치):\n   - 악기 이모지 ${instrumentEmoji}를 가로로 3개 배치\n   - 각 이모지 크기: 50pt\n   - 간격: 이모지 사이 30px\n주의사항:\n- 일러스트나 사진 추가 금지\n- 글자와 이모지만 사용\n- 여백 최소 15% 확보`,
        
        // 슬라이드 2: 학습 목표
        `**슬라이드 2 - 학습 목표**\n학년: 초등 1-2학년\n목적: 오늘 배울 내용을 아이콘으로 직관적으로 전달\n디자인 지침:\n- 배경색: 연한 하늘색 (#E3F2FD) 전체\n- 레이아웃: 수직 3단\n텍스트 요소:\n1. 상단 (20% 위치):\n   - 내용: "오늘 우리는"\n   - 크기: 80pt\n   - 색상: 검정(#000000)\n2. 중앙 (50% 위치):\n   - 내용: ${activityType.icon || '🎵'} 이모지 하나만\n   - 크기: 200pt\n   - 정렬: 정중앙\n3. 하단 (75% 위치):\n   - 내용: "${objective}"\n   - 크기: 100pt\n   - 색상: 진한 남색(#1A237E)\n   - 줄바꿈: 2줄 이내로 자동 조절\n주의사항:\n- 이모지 외 다른 장식 금지\n- 배경 패턴 없음`,
        
        // 슬라이드 3: 도입
        weekNum === 1 
          ? `**슬라이드 3 - 궁금증 유발 (1주차 전용)**\n목적: 호기심 자극\n디자인 지침:\n- 배경색: 흰색(#FFFFFF)\n- 레이아웃: 중앙 집중형\n시각 요소:\n1. 중앙:\n   - 빨간 선물상자 🎁 이모지\n   - 크기: 400pt\n2. 선물상자 주위 (상하좌우):\n   - 물음표 ❓ 4개를 대각선으로 배치\n   - 각 크기: 80pt\n   - 회전: 약간씩 다르게\n3. 하단 (85% 위치):\n   - 내용: "안에 뭐가 들었을까?"\n   - 크기: 120pt\n   - 색상: 빨강(#D32F2F)\n   - 두께: 볼드체`
          : `**슬라이드 3 - 복습 (2-4주차)**\n목적: 지난 주 내용 환기\n디자인 지침:\n- 배경색: 흰색(#FFFFFF)\n텍스트 요소:\n1. 상단 (25% 위치):\n   - 내용: "지난주 기억나요?"\n   - 크기: 90pt\n   - 색상: 검정(#000000)\n2. 중앙 (50% 위치):\n   - 내용: ${instrumentEmoji} 이모지\n   - 크기: 250pt\n3. 하단 (75% 위치):\n   - 내용: "다시 만나요!"\n   - 크기: 110pt\n   - 색상: ${colorTheme.primary || '#000000'}`,
        
        // 슬라이드 4: 악기/활동 방법
        weekNum === 1
          ? `**슬라이드 4 - 악기 소개 (1주차)**\n목적: 악기 실물 제시\n디자인 지침:\n- 배경색: 순백색(#FFFFFF)\n- 레이아웃: 중앙 집중, 여백 충분\n이미지 요소:\n1. 중앙:\n   - ${instKey} 실물 사진 1장\n   - 크기: 화면의 60% (가로 기준)\n   - 위치: 정중앙\n   - 스타일: 고화질, 배경 제거된 PNG 권장\n2. 사진 하단 (10cm 아래):\n   - 내용: "${instKey}"\n   - 크기: 100pt\n   - 색상: 검정(#000000)\n   - 두께: 볼드체\n주의사항:\n- 사진 주위 최소 5cm 여백 필수\n- 다른 텍스트나 장식 추가 금지`
          : `**슬라이드 4 - 활동 시범 (2-4주차)**\n목적: 활동 방법 시각적 제시\n디자인 지침:\n- 배경색: 흰색(#FFFFFF)\n- 레이아웃: 좌우 분할 (4:6 비율)\n이미지 요소:\n1. 좌측 (40%):\n   - ${activityType.method || '활동'} 시범 사진\n   - 클로즈업 촬영\n2. 우측 (60%):\n   - 상단: "이렇게!" 텍스트, 150pt, 빨강(#E53935)\n   - 중단: 아래 화살표 ⬇️, 120pt\n   - 하단: 간단한 설명 (1-2줄)\n간격:\n- 사진과 글자 사이 3cm 여백`,
        
        // 슬라이드 5: 핵심 활동
        focus === "탐색"
          ? `**슬라이드 5 - 탐색 활동**\n목적: 악기와 친해지기\n디자인 지침:\n- 배경색: 파스텔 노란색(#FFF9C4)\n텍스트 요소:\n1. 화면 중앙:\n   - 내용: "${instKey} ${instrumentEmoji}"\n   - 크기: 200pt\n   - 색상: 검정(#000000)\n   - 두께: 볼드체\n2. 네 모서리:\n   - 반짝이 ✨ 이모지 4개 배치\n   - 각 크기: 60pt`
          : focus === "기초"
          ? `**슬라이드 5 - 멈춤 신호 연습**\n목적: 규칙 학습\n디자인 지침:\n- 배경색: 빨간색(#FF5252) 전체\n- 강렬한 시각적 임팩트\n시각 요소:\n1. 중앙:\n   - 주먹 ✊ 이모지\n   - 크기: 300pt\n   - 색상: 흰색(#FFFFFF)\n2. 하단:\n   - 내용: "주먹 쥐면 멈춤!"\n   - 크기: 120pt\n   - 색상: 흰색(#FFFFFF)\n   - 두께: 볼드체\n   - 테두리: 검정색 5px 두께\n주의사항:\n- 빨강 배경으로 긴급 신호 강조`
          : focus === "응용"
          ? `**슬라이드 6 - 게임 규칙**\n목적: 놀이 규칙 제시\n디자인 지침:\n- 배경: 노란색(#FFEB3B)과 검정 대각선 줄무늬 (공사 표지판 느낌)\n시각 요소:\n1. 중앙:\n   - 신호등 🚦 이모지\n   - 크기: 250pt\n2. 하단:\n   - 내용: "그대로 멈춰라!"\n   - 크기: 140pt\n   - 색상: 검정(#000000)\n   - 배경: 흰색 둥근 박스 안에 배치`
          : `**슬라이드 6 - 합주 준비**\n목적: 공연 모드 전환\n디자인 지침:\n- 배경색: 검정(#212121)\n- 무대 분위기\n시각 요소:\n1. 상단 (30% 위치):\n   - 지휘봉 🎤 이모지\n   - 크기: 180pt\n   - 색상: 금색(#FFD700)\n2. 중앙 (50% 위치):\n   - 내용: "준비~ 시작!"\n   - 크기: 160pt\n   - 색상: 금색(#FFD700)\n   - 두께: 볼드체\n   - 배경: 흰색 말풍선 박스`,
        
        // 슬라이드 7: OX 퀴즈 (공통)
        `**슬라이드 7 - OX 퀴즈**\n목적: 학습 확인\n디자인 지침:\n- 배경: 좌우 2분할 (좌측 빨강 #F44336 | 우측 파랑 #2196F3)\n시각 요소:\n1. 좌측 중앙:\n   - "O"\n   - 250pt 흰색 볼드\n2. 우측 중앙:\n   - "X"\n   - 250pt 흰색 볼드\n3. 상단:\n   - "맞으면 O, 틀리면 X"\n   - 90pt 검정 흰색`,
        
        // 슬라이드 8: 정리 (공통)
        `**슬라이드 8 - 정리**\n목적: 정리 습관 형성\n디자인 지침:\n- 배경: 연한 베이지(#EFEBE9)\n시각 요소:\n1. 중앙:\n   - 정리함 🗄️ 이모지\n   - 200pt\n2. 하단:\n   - "제자리에 쏙!"\n   - 130pt 갈색(#5D4037)\n3. 주위:\n   - 아래 화살표 ↓ 4개가 정리함 가리킴`,
        
        // 슬라이드 9: 마무리 (공통)
        `**슬라이드 9 - 마무리**\n목적: 따뜻한 인사\n디자인 지침:\n- 배경: 따뜻한 주황색(#FFE0B2)\n시각 요소:\n1. 중앙 상단:\n   - 하트 💝 150pt\n2. 중앙:\n   - "사랑합니다"\n   - 180pt 빨강(#D32F2F)\n   - 손글씨 폰트\n3. 하단:\n   - 배꼽인사 🙇 120pt`
      ];
    };

    setLessonPlan({
      title: weekData.title,
      theme: monthData.theme,
      focus: weekData.focus,
      objective: weekData.desc,
      intro: introText,
      main: mainText,
      conclusion: conclusionText,
      materials: materials,
      safety: "※ 친구 얼굴 쪽으로 악기를 휘두르지 않아요.\n※ 악기를 입에 넣거나 빨지 않아요.",
      tip: `💡 [1학년 지도 Tip] ${weekData.focus === "탐색" ? "아이들은 소리가 나면 계속 치고 싶어 해요. '선생님이 주먹 쥐면 멈춤!' 약속을 놀이처럼 먼저 익혀주세요." : "잘 못해도 괜찮아요. 박자가 틀려도 즐겁게 참여하면 폭풍 칭찬해주세요!"}`,
      refData: refData,
      supplementary: supplementary,
      slidePrompts: getSlidePrompts()
    });
  }, [selectedMonth, selectedWeek, curriculumData]);

  useEffect(() => {
    generateLessonPlan();
  }, [generateLessonPlan]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-stone-200 print:shadow-none print:border-none relative">
        
        {/* Settings Modal */}
        {showSettings && (
          <div className="absolute inset-0 bg-white/95 z-50 p-8 flex flex-col items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
            <button 
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
            >
              <X size={32} />
            </button>
            
            <div className="w-full max-w-2xl space-y-8 my-8">
              <div className="text-center">
                <Settings className="w-16 h-16 text-stone-800 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-stone-800">수업 계획 설정</h2>
                <p className="text-stone-500">연간 계획 파일(CSV)을 업로드하여 커리큘럼을 변경합니다.</p>
              </div>

              {!previewData ? (
                /* 1단계: 파일 업로드 */
                <div className="space-y-4">
                  <div 
                    className={`bg-[#FFFDF9] p-10 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer relative group
                      ${isDragOver ? 'border-orange-500 bg-orange-50' : 'border-stone-300 hover:border-orange-400'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input 
                      type="file" 
                      accept=".csv"
                      ref={fileInputRef}
                      onChange={handleFileInput}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                      <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors ${isDragOver ? 'text-orange-500' : 'text-stone-400 group-hover:text-orange-400'}`} />
                      <p className="font-bold text-stone-700 text-lg">파일을 여기로 드래그하세요</p>
                      <p className="text-sm text-stone-500 mt-2">또는 클릭하여 파일 선택 (CSV)</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={downloadSampleCSV}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 text-stone-700 font-medium transition-colors"
                    >
                      <FileText size={18} />
                      샘플 파일 다운로드
                    </button>
                    <button 
                      onClick={resetCurriculum}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 font-bold transition-colors"
                    >
                      <RotateCcw size={18} />
                      초기 설정 복구
                    </button>
                  </div>
                </div>
              ) : (
                /* 2단계: 미리보기 확인 */
                <div className="space-y-4">
                  <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-stone-100 p-4 border-b border-stone-200 flex justify-between items-center">
                      <h3 className="font-bold text-stone-700 flex items-center gap-2">
                        <FileSpreadsheet size={20} className="text-green-600"/> 
                        데이터 미리보기 ({previewData.rows.length}개 행)
                      </h3>
                      {previewData.hasError && (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded flex items-center gap-1">
                          <AlertTriangle size={12} /> 오류 포함
                        </span>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-stone-100 text-stone-600 font-bold sticky top-0">
                          <tr>
                            <th className="p-3">월</th>
                            <th className="p-3">주</th>
                            <th className="p-3">주제</th>
                            <th className="p-3">상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.rows.map((row: any, idx: number) => (
                            <tr key={idx} className={`border-b border-stone-100 last:border-0 hover:bg-stone-50 ${row.status === 'error' ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                              <td className="p-3">{row.month}</td>
                              <td className="p-3">{row.week}</td>
                              <td className="p-3">{row.title}</td>
                              <td className="p-3">
                                {row.status === 'error' ? (
                                  <span className="text-red-600 font-bold text-xs">{row.message}</span>
                                ) : (
                                  <span className="text-green-600 text-xs flex items-center gap-1"><Check size={12}/> 정상</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={cancelUpload}
                      className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 font-bold transition-colors"
                    >
                      취소
                    </button>
                    <button 
                      onClick={applyUpload}
                      disabled={previewData.hasError}
                      className={`flex-1 py-3 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2
                        ${previewData.hasError ? 'bg-stone-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
                    >
                      <ArrowRight size={18} />
                      {previewData.hasError ? '오류를 수정해주세요' : '적용하기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header Area */}
        <div className="bg-orange-400 p-6 text-white print:bg-white print:text-black print:border-b-2 print:border-orange-400">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Music className="w-8 h-8" />
                두드림(Do-Dream) 리듬 탐험대
              </h1>
              <p className="mt-2 text-orange-100 print:text-gray-600 font-medium">
                물향기초등학교 초등돌봄교실 특기적성 프로그램 (강사: 김경미)
              </p>
            </div>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors print:hidden"
              title="설정 및 파일 업로드"
            >
              <Settings size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="p-6 bg-yellow-50 border-b border-yellow-200 print:hidden">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-bold text-stone-700 mb-1">몇 월인가요? (Month)</label>
              <select 
                value={selectedMonth} 
                onChange={(e) => {
                  setSelectedMonth(Number(e.target.value));
                  setSelectedWeek(1);
                }}
                className="w-full p-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none text-lg font-medium bg-white text-stone-900"
              >
                {monthOrder.map(m => (
                  <option key={m} value={m}>{m}월 - {curriculumData[m].theme.split('(')[0]}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/3">
              <label className="block text-sm font-bold text-stone-700 mb-1">몇째 주인가요? (Week)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(w => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeek(w)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                      selectedWeek === w 
                      ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
                      : 'bg-white text-stone-600 border-2 border-orange-100 hover:bg-orange-50'
                    }`}
                  >
                    {w}주차
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/3 text-right">
              <button 
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-stone-800 text-white px-5 py-3 rounded-xl hover:bg-stone-700 transition-colors shadow-md font-bold"
              >
                <Printer size={20} />
                지도안 인쇄
              </button>
            </div>
          </div>
        </div>

        {/* Lesson Plan Display Area */}
        {lessonPlan && (
          <div className="p-8 print:p-0">
            <div className="border-2 border-stone-200 rounded-2xl p-6 print:border-none print:p-0 bg-white">
              
              {/* Header Info */}
              <div className="border-b-2 border-stone-800 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold print:border print:border-orange-600">
                      {selectedMonth}월 {selectedWeek}주차
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold border bg-green-100 text-green-800 border-green-200">
                      활동: {lessonPlan.focus}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold border bg-stone-100 text-stone-600 border-stone-300">
                      시간: 40분
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-stone-900 tracking-tight">{lessonPlan.title}</h2>
                  <p className="text-stone-500 mt-1 font-bold text-lg">{lessonPlan.theme}</p>
                </div>
                <div className="text-right hidden md:block print:block">
                  <div className="text-sm text-stone-500 font-medium">강사</div>
                  <div className="text-2xl font-bold font-serif text-stone-800">김 경 미</div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Column: Info & Ref */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3 text-lg">
                      <Star size={20} className="fill-indigo-700" /> 학습 목표
                    </h3>
                    <p className="text-stone-700 font-medium leading-relaxed">{lessonPlan.objective}</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3 text-lg">
                      <CheckCircle size={20} /> 준비물
                    </h3>
                    <p className="text-stone-700 font-medium leading-relaxed">{lessonPlan.materials}</p>
                  </div>

                  {/* Reference Section */}
                  {lessonPlan.refData && (
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                      <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
                        <Info size={20} /> 선생님 꿀팁 (지식 백과)
                      </h3>
                      <div className="text-sm text-blue-900 space-y-3">
                        <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 유래</span> {lessonPlan.refData.origin}</p>
                        <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 종류</span> {lessonPlan.refData.types.join(', ')}</p>
                        <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 팁</span> {lessonPlan.refData.tip}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Supplementary Activities (A/B) */}
                  {lessonPlan.supplementary && (
                    <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
                        <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3">
                            <Star size={20} /> 수준별 예비 활동
                        </h3>
                        <div className="text-sm space-y-3">
                            <div className="bg-white p-3 rounded-lg border border-green-200">
                                <span className="font-bold text-green-800 block mb-1">A. 심화 활동 (Level Up)</span>
                                <p className="text-green-900">{lessonPlan.supplementary.A}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-green-200">
                                <span className="font-bold text-green-800 block mb-1">B. 보조 활동 (Level Down)</span>
                                <p className="text-green-900">{lessonPlan.supplementary.B}</p>
                            </div>
                        </div>
                    </div>
                  )}

                  {/* Miricanvas Prompts */}
                  <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 print:hidden relative shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-purple-700 flex items-center gap-2 text-lg">
                        <Monitor size={20} /> 미리캔버스 기획안
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={downloadPromptsAsTxt}
                          className="text-xs px-2 py-1.5 rounded-full flex items-center gap-1 transition-all font-bold bg-white border border-purple-200 text-purple-700 hover:bg-purple-100"
                          title="TXT 파일로 다운로드"
                        >
                          <FileText size={14}/> 저장
                        </button>
                        <button 
                          onClick={() => handleCopy(lessonPlan.slidePrompts.join('\n'), 'all')}
                          className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1 transition-all font-bold ${
                            copyStatus === 'all' 
                            ? 'bg-green-500 text-white shadow-md' 
                            : 'bg-white border border-purple-200 text-purple-700 hover:bg-purple-100'
                          }`}
                        >
                          {copyStatus === 'all' ? <Check size={14}/> : <Copy size={14}/>}
                          {copyStatus === 'all' ? '완료!' : '복사'}
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-purple-600 mb-2 font-medium bg-purple-100 p-2 rounded text-center">
                      * 1-2학년용: 한 장에 그림 하나, 글씨 아주 크게!
                    </p>

                    <ul className="text-sm text-purple-900 space-y-4 max-h-80 overflow-y-auto pr-1">
                      {lessonPlan.slidePrompts.map((prompt: string, idx: number) => (
                        <li 
                          key={idx} 
                          onClick={() => handleCopy(prompt, idx)}
                          className="bg-white border border-purple-100 p-3 rounded-lg cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-all relative group whitespace-pre-wrap"
                          title="클릭하여 복사"
                        >
                          <div className="flex justify-between items-start">
                            <span className="leading-snug">{prompt}</span>
                            {copyStatus === idx && (
                              <span className="shrink-0 text-[10px] text-white bg-green-500 px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 font-bold absolute right-2 top-2">
                                <Check size={10} /> 복사
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Detailed Lesson Plan */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Intro */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-green-400 pl-4 flex items-center">
                      도입 (5분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">마음 열기</span>
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg">
                      {lessonPlan.intro}
                    </div>
                  </div>

                  {/* Development (Detailed) */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-indigo-400 pl-4 flex items-center">
                      전개 (30분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">달크로즈(Dalcroze) 놀이 활동</span>
                    </h3>
                    <div className="bg-indigo-50/30 p-6 rounded-2xl border-2 border-indigo-100 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg font-medium">
                      {lessonPlan.main}
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-orange-400 pl-4 flex items-center">
                      정리 (5분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">마무리 인사</span>
                    </h3>
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg">
                      {lessonPlan.conclusion}
                    </div>
                  </div>

                  {/* Teacher's Tip & Safety */}
                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-yellow-100 p-5 rounded-2xl border border-yellow-300 flex gap-4 shadow-sm">
                      <div className="shrink-0 pt-1">
                        <Smile className="text-orange-600 w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-stone-800 font-bold text-lg whitespace-pre-line">{lessonPlan.tip}</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-5 rounded-2xl border border-red-200 flex gap-4 shadow-sm">
                       <div className="shrink-0 pt-1">
                        <Heart className="text-red-500 w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-red-700 text-lg leading-relaxed whitespace-pre-line font-bold">{lessonPlan.safety}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Miricanvas Prompts for Print (Visible only in print) */}
              <div className="hidden print:block mt-8 pt-6 border-t-2 border-stone-300 page-break-before">
                <h3 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-3">
                  <Monitor className="w-8 h-8" /> 수업용 PPT/미리캔버스 구성안 (1-2학년용)
                </h3>
                <div className="grid grid-cols-2 gap-6">
                   {lessonPlan.slidePrompts.map((prompt: string, idx: number) => (
                      <div key={idx} className="border-2 border-stone-200 p-4 rounded-xl text-base text-stone-800 font-medium bg-white whitespace-pre-wrap">
                        {prompt}
                      </div>
                    ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-stone-200 text-center text-stone-400 text-sm hidden print:block">
                <p>물향기초등학교 초등돌봄교실 특기적성 프로그램 | 강사: 김경미</p>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;