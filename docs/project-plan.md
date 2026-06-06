# World Ideology Atlas — Kế Hoạch End-to-End

## 1. Mục Tiêu Sản Phẩm

Xây dựng một atlas chính trị trung lập, có nguồn, trình bày mỗi quốc gia theo hồ sơ nhiều lớp:

- danh tính quốc gia và cờ
- hệ tư tưởng hiến định hoặc chính thức
- hình thức nhà nước và mô hình chính phủ
- nhóm chế độ và ghi chú về chế độ chính trị
- cấu trúc quyền lực, đảng cầm quyền, lãnh đạo, lập pháp, tư pháp
- mô hình kinh tế và metadata nguồn
- mức độ tin cậy và dấu hiệu dữ liệu thiếu
- chatbot Atlas AI dùng tool tra cứu nội bộ trước khi trả lời

## 2. Luồng Dữ Liệu

1. Lấy dữ liệu nền từ REST Countries.
2. Chuẩn hóa ISO2, ISO3, tên thường gọi/chính thức, cờ, thủ đô, dân số, diện tích, khu vực, tiểu khu vực, ngôn ngữ, tiền tệ và tọa độ.
3. Gộp với lớp override chính trị nội bộ cho các trường cấu trúc ổn định.
4. Tùy chọn truy vấn Wikidata cho nguyên thủ quốc gia, người đứng đầu chính phủ và cơ quan lập pháp.
5. Đánh dấu các trường chính trị nhạy thời gian hoặc chưa xác minh là `Needs verification`.
6. Kiểm tra mọi profile bằng Zod.
7. Lưu profile vào SQLite tại `data/world-ideology-atlas.db`.
8. Sinh `data/missing-data-report.json`.
9. API đọc từ SQLite, và fallback về `data/countries.sample.json` khi database trống.

## 3. API

- `GET /api/countries`
- `GET /api/countries/[iso3]`
- `GET /api/stats`
- `POST /api/compare`
- `POST /api/chatbot`
- `POST /api/data-sync/restcountries`

## 4. Luồng Chatbot

1. Người dùng gửi tin nhắn tới `/api/chatbot`.
2. Route kiểm tra dữ liệu đầu vào và giới hạn tần suất.
3. Nếu thiếu `GEMINI_API_KEY`, Atlas AI dùng chế độ dự phòng local.
4. Nếu Gemini đã cấu hình, server gọi `generateContent` với system prompt Atlas và function declarations.
5. Gemini có thể gọi tool nội bộ như `getCountryProfile`, `searchCountries`, `compareCountries`, `getGlobalStats`, `getSourcesForField`, `fetchRestCountriesData` và `queryWikidata` có giới hạn.
6. Kết quả tool được gửi lại cho Gemini để tạo câu trả lời cuối cùng trung lập, có nguồn.

## 5. Giai Đoạn Triển Khai

### Giai đoạn 1 — Bản hiện tại

- Scaffold Next.js
- Data layer SQLite
- Script và API đồng bộ REST Countries
- Bổ sung Wikidata tùy chọn
- API quốc gia, thống kê, so sánh
- Endpoint chatbot Gemini với tool nội bộ
- Dashboard, trang quốc gia, trang chi tiết, so sánh, phương pháp luận, nguồn, chủ nghĩa xã hội
- README và hướng dẫn chạy

### Giai đoạn 2 — Làm chắc dataset

- Nhập nhóm chế độ từ OWID/V-Dem kèm phiên bản và năm
- Thêm nhánh chính quyền và hiến pháp từ CIA World Factbook
- Thêm GDP và GDP bình quân đầu người từ World Bank
- Thêm quy trình rà soát trường dữ liệu mâu thuẫn

### Giai đoạn 3 — Trực quan hóa

- Thay bản đồ hiện tại bằng TopoJSON + React Simple Maps hoặc MapLibre
- Thêm biểu đồ theo khu vực, nhóm chế độ và hệ tư tưởng
- Thêm timeline cho bầu cử và thay đổi lãnh đạo ở trang chi tiết

### Giai đoạn 4 — RAG và rà soát

- Thêm vector search cho tài liệu phương pháp luận và nguồn
- Thêm citation theo nguồn cho từng câu trả lời
- Thêm trạng thái rà soát admin cho trường có độ tin cậy thấp

## 6. Thứ Tự Chạy

```bash
npm install
cp .env.example .env.local
npm run init:db
npm run sync:countries
npm run dev
```

Thiết lập `GEMINI_API_KEY` trong `.env.local` trước khi dùng chatbot Gemini đầy đủ.

