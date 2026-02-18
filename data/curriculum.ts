import { CurriculumData } from '../types';

export const defaultCurriculumData: CurriculumData = {
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
    theme: "살랑살랑 봄바람 (쉐이커)",
    instKey: "쉐이커",
    weeks: [
      { week: 1, title: "씨앗이 춤을 춰요", focus: "탐색", desc: "에그 쉐이커 흔들어 봄비 소리 내기" },
      { week: 2, title: "봄꽃이 피었어요", focus: "기초", desc: "꽃이 피는 모습을 소리의 크기(셈여림)로 표현하기" },
      { week: 3, title: "나비처럼 팔랑팔랑", focus: "응용", desc: "쉐이커 흔들며 가볍게 뛰어다니다 멈추기" },
      { week: 4, title: "봄의 왈츠", focus: "심화/합주", desc: "3박자 노래에 맞춰 부드럽게 연주하기" }
    ]
  },
  5: {
    theme: "숲속 음악회 (우드블록/캐스터네츠)",
    instKey: "우드블록/캐스터네츠",
    weeks: [
      { week: 1, title: "딱따구리의 노래", focus: "탐색", desc: "우드블록으로 숲속 동물 소리 흉내 내기" },
      { week: 2, title: "말발굽 행진곡", focus: "기초", desc: "따그닥 따그닥 리듬치며 씩씩하게 걷기" },
      { week: 3, title: "개구리 합창단", focus: "응용", desc: "캐스터네츠로 개구리 울음소리 주고받기" },
      { week: 4, title: "숲속의 오케스트라", focus: "심화/합주", desc: "동물 역할극을 하며 이야기 합주하기" }
    ]
  },
  6: {
    theme: "찰랑찰랑 춤추는 탬버린",
    instKey: "탬버린",
    weeks: [
      { week: 1, title: "해님 닮은 탬버린", focus: "탐색", desc: "탬버린의 찰랑이는 소리와 둥둥 소리 비교하기" },
      { week: 2, title: "엉덩이 춤을 춰봐", focus: "기초", desc: "신체 여러 부위에 대고 재미있게 연주하기" },
      { week: 3, title: "리듬 체조 선수", focus: "응용", desc: "리본 돌리듯 탬버린 흔들며 움직이기" },
      { week: 4, title: "초여름의 축제", focus: "심화/합주", desc: "트레몰로 주법을 활용해 화려한 피날레 장식하기" }
    ]
  },
  7: {
    theme: "여름비와 은방울 (트라이앵글)",
    instKey: "트라이앵글",
    weeks: [
      { week: 1, title: "빗방울이 똑똑", focus: "탐색", desc: "트라이앵글의 맑은 울림 소리 들어보기" },
      { week: 2, title: "소리를 멈춰라!", focus: "기초", desc: "손으로 잡아 소리를 멈추는 '뮤트' 배우기" },
      { week: 3, title: "천둥과 번개", focus: "응용", desc: "큰 소리와 작은 소리를 번갈아 연주하며 날씨 표현하기" },
      { week: 4, title: "별똥별 연주회", focus: "심화/합주", desc: "조용한 밤하늘을 상상하며 섬세하게 연주하기" }
    ]
  },
  8: {
    theme: "뜨거운 태양의 축제 (라틴 퍼커션)",
    instKey: "라틴 퍼커션",
    weeks: [
      { week: 1, title: "훌라훌라 춤을 춰요", focus: "탐색", desc: "신나는 남미 리듬에 맞춰 몸 흔들기" },
      { week: 2, title: "카우벨과 아고고", focus: "기초", desc: "서로 다른 두 가지 음높이 악기 경험하기" },
      { week: 3, title: "삼바 기차 출발!", focus: "응용", desc: "기차놀이 대형으로 서서 발 구르며 연주하기" },
      { week: 4, title: "여름 카니발", focus: "심화/합주", desc: "가면 쓰고 축제처럼 신나게 두드리기" }
    ]
  },
  9: {
    theme: "심장이 쿵쿵 (북/젬베)",
    instKey: "북(젬베)",
    weeks: [
      { week: 1, title: "아프리카의 소리", focus: "탐색", desc: "젬베의 묵직한 울림과 둥근 모양 관찰하기" },
      { week: 2, title: "동물의 왕국", focus: "기초", desc: "사자 발걸음(쿵)과 토끼 발걸음(톡) 표현하기" },
      { week: 3, title: "정글 탐험대", focus: "응용", desc: "신호를 주고받으며 정글 숲을 헤쳐나가는 리듬 놀이" },
      { week: 4, title: "둥둥둥 부족 축제", focus: "심화/합주", desc: "원을 그리며 함께 연주하고 춤추기" }
    ]
  },
  10: {
    theme: "가을 숲 소리 탐험 (창의 리듬)",
    instKey: "창의 리듬",
    weeks: [
      { week: 1, title: "낙엽 밟는 소리", focus: "탐색", desc: "종이, 비닐 등을 구겨서 바스락거리는 소리 만들기" },
      { week: 2, title: "도토리 굴러가요", focus: "기초", desc: "컵이나 플라스틱 통으로 또르르 소리 내기" },
      { week: 3, title: "할로윈 유령 소동", focus: "응용", desc: "으스스한 효과음과 장난스러운 리듬 만들기" },
      { week: 4, title: "가을 운동회", focus: "심화/합주", desc: "응원 도구(페트병 등)를 만들어 신나게 두드리기" }
    ]
  },
  11: {
    theme: "알록달록 도레미 (붐와커)",
    instKey: "붐와커",
    weeks: [
      { week: 1, title: "무지개 막대기", focus: "탐색", desc: "길이에 따라 다른 소리가 나는 붐와커 탐색하기" },
      { week: 2, title: "도레미 계단", focus: "기초", desc: "음계(도레미파솔라시도)를 익히고 내 소리 찾기" },
      { week: 3, title: "신호등 연주", focus: "응용", desc: "색깔 악보를 보고 내 차례에 소리 내기" },
      { week: 4, title: "무지개 다리", focus: "심화/합주", desc: "간단한 동요 멜로디를 나누어 연주하기" }
    ]
  },
  12: {
    theme: "겨울의 종소리 (핸드벨)",
    instKey: "핸드벨",
    weeks: [
      { week: 1, title: "은색 방울 소리", focus: "탐색", desc: "핸드벨/터치벨을 조심스럽게 다루며 소리 듣기" },
      { week: 2, title: "눈 내리는 밤", focus: "기초", desc: "부드럽게 흔들어(쉐이크) 눈 오는 풍경 표현하기" },
      { week: 3, title: "산타의 썰매", focus: "응용", desc: "스타카토 주법으로 경쾌한 썰매 소리 만들기" },
      { week: 4, title: "크리스마스 캐롤", focus: "심화/합주", desc: "아름다운 화음을 만들어 캐롤 연주하기" }
    ]
  },
  1: {
    theme: "얼쑤! 우리 가락 (전통 타악기)",
    instKey: "전통 타악기",
    weeks: [
      { week: 1, title: "소고랑 놀자", focus: "탐색", desc: "우리나라 악기 소고의 생김새와 소리 익히기" },
      { week: 2, title: "자진모리 장단", focus: "기초", desc: "'덩~덩~덩덕쿵덕' 신나는 전래 동요 장단 배우기" },
      { week: 3, title: "상모 돌리기", focus: "응용", desc: "리본을 돌리며 소고를 치는 동작 흉내 내기" },
      { week: 4, title: "설날 풍물놀이", focus: "심화/합주", desc: "새해 복을 비는 마음으로 신명 나게 연주하기" }
    ]
  },
  2: {
    theme: "안녕, 우리들의 추억 (앙상블)",
    instKey: "앙상블",
    weeks: [
      { week: 1, title: "추억의 사진첩", focus: "탐색", desc: "1년 동안 가장 재미있었던 악기 다시 만나기" },
      { week: 2, title: "졸업 축하 행진곡", focus: "기초", desc: "위풍당당 행진곡에 맞춰 씩씩하게 연주하기" },
      { week: 3, title: "롤링 페이퍼 연주", focus: "응용", desc: "친구에게 하고 싶은 말을 리듬으로 전달하기" },
      { week: 4, title: "다시 만날 때까지", focus: "심화/합주", desc: "아쉬움을 달래며 서로를 축복하는 엔딩 연주" }
    ]
  }
};