import { CurriculumData } from '../types';
import { ResourceLink } from '../components/lesson/ResourceSection';
import { instrumentHistories } from '../data/instruments';
import * as LessonService from '../services/lessonService';

// Escape a string so it can be safely embedded inside a JS template-literal
// in the generated standalone HTML file.
// Backslashes must be escaped FIRST to avoid double-escaping the escape chars
// that are added for backticks/dollar signs in subsequent steps.
const escapeJs = (value: string) =>
  value
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('$', '\\$');

// Escape JSON for safe inline embedding inside a <script> tag.
// Replaces '</' with '<\/' to prevent </script> from terminating the block.
const escapeJsonForScript = (json: string) => json.replaceAll('</', '<\\/');


export const downloadOfflinePackage = (
  curriculumData: CurriculumData,
  memos: Record<string, string>,
  linksMap: Record<string, ResourceLink[]>
) => {
  const monthOrder = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

  // Build a complete lesson data map for all months and weeks
  type WeekLesson = {
    title: string; focus: string; desc: string;
    intro: string; main: { title: string; method: string; steps: string[] }[];
    conclusion: string; safety: string; history: string; memo: string;
    links: { title: string; url: string }[];
  };
  type MonthLesson = { theme: string; instKey: string; weeks: Record<number, WeekLesson> };
  const allLessons: Record<number, MonthLesson> = {};

  monthOrder.forEach((month) => {
    const monthData = curriculumData[month];
    if (!monthData) return;
    const instKey = monthData.instKey || '신체 타악기';
    const theme = monthData.theme || '';
    const history = instrumentHistories[instKey] || '';
    allLessons[month] = { theme: monthData.theme, instKey, weeks: {} };

    [...monthData.weeks].sort((a, b) => a.week - b.week).forEach((weekData) => {
      const key = `${month}-${weekData.week}`;
      allLessons[month].weeks[weekData.week] = {
        title: weekData.title,
        focus: weekData.focus,
        desc: weekData.desc,
        intro: LessonService.generateIntro(weekData.week, instKey),
        main: LessonService.generateIntegratedMain(weekData.week, instKey, theme),
        conclusion: LessonService.generateConclusion(weekData.week),
        safety: LessonService.getSafetyRule(weekData.week, instKey),
        history,
        memo: memos[key] || '',
        links: (linksMap[key] || []).map((l) => ({ title: l.title, url: l.url })),
      };
    });
  });

  const lessonDataJson = escapeJsonForScript(JSON.stringify(allLessons));
  const monthOrderJson = escapeJsonForScript(JSON.stringify(monthOrder.filter((m) => curriculumData[m])));
  const generatedAt = escapeJs(new Date().toLocaleString('ko-KR'));

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>두드림 리듬 탐험대 오프라인</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fffdf9;color:#1c1917;min-height:100vh}
    header{background:#f97316;color:#fff;padding:16px 20px}
    header h1{font-size:1.4rem;font-weight:800;margin-bottom:4px}
    header p{font-size:.8rem;opacity:.85;margin-bottom:12px}
    .nav-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
    select#month-sel{flex:1;min-width:180px;padding:10px 14px;border:none;border-radius:999px;font-size:.95rem;font-weight:700;color:#1c1917;background:#fff;cursor:pointer;outline:none}
    .week-btn{padding:9px 18px;border:2px solid rgba(255,255,255,.5);border-radius:999px;background:rgba(255,255,255,.15);color:#fff;font-weight:700;font-size:.9rem;cursor:pointer;transition:.15s}
    .week-btn.active{background:#1c1917;border-color:#1c1917}
    main{max-width:900px;margin:0 auto;padding:20px 16px 60px}
    .lesson-header{background:#fff;border:2px solid #fed7aa;border-radius:16px;padding:20px;margin-bottom:20px}
    .lesson-header h2{font-size:1.3rem;font-weight:800;color:#c2410c;margin-bottom:6px}
    .lesson-header .meta{display:flex;flex-wrap:wrap;gap:8px;font-size:.85rem;color:#57534e}
    .badge{background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:999px;font-weight:600}
    .section{background:#fff;border:1px solid #e7e5e4;border-radius:14px;padding:18px;margin-bottom:16px}
    .section h3{font-size:1rem;font-weight:800;margin-bottom:10px;display:flex;align-items:center;gap:6px}
    .section p{font-size:.9rem;color:#44403c;line-height:1.7;white-space:pre-wrap}
    .activity{background:#f5f5f4;border-radius:10px;padding:14px;margin-bottom:10px}
    .activity h4{font-size:.9rem;font-weight:700;color:#1c1917;margin-bottom:4px}
    .activity .method{font-size:.8rem;color:#78716c;margin-bottom:8px}
    .activity ol{padding-left:20px}
    .activity ol li{font-size:.88rem;color:#44403c;line-height:1.6;margin-bottom:4px}
    .safety-box{background:#fff1f2;border:1px solid #fecdd3;border-radius:14px;padding:18px;margin-bottom:16px}
    .safety-box h3{color:#be123c}
    .history-box{background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:18px;margin-bottom:16px}
    .history-box h3{color:#c2410c}
    .memo-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:18px;margin-bottom:16px}
    .memo-box h3{color:#15803d}
    .links-box{background:#f0f9ff;border:1px solid #bae6fd;border-radius:14px;padding:18px;margin-bottom:16px}
    .links-box h3{color:#0369a1}
    .links-box .link-item{font-size:.87rem;padding:6px 0;border-bottom:1px solid #e0f2fe;color:#0c4a6e}
    .links-box .link-item:last-child{border-bottom:none}
    .empty{color:#a8a29e;font-style:italic;font-size:.87rem}
    .intro-box h3{color:#15803d}
    .concl-box h3{color:#d97706}
    .obj-box h3{color:#4f46e5}
    @media(max-width:520px){header h1{font-size:1.1rem}.week-btn{padding:8px 14px;font-size:.82rem}}
  </style>
</head>
<body>
<header>
  <h1>🥁 두드림 리듬 탐험대 오프라인</h1>
  <p>생성: ${generatedAt} · 인터넷 없이 열람 가능</p>
  <div class="nav-row">
    <select id="month-sel" onchange="selectMonth(+this.value)"></select>
    <div id="week-btns"></div>
  </div>
</header>
<main id="content"></main>
<script>
const DATA = ${lessonDataJson};
const MONTH_ORDER = ${monthOrderJson};
let curMonth = MONTH_ORDER[0];
let curWeek = 1;

function esc(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function buildMonthSelect(){
  const sel = document.getElementById('month-sel');
  sel.innerHTML = MONTH_ORDER.map(m =>
    \`<option value="\${m}">\${m}월 - \${esc(DATA[m].theme)}</option>\`
  ).join('');
  sel.value = curMonth;
}

function buildWeekBtns(){
  const mon = DATA[curMonth];
  if(!mon) return;
  const weeks = Object.keys(mon.weeks).map(Number).sort((a,b)=>a-b);
  document.getElementById('week-btns').innerHTML = weeks.map(w =>
    \`<button class="week-btn\${w===curWeek?' active':''}" onclick="selectWeek(\${w})">\${w}주차</button>\`
  ).join('');
}

function renderLesson(){
  const mon = DATA[curMonth];
  if(!mon){ document.getElementById('content').innerHTML='<p style="padding:20px">데이터 없음</p>'; return; }
  const w = mon.weeks[curWeek];
  if(!w){ document.getElementById('content').innerHTML='<p style="padding:20px">주차 데이터 없음</p>'; return; }

  const mainActs = w.main.map(act => \`
    <div class="activity">
      <h4>\${esc(act.title)}</h4>
      <div class="method">📚 \${esc(act.method)}</div>
      <ol>\${act.steps.map(s=>\`<li>\${esc(s)}</li>\`).join('')}</ol>
    </div>
  \`).join('');

  const linksHtml = w.links.length
    ? w.links.map(l=>\`<div class="link-item">🔗 \${esc(l.title)} — \${esc(l.url)}</div>\`).join('')
    : '<p class="empty">저장된 링크가 없습니다.</p>';

  document.getElementById('content').innerHTML = \`
    <div class="lesson-header">
      <h2>\${curMonth}월 \${curWeek}주차 · \${esc(w.title)}</h2>
      <div class="meta">
        <span class="badge">🎵 \${esc(mon.instKey)}</span>
        <span class="badge">\${esc(w.focus)}</span>
        <span>\${esc(mon.theme)}</span>
      </div>
    </div>
    <div class="section obj-box">
      <h3>🌟 학습 목표</h3>
      <p>\${esc(w.desc)}</p>
    </div>
    <div class="section intro-box">
      <h3>🟢 도입 (5분)</h3>
      <p>\${esc(w.intro)}</p>
    </div>
    <div class="section">
      <h3>🔵 전개 (35분)</h3>
      \${mainActs}
    </div>
    <div class="section concl-box">
      <h3>🟠 정리 (5분)</h3>
      <p>\${esc(w.conclusion)}</p>
    </div>
    <div class="history-box">
      <h3>📖 악기 시간 여행</h3>
      <p>\${esc(w.history)}</p>
    </div>
    <div class="safety-box">
      <h3>❤️ 오늘의 안전 약속</h3>
      <p>\${esc(w.safety)}</p>
    </div>
    \${w.memo ? \`<div class="memo-box"><h3>📝 메모</h3><p>\${esc(w.memo)}</p></div>\` : ''}
    <div class="links-box">
      <h3>🎬 참고 영상 및 음원</h3>
      \${linksHtml}
    </div>
  \`;
}

function selectMonth(m){
  curMonth = m;
  curWeek = 1;
  document.getElementById('month-sel').value = m;
  buildWeekBtns();
  renderLesson();
}

function selectWeek(w){
  curWeek = w;
  buildWeekBtns();
  renderLesson();
}

buildMonthSelect();
buildWeekBtns();
renderLesson();
</script>
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
