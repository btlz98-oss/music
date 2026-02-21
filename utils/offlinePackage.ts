import { CurriculumData, ResourceLink } from '../types';
import { instrumentHistories } from '../data/instruments';
import * as LessonService from '../services/lessonService';

const escapeJsonForScript = (json: string) => json.replaceAll('</', '<\\/');

const escapeJs = (value: string) =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('$', '\\$');

interface OfflineWeekRecord {
  month: number;
  week: number;
  monthTheme: string;
  instrument: string;
  title: string;
  focus: string;
  objective: string;
  intro: string;
  main: Array<{ title: string; method: string }>;
  conclusion: string;
  safety: string;
  history: string;
  memo: string;
  links: ResourceLink[];
}

export const downloadOfflinePackage = (
  curriculumData: CurriculumData,
  memos: Record<string, string>,
  linksMap: Record<string, ResourceLink[]>
) => {
  const monthOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

  const records: OfflineWeekRecord[] = monthOrder.flatMap((month) => {
    const monthData = curriculumData[month];
    const monthTheme = monthData?.theme ?? '';
    const instrument = monthData?.instKey ?? '신체 타악기';

    return [1, 2, 3, 4].map((week) => {
      const weekData = monthData?.weeks.find((entry) => entry.week === week) ?? {
        week,
        title: `${week}주차`,
        focus: '기초',
        desc: '수업 목표를 입력해주세요.',
      };

      const key = `${month}-${week}`;

      return {
        month,
        week,
        monthTheme,
        instrument,
        title: weekData.title,
        focus: weekData.focus,
        objective: weekData.desc,
        intro: LessonService.generateIntro(week, instrument),
        main: LessonService.generateIntegratedMain(week, instrument, monthTheme).map((activity) => ({
          title: activity.title,
          method: activity.method,
        })),
        conclusion: LessonService.generateConclusion(week),
        safety: LessonService.getSafetyRule(week, instrument),
        history: instrumentHistories[instrument] ?? '',
        memo: memos[key] ?? '',
        links: linksMap[key] ?? [],
      };
    });
  });

  const monthMeta = monthOrder.map((month) => ({
    month,
    theme: curriculumData[month]?.theme ?? '',
  }));

  const datasetJson = escapeJsonForScript(JSON.stringify({ monthOrder, monthMeta, records }));

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
    .panel { position: sticky; top: 0; background: #fffbeb; padding: 10px; border-radius: 10px; border: 1px solid #fed7aa; margin-bottom: 12px; z-index: 10; }
    .controls { display: grid; grid-template-columns: minmax(220px, 1fr) 2fr; gap: 8px; margin-top: 8px; align-items: center; }
    .controls select { width: 100%; padding: 8px; border: 1px solid #fdba74; border-radius: 8px; font-size: 14px; }
    .week-buttons { display: flex; flex-wrap: wrap; gap: 6px; }
    .week-btn { border: 1px solid #fed7aa; background: #fff; border-radius: 999px; padding: 6px 10px; font-size: 13px; cursor: pointer; }
    .week-btn.active { background: #f97316; color: #fff; border-color: #ea580c; }
    .summary { margin: 10px 0; padding: 8px 10px; border-radius: 8px; background: #f5f5f4; color: #44403c; font-size: 14px; }
    .week-card { border: 1px solid #e7e5e4; border-radius: 10px; padding: 12px; margin: 10px 0; background: #fff7ed; }
    h4 { margin: 6px 0; }
    p { margin: 6px 0; white-space: pre-wrap; }
    ul { margin: 4px 0 8px 20px; }
  </style>
</head>
<body>
  <h1>두드림 리듬 탐험대 - 연간 오프라인 패키지</h1>
  <p class="desc">생성일: ${escapeJs(new Date().toLocaleString('ko-KR'))}<br/>인터넷 없이도 열람 가능. 상단에서 월/주차를 선택해 빠르게 찾을 수 있습니다.</p>
  <div class="panel">
    <strong>오프라인 월/주차 보기</strong>
    <div class="controls">
      <label>월 선택
        <select id="monthFilter"></select>
      </label>
      <div>
        <div style="font-size: 13px; color: #9a3412; margin-bottom: 4px;">주차 선택</div>
        <div id="weekButtons" class="week-buttons"></div>
      </div>
    </div>
  </div>

  <p id="resultSummary" class="summary"></p>
  <section id="cardContainer"></section>

  <script>
    const offlineData = ${datasetJson};

    const monthFilter = document.getElementById('monthFilter');
    const weekButtons = document.getElementById('weekButtons');
    const summary = document.getElementById('resultSummary');
    const container = document.getElementById('cardContainer');

    const esc = (value) => String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

    let selectedMonth = String(offlineData.monthOrder[0]);
    let selectedWeek = '1';

    const getThemeLabel = (month) => {
      const found = offlineData.monthMeta.find((meta) => meta.month === Number(month));
      return found && found.theme ? ' - ' + found.theme : '';
    };

    const renderMonthOptions = () => {
      monthFilter.innerHTML = offlineData.monthOrder
        .map((month) => '<option value="' + month + '">' + month + '월' + esc(getThemeLabel(month)) + '</option>')
        .join('');
      monthFilter.value = selectedMonth;
    };

    const renderWeekButtons = () => {
      const weeks = offlineData.records
        .filter((item) => String(item.month) === selectedMonth)
        .map((item) => item.week)
        .filter((week, index, arr) => arr.indexOf(week) === index)
        .sort((a, b) => a - b);

      weekButtons.innerHTML = weeks
        .map((week) => {
          const isActive = String(week) === selectedWeek;
          return '<button class="week-btn' + (isActive ? ' active' : '') + '" data-week="' + week + '">' + week + '주차</button>';
        })
        .join('');

      if (!weeks.includes(Number(selectedWeek)) && weeks.length > 0) {
        selectedWeek = String(weeks[0]);
        renderWeekButtons();
      }
    };

    const renderContent = () => {
      const record = offlineData.records.find(
        (item) => String(item.month) === selectedMonth && String(item.week) === selectedWeek
      );

      if (!record) {
        container.innerHTML = '<p>표시할 수업안이 없습니다.</p>';
        summary.textContent = '선택한 월/주차에 해당하는 데이터가 없습니다.';
        return;
      }

      const linksHtml = record.links.length
        ? record.links.map((link) => '<li>' + esc(link.title) + ' - ' + esc(link.url) + '</li>').join('')
        : '<li>없음</li>';

      const mainHtml = record.main
        .map((activity) => '<li><strong>' + esc(activity.title) + '</strong> - ' + esc(activity.method) + '</li>')
        .join('');

      container.innerHTML =
        '<article class="week-card">' +
          '<h4>' + esc(record.month) + '월 ' + esc(record.week) + '주차 - ' + esc(record.title) + '</h4>' +
          '<p><strong>테마:</strong> ' + esc(record.monthTheme) + '</p>' +
          '<p><strong>악기:</strong> ' + esc(record.instrument) + ' | <strong>활동:</strong> ' + esc(record.focus) + '</p>' +
          '<p><strong>학습목표:</strong> ' + esc(record.objective) + '</p>' +
          '<p><strong>도입:</strong> ' + esc(record.intro) + '</p>' +
          '<p><strong>전개:</strong></p>' +
          '<ul>' + mainHtml + '</ul>' +
          '<p><strong>정리:</strong> ' + esc(record.conclusion) + '</p>' +
          '<p><strong>안전:</strong> ' + esc(record.safety) + '</p>' +
          '<p><strong>악기 이야기:</strong> ' + esc(record.history).replaceAll('\\n', '<br/>') + '</p>' +
          '<p><strong>메모:</strong> ' + esc(record.memo) + '</p>' +
          '<p><strong>링크 메모:</strong></p>' +
          '<ul>' + linksHtml + '</ul>' +
        '</article>';

      summary.textContent = record.month + '월 / ' + record.week + '주차 수업안 표시 중';
    };

    monthFilter.addEventListener('change', (event) => {
      selectedMonth = event.target.value;
      selectedWeek = '1';
      renderWeekButtons();
      renderContent();
    });

    weekButtons.addEventListener('click', (event) => {
      const button = event.target.closest('.week-btn');
      if (!button) return;
      selectedWeek = button.dataset.week;
      renderWeekButtons();
      renderContent();
    });

    renderMonthOptions();
    renderWeekButtons();
    renderContent();
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
