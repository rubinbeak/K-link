import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200/80 bg-zinc-50/90">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-12 lg:gap-16">
          <Link
            href="/for-brands"
            className="inline-flex shrink-0 items-center self-start rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <Image
              src="/images/k-link-logo.png"
              alt="K-LINK Logo"
              width={72}
              height={72}
              className="h-14 w-auto object-contain object-left md:h-16"
            />
          </Link>

          <address className="min-w-0 flex-1 not-italic">
            <ul className="space-y-2 text-sm leading-relaxed text-zinc-600">
              <li>
                <span className="font-medium text-zinc-800">상호</span> 케이링크(K-LINK)
              </li>
              <li>
                <span className="font-medium text-zinc-800">성명</span> 백은진
              </li>
              <li>
                <span className="font-medium text-zinc-800">사업자번호</span> 157-13-02279
              </li>
              <li>
                <span className="font-medium text-zinc-800">주소</span> 경기도 파주시 장명산길 109(오도동)
              </li>
            </ul>
          </address>
        </div>

        <p className="mt-10 border-t border-zinc-200/80 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} 케이링크(K-LINK). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
