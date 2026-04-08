import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/60 bg-zinc-50/50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
          <Link
            href="/for-brands"
            className="inline-flex shrink-0 items-center self-start rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Image
              src="/images/k-link-logo.png"
              alt="K-LINK Logo"
              width={56}
              height={56}
              className="h-9 w-auto object-contain object-left opacity-90"
            />
          </Link>

          <address className="min-w-0 flex-1 not-italic">
            <ul className="space-y-0.5 text-[11px] leading-relaxed text-zinc-500 sm:text-xs sm:leading-relaxed">
              <li>
                <span className="text-zinc-600">상호</span> 케이링크(K-LINK)
              </li>
              <li>
                <span className="text-zinc-600">성명</span> 백은진
              </li>
              <li>
                <span className="text-zinc-600">사업자번호</span> 157-13-02279
              </li>
              <li>
                <span className="text-zinc-600">주소</span> 경기도 파주시 장명산길 109(오도동)
              </li>
            </ul>
          </address>
        </div>

        <p className="mt-3 text-[10px] leading-normal tracking-wide text-zinc-400">
          © {new Date().getFullYear()} 케이링크(K-LINK)
        </p>
      </div>
    </footer>
  );
}
