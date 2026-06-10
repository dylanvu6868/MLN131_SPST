// UI chrome strings. Components are authored in Vietnamese; this maps each
// Vietnamese string to English for display when the language is "en".
// Keep keys identical to the literal text used in components.
export const UI_STRINGS: Record<string, string> = {
  // --- navbar ---
  "Bản đồ": "Map",
  "Biểu tượng": "Symbols",
  "Quốc gia": "Countries",
  "So sánh": "Compare",
  "Xã hội chủ nghĩa": "Socialism",
  "Tin tức": "News",
  "Xếp hạng": "Ranking",
  "Trang chủ AtlasSocialism AI Agent": "AtlasSocialism AI Agent home",
  "Điều hướng chính": "Primary navigation",
  "Điều hướng di động": "Mobile navigation",
  "Bản đồ Chủ nghĩa & Bộ máy Nhà nước": "A Map of Ideologies & State Machinery",
  "Đóng menu": "Close menu",
  "Mở menu điều hướng": "Open navigation menu",

  // --- home / map page ---
  "Bản đồ thế giới": "World map",
  "Chạm vào từng quốc gia để mở lớp thông tin chính trị": "Tap any country to open its political information layer",
  "Bản đồ giúp quan sát các nhóm chế độ, mô hình nhà nước và hồ sơ quốc gia trong cùng một không gian trực quan.":
    "The map lets you observe regime groups, state models, and country profiles in a single visual space.",
  "Kéo để di chuyển · Cuộn để zoom": "Drag to pan · Scroll to zoom",

  // --- world map panel ---
  "Bản đồ phân mảnh theo quốc gia": "Country-segmented map",
  "Bản đồ chính trị thế giới": "World political map",
  "Di chuột để xem nhanh · Bấm để mở hồ sơ": "Hover for a quick view · Click to open the profile",
  "Phóng to bản đồ": "Zoom in",
  "Thu nhỏ bản đồ": "Zoom out",
  "Đặt lại bản đồ": "Reset map",
  "Bản đồ thế giới phân tách theo quốc gia": "World map split by country",
  "Mở hồ sơ chi tiết": "Open full profile",
  "Không có hồ sơ cho": "No profile for",
  "chưa có hồ sơ": "no profile yet",
  "Di chuột lên một quốc gia để xem dữ liệu.": "Hover over a country to see its data.",
  "Chú giải màu theo nhóm chế độ:": "Color legend by regime group:",
  "Có lớp bổ sung Hoàng Sa và Trường Sa gần Việt Nam để quan sát trực quan":
    "Includes supplementary Paracel and Spratly layers near Vietnam for visual reference",
  "Dân chủ tự do: bầu cử cạnh tranh, pháp quyền và đối trọng thể chế mạnh.":
    "Liberal democracy: competitive elections, the rule of law, and strong institutional checks.",
  "Dân chủ bầu cử: có cạnh tranh đa đảng, chất lượng thể chế khác nhau theo từng nước.":
    "Electoral democracy: multi-party competition, with institutional quality varying by country.",
  "Chuyên chế bầu cử: có bầu cử nhưng cạnh tranh, truyền thông hoặc đối trọng bị hạn chế.":
    "Electoral autocracy: elections exist, but competition, media, or checks are constrained.",
  "Chuyên chế đóng: quyền lực tập trung cao, cạnh tranh chính trị thực chất rất hạn chế.":
    "Closed autocracy: highly centralized power, with very limited genuine political competition.",
  "Chưa xác định: cần bổ sung hoặc đối chiếu nguồn chuyên ngành.":
    "Unknown: requires additional data or cross-checking with specialized sources.",

  // --- countries page / explorer ---
  "Tìm kiếm, lọc và xem hồ sơ chính trị": "Search, filter, and view political profiles",
  "Lọc theo khu vực, nhóm chế độ, dấu hiệu nhà nước và các lớp bản sắc chính trị. Mỗi hồ sơ đều giữ nguồn và mức tin cậy.":
    "Filter by region, regime group, state markers, and political-identity layers. Every profile keeps its sources and confidence level.",
  "Tìm quốc gia": "Search countries",
  "Tìm theo tên hoặc mã ISO": "Search by name or ISO code",
  "Khu vực": "Region",
  "Tất cả khu vực": "All regions",
  "Nhóm chế độ": "Regime group",
  "Tất cả nhóm chế độ": "All regime groups",
  "Dấu hiệu nhà nước": "State markers",
  "Tất cả dấu hiệu": "All markers",
  "Đảng cộng sản cầm quyền": "Communist ruling party",
  "Quân chủ": "Monarchy",
  "Liên bang": "Federal",
  "Đơn nhất": "Unitary",
  "hồ sơ": "profiles",

  // --- shared atoms ---
  "Mở hồ sơ": "Open profile",
  "Cờ": "Flag",
  "Bỏ": "Remove",
  "Tên quốc gia": "Country",

  // --- country card ---
  "Mô hình chính phủ": "Government system",
  "Hình thức nhà nước": "State form",
  "Dân số": "Population",

  // --- country profile ---
  "Thủ đô": "Capital",
  "Diện tích": "Area",
  "Bản sắc chính trị": "Political identity",
  "Hệ tư tưởng chính thức": "Official ideology",
  "Bản sắc hiến định": "Constitutional identity",
  "Chế độ chính trị": "Political regime",
  "Cấu trúc quyền lực": "Power structure",
  "Lãnh đạo": "Leadership",
  "Đảng cầm quyền": "Ruling party",
  "Hệ thống đảng": "Party system",
  "Nguyên thủ quốc gia": "Head of state",
  "Người đứng đầu chính phủ": "Head of government",
  "Thiết chế": "Institutions",
  "Cơ quan lập pháp": "Legislature",
  "Cấu trúc lập pháp": "Legislative structure",
  "Tư pháp": "Judiciary",
  "Hiến pháp": "Constitution",
  "Bầu cử gần nhất": "Most recent election",
  "Bầu cử tiếp theo": "Next election",
  "Kinh tế & dấu hiệu": "Economy & markers",
  "Mô hình kinh tế": "Economic model",
  "GDP bình quân đầu người": "GDP per capita",
  "Trực tiếp": "Live",
  "năm": "yr",
  "Cập nhật từ Wikipedia": "Updated from Wikipedia",
  "Nguồn Wikipedia": "Wikipedia source",
  "Mô hình chính trị": "Political model",
  "Quân chủ / Cộng hòa": "Monarchy / Republic",
  "Liên bang / Đơn nhất": "Federal / Unitary",
  "Tóm tắt": "Summary",
  "Tài liệu tham khảo": "References",
  "Cập nhật hồ sơ:": "Profile updated:",
  "Ghi chú học thuật": "Academic notes",
  "Lịch sử hình thành": "Formation history",
  "Năm thành lập hiện đại": "Modern founding year",
  "Tuổi nhà nước": "State age",
  "Mốc lịch sử": "Key milestone",
  "Chiều sâu văn minh": "Civilizational depth",
  "Chưa có dữ liệu lịch sử hình thành cho quốc gia này.": "No formation-history data available for this country.",
  "Cộng hòa": "Republic",
  "Lãnh thổ/vùng tự trị hoặc cơ chế đặc thù": "Territory/autonomous region or special arrangement",
  "Không áp dụng trực tiếp với lãnh thổ/cơ chế đặc thù": "Not directly applicable to a territory/special arrangement",
  "Không áp dụng hoặc chưa có cờ dữ liệu riêng": "Not applicable or no dedicated data flag",
  "Có": "Yes",
  "Không": "No",

  // --- ranking ---
  "Sắp xếp quốc gia theo tiêu chí đánh giá": "Sort countries by evaluation criteria",
  "Chọn tiêu chí, khu vực và hướng sắp xếp để xem thứ tự quốc gia theo dữ liệu đang có trong hồ sơ.":
    "Choose a metric, region, and sort direction to rank countries by the data available in their profiles.",
  "Độ đầy đủ hồ sơ": "Profile completeness",
  "Mức tin cậy": "Confidence level",
  "Độ tham chiếu": "Reference depth",
  "GDP/người": "GDP per capita",
  "Điểm dân chủ": "Democracy score",
  "Cập nhật gần đây": "Recently updated",
  "Tỷ lệ thông tin chính trị, thiết chế và nhận diện quốc gia đã có trong hồ sơ.":
    "Share of political, institutional, and identity information already present in the profile.",
  "Quy đổi độ tin cậy của hồ sơ: cao, trung bình, thấp, chưa xác định.":
    "Confidence level of the profile: high, medium, low, or unknown.",
  "Mức độ phong phú của phần tham khảo trong hồ sơ quốc gia.": "How rich the reference section of the country profile is.",
  "Dân số của từng quốc gia.": "Population of each country.",
  "Diện tích lãnh thổ theo km2.": "Land area in km².",
  "Tổng sản phẩm quốc nội khi có số liệu.": "Gross domestic product where data is available.",
  "GDP bình quân đầu người khi có số liệu.": "GDP per capita where data is available.",
  "Điểm dân chủ khi có số liệu phù hợp.": "Democracy score where suitable data is available.",
  "Hồ sơ có ngày cập nhật mới nhất đứng trước.": "Profiles with the most recent update date come first.",
  "Bộ tiêu chí": "Criteria",
  "Tiêu chí": "Metric",
  "Thứ tự": "Order",
  "Cao đến thấp": "High to low",
  "Thấp đến cao": "Low to high",
  "Chỉ hiện mục có số liệu": "Only show items with data",
  "Bảng xếp hạng": "Ranking table",
  "quốc gia trong phạm vi hiện tại": "countries in the current scope",
  "Hạng": "Rank",
  "Giá trị": "Value",
  "Hồ sơ": "Profile",
  "Tiêu chí tổng hợp": "Composite metric",
  "Độ đầy đủ hồ sơ dựa trên 22 nhóm thông tin chính của mỗi quốc gia.":
    "Profile completeness based on 22 key information groups for each country.",
  "Khi thiếu số liệu": "When data is missing",
  "Những quốc gia chưa có số liệu cho tiêu chí đang chọn sẽ được đưa xuống cuối bảng.":
    "Countries without data for the selected metric are moved to the bottom of the table.",
  "Mỗi hồ sơ có mức tin cậy riêng để người xem cân nhắc khi so sánh.":
    "Each profile has its own confidence level for the reader to weigh when comparing.",
  "tham chiếu": "references",

  // --- compare ---
  "So sánh từ hai đến bốn quốc gia": "Compare two to four countries",
  "Bảng so sánh tách riêng bản sắc chính trị, cấu trúc nhà nước, lãnh đạo, mô hình kinh tế, độ tin cậy và nguồn dữ liệu.":
    "The comparison table separates political identity, state structure, leadership, economic model, confidence, and data sources.",
  "Thêm quốc gia": "Add a country",
  "Tải bảng so sánh": "Load comparison table",
  "Trường dữ liệu": "Field",
  "Ghi chú": "Notes",
  "Không thể so sánh.": "Unable to compare.",
  "Chưa có dữ liệu": "Data unavailable",
  "Phân loại chính trị có thể khác nhau tùy nguồn.": "Political classifications can vary by source.",
  "Các dòng đánh dấu cần xác minh nên được kiểm tra với nguồn chính thống hoặc nguồn thiết chế hiện hành.":
    "Rows marked as needing verification should be checked against authoritative or current institutional sources.",
  "Vui lòng cung cấp từ 2 đến 4 tên quốc gia hoặc mã ISO.": "Please provide 2 to 4 country names or ISO codes.",
  "Độ tin cậy": "Confidence",

  // --- socialism ---
  "Chủ nghĩa Marx-Lenin": "Marxism-Leninism",
  "Một truyền thống xã hội chủ nghĩa cách mạng gắn với cấu trúc nhà nước do đảng lãnh đạo và các thiết chế kinh tế kế hoạch hóa hoặc do nhà nước định hướng.":
    "A revolutionary socialist tradition tied to a party-led state structure and planned or state-directed economic institutions.",
  "Chủ nghĩa xã hội dân chủ": "Democratic socialism",
  "Một nhóm tiếp cận xã hội chủ nghĩa nhấn mạnh chính trị dân chủ, quyền tự do dân sự và sở hữu xã hội hoặc kiểm soát công mạnh.":
    "A family of socialist approaches emphasizing democratic politics, civil liberties, and strong social ownership or public control.",
  "Dân chủ xã hội": "Social democracy",
  "Một truyền thống cải cách vận hành trong kinh tế thị trường nhưng mở rộng phúc lợi, quyền lao động, tái phân phối và dịch vụ công.":
    "A reformist tradition operating within a market economy while expanding welfare, labor rights, redistribution, and public services.",
  "Chủ nghĩa xã hội thị trường": "Market socialism",
  "Mô hình kết hợp phân bổ qua thị trường với sở hữu xã hội, hợp tác xã hoặc nhà nước đối với các tư liệu sản xuất quan trọng.":
    "A model combining market allocation with social, cooperative, or state ownership of key means of production.",
  "Kinh tế thị trường định hướng XHCN": "Socialist-oriented market economy",
  "Cách diễn đạt được dùng ở một số nhà nước xã hội chủ nghĩa một đảng để kết hợp cơ chế thị trường với định hướng hiến định xã hội chủ nghĩa.":
    "A formulation used in some one-party socialist states to combine market mechanisms with a socialist constitutional orientation.",
  "Mô hình Bắc Âu": "The Nordic model",
  "Kinh tế thị trường kết hợp thiết chế phúc lợi rộng, tổ chức lao động mạnh và mức cung cấp dịch vụ công cao.":
    "A market economy combined with extensive welfare institutions, strong labor organization, and a high level of public-service provision.",
  "Bách khoa": "Encyclopedia",
  "Chủ nghĩa xã hội là gì?": "What is socialism?",
  "Chủ nghĩa xã hội là một nhóm tư tưởng chính trị - kinh tế nhấn mạnh công bằng xã hội, vai trò của cộng đồng hoặc nhà nước trong việc tổ chức sản xuất, phân phối phúc lợi và kiểm soát các nguồn lực quan trọng.":
    "Socialism is a family of political-economic ideas that emphasize social justice and the role of the community or state in organizing production, distributing welfare, and controlling key resources.",
  "Ghi chú về mô hình Bắc Âu": "A note on the Nordic model",
  "Mô hình Bắc Âu thường là kinh tế thị trường kết hợp nhà nước phúc lợi mạnh, không phải nhà nước xã hội chủ nghĩa theo nghĩa Marxist-Leninist.":
    "The Nordic model is typically a market economy combined with a strong welfare state, not a socialist state in the Marxist-Leninist sense.",
  "Quốc gia có dấu hiệu XHCN": "Countries with socialist markers",
  "Danh sách này được suy ra từ hồ sơ hiện có và nên được đọc cùng phần tài liệu tham khảo của từng quốc gia.":
    "This list is inferred from existing profiles and should be read alongside each country's reference section.",
  "Các trường phái chính": "Main branches",
  "Nguồn gốc & lịch sử phát triển": "Origins & historical development",
  "Đặc trưng cơ bản của CNXH": "Core characteristics of socialism",
  "Quá độ lên CNXH": "Transition to socialism",
  "CNXH ở Việt Nam": "Socialism in Vietnam",
  "Nhà tư tưởng tiêu biểu": "Key thinkers",
  "Thuật ngữ quan trọng": "Key terms",
  "Tên": "Name",
  "Năm sinh – mất": "Birth – Death",
  "Vai trò / Đóng góp": "Role / Contribution",

  // --- not found ---
  "Không tìm thấy hồ sơ": "Profile not found",
  "Hồ sơ quốc gia được yêu cầu chưa có trong bộ sưu tập hiện tại.":
    "The requested country profile is not in the current collection.",
  "Xem danh sách quốc gia": "View country list",

  // --- news ---
  "Cập nhật trong ngày": "Updated today",
  "Tin nóng theo từng quốc gia": "Top news by country",
  "Chọn quốc gia để xem các bài báo đáng chú ý nhất trong ngày hôm nay, gồm cả báo trong nước và báo quốc tế.":
    "Pick a country to see the most notable articles today, from both domestic and international outlets.",
  "Tìm và chọn quốc gia": "Search and select a country",
  "Gõ tên quốc gia để tìm…": "Type a country name to search…",
  "Không tìm thấy quốc gia phù hợp.": "No matching country found.",
  "Làm mới tin hôm nay": "Refresh today's news",
  "Tin thời gian thực chưa sẵn sàng": "Real-time news is not available",
  "Đọc bài viết": "Read article",
  "Chưa tìm thấy bài nổi bật trong ngày cho quốc gia này. Hãy thử làm mới sau ít phút.":
    "No featured articles found today for this country. Try refreshing in a few minutes.",
  "Không thể tải tin tức lúc này.": "Unable to load news right now.",
  "Báo quốc tế": "International outlet",

  // --- chatbot ---
  "Đang xem hồ sơ": "Viewing profile",
  "Hỏi đáp nhanh trên mọi trang": "Quick Q&A on every page",
  "Đóng Atlas AI": "Close Atlas AI",
  "Mở Atlas AI": "Open Atlas AI",
  "Hỏi Atlas AI": "Ask Atlas AI",
  "Trợ lý phân tích hồ sơ quốc gia": "Country-profile analysis assistant",
  "Atlas AI sẵn sàng hỗ trợ. Hãy hỏi theo nhiều lớp: hệ tư tưởng, hình thức nhà nước, cơ cấu quyền lực, lãnh đạo, kinh tế và tài liệu tham khảo.":
    "Atlas AI is ready to help. Ask across layers: ideology, state form, power structure, leadership, economy, and reference sources.",
  "Tra cứu công cụ:": "Tool lookup:",
  "Atlas AI đang suy nghĩ...": "Atlas AI is thinking...",
  "Đã xảy ra lỗi khi kết nối với Atlas AI.": "An error occurred while connecting to Atlas AI.",
  "Gửi tin nhắn": "Send message",
  "Giải thích hồ sơ chính trị của": "Explain the political profile of",
  "Hỏi về": "Ask about",
  "Hỏi về Việt Nam, Hoa Kỳ, Trung Quốc...": "Ask about Vietnam, the United States, China...",

  // --- country-symbols landing (chrome only; heritage content stays Vietnamese) ---
  "Biểu tượng quốc gia": "National symbols",
  "Di sản · Văn hóa · Bản sắc": "Heritage · Culture · Identity",
  "Chính trị": "Politics",
  "Di sản": "Heritage",
  "Văn hóa": "Culture",
  "Chọn quốc gia": "Select a country",
  "Khám phá di sản": "Explore heritage",
  "Xem xếp hạng": "View ranking",
  "Tên tiếng Anh": "English name",
  "Mã ISO": "ISO code",
  "Mức xác minh": "Verification level",
  "Xem vị trí trên bản đồ": "View location on map",
  "Trình duyệt của bạn không hỗ trợ phát âm thanh.": "Your browser does not support audio playback.",
  "Chưa có file âm thanh quốc ca đã xác minh.": "No verified national-anthem audio file yet.",
  "Nguồn kiểm chứng": "Verification source",
  "Lãnh đạo quốc gia hiện nay": "Current national leaders",
  "Cập nhật từ Wikipedia — nguyên thủ, thủ tướng, quân chủ, lãnh tụ và các chức vụ lãnh đạo cao nhất":
    "Updated from Wikipedia — heads of state, prime ministers, monarchs, leaders, and the highest leadership positions",
  "Nguyên thủ / Lãnh tụ": "Head of state / Leader",
  "Đứng đầu chính phủ": "Head of government",
  "Lãnh đạo nhà nước": "State leadership",
  "Nhậm chức từ năm": "In office since",
  "Mô hình": "System",
  "được đặt trong bối cảnh chính trị, văn hóa và di sản để người xem hiểu quốc gia như một chỉnh thể sống động.":
    "is placed in its political, cultural, and heritage context so viewers can understand the country as a living whole.",
  "Mỗi quốc gia được đặt trong bối cảnh chính trị, văn hóa và di sản để người xem hiểu quốc gia như một chỉnh thể sống động.":
    "Each country is placed in its political, cultural, and heritage context so viewers can understand it as a living whole.",
  "Tiếp tục khám phá": "Keep exploring",
  "Hồ sơ chi tiết": "Full profile",
  "Tin nóng": "Breaking news"
};
