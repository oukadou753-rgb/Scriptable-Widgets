// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_Config
 **/
module.exports = {

  // Default Config
  getDefaultConfig() {

    return {

      version: "1.0.0",

      styles: {
        defaultText: { fontSize: 13, bold: false, color: "{{defaultTextColor}}" },
        HighlightText: { fontSize: 13, bold: false, color: "{{highlightTextColor}}" },
        headerText: { fontSize: 13, bold: true, color: "{{headerTextColor}}" },
        bodyText: { fontSize: 13, bold: false, color: "{{bodyTextColor}}" },
        footerText: { fontSize: 9, bold: false, color: "{{footerTextColor}}" },

        titleText: { fontSize: 16, bold: true, color: "{{highlightTextColor}}" },
        versionText: { fontSize: 9, bold: false, color: "{{defaultTextColor}}" },
        updateText: { fontSize: 9, bold: false, color: "{{highlightTextColor}}" },
        locationText: { fontSize: 14, bold: false, color: "{{highlightTextColor}}" }
      },

      defaultOpenSections: ["General", "Style"],

      schema: {
        titleStr: { type: "text", label: "Title", section: "General", default: "My Widget" },

        useBgGradient: { type: "bool", label: "Use Gradient Color", section: "BackgroundColor", default: true },
        bgColorTop: { type: "color", label: "Gradient Background Top Color", section: "BackgroundColor", default: "#000000", presets: ["#000000", "#ff9900"] },
        bgColorBottom: { type: "color", label: "Gradient Background Bottom Color", section: "BackgroundColor", default: "#003366", presets: ["#000000", "#ff9900"] },
        bgColor: { type: "color", label: "Background Color", section: "BackgroundColor", default: "#003366", presets: ["#000000", "#ff9900"] },

        defaultTextColor: { type: "color", label: "Default Text Color", section: "Style", default: "#d1cdda" },
        highlightTextColor: { type: "color", label: "Highlight Text Color", section: "Style", default: "#87cefa" },
        headerTextColor: { type: "color", label: "Header Text Color", section: "Style", default: "#ffffff" },
        bodyTextColor: { type: "color", label: "Body Text Color", section: "Style", default: "#ffffff" },
        footerTextColor: { type: "color", label: "Footer Text Color", section: "Style", default: "#ffffff" },

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

  // API
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

  // Location
  location: {
    get useCurrent() {
      return this.config?.values?.useCurrentLocation ?? true
    },

    get default() {
      return {
        lat: this.config?.values?.lat ?? 35.6812,
        lon: this.config?.values?.lon ?? 139.7671,
        name: "東京都",
        full: "東京都 千代田区 千代田"
      }
    },

    cacheMinutes: 60
  },

  // Layout
  getLayout(layoutId = "default") {

    const layouts = {

      // Default Layout
      default: {
        header: [
          {
            type: "hstack",
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            align: "center",
            children: [
              { type: "image", src: "{{header_titleIcon_src}}", tint: "{{header_titleIcon_tint}}", size: 24 },
              { type: "spacer", size: 5 },
              { type: "text", text: "{{header_titleStr}}", style: "titleText" },
              { type: "spacer" },
              { type: "image", src: "{{status_icon}}", tint: "{{status_color}}", opacity: "{{status_opacity}}", size: 16 }
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
              size: { width: 300, height: 40 },
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
            justify: "start",
            children: [
              { type: "text", text: "{{location_name}}", style: "locationText" },
            ]
          },
          {
            type: "hstack",
            justify: "end",
            children: [
              { type: "text", text: "Update: ", style: "updateText" },
              { type: "text", text: "{{footer_updateStr}}", style: "footerText" }
            ]
          }
        ],

        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      // Test Layout
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

  // Data変換
  transform(data, config) {

    const v = config?.values || {}
//     console.log(JSON.stringify(v, null, 2))
    console.log(JSON.stringify(data.current, null, 2))

    const minScore = Number(v.minScore) || 0
    const limit = Number(v.limit) || 0

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

    // Online判定
    const online = v.isOnline ?? false
    const dayTime = true
    const status = {
      icon: "location.fill",
      color: "#ffffff", //'#d1cdda',
      opacity: online ? 0.6 : 0.3
    }

    // 更新時間生成
    const updateStr = this.formatTime(
      data.current?.last_updated_epoch ??
      data.last_updated_epoch,
      "HH時mm分"
    )

    // location
    const location = config?.location || null
    const current = data.current || null
    const icon = current ? current.condition.text.icon : ""
    const url = this.makeWeatherApiIcon(current.condition.icon)

    // メタ情報
    const meta = {
      count: items.length,
      header: {
        titleStr: current ? current.condition.text : v.titleStr,
        titleIcon: {
          src: url,
          tint: "#ffffff"
        }
      },
      body: {
        
      },
      footer: {
        updateStr
      },
      status,
      location: {
        lat: location?.lat ?? null,
        lon: location?.lon ?? null,
        latStr: location?.lat != null ? location.lat.toFixed(4) : "",
        lonStr: location?.lon != null ? location.lon.toFixed(4) : "",
        name: location?.full != null ? location.full.split(" ").slice(1).join("") : ""
      }
    }

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...this.flatObj(meta)
    }
  },

  // Object 平坦化
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
  },

  // Epoch Date Formatter
  formatTime(epoch, format = "HH:mm") {

    if (!epoch) return "--:--"

    const ts = new Date(
      epoch > 1e12 ? epoch : epoch * 1000
    )

    const df = new DateFormatter()
    df.dateFormat = format

    return df.string(ts)
  },

  parseURL(t){let e={href:t},a=["protocol host hostname port pathname query hash".split(" "),"directory filename query".split(" "),"basename extension".split(" ")];return[/^(?:(https?:)?(?:\/\/(([^\/:]+)(?::([0-9]+))?)))?(\/?[^?#]*)(\??[^?#]*)(#?.*)/,/^(?:[^:\/?#]+:)?(?:\/\/[^\/?#]*)?(?:([^?#]*\/)([^\/?#]*))?(\?[^#]*)?(?:#.*)?$/,/^([^/]*)\.([^.]+)?$/].map((r,i)=>{let n=String(2==i?e.filename:t).match(r);n&&a[i].forEach(function(t,a){e[t]=void 0===n[a+1]?null:n[a+1]})}),e},
  makeWeatherApiIcon(url) {
    let {  protocol, host, pathname, filename } = this.parseURL(url)
    url = (protocol || 'https') + '://' + host + pathname
    if (url.includes('day')) filename = filename.replace('.', 'd.')
    else if (url.includes('night')) filename = filename.replace('.', 'n.')
    return url
  },

  // Test Data
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
        name: "東京都",
        full: "東京都 千代田区 千代田"
      }
    }
  },

  // ランキング
  getRank(score) {

    if (score >= 90) return "S"
    if (score >= 75) return "A"
    if (score >= 60) return "B"
    return "C"
  }
}