import { CountryCard } from "@/components/countries/country-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrText } from "@/components/ui/tr-text";
import { getAllCountries } from "@/lib/countries";

const branches = [
  {
    title: "Chủ nghĩa Marx-Lenin",
    body: "Một truyền thống xã hội chủ nghĩa cách mạng gắn với cấu trúc nhà nước do đảng lãnh đạo và các thiết chế kinh tế kế hoạch hóa hoặc do nhà nước định hướng."
  },
  {
    title: "Chủ nghĩa xã hội dân chủ",
    body: "Một nhóm tiếp cận xã hội chủ nghĩa nhấn mạnh chính trị dân chủ, quyền tự do dân sự và sở hữu xã hội hoặc kiểm soát công mạnh."
  },
  {
    title: "Dân chủ xã hội",
    body: "Một truyền thống cải cách vận hành trong kinh tế thị trường nhưng mở rộng phúc lợi, quyền lao động, tái phân phối và dịch vụ công."
  },
  {
    title: "Chủ nghĩa xã hội thị trường",
    body: "Mô hình kết hợp phân bổ qua thị trường với sở hữu xã hội, hợp tác xã hoặc nhà nước đối với các tư liệu sản xuất quan trọng."
  },
  {
    title: "Kinh tế thị trường định hướng XHCN",
    body: "Cách diễn đạt được dùng ở một số nhà nước xã hội chủ nghĩa một đảng để kết hợp cơ chế thị trường với định hướng hiến định xã hội chủ nghĩa."
  },
  {
    title: "Mô hình Bắc Âu",
    body: "Kinh tế thị trường kết hợp thiết chế phúc lợi rộng, tổ chức lao động mạnh và mức cung cấp dịch vụ công cao."
  }
];

export default function SocialismPage() {
  const countries = getAllCountries().filter(
    (country) => country.hasCommunistRulingParty || country.officialIdeology?.toLowerCase().includes("social")
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Bách khoa"
        title="Chủ nghĩa xã hội là gì?"
        description="Chủ nghĩa xã hội là một nhóm tư tưởng chính trị - kinh tế nhấn mạnh công bằng xã hội, vai trò của cộng đồng hoặc nhà nước trong việc tổ chức sản xuất, phân phối phúc lợi và kiểm soát các nguồn lực quan trọng."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {branches.map((branch) => (
          <article key={branch.title} className="atlas-surface rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white"><TrText vi={branch.title} /></h2>
            <p className="mt-3 text-sm leading-6 text-slate-300"><TrText vi={branch.body} /></p>
          </article>
        ))}
      </div>

      <section className="mt-10 atlas-surface rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white"><TrText vi="Ghi chú về mô hình Bắc Âu" /></h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          <TrText vi="Mô hình Bắc Âu thường là kinh tế thị trường kết hợp nhà nước phúc lợi mạnh, không phải nhà nước xã hội chủ nghĩa theo nghĩa Marxist-Leninist." />
        </p>
      </section>

      <section className="mt-10 space-y-5">
        <SectionHeading
          title="Quốc gia có dấu hiệu XHCN"
          description="Danh sách này được suy ra từ hồ sơ hiện có và nên được đọc cùng phần tài liệu tham khảo của từng quốc gia."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {countries.map((country) => (
            <CountryCard key={country.iso3} country={country} />
          ))}
        </div>
      </section>
    </main>
  );
}
