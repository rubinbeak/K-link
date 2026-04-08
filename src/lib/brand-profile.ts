import type { PrismaClient, User } from "@/generated/prisma";

export type BrandContactStep1 = {
  contactBrandName: string;
  contactManagerProfile: string;
  contactEmail: string;
  contactPhone: string;
};

export function userToBrandContactStep1(user: Pick<User, "brandName" | "name" | "email" | "contactPhoneE164">): BrandContactStep1 {
  return {
    contactBrandName: user.brandName ?? "",
    contactManagerProfile: user.name ?? "",
    contactEmail: user.email ?? "",
    contactPhone: user.contactPhoneE164 ?? "",
  };
}

export function hasAnyBrandContactInput(s: BrandContactStep1): boolean {
  return Boolean(
    s.contactBrandName.trim() || s.contactManagerProfile.trim() || s.contactPhone.trim() || s.contactEmail.trim(),
  );
}

/** User 테이블에 브랜드 담당자 정보 반영(이메일은 로그인 계정 `email` 사용, 여기서는 저장하지 않음) */
export function brandContactToUserUpdateData(s: BrandContactStep1) {
  return {
    brandName: s.contactBrandName.trim() || null,
    name: s.contactManagerProfile.trim() || null,
    contactPhoneE164: s.contactPhone.trim() || null,
  };
}

export async function persistBrandContactForUser(prisma: PrismaClient, userId: string, step1: BrandContactStep1) {
  const data = brandContactToUserUpdateData(step1);
  if (data.brandName === null && data.name === null && data.contactPhoneE164 === null) return;
  await prisma.user.update({
    where: { id: userId },
    data,
  });
}

/** 퍼널 draft.data.step1 에서 담당자 필드만 추출 */
export function funnelStep1ToBrandContact(step1: unknown): BrandContactStep1 | null {
  if (!step1 || typeof step1 !== "object") return null;
  const s = step1 as Record<string, unknown>;
  const out: BrandContactStep1 = {
    contactBrandName: typeof s.contactBrandName === "string" ? s.contactBrandName : "",
    contactManagerProfile: typeof s.contactManagerProfile === "string" ? s.contactManagerProfile : "",
    contactEmail: typeof s.contactEmail === "string" ? s.contactEmail : "",
    contactPhone: typeof s.contactPhone === "string" ? s.contactPhone : "",
  };
  if (!hasAnyBrandContactInput(out)) return null;
  return out;
}

/** 초안/폼에 값이 비어 있으면 마이페이지에 저장된 프로필로 채움 */
export function mergeBrandProfileIntoStep1<T extends BrandContactStep1>(step1: T, profile: BrandContactStep1): T {
  return {
    ...step1,
    contactBrandName: step1.contactBrandName.trim() ? step1.contactBrandName : profile.contactBrandName,
    contactManagerProfile: step1.contactManagerProfile.trim() ? step1.contactManagerProfile : profile.contactManagerProfile,
    contactEmail: step1.contactEmail.trim() ? step1.contactEmail : profile.contactEmail,
    contactPhone: step1.contactPhone.trim() ? step1.contactPhone : profile.contactPhone,
  };
}
