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

  const lessonMap = monthOrder
    .map((month) => {
      const monthData = pickMonthData(month);
      const instKey = monthData.instKey || '신체 타악기';
      const theme = monthData.theme || '';

      const weekBlocks = [1, 2, 3, 4]
        .map((week) => {
          const weekData = monthData.weeks.find((w) => w.week === week)
            || defaultCurriculumData[month]?.weeks.find((w) => w.week === week)
            || { week, title: `${week}주차`, focus: '기초', desc: '수업 목표를 입력해주세요.' };

          const key = `${month}-${weekData.week}`;
          const intro = LessonService.generateIntro(weekData.week, instKey);
          const main = LessonService.generateIntegratedMain(weekData.week, instKey, theme);
          const conclusion = LessonService.generateConclusion(weekData.week);
          const safety = LessonService.getSafetyRule(weekData.week, instKey);
          const materials = LessonService.getMaterials(weekData.week, instKey);
          const tip = LessonService.getTeacherTip(weekData.week);
          const terms = LessonService.getTerms(instKey, weekData.week);
          const memo = memos[key] || '';
          const links = linksMap[key] || [];
          const history = instrumentHistories[instKey] || '';

          return `
            <article class="week-card" id="m${month}-w${weekData.week}" data-month="${month}" data-week="${weekData.week}">
              <header class="lesson-head">
                <div class="chip-row">
                  <span class="chip chip-week">${month}월 ${weekData.week}주차</span>
                  <span class="chip chip-inst">악기: ${escapeHtml(instKey)}</span>
                  <span class="chip chip-focus">활동: ${escapeHtml(weekData.focus)}</span>
                </div>
                <h4>${escapeHtml(weekData.title)}</h4>
                <p class="objective">${escapeHtml(weekData.desc)}</p>
              </header>

              <div class="lesson-grid">
                <section class="panel soft">
                  <h5>수업 목표</h5>
                  <p>${escapeHtml(weekData.desc)}</p>
                </section>

                <section class="panel">
                  <h5>수업 흐름</h5>
                  <p><strong>도입:</strong> ${escapeHtml(intro)}</p>
                  <div class="activity-box">
                    <p><strong>전개:</strong></p>
                    <ul>${main
                      .map((activity) => `<li><strong>${escapeHtml(activity.title)}</strong><br/>${escapeHtml(activity.method)}</li>`)
                      .join('')}</ul>
                  </div>
                  <p><strong>정리:</strong> ${escapeHtml(conclusion)}</p>
                </section>

                <section class="panel warning">
                  <h5>안전 약속</h5>
                  <p>${escapeHtml(safety)}</p>
                </section>

                <section class="panel">
                  <h5>악기 시간 여행</h5>
                  <p>${escapeHtml(history).replaceAll('\n', '<br/>')}</p>
                </section>

                <section class="panel">
                  <h5>교사 메모</h5>
                  <p>${escapeHtml(memo) || '메모 없음'}</p>
                </section>

                <section class="panel">
                  <h5>링크 메모</h5>
                  <ul>${links.map((l) => `<li>${escapeHtml(l.title)} - ${escapeHtml(l.url)}</li>`).join('') || '<li>없음</li>'}</ul>
                </section>
              </div>
            </article>
          `;
        })
        .join('');

      return `
        <section class="month-section" id="m${month}">
          <h3>${month}월 - ${escapeHtml(monthData.theme)}</h3>
          <div class="week-grid">
            ${weekBlocks}
          </div>
        </section>
      `;
    })
    .join('');

  const monthOptions = monthOrder
    .map((month) => `<option value="${month}">${month}월 - ${escapeHtml(pickMonthData(month).theme)}</option>`)
    .join('');

  const monthButtons = monthOrder
    .map((month) => `<button class="month-btn" data-month-btn="${month}">${month}월</button>`)
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
    .toc { position: sticky; top: 0; background: #fff7ed; padding: 8px 10px; border-radius: 8px; border: 1px solid #fed7aa; font-size: 14px; }
    .toc a { color: #9a3412; text-decoration: none; font-weight: 700; }
    .month-section { margin: 20px 0; border-top: 2px solid #fed7aa; padding-top: 12px; }
    .week-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .week-card { border: 1px solid #e7e5e4; border-radius: 10px; padding: 12px; margin: 0; background: #fffbeb; }
    @media (min-width: 768px) {
      .week-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1200px) {
      .week-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    h3,h4 { margin: 6px 0; }
    p { margin: 6px 0; white-space: pre-wrap; }
    ul { margin: 4px 0 8px 20px; }
  </style>
</head>
<body>
  <header class="app-header">
    <h1>두드림 리듬 탐험대</h1>
    <p class="desc">연간 오프라인 패키지 · 3월~2월, 1~4주차 전체 포함 · 생성일: ${new Date().toLocaleString('ko-KR')}</p>
  </header>
  <main class="layout">
    <div class="toc"><strong>월 바로가기:</strong> ${toc}</div>
    <section class="controls">
      <h4>오프라인 수업 보기</h4>
      <div class="controls-grid">
        <div>
          <label for="monthFilter">몇 월인가요?</label>
          <select id="monthFilter" class="month-select">
            <option value="all">전체 월</option>
            ${monthOrder.map((m) => `<option value="${m}">${m}월 - ${escapeHtml(pickMonthData(m).theme || '')}</option>`).join('')}
          </select>
        </div>
        <div>
          <label>몇째 주인가요?</label>
          <div class="week-buttons">
            <button type="button" class="week-btn active" data-week-filter="all">전체 주차</button>
            <button type="button" class="week-btn" data-week-filter="1">1주차</button>
            <button type="button" class="week-btn" data-week-filter="2">2주차</button>
            <button type="button" class="week-btn" data-week-filter="3">3주차</button>
            <button type="button" class="week-btn" data-week-filter="4">4주차</button>
          </div>
        </div>
      </div>
    </section>
    ${sections}
  </main>
  <script>
    (function() {
      const monthSelect = document.getElementById('monthFilter');
      const weekButtons = Array.from(document.querySelectorAll('.week-btn'));
      const cards = Array.from(document.querySelectorAll('.week-card'));
      let selectedWeek = 'all';

      const applyFilter = () => {
        const selectedMonth = monthSelect.value;
        cards.forEach((card) => {
          const month = card.getAttribute('data-month');
          const week = card.getAttribute('data-week');
          const matchMonth = selectedMonth === 'all' || month === selectedMonth;
          const matchWeek = selectedWeek === 'all' || week === selectedWeek;
          card.style.display = matchMonth && matchWeek ? '' : 'none';
        });

        document.querySelectorAll('.month-section').forEach((section) => {
          const hasVisible = section.querySelector('.week-card:not([style*="display: none"])');
          section.style.display = hasVisible ? '' : 'none';
        });
      };

      monthSelect.addEventListener('change', applyFilter);
      weekButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          selectedWeek = btn.getAttribute('data-week-filter') || 'all';
          weekButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          applyFilter();
        });
      });

      applyFilter();
    })();
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = 'index.html';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
