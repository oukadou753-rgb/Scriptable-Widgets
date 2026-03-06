// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
module.exports = {

  getDefaultConfig() {
    return {

      version: "1.0.1",

      styles: {
        defaultText: { fontSize: 14, color: "{{bodyTextColor}}" },
        title: { fontSize: 16, bold: true, color: "{{titleColor}}" },
        version: { fontSize: 12, color: "{{bodyTextColor}}" },
        bodyText: { fontSize: 14, color: "{{bodyTextColor}}" },
        footerText: { fontSize: 12, color: "{{footerTextColor}}" },
        updateText: { fontSize: 12, color: "{{updateTextColor}}" }
      },

      defaultOpenSections: ["General"],

      schema: {
        titleStr: { type: "text", label: "Title", section: "General", default: "My Widget" },

        bgColor: { type: "color", label: "Background Color", section: "Style", default: "#222222", presets: ["#000000", "#ff9900"] },
        titleColor: { type: "color", label: "Title Color", section: "Style", default: "#ffffff" },
        bodyTextColor: { type: "color", label: "Body Text Color", section: "Style", default: "#ffffff" },
        footerTextColor: { type: "color", label: "Footer Text Color", section: "Style", default: "#ffffff" },
        updateTextColor: { type: "color", label: "Update Text Color", section: "Style", default: "#ffffff" },

        useTestData: { type: "bool", label: "Use Test Data", section: "Debug", default: true },
        showTableFullscreen: { type: "bool", label: "Show Table Fullscreen", section: "Debug", default: true },

        myApiKey: { type: "text", label: "API KEY", section: "API", default: "MY_APIKEY" },
        useCacheData: { type: "bool", label: "Use Cache Data", section: "API", default: true },
        refreshMinutes: { type: "number", label: "Refresh Minutes", section: "API", default: 15 },
        forceRefresh: { type: "bool", label: "Force Refresh in App", section: "API", default: false },
        sort: { type: "select", label: "Sort", section: "API", default: "asc", options: ["asc", "desc"] },
        limit: { type: "number", label: "Limit", section: "API", default: 5 },
        minScore: { type: "number", label: "Min Score", section: "API", default: 80 },

        useCurrentLocation: { type: "bool", label: "現在地を使用", section: "Location", default: true },
        lat: { type: "number", label: "緯度（固定地点）", section: "Location", default: 35.6812, show: "{{!useCurrentLocation}}" },
        lon: { type: "number", label: "経度（固定地点）", section: "Location", default: 139.7671, show: "{{!useCurrentLocation}}" },
        name: { type: "text", label: "地名（固定地点）", section: "Location", default: "東京駅", show: "{{!name}}" },

        layoutId: {
          type: "select",
          label: "Layout",
          section: "Layout",
          default: "default",
          options: ["default", "test"],
          readonly: false,
          hidden: false
        }
      },

      values: {}
    }
  },

  api: {
    baseURL: "https://api.weatherapi.com/v1",
    endpoint: "forecast.json",
    useLocation: true,

    cache: {
      key: "forecast",
      minutes: "{{refreshMinutes}}",
      useCache: "{{useCacheData}}",
      forceRefreshInApp: "{{forceRefresh}}"
    },

    params: {
      key: "{{myApiKey}}",
      days: "2",
      alerts: "no",
      lang: "ja"
    },
  
    dynamicParams: {
      q: (ctx) => {
        if (!ctx.location) return null
        return `${ctx.location.lat},${ctx.location.lon}`
      }
    }
  },

  location: {
    get useCurrent() {
      return this.config?.values?.useCurrentLocation ?? true
    },

    get default() {
      return {
        lat: this.config?.values?.lat ?? 35.6812,
        lon: this.config?.values?.lon ?? 139.7671,
        name: "東京都"
      }
    },

    cacheMinutes: 60
  },

  getLayout(layoutId = "default") {

    const layouts = {

      default: {
        header: [
          {
            type: "hstack",
            justify: "space-between",
            children: [
              { type: "text", text: "{{titleStr}}", style: "title" },
              { type: "text", text: "v{{version.fw}}", style: "version" }
            ]
          }
        ],

        body: [
          {
            type: "repeat",
            items: "{{items}}",
            sortBy: "value",
            order: "{{sort}}",
            limit: "{{limit}}",
            empty: { type: "text", text: "No Data", style: "bodyText" },
            template: {
              type: "hstack",
              justify: "space-between",
              children: [
                { type: "text", text: "{{index}}. {{title}}", style: "bodyText" },
                { type: "text", text: "{{value}} ({{sub}})", style: "bodyText" },
                { type: "text", text: "🔥", style: "bodyText", show: "{{flag}}" }
              ]
            }
          }
        ],

        footer: [
          {
            type: "hstack",
            justify: "space-between",
            children: [
              { type: "text", text: "{{location_latStr}}, {{location_lonStr}} {{name}}", style: "footerText" },
              { type: "text", text: "Update: {{updateStr}}", style: "updateText" }
            ]
          }
        ],

        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      test: {
        header: [
          {
            type: "hstack",
            justify: "space-between",
            children: [
              { type: "text", text: "{{titleStr}}", style: "title" },
              { type: "text", text: "v{{version.fw}}", style: "version" }
            ]
          }
        ],

       body: [
          {
            type: "repeat",
            items: "{{items}}",
//             filter: "{{value >= minScore}}",
            sortBy: "value",
            order: "{{sort}}",
            limit: "{{limit}}",
            empty: { type: "text", text: "No Data", style: "bodyText" },
            template: {
              type: "hstack",
              justify: "space-between",
              children: [
                { type: "text", text: "{{index}}. {{title}}", style: "bodyText" },
                { type: "text", text: "{{value}} ({{sub}})", style: "bodyText" },
                { type: "text", text: "🔥", style: "bodyText", show: "{{flag}}" }
              ]
            }
          }
        ],

        footer: [
          {
            type: "hstack",
            justify: "end",
            children: [
              { type: "text", text: "Update: {{updateStr}}", style: "updateText" }
            ]
          }
        ],

        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      }
    }

    return layouts[layoutId] || layouts.default
  },

  getTestData() {

    return {
      data: {
        news: [
          { title: "Apple releases new iOS", score: 98 },
          { title: "Scriptable Widget Update", score: 87 },
          { title: "Weather is sunny today", score: 76 },
          { title: "Breaking News Sample", score: 65 },
          { title: "Another Headline", score: 55 }
        ],
        last_updated_epoch: Math.floor(Date.now() / 1000),
      },
      location: {
        lat: 35.6812,
        lon: 139.7671,
        name: "東京都"
      }
    }
  },

  transform(data, config) {

    const v = config?.values || {}
    const location = config?.location || null

    const minScore = Number(v.minScore) || 0
    const limit = Number(v.limit) || 0

    // 更新時間生成
    const updateStr = this.formatTime(
      data.current?.last_updated_epoch ??
      data.last_updated_epoch,
      "yyyy/MM/dd HH:mm"
    )

    // 元データ正規化
    const rawList = Array.isArray(data?.news)
      ? data.news
      : []

    // データ整形（ここが本体）
    let items = rawList.map((item, i) => {

      const score = Number(item?.score) || 0

      return {
        // 共通キー
        title: item?.title || "No Title",
        value: score,
        sub: this.getRank(score),
        flag: score >= minScore,

        // 追加情報
        index: i + 1,
        raw: item
      }
    })

    // メタ情報
    const meta = {
      count: items.length,
      updateStr,
      location: {
        lat: location?.lat ?? null,
        lon: location?.lon ?? null,
        latStr: location?.lat != null ? location.lat.toFixed(4) : "",
        lonStr: location?.lon != null ? location.lon.toFixed(4) : ""
      }
    }

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...this.flatObj(meta)
    }
  },

  formatTime(epoch, format = "HH:mm") {

    if (!epoch) return "--:--"

    const ts = new Date(
      epoch > 1e12 ? epoch : epoch * 1000
    )

    const df = new DateFormatter()
    df.dateFormat = format

    return df.string(ts)
  },

  getRank(score) {

    if (score >= 90) return "S"
    if (score >= 75) return "A"
    if (score >= 60) return "B"
    return "C"
  },

  flatObj(obj, prefix = '') {

    const result = {}

    for (const key in obj) {
      const value = obj[key]

      const newKey = prefix ? `${prefix}${key}` : key

      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date)
      ) {
        Object.assign(result, this.flatObj(value, newKey + "_"))
      } else {
        result[newKey] = value
      }
    }

    return result
  }
}
