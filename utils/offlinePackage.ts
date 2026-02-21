import { CurriculumData, MonthData, ResourceLink } from '../types';
import { defaultCurriculumData } from '../data/curriculum';
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

  const pickMonthData = (month: number): MonthData => {
    return curriculumData[month] || defaultCurriculumData[month];
  };

  const weekCards = monthOrder
    .flatMap((month) => {
      const monthData = pickMonthData(month);
      const instKey = monthData.instKey || '신체 타악기';
      const theme = monthData.theme || '';

      return [1, 2, 3, 4].map((week) => {
        const weekData = monthData.weeks.find((w) => w.week === week)
          || defaultCurriculumData[month]?.weeks.find((w) => w.week === week)
          || { week, title: `${week}주차`, focus: '기초', desc: '수업 목표를 입력해주세요.' };

        const key = `${month}-${weekData.week}`;
        const intro = LessonService.generateIntro(weekData.week, instKey);
        const main = LessonService.generateIntegratedMain(weekData.week, instKey, theme);
        const conclusion = LessonService.generateConclusion(weekData.week);
        const safety = LessonService.getSafetyRule(weekData.week, instKey);
        const memo = memos[key] || '';
        const links = linksMap[key] || [];
        const history = instrumentHistories[instKey] || '';

        return `
          <article class="week-card" data-month="${month}" data-week="${weekData.week}" id="m${month}-w${weekData.week}">
            <h4>${month}월 ${weekData.week}주차 - ${escapeHtml(weekData.title)}</h4>
            <p><strong>테마:</strong> ${escapeHtml(monthData.theme)}</p>
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
      });
    })
    .join('');

  const monthOptions = monthOrder
    .map((month) => `<option value="${month}">${month}월</option>`)
    .join('');

  const toc = monthOrder
    .map((month) => {
      const monthWeekLinks = [1, 2, 3, 4]
        .map((week) => `<a href="#m${month}-w${week}">${week}주</a>`)
        .join(' ');
      return `<span><a href="#m${month}-w1">${month}월</a> (${monthWeekLinks})</span>`;
    })
    .join(' · ');

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>두드림 리듬 탐험대 오프라인 패키지</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; margin: 16px; color: #1c1917; background: #fff; }
    h1 { margin-bottom: 4px; }
    .desc { color: #57534e; margin-bottom: 12px; }
    .panel { position: sticky; top: 0; background: #fffbeb; padding: 10px; border-radius: 10px; border: 1px solid #fed7aa; margin-bottom: 12px; }
    .controls { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
    .controls select { width: 100%; padding: 8px; border: 1px solid #fdba74; border-radius: 8px; font-size: 14px; }
    .toc { margin-top: 8px; font-size: 13px; color: #9a3412; }
    .toc a { color: #9a3412; text-decoration: none; font-weight: 700; margin-right: 4px; }
    .summary { margin: 10px 0; padding: 8px 10px; border-radius: 8px; background: #f5f5f4; color: #44403c; font-size: 14px; }
    .week-card { border: 1px solid #e7e5e4; border-radius: 10px; padding: 12px; margin: 10px 0; background: #fff7ed; }
    .week-card.hidden { display: none; }
    h4 { margin: 6px 0; }
    p { margin: 6px 0; white-space: pre-wrap; }
    ul { margin: 4px 0 8px 20px; }
  </style>
</head>
<body>
  <h1>두드림 리듬 탐험대 - 연간 오프라인 패키지</h1>
  <p class="desc">생성일: ${new Date().toLocaleString('ko-KR')}<br/>인터넷 없이도 열람 가능. 상단에서 월/주차를 선택해 빠르게 찾을 수 있습니다.</p>
  <div class="panel">
    <strong>오프라인 월/주차 보기</strong>
    <div class="controls">
      <label>월 선택
        <select id="monthFilter">
          <option value="all">전체 월</option>
          ${monthOptions}
        </select>
      </label>
      <label>주차 선택
        <select id="weekFilter">
          <option value="all">전체 주차</option>
          <option value="1">1주차</option>
          <option value="2">2주차</option>
          <option value="3">3주차</option>
          <option value="4">4주차</option>
        </select>
      </label>
    </div>
    <div class="toc"><strong>바로가기:</strong> ${toc}</div>
  </div>

  <p id="resultSummary" class="summary"></p>
  <section id="cardContainer">${weekCards}</section>

  <script>
    const monthFilter = document.getElementById('monthFilter');
    const weekFilter = document.getElementById('weekFilter');
    const cards = Array.from(document.querySelectorAll('.week-card'));
    const summary = document.getElementById('resultSummary');

    const applyFilter = () => {
      const selectedMonth = monthFilter.value;
      const selectedWeek = weekFilter.value;
      let visibleCount = 0;

      cards.forEach((card) => {
        const matchesMonth = selectedMonth === 'all' || card.dataset.month === selectedMonth;
        const matchesWeek = selectedWeek === 'all' || card.dataset.week === selectedWeek;
        const visible = matchesMonth && matchesWeek;
        card.classList.toggle('hidden', !visible);
        if (visible) visibleCount += 1;
      });

      const monthText = selectedMonth === 'all' ? '전체 월' : selectedMonth + '월';
      const weekText = selectedWeek === 'all' ? '전체 주차' : selectedWeek + '주차';
      summary.textContent = monthText + ' / ' + weekText + ' · 총 ' + visibleCount + '개 수업안 표시 중';
    };

    monthFilter.addEventListener('change', applyFilter);
    weekFilter.addEventListener('change', applyFilter);
    applyFilter();
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = `rhythm_explorer_full_offline_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
