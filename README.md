# World Ideology Atlas

## Tổng quan

World Ideology Atlas là dashboard dữ liệu chính trị trung lập, dùng để xem hồ sơ quốc gia theo nhiều lớp: hệ tư tưởng, nhóm chế độ, cấu trúc chính phủ, hình thức nhà nước, lãnh đạo, thiết chế, mô hình kinh tế, nguồn dữ liệu và mức độ tin cậy.

## Tính năng

- Dashboard tổng quan và bản đồ tương tác theo tọa độ quốc gia
- Trang quốc gia có tìm kiếm và bộ lọc
- Trang chi tiết quốc gia với bản sắc chính trị, lãnh đạo, thiết chế, kinh tế, nguồn và ghi chú
- Trang so sánh 2-4 quốc gia
- Trang bách khoa về chủ nghĩa xã hội
- Trang phương pháp luận và nguồn dữ liệu
- Đồng bộ REST Countries vào SQLite `.db`
- Bổ sung Wikidata tùy chọn cho trường hiện hành
- Chatbot Atlas AI dùng Gemini, tool calling nội bộ và chế độ dự phòng local

## Công nghệ

- Next.js
- React
- TypeScript
- Tailwind CSS
- SQLite qua `node:sqlite`
- Zod validation
- Gemini API qua `generateContent` phía server

## Chạy dự án

```bash
npm install
cp .env.example .env.local
npm run init:db
npm run sync:countries
npm run dev
```

Mở `http://localhost:3000`.

## Biến môi trường

```bash
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
ATLAS_DB_PATH=./data/world-ideology-atlas.db
DATA_SYNC_SECRET=
```

`GEMINI_API_KEY` chỉ được đọc ở phía server. Nếu chưa cấu hình, `/api/chatbot` dùng chế độ tra cứu local từ dataset.

## Mô hình dữ liệu

Hồ sơ quốc gia theo type `CountryPoliticalProfile` trong `lib/types.ts` và được kiểm tra bằng `lib/validation/country.ts`. SQLite lưu toàn bộ profile dạng JSON theo khóa ISO3 để có thể mở rộng trường dữ liệu mà không cần migration ngay.

## Nguồn dữ liệu

- REST Countries: metadata nền và cờ quốc gia
- Wikidata: bổ sung có cấu trúc cho lãnh đạo và cơ quan lập pháp
- Our World in Data / V-Dem: kế hoạch nhập nhóm chế độ
- CIA World Factbook: kế hoạch nhập nhánh chính quyền và hiến pháp
- World Bank / IMF / UN Data: kế hoạch nhập chỉ số kinh tế và phát triển

## API

- `GET /api/countries`
- `GET /api/countries/[iso3]`
- `GET /api/stats`
- `POST /api/compare`
- `POST /api/chatbot`
- `POST /api/data-sync/restcountries`

## Tool Calling

Đặc tả tool nằm trong `lib/ai/tools.ts`:

- `getCountryProfile`
- `searchCountries`
- `compareCountries`
- `getGlobalStats`
- `getSourcesForField`
- `fetchRestCountriesData`
- `queryWikidata`
- `webResearchPoliticalData`

## Phương pháp luận

World Ideology Atlas không gán quốc gia vào một nhãn chính trị duy nhất. Hồ sơ tách riêng hệ tư tưởng chính thức, bản sắc hiến định, mô hình chính phủ, hình thức nhà nước, chế độ chính trị, cấu trúc quyền lực, lãnh đạo, cơ quan lập pháp, kinh tế, nguồn, ngày cập nhật và mức độ tin cậy.

## Lộ trình

- Nhập dữ liệu OWID/V-Dem kèm phiên bản dataset
- Thêm đồng bộ CIA World Factbook cho nhánh chính quyền và hiến pháp
- Thêm chỉ số kinh tế từ World Bank
- Thay bản đồ hiện tại bằng lớp TopoJSON hoặc MapLibre đầy đủ
- Thêm RAG cho tài liệu phương pháp luận và nguồn
- Thêm quy trình rà soát trường có độ tin cậy thấp

## Tuyên bố miễn trừ

World Ideology Atlas là dự án dữ liệu và giáo dục. Phân loại chính trị có thể khác nhau giữa các nguồn. Dự án không đại diện cho quan điểm chính trị của bất kỳ tổ chức nào và không nhằm tuyên truyền hoặc công kích bất kỳ quốc gia, đảng phái hay hệ tư tưởng nào.

