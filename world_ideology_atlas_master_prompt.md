# MASTER PROMPT — Xây dựng **World Ideology Atlas**
## Bản đồ Chủ nghĩa & Bộ máy Nhà nước Thế giới

> File này là prompt tổng hợp để đưa cho một AI coding agent / AI builder.  
> Mục tiêu: yêu cầu AI xây dựng trọn vẹn một website/dashboard trực quan hóa dữ liệu chính trị toàn cầu, có bản đồ tương tác, trang quốc gia, bộ lọc, so sánh, kho kiến thức về chủ nghĩa xã hội, và chatbot AI chuyên dụng có tool calling để tra cứu dữ liệu có nguồn.

---

## 0. Vai trò của AI nhận prompt này

Bạn là một **Senior Full-stack AI Product Engineer + Data Visualization Architect + Political Data System Designer**.

Nhiệm vụ của bạn là **thiết kế và xây dựng một web app hoàn chỉnh** tên **World Ideology Atlas** — một nền tảng trực quan hóa hệ tư tưởng, chế độ chính trị, mô hình nhà nước, cơ cấu quyền lực, lãnh đạo, đảng cầm quyền và dữ liệu chính trị của hơn 200 quốc gia/lãnh thổ trên thế giới.

Hãy triển khai theo hướng có thể chạy thực tế, mở rộng được, có kiến trúc dữ liệu rõ ràng, có giao diện đẹp, có hệ thống nguồn dữ liệu, và có chatbot AI chuyên dụng.

---

## 1. Tên dự án

Tên chính:

```txt
World Ideology Atlas
```

Tên tiếng Việt:

```txt
Bản đồ Chủ nghĩa & Bộ máy Nhà nước Thế giới
```

Tagline:

```txt
Trực quan hóa hệ tư tưởng, chế độ chính trị và bộ máy nhà nước của hơn 200 quốc gia.
```

---

## 2. Mục tiêu sản phẩm

Xây dựng một landing page/dashboard dữ liệu chính trị toàn cầu, không chỉ liệt kê quốc gia mà còn trực quan hóa theo nhiều lớp dữ liệu:

1. Quốc gia/lãnh thổ.
2. Cờ, tên chính thức, thủ đô, dân số, khu vực.
3. Hệ tư tưởng hiến định/chính thức.
4. Mô hình chế độ chính trị.
5. Hình thức nhà nước.
6. Hình thức chính phủ.
7. Cấu trúc quyền lực.
8. Đảng cầm quyền hoặc liên minh cầm quyền.
9. Nguyên thủ quốc gia.
10. Người đứng đầu chính phủ.
11. Quốc hội/cơ quan lập pháp.
12. Tư pháp/tòa án tối cao nếu có dữ liệu.
13. Mức độ dân chủ.
14. Mô hình kinh tế - xã hội.
15. Nguồn dữ liệu và ngày cập nhật.
16. Ghi chú học thuật khi dữ liệu gây tranh luận.

Website phải giúp người dùng hiểu rằng:

> Chính trị thế giới không thể được hiểu bằng một nhãn duy nhất. Mỗi quốc gia là sự kết hợp giữa lịch sử, hiến pháp, đảng phái, thiết chế, kinh tế và quyền lực thực tế.

Vì vậy, **không được gắn một nhãn đơn giản kiểu “nước này theo chủ nghĩa gì”**. Thay vào đó phải thiết kế hệ thống nhiều lớp:

```txt
Hệ tư tưởng chính thức
+ Hình thức nhà nước
+ Cơ chế quyền lực
+ Người đang nắm quyền
+ Mức độ dân chủ
+ Mô hình kinh tế
+ Nguồn dữ liệu
```

---

## 3. Nguyên tắc quan trọng về dữ liệu chính trị

Dữ liệu chính trị rất dễ gây tranh luận. Vì vậy, hệ thống phải tuân thủ các nguyên tắc sau:

### 3.1. Không tuyệt đối hóa nhãn chính trị

Không hiển thị một câu đơn giản như:

```txt
Việt Nam là nước X.
Hoa Kỳ là nước Y.
Trung Quốc là nước Z.
```

Thay vào đó, hiển thị theo nhiều trường:

```txt
officialIdeology
constitutionalIdentity
governmentSystem
stateForm
politicalRegime
regimeCategory
economicModel
rulingParty
powerStructure
notes
sources
```

### 3.2. Luôn có nguồn

Mọi dữ liệu nhạy cảm như:

- lãnh đạo hiện tại,
- đảng cầm quyền,
- phân loại chế độ,
- mức độ dân chủ,
- hiến pháp,
- bầu cử gần nhất,
- bầu cử tiếp theo,

phải có:

```txt
sources[]
dataUpdatedAt
confidenceLevel
```

### 3.3. Có cảnh báo học thuật

Với các trường gây tranh luận, UI phải có ghi chú:

```txt
Phân loại chính trị có thể khác nhau giữa các nguồn. Dữ liệu trên trang này được trình bày theo nhiều lớp và kèm nguồn để người dùng tự đối chiếu.
```

### 3.4. Không tuyên truyền, không định kiến

Dự án phải trung lập, học thuật, dựa trên dữ liệu, không ca ngợi hoặc công kích bất kỳ quốc gia, đảng phái, hệ tư tưởng hay thể chế nào.

---

## 4. Tech stack đề xuất

Ưu tiên build bằng stack hiện đại, dễ mở rộng.

### 4.1. Frontend

Sử dụng:

```txt
Next.js 14+ hoặc Next.js mới nhất
React
TypeScript
Tailwind CSS
Framer Motion
shadcn/ui
Lucide React
```

### 4.2. Visualization

Dùng một hoặc nhiều thư viện:

```txt
D3.js
React Simple Maps
Leaflet.js
MapLibre GL
Recharts
Nivo
```

Ưu tiên:

- `React Simple Maps` hoặc `D3 Geo` cho SVG world map.
- `Recharts` hoặc `Nivo` cho biểu đồ thống kê.
- `Leaflet/MapLibre` nếu cần bản đồ tương tác nâng cao.

### 4.3. Backend/API

Có thể dùng:

```txt
Next.js API routes
Node.js
PostgreSQL
Prisma ORM
Redis cache
```

Nếu muốn MVP nhanh:

```txt
JSON files trong /data
API routes đọc từ JSON
```

Nếu muốn production:

```txt
PostgreSQL + Prisma
Scheduled jobs để cập nhật dữ liệu
```

### 4.4. AI Chatbot

Có thể tích hợp:

```txt
OpenAI API hoặc LLM API tương đương
Tool calling
RAG
Vector database
```

Vector DB gợi ý:

```txt
pgvector
Pinecone
Qdrant
Weaviate
Chroma
```

---

## 5. Data sources bắt buộc/đề xuất

Hệ thống cần thiết kế để kéo dữ liệu từ nhiều nguồn.

### 5.1. REST Countries

Dùng cho dữ liệu nền:

```txt
Tên quốc gia
Tên chính thức
Cờ
ISO code
Thủ đô
Dân số
Khu vực
Tiểu khu vực
Diện tích
Ngôn ngữ
Tiền tệ
Tọa độ
```

URL nguồn:

```txt
https://restcountries.com/
```

### 5.2. Wikidata

Dùng cho dữ liệu có cấu trúc:

```txt
Nguyên thủ quốc gia
Người đứng đầu chính phủ
Đảng cầm quyền nếu có
Cơ quan lập pháp
Ngày thành lập
Hiến pháp
Thể chế
```

Cần hỗ trợ SPARQL query.

Nguồn:

```txt
https://www.wikidata.org/
https://query.wikidata.org/
```

### 5.3. Our World in Data / V-Dem / Regimes of the World

Dùng cho phân loại chế độ:

```txt
Liberal democracy
Electoral democracy
Electoral autocracy
Closed autocracy
```

Nguồn:

```txt
https://ourworldindata.org/
https://www.v-dem.net/
```

### 5.4. CIA World Factbook

Dùng cho government type, constitution, branches:

```txt
Government type
Executive branch
Legislative branch
Judicial branch
Constitution
Elections
Political parties
```

Nguồn:

```txt
https://www.cia.gov/the-world-factbook/
```

### 5.5. World Bank / IMF / UN Data

Dùng cho dữ liệu kinh tế - dân số:

```txt
GDP
GDP per capita
Population
Development indicators
Region
Income group
```

### 5.6. Ghi chú về độ tin cậy

Không được tự bịa dữ liệu. Nếu không có dữ liệu:

```txt
Unknown
Needs verification
Data unavailable
```

UI phải hiển thị rõ:

```txt
Dữ liệu đang chờ xác minh
```

---

## 6. Cấu trúc dữ liệu quốc gia

Tạo file:

```txt
/data/countries.json
```

Schema đề xuất:

```ts
export type CountryPoliticalProfile = {
  id: string;
  iso2: string;
  iso3: string;
  numericCode?: string;

  countryName: string;
  officialName: string;
  nativeName?: string;
  englishName: string;
  flagEmoji: string;
  flagSvgUrl?: string;

  region: "Africa" | "Americas" | "Asia" | "Europe" | "Oceania" | "Antarctic" | "Unknown";
  subregion?: string;
  capital?: string;
  population?: number;
  areaKm2?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };

  stateForm?: string;
  governmentSystem?: string;
  constitutionalIdentity?: string;
  officialIdeology?: string;
  ideologyFamily?: string[];

  politicalRegime?: string;
  regimeCategory?: "Liberal democracy" | "Electoral democracy" | "Electoral autocracy" | "Closed autocracy" | "Unknown";
  democracyScore?: number;
  democracySource?: string;

  powerStructure?: string;
  rulingParty?: string;
  rulingCoalition?: string;
  partySystem?: string;

  headOfStateTitle?: string;
  headOfState?: string;
  headOfStateSince?: string;

  headOfGovernmentTitle?: string;
  headOfGovernment?: string;
  headOfGovernmentSince?: string;

  legislature?: string;
  legislatureStructure?: "Unicameral" | "Bicameral" | "None" | "Unknown";
  judiciary?: string;
  constitution?: string;
  constitutionYear?: number;

  lastElection?: string;
  nextElection?: string;

  economicModel?: string;
  gdp?: number;
  gdpPerCapita?: number;

  hasCommunistRulingParty?: boolean;
  hasMilitaryGovernment?: boolean;
  isMonarchy?: boolean;
  isRepublic?: boolean;
  isFederal?: boolean;
  isUnitary?: boolean;

  summary?: string;
  notes?: string[];

  sources: DataSource[];
  dataUpdatedAt: string;
  confidenceLevel: "high" | "medium" | "low" | "unknown";
};

export type DataSource = {
  name: string;
  url?: string;
  field?: string;
  retrievedAt?: string;
};
```

---

## 7. Ví dụ dữ liệu mẫu

Tạo file mẫu:

```txt
/data/countries.sample.json
```

Ví dụ:

```json
[
  {
    "id": "vn",
    "iso2": "VN",
    "iso3": "VNM",
    "countryName": "Việt Nam",
    "officialName": "Cộng hòa xã hội chủ nghĩa Việt Nam",
    "englishName": "Vietnam",
    "flagEmoji": "🇻🇳",
    "region": "Asia",
    "subregion": "Southeast Asia",
    "capital": "Hà Nội",
    "population": 100300000,

    "stateForm": "Nhà nước đơn nhất",
    "governmentSystem": "Cộng hòa xã hội chủ nghĩa",
    "constitutionalIdentity": "Cộng hòa xã hội chủ nghĩa",
    "officialIdeology": "Xã hội chủ nghĩa",
    "ideologyFamily": ["Socialism", "Marxism-Leninism"],

    "politicalRegime": "Một đảng lãnh đạo",
    "regimeCategory": "Electoral autocracy",
    "powerStructure": "Đảng Cộng sản lãnh đạo nhà nước và xã hội",
    "rulingParty": "Đảng Cộng sản Việt Nam",
    "partySystem": "Một đảng lãnh đạo",

    "headOfStateTitle": "Chủ tịch nước",
    "headOfState": "Cần cập nhật từ nguồn dữ liệu",
    "headOfGovernmentTitle": "Thủ tướng",
    "headOfGovernment": "Cần cập nhật từ nguồn dữ liệu",

    "legislature": "Quốc hội",
    "legislatureStructure": "Unicameral",

    "economicModel": "Kinh tế thị trường định hướng xã hội chủ nghĩa",
    "hasCommunistRulingParty": true,
    "hasMilitaryGovernment": false,
    "isMonarchy": false,
    "isRepublic": true,
    "isFederal": false,
    "isUnitary": true,

    "summary": "Việt Nam là một nhà nước cộng hòa xã hội chủ nghĩa, đơn nhất, do Đảng Cộng sản Việt Nam lãnh đạo.",
    "notes": [
      "Phân loại chế độ có thể khác nhau tùy nguồn.",
      "Dữ liệu lãnh đạo cần được cập nhật định kỳ."
    ],
    "sources": [
      {
        "name": "REST Countries",
        "url": "https://restcountries.com/"
      },
      {
        "name": "Wikidata",
        "url": "https://www.wikidata.org/"
      },
      {
        "name": "Our World in Data",
        "url": "https://ourworldindata.org/"
      }
    ],
    "dataUpdatedAt": "YYYY-MM-DD",
    "confidenceLevel": "medium"
  }
]
```

---

## 8. Cấu trúc thư mục đề xuất

```txt
world-ideology-atlas/
├── app/
│   ├── page.tsx
│   ├── countries/
│   │   ├── page.tsx
│   │   └── [iso3]/
│   │       └── page.tsx
│   ├── compare/
│   │   └── page.tsx
│   ├── socialism/
│   │   └── page.tsx
│   ├── methodology/
│   │   └── page.tsx
│   ├── sources/
│   │   └── page.tsx
│   ├── api/
│   │   ├── countries/
│   │   │   └── route.ts
│   │   ├── countries/[iso3]/
│   │   │   └── route.ts
│   │   ├── stats/
│   │   │   └── route.ts
│   │   ├── chatbot/
│   │   │   └── route.ts
│   │   └── data-sync/
│   │       └── route.ts
├── components/
│   ├── layout/
│   ├── hero/
│   ├── dashboard/
│   ├── map/
│   ├── countries/
│   ├── charts/
│   ├── compare/
│   ├── chatbot/
│   └── ui/
├── data/
│   ├── countries.json
│   ├── countries.sample.json
│   ├── regime-categories.json
│   ├── ideology-taxonomy.json
│   └── sources.json
├── lib/
│   ├── data/
│   ├── api/
│   ├── wikidata/
│   ├── restcountries/
│   ├── owid/
│   ├── ai/
│   ├── validation/
│   └── utils/
├── prisma/
│   └── schema.prisma
├── public/
│   ├── maps/
│   └── flags/
├── docs/
│   ├── methodology.md
│   ├── data-policy.md
│   └── chatbot-system-prompt.md
└── README.md
```

---

## 9. Các trang chính cần xây dựng

### 9.1. Home / Landing page

Route:

```txt
/
```

Nội dung:

1. Navbar.
2. Hero section.
3. Dashboard tổng quan.
4. Bản đồ thế giới tương tác.
5. Bộ lọc nhanh.
6. Country explorer preview.
7. Section “Chủ nghĩa xã hội và các biến thể”.
8. Section “So sánh mô hình nhà nước”.
9. Section phương pháp luận và nguồn dữ liệu.
10. AI chatbot floating panel hoặc dedicated panel.
11. Footer.

Hero title:

```txt
Trực quan hóa hệ tư tưởng và bộ máy nhà nước của hơn 200 quốc gia
```

Hero description:

```txt
Khám phá thế giới qua bản đồ chính trị tương tác: mỗi quốc gia được phân loại theo hệ tư tưởng, mô hình nhà nước, cơ cấu quyền lực, đảng cầm quyền và lãnh đạo hiện tại.
```

CTA:

```txt
Khám phá bản đồ
So sánh quốc gia
Xem dữ liệu theo khu vực
Hỏi AI Atlas
```

---

### 9.2. Countries page

Route:

```txt
/countries
```

Tính năng:

- Search quốc gia.
- Filter theo khu vực.
- Filter theo regime category.
- Filter theo hệ tư tưởng chính thức.
- Filter theo hình thức nhà nước.
- Filter theo hình thức chính phủ.
- Filter cộng hòa/quân chủ.
- Filter liên bang/đơn nhất.
- Filter có đảng cộng sản cầm quyền.
- Filter có quân đội nắm quyền.
- Sort theo tên, dân số, GDP, mức độ dân chủ.
- Grid/list country cards.

---

### 9.3. Country detail page

Route:

```txt
/countries/[iso3]
```

Mỗi trang quốc gia cần có:

1. Header card:
   - Cờ.
   - Tên quốc gia.
   - Tên chính thức.
   - Thủ đô.
   - Khu vực.
   - Dân số.
   - Badge regime category.

2. Political identity:
   - Hệ tư tưởng chính thức.
   - Constitutional identity.
   - Government system.
   - State form.
   - Political regime.
   - Power structure.

3. Leadership:
   - Head of state.
   - Head of government.
   - Ruling party.
   - Party system.
   - Since date nếu có.

4. Institutions:
   - Legislature.
   - Legislature structure.
   - Judiciary.
   - Constitution.
   - Last election.
   - Next election.

5. Economy:
   - Economic model.
   - GDP.
   - GDP per capita.

6. Sources:
   - Danh sách nguồn.
   - Ngày cập nhật.
   - Confidence level.

7. Notes:
   - Ghi chú tranh luận/học thuật.

---

### 9.4. Compare page

Route:

```txt
/compare
```

Tính năng:

- Chọn 2 đến 4 quốc gia.
- So sánh theo bảng:

```txt
Tên
Cờ
Khu vực
Hình thức nhà nước
Hình thức chính phủ
Hệ tư tưởng chính thức
Regime category
Đảng cầm quyền
Nguyên thủ quốc gia
Người đứng đầu chính phủ
Quốc hội
Kinh tế
Nguồn
```

- Có “AI compare summary” để chatbot tóm tắt sự khác biệt.

---

### 9.5. Socialism encyclopedia page

Route:

```txt
/socialism
```

Nội dung học thuật, trung lập:

#### Chủ nghĩa xã hội là gì?

Giải thích ngắn:

```txt
Chủ nghĩa xã hội là một nhóm tư tưởng chính trị - kinh tế nhấn mạnh công bằng xã hội, vai trò của cộng đồng hoặc nhà nước trong việc tổ chức sản xuất, phân phối phúc lợi và kiểm soát các nguồn lực quan trọng.
```

#### Các nhánh lớn

Hiển thị card cho:

1. Marxism-Leninism.
2. Democratic Socialism.
3. Social Democracy.
4. Market Socialism.
5. Socialist-oriented Market Economy.
6. Communism.
7. Arab Socialism.
8. African Socialism.
9. Nordic Model.

Ghi chú bắt buộc:

```txt
Mô hình Bắc Âu thường là kinh tế thị trường kết hợp nhà nước phúc lợi mạnh, không phải nhà nước xã hội chủ nghĩa theo nghĩa Marxist-Leninist.
```

#### Các quốc gia có yếu tố XHCN chính thức

Không hard-code nếu không có nguồn. Lấy từ dataset và hiển thị kèm nguồn.

---

### 9.6. Methodology page

Route:

```txt
/methodology
```

Nội dung:

- Vì sao không dùng một nhãn duy nhất.
- Cách phân loại dữ liệu.
- Nguồn dữ liệu.
- Cách tính confidence level.
- Cách xử lý dữ liệu mâu thuẫn.
- Chính sách cập nhật.
- Cảnh báo về thiên lệch nguồn.

---

### 9.7. Sources page

Route:

```txt
/sources
```

Hiển thị:

- REST Countries.
- Wikidata.
- Our World in Data.
- V-Dem.
- CIA World Factbook.
- World Bank.
- UN Data.
- IMF.
- Nguồn khác nếu dùng.

Mỗi nguồn có:

```txt
Tên nguồn
URL
Loại dữ liệu lấy
Tần suất cập nhật
Độ tin cậy
Ghi chú
```

---

## 10. UI/UX Design

Phong cách:

```txt
Dark mode
Glassmorphism
Data dashboard
Academic but visually impressive
Political atlas
Premium SaaS dashboard
```

### 10.1. Màu nền

Dùng:

```txt
#070B16
#0F172A
#111827
```

Gradient:

```css
radial-gradient(circle at top left, rgba(80, 70, 229, 0.25), transparent 35%)
radial-gradient(circle at top right, rgba(14, 165, 233, 0.18), transparent 30%)
```

### 10.2. Màu phân loại regime

```txt
Liberal democracy: xanh lá/xanh dương
Electoral democracy: vàng
Electoral autocracy: cam
Closed autocracy: đỏ
Official socialist orientation: tím
Unknown: xám
```

Ví dụ mapping:

```ts
const regimeColors = {
  "Liberal democracy": "#22c55e",
  "Electoral democracy": "#eab308",
  "Electoral autocracy": "#f97316",
  "Closed autocracy": "#ef4444",
  "Unknown": "#64748b"
};
```

### 10.3. Font

Dùng:

```txt
Inter
Be Vietnam Pro
Manrope
```

### 10.4. Component style

Các component chính:

- `GlassCard`
- `StatCard`
- `CountryCard`
- `RegimeBadge`
- `SourceBadge`
- `ConfidenceBadge`
- `WorldMap`
- `FilterBar`
- `ComparisonTable`
- `AIChatPanel`

Card style:

```txt
border: 1px solid rgba(255,255,255,0.1)
background: rgba(15, 23, 42, 0.72)
backdrop-filter: blur(18px)
border-radius: 24px hoặc 28px
box-shadow: 0 30px 80px rgba(0,0,0,0.25)
```

---

## 11. Dashboard tổng quan

Tạo component:

```txt
GlobalSnapshot
```

Hiển thị chỉ số:

```txt
Tổng số quốc gia/lãnh thổ
Số nước cộng hòa
Số nước quân chủ
Số nước liên bang
Số nước đơn nhất
Số nước có yếu tố XHCN chính thức
Số nước liberal democracy
Số nước electoral democracy
Số nước electoral autocracy
Số nước closed autocracy
Số quốc gia thiếu dữ liệu
```

Biểu đồ:

1. Pie chart chế độ chính trị.
2. Bar chart theo khu vực.
3. Stacked bar region x regime.
4. Donut chart republic/monarchy.
5. Timeline nếu có dữ liệu lịch sử.

---

## 12. World map tương tác

Tạo component:

```txt
WorldPoliticalMap
```

Yêu cầu:

1. Hiển thị bản đồ thế giới.
2. Mỗi quốc gia được tô màu theo `regimeCategory`.
3. Hover hiển thị tooltip:
   - Tên nước.
   - Cờ.
   - Thủ đô.
   - Khu vực.
   - Regime category.
   - Government system.
4. Click mở side panel hoặc chuyển đến country detail page.
5. Có legend màu.
6. Có toggle layer:
   - Regime category.
   - Official ideology.
   - State form.
   - Government system.
   - Socialist orientation.
   - Federal/unitary.
7. Có zoom/pan nếu dùng Leaflet/MapLibre.

---

## 13. Bộ lọc thông minh

Filter bar cần có:

```txt
Search input
Region filter
Subregion filter
Regime category filter
Official ideology filter
State form filter
Government system filter
Federal/unitary filter
Republic/monarchy filter
Communist ruling party filter
Military government filter
Legislature structure filter
Population range
GDP range
Data confidence filter
```

Search phải tìm được theo:

```txt
Tên quốc gia
Tên tiếng Anh
ISO code
Đảng cầm quyền
Hệ tư tưởng
Mô hình nhà nước
Tên lãnh đạo
```

---

## 14. AI Chatbot chuyên dụng

Website cần có một chatbot AI chuyên biệt tên:

```txt
Atlas AI
```

Mục tiêu:

- Trả lời câu hỏi về dữ liệu chính trị quốc gia.
- So sánh quốc gia.
- Giải thích hệ tư tưởng.
- Tìm nguồn dữ liệu.
- Cảnh báo khi dữ liệu chưa đủ chắc chắn.
- Có tool calling để truy vấn dataset nội bộ và nguồn ngoài.

UI:

```txt
Floating chat bubble
Hoặc right-side AI panel
Có chế độ mở rộng toàn màn hình
Có suggested questions
Có source citations
Có confidence indicator
```

Suggested questions:

```txt
Việt Nam theo mô hình nhà nước nào?
So sánh Việt Nam và Trung Quốc.
Các nước nào có đảng cộng sản cầm quyền?
Liberal democracy khác electoral democracy như thế nào?
Quốc gia nào là quân chủ lập hiến?
Nước nào thuộc closed autocracy?
Giải thích kinh tế thị trường định hướng XHCN.
```

---

## 15. System prompt cho Atlas AI

Tạo file:

```txt
/docs/chatbot-system-prompt.md
```

Nội dung system prompt:

```md
# System Prompt — Atlas AI

Bạn là Atlas AI, trợ lý chuyên dụng của dự án World Ideology Atlas.

Vai trò của bạn là giải thích, tra cứu và so sánh dữ liệu chính trị - xã hội của các quốc gia dựa trên dataset nội bộ và nguồn dữ liệu đáng tin cậy.

## Nguyên tắc trả lời

1. Luôn trung lập, học thuật, không tuyên truyền, không kích động chính trị.
2. Không gán một quốc gia vào một nhãn duy nhất nếu dữ liệu có nhiều lớp.
3. Khi trả lời về một quốc gia, ưu tiên trình bày theo các lớp:
   - Hệ tư tưởng chính thức/hiến định
   - Hình thức nhà nước
   - Hình thức chính phủ
   - Cơ chế quyền lực
   - Đảng cầm quyền
   - Lãnh đạo hiện tại
   - Phân loại chế độ
   - Mô hình kinh tế
   - Nguồn dữ liệu
4. Nếu dữ liệu có tranh luận hoặc không chắc chắn, phải nói rõ.
5. Không được bịa nguồn, bịa số liệu hoặc bịa tên lãnh đạo.
6. Nếu dữ liệu chưa có trong dataset, hãy dùng tool tìm kiếm/nguồn ngoài nếu được cấp quyền.
7. Luôn hiển thị ngày cập nhật dữ liệu nếu có.
8. Với thông tin có thể thay đổi nhanh như lãnh đạo, bầu cử, đảng cầm quyền, phải kiểm tra nguồn cập nhật.
9. Không đưa lời khuyên chính trị, không vận động bầu cử, không kêu gọi ủng hộ/chống đối tổ chức chính trị.
10. Có thể giải thích khái niệm chính trị theo hướng giáo dục, so sánh, lịch sử, học thuật.

## Phong cách trả lời

- Rõ ràng.
- Có cấu trúc.
- Dùng bảng khi so sánh.
- Dùng bullet khi liệt kê.
- Có ghi chú “Dữ liệu có thể thay đổi” khi cần.
- Có citation/source nếu tool trả về nguồn.

## Khi người dùng hỏi “nước X theo chủ nghĩa gì?”

Không trả lời bằng một nhãn duy nhất. Hãy trả lời theo mẫu:

“Không nên gán [quốc gia] vào một nhãn duy nhất. Theo dataset hiện tại, có thể xem qua các lớp sau: ...”

Sau đó hiển thị:
- Hệ tư tưởng chính thức
- Constitutional identity
- Government system
- Political regime
- Economic model
- Notes
- Sources

## Khi thiếu dữ liệu

Trả lời:

“Hiện dataset chưa có đủ dữ liệu đáng tin cậy cho trường này. Tôi có thể hiển thị phần đã có và đánh dấu phần cần xác minh.”

## Khi nguồn mâu thuẫn

Trả lời:

“Các nguồn có thể phân loại khác nhau. Tôi sẽ trình bày từng nguồn và giải thích sự khác biệt.”

## Không được làm

- Không bịa dữ liệu.
- Không khẳng định tuyệt đối với dữ liệu tranh luận.
- Không dùng ngôn ngữ kích động.
- Không cổ vũ lật đổ, bạo lực, thù ghét hoặc cực đoan.
- Không biến câu trả lời thành tuyên truyền.
```

---

## 16. Tool calling cho Atlas AI

Thiết kế các tools sau.

### 16.1. getCountryProfile

```ts
type GetCountryProfileInput = {
  query: string; // country name, ISO2, ISO3
};

type GetCountryProfileOutput = {
  country: CountryPoliticalProfile | null;
  matchedBy?: string;
};
```

Mục đích:

```txt
Tìm profile quốc gia trong dataset nội bộ.
```

---

### 16.2. searchCountries

```ts
type SearchCountriesInput = {
  keyword?: string;
  region?: string;
  regimeCategory?: string;
  officialIdeology?: string;
  governmentSystem?: string;
  stateForm?: string;
  hasCommunistRulingParty?: boolean;
  hasMilitaryGovernment?: boolean;
  isMonarchy?: boolean;
  isRepublic?: boolean;
  isFederal?: boolean;
  isUnitary?: boolean;
};

type SearchCountriesOutput = {
  results: CountryPoliticalProfile[];
  total: number;
};
```

Mục đích:

```txt
Tìm và lọc quốc gia.
```

---

### 16.3. compareCountries

```ts
type CompareCountriesInput = {
  countries: string[]; // names or ISO codes
  fields?: string[];
};

type CompareCountriesOutput = {
  comparisonTable: Record<string, any>[];
  notes: string[];
  sources: DataSource[];
};
```

Mục đích:

```txt
So sánh 2-4 quốc gia.
```

---

### 16.4. getGlobalStats

```ts
type GetGlobalStatsInput = {
  groupBy?: "region" | "regimeCategory" | "officialIdeology" | "governmentSystem" | "stateForm";
};

type GetGlobalStatsOutput = {
  totalCountries: number;
  groupedStats: Record<string, number>;
  missingDataCount: number;
};
```

Mục đích:

```txt
Tính thống kê dashboard.
```

---

### 16.5. getSourcesForField

```ts
type GetSourcesForFieldInput = {
  country: string;
  field: string;
};

type GetSourcesForFieldOutput = {
  country: string;
  field: string;
  value: any;
  sources: DataSource[];
  dataUpdatedAt: string;
  confidenceLevel: string;
};
```

Mục đích:

```txt
Trả nguồn cho từng trường dữ liệu.
```

---

### 16.6. fetchRestCountriesData

```ts
type FetchRestCountriesDataInput = {
  country?: string;
  all?: boolean;
};

type FetchRestCountriesDataOutput = {
  data: any;
  retrievedAt: string;
};
```

Mục đích:

```txt
Lấy dữ liệu nền từ REST Countries.
```

---

### 16.7. queryWikidata

```ts
type QueryWikidataInput = {
  sparql: string;
  description: string;
};

type QueryWikidataOutput = {
  results: any[];
  retrievedAt: string;
};
```

Mục đích:

```txt
Truy vấn Wikidata bằng SPARQL.
```

---

### 16.8. webResearchPoliticalData

```ts
type WebResearchPoliticalDataInput = {
  query: string;
  country?: string;
  fieldsNeeded?: string[];
};

type WebResearchPoliticalDataOutput = {
  findings: {
    field: string;
    value: string;
    sourceName: string;
    sourceUrl: string;
    retrievedAt: string;
    confidence: "high" | "medium" | "low";
  }[];
  warnings: string[];
};
```

Mục đích:

```txt
Tìm dữ liệu ngoài khi dataset chưa đủ.
```

Rules:

```txt
Chỉ dùng nguồn đáng tin cậy.
Ưu tiên nguồn chính phủ, tổ chức quốc tế, Wikidata, CIA Factbook, OWID, V-Dem, World Bank.
Không dùng blog cá nhân làm nguồn chính.
```

---

## 17. API routes cần có

### 17.1. GET /api/countries

Query params:

```txt
search
region
subregion
regimeCategory
officialIdeology
governmentSystem
stateForm
isMonarchy
isRepublic
isFederal
isUnitary
hasCommunistRulingParty
hasMilitaryGovernment
sort
page
limit
```

Trả về:

```json
{
  "data": [],
  "total": 0,
  "page": 1,
  "limit": 24
}
```

### 17.2. GET /api/countries/[iso3]

Trả về profile chi tiết.

### 17.3. GET /api/stats

Trả về global dashboard stats.

### 17.4. POST /api/compare

Body:

```json
{
  "countries": ["VNM", "CHN"],
  "fields": ["governmentSystem", "officialIdeology", "rulingParty"]
}
```

### 17.5. POST /api/chatbot

Body:

```json
{
  "messages": [],
  "contextCountry": "VNM"
}
```

Có tool calling.

### 17.6. POST /api/data-sync/restcountries

Kéo/cập nhật REST Countries.

### 17.7. POST /api/data-sync/wikidata

Kéo/cập nhật Wikidata.

---

## 18. Data sync pipeline

Thiết kế pipeline:

```txt
1. Fetch base country data từ REST Countries.
2. Normalize ISO code, names, flags.
3. Merge với political dataset nội bộ.
4. Query Wikidata cho lãnh đạo và institution.
5. Import regime category từ OWID/V-Dem nếu có file/source.
6. Validate schema.
7. Assign confidence level.
8. Save vào database hoặc countries.json.
9. Log dữ liệu thiếu.
```

### 18.1. Data validation

Dùng Zod:

```ts
import { z } from "zod";

export const CountryPoliticalProfileSchema = z.object({
  id: z.string(),
  iso2: z.string(),
  iso3: z.string(),
  countryName: z.string(),
  officialName: z.string().optional(),
  region: z.string(),
  sources: z.array(z.object({
    name: z.string(),
    url: z.string().optional()
  })),
  dataUpdatedAt: z.string(),
  confidenceLevel: z.enum(["high", "medium", "low", "unknown"])
});
```

### 18.2. Missing data report

Tạo file:

```txt
/data/missing-data-report.json
```

Chứa:

```json
{
  "generatedAt": "YYYY-MM-DD",
  "missingFields": [
    {
      "country": "Example",
      "iso3": "XXX",
      "fields": ["headOfState", "rulingParty"]
    }
  ]
}
```

---

## 19. Classification taxonomy

Tạo file:

```txt
/data/regime-categories.json
```

```json
[
  {
    "id": "liberal-democracy",
    "label": "Liberal democracy",
    "labelVi": "Dân chủ tự do",
    "color": "#22c55e",
    "description": "Chế độ dân chủ có bầu cử cạnh tranh, quyền tự do dân sự rộng và ràng buộc quyền lực hiệu quả."
  },
  {
    "id": "electoral-democracy",
    "label": "Electoral democracy",
    "labelVi": "Dân chủ bầu cử",
    "color": "#eab308",
    "description": "Có bầu cử đa đảng cạnh tranh nhưng mức bảo vệ tự do dân sự hoặc kiểm soát quyền lực chưa đạt chuẩn dân chủ tự do."
  },
  {
    "id": "electoral-autocracy",
    "label": "Electoral autocracy",
    "labelVi": "Chuyên chế bầu cử",
    "color": "#f97316",
    "description": "Có bầu cử nhưng cạnh tranh bị bóp méo đáng kể, quyền lực không được kiểm soát đầy đủ."
  },
  {
    "id": "closed-autocracy",
    "label": "Closed autocracy",
    "labelVi": "Chuyên chế đóng",
    "color": "#ef4444",
    "description": "Không có bầu cử cạnh tranh thực chất ở cấp quốc gia hoặc quyền lực tập trung rất cao."
  },
  {
    "id": "unknown",
    "label": "Unknown",
    "labelVi": "Chưa xác định",
    "color": "#64748b",
    "description": "Chưa có đủ dữ liệu đáng tin cậy."
  }
]
```

Tạo file:

```txt
/data/ideology-taxonomy.json
```

Bao gồm:

```txt
Socialism
Marxism-Leninism
Communism
Democratic socialism
Social democracy
Market socialism
Socialist-oriented market economy
Liberalism
Conservatism
Islamic republic
Monarchy
Constitutional monarchy
Absolute monarchy
Republicanism
Nationalism
Military rule
One-party state
Federalism
Unitary state
```

---

## 20. Landing page component outline

### 20.1. Navbar

Menu:

```txt
Bản đồ
Quốc gia
Chủ nghĩa xã hội
So sánh
Phương pháp luận
Nguồn
Hỏi AI
```

### 20.2. Hero

Có:

- Eyebrow: `Political Data Visualization`
- H1 lớn.
- Description.
- CTA buttons.
- Hero card `Global Snapshot`.

### 20.3. Global Snapshot Card

Hiển thị 4-8 stat cards.

### 20.4. Interactive Map Section

Có world map placeholder nếu chưa implement ngay.

### 20.5. Country Explorer

Grid quốc gia với card:

```txt
Cờ
Tên
Thủ đô
Khu vực
Badge ideology/regime
Mô hình chính phủ
Cấu trúc nhà nước
Đảng cầm quyền
Lãnh đạo
```

### 20.6. Socialism Section

4 card:

```txt
Chủ nghĩa xã hội
Marxism-Leninism
Dân chủ xã hội
Kinh tế thị trường định hướng XHCN
```

### 20.7. Compare Section

Có CTA đến `/compare`.

### 20.8. AI Chat Section

Giới thiệu Atlas AI:

```txt
Hỏi AI chuyên dụng về hệ tư tưởng, mô hình nhà nước, lãnh đạo và nguồn dữ liệu chính trị của từng quốc gia.
```

---

## 21. Code mẫu HTML/CSS/JS để tham khảo khi build UI

Nếu build không dùng Next.js, có thể bắt đầu từ HTML/CSS/JS tĩnh. Tuy nhiên ưu tiên Next.js.

### 21.1. index.html tham khảo

```html
<header class="navbar">
  <div class="logo">🌐 Ideology Atlas</div>
  <nav>
    <a href="#map">Bản đồ</a>
    <a href="#countries">Quốc gia</a>
    <a href="#socialism">Chủ nghĩa xã hội</a>
    <a href="#compare">So sánh</a>
  </nav>
</header>

<section class="hero">
  <div class="hero-content">
    <p class="eyebrow">Political Data Visualization</p>
    <h1>Trực quan hóa hệ tư tưởng và bộ máy nhà nước của hơn 200 quốc gia</h1>
    <p>
      Khám phá thế giới qua bản đồ chính trị tương tác: mỗi quốc gia được phân loại
      theo mô hình nhà nước, cơ cấu quyền lực, hệ tư tưởng, đảng cầm quyền và lãnh đạo hiện tại.
    </p>
    <div class="hero-actions">
      <a href="#countries" class="btn primary">Khám phá quốc gia</a>
      <a href="#socialism" class="btn secondary">Tìm hiểu Chủ nghĩa Xã hội</a>
    </div>
  </div>
</section>
```

---

## 22. Yêu cầu responsive

Website phải hoạt động tốt trên:

```txt
Desktop
Laptop
Tablet
Mobile
```

Breakpoints:

```txt
>=1280px: full dashboard
1024px: compact dashboard
768px: tablet layout
<640px: mobile stacked layout
```

Mobile:

- Navbar chuyển thành hamburger.
- Country cards 1 cột.
- Filter thành accordion.
- Chatbot full-screen modal.
- Map có scroll/zoom phù hợp.

---

## 23. Accessibility

Bắt buộc:

```txt
Semantic HTML
ARIA labels cho map và chatbot
Keyboard navigation
Focus states
Color contrast tốt
Không chỉ dựa vào màu để truyền ý nghĩa
```

Mỗi badge màu phải có label chữ.

---

## 24. SEO

Metadata:

```txt
title: World Ideology Atlas — Bản đồ hệ tư tưởng và bộ máy nhà nước thế giới
description: Khám phá hệ tư tưởng, chế độ chính trị, mô hình nhà nước, đảng cầm quyền và lãnh đạo của hơn 200 quốc gia qua bản đồ tương tác.
keywords: political atlas, world politics, ideology map, political regimes, socialism, democracy, government systems
```

Open Graph:

```txt
og:title
og:description
og:image
```

---

## 25. Security & safety

### 25.1. Chatbot safety

Chatbot không được:

- Tuyên truyền chính trị.
- Kêu gọi bạo lực.
- Hướng dẫn lật đổ chính quyền.
- Cổ vũ thù ghét.
- Bịa dữ liệu.
- Đưa kết luận không nguồn với dữ liệu nhạy cảm.

### 25.2. API safety

- Rate limit chatbot API.
- Validate input.
- Sanitize output.
- Không expose API keys.
- Không cho user chạy SPARQL tuỳ ý nếu không kiểm soát.
- Nếu có web search, whitelist nguồn tin cậy khi có thể.

---

## 26. Performance

Yêu cầu:

```txt
Lazy load map
Virtualized country grid nếu >200 cards
Cache API responses
Static generation cho country pages nếu có thể
Compress JSON
Use suspense/loading skeletons
```

---

## 27. Roadmap phát triển

### Phase 1 — MVP static

- Landing page.
- Countries grid.
- Filter/search.
- Static countries sample.
- Basic stats.
- Static socialism encyclopedia.
- Chatbot UI mock.

### Phase 2 — Real dataset

- REST Countries integration.
- Political dataset JSON.
- Country detail pages.
- Source display.
- Missing data report.

### Phase 3 — Visualization

- Interactive world map.
- Charts.
- Compare page.
- Region/regime analytics.

### Phase 4 — AI Atlas

- Real chatbot API.
- Tool calling nội bộ.
- RAG docs.
- Source citations.
- Country compare summary.

### Phase 5 — Data sync

- Wikidata SPARQL.
- OWID/V-Dem import.
- Scheduled update jobs.
- Data confidence system.
- Admin review UI.

---

## 28. Acceptance criteria

Sản phẩm được xem là đạt khi:

1. Có landing page đẹp, dark mode, glassmorphism.
2. Có bản đồ hoặc placeholder rõ ràng cho bản đồ tương tác.
3. Có ít nhất 4 country cards mẫu.
4. Có dataset schema rõ ràng.
5. Có filter/search hoạt động.
6. Có dashboard stats.
7. Có section chủ nghĩa xã hội và các biến thể.
8. Có compare page hoặc compare component.
9. Có country detail page.
10. Có source/citation area.
11. Có chatbot UI tên Atlas AI.
12. Có system prompt chatbot rõ ràng.
13. Có tool calling spec cho chatbot.
14. Có API routes hoặc kế hoạch API rõ.
15. Có README hướng dẫn chạy project.
16. Không hard-code dữ liệu nhạy cảm mà không đánh dấu cần cập nhật.
17. Có cảnh báo về tính tranh luận của phân loại chính trị.
18. Code sạch, TypeScript type rõ, component tách riêng.
19. Responsive tốt.
20. Có kế hoạch mở rộng data sync từ internet.

---

## 29. Prompt triển khai trực tiếp cho AI coding agent

Dùng đoạn sau để ra lệnh build:

```txt
Hãy xây dựng project World Ideology Atlas bằng Next.js, TypeScript, Tailwind CSS và shadcn/ui.

Yêu cầu:
- Tạo landing page dashboard chính trị toàn cầu.
- Dark mode, glassmorphism, giao diện premium.
- Có hero section, global stats, world map section, country explorer, socialism encyclopedia preview, compare preview và Atlas AI chatbot panel.
- Tạo dữ liệu mẫu trong /data/countries.sample.json với ít nhất Việt Nam, Hoa Kỳ, Trung Quốc, Vương quốc Anh.
- Thiết kế schema CountryPoliticalProfile đầy đủ.
- Tạo API routes: /api/countries, /api/countries/[iso3], /api/stats, /api/compare, /api/chatbot.
- Tạo trang /countries, /countries/[iso3], /compare, /socialism, /methodology, /sources.
- Tạo chatbot UI tên Atlas AI.
- Tạo file docs/chatbot-system-prompt.md chứa system prompt chuyên dụng.
- Tạo tool calling spec trong lib/ai/tools.ts gồm getCountryProfile, searchCountries, compareCountries, getGlobalStats, getSourcesForField, fetchRestCountriesData, queryWikidata, webResearchPoliticalData.
- Luôn hiển thị source, dataUpdatedAt và confidenceLevel cho dữ liệu chính trị.
- Không gán quốc gia vào một nhãn chính trị duy nhất; phải trình bày theo nhiều lớp.
- Có cảnh báo phương pháp luận về dữ liệu chính trị gây tranh luận.
- Có README hướng dẫn chạy, cấu trúc project, nguồn dữ liệu và roadmap.

Hãy generate code hoàn chỉnh, có thể chạy được bằng:
npm install
npm run dev
```

---

## 30. Nội dung README cần tạo

README phải có:

```txt
# World Ideology Atlas

## Overview
## Features
## Tech Stack
## Project Structure
## Data Model
## Data Sources
## AI Chatbot
## Tool Calling
## Methodology
## Development
## Roadmap
## Disclaimer
```

Disclaimer:

```txt
World Ideology Atlas là dự án dữ liệu và giáo dục. Phân loại chính trị có thể khác nhau giữa các nguồn. Dự án không đại diện cho quan điểm chính trị của bất kỳ tổ chức nào và không nhằm tuyên truyền hoặc công kích bất kỳ quốc gia, đảng phái hay hệ tư tưởng nào.
```

---

## 31. Kết luận sản phẩm

Thông điệp cuối trang:

```txt
Chính trị thế giới không thể được hiểu bằng một nhãn duy nhất. Mỗi quốc gia là sự kết hợp giữa lịch sử, hiến pháp, đảng phái, thiết chế, kinh tế và quyền lực thực tế. World Ideology Atlas giúp người xem khám phá các mô hình đó một cách trực quan, có nguồn và có thể so sánh.
```

Điểm cốt lõi:

```txt
Đừng chỉ gắn nhãn “nước này theo chủ nghĩa gì”.
Hãy thiết kế thành hệ thống nhiều lớp:
hệ tư tưởng chính thức + hình thức nhà nước + cơ chế quyền lực + người đang nắm quyền + mức độ dân chủ + nguồn dữ liệu.
```
