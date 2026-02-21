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

      return weekBlocks;
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
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; margin: 0; color: #1c1917; background: #FFFDF9; }
    .container { max-width: 1080px; margin: 0 auto; background: #fff; min-height: 100vh; }
    .header { background: #fb923c; color: white; padding: 20px; }
    .header h1 { margin: 0; font-size: 30px; }
    .header p { margin: 4px 0 0; color: #ffedd5; }
    .desc { color: #57534e; margin: 0; font-size: 14px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 10px 12px; }
    .controls { margin: 16px 20px; padding: 16px; background: #FFFBEB; border: 1px solid #f5f5f4; border-radius: 16px; }
    .control-row { display: flex; gap: 18px; flex-wrap: wrap; }
    .field { flex: 1; min-width: 220px; }
    .field h3 { margin: 0 0 8px; font-size: 18px; }
    select { width: 100%; padding: 12px; border-radius: 12px; border: 2px solid #fed7aa; font-size: 17px; font-weight: 700; }
    .week-wrap, .month-wrap { display: flex; gap: 8px; flex-wrap: wrap; }
    .week-btn, .month-btn { border: 2px solid #ffedd5; background: #fff; color: #57534e; border-radius: 12px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
    .week-btn.active, .month-btn.active { background: #f97316; color: #fff; border-color: #f97316; }
    .content { padding: 0 20px 24px; }
    .week-card { border: 1px solid #e7e5e4; border-radius: 16px; padding: 18px; margin: 12px 0; }
    .lesson-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e7e5e4; padding-bottom: 10px; }
    .chip { background: #ffedd5; color: #9a3412; border-radius: 999px; font-weight: 700; padding: 4px 10px; font-size: 12px; }
    h2 { margin: 10px 0 2px; }
    .sub { color: #57534e; margin: 0; }
    .teacher { text-align: right; margin: 0; font-size: 12px; }
    .teacher strong { font-size: 28px; color: #111827; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }
    .panel { border: 1px solid #e7e5e4; border-radius: 12px; padding: 12px; background: #fff; }
    .panel.wide { grid-column: span 2; }
    .panel h4 { margin: 0 0 8px; color: #4338ca; }
    .panel p { margin: 0; white-space: pre-wrap; }
    ul, ol { margin: 0 0 0 18px; padding: 0; }
    li { margin-bottom: 8px; }
    .method { color: #57534e; font-size: 12px; margin-left: 4px; }
    [hidden] { display: none !important; }
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
  link.download = `rhythm_explorer_full_offline_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
