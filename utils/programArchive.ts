import appSource from '../App.tsx?raw';
import lessonHookSource from '../hooks/useLessonPlanGenerator.ts?raw';
import lessonServiceSource from '../services/lessonService.ts?raw';
import promptSectionSource from '../components/lesson/PromptSection.tsx?raw';
import instrumentsSource from '../data/instruments.ts?raw';

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

export const downloadProgramArchive = () => {
  const sections = [
    {
      title: '1) 앱 메인 흐름 (App.tsx)',
      desc: '월/주차 선택, 로컬 저장, 오프라인 다운로드 버튼 등 전체 화면 흐름을 담당합니다.',
      content: appSource,
    },
    {
      title: '2) 수업 생성 로직 훅 (useLessonPlanGenerator.ts)',
      desc: '월/주차 데이터에서 수업안을 조립하고, 프롬프트·악기 정보까지 묶어 최종 객체를 생성합니다.',
      content: lessonHookSource,
    },
    {
      title: '3) 핵심 수업/프롬프트 서비스 (lessonService.ts)',
      desc: '도입/전개/정리/안전/교수법 및 PPT 프롬프트 템플릿이 포함된 핵심 로직입니다.',
      content: lessonServiceSource,
    },
    {
      title: '4) 프롬프트 UI (PromptSection.tsx)',
      desc: '프롬프트를 화면에 표시하고 복사하는 인터페이스 코드입니다.',
      content: promptSectionSource,
    },
    {
      title: '5) 악기 백과/히스토리/퀴즈/프롬프트 데이터 (instruments.ts)',
      desc: '악기별 서술/퀴즈/슬라이드 템플릿 등 프롬프트 기반 데이터 원문입니다.',
      content: instrumentsSource,
    },
  ]
    .map(
      (section) => `
        <section class="card">
          <h2>${section.title}</h2>
          <p class="desc">${section.desc}</p>
          <pre><code>${escapeHtml(section.content)}</code></pre>
        </section>
      `,
    )
    .join('');

  const html = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>두드림 리듬 탐험대 - 전체 로직/프롬프트 아카이브</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafaf9; color: #1c1917; }
    .container { max-width: 1100px; margin: 0 auto; padding: 20px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    .lead { margin: 0 0 18px; color: #57534e; }
    .notice { background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px; margin-bottom: 16px; }
    .card { background: white; border: 1px solid #e7e5e4; border-radius: 12px; padding: 14px; margin: 14px 0; }
    h2 { margin: 0 0 8px; font-size: 20px; }
    .desc { margin: 0 0 10px; color: #78716c; }
    pre { overflow-x: auto; background: #0f172a; color: #e2e8f0; border-radius: 10px; padding: 12px; line-height: 1.45; font-size: 12px; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
  </style>
</head>
<body>
  <main class="container">
    <h1>두드림 리듬 탐험대 - 전체 로직/프롬프트 아카이브</h1>
    <p class="lead">생성일: ${new Date().toLocaleString('ko-KR')} · 오프라인에서 한 파일로 열람 가능한 소스 아카이브</p>
    <div class="notice">
      이 문서는 <strong>프로그램 로직 + 프롬프트 관련 원본 코드</strong>를 한 HTML에 묶어 저장합니다.
    </div>
    ${sections}
  </main>
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
