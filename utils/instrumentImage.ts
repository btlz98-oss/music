const colorMap: Record<string, { bg: string; fg: string }> = {
  '신체 타악기': { bg: '#fca5a5', fg: '#7f1d1d' },
  '쉐이커': { bg: '#fcd34d', fg: '#78350f' },
  '우드블록/캐스터네츠': { bg: '#d6d3d1', fg: '#44403c' },
  '탬버린': { bg: '#f9a8d4', fg: '#831843' },
  '트라이앵글': { bg: '#cbd5e1', fg: '#1e293b' },
  '라틴 퍼커션': { bg: '#fda4af', fg: '#881337' },
  '창의 리듬': { bg: '#93c5fd', fg: '#1e3a8a' },
  '북(젬베)': { bg: '#86efac', fg: '#14532d' },
  '붐와커': { bg: '#f87171', fg: '#991b1b' },
  '핸드벨': { bg: '#fbbf24', fg: '#b45309' },
  '전통 타악기': { bg: '#a78bfa', fg: '#5b21b6' },
  '앙상블': { bg: '#c084fc', fg: '#581c87' }
};

export const getOfflineInstrumentImage = (instrumentName: string) => {
  const colors = colorMap[instrumentName] || { bg: '#e7e5e4', fg: '#44403c' };
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="${colors.bg}" rx="20" />
      <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" fill="${colors.fg}" font-size="22" font-family="Inter, Arial, sans-serif" font-weight="700">${instrumentName}</text>
      <text x="50%" y="66%" dominant-baseline="middle" text-anchor="middle" fill="${colors.fg}" font-size="14" font-family="Inter, Arial, sans-serif">Offline</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

