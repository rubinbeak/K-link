"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SaveMode = "manual" | "auto";

type PersistedPayload<T> = {
  savedAt: string;
  data: T;
};

export function useCampaignFormAutosave<T>({
  storageKey,
  data,
  onRestore,
  skipRestore = false,
}: {
  storageKey: string;
  data: T;
  onRestore: (restored: Partial<T>) => void;
  /** 서버에서 불러온 초안이 있을 때 로컬 복원으로 덮어쓰지 않음 */
  skipRestore?: boolean;
}) {
  const [lastSavedAt, setLastSavedAt] = useState<string>("");
  const [toastMessage, setToastMessage] = useState("");
  const restoredRef = useRef(false);

  const save = useCallback(
    (mode: SaveMode) => {
      try {
        const payload: PersistedPayload<T> = {
          savedAt: new Date().toISOString(),
          data,
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        const timeText = new Date(payload.savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
        setLastSavedAt(timeText);
        setToastMessage(mode === "auto" ? "방금 내용이 안전하게 저장되었습니다" : "임시 저장이 완료되었습니다");
      } catch {
        setToastMessage("저장 중 문제가 발생했습니다. 다시 시도해 주세요.");
      }
    },
    [data, storageKey],
  );

  useEffect(() => {
    if (restoredRef.current || skipRestore) {
      restoredRef.current = true;
      return;
    }
    restoredRef.current = true;

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as PersistedPayload<T>;
      if (parsed?.data) onRestore(parsed.data);
      if (parsed?.savedAt) {
        setLastSavedAt(new Date(parsed.savedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch {
      // ignore restore parse errors
    }
  }, [onRestore, storageKey, skipRestore]);

  useEffect(() => {
    const id = setInterval(() => {
      save("auto");
    }, 300000);
    return () => clearInterval(id);
  }, [save]);

  useEffect(() => {
    if (!toastMessage) return;
    const id = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(id);
  }, [toastMessage]);

  return {
    lastSavedAt,
    toastMessage,
    saveNow: () => save("manual"),
  };
}
