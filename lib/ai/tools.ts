import { z } from "zod";
import {
  compareCountries,
  findCountry,
  getSourcesForField,
  searchCountries as searchCountryProfiles
} from "@/lib/countries";
import { fetchRestCountriesData as fetchRestCountriesBaseData } from "@/lib/data-sync/restcountries";
import { queryWikidata } from "@/lib/data-sync/wikidata";
import { getGlobalStats } from "@/lib/stats";
import type { CountryPoliticalProfile } from "@/lib/types";

function isSafeSelectSparql(sparql: string) {
  const lowered = sparql.trim().toLowerCase();
  const blocked = ["insert", "delete", "load", "clear", "create", "drop", "move", "copy", "add"];
  return lowered.startsWith("select") && sparql.length <= 2500 && !blocked.some((word) => lowered.includes(word));
}

export const atlasTools = {
  getCountryProfile: {
    description: "Tìm một hồ sơ quốc gia trong dataset nội bộ bằng tên quốc gia, ISO2 hoặc ISO3.",
    inputSchema: z.object({
      query: z.string().describe("Tên quốc gia, ISO2 hoặc ISO3.")
    }),
    execute: async ({ query }: { query: string }) => {
      const country = query ? findCountry(query) : null;
      return {
        country,
        matchedBy: country ? "internal-dataset" : undefined
      };
    }
  },

  searchCountries: {
    description: "Tìm kiếm và lọc quốc gia trong dataset nội bộ.",
    inputSchema: z.object({
      keyword: z.string().optional().describe("Từ khóa theo tên quốc gia hoặc mã ISO."),
      region: z.string().optional().describe("Bộ lọc khu vực."),
      regimeCategory: z.string().optional().describe("Bộ lọc nhóm chế độ."),
      officialIdeology: z.string().optional().describe("Bộ lọc hệ tư tưởng chính thức."),
      governmentSystem: z.string().optional().describe("Bộ lọc mô hình chính phủ."),
      stateForm: z.string().optional().describe("Bộ lọc hình thức nhà nước."),
      hasCommunistRulingParty: z.boolean().optional().describe("Có đánh dấu đảng cộng sản cầm quyền hay không."),
      hasMilitaryGovernment: z.boolean().optional().describe("Có đánh dấu chính quyền quân sự hay không."),
      isMonarchy: z.boolean().optional().describe("Có phải quân chủ hay không."),
      isRepublic: z.boolean().optional().describe("Có phải cộng hòa hay không."),
      isFederal: z.boolean().optional().describe("Có phải liên bang hay không."),
      isUnitary: z.boolean().optional().describe("Có phải đơn nhất hay không.")
    }),
    execute: async (args: any) => {
      const results = searchCountryProfiles({ ...args, limit: 20 });
      return {
        results: results.data,
        total: results.total
      };
    }
  },

  compareCountries: {
    description: "So sánh hai đến bốn quốc gia theo các trường hồ sơ chính trị được chọn.",
    inputSchema: z.object({
      countries: z.array(z.string()).describe("Tên quốc gia hoặc mã ISO."),
      fields: z.array(z.string()).optional().describe("Các trường hồ sơ tùy chọn cần đưa vào.")
    }),
    execute: async ({ countries, fields }: { countries: string[]; fields?: string[] }) => {
      return compareCountries(countries, fields);
    }
  },

  getGlobalStats: {
    description: "Tính thống kê dashboard toàn cầu từ dataset nội bộ.",
    inputSchema: z.object({
      groupBy: z.enum(["region", "regimeCategory", "officialIdeology", "governmentSystem", "stateForm"]).describe("Trường dùng để nhóm dữ liệu.")
    }),
    execute: async ({ groupBy }: { groupBy: keyof CountryPoliticalProfile }) => {
      return getGlobalStats(groupBy as keyof CountryPoliticalProfile);
    }
  },

  getSourcesForField: {
    description: "Trả về nguồn, giá trị, ngày cập nhật và mức tin cậy cho một trường quốc gia cụ thể.",
    inputSchema: z.object({
      country: z.string().describe("Tên quốc gia, ISO2 hoặc ISO3."),
      field: z.string().describe("Tên trường trong hồ sơ quốc gia.")
    }),
    execute: async ({ country, field }: { country: string; field: string }) => {
      const result = getSourcesForField(country, field);
      return result ?? { error: "Không tìm thấy quốc gia" };
    }
  },

  fetchRestCountriesData: {
    description: "Lấy metadata nền từ REST Countries cho cờ, tên, mã ISO, thủ đô, khu vực và dân số.",
    inputSchema: z.object({
      country: z.string().optional().describe("Tên quốc gia hoặc mã ISO tùy chọn để lọc kết quả REST Countries."),
      all: z.boolean().optional().describe("Lấy tất cả quốc gia khi là true.")
    }),
    execute: async ({ country, all }: { country?: string; all?: boolean }) => {
      if (!all && !country) {
        return { error: "Hãy đặt all=true hoặc cung cấp bộ lọc quốc gia." };
      }
      const data = await fetchRestCountriesBaseData();
      const filtered = country
        ? data.filter((entry) =>
            `${entry.name.common} ${entry.name.official} ${entry.cca2} ${entry.cca3}`
              .toLowerCase()
              .includes(country.toLowerCase())
          )
        : data;
      return {
        data: filtered.slice(0, all ? 260 : 10),
        retrievedAt: new Date().toISOString()
      };
    }
  },

  queryWikidata: {
    description: "Chạy truy vấn Wikidata SPARQL SELECT chỉ đọc, có giới hạn, cho dữ liệu chính trị có cấu trúc.",
    inputSchema: z.object({
      sparql: z.string().describe("Truy vấn SPARQL SELECT chỉ đọc."),
      description: z.string().describe("Lý do cần truy vấn này.")
    }),
    execute: async ({ sparql }: { sparql: string; description: string }) => {
      if (!isSafeSelectSparql(sparql)) {
        return { error: "Chỉ cho phép truy vấn SPARQL SELECT ngắn và chỉ đọc." };
      }
      const data = await queryWikidata(sparql);
      return {
        results: data.results.bindings.slice(0, 50),
        retrievedAt: new Date().toISOString()
      };
    }
  },

  webResearchPoliticalData: {
    description: "Ghi nhận yêu cầu nghiên cứu ngoài khi dữ liệu nội bộ chưa đủ. Tool này chỉ trả hướng dẫn nếu chưa có tích hợp nguồn đáng tin cậy.",
    inputSchema: z.object({
      query: z.string().describe("Câu hỏi nghiên cứu."),
      country: z.string().optional().describe("Ngữ cảnh quốc gia tùy chọn."),
      fieldsNeeded: z.array(z.string()).optional().describe("Các trường cần xác minh ngoài.")
    }),
    execute: async ({ query, country, fieldsNeeded }: { query: string; country?: string; fieldsNeeded?: string[] }) => {
      return {
        findings: [],
        warnings: [
          "Nghiên cứu web bên ngoài chưa được bật trong route server này.",
          "Hãy dùng nguồn đáng tin cậy như Wikidata, CIA World Factbook, OWID, V-Dem, World Bank, UN Data, IMF hoặc trang chính thức của chính phủ/cơ quan lập pháp."
        ],
        request: { query, country, fieldsNeeded }
      };
    }
  }
};
