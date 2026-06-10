# AtlasSocialism AI Agent (Bản đồ Chủ nghĩa & Bộ máy Nhà nước)

**AtlasSocialism AI Agent** (trước đây là World Ideology Atlas) là một nền tảng Dashboard dữ liệu chính trị, bách khoa toàn thư học thuật và hệ thống Trợ lý AI chuyên dụng phục vụ cho việc tra cứu, nghiên cứu và học tập các môn Lý luận chính trị (đặc biệt là Chủ nghĩa xã hội khoa học).

Dự án cung cấp cái nhìn trực quan, đa chiều về hệ tư tưởng, cấu trúc nhà nước, thiết chế chính trị, và mô hình kinh tế của hơn 250 quốc gia/vùng lãnh thổ trên thế giới.

---

## 🌟 Các tính năng nổi bật

### 1. 🗺️ Bản đồ & Bảng điều khiển (Dashboard)
- **Bản đồ tương tác toàn cầu:** Hiển thị và phân loại các quốc gia theo hệ tư tưởng, thể chế chính trị, dạng nhà nước và mô hình chính phủ trực quan trên quả địa cầu.
- **Dữ liệu thời gian thực:** Tích hợp thống kê số lượng dân số, diện tích và các thông số cơ bản liên tục.

### 2. 🏛️ Hồ sơ chính trị Quốc gia (Country Profiles)
Mỗi quốc gia sở hữu một trang hồ sơ chi tiết bao gồm các lớp dữ liệu:
- **Bản sắc chính trị:** Hệ tư tưởng chính thức/hiến định, dạng nhà nước (Đơn nhất/Liên bang), hình thức chính phủ, chế độ chính trị.
- **Lãnh đạo & Thiết chế:** Đảng cầm quyền, hệ thống đảng, cơ quan lập pháp, hiến pháp, và thông tin bầu cử.
- **Kinh tế & Lịch sử:** Mô hình kinh tế hiện tại, GDP, lịch sử hình thành nhà nước (chiều sâu văn minh, tuổi nhà nước, mốc lịch sử).
- **Nguồn gốc học thuật:** Dữ liệu được trích xuất từ các nguồn đáng tin cậy kèm theo mức độ tin cậy.

### 3. 📕 Bách khoa Chủ nghĩa xã hội (Socialism Encyclopedia)
Trang chuyên đề học thuật cung cấp kiến thức nền tảng và nâng cao về Chủ nghĩa xã hội khoa học (CNXHKH):
- **Các trường phái:** Phân biệt các trào lưu XHCN (Marx-Lenin, dân chủ xã hội, mô hình Bắc Âu...).
- **Nguồn gốc & Lịch sử:** Tiến trình từ CNXH không tưởng đến Tuyên ngôn Đảng Cộng sản và CNXH hiện đại.
- **Đặc trưng cơ bản:** 5 đặc trưng kinh tế, chính trị, văn hóa, xã hội của CNXH.
- **Quá độ & Việt Nam:** Lý luận về thời kỳ quá độ, đường lối Đổi mới và 8 đặc trưng CNXH tại Việt Nam.
- **Danh nhân & Thuật ngữ:** Các nhà tư tưởng tiêu biểu (Marx, Engels, Lenin, Hồ Chí Minh...) và bảng thuật ngữ thiết yếu.

### 4. 🤖 Trợ lý Atlas AI (Chatbot chuyên trách)
- Tích hợp hệ thống AI được huấn luyện nghiêm ngặt bằng Prompt Engineering để đóng vai trò chuyên gia Chính trị học.
- **Tuyệt đối tuân thủ học thuật:** Chỉ trả lời các câu hỏi về chính trị, nhà nước, lịch sử và học thuyết. Tự động từ chối các câu hỏi ngoài lề (code, toán, đời sống) hoặc các prompt nhạy cảm, bôi nhọ lãnh tụ.

### 5. 📰 Tin tức thời gian thực (Live News)
- Khả năng tìm kiếm tin tức chính trị, kinh tế, xã hội mới nhất (Breaking News) riêng biệt cho từng quốc gia bằng cách kết nối qua các API (Tavily, SerpApi, Firecrawl).

### 6. 📊 Xếp hạng & So sánh (Ranking & Compare)
- **Xếp hạng:** Phân tích dữ liệu để đưa ra các bảng xếp hạng về mức độ phổ biến của các mô hình thể chế.
- **So sánh:** Cho phép đặt 2 đến 4 quốc gia lên bàn cân để đối chiếu trực tiếp sự khác biệt trong hiến pháp, đảng phái và kinh tế.

---

## 🛠️ Công nghệ sử dụng
- **Framework:** Next.js (App Router), React, TypeScript.
- **Giao diện:** Tailwind CSS, Lucide Icons, UI Components tùy biến.
- **Tích hợp API:** Tavily, SerpApi (cho tin tức); AI Agents cho Chatbot.

## 🔒 Quy chuẩn Nội dung
Dự án được xây dựng dựa trên nguyên tắc:
1. **Trung lập & Khách quan:** Không gán mác một chiều, dữ liệu được trình bày thành nhiều lớp.
2. **Minh bạch:** Có đánh dấu độ tin cậy (Confidence Level) của dữ liệu và cảnh báo về sự biến động đối với tên lãnh đạo, chính phủ.

## 🚀 Hướng dẫn cài đặt & sử dụng

### 1. Yêu cầu hệ thống
- Node.js (phiên bản 18 trở lên)
- Trình quản lý gói `npm`, `yarn`, `pnpm` hoặc `bun`.

### 2. Cài đặt và Khởi chạy
Chạy các lệnh sau trong terminal để khởi động dự án:

```bash
# Cài đặt các thư viện cần thiết
npm install

# Khởi chạy server ở chế độ phát triển (Development)
npm run dev
```

Mở trình duyệt và truy cập vào [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### 3. Cấu hình Môi trường (Biến môi trường)
Để sử dụng đầy đủ chức năng của Chatbot và Tin tức thời gian thực, bạn cần tạo file `.env.local` ở thư mục gốc và cung cấp các API key tương ứng:

```env
# AI Chatbot (bắt buộc để Chatbot hoạt động)
OPENAI_API_KEY="sk-..."
# Hoặc sử dụng Gemini
GEMINI_API_KEY="AIza..."

# Tìm kiếm Tin tức (chọn 1 trong 3)
TAVILY_API_KEY="tvly-..."
SERPAPI_API_KEY="..."
FIRECRAWL_API_KEY="fc-..."
```

---
*Dự án phục vụ giáo dục, học tập và nghiên cứu.*
