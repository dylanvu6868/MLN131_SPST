import { CountryExplorer } from "@/components/countries/country-explorer";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllCountries } from "@/lib/countries";

export default function CountriesPage() {
  const countries = getAllCountries();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <SectionHeading
          eyebrow="Quốc gia"
          title="Tìm kiếm, lọc và xem hồ sơ chính trị"
          description="Lọc theo khu vực, nhóm chế độ, dấu hiệu nhà nước và các lớp bản sắc chính trị. Mỗi hồ sơ đều giữ nguồn và mức tin cậy."
        />
      </div>
      <CountryExplorer countries={countries} />
    </main>
  );
}
