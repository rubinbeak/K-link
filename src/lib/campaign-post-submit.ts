/**
 * 비동기 API 이후에는 window.open이 팝업 차단되는 경우가 많습니다.
 * async 함수의 첫 줄(첫 await 전)에서 호출해 빈 탭을 먼저 열고, 성공 시 URL만 바꿉니다.
 */
export function openPendingCompleteTab(): WindowProxy | null {
  if (typeof window === "undefined") return null;
  return window.open("about:blank", "_blank");
}

export function assignCompletePageToTab(
  tab: WindowProxy | null,
  paymentId: string,
  fallbackSameWindowNavigate: (path: string) => void,
) {
  if (typeof window === "undefined") return;
  const path = `/campaign/setup/complete/${paymentId}`;
  const url = `${window.location.origin}${path}`;
  if (tab && !tab.closed) {
    tab.location.href = url;
  } else {
    fallbackSameWindowNavigate(path);
  }
}
