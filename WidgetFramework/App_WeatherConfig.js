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

        titleText: { fontSize: 14, bold: true, color: "{{highlightTextColor}}" },
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
              { type: "spacer", size: 2 },
              { type: "text", text: "{{header_titleStr}}", style: "titleText" },
              { type: "spacer" },
              { type: "image", src: "{{status_icon}}", tint: "{{status_color}}", opacity: "{{status_opacity}}", size: 16 }
            ]
          }
        ],

        body: [
          {
            type: "hstack",
            justify: "space-between",
            children: [
              {
                type: "vstack",
                size: new Size(80, 0),
                children: [
                  { type: "text", text: "時間:" },
                  { type: "text", text: "気圧:" },
                  { type: "text", text: "風速:" },
                  { type: "text", text: "気温:" },
                  { type: "text", text: "降水:" }
                ]
              },
              {
                type: "repeat",
                items: "{{items}}",
                direction: "horizontal",  // 横並び
                spacing: 6,
                align: "center",          // 左右中央揃え
                template: {
                  type: "vstack",
                  size: new Size(40, 0), // 列幅
                  children: [
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{pressure}}" }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{hour}}" }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{windSpeed}}" }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{temp}}" }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{rain}}" }
                      ]
                    }
                  ]
                }
              }
            ]
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
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            align: "center",
            justify: "space-between",
            children: [
              { type: "text", text: "{{header_titleStr}}", style: "title" },
              { type: "image", src: "{{status_icon}}", tint: "{{status_color}}", opacity: "{{status_opacity}}", size: 16 }
            ]
          }
        ],

       body: [
          {
            type: "repeat",
            items: "{{items}}",
            direction: "vertical",
            spacing: 8,
            align: "start",

//             filter: "{{value >= minScore}}",
            sortBy: "value",
            order: "{{sort}}",
            limit: "{{limit}}",
            empty: { type: "text", text: "No Data", style: "bodyText" },
            template: {
              type: "hstack",
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
              { type: "text", text: "Update: ", style: "updateText" },
              { type: "text", text: "{{footer_updateStr}}", style: "footerText" }
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
    console.log(JSON.stringify(v, null, 2))
//     console.log(JSON.stringify(data, null, 2))

    if (v.useTestData) return this.testDataTransform(data, config)

// const items = [
//   {
//     pressure: [1000,1002,1001,1000],
//     windIcon: ["↑","↗","→","↘"],
//     windSpeed: [3,4,2,5],
//     temp: [9,8,7,6],
//     rain: [0,10,20,30]
//   }
// ]
const items = [
  { hour: 2, pressure: 1000, windIcon: "↑", windSpeed: 3, temp: 9, rain: 0 },
  { hour: 4, pressure: 1001, windIcon: "↑", windSpeed: 4, temp: 8, rain: 10 },
  { hour: 6, pressure: 1002, windIcon: "↑", windSpeed: 2, temp: 7, rain: 20 },
  { hour: 8, pressure: 1003, windIcon: "↑", windSpeed: 5, temp: 6, rain: 30 },
]

    // current 情報を整理
    const current = {
      updated: data.current.last_updated,
      isDay: data.current.is_day,

      tempC: data.current.temp_c,
      feelslikeC: data.current.feelslike_c,

      condition: data.current.condition.text,
      icon: this.makeWeatherApiIcon(data.current.condition.icon),

      humidity: data.current.humidity,
      cloud: data.current.cloud,

      windKph: data.current.wind_kph,
      windDir: data.current.wind_dir,
      windDegree: data.current.wind_degree,
      gustKph: data.current.gust_kph,

      pressureMb: data.current.pressure_mb,
      visibilityKm: data.current.vis_km,

      precipMm: data.current.precip_mm,
      uv: data.current.uv
    }
//     console.log(JSON.stringify(current, null, 2))

    // Online判定
    const online = v.isOnline ?? false
    const dayTime = true
    const status = {
      icon: "location.fill",
      color: "#d1cdda",
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

    // メタ情報
    const meta = {
      count: items.length,
      header: {
        titleStr: current.condition,
        titleIcon: {
          src: current.icon,
          tint: "#ffffff"
        }
      },
      body: {
        
      },
      footer: {
        updateStr
      },
      current,
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

  // Test Data Transform
  testDataTransform(data, config) {

    const v = config?.values || {}

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
    const status = {
      icon: "location.fill",
      color: "#d1cdda",
      opacity: online ? 0.6 : 0.3
    }

    // 更新時間生成
    const updateStr = this.formatTime(data.last_updated_epoch, "yyyy/MM/dd HH:mm")

    // メタ情報
    const meta = {
      count: items.length,
      header: {
        titleStr: v.titleStr
      },
      body: {
        
      },
      footer: {
        updateStr
      },
        status
    }

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...this.flatObj(meta)
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