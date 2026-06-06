import { CompareClient } from "@/components/compare/compare-client";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllCountries } from "@/lib/countries";

export default function ComparePage() {
  const countries = getAllCountries();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SectionHeading
          eyebrow="So sánh"
          title="So sánh từ hai đến bốn quốc gia"
          description="Bảng so sánh tách riêng bản sắc chính trị, cấu trúc nhà nước, lãnh đạo, mô hình kinh tế, độ tin cậy và nguồn dữ liệu."
        />
      </div>
      <CompareClient countries={countries} />
    </main>
  );
}
