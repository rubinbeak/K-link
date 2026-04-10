/**
 * 제출 직후(첫 await 전) 동기로 호출하세요. 실제 Next 페이지를 열어
 * `about:blank`에 URL을 나중에 대입하는 방식의 브라우저 차단을 피합니다.
 */
export function openFinalizePendingTab(draftId: string): WindowProxy | null {
  if (typeof window === "undefined") return null;
  const url = `${window.location.origin}/campaign/setup/complete/pending?draftId=${encodeURIComponent(draftId)}`;
  return window.open(url, "_blank");
}
