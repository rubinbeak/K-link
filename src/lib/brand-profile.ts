import type { PrismaClient, User } from "@/generated/prisma";

export type BrandContactStep1 = {
  contactBrandName: string;
  contactManagerProfile: string;
  contactEmail: string;
  contactPhone: string;
};

export function userToBrandContactStep1(user: Pick<User, "brandName" | "name" | "email" | "brandContactEmail" | "contactPhoneE164">): BrandContactStep1 {
  return {
    contactBrandName: user.brandName ?? "",
    contactManagerProfile: user.name ?? "",
    contactEmail: user.brandContactEmail ?? user.email ?? "",
    contactPhone: user.contactPhoneE164 ?? "",
  };
}

export function hasAnyBrandContactInput(s: BrandContactStep1): boolean {
  return Boolean(
    s.contactBrandName.trim() || s.contactManagerProfile.trim() || s.contactEmail.trim() || s.contactPhone.trim(),
  );
}

/** User 테이블에 브랜드 담당자 정보 반영(빈 문자열은 null로 저장) */
export function brandContactToUserUpdateData(s: BrandContactStep1) {
  return {
    brandName: s.contactBrandName.trim() || null,
    name: s.contactManagerProfile.trim() || null,
    brandContactEmail: s.contactEmail.trim() || null,
    contactPhoneE164: s.contactPhone.trim() || null,
  };
}

export async function persistBrandContactForUser(prisma: PrismaClient, userId: string, step1: BrandContactStep1) {
  if (!hasAnyBrandContactInput(step1)) return;
  await prisma.user.update({
    where: { id: userId },
    data: brandContactToUserUpdateData(step1),
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
  return hasAnyBrandContactInput(out) ? out : null;
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
