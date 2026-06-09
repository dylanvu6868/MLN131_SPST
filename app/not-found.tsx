import Link from "next/link";

import { TrText } from "@/components/ui/tr-text";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="atlas-surface rounded-lg p-8">
        <p className="text-sm uppercase tracking-[0.18em] text-teal-200">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white"><TrText vi="Không tìm thấy hồ sơ" /></h1>
        <p className="mt-3 text-slate-300"><TrText vi="Hồ sơ quốc gia được yêu cầu chưa có trong bộ sưu tập hiện tại." /></p>
        <Link href="/countries" className="atlas-button focus-ring mt-6 px-4">
          <TrText vi="Xem danh sách quốc gia" />
        </Link>
      </div>
    </main>
  );
}
