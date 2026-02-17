import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Music, Star, CheckCircle, Printer, Smile, Heart, Monitor, Info, Copy, Check, Settings, Upload, RotateCcw, FileText, X, AlertTriangle, FileSpreadsheet, ArrowRight, History, MessageCircleQuestion } from 'lucide-react';

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState(3);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [lessonPlan, setLessonPlan] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<string | number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  // 파일 업로드 관련 상태
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // 기본 커리큘럼 데이터
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
  const monthOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

  // 악기별 백과사전 데이터 (기존 유지)
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

  // ⭐️ 악기 역사 (시간 여행) 데이터 - 읽기 자료
  const instrumentHistories: any = {
    "쉐이커": `🕰️ 쉐이커의 시간 여행
🌍 1. 아주 먼 옛날, 자연에서 태어났어요
사람들은 아주 오래전부터 말린 박(바가지) 속에 씨앗이나 돌멩이를 넣어 흔들었어요. "사각사각~" 소리가 나는 것을 보고 신기해했죠.
🌍 2. 아프리카 대륙에서 시작된 여행
아프리카 나이지리아의 '쉐케레'가 쉐이커의 조상이에요. 축제 때마다 빠지지 않고 사용되었답니다.
🚢 3. 바다 건너 여행을 떠나요
사람들이 아프리카에서 아메리카로 이동할 때 이 악기도 함께 가져갔어요. 슬픈 역사 속에서도 음악은 계속되었죠.
💃 4. 라틴 아메리카에서 진화했어요
브라질의 삼바 축제에서 신나는 리듬을 담당하는 중요한 악기가 되었어요.
🎸 5. 현대에는요?
요즘은 계란 모양의 '에그 쉐이커'처럼 작고 귀여운 모양으로 변신해서 전 세계 친구들이 사용하고 있어요.`,
    
    "우드블록/캐스터네츠": `🕰️ 우드블록의 시간 여행
🌏 1. 통나무의 변신
아주 먼 옛날, 아시아와 아프리카에서는 속을 파낸 커다란 통나무를 두드려 "똑! 똑!" 신호를 보냈어요. 이것이 우드블록의 조상이에요.
🏯 2. '방자'라고 불렸어요
중국에서는 네모난 나무 조각을 '방자'라고 부르며 연주했어요. 네 가지 다른 소리를 내기도 했답니다.
🏛️ 3. 절에서 들리는 소리
절에서 스님들이 두드리는 '목탁'도 우드블록의 가족이에요. 물고기 모양을 닮아 '목어'라고도 불렸죠.
🎼 4. 오케스트라에 들어갔어요
서양 음악가들이 이 맑고 또랑또랑한 소리에 반해서 오케스트라 연주에 사용하기 시작했어요.
🎸 5. 다양한 모습으로
지금은 플라스틱으로 만든 '잼 블록'이나 드럼 세트에 달린 우드블록까지 아주 다양해졌답니다.`,

    "신체 타악기": `🕰️ 내 몸 악기의 시간 여행
🌍 1. 세상에서 제일 먼저 생긴 악기
악기가 발명되기 전, 원시인들은 어떻게 음악을 만들었을까요? 바로 손뼉을 치고 발을 구르며 소리를 냈어요.
💃 2. 춤추며 소리 내기
옛날 사람들은 사냥을 나가기 전이나 축제를 할 때, 몸을 두드리며 춤을 췄어요.
🎼 3. 악기가 없어도 괜찮아요
노예들이 악기를 빼앗겼을 때, 그들은 자신의 몸을 두드려 리듬을 만들었어요. 이것이 '햄본(Hambone)'이라는 멋진 연주가 되었답니다.
🎤 4. 지금은요?
유튜브에서 '바디 퍼커션'을 검색해보세요. 전 세계 사람들이 입으로, 손으로, 발로 멋진 음악을 만들고 있어요.`,
    
    "탬버린": `🕰️ 탬버린의 시간 여행
🏛️ 1. 고대 그림 속 악기
아주 옛날 이집트나 그리스의 그림을 보면 사람들이 탬버린을 들고 춤추는 모습이 그려져 있어요.
🎪 2. 떠돌이 음악가들의 친구
유럽의 집시들은 여행을 다니며 탬버린을 흔들고 춤을 추며 사람들을 즐겁게 해주었어요.
🎼 3. 오케스트라의 화려한 소리
처음엔 길거리 악기라고 무시받았지만, 나중에는 모차르트 같은 훌륭한 작곡가들이 오케스트라에 탬버린 소리를 넣었답니다.
✨ 4. 두 가지 소리의 비밀
탬버린은 북처럼 '둥둥' 칠 수도 있고, 흔들어서 '찰랑찰랑' 소리도 낼 수 있는 매력 만점 악기예요.`,
    
    "트라이앵글": `🕰️ 트라이앵글의 시간 여행
🔺 1. 세모난 모양의 비밀
아주 옛날에는 네모 모양이나 고리 모양도 있었지만, 세모 모양이 소리가 가장 예쁘게 울려서 지금의 모습이 되었어요.
👑 2. 왕의 행진
유럽의 왕들이 행진할 때, 트라이앵글의 맑은 소리가 "비키세요~" 하고 길을 여는 신호로 쓰였대요.
🎼 3. 작지만 강한 소리
오케스트라 악기들 중에서 크기는 제일 작지만, 소리가 아주 높고 맑아서 100명이 연주해도 트라이앵글 소리는 뚫고 들려요.
✨ 4. 울림을 멈춰라
줄을 잡으면 소리가 길게 나지만, 손으로 쇠를 잡으면 소리가 '뚝' 끊겨요. 이 기술을 '뮤트'라고 해요.`,

    "북(젬베/소고)": `🕰️ 북의 시간 여행
🐘 1. 둥둥둥 신호 보내기
전화기가 없던 시절, 아프리카 사람들은 아주 큰 북을 쳐서 멀리 있는 마을에 소식을 전했어요. "사자가 나타났다!"
🥁 2. 심장 소리를 닮았어요
북소리는 엄마 뱃속에서 듣던 심장 소리와 비슷해서, 들으면 마음이 편안해지기도 하고 흥분되기도 해요.
🇰🇷 3. 우리나라의 소고
옛날 농부 아저씨들은 힘든 일을 할 때 소고를 치며 힘을 냈어요. 모자에 긴 끈(상모)을 달고 돌리며 춤을 추기도 했죠.
🌍 4. 세계의 북
손으로 치는 젬베, 채로 치는 장구, 발로 밟는 베이스 드럼까지 북의 종류는 정말 많아요.`,
  };

  // ⭐️ 미리캔버스 AI 프롬프트용 데이터 (악기별 5단 구성) - 초등 저학년용 강화 버전
  const instrumentPPTTemplates: any = {
    "트라이앵글": {
      slide1: { img: "귀여운 트라이앵글 캐릭터가 왕관을 쓰고 웃으며 인사하는 모습, 초등 저학년 동화책 일러스트 스타일, 부드러운 파스텔 톤, 반짝이는 배경 효과, 3D 렌더링 느낌의 둥글둥글한 캐릭터", text: "트라이앵글의 시간 여행" },
      slide2: { img: "과거의 네모, 동그라미 모양 트라이앵글들이 찌그러져 있고, 현재의 세모 트라이앵글이 빛나는 모습, 마법 같은 분위기, 꿈몽환적인 색감, 유아용 애니메이션 스타일", text: "옛날에는 네모, 동그라미 모양도 있었어요. 하지만 세모 모양이 소리가 가장 예뻐서 지금처럼 생겼답니다!" },
      slide3: { img: "동화 속 왕의 행진 퍼레이드, 트라이앵글 캐릭터가 맨 앞에서 지휘봉을 흔드는 모습, 화려한 색감, 폭죽 효과, 즐거운 축제 분위기, 파스텔 톤", text: "옛날 유럽 왕의 행진 때, 트라이앵글 소리로 \"비켜주세요!\" 하고 길을 열었어요." },
      slide4: { img: "거대한 오케스트라 무대, 아주 작은 트라이앵글이 가장 밝게 빛나며 소리를 내는 모습, 스포트라이트 효과, 대비되는 크기, 신비로운 분위기, 귀여운 3D 아트", text: "크기는 가장 작지만, 소리는 가장 높고 맑아서 100명이 연주해도 우리 소리가 들린답니다!" },
      slide5: { img: "트라이앵글 캐릭터가 손으로 몸을 잡자 소리 요정들이 잠드는 모습, '쉿' 하는 제스처, 마법이 멈추는 듯한 시각적 효과, 부드러운 색감", text: "줄을 잡으면 소리가 길게 울리고, 손으로 쇠를 잡으면 '뚝' 끊겨요. 이 기술을 '뮤트'라고 한답니다!" }
    },
    "쉐이커": {
      slide1: { img: "알록달록한 마라카스와 에그 쉐이커 캐릭터가 손을 잡고 춤추는 모습, 3D 클레이 아트 스타일, 따뜻한 난색 계열 파스텔 톤, 멜로디가 떠다니는 배경", text: "쉐이커의 시간 여행" },
      slide2: { img: "원시시대 숲속, 귀여운 원시인 아이가 말린 박(열매)을 흔들자 씨앗들이 춤추는 상상도, 따뜻하고 포근한 동화 그림체", text: "아주 먼 옛날, 열매 속에 씨앗이 말라서 '찰찰' 소리가 나는 것을 보고 악기로 쓰기 시작했어요." },
      slide3: { img: "아프리카 초원, 동물들과 사람들이 어우러져 쉐이커를 흔드는 축제, 디즈니 애니메이션 스타일, 활기찬 에너지, 밝은 색감", text: "아프리카의 축제에서는 쉐이커가 빠지지 않았어요. 춤출 때 리듬을 만들어주거든요!" },
      slide4: { img: "화려한 깃털 장식을 한 삼바 댄서들과 쉐이커 캐릭터가 퍼레이드하는 모습, 반짝이는 효과, 꽃가루가 날리는 축제 분위기", text: "브라질 삼바 축제에서도 쉐이커는 엉덩이를 들썩이게 만드는 중요한 악기랍니다." },
      slide5: { img: "쉐이커 캐릭터가 '얼음!' 하고 멈춰있는 모습, 주변의 음표들도 공중에 정지한 재미있는 연출, 만화적 표현", text: "흔들면 '촥촥' 소리가 나지만, 멈추면 소리도 딱! 멈춰야 멋진 연주가 돼요." }
    },
    "우드블록/캐스터네츠": {
      slide1: { img: "숲속 음악회, 나무로 만든 우드블록과 캐스터네츠 요정들이 연주하는 모습, 수채화 풍의 부드러운 배경, 초록빛 파스텔 톤", text: "나무 친구들의 시간 여행" },
      slide2: { img: "커다란 통나무 할아버지 주위로 아기 우드블록들이 모여 이야기를 듣는 모습, 따뜻한 숲속 풍경, 귀여운 캐릭터 디자인", text: "우드블록의 할아버지는 속이 빈 큰 통나무였어요. 두드리면 숲 전체에 소리가 울려 퍼졌죠." },
      slide3: { img: "동자승 캐릭터가 목탁을 치며 미소 짓는 모습, 옆에서 우드블록이 따라하는 장면, 평화롭고 귀여운 일러스트", text: "절에서 스님들이 쓰는 '목탁'도 우드블록의 가족이에요. 소리가 정말 비슷하죠?" },
      slide4: { img: "우드블록 소리에 맞춰 말이 신나게 달리는 모습, 말발굽에서 음표가 튀어나오는 효과, 역동적이지만 귀여운 스타일", text: "우드블록을 '따그닥' 연주하면 말발굽 소리와 똑같아서 음악 속에서 말 달리는 소리를 낼 때 써요." },
      slide5: { img: "캐스터네츠 캐릭터가 입을 짝짝 벌리며 노래하는 클로즈업 샷, 조개 모양의 특징을 살린 귀여운 표정, 밝은 파스텔 톤", text: "캐스터네츠는 조개를 닮았어요. 입을 짝짝 벌렸다 닫으며 경쾌한 소리를 내요." }
    },
    "탬버린": {
      slide1: { img: "탬버린 공주님 캐릭터가 찰랑이는 리본과 함께 춤추는 모습, 순정 만화 풍의 예쁜 그림체, 핑크와 보라 파스텔 톤", text: "탬버린의 시간 여행" },
      slide2: { img: "고대 이집트 벽화 속 인물들이 귀엽게 2등신 캐릭터로 변해 탬버린을 치는 모습, 유머러스하고 귀여운 스타일", text: "아주 옛날 이집트 사람들도 탬버린을 흔들며 춤을 췄다는 그림이 남아있어요." },
      slide3: { img: "캠프파이어 주위에서 춤추는 집시 고양이들, 탬버린을 흔드는 모습, 낭만적이고 따뜻한 밤 분위기", text: "여행을 좋아하는 집시들은 탬버린 하나만 있으면 어디서든 신나는 파티를 열었답니다." },
      slide4: { img: "탬버린 캐릭터가 북 치기(둥둥)와 흔들기(찰찰) 묘기를 부리는 모습, 서커스 같은 즐거운 분위기, 만화적 효과", text: "탬버린은 재주꾼이에요! 북처럼 칠 수도 있고, 흔들어서 찰랑찰랑 소리도 낼 수 있거든요." },
      slide5: { img: "탬버린을 빠르게 흔들자 별가루가 쏟아지는 마법 같은 장면, 트레몰로 효과의 시각화, 반짝이는 파스텔 톤", text: "손을 빠르게 흔들면 '르르르~' 하는 멋진 떨림 소리(트레몰로)를 낼 수 있어요!" }
    },
    "신체 타악기": {
      slide1: { img: "다양한 인종의 아이들이 둥글게 서서 손뼉 치고 발 구르는 모습, 지구본 위에서의 축제, 밝고 희망찬 파스텔 톤", text: "내 몸 악기의 시간 여행" },
      slide2: { img: "귀여운 원시인 가족이 동굴 앞에서 춤추며 배와 엉덩이를 두드리는 모습, 익살스러운 표정, 따뜻한 색감", text: "악기가 없던 아주 먼 옛날에는 우리 몸이 유일한 악기였어요." },
      slide3: { img: "악기가 없는 상황에서도 몸을 두드리며 즐겁게 노래하는 사람들, 뮤지컬의 한 장면 같은 연출, 긍정적인 에너지", text: "악기가 없을 때도 사람들은 가슴을 두드리고 손뼉을 치며 희망의 노래를 불렀답니다." },
      slide4: { img: "아이의 가슴 속에 하트 모양의 북이 쿵쿵 뛰는 투시도 같은 그림, 따뜻하고 사랑스러운 일러스트", text: "우리 몸에는 '심장'이라는 북이 있어요. 언제나 쿵쿵 뛰며 리듬을 만들고 있죠." },
      slide5: { img: "손바닥, 발, 무릎 캐릭터들이 모여 합주하는 모습, 의인화된 신체 부위들, 재미있고 교육적인 이미지", text: "손뼉, 무릎, 발구르기! 우리 몸의 여러 곳을 두드리면 드럼 세트보다 멋진 소리가 나요." }
    },
    "북(젬베/소고)": {
      slide1: { img: "통통한 북 캐릭터가 북채를 들고 행진하는 모습, 장난감 병정 스타일, 씩씩하고 귀여운 느낌, 파스텔 블루 톤", text: "북의 시간 여행" },
      slide2: { img: "구름 위 산꼭대기에서 아기 곰이 북을 쳐서 아래 마을 친구에게 신호를 보내는 모습, 동화책 삽화 스타일", text: "전화기가 없던 시절에는 큰 북을 둥둥 쳐서 멀리 있는 친구에게 소식을 전했어요." },
      slide3: { img: "한복을 입은 호랑이 캐릭터가 상모를 돌리며 소고를 치는 모습, 한국적인 문양과 파스텔 톤의 조화", text: "우리나라 농부 아저씨들은 힘든 일을 할 때 소고를 치고 춤을 추며 힘을 냈답니다." },
      slide4: { img: "엄마 캥거루 주머니 속에서 아기 캥거루가 잠든 모습, 심장 박동 기호가 은은하게 떠있는 배경, 포근한 느낌", text: "북소리는 엄마 뱃속에서 듣던 심장 소리와 닮아서 들으면 마음이 편안해져요." },
      slide5: { img: "북의 가운데를 칠 때 큰 파동이, 테두리를 칠 때 작은 파동이 퍼지는 과학적이지만 예쁜 이미지", text: "북의 가운데를 치면 '쿵!', 가장자리를 치면 '톡!' 서로 다른 소리가 나요." }
    },
    "라틴 퍼커션": {
      slide1: { img: "파인애플, 야자수, 그리고 라틴 악기들이 선글라스를 끼고 해변에서 춤추는 모습, 여름 분위기 물씬 풍기는 쨍한 파스텔 톤", text: "라틴 악기들의 시간 여행" },
      slide2: { img: "뜨거운 태양 아래 남미의 정글, 앵무새와 원숭이가 악기를 연주하는 모습, 알록달록한 색감, 3D 애니메이션 스타일", text: "우리는 일 년 내내 더운 나라에서 왔어요. 뜨거운 태양처럼 신나는 소리를 가지고 있죠!" },
      slide3: { img: "음메~ 소 목에 걸려있던 종이 멋진 카우벨 악기로 변신하는 과정, 마법 소녀 변신 장면 같은 연출", text: "카우벨은 원래 소 목에 달던 종이었어요. 지금은 멋진 악기가 되었답니다." },
      slide4: { img: "빨래판을 긁는 너구리와 귀로(Guiro)를 긁는 아이의 모습이 오버랩, '드르륵' 글자 효과, 귀여운 스타일", text: "귀로는 빨래판처럼 울퉁불퉁해요. 막대로 긁으면 '드르륵~' 재미있는 소리가 나요." },
      slide5: { img: "기차 놀이를 하듯 줄지어 가며 춤추는 악기 캐릭터들, 칙칙폭폭 연기 효과, 리듬감이 느껴지는 구도", text: "라틴 악기들은 가만히 서서 연주하는 것보다 춤추고 행진하면서 연주해야 제맛이에요!" }
    },
    "default": {
      slide1: { img: "다양한 악기 친구들이 무지개 미끄럼틀을 타고 내려오는 모습, 환상적인 놀이공원 배경, 3D 렌더링 스타일", text: "즐거운 악기 여행" },
      slide2: { img: "숲속에서 새소리, 물소리를 들으며 지휘하는 다람쥐, 자연 친화적인 동화 일러스트, 부드러운 초록색감", text: "모든 악기는 자연의 소리를 흉내 내며 만들어졌어요." },
      slide3: { img: "원시시대부터 미래시대까지 사람들이 춤추는 모습이 파노라마처럼 펼쳐지는 배경, 귀여운 캐릭터들", text: "아주 옛날부터 사람들은 기쁠 때나 슬플 때나 항상 음악과 함께했답니다." },
      slide4: { img: "서로 다른 색깔의 물감들이 섞여 아름다운 그림이 되듯, 악기 소리들이 어우러지는 추상적이고 예쁜 이미지", text: "혼자 내는 소리도 예쁘지만, 친구들과 함께 어울리면 더 아름다운 소리가 나요." },
      slide5: { img: "악기를 아기 다루듯 소중히 안고 있는 아이의 모습, 하트가 뿅뿅 나오는 효과, 따뜻한 파스텔 톤", text: "악기를 소중하게 다루는 친구가 진짜 멋진 연주자랍니다!" }
    }
  };

  // ⭐️ 어린이 용어 사전 (매주 내용에 따라 자동 매핑)
  const getTerms = (instKey: string, week: number) => {
    const commonTerms = [
      { term: "타악기", desc: "손이나 막대로 두드려서 소리 내는 악기" },
      { term: "셈여림", desc: "소리의 크기(큰 소리와 작은 소리)" },
    ];
    
    const specificTerms: any = {
      "신체 타악기": [
        { term: "바디 퍼커션", desc: "도구 없이 내 몸을 두드려 악기처럼 연주하는 것" },
        { term: "탐색", desc: "소리가 어떻게 나는지 자세히 관찰하고 찾아보는 것" }
      ],
      "쉐이커": [
        { term: "쉐이커", desc: "흔들어서 '촥촥' 소리를 내는 악기" },
        { term: "트레몰로", desc: "악기를 아주 빠르게 흔들어서 떨리는 소리를 내는 것" }
      ],
      "우드블록/캐스터네츠": [
        { term: "우드블록", desc: "나무를 깎아 만든 네모난 악기, 말발굽 소리가 나요" },
        { term: "비트", desc: "심장 박동처럼 일정하게 쿵, 쿵, 쿵 뛰는 박자" }
      ],
      "탬버린": [
        { term: "피부(Head)", desc: "탬버린의 가죽 부분, 손가락으로 톡톡 쳐요" },
        { term: "징글", desc: "탬버린 옆에 달린 짤랑거리는 작은 금속 원반" }
      ],
      "트라이앵글": [
        { term: "뮤트(Mute)", desc: "울리는 소리를 손으로 잡아 멈추게 하는 것" },
        { term: "공명", desc: "소리가 널리 널리 울려 퍼지는 현상" }
      ],
      "앙상블": [
        { term: "앙상블", desc: "여럿이 함께 마음을 모아 연주하는 것" },
        { term: "지휘자", desc: "연주자들에게 신호를 보내 음악을 이끄는 대장님" }
      ],
      "일반": [
        { term: "크레센도", desc: "소리를 점점 크게! (개미 목소리 → 사자 목소리)" },
        { term: "데크레센도", desc: "소리를 점점 작게..." },
        { term: "오스티나토", desc: "기차 바퀴처럼 계속 반복되는 리듬" },
        { term: "캐논", desc: "돌림 노래 (앞 친구를 따라 시간차를 두고 연주)" }
      ]
    };

    let terms = [...commonTerms];
    if (specificTerms[instKey]) {
      terms = [...terms, ...specificTerms[instKey]];
    }
    // 주차별 추가 용어
    if (week === 2) terms.push(specificTerms["일반"][0]); // 크레센도
    if (week === 3) terms.push(specificTerms["일반"][2]); // 오스티나토
    if (week === 4) terms.push(specificTerms["일반"][3]); // 캐논

    return terms.slice(0, 5); // 최대 5개만 표시
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
           alert("복사에 실패했습니다.");
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
        doFallbackCopy();
      }
    } else {
      doFallbackCopy();
    }
  };

  // CSV 처리 관련 함수들 (기존 유지)
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); const files = e.dataTransfer.files; if (files.length > 0) processFile(files[0]); };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => { const files = e.target.files; if (files && files.length > 0) processFile(files[0]); };
  
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
          if (insideQuotes && line[j + 1] === '"') { currentCell += '"'; j++; } else { insideQuotes = !insideQuotes; }
        } else if (char === ',' && !insideQuotes) { cells.push(currentCell.trim()); currentCell = ''; } else { currentCell += char; }
      }
      cells.push(currentCell.trim());
      rows.push(cells);
    }
    return rows;
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
      } catch (error) { alert("CSV 파일 처리 중 오류가 발생했습니다."); }
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
    setShowSettings(false);
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
  };
  
  const downloadPromptsAsTxt = () => {
    if (!lessonPlan || (!lessonPlan.lessonSlidePrompts && !lessonPlan.historySlidePrompts)) return;
    
    let content = "";
    if (lessonPlan.lessonSlidePrompts) {
        content += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[수업 진행 슬라이드]\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        content += lessonPlan.lessonSlidePrompts.map((prompt: string, idx: number) => `슬라이드 ${idx + 1}\n${prompt}`).join('\n\n');
        content += "\n\n";
    }
    if (lessonPlan.historySlidePrompts) {
        content += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n[악기 시간 여행 슬라이드]\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        content += lessonPlan.historySlidePrompts.map((prompt: string, idx: number) => `슬라이드 ${idx + 1}\n${prompt}`).join('\n\n');
    }

    const header = `${lessonPlan.title} - 수업 슬라이드 프롬프트 모음\n생성일: ${new Date().toLocaleDateString('ko-KR')}\n\n`;
    const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${selectedMonth}월${selectedWeek}주_슬라이드프롬프트.txt`;
    link.click();
  };

  // ⭐️ 달크로즈 기반 상세 전개 활동 (교사 멘트 및 구체적 방법 포함)
  const generateDalcrozeMain = (week: number, instKey: string, theme: string) => {
    const templates: any = {
      1: `[활동 1: 소리 탐색과 반응 - "얼음 땡!"]
- 달크로즈 원리: 즉각 반응 (Reaction)
- 준비물: 피아노 또는 드럼
- 교사 역할: 불규칙한 리듬을 연주하다가 갑자기 멈춤
1. 교사: "선생님이 악기를 연주하면 자유롭게 걷고, 멈추면 그대로 얼음이 되어주세요!"
2. 아이들은 소리에 맞춰 걷다가 소리가 멈추면 가장 재미있는 포즈로 멈춥니다.
3. 발전: 높은 음에는 까치발로, 낮은 음에는 무릎을 굽히고 걷게 합니다.

[활동 2: 악기 인사 - "반가워 악기야"]
- 달크로즈 원리: 감각 깨우기
1. 악기를 바닥에 두고 눈으로 먼저 관찰합니다. (만지지 않기 약속)
2. 교사: "검지 손가락 하나만 꺼내볼까요? 악기의 배꼽을 살짝 눌러보세요."
3. 교사의 '시작' 신호에 마음껏 소리를 내보고, '주먹' 신호(침묵)에 악기를 몸 뒤로 숨깁니다.

[활동 3: 흉내 내기 - "메아리 놀이"]
- 달크로즈 원리: 모방 (Imitation)
1. 교사가 먼저 짧은 리듬(예: 쿵-쿵-짝)을 연주합니다.
2. 교사: "선생님 소리를 듣고 앵무새처럼 똑같이 따라 해보세요."
3. 아이들은 들은 리듬을 그대로 악기로 연주합니다.`,

      2: `[활동 1: 셈여림 걷기 - "거인과 요정"]
- 달크로즈 원리: 뉘앙스 표현 (Nuance)
1. 교사가 큰 소리(f)를 내면 아이들은 무거운 거인처럼 "쿵! 쿵!" 걷습니다.
2. 교사가 작은 소리(p)를 내면 요정처럼 가볍게 "사뿐 사뿐" 걷습니다.
3. 교사: "이번엔 악기로 표현해볼까요? 거인 소리(세게), 요정 소리(약하게)!"

[활동 2: 박자 지키기 - "리듬 기차"]
- 달크로즈 원리: 박자 유지 (Tempo)
1. 모두 둥글게 앉아 악기를 준비합니다.
2. 교사가 일정한 박자(비트)를 주면, 그 박자에 맞춰 다 같이 연주합니다.
3. 교사: "기차가 빨라집니다(아첼레란도)!" → 점점 빠르게 연주
4. 교사: "기차가 역에 도착합니다(리타르단도)..." → 점점 느리게 연주하다 정지

[활동 3: 파트너 게임 - "거울 놀이"]
1. 두 명씩 짝을 짓고 마주 봅니다.
2. 한 친구가 거울이 되어, 친구가 악기를 흔드는 모습과 똑같이 따라 합니다.
3. 교사: "소리뿐만 아니라 친구의 표정과 몸짓도 똑같이 따라 해보세요."`,

      3: `[활동 1: 리듬 대화 - "무엇이든 물어보세요"]
- 달크로즈 원리: 즉흥 연주 (Improvisation)
1. 교사: "말로 하지 않고 악기로 대화할 거예요. 선생님이 '똑.똑.똑?' 하고 물으면 여러분이 대답해주세요."
2. 교사(질문): ♩ ♩ ♩ ? (악기 연주)
3. 학생(대답): ♫ ♩ ! (자신만의 리듬으로 대답)
4. 짝꿍끼리 주고받기를 시킵니다.

[활동 2: 청개구리 놀이 - "반대로 해요"]
- 달크로즈 원리: 억제와 집중 (Inhibition)
1. 교사: "이번엔 청개구리가 되어볼까요? 선생님과 반대로 행동해야 해요."
2. 교사가 '큰 소리'를 내면 아이들은 '작은 소리'를 냅니다.
3. 교사가 '빠르게' 연주하면 아이들은 '느리게' 연주합니다.
4. 틀린 친구는 웃으면서 "개굴!" 하고 외치기 벌칙을 줍니다.

[활동 3: 오스티나토 - "리듬 바퀴"]
1. 1분단은 "쿵 쿵 쿵 쿵" (단순한 박자)을 계속 연주합니다.
2. 2분단은 그 위에서 자유롭게 리듬을 연주합니다.
3. 교사: "1분단 친구들이 바퀴처럼 튼튼하게 받쳐줘야 2분단이 춤을 출 수 있어요."`,

      4: `[활동 1: 꼬마 지휘자 - "나를 따르라"]
- 달크로즈 원리: 신체 표현과 리드
1. 한 어린이가 앞에 나와 지휘자가 됩니다.
2. 지휘자가 손을 높이 들면 '큰 소리', 낮추면 '작은 소리', 주먹 쥐면 '멈춤'입니다.
3. 나머지 친구들은 지휘자의 손끝만 바라보며 연주합니다.

[활동 2: 움직이는 악보 - "캐논 놀이"]
- 달크로즈 원리: 다성부 청음 (Canon)
1. '곰 세 마리' 노래를 부르며 1모둠이 먼저 율동과 연주를 시작합니다.
2. 한 소절 뒤에 2모둠이 똑같이 따라 시작합니다. (돌림 노래)
3. 교사: "내 소리만 듣지 말고 친구 소리도 잘 들어야 헷갈리지 않아요!"

[활동 3: 미니 콘서트 - "우리는 하나"]
1. 그동안 배운 리듬 중 가장 자신 있는 것을 골라 합주합니다.
2. 시작 전 배꼽 인사를 하고, 끝난 후 관객들에게 인사하는 무대 매너를 배웁니다.
3. 교사: "틀려도 괜찮아요. 끝까지 웃으면서 하는 게 진짜 멋진 연주자예요!"`
    };
    return templates[week] || templates[1];
  };

  // ⭐️ 안전 지도 (주차별 구체화)
  const getSafetyRule = (week: number, inst: string) => {
    switch(week) {
      case 1: return `※ 탐색 시간입니다. 악기를 입에 넣거나 빨지 않도록 주의시켜 주세요.\n※ 친구 귀 가까이에서 큰 소리를 내지 않아요.`;
      case 2: return `※ 악기를 너무 세게 두드리면 악기가 아파요(망가져요). 살살 다뤄주세요.\n※ ${inst}을(를) 바닥에 던지지 않아요.`;
      case 3: return `※ 이동하며 연주할 때 친구와 부딪히지 않도록 '안전거리'를 유지해요.\n※ 흥분해서 악기를 휘두르지 않도록 침착하게 지도해주세요.`;
      case 4: return `※ 채(Stick)나 악기를 들고 장난치지 않아요 (눈 찌름 주의).\n※ 합주가 끝나면 제자리에 차분히 정리해요.`;
      default: return `※ 친구와 사이좋게 악기를 나눠 써요.`;
    }
  };

  // ⭐️ 학년별 지도 팁 (1학년/2학년 분리)
  const getTeacherTip = (week: number) => {
    const tips: any = {
      1: {
        g1: "💡 [1학년] 아이들은 소리가 나면 계속 치고 싶어 해요. '선생님이 주먹 쥐면 멈춤!' 약속을 놀이처럼 가장 먼저 익혀주세요.",
        g2: "💡 [2학년] 악기의 소리가 어떻게 다른지 말로 표현해보게 하세요. (예: 둔탁해요, 뾰족해요, 부드러워요)"
      },
      2: {
        g1: "💡 [1학년] 박자가 틀려도 괜찮아요. 큰 동작으로 리듬을 타는 즐거움을 느끼게 해주세요. 폭풍 칭찬 필수!",
        g2: "💡 [2학년] 친구의 소리를 듣고 정확한 타이밍에 맞춰 들어오는 정교한 리듬감을 격려해주세요."
      },
      3: {
        g1: "💡 [1학년] 정답은 없어요! 아이들의 엉뚱한 상상력과 창의적인 연주를 있는 그대로 인정하고 박수 쳐주세요.",
        g2: "💡 [2학년] 리더 역할을 돌아가며 맡겨보세요. 친구들을 이끄는 과정에서 자신감이 자라납니다."
      },
      4: {
        g1: "💡 [1학년] 합주가 완벽하지 않아도 '우리가 함께 해냈다'는 성취감을 강조하며 마무리해주세요.",
        g2: "💡 [2학년] 나의 소리보다 친구들의 소리를 듣는 '경청'의 태도가 가장 훌륭한 연주 태도임을 알려주세요."
      }
    };
    const t = tips[week] || tips[1];
    return `${t.g1}\n${t.g2}`;
  };

  const generateLessonPlan = useCallback(() => {
    const monthData = curriculumData[selectedMonth];
    if (!monthData) return;
    const weekData = monthData.weeks.find((w: any) => w.week === parseInt(selectedWeek.toString()));
    if (!weekData) return;

    const instKey = monthData.instKey || "신체 타악기";
    const theme = monthData.theme || "리듬 탐험";

    const introText = `• [분위기 조성] 반갑게 인사하고 출석을 부릅니다.\n• [동기 유발] ${instKey} 소리를 들려주며 호기심을 자극합니다. "상자 속에서 무슨 소리가 날까?"\n• [약속] 즐거운 음악 시간을 위해 선생님의 신호(주먹 쥐면 멈춤)를 약속합니다.`;
    const conclusionText = `• [느낌 나누기] 오늘 활동 중 가장 재미있었던 점을 이야기합니다.\n• [칭찬] 질서를 지키며 열심히 참여한 친구들에게 칭찬 도장을 찍어줍니다.\n• [정리] "악기야 잘 자~" 인사하며 악기를 정리함에 넣고 수업을 마칩니다.`;
    
    // 신규 함수 적용
    const mainText = generateDalcrozeMain(selectedWeek, instKey, theme);
    const safetyText = getSafetyRule(selectedWeek, instKey);
    const tipText = getTeacherTip(selectedWeek);
    const termsData = getTerms(instKey, selectedWeek);
    const historyText = instrumentHistories[instKey] || instrumentHistories["신체 타악기"]; // 없을 경우 기본값

    // 준비물
    const getMaterials = () => {
      const basic = "스피커, 출석부";
      const instrument = instKey === "신체 타악기" ? "편안한 복장" : `${instKey} (학생 수만큼)`;
      let specific = "";
      switch (parseInt(selectedWeek.toString())) {
        case 1: specific = "소리 상자, 촉감 카드"; break;
        case 2: specific = "리듬 카드, 메트로놈"; break;
        case 3: specific = "멈춤 신호판, 스티커"; break;
        case 4: specific = "지휘봉, 무대 소품"; break;
        default: specific = "활동지";
      }
      return `${basic}, ${instrument}, ${specific}`;
    };

    // ⭐️ 1. 수업용 슬라이드 프롬프트 (수업 진행용)
    const getLessonSlidePrompts = () => {
        return [
            `[수업 1 - 표지]\n이미지: 즐거운 음악 교실 풍경, 알록달록한 음표가 떠다니는 배경, 귀여운 3D 동물 친구들이 ${instKey}를 들고 웃고 있는 모습, 따뜻한 파스텔톤, 클레이 아트 스타일\n텍스트: ${weekData.title}\n부제: ${monthData.theme}`,
            `[수업 2 - 학습 목표]\n이미지: 보물지도를 들고 탐험하는 귀여운 탐정 캐릭터, 돋보기, 물음표 아이콘, 호기심 가득한 표정, 밝은 노란색 배경\n텍스트: <오늘의 미션>\n1. ${instKey}와 친구하기\n2. 신나는 리듬 놀이`,
            `[수업 3 - 활동 규칙]\n이미지: 부엉이 선생님 캐릭터가 손가락으로 '쉿' 하는 모습과 귀를 기울이는 모습, 약속 아이콘(새끼손가락), 차분하고 따뜻한 색감\n텍스트: 약속해줘요\n주먹 ✊ = 멈춤\n손바닥 🖐 = 연주 시작`,
            `[수업 4 - 마무리]\n이미지: 무대 위에서 아이들이 모두 함께 박수치며 환호하는 모습, 하늘에서 떨어지는 꽃가루와 별, 칭찬 도장 그래픽, 행복한 분위기\n텍스트: 참 잘했어요!\n우리 다음 시간에 또 만나요~`
        ];
    };

    // ⭐️ 2. 악기 시간 여행 프롬프트 (역사/유래용)
    const getHistorySlidePrompts = () => {
        const data = instrumentPPTTemplates[instKey] || instrumentPPTTemplates["default"];
        return [
            `[역사 1 - 표지]\n이미지: ${data.slide1.img}\n텍스트: ${data.slide1.text}`,
            `[역사 2 - 유래]\n이미지: ${data.slide2.img}\n텍스트: ${data.slide2.text}`,
            `[역사 3 - 쓰임]\n이미지: ${data.slide3.img}\n텍스트: ${data.slide3.text}`,
            `[역사 4 - 특징]\n이미지: ${data.slide4.img}\n텍스트: ${data.slide4.text}`,
            `[역사 5 - 주법]\n이미지: ${data.slide5.img}\n텍스트: ${data.slide5.text}`,
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
      materials: getMaterials(),
      safety: safetyText,
      tip: tipText,
      refData: instrumentEncyclopedia[instKey] || instrumentEncyclopedia["신체 타악기"],
      history: historyText,
      terms: termsData,
      lessonSlidePrompts: getLessonSlidePrompts(),   // 수업용
      historySlidePrompts: getHistorySlidePrompts(), // 역사용
      supplementary: {
          A: `[심화] 리더가 되어 친구들을 이끌어보거나, 더 복잡한 리듬(엇박자)에 도전합니다.`,
          B: `[기초] 교사의 손을 잡고 함께 연주하며 박자감을 몸으로 익힙니다.`
      }
    });
  }, [selectedMonth, selectedWeek, curriculumData]);

  useEffect(() => { generateLessonPlan(); }, [generateLessonPlan]);
  const handlePrint = () => { window.print(); };

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-4 md:p-8 font-sans text-stone-800">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-stone-200 print:shadow-none print:border-none relative">
        
        {/* Settings Modal (기존 유지) */}
        {showSettings && (
          <div className="absolute inset-0 bg-white/95 z-50 p-8 flex flex-col items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
             <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"><X size={32} /></button>
             <div className="w-full max-w-2xl space-y-8 my-8">
                <div className="text-center">
                    <Settings className="w-16 h-16 text-stone-800 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-stone-800">수업 계획 설정</h2>
                    <p className="text-stone-500">CSV 파일을 업로드하여 커리큘럼을 변경합니다.</p>
                </div>
                {!previewData ? (
                    <div className="space-y-4">
                        <div className={`bg-[#FFFDF9] p-10 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer relative group ${isDragOver ? 'border-orange-500 bg-orange-50' : 'border-stone-300 hover:border-orange-400'}`}
                            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileInput} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                            <div className="pointer-events-none"><Upload className="w-12 h-12 mx-auto mb-3 text-stone-400" /><p className="font-bold text-stone-700">파일 업로드</p></div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={downloadSampleCSV} className="flex-1 py-3 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 text-stone-700 font-medium">샘플 다운로드</button>
                            <button onClick={resetCurriculum} className="flex-1 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 font-bold">초기화</button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-stone-100 p-4 rounded-xl font-bold flex justify-between"><span>미리보기 ({previewData.rows.length}개)</span>{previewData.hasError && <span className="text-red-600">오류 포함</span>}</div>
                        <div className="flex gap-3">
                            <button onClick={cancelUpload} className="flex-1 py-3 bg-stone-100 text-stone-600 rounded-xl">취소</button>
                            <button onClick={applyUpload} disabled={previewData.hasError} className={`flex-1 py-3 text-white rounded-xl ${previewData.hasError ? 'bg-stone-400' : 'bg-blue-600'}`}>적용</button>
                        </div>
                    </div>
                )}
             </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-orange-400 p-6 text-white print:bg-white print:text-black print:border-b-2 print:border-orange-400">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><Music className="w-8 h-8" /> 두드림(Do-Dream) 리듬 탐험대</h1>
              <p className="mt-2 text-orange-100 print:text-gray-600 font-medium">물향기초등학교 초등돌봄교실 특기적성 프로그램 (강사: 김경미)</p>
            </div>
            <button onClick={() => setShowSettings(true)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors print:hidden"><Settings size={24} className="text-white" /></button>
          </div>
        </div>

        {/* Control Panel */}
        <div className="p-6 bg-yellow-50 border-b border-yellow-200 print:hidden">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-bold text-stone-700 mb-1">몇 월인가요?</label>
              <select value={selectedMonth} onChange={(e) => { setSelectedMonth(Number(e.target.value)); setSelectedWeek(1); }} className="w-full p-3 border-2 border-orange-200 rounded-xl font-medium bg-white">
                {monthOrder.map(m => (<option key={m} value={m}>{m}월 - {curriculumData[m].theme.split('(')[0]}</option>))}
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-bold text-stone-700 mb-1">몇째 주인가요?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(w => (
                  <button key={w} onClick={() => setSelectedWeek(w)} className={`flex-1 py-3 rounded-xl font-bold text-sm ${selectedWeek === w ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-stone-600 border-2 border-orange-100'}`}>{w}주차</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Plan Display */}
        {lessonPlan && (
          <div className="p-8 print:p-0">
            <div className="border-2 border-stone-200 rounded-2xl p-6 print:border-none print:p-0 bg-white">
              
              {/* Header Info */}
              <div className="border-b-2 border-stone-800 pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold print:border print:border-orange-600">{selectedMonth}월 {selectedWeek}주차</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold border bg-green-100 text-green-800 border-green-200">활동: {lessonPlan.focus}</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold border bg-stone-100 text-stone-600 border-stone-300">시간: 40분</span>
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
                
                {/* Left Column: Info & Ref & Terms */}
                <div className="md:col-span-1 space-y-6">
                  
                  {/* 학습 목표 */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3 text-lg"><Star size={20} className="fill-indigo-700" /> 학습 목표</h3>
                    <p className="text-stone-700 font-medium leading-relaxed">{lessonPlan.objective}</p>
                  </div>

                  {/* 준비물 */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3 text-lg"><CheckCircle size={20} /> 준비물</h3>
                    <p className="text-stone-700 font-medium leading-relaxed">{lessonPlan.materials}</p>
                  </div>

                  {/* ⭐️ 어린이 용어 사전 (신규 추가) */}
                  <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="font-bold text-stone-700 flex items-center gap-2 mb-3 text-lg"><MessageCircleQuestion size={20} /> 어린이 용어 사전</h3>
                    <ul className="space-y-3">
                      {lessonPlan.terms.map((t: any, idx: number) => (
                        <li key={idx} className="text-sm text-stone-700">
                          <span className="font-bold bg-stone-200 px-1.5 py-0.5 rounded text-stone-900 mr-1">{t.term}:</span>
                          {t.desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Reference Section */}
                  {lessonPlan.refData && (
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                      <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3"><Info size={20} /> 선생님 꿀팁</h3>
                      <div className="text-sm text-blue-900 space-y-3">
                        <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 유래</span> {lessonPlan.refData.origin}</p>
                        <p><span className="font-bold bg-blue-100 px-1 rounded">♪ 팁</span> {lessonPlan.refData.tip}</p>
                      </div>
                    </div>
                  )}

                  {/* ⭐️ PPT/Miricanvas Prompts (이원화 적용) */}
                  <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 print:hidden relative shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-purple-700 flex items-center gap-2 text-lg"><Monitor size={20} /> PPT/미리캔버스</h3>
                    </div>
                    
                    {/* 1. 수업 진행 슬라이드 */}
                    <div className="flex justify-between items-center mb-2 mt-1 px-1">
                        <h4 className="font-bold text-sm text-purple-800">1. 수업 진행 슬라이드</h4>
                        <button 
                            onClick={() => handleCopy(lessonPlan.lessonSlidePrompts.join('\n\n'), 'lesson-all')} 
                            className={`text-xs px-2 py-1 border rounded transition-colors ${copyStatus === 'lesson-all' ? 'bg-green-100 text-green-700 border-green-200 font-bold' : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-100'}`}
                        >
                            {copyStatus === 'lesson-all' ? '복사완료!' : '전체 복사'}
                        </button>
                    </div>
                    <ul className="text-sm text-purple-900 space-y-2 mb-4">
                      {lessonPlan.lessonSlidePrompts.map((prompt: string, idx: number) => (
                        <li key={`lesson-${idx}`} onClick={() => handleCopy(prompt, `lesson-${idx}`)} className="bg-white border border-purple-100 p-2 rounded-lg cursor-pointer hover:bg-purple-100 relative group whitespace-pre-wrap text-xs">
                          <span className="leading-snug">{prompt}</span>
                          {copyStatus === `lesson-${idx}` && <span className="absolute right-2 top-2 text-green-600 text-xs font-bold">복사됨!</span>}
                        </li>
                      ))}
                    </ul>

                    {/* 2. 악기 시간 여행 슬라이드 */}
                    <div className="flex justify-between items-center mb-2 mt-4 px-1 pt-3 border-t border-purple-200">
                        <h4 className="font-bold text-sm text-purple-800">2. 악기 시간 여행 슬라이드</h4>
                        <button 
                            onClick={() => handleCopy(lessonPlan.historySlidePrompts.join('\n\n'), 'history-all')} 
                            className={`text-xs px-2 py-1 border rounded transition-colors ${copyStatus === 'history-all' ? 'bg-green-100 text-green-700 border-green-200 font-bold' : 'bg-white border-purple-200 text-purple-700 hover:bg-purple-100'}`}
                        >
                            {copyStatus === 'history-all' ? '복사완료!' : '전체 복사'}
                        </button>
                    </div>
                    <ul className="text-sm text-purple-900 space-y-2">
                      {lessonPlan.historySlidePrompts.map((prompt: string, idx: number) => (
                        <li key={`history-${idx}`} onClick={() => handleCopy(prompt, `history-${idx}`)} className="bg-white border border-purple-100 p-2 rounded-lg cursor-pointer hover:bg-purple-100 relative group whitespace-pre-wrap text-xs">
                          <span className="leading-snug">{prompt}</span>
                          {copyStatus === `history-${idx}` && <span className="absolute right-2 top-2 text-green-600 text-xs font-bold">복사됨!</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Detailed Lesson Plan */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Intro */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-green-400 pl-4 flex items-center">도입 (5분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">마음 열기</span></h3>
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg">{lessonPlan.intro}</div>
                  </div>

                  {/* ⭐️ Development (상세화된 달크로즈) */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-indigo-400 pl-4 flex items-center">전개 (30분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">달크로즈 놀이 활동</span></h3>
                    <div className="bg-indigo-50/30 p-6 rounded-2xl border-2 border-indigo-100 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg font-medium">{lessonPlan.main}</div>
                  </div>

                  {/* Conclusion */}
                  <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3 border-l-8 border-orange-400 pl-4 flex items-center">정리 (5분) <span className="text-sm font-normal text-stone-500 ml-3 bg-stone-100 px-2 py-1 rounded">마무리 인사</span></h3>
                    <div className="bg-white p-5 rounded-2xl border border-stone-200 text-stone-700 whitespace-pre-line leading-8 shadow-sm text-lg">{lessonPlan.conclusion}</div>
                  </div>

                  {/* ⭐️ 악기 시간 여행 (신규 추가) */}
                  <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><History size={100} /></div>
                    <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-4 text-xl relative z-10"><History size={24} /> 악기 시간 여행</h3>
                    <div className="text-stone-700 whitespace-pre-line leading-relaxed relative z-10 font-medium">
                      {lessonPlan.history}
                    </div>
                  </div>

                  {/* ⭐️ 학년별 지도 팁 & 안전 (구체화) */}
                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-yellow-100 p-5 rounded-2xl border border-yellow-300 flex gap-4 shadow-sm">
                      <div className="shrink-0 pt-1"><Smile className="text-orange-600 w-8 h-8" /></div>
                      <div>
                        <p className="text-stone-800 font-bold text-lg whitespace-pre-line">{lessonPlan.tip}</p>
                      </div>
                    </div>
                    
                    <div className="bg-red-50 p-5 rounded-2xl border border-red-200 flex gap-4 shadow-sm">
                       <div className="shrink-0 pt-1"><Heart className="text-red-500 w-8 h-8" /></div>
                       <div>
                         <h4 className="font-bold text-red-700 mb-1">오늘의 안전 약속</h4>
                         <p className="text-red-700 text-lg leading-relaxed whitespace-pre-line font-medium">{lessonPlan.safety}</p>
                       </div>
                    </div>
                  </div>

                  {/* Supplementary (기존 유지) */}
                  <div className="bg-green-50 p-5 rounded-2xl border border-green-100 shadow-sm">
                     <h3 className="font-bold text-green-700 flex items-center gap-2 mb-3"><Star size={20} /> 수준별 예비 활동</h3>
                     <div className="text-sm space-y-3">
                         <div className="bg-white p-3 rounded-lg border border-green-200"><span className="font-bold text-green-800 block mb-1">A. 심화 활동</span>{lessonPlan.supplementary.A}</div>
                         <div className="bg-white p-3 rounded-lg border border-green-200"><span className="font-bold text-green-800 block mb-1">B. 보조 활동</span>{lessonPlan.supplementary.B}</div>
                     </div>
                  </div>

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