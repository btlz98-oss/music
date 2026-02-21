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

  const sections = monthOrder
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

  const toc = monthOrder.map((month) => `<a href="#m${month}">${month}월</a>`).join(' · ');

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>두드림 리듬 탐험대 오프라인 패키지</title>
  <style>
    :root {
      --bg: #f5f5f4;
      --card: #ffffff;
      --border: #e7e5e4;
      --orange: #f97316;
      --text: #1c1917;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
    .app-header { background: #fb923c; color: #fff; padding: 20px 16px; }
    .app-header h1 { margin: 0 0 6px; font-size: 28px; }
    .desc { margin: 0; opacity: 0.95; }
    .layout { max-width: 1200px; margin: 0 auto; padding: 16px; }
    .toc { position: sticky; top: 8px; z-index: 10; margin-bottom: 12px; background: #fff7ed; padding: 10px 12px; border-radius: 12px; border: 1px solid #fed7aa; }
    .toc a { color: #9a3412; text-decoration: none; font-weight: 700; }
    .controls { background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 12px; margin-bottom: 16px; }
    .controls h4 { margin: 0 0 10px; font-size: 16px; }
    .controls-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
    .month-select { width: 100%; padding: 10px 12px; border: 2px solid #fdba74; border-radius: 12px; font-size: 16px; font-weight: 700; color: #44403c; background: #fff; }
    .week-buttons { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .week-btn { border: 2px solid #fed7aa; background: #fff; color: #57534e; border-radius: 12px; padding: 10px; font-weight: 700; cursor: pointer; }
    .week-btn.active { background: #f97316; border-color: #f97316; color: #fff; }
    .month-section { margin: 20px 0; }
    .month-section h3 { margin: 0 0 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 14px; padding: 12px 14px; }

    .week-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
    .week-card { border: 1px solid var(--border); border-radius: 16px; padding: 14px; background: var(--card); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .lesson-head h4 { margin: 8px 0 6px; font-size: 24px; line-height: 1.25; }
    .objective { margin: 0; color: #44403c; font-weight: 600; }

    .chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { border-radius: 999px; padding: 4px 10px; font-size: 12px; font-weight: 700; border: 1px solid transparent; }
    .chip-week { color: #c2410c; background: #ffedd5; border-color: #fdba74; }
    .chip-inst { color: #1d4ed8; background: #dbeafe; border-color: #93c5fd; }
    .chip-focus { color: #166534; background: #dcfce7; border-color: #86efac; }

    .lesson-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 12px; }
    .panel { border: 1px solid #e5e7eb; border-radius: 12px; padding: 10px; background: #fff; }
    .panel.soft { background: #f8fafc; }
    .panel.warning { background: #fff7ed; border-color: #fed7aa; }
    .panel h5 { margin: 0 0 8px; color: #111827; font-size: 15px; }
    .panel p { margin: 0 0 6px; white-space: pre-wrap; }
    .panel ul { margin: 0; padding-left: 18px; }
    .panel li { margin-bottom: 6px; }
    .activity-box { margin: 8px 0; }

    @media (min-width: 768px) {
      .layout { padding: 20px; }
      .controls-grid { grid-template-columns: 1.2fr 1fr; align-items: end; }
      .week-buttons { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .week-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .lesson-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (min-width: 1200px) {
      .week-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
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
  link.download = `rhythm_explorer_full_offline_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
