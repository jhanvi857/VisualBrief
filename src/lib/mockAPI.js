// Mock API layer for development
const mockSummaries = [
  {
    id: "1",
    fileName: "Annual Report 2024.pdf",
    date: new Date("2024-11-15"),
    summaryLength: "2 min read",
    style: "bullet-points",
    summary: {
      title: "Annual Report 2024",
      bullets: [
        "Revenue increased by 35% YoY to $2.5B",
        "Expanded operations to 12 new markets",
        "Launched AI-powered analytics platform",
        "Team grew from 500 to 750 employees",
      ],
      keyQuotes: ['"Innovation is our competitive advantage" - CEO', '"We are committed to sustainable growth" - CTO'],
    },
  },
  {
    id: "2",
    fileName: "Market Research Q4.pdf",
    date: new Date("2024-11-10"),
    summaryLength: "3 min read",
    style: "infographic",
    summary: {
      title: "Q4 Market Insights",
      bullets: [
        "Market size: $5.2B (up 22% from Q3)",
        "Customer acquisition cost down 15%",
        "Churn rate improved to 2.1%",
        "Net retention at 125%",
      ],
      keyQuotes: [],
    },
  },
]

export const mockApiLayer = {
  async uploadPdf(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileId: Math.random().toString(36).substr(2, 9),
          fileName: file.name,
        })
      }, 2000)
    })
  },

  async getSummaries() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSummaries), 500)
    })
  },

  async getSummary(id) {
    return new Promise((resolve) => {
      const summary = mockSummaries.find((s) => s.id === id)
      setTimeout(() => resolve(summary), 300)
    })
  },

  async generateSummary(fileId, style) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          summary: {
            title: "Generated Summary",
            bullets: ["Key finding 1", "Key finding 2", "Key finding 3"],
            keyQuotes: ["Important quote from document"],
          },
        })
      }, 3000)
    })
  },
}
