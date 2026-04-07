import { redirect } from "next/navigation";

/** 임시: 공개 랜딩은 브랜드 전용만 노출. 메인 허브 페이지는 추후 복구 예정. */
export default function HomePage() {
  redirect("/for-brands");
}
