import { BookOpen, Globe2, GraduationCap, Landmark, Lightbulb, ScrollText, Sparkles, Users } from "lucide-react";

import { CountryCard } from "@/components/countries/country-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrText } from "@/components/ui/tr-text";
import { getAllCountries } from "@/lib/countries";

/* ------------------------------------------------------------------ */
/*  Data: branches / characteristics / transitions / thinkers / VN    */
/* ------------------------------------------------------------------ */

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

const origins = [
  {
    period: "Thế kỷ 16–18",
    title: "Chủ nghĩa xã hội không tưởng",
    desc: "Thomas More (Utopia, 1516), Saint-Simon, Charles Fourier, Robert Owen phê phán bất bình đẳng và đề xuất xã hội lý tưởng dựa trên công bằng, nhưng thiếu cơ sở khoa học và con đường thực hiện cụ thể."
  },
  {
    period: "1848",
    title: "Tuyên ngôn của Đảng Cộng sản",
    desc: "Karl Marx và Friedrich Engels công bố Tuyên ngôn Cộng sản — đặt nền móng cho CNXH khoa học: phân tích mâu thuẫn giai cấp, quy luật vận động của tư bản, sứ mệnh lịch sử của giai cấp vô sản."
  },
  {
    period: "1867–1894",
    title: "Bộ Tư bản (Das Kapital)",
    desc: "Marx hoàn thành công trình phân tích sâu về phương thức sản xuất tư bản chủ nghĩa, giá trị thặng dư, tích lũy tư bản và mâu thuẫn nội tại dẫn đến sự chuyển hóa xã hội."
  },
  {
    period: "1917",
    title: "Cách mạng Tháng Mười Nga",
    desc: "V.I. Lenin lãnh đạo cuộc cách mạng vô sản thành công đầu tiên, thành lập nhà nước XHCN, phát triển chủ nghĩa Marx thành chủ nghĩa Marx-Lenin với lý luận về đảng tiên phong và chủ nghĩa đế quốc."
  },
  {
    period: "1945–1991",
    title: "Hệ thống XHCN thế giới",
    desc: "Hàng loạt nước ở Đông Âu, châu Á, Mỹ Latinh và châu Phi đi theo con đường XHCN. Sự sụp đổ của Liên Xô (1991) dẫn đến khủng hoảng nhưng không phủ nhận bản chất khoa học của học thuyết."
  },
  {
    period: "1986 – nay",
    title: "Đổi mới và CNXH thế kỷ 21",
    desc: "Việt Nam, Trung Quốc, Cuba, Lào tiếp tục con đường XHCN với cải cách kinh tế thị trường định hướng XHCN, khẳng định tính đúng đắn và sáng tạo của chủ nghĩa Marx-Lenin trong điều kiện mới."
  }
];

const characteristics = [
  {
    icon: "users",
    title: "Cơ sở kinh tế",
    desc: "Chế độ công hữu về tư liệu sản xuất chủ yếu, xóa bỏ chế độ người bóc lột người, thực hiện nguyên tắc phân phối theo lao động."
  },
  {
    icon: "landmark",
    title: "Chính trị",
    desc: "Nhà nước do nhân dân lao động làm chủ dưới sự lãnh đạo của Đảng Cộng sản — thiết lập nền dân chủ XHCN, đảm bảo quyền lực thực sự thuộc về nhân dân."
  },
  {
    icon: "book",
    title: "Tư tưởng – Văn hóa",
    desc: "Lấy chủ nghĩa Marx-Lenin làm nền tảng tư tưởng, xây dựng nền văn hóa tiên tiến, đậm đà bản sắc dân tộc, kế thừa tinh hoa văn hóa nhân loại."
  },
  {
    icon: "globe",
    title: "Xã hội",
    desc: "Xóa bỏ áp bức, bất công, thực hiện công bằng xã hội; các dân tộc bình đẳng, giải phóng phụ nữ, chăm lo đời sống nhân dân."
  },
  {
    icon: "sparkles",
    title: "Quan hệ quốc tế",
    desc: "Đoàn kết quốc tế của giai cấp công nhân, hữu nghị hợp tác với các dân tộc trên thế giới vì hòa bình, độc lập dân tộc, dân chủ và tiến bộ xã hội."
  }
];

const transitions = [
  {
    title: "Tính tất yếu",
    desc: "Sự quá độ từ CNTB lên CNXH là quy luật khách quan, bắt nguồn từ mâu thuẫn giữa lực lượng sản xuất mang tính xã hội hóa cao với quan hệ sản xuất dựa trên chế độ tư hữu tư bản."
  },
  {
    title: "Hai kiểu quá độ",
    desc: "Quá độ trực tiếp từ CNTB phát triển lên CNXH, và quá độ gián tiếp bỏ qua chế độ TBCN từ nước tiền tư bản (như Việt Nam — bỏ qua TBCN đi lên CNXH)."
  },
  {
    title: "Đặc điểm thời kỳ quá độ",
    desc: "Tồn tại đan xen nhiều thành phần kinh tế, nhiều giai cấp, tầng lớp xã hội; đấu tranh giữa cái cũ và cái mới trên mọi lĩnh vực; cần thời gian dài và sự lãnh đạo đúng đắn của Đảng."
  },
  {
    title: "Nội dung cơ bản",
    desc: "Công nghiệp hóa, hiện đại hóa; xây dựng quan hệ sản xuất mới; cách mạng tư tưởng và văn hóa; xây dựng con người mới XHCN; mở rộng và tăng cường quốc phòng – an ninh."
  }
];

const vietnamContent = [
  {
    title: "Con đường cách mạng Việt Nam",
    desc: "Hồ Chí Minh vận dụng sáng tạo chủ nghĩa Marx-Lenin, kết hợp với phong trào giải phóng dân tộc. Cách mạng Tháng Tám 1945 thành công mở ra kỷ nguyên độc lập, tự do cho dân tộc."
  },
  {
    title: "Đường lối Đổi Mới (1986)",
    desc: "Đại hội VI (1986) khởi xướng công cuộc Đổi Mới: chuyển từ kinh tế kế hoạch hóa tập trung sang kinh tế thị trường định hướng XHCN, mở cửa hội nhập quốc tế, giữ vững vai trò lãnh đạo của Đảng."
  },
  {
    title: "8 đặc trưng của CNXH ở VN",
    desc: "Dân giàu, nước mạnh, dân chủ, công bằng, văn minh; do nhân dân làm chủ; có nền kinh tế phát triển cao dựa trên LLSX hiện đại và QHSX tiến bộ; có nền văn hóa tiên tiến; con người có cuộc sống ấm no, tự do, hạnh phúc; các dân tộc bình đẳng, đoàn kết; có Nhà nước pháp quyền XHCN; có quan hệ hữu nghị, hợp tác với các nước."
  },
  {
    title: "Thành tựu sau Đổi Mới",
    desc: "GDP tăng gấp nhiều lần, tỷ lệ nghèo giảm từ ~58% (1993) xuống dưới 3% (2020); Việt Nam gia nhập WTO (2007), ký kết nhiều FTA thế hệ mới (CPTPP, EVFTA); vị thế quốc tế nâng cao, chính trị ổn định."
  }
];

const thinkers = [
  { name: "Karl Marx", years: "1818–1883", role: "Người sáng lập CNXH khoa học, tác giả Bộ Tư bản" },
  { name: "Friedrich Engels", years: "1820–1895", role: "Đồng sáng lập học thuyết Marx, phát triển chủ nghĩa duy vật biện chứng" },
  { name: "V.I. Lenin", years: "1870–1924", role: "Phát triển CN Marx thành CN Marx-Lenin, lãnh đạo CM Tháng Mười" },
  { name: "Hồ Chí Minh", years: "1890–1969", role: "Vận dụng sáng tạo CN Marx-Lenin vào Việt Nam, sáng lập Đảng CSVN" },
  { name: "Mao Trạch Đông", years: "1893–1976", role: "Trung Quốc hóa CN Marx-Lenin, lãnh đạo CM Trung Quốc 1949" },
  { name: "Fidel Castro", years: "1926–2016", role: "Lãnh đạo CM Cuba 1959, xây dựng CNXH ở Tây bán cầu" }
];

const keyTerms = [
  { term: "Lực lượng sản xuất (LLSX)", def: "Toàn bộ năng lực sản xuất của xã hội, bao gồm người lao động và tư liệu sản xuất." },
  { term: "Quan hệ sản xuất (QHSX)", def: "Quan hệ giữa người với người trong quá trình sản xuất: sở hữu, tổ chức quản lý, phân phối sản phẩm." },
  { term: "Giá trị thặng dư", def: "Phần giá trị do người lao động tạo ra vượt quá giá trị sức lao động, bị nhà tư bản chiếm đoạt." },
  { term: "Chuyên chính vô sản", def: "Quyền lực nhà nước của giai cấp vô sản trong thời kỳ quá độ, dùng để xây dựng CNXH và chống lại sự phản kháng của giai cấp bóc lột cũ." },
  { term: "Dân chủ XHCN", def: "Nền dân chủ mà quyền lực thuộc về nhân dân lao động, gấp triệu lần dân chủ tư sản theo Lenin." },
  { term: "Kinh tế thị trường định hướng XHCN", def: "Nền kinh tế vận hành theo cơ chế thị trường có sự quản lý của Nhà nước XHCN, do Đảng Cộng sản lãnh đạo." },
  { term: "Thời kỳ quá độ", def: "Giai đoạn chuyển tiếp từ xã hội cũ sang CNXH, trong đó tồn tại đan xen các yếu tố cũ và mới." },
  { term: "Đấu tranh giai cấp", def: "Cuộc đấu tranh giữa các giai cấp có lợi ích đối lập, là động lực phát triển của xã hội có giai cấp." }
];

/* ------------------------------------------------------------------ */
/*  Icon picker helper                                                 */
/* ------------------------------------------------------------------ */

function CharIcon({ kind }: { kind: string }) {
  const cls = "h-5 w-5";
  switch (kind) {
    case "users": return <Users className={cls} />;
    case "landmark": return <Landmark className={cls} />;
    case "book": return <BookOpen className={cls} />;
    case "globe": return <Globe2 className={cls} />;
    case "sparkles": return <Sparkles className={cls} />;
    default: return <Lightbulb className={cls} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SocialismPage() {
  const countries = getAllCountries().filter(
    (country) => country.hasCommunistRulingParty || country.officialIdeology?.toLowerCase().includes("social")
  );

  return (
    <main className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 lg:px-8">

      {/* ===== 1. HERO ===== */}
      <SectionHeading
        eyebrow="Bách khoa"
        title="Chủ nghĩa xã hội là gì?"
        description="Chủ nghĩa xã hội là một nhóm tư tưởng chính trị - kinh tế nhấn mạnh công bằng xã hội, vai trò của cộng đồng hoặc nhà nước trong việc tổ chức sản xuất, phân phối phúc lợi và kiểm soát các nguồn lực quan trọng."
      />

      {/* ===== 2. BRANCHES ===== */}
      <section>
        <h2 className="text-xl font-semibold text-white"><TrText vi="Các trường phái chính" /></h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {branches.map((b) => (
            <article key={b.title} className="atlas-surface rounded-lg p-5">
              <h3 className="text-lg font-semibold text-white"><TrText vi={b.title} /></h3>
              <p className="mt-3 text-sm leading-6 text-slate-300"><TrText vi={b.body} /></p>
            </article>
          ))}
        </div>
        <div className="mt-4 atlas-surface rounded-lg p-5">
          <h3 className="text-lg font-semibold text-white"><TrText vi="Ghi chú về mô hình Bắc Âu" /></h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            <TrText vi="Mô hình Bắc Âu thường là kinh tế thị trường kết hợp nhà nước phúc lợi mạnh, không phải nhà nước xã hội chủ nghĩa theo nghĩa Marxist-Leninist." />
          </p>
        </div>
      </section>

      {/* ===== 3. ORIGINS TIMELINE ===== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15">
            <ScrollText className="h-5 w-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-white"><TrText vi="Nguồn gốc & lịch sử phát triển" /></h2>
        </div>
        <div className="relative mt-6 ml-4 border-l-2 border-teal-500/30 pl-6 space-y-8">
          {origins.map((o, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-teal-400 bg-slate-900" />
              <p className="text-xs font-bold uppercase tracking-widest text-teal-400">{o.period}</p>
              <h3 className="mt-1 text-base font-semibold text-white">{o.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 4. FIVE CHARACTERISTICS ===== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
            <Lightbulb className="h-5 w-5 text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white"><TrText vi="Đặc trưng cơ bản của CNXH" /></h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {characteristics.map((c, i) => (
            <article key={i} className="atlas-surface rounded-lg p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                  <CharIcon kind={c.icon} />
                </div>
                <h3 className="font-semibold text-white">{c.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== 5. TRANSITION TO SOCIALISM ===== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/15">
            <GraduationCap className="h-5 w-5 text-violet-400" />
          </div>
          <h2 className="text-xl font-semibold text-white"><TrText vi="Quá độ lên CNXH" /></h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {transitions.map((t, i) => (
            <article key={i} className="atlas-surface rounded-lg p-5 border-l-4 border-violet-500/40">
              <h3 className="font-semibold text-white">{t.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{t.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== 6. SOCIALISM IN VIETNAM ===== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15">
            <Landmark className="h-5 w-5 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white"><TrText vi="CNXH ở Việt Nam" /></h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {vietnamContent.map((v, i) => (
            <article key={i} className="atlas-surface rounded-lg p-5">
              <h3 className="font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ===== 7. KEY THINKERS ===== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15">
            <Users className="h-5 w-5 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold text-white"><TrText vi="Nhà tư tưởng tiêu biểu" /></h2>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                <th className="py-3 pr-4 font-medium"><TrText vi="Tên" /></th>
                <th className="py-3 pr-4 font-medium"><TrText vi="Năm sinh – mất" /></th>
                <th className="py-3 font-medium"><TrText vi="Vai trò / Đóng góp" /></th>
              </tr>
            </thead>
            <tbody>
              {thinkers.map((t) => (
                <tr key={t.name} className="border-b border-slate-800/60">
                  <td className="py-3 pr-4 font-medium text-white whitespace-nowrap">{t.name}</td>
                  <td className="py-3 pr-4 text-teal-300 whitespace-nowrap">{t.years}</td>
                  <td className="py-3 text-slate-300">{t.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== 8. KEY TERMS ===== */}
      <section>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15">
            <BookOpen className="h-5 w-5 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white"><TrText vi="Thuật ngữ quan trọng" /></h2>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {keyTerms.map((k) => (
            <div key={k.term} className="atlas-surface rounded-lg p-4">
              <dt className="text-sm font-semibold text-teal-300">{k.term}</dt>
              <dd className="mt-1.5 text-sm leading-6 text-slate-300">{k.def}</dd>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 9. SOCIALIST-MARKER COUNTRIES ===== */}
      <section className="space-y-5">
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
