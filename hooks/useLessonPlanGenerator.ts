import { useMemo } from 'react';
import { CurriculumData, LessonPlan } from '../types';
import { instrumentEncyclopedia, instrumentHistories } from '../data/instruments';
import * as LessonService from '../services/lessonService';

export const useLessonPlanGenerator = (
  curriculumData: CurriculumData,
  selectedMonth: number,
  selectedWeek: number
): LessonPlan | null => {
  return useMemo(() => {
    const monthData = curriculumData[selectedMonth];
    if (!monthData) return null;

    const weekData = monthData.weeks.find((w: any) => w.week === selectedWeek);
    if (!weekData) return null;

    const instKey = monthData.instKey || "신체 타악기";
    const theme = monthData.theme || "리듬 탐험";

    // Service Logic 호출
    const introText = LessonService.generateIntro(selectedWeek, instKey);
    const conclusionText = LessonService.generateConclusion(selectedWeek);
    const mainText = LessonService.generateIntegratedMain(selectedWeek, instKey, theme);
    const safetyText = LessonService.getSafetyRule(selectedWeek, instKey);
    const tipText = LessonService.getTeacherTip(selectedWeek);
    const termsData = LessonService.getTerms(instKey, selectedWeek);
    const historyText = instrumentHistories[instKey] || instrumentHistories["신체 타악기"];
    const materials = LessonService.getMaterials(selectedWeek, instKey);

    // Prompts
    const lessonSlidePrompts = LessonService.getLessonSlidePrompts(weekData, monthData, instKey);
    const historySlidePrompts = LessonService.getHistorySlidePrompts(instKey);
    const quizSlidePrompts = LessonService.getQuizSlidePrompts(instKey);

    return {
      title: weekData.title,
      theme: monthData.theme,
      instrumentName: instKey,
      focus: weekData.focus,
      objective: weekData.desc,
      intro: introText,
      main: mainText,
      conclusion: conclusionText,
      materials,
      safety: safetyText,
      tip: tipText,
      refData: instrumentEncyclopedia[instKey] || instrumentEncyclopedia["신체 타악기"],
      history: historyText,
      terms: termsData,
      lessonSlidePrompts,
      historySlidePrompts,
      quizSlidePrompts,
      supplementary: {
        A: `[심화] 리더가 되어 친구들을 이끌어보거나, 더 복잡한 리듬(엇박자)에 도전합니다.`,
        B: `[기초] 교사의 손을 잡고 함께 연주하며 박자감을 몸으로 익힙니다.`
      }
    };
  }, [curriculumData, selectedMonth, selectedWeek]);
};