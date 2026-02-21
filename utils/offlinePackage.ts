import { CurriculumData } from '../types';
import { ResourceLink } from '../components/lesson/ResourceSection';
import { instrumentHistories } from '../data/instruments';
import * as LessonService from '../services/lessonService';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export const downloadOfflinePackage = (
  curriculumData: CurriculumData,
  memos: Record<string, string>,
  linksMap: Record<string, ResourceLink[]>
) => {
  const monthOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

  const sections = monthOrder
    .filter((month) => curriculumData[month])
    .map((month) => {
      const monthData = curriculumData[month];
      const instKey = monthData.instKey || '신체 타악기';
      const theme = monthData.theme || '';

      const weekBlocks = [...monthData.weeks]
        .sort((a, b) => a.week - b.week)
        .map((weekData) => {
          const key = `${month}-${weekData.week}`;
          const intro = LessonService.generateIntro(weekData.week, instKey);
          const main = LessonService.generateIntegratedMain(weekData.week, instKey, theme);
          const conclusion = LessonService.generateConclusion(weekData.week);
          const safety = LessonService.getSafetyRule(weekData.week, instKey);
          const memo = memos[key] || '';
          const links = linksMap[key] || [];
          const history = instrumentHistories[instKey] || '';

          return `
            <article class="week-card">
              <h4>${month}월 ${weekData.week}주차 - ${escapeHtml(weekData.title)}</h4>
              <p><strong>악기:</strong> ${escapeHtml(instKey)} | <strong>활동:</strong> ${escapeHtml(weekData.focus)}</p>
              <p><strong>학습목표:</strong> ${escapeHtml(weekData.desc)}</p>
              <p><strong>도입:</strong> ${escapeHtml(intro)}</p>
              <p><strong>전개:</strong></p>
              <ul>${main
                .map((activity) => `<li><strong>${escapeHtml(activity.title)}</strong> - ${escapeHtml(activity.method)}</li>`)
                .join('')}</ul>
              <p><strong>정리:</strong> ${escapeHtml(conclusion)}</p>
              <p><strong>안전:</strong> ${escapeHtml(safety)}</p>
              <p><strong>악기 이야기:</strong> ${escapeHtml(history).replaceAll('\n', '<br/>')}</p>
              <p><strong>메모:</strong> ${escapeHtml(memo)}</p>
              <p><strong>링크 메모:</strong></p>
              <ul>${links.map((l) => `<li>${escapeHtml(l.title)} - ${escapeHtml(l.url)}</li>`).join('') || '<li>없음</li>'}</ul>
            </article>
          `;
        })
        .join('');

      return `
        <section class="month-section">
          <h3>${month}월 - ${escapeHtml(monthData.theme)}</h3>
          ${weekBlocks}
        </section>
      `;
    })
    .join('');

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>두드림 리듬 탐험대 오프라인 패키지</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; margin: 16px; color: #1c1917; }
    h1 { margin-bottom: 4px; }
    .desc { color: #57534e; margin-bottom: 16px; }
    .month-section { margin: 20px 0; border-top: 2px solid #fed7aa; padding-top: 12px; }
    .week-card { border: 1px solid #e7e5e4; border-radius: 10px; padding: 12px; margin: 10px 0; background: #fffbeb; }
    h3,h4 { margin: 6px 0; }
    p { margin: 6px 0; white-space: pre-wrap; }
    ul { margin: 4px 0 8px 20px; }
  </style>
</head>
<body>
  <h1>두드림 리듬 탐험대 - 오프라인 패키지</h1>
  <p class="desc">생성일: ${new Date().toLocaleString('ko-KR')}<br/>인터넷 없이도 열람 가능한 HTML 파일입니다. (링크는 텍스트로 보관)</p>
  ${sections}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `rhythm_explorer_offline_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
