import { permanentRedirect } from "next/navigation";

/** 예전 URL 호환: 메인 랜딩은 루트(/)로 통일 */
export default function ForBrandsLegacyRedirect() {
  permanentRedirect("/");
}
