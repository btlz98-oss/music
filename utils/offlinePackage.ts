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
            <article class="week-card" data-month="${month}" data-week="${weekData.week}">
              <div class="lesson-header">
                <div>
                  <span class="chip">${month}월 ${weekData.week}주차</span>
                  <h2>${escapeHtml(weekData.title)}</h2>
                  <p class="sub">${escapeHtml(theme)} · ${escapeHtml(instKey)}</p>
                </div>
                <p class="teacher">강사<br/><strong>김경미</strong></p>
              </div>

              <div class="grid">
                <section class="panel">
                  <h4>학습 목표</h4>
                  <p>${escapeHtml(weekData.desc)}</p>
                </section>
                <section class="panel">
                  <h4>준비물</h4>
                  <p>${escapeHtml(materials)}</p>
                </section>
                <section class="panel wide">
                  <h4>어린이 용어 사전</h4>
                  <ul>${terms.map((term) => `<li><strong>${escapeHtml(term.term)}</strong>: ${escapeHtml(term.desc)}</li>`).join('')}</ul>
                </section>
              </div>

              <section class="panel wide">
                <h4>도입 (5분)</h4>
                <p>${escapeHtml(intro).replaceAll('\n', '<br/>')}</p>
              </section>

              <section class="panel wide">
                <h4>전개 (30분)</h4>
                <ol>${main
                  .map((activity) => `<li><strong>${escapeHtml(activity.title)}</strong> <span class="method">${escapeHtml(activity.method)}</span><br/>${activity.steps.map((step) => escapeHtml(step)).join('<br/>')}</li>`)
                  .join('')}</ol>
              </section>

              <section class="panel wide">
                <h4>정리 (5분)</h4>
                <p>${escapeHtml(conclusion).replaceAll('\n', '<br/>')}</p>
              </section>

              <div class="grid">
                <section class="panel wide">
                  <h4>악기 시간 여행</h4>
                  <p>${escapeHtml(history).replaceAll('\n', '<br/>')}</p>
                </section>
                <section class="panel">
                  <h4>선생님 꿀팁</h4>
                  <p>${escapeHtml(tip)}</p>
                </section>
                <section class="panel">
                  <h4>안전 약속</h4>
                  <p>${escapeHtml(safety).replaceAll('\n', '<br/>')}</p>
                </section>
                <section class="panel">
                  <h4>메모</h4>
                  <p>${escapeHtml(memo) || '없음'}</p>
                </section>
                <section class="panel">
                  <h4>링크 메모</h4>
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
  <main class="container">
    <header class="header">
      <h1>♬ 두드림 리듬 탐험대</h1>
      <p>초등돌봄교실 특기적성 프로그램 (강사: 김경미)</p>
    </header>

    <section class="controls">
      <p class="desc">생성일: ${new Date().toLocaleString('ko-KR')} · 인터넷 없이 열람 가능<br/>월/주차를 클릭하면 현재 화면 형태 그대로 필요한 수업으로 바로 이동합니다.</p>
      <div class="control-row" style="margin-top: 12px;">
        <div class="field">
          <h3>몇 월인가요?</h3>
          <select id="monthSelect">${monthOptions}</select>
        </div>
        <div class="field">
          <h3>월 빠른 이동</h3>
          <div class="month-wrap">${monthButtons}</div>
        </div>
        <div class="field">
          <h3>몇째 주인가요?</h3>
          <div class="week-wrap">
            <button class="week-btn" data-week="1">1주차</button>
            <button class="week-btn" data-week="2">2주차</button>
            <button class="week-btn" data-week="3">3주차</button>
            <button class="week-btn" data-week="4">4주차</button>
          </div>
        </div>
      </div>
    </section>

    <section class="content" id="lessonRoot">${lessonMap}</section>
  </main>
  <script>
    const monthSelect = document.getElementById('monthSelect');
    const weekButtons = Array.from(document.querySelectorAll('.week-btn'));
    const monthButtons = Array.from(document.querySelectorAll('.month-btn'));
    const cards = Array.from(document.querySelectorAll('.week-card'));
    let selectedMonth = Number(monthSelect.value);
    let selectedWeek = 1;

    const render = () => {
      cards.forEach((card) => {
        const show = Number(card.dataset.month) === selectedMonth && Number(card.dataset.week) === selectedWeek;
        card.hidden = !show;
      });
      weekButtons.forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.week) === selectedWeek));
      monthButtons.forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.monthBtn) === selectedMonth));
      monthSelect.value = String(selectedMonth);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    monthSelect.addEventListener('change', (e) => {
      selectedMonth = Number(e.target.value);
      selectedWeek = 1;
      render();
    });

    weekButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedWeek = Number(btn.dataset.week);
        render();
      });
    });

    monthButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedMonth = Number(btn.dataset.monthBtn);
        selectedWeek = 1;
        render();
      });
    });

    render();
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
