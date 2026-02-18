import { useState, useCallback } from 'react';

export const useClipboard = () => {
  const [copyStatus, setCopyStatus] = useState<string | number | null>(null);

  const copyToClipboard = useCallback(async (text: string, statusId: string | number) => {
    if (!navigator.clipboard) {
      alert("이 브라우저는 클립보드 복사를 지원하지 않습니다. 텍스트를 직접 선택하여 복사해주세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(statusId);
      setTimeout(() => setCopyStatus(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert("복사에 실패했습니다. 텍스트를 직접 선택하여 복사해주세요.");
    }
  }, []);

  return { copyStatus, copyToClipboard };
};