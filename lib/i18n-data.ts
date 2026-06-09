// Shared bilingual data. English is the canonical/stored form (in the DB);
// Vietnamese is produced at display time. The same tables are reused by the
// one-time DB migration (scripts/normalize-db-to-english.ts) so the two
// directions can never drift apart.

export type Lang = "vi" | "en";

export type Bi = { en: string; vi: string };

// ---------------------------------------------------------------------------
// Finite controlled-vocabulary phrases (1:1 between English and Vietnamese).
// Covers every distinct value present across the dataset for the prose fields,
// plus regime/confidence/region labels, the standard notes, and UI chrome.
// ---------------------------------------------------------------------------
export const PHRASES: Bi[] = [
  // --- generic placeholders ---
  { en: "Data unavailable", vi: "Chưa có dữ liệu" },
  { en: "Needs verification", vi: "Cần xác minh" },
  { en: "Unknown", vi: "Chưa xác định" },
  { en: "Not classified", vi: "Chưa phân loại" },
  { en: "Yes", vi: "Có" },
  { en: "No", vi: "Không" },

  // --- region ---
  { en: "Africa", vi: "Châu Phi" },
  { en: "Americas", vi: "Châu Mỹ" },
  { en: "Asia", vi: "Châu Á" },
  { en: "Europe", vi: "Châu Âu" },
  { en: "Oceania", vi: "Châu Đại Dương" },
  { en: "Antarctic", vi: "Châu Nam Cực" },

  // --- regime category ---
  { en: "Liberal democracy", vi: "Dân chủ tự do" },
  { en: "Electoral democracy", vi: "Dân chủ bầu cử" },
  { en: "Electoral autocracy", vi: "Chuyên chế bầu cử" },
  { en: "Closed autocracy", vi: "Chuyên chế đóng" },

  // --- legislature structure ---
  { en: "Unicameral", vi: "Một viện" },
  { en: "Bicameral", vi: "Hai viện" },
  { en: "None", vi: "Không có" },

  // --- state form ---
  { en: "Unitary republic", vi: "Cộng hòa đơn nhất" },
  { en: "Federal republic", vi: "Cộng hòa liên bang" },
  { en: "Unitary monarchy", vi: "Quân chủ đơn nhất" },
  { en: "Federal monarchy", vi: "Quân chủ liên bang" },
  { en: "Dependent territory / autonomous region", vi: "Lãnh thổ phụ thuộc / vùng tự trị" },
  { en: "Unitary socialist republic", vi: "Cộng hòa xã hội chủ nghĩa đơn nhất" },
  { en: "Unitary constitutional monarchy", vi: "Quân chủ lập hiến đơn nhất" },

  // --- government system ---
  { en: "Representative democracy", vi: "Chính thể dân chủ đại diện" },
  { en: "Electoral republic with limited political competition", vi: "Cộng hòa có bầu cử với cạnh tranh chính trị hạn chế" },
  { en: "Territorial administration within the administering state's framework", vi: "Chính quyền lãnh thổ trong khuôn khổ quốc gia quản lý" },
  { en: "Constitutional or absolute monarchy depending on context", vi: "Quân chủ lập hiến hoặc quân chủ chuyên chế tùy bối cảnh" },
  { en: "Highly centralized government", vi: "Chính quyền tập trung quyền lực cao" },
  { en: "Parliamentary constitutional monarchy", vi: "Quân chủ lập hiến đại nghị" },
  { en: "Federal presidential constitutional republic", vi: "Cộng hòa hiến định tổng thống liên bang" },
  { en: "Socialist republic led by the Communist Party", vi: "Cộng hòa xã hội chủ nghĩa do Đảng Cộng sản lãnh đạo" },
  { en: "Socialist republic with a one-party political system", vi: "Cộng hòa xã hội chủ nghĩa với hệ thống một đảng" },
  { en: "Socialist republic with a one-party-led political system", vi: "Cộng hòa xã hội chủ nghĩa với hệ thống chính trị do một đảng lãnh đạo" },

  // --- official ideology ---
  { en: "No single official ideology / verify against constitutional sources", vi: "Không có hệ tư tưởng chính thức duy nhất / cần đối chiếu nguồn hiến định" },
  { en: "No single official ideology", vi: "Không có hệ tư tưởng chính thức duy nhất" },
  { en: "Socialism", vi: "Chủ nghĩa xã hội" },
  { en: "Socialism with Chinese characteristics", vi: "Chủ nghĩa xã hội đặc sắc Trung Quốc" },

  // --- constitutional identity ---
  { en: "Constitutional identity is presented according to the state form, political regime, and current foundational documents.", vi: "Bản sắc hiến định được trình bày theo hình thức nhà nước, chế độ chính trị và văn bản nền tảng hiện hành." },
  { en: "Socialist state under the people's democratic dictatorship", vi: "Nhà nước xã hội chủ nghĩa dưới nền chuyên chính dân chủ nhân dân" },
  { en: "Socialist state", vi: "Nhà nước xã hội chủ nghĩa" },
  { en: "Socialist republic", vi: "Cộng hòa xã hội chủ nghĩa" },
  { en: "Constitutional monarchy", vi: "Quân chủ lập hiến" },
  { en: "Constitutional monarchy with parliamentary sovereignty", vi: "Quân chủ lập hiến với chủ quyền nghị viện" },
  { en: "Constitutional republic", vi: "Cộng hòa hiến định" },

  // --- ideology family / coalition / elections (generic templates) ---
  { en: "Composite political identity", vi: "Bản sắc chính trị tổng hợp" },
  { en: "The ruling coalition or political force is read from the composition of the incumbent government.", vi: "Liên minh hoặc lực lượng chính trị cầm quyền được đọc theo thành phần chính phủ đương nhiệm." },
  { en: "Most recent election information is updated from encyclopedic sources and electoral authorities when data is available.", vi: "Thông tin bầu cử gần nhất được cập nhật theo nguồn bách khoa và cơ quan bầu cử khi có dữ liệu." },
  { en: "The next election schedule depends on the constitutional cycle and announcements by the electoral authority.", vi: "Lịch bầu cử tiếp theo phụ thuộc chu kỳ hiến định và thông báo của cơ quan bầu cử." },

  // --- political regime (free strings beyond the enum) ---
  { en: "One-party-led state; classification varies by dataset", vi: "Nhà nước do một đảng lãnh đạo; phân loại có thể khác nhau theo từng hệ thống đánh giá" },
  { en: "Parliamentary democracy", vi: "Dân chủ đại nghị" },
  { en: "One-party socialist state", vi: "Nhà nước xã hội chủ nghĩa một đảng" },
  { en: "Multi-party electoral democracy with two major parties", vi: "Dân chủ bầu cử đa đảng với hai đảng lớn chi phối" },

  // --- power structure ---
  { en: "Elections take place, but political competition, the media, or checks-and-balances institutions are significantly constrained.", vi: "Có bầu cử nhưng cạnh tranh chính trị, truyền thông hoặc thiết chế đối trọng bị hạn chế đáng kể." },
  { en: "Power is formed through multi-party elections, with varying degrees of checks and institutional quality.", vi: "Quyền lực hình thành qua bầu cử đa đảng, với mức độ đối trọng và chất lượng thể chế khác nhau." },
  { en: "Local authority is constrained by the sovereign state or the territorial administration.", vi: "Quyền lực địa phương chịu ràng buộc bởi quốc gia hoặc thể chế quản lý lãnh thổ." },
  { en: "Power is checked by competitive elections, the rule of law, and strong counterbalancing institutions.", vi: "Quyền lực được kiểm soát bởi bầu cử cạnh tranh, pháp quyền và các thiết chế đối trọng mạnh." },
  { en: "Power is highly centralized, with very limited or no genuine political competition.", vi: "Quyền lực tập trung cao, cạnh tranh chính trị thực chất rất hạn chế hoặc không tồn tại." },
  { en: "The Communist Party occupies the leading role in state and society.", vi: "Đảng Cộng sản giữ vai trò lãnh đạo trong nhà nước và xã hội." },
  { en: "The Communist Party is constitutionally recognized as the leading force of society and the state.", vi: "Đảng Cộng sản được hiến pháp công nhận là lực lượng lãnh đạo xã hội và nhà nước." },
  { en: "Executive government is responsible to the Riksdag under a constitutional monarchy.", vi: "Chính phủ hành pháp chịu trách nhiệm trước Riksdag trong khuôn khổ quân chủ lập hiến." },
  { en: "Executive authority is exercised by ministers responsible to Parliament, with the monarch as head of state.", vi: "Quyền hành pháp do các bộ trưởng chịu trách nhiệm trước Nghị viện thực thi, với quân chủ là nguyên thủ quốc gia." },
  { en: "Separated federal powers across executive, legislative, and judicial branches.", vi: "Quyền lực liên bang được phân tách giữa hành pháp, lập pháp và tư pháp." },
  { en: "The Communist Party leads the state and society under the constitutional framework.", vi: "Đảng Cộng sản lãnh đạo nhà nước và xã hội trong khuôn khổ hiến định." },

  // --- party system ---
  { en: "Party-system information is summarized according to the level of political competition and the current electoral pattern.", vi: "Hệ thống đảng phái được tổng hợp theo mức độ cạnh tranh chính trị và mô hình bầu cử hiện hành." },
  { en: "One-party-led system with legally recognized allied parties", vi: "Hệ thống do một đảng lãnh đạo với các đảng đồng minh được pháp luật công nhận" },
  { en: "One-party system", vi: "Hệ thống một đảng" },
  { en: "Multi-party parliamentary system", vi: "Hệ thống đại nghị đa đảng" },
  { en: "Multi-party system with two major parties", vi: "Hệ thống đa đảng với hai đảng lớn" },
  { en: "Two-party dominant system", vi: "Hệ thống hai đảng chi phối" },
  { en: "One-party-led system", vi: "Hệ thống do một đảng lãnh đạo" },

  // --- ruling party ---
  { en: "Ruling-party information is presented according to the electoral context, the incumbent government, or current governance arrangements.", vi: "Thông tin đảng cầm quyền được trình bày theo bối cảnh bầu cử, chính phủ đương nhiệm hoặc cơ chế quản trị hiện hành." },
  { en: "Communist Party of Vietnam", vi: "Đảng Cộng sản Việt Nam" },
  { en: "Chinese Communist Party", vi: "Đảng Cộng sản Trung Quốc" },
  { en: "Communist Party of Cuba", vi: "Đảng Cộng sản Cuba" },

  // --- judiciary ---
  { en: "Court system and judicial bodies under the applicable law", vi: "Hệ thống tòa án và cơ quan tư pháp theo pháp luật hiện hành" },
  { en: "Supreme Court", vi: "Tòa án Tối cao" },
  { en: "Supreme Court of the United Kingdom", vi: "Tòa án Tối cao Vương quốc Anh" },

  // --- constitution ---
  { en: "Constitution, basic law, or current foundational legal framework", vi: "Văn bản hiến pháp, luật cơ bản hoặc khuôn khổ pháp lý nền tảng hiện hành" },
  { en: "Constitution of the United States", vi: "Hiến pháp Hoa Kỳ" },
  { en: "Constitution of Vietnam", vi: "Hiến pháp Việt Nam" },

  // --- economic model ---
  { en: "Mixed economy; the degree of state intervention varies by country", vi: "Kinh tế hỗn hợp; mức độ can thiệp nhà nước khác nhau theo từng quốc gia" },
  { en: "Mixed economy; no standardized GDP figure in the current dataset", vi: "Kinh tế hỗn hợp; chưa có số liệu GDP chuẩn hóa trong bộ dữ liệu hiện tại" },
  { en: "Socialist-oriented market economy", vi: "Kinh tế thị trường định hướng xã hội chủ nghĩa" },
  { en: "Socialist market economy", vi: "Kinh tế thị trường xã hội chủ nghĩa" },
  { en: "State-led socialist economy with market reforms", vi: "Kinh tế xã hội chủ nghĩa do nhà nước dẫn dắt, có cải cách thị trường" },
  { en: "Market economy with mixed regulatory and welfare institutions", vi: "Kinh tế thị trường với thiết chế điều tiết và phúc lợi hỗn hợp" },
  { en: "Market economy with welfare-state institutions", vi: "Kinh tế thị trường với thiết chế nhà nước phúc lợi" },
  { en: "Market economy with extensive welfare-state institutions", vi: "Kinh tế thị trường với thiết chế nhà nước phúc lợi rộng" },

  // --- head of state / government titles ---
  { en: "Head of state", vi: "Nguyên thủ quốc gia" },
  { en: "Head of state / administering state", vi: "Nguyên thủ/quốc gia quản lý" },
  { en: "Head of government", vi: "Người đứng đầu chính phủ" },
  { en: "Local administration", vi: "Chính quyền địa phương" },
  { en: "President", vi: "Tổng thống" },
  { en: "Prime Minister", vi: "Thủ tướng" },
  { en: "Monarch", vi: "Quân chủ" },
  { en: "President / Head of government", vi: "Tổng thống / Người đứng đầu chính phủ" },
  { en: "Collective executive body", vi: "Cơ quan hành pháp tập thể" },
  { en: "Party General Secretary and President", vi: "Tổng Bí thư kiêm Chủ tịch nước" },

  // --- showcase summaries (bespoke) ---
  { en: "Vietnam is represented as a multi-layered profile: socialist constitutional identity, unitary state form, one-party-led power structure, and a market economy with socialist orientation.", vi: "Việt Nam được trình bày như một hồ sơ nhiều lớp: bản sắc hiến định xã hội chủ nghĩa, hình thức nhà nước đơn nhất, cấu trúc quyền lực do một đảng lãnh đạo và kinh tế thị trường định hướng xã hội chủ nghĩa." },
  { en: "The United States is represented through a federal constitutional structure, presidential government, separated powers, and a market-based mixed economy.", vi: "Hoa Kỳ được trình bày qua cấu trúc hiến định liên bang, chính phủ tổng thống, phân quyền và nền kinh tế hỗn hợp dựa trên thị trường." },
  { en: "China is represented as a socialist constitutional system with a unitary state form, Communist Party leadership, and a socialist market economy.", vi: "Trung Quốc được trình bày như một hệ thống hiến định xã hội chủ nghĩa với nhà nước đơn nhất, vai trò lãnh đạo của Đảng Cộng sản và kinh tế thị trường xã hội chủ nghĩa." },
  { en: "The United Kingdom is represented as a parliamentary constitutional monarchy with a unitary state structure and a market-based mixed economy.", vi: "Vương quốc Anh được trình bày như một quân chủ lập hiến đại nghị với cấu trúc nhà nước đơn nhất và kinh tế hỗn hợp dựa trên thị trường." },
  { en: "Sweden is represented as a parliamentary constitutional monarchy with a market economy and strong welfare-state institutions.", vi: "Thụy Điển được trình bày như một quân chủ lập hiến đại nghị với kinh tế thị trường và thiết chế nhà nước phúc lợi mạnh." },
  { en: "Cuba is represented as a socialist republic with Communist Party leadership and a state-led economy with reform elements.", vi: "Cuba được trình bày như một cộng hòa xã hội chủ nghĩa với sự lãnh đạo của Đảng Cộng sản và nền kinh tế do nhà nước dẫn dắt, có yếu tố cải cách." },

  // --- standard notes (present on every country) ---
  { en: "Political fields are initialized conservatively and require source review.", vi: "Các trường chính trị được khởi tạo một cách thận trọng và cần được rà soát nguồn." },
  { en: "Classifications may differ across datasets and should not be reduced to a single label.", vi: "Phân loại có thể khác nhau giữa các bộ dữ liệu và không nên quy về một nhãn duy nhất." },
  { en: "The regime classification on the map is a visual reference layer and should be read together with the methodology and updated data sources.", vi: "Phân loại chế độ trên bản đồ là lớp tham chiếu trực quan, cần đọc cùng phương pháp luận và nguồn dữ liệu cập nhật." },
  { en: "Some fields for dependent territories or disputed areas are presented according to the administering entity or autonomy arrangement and should be read with current official sources.", vi: "Một số trường của lãnh thổ phụ thuộc/vùng tranh chấp được trình bày theo chủ thể quản lý hoặc cơ chế tự trị, cần đọc cùng nguồn chính thức hiện hành." },
  { en: "Current office holders and governing-party status are time-sensitive and should be verified during sync.", vi: "Người giữ chức vụ hiện tại và tình trạng đảng cầm quyền có thể thay đổi theo thời gian và nên được đối chiếu khi đồng bộ." },
  { en: "Current leaders should be verified through Wikidata or another current source during sync.", vi: "Lãnh đạo hiện tại nên được đối chiếu qua Wikidata hoặc nguồn cập nhật khác khi đồng bộ." },
  // economic / territory notes
  { en: "French overseas region; GDP is usually included in French/INSEE statistics.", vi: "Vùng hải ngoại của Pháp; GDP thường nằm trong thống kê Pháp/INSEE." },
  { en: "French overseas collectivity; local/INSEE statistical sources are needed.", vi: "Cộng đồng hải ngoại của Pháp; cần nguồn thống kê địa phương/INSEE." },
  { en: "Australian offshore territory; GDP is not separately standardized in World Bank data.", vi: "Lãnh thổ ngoài khơi của Úc; số liệu GDP không tách chuẩn trong World Bank." },
  { en: "Overseas territory; GDP figures may sit in local statistics / UK OTs.", vi: "Lãnh thổ hải ngoại; số liệu GDP có thể nằm trong nguồn thống kê địa phương/UK OTs." },
  { en: "Island with no permanent population; national GDP does not apply.", vi: "Đảo không có dân cư thường trú; không áp dụng GDP quốc gia." },
  { en: "Antarctica has no national economy in the conventional sense.", vi: "Nam Cực không có nền kinh tế quốc gia theo nghĩa thông thường." },
  { en: "Military/special territory; civilian GDP is not standardized.", vi: "Lãnh thổ quân sự/đặc thù; GDP dân sự không được chuẩn hóa." },
  { en: "Overseas territory; local statistical sources are needed for GDP.", vi: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương cho GDP." },
  { en: "Overseas territory; local Gibraltar statistical sources are needed.", vi: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương Gibraltar." },
  { en: "Overseas territory; local Montserrat statistical sources are needed.", vi: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương Montserrat." },
  { en: "Overseas territory; local Saint Helena statistical sources are needed.", vi: "Lãnh thổ hải ngoại; cần nguồn thống kê địa phương Saint Helena." },
  { en: "Special municipality of the Netherlands; figures are usually reported within Dutch/Caribbean statistics.", vi: "Đơn vị đặc biệt thuộc Hà Lan; số liệu thường tách theo thống kê Hà Lan/Caribe." },
  { en: "Associated state of New Zealand; some international sources lack a complete GDP series.", vi: "Quốc gia liên kết New Zealand; một số nguồn quốc tế không có chuỗi GDP đầy đủ." },
  { en: "Associated state of New Zealand; the international GDP series is incomplete.", vi: "Quốc gia liên kết New Zealand; chuỗi GDP quốc tế không đầy đủ." },
  { en: "Dependent territory of New Zealand; international GDP data is incomplete.", vi: "Lãnh thổ phụ thuộc New Zealand; dữ liệu GDP quốc tế không đầy đủ." },
  { en: "Overseas territory; GDP figures are usually taken from local statistics.", vi: "Lãnh thổ hải ngoại; số liệu GDP thường lấy từ thống kê địa phương." },
  { en: "Territory with no permanent population; national GDP does not apply.", vi: "Vùng lãnh thổ không có dân cư thường trú; GDP quốc gia không áp dụng." },
  { en: "Crown Dependency; GDP figures sit in local Guernsey statistics.", vi: "Crown Dependency; số liệu GDP nằm ở thống kê địa phương Guernsey." },
  { en: "Crown Dependency; GDP figures sit in local Jersey statistics.", vi: "Crown Dependency; số liệu GDP nằm ở thống kê địa phương Jersey." },
  { en: "Kosovo has economic data in some sources but it is not standardized across the entire current dataset.", vi: "Kosovo có dữ liệu kinh tế ở một số nguồn nhưng không chuẩn hóa trong toàn bộ bộ dữ liệu hiện tại." },
  { en: "North Korea does not fully publish GDP data to World Bank/IMF standards.", vi: "Triều Tiên không công bố đầy đủ dữ liệu GDP theo chuẩn World Bank/IMF." },
  { en: "Very small population; no standardized national GDP.", vi: "Dân số rất nhỏ; không có GDP quốc gia chuẩn hóa." },
  { en: "No permanent population; national GDP does not apply.", vi: "Không có dân cư thường trú; GDP quốc gia không áp dụng." },
  { en: "Special territory of Norway; local GDP is not standardized as a national figure.", vi: "Lãnh thổ đặc thù của Na Uy; GDP địa phương không chuẩn hóa như quốc gia." },
  { en: "Taiwan is absent from some national World Bank APIs; Taiwan/IMF statistical sources are needed.", vi: "Đài Loan không có trong một số API World Bank quốc gia; cần nguồn thống kê Đài Loan/IMF." },
  { en: "Small outlying islands of the United States; no separate national GDP.", vi: "Các đảo nhỏ xa bờ của Hoa Kỳ; không có GDP quốc gia riêng." },
  { en: "The Vatican does not publish GDP by conventional national standards.", vi: "Vatican không công bố GDP theo chuẩn quốc gia thông thường." },
  { en: "Western Sahara has disputed status; standardized GDP figures are inconsistent.", vi: "Tây Sahara có tình trạng tranh chấp; số liệu GDP chuẩn hóa không thống nhất." },
  { en: "Small autonomous-territory economy; internationally standardized GDP is absent from World Bank.", vi: "Kinh tế lãnh thổ tự trị nhỏ; số liệu GDP chuẩn hóa quốc tế không có trong World Bank." }
];

// ---------------------------------------------------------------------------
// Per-territory profile prose (head of state / government / legislature /
// power structure). Each entry is the canonical English (stored in the DB)
// alongside its Vietnamese rendering. Keyed by ISO3.
// ---------------------------------------------------------------------------
export type TerritoryProfile = {
  head?: Bi;
  government?: Bi;
  legislature?: Bi;
  powerStructure?: Bi;
};

const sovereignFinland = { head: { en: "President of Finland", vi: "Tổng thống Phần Lan" } };

export const TERRITORY: Record<string, TerritoryProfile> = {
  ALA: { head: { en: "President of Finland", vi: "Tổng thống Phần Lan" }, government: { en: "Government of Åland", vi: "Chính phủ tự trị Åland" }, legislature: { en: "Parliament of Åland", vi: "Nghị viện Åland" } },
  ASM: { head: { en: "President of the United States", vi: "Tổng thống Hoa Kỳ" }, government: { en: "Governor of American Samoa", vi: "Thống đốc American Samoa" }, legislature: { en: "American Samoa Fono", vi: "Fono American Samoa" } },
  AIA: { head: { en: "Monarch of the United Kingdom", vi: "Quốc vương Vương quốc Anh" }, government: { en: "Governor and Premier of Anguilla", vi: "Thống đốc và Thủ hiến Anguilla" }, legislature: { en: "Anguilla House of Assembly", vi: "Hạ viện Anguilla" } },
  ATA: { head: { en: "No separate head of state", vi: "Không có nguyên thủ quốc gia riêng" }, government: { en: "Administered under the Antarctic Treaty System", vi: "Quản trị theo Hệ thống Hiệp ước Nam Cực" }, legislature: { en: "No national legislature", vi: "Không có cơ quan lập pháp quốc gia" } },
  BVT: { head: { en: "Monarch of Norway", vi: "Quốc vương Na Uy" }, government: { en: "Administered by Norway", vi: "Na Uy quản lý" }, legislature: { en: "No permanent local legislature", vi: "Không có cơ quan lập pháp địa phương thường trú" } },
  IOT: { head: { en: "Monarch of the United Kingdom", vi: "Quốc vương Vương quốc Anh" }, government: { en: "Commissioner of the British Indian Ocean Territory", vi: "Ủy viên Lãnh thổ Ấn Độ Dương thuộc Anh" }, legislature: { en: "No elected local legislature", vi: "Không có cơ quan lập pháp dân cử địa phương" } },
  VGB: { head: { en: "Monarch of the United Kingdom", vi: "Quốc vương Vương quốc Anh" }, government: { en: "Governor and Premier of the British Virgin Islands", vi: "Thống đốc và Thủ tướng Quần đảo Virgin thuộc Anh" }, legislature: { en: "House of Assembly of the British Virgin Islands", vi: "Hạ viện Quần đảo Virgin thuộc Anh" } },
  BES: { head: { en: "Monarch of the Netherlands", vi: "Quốc vương Hà Lan" }, government: { en: "Public bodies of the Caribbean Netherlands", vi: "Cơ quan công quyền Caribe thuộc Hà Lan" }, legislature: { en: "Island Councils", vi: "Hội đồng đảo" } },
  CXR: { head: { en: "Monarch of Australia", vi: "Quốc vương Úc" }, government: { en: "Territory administration administered by Australia", vi: "Chính quyền lãnh thổ do Úc quản lý" }, legislature: { en: "Christmas Island Shire Council", vi: "Hội đồng Shire Đảo Christmas" } },
  CCK: { head: { en: "Monarch of Australia", vi: "Quốc vương Úc" }, government: { en: "Territory administration administered by Australia", vi: "Chính quyền lãnh thổ do Úc quản lý" }, legislature: { en: "Cocos (Keeling) Islands Shire Council", vi: "Hội đồng Shire Quần đảo Cocos" } },
  GUF: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Territorial administration of French Guiana", vi: "Chính quyền lãnh thổ Guyane thuộc Pháp" }, legislature: { en: "Assembly of French Guiana", vi: "Hội đồng French Guiana" } },
  PYF: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "President of the Government of French Polynesia", vi: "Tổng thống Chính phủ Polynésie thuộc Pháp" }, legislature: { en: "Assembly of French Polynesia", vi: "Hội đồng French Polynesia" } },
  ATF: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Administration of the French Southern and Antarctic Lands", vi: "Cơ quan quản trị Vùng đất phía Nam và Nam Cực thuộc Pháp" }, legislature: { en: "No permanent elected legislature", vi: "Không có cơ quan lập pháp dân cử thường trú" } },
  GLP: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Regional administration of Guadeloupe", vi: "Chính quyền vùng Guadeloupe" }, legislature: { en: "Regional and departmental councils of Guadeloupe", vi: "Hội đồng vùng và hội đồng tỉnh Guadeloupe" } },
  GUM: { head: { en: "President of the United States", vi: "Tổng thống Hoa Kỳ" }, government: { en: "Governor of Guam", vi: "Thống đốc Guam" }, legislature: { en: "Legislature of Guam", vi: "Cơ quan Lập pháp Guam" } },
  HMD: { head: { en: "Monarch of Australia", vi: "Quốc vương Úc" }, government: { en: "Administered by Australia", vi: "Úc quản lý" }, legislature: { en: "No permanent local legislature", vi: "Không có cơ quan lập pháp địa phương thường trú" } },
  HKG: { head: { en: "President of the People's Republic of China", vi: "Chủ tịch nước Cộng hòa Nhân dân Trung Hoa" }, government: { en: "Chief Executive of Hong Kong", vi: "Đặc khu trưởng Hồng Kông" }, legislature: { en: "Legislative Council of Hong Kong", vi: "Hội đồng Lập pháp Hồng Kông" } },
  MAC: { head: { en: "President of the People's Republic of China", vi: "Chủ tịch nước Cộng hòa Nhân dân Trung Hoa" }, government: { en: "Chief Executive of Macau", vi: "Trưởng Đặc khu Ma Cao" }, legislature: { en: "Legislative Council of Macau", vi: "Hội đồng Lập pháp Ma Cao" } },
  MTQ: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Territorial administration of Martinique", vi: "Chính quyền lãnh thổ Martinique" }, legislature: { en: "Assembly of Martinique", vi: "Hội đồng Martinique" } },
  MYT: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Administration of Mayotte", vi: "Chính quyền Mayotte" }, legislature: { en: "Departmental Council of Mayotte", vi: "Hội đồng tỉnh Mayotte" } },
  NCL: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Government of New Caledonia", vi: "Chính phủ Nouvelle-Calédonie" }, legislature: { en: "Congress of New Caledonia", vi: "Đại hội Nouvelle-Calédonie" } },
  NFK: { head: { en: "Monarch of Australia", vi: "Quốc vương Úc" }, government: { en: "Administration of Norfolk Island", vi: "Chính quyền Norfolk Island" }, legislature: { en: "Norfolk Island Regional Council", vi: "Hội đồng vùng Norfolk Island" } },
  MNP: { head: { en: "President of the United States", vi: "Tổng thống Hoa Kỳ" }, government: { en: "Governor of the Northern Mariana Islands", vi: "Thống đốc Quần đảo Bắc Mariana" }, legislature: { en: "Northern Mariana Islands Commonwealth Legislature", vi: "Cơ quan lập pháp Khối thịnh vượng chung Bắc Mariana" } },
  PCN: { head: { en: "Monarch of the United Kingdom", vi: "Quốc vương Vương quốc Anh" }, government: { en: "Governor of the Pitcairn Islands", vi: "Thống đốc Pitcairn" }, legislature: { en: "Island Council", vi: "Hội đồng Đảo Pitcairn" } },
  PRI: { head: { en: "President of the United States", vi: "Tổng thống Hoa Kỳ" }, government: { en: "Governor of Puerto Rico", vi: "Thống đốc Puerto Rico" }, legislature: { en: "Legislative Assembly of Puerto Rico", vi: "Quốc hội Lập pháp Puerto Rico" } },
  REU: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Regional administration of Réunion", vi: "Chính quyền vùng Réunion" }, legislature: { en: "Regional and departmental councils of Réunion", vi: "Hội đồng vùng và hội đồng tỉnh Réunion" } },
  BLM: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "President of the Territorial Council of Saint-Barthélemy", vi: "Chủ tịch Hội đồng lãnh thổ Saint-Barthélemy" }, legislature: { en: "Territorial Council of Saint-Barthélemy", vi: "Hội đồng lãnh thổ Saint-Barthélemy" } },
  SHN: { head: { en: "Monarch of the United Kingdom", vi: "Quốc vương Vương quốc Anh" }, government: { en: "Governor of Saint Helena, Ascension and Tristan da Cunha", vi: "Thống đốc Saint Helena, Ascension and Tristan da Cunha" }, legislature: { en: "Legislative Council of Saint Helena", vi: "Hội đồng Lập pháp Saint Helena" } },
  MAF: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "President of the Territorial Council of Saint-Martin", vi: "Chủ tịch Hội đồng lãnh thổ Saint-Martin" }, legislature: { en: "Territorial Council of Saint-Martin", vi: "Hội đồng lãnh thổ Saint-Martin" } },
  SPM: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Territorial administration of Saint-Pierre and Miquelon", vi: "Chính quyền lãnh thổ Saint-Pierre và Miquelon" }, legislature: { en: "Territorial Council of Saint-Pierre and Miquelon", vi: "Hội đồng lãnh thổ Saint-Pierre và Miquelon" } },
  SGS: { head: { en: "Monarch of the United Kingdom", vi: "Quốc vương Vương quốc Anh" }, government: { en: "Commissioner of South Georgia and the South Sandwich Islands", vi: "Ủy viên Nam Georgia và Quần đảo Nam Sandwich" }, legislature: { en: "No elected local legislature", vi: "Không có cơ quan lập pháp dân cử địa phương" } },
  SJM: { head: { en: "Monarch of Norway", vi: "Quốc vương Na Uy" }, government: { en: "Governor of Svalbard", vi: "Thống đốc Svalbard" }, legislature: { en: "No full local legislature", vi: "Không có cơ quan lập pháp địa phương đầy đủ" } },
  TKL: { head: { en: "Monarch of New Zealand", vi: "Quốc vương New Zealand" }, government: { en: "Ulu-o-Tokelau and the Council of Faipule", vi: "Ulu-o-Tokelau và Hội đồng Faipule" }, legislature: { en: "General Fono", vi: "General Fono" } },
  UMI: { head: { en: "President of the United States", vi: "Tổng thống Hoa Kỳ" }, government: { en: "Administered by the United States", vi: "Hoa Kỳ quản lý" }, legislature: { en: "No permanent local legislature", vi: "Không có cơ quan lập pháp địa phương thường trú" } },
  VIR: { head: { en: "President of the United States", vi: "Tổng thống Hoa Kỳ" }, government: { en: "Governor of the United States Virgin Islands", vi: "Thống đốc Quần đảo Virgin thuộc Mỹ" }, legislature: { en: "Legislature of the United States Virgin Islands", vi: "Cơ quan lập pháp Quần đảo Virgin thuộc Mỹ" } },
  WLF: { head: { en: "President of France", vi: "Tổng thống Pháp" }, government: { en: "Senior Administrator of Wallis and Futuna", vi: "Quản trị viên cấp cao Wallis và Futuna" }, legislature: { en: "Territorial Assembly of Wallis and Futuna", vi: "Hội đồng lãnh thổ Wallis và Futuna" } },
  ESH: { head: { en: "Political leadership of the relevant governing or claiming entity", vi: "Lãnh đạo chính trị của thực thể quản trị/tuyên bố chủ quyền liên quan" }, government: { en: "Disputed governance status", vi: "Tình trạng quản trị tranh chấp" }, legislature: { en: "Representative institution / disputed sovereignty claim", vi: "Thiết chế đại diện/tuyên bố chủ quyền có tranh chấp" } },
  UNK: { head: { en: "President of Kosovo", vi: "Tổng thống Kosovo" }, government: { en: "Prime Minister of Kosovo", vi: "Thủ tướng Kosovo" }, legislature: { en: "Assembly of Kosovo", vi: "Quốc hội Kosovo" } }
};

void sovereignFinland;

// Per-country manual leader overrides that were authored in Vietnamese.
export const MANUAL_LEADERS: Record<string, { headOfGovernment?: Bi; headOfGovernmentTitle?: Bi }> = {
  SMR: { headOfGovernment: { en: "Captains Regent and the Congress of State of San Marino", vi: "Quốc hội và Quốc vụ viện San Marino" }, headOfGovernmentTitle: { en: "Collective executive body", vi: "Cơ quan hành pháp tập thể" } },
  SYR: { headOfGovernment: { en: "Syrian transitional government", vi: "Chính phủ chuyển tiếp Syria" } },
  VEN: { headOfGovernment: { en: "President of Venezuela", vi: "Tổng thống Venezuela" } },
  FLK: { headOfGovernment: { en: "Government of the Falkland Islands", vi: "Chính quyền Quần đảo Falkland" } },
  BWA: { headOfGovernmentTitle: { en: "President / Head of government", vi: "Tổng thống / Người đứng đầu chính phủ" } }
};

// ---------------------------------------------------------------------------
// Lookup maps + helpers
// ---------------------------------------------------------------------------
const EN_TO_VI = new Map<string, string>();
const VI_TO_EN = new Map<string, string>();
for (const { en, vi } of PHRASES) {
  if (!EN_TO_VI.has(en)) EN_TO_VI.set(en, vi);
  if (!VI_TO_EN.has(vi)) VI_TO_EN.set(vi, en);
}
for (const iso of Object.keys(TERRITORY)) {
  const t = TERRITORY[iso];
  for (const part of [t.head, t.government, t.legislature, t.powerStructure]) {
    if (part) {
      if (!EN_TO_VI.has(part.en)) EN_TO_VI.set(part.en, part.vi);
      if (!VI_TO_EN.has(part.vi)) VI_TO_EN.set(part.vi, part.en);
    }
  }
}

export function phraseToVi(value: string): string | undefined {
  return EN_TO_VI.get(value);
}

export function phraseToEn(value: string): string | undefined {
  return VI_TO_EN.get(value);
}

// Generic legislature names follow simple institution patterns; translate the
// institution token and keep the (English) proper place name.
const LEGIS_TOKENS_EN_VI: [RegExp, string][] = [
  [/\bNational Assembly\b/g, "Quốc hội"],
  [/\bParliamentary Assembly\b/g, "Nghị viện"],
  [/\bFederal Assembly\b/g, "Hội đồng Liên bang"],
  [/\bLegislative Assembly\b/g, "Hội đồng Lập pháp"],
  [/\bLegislative Council\b/g, "Hội đồng Lập pháp"],
  [/\bConsultative Assembly\b/g, "Hội đồng Tham vấn"],
  [/\bSupreme Council\b/g, "Hội đồng Tối cao"],
  [/\bPeople's Council\b/g, "Hội đồng Nhân dân"],
  [/\bPeople's Assembly\b/g, "Hội đồng Nhân dân"],
  [/\bNational Council\b/g, "Hội đồng Quốc gia"],
  [/\bIsland Councils?\b/g, "Hội đồng đảo"],
  [/\bHouse of Assembly\b/g, "Hạ viện"],
  [/\bGrand National Assembly\b/g, "Đại Quốc hội"],
  [/\bNational Congress\b/g, "Quốc hội"],
  [/\bParliament\b/g, "Nghị viện"],
  [/\bCongress\b/g, "Quốc hội"],
  [/\bAssembly\b/g, "Nghị viện"],
  [/\bLegislature\b/g, "Cơ quan lập pháp"]
];

// Translate a canonical English legislature name into Vietnamese.
export function legislatureToVi(value: string): string {
  const exact = EN_TO_VI.get(value);
  if (exact) return exact;
  let out = value;
  for (const [re, vi] of LEGIS_TOKENS_EN_VI) out = out.replace(re, vi);
  out = out.replace(/ of the /g, " ").replace(/ of /g, " ");
  return out;
}

// Notes templated with a place name.
const WIKI_SEAT_EN = "Vietnamese Wikipedia records the related seat of government/head of state: ";
const WIKI_SEAT_VI = "Wikipedia tiếng Việt ghi nhận trụ sở chính quyền/nguyên thủ liên quan: ";

export function noteToVi(value: string): string {
  const exact = EN_TO_VI.get(value);
  if (exact) return exact;
  if (value.startsWith(WIKI_SEAT_EN)) return WIKI_SEAT_VI + value.slice(WIKI_SEAT_EN.length);
  return value;
}

export function noteToEn(value: string): string {
  const exact = VI_TO_EN.get(value);
  if (exact) return exact;
  if (value.startsWith(WIKI_SEAT_VI)) return WIKI_SEAT_EN + value.slice(WIKI_SEAT_VI.length);
  return value;
}

const REGION_VI: Record<string, string> = {
  Africa: "châu Phi",
  Americas: "châu Mỹ",
  Asia: "châu Á",
  Europe: "châu Âu",
  Oceania: "châu Đại Dương",
  Antarctic: "châu Nam Cực",
  Unknown: "khu vực chưa xác định"
};

const SUMMARY_MARKER_EN = "This profile is presented in layered form";
const SUMMARY_MARKER_VI = "Hồ sơ này trình bày theo các lớp";

export type SummarySource = {
  englishName?: string;
  countryName?: string;
  region?: string;
  capital?: string;
  population?: number;
};

// Build the generic country summary in the requested language.
export function buildGenericSummary(c: SummarySource, lang: Lang): string {
  const region = c.region ?? "Unknown";
  if (lang === "en") {
    const name = c.englishName || c.countryName || "This entity";
    const parts = [`${name} is a country or territory in ${region === "Unknown" ? "an unspecified region" : region}.`];
    if (c.capital) parts.push(`The capital is ${c.capital}.`);
    if (typeof c.population === "number") parts.push(`The population is approximately ${c.population.toLocaleString("en-US")}.`);
    parts.push(`${SUMMARY_MARKER_EN}: regime group, state form, government model, power structure, economy, and reference sources for neutral comparison.`);
    return parts.join(" ");
  }
  const name = c.countryName || c.englishName || "Thực thể này";
  const parts = [`${name} là một quốc gia hoặc vùng lãnh thổ thuộc ${REGION_VI[region] ?? "khu vực chưa xác định"}.`];
  if (c.capital) parts.push(`Thủ đô là ${c.capital}.`);
  if (typeof c.population === "number") parts.push(`Dân số khoảng ${c.population.toLocaleString("vi-VN")} người.`);
  parts.push(`${SUMMARY_MARKER_VI}: nhóm chế độ, hình thức nhà nước, mô hình chính phủ, cấu trúc quyền lực, kinh tế và nguồn tham khảo để người đọc so sánh một cách trung lập.`);
  return parts.join(" ");
}

export function isGenericSummary(value: string): boolean {
  return value.includes(SUMMARY_MARKER_EN) || value.includes(SUMMARY_MARKER_VI);
}
