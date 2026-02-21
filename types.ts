export interface WeekData {
  week: number;
  title: string;
  focus: string;
  desc: string;
}

export interface MonthData {
  theme: string;
  instKey: string;
  weeks: WeekData[];
}

export interface CurriculumData {
  [month: number]: MonthData;
}

export interface InstrumentRefData {
  origin: string;
  types: string[];
  tip: string;
  imageUrl?: string;
}

export interface PPTTemplateSlide {
  img: string;
  text: string;
}

export interface InstrumentPPTData {
  slide1: PPTTemplateSlide;
  slide2: PPTTemplateSlide;
  slide3: PPTTemplateSlide;
  slide4: PPTTemplateSlide;
  slide5: PPTTemplateSlide;
}

export interface LessonActivity {
  title: string;
  method: string;
  steps: string[];
}

export interface LessonPlan {
  title: string;
  theme: string;
  instrumentName: string;
  focus: string;
  objective: string;
  intro: string;
  main: LessonActivity[];
  conclusion: string;
  materials: string;
  safety: string;
  tip: string;
  refData: InstrumentRefData;
  history: string;
  terms: Array<{ term: string; desc: string }>;
  lessonSlidePrompts: string[];
  historySlidePrompts: string[];
  quizSlidePrompts: string[];
  supplementary: { A: string; B: string };
  memo?: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
}
