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
        locationText: { fontSize: 14, bold: false, color: "{{highlightTextColor}}" },

        columnText: { fontSize: 12, bold: true, color: "{{highlightTextColor}}" },
        dataText: { fontSize: 12, bold: true, color: "{{defaultTextColor}}" },
        smallText: { fontSize: 11, bold: true, color: "{{defaultTextColor}}" }
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
        sort: { type: "select", label: "Sort", section: "Debug", default: "asc", options: ["asc", "desc"] },
        limit: { type: "number", label: "Limit", section: "Debug", default: 5 },
        minScore: { type: "number", label: "Min Score", section: "Debug", default: 80 },

        myApiKey: { type: "text", label: "API KEY", section: "API", default: "MY_APIKEY" },
        useCacheData: { type: "bool", label: "Use Cache Data", section: "API", default: true },
        refreshMinutes: { type: "number", label: "Refresh Minutes", section: "API", default: 15 },
        forceRefresh: { type: "bool", label: "Force Refresh in App", section: "API", default: false },

        intervalHours: { type: "number", label: "Interval Hours", section: "API", default: 2 },
        displayCount: { type: "number", label: "Display Count", section: "API", default: 4 },

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
              { type: "text", text: "{{header_titleStr}}", style: "#ff9900" },
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
                size: new Size(30, 0),
                children: [
                  { type: "text", text: "時間:", style: "columnText" },
                  { type: "text", text: "気圧:", style: "columnText" },
                  { type: "text", text: "風速:", style: "columnText" },
                  { type: "text", text: "気温:", style: "columnText" },
                  { type: "text", text: "降水:", style: "columnText" }
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
                  size: new Size(55, 0),  // 列幅
                  children: [
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{hour}}", style: "columnText" }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{pressureTrend}} ", style: { base: "smallText", color: "{{pressureColor}}" } },
                        { type: "text", text: "{{pressure}}", style: { base: "dataText", color: "{{pressureColor}}" } }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{windIcon}} ", style: { base: "smallText", color: "{{highlightTextColor}}" } },
                        { type: "text", text: "{{windTrend }} ", style: { base: "smallText", color: "{{windSpeedColor}}" } },
                        { type: "text", text: "{{windSpeed}}", style: { base: "dataText", color: "{{windSpeedColor}}" } }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{tempTrend}} ", style: { base: "smallText", color: "{{tempColor}}" } },
                        { type: "text", text: "{{temp}}", style: { base: "dataText", color: "{{tempColor}}" } }
                      ]
                    },
                    { type: "hstack", children: [
                        { type: "spacer" },
                        { type: "text", text: "{{rainTrend}} ", style: { base: "smallText", color: "{{rainColor}}" } },
                        { type: "text", text: "{{rain}}", style: { base: "dataText", color: "{{rainColor}}" } }
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

    if (v.useTestData) return this.testDataTransform(data, config)

    const items = this.forecastDataTransform(data, config)
    const meta = this.metaDataTransform(data, config)

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...this.flatObj(meta)
    }
  },

  // meta 情報を整理
  metaDataTransform(data, config) {

    const v = config?.values || {}

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

    // current
    const current = this.currentDataTransform(data, config)

    // メタ情報
    const meta = {
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

    return meta
  },

  // current 情報を整理
  currentDataTransform(data, config) {

    const v = config?.values || {}

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

    return current
  },

  // forecast 情報を整理
  forecastDataTransform(data, config) {

    const v = config?.values || {}
    const defaultTextColor = v.defaultTextColor
    console.log(JSON.stringify(config, null, 2))

    const intervalHours = v.intervalHours || 2      // 取得したい時間間隔（2時間ごと）
    const displayCount = v.displayCount || 4        // 表示件数（large widget）
    const nowEpoch = Math.floor(Date.now() / 1000) + (3600 * (intervalHours -1))

    const forecastData = data.forecast.forecastday  // forecastday 配列

    // hour 配列から現在時間以降のデータを flatten して抽出
    const hours = forecastData.flatMap(day => day.hour)
      .filter(h => h.time_epoch >= nowEpoch)          // 現在時間以降
      .filter((h, i) => i % intervalHours === 0)      // 2時間毎に間引き
      .slice(0, displayCount)                         // 表示件数に制限

    // レンダラー用 JSON に transform
    const items = hours.map((h, idx) => {
      const prev = idx > 0 ? hours[idx - 1] : h

      const tempTrend = this.trendIcon(h.temp_c, prev.temp_c)
      const pressureTrend = this.trendIcon(h.pressure_mb, prev.pressure_mb)
      const windTrend = this.trendIcon(h.wind_kph, prev.wind_kph)
      const rainTrend = this.trendIcon(h.chance_of_rain, prev.chance_of_rain)

      return {
        hour: Number(h.time.split(" ")[1].slice(0, 2)) + "時",
        pressure: Math.round(h.pressure_mb),
        pressureColor: this.getPressureColor(h.pressure_mb, prev.pressure_mb, defaultTextColor),
        pressureTrend: pressureTrend,
        windIcon: this.convertWindDegToIcon(h.wind_degree),
        windSpeed: Math.round(h.wind_kph / 3.6),
        windSpeedColor: this.getWindColor(Math.round(h.wind_kph / 3.6), defaultTextColor),
        windTrend: windTrend,
        temp: Math.round(h.temp_c),
        tempColor: this.getTempColor(Math.round(h.temp_c), defaultTextColor),
        tempTrend: tempTrend,
        rain: Math.ceil(h.chance_of_rain / 5) * 5,
        rainColor: this.getRainColor(h.chance_of_rain, defaultTextColor),
        rainTrend: rainTrend
      }
    })

    return items
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

  // 例：風向きをアイコンに変換する関数
  convertWindDegToIcon(deg) {
    if (deg >= 337.5 || deg < 22.5) return "↑"
    if (deg >= 22.5 && deg < 67.5) return "↗"
    if (deg >= 67.5 && deg < 112.5) return "→"
    if (deg >= 112.5 && deg < 157.5) return "↘"
    if (deg >= 157.5 && deg < 202.5) return "↓"
    if (deg >= 202.5 && deg < 247.5) return "↙"
    if (deg >= 247.5 && deg < 292.5) return "←"
    if (deg >= 292.5 && deg < 337.5) return "↖"
    return "↑"
  },

  trendIcon(curr, prev) {
    if (curr > prev) return "↑"
    if (curr < prev) return "↓"
    return "→"
  },

  getRainColor(curr, color) {
    if (curr == 100) return "#ff453a"
    if (curr >= 80) return "#ff453a"
    if (curr >= 60) return "#ff6666"
    if (curr >= 40) return "#ffff66"
    return color
  },

  getPressureColor(curr, prev, color) {
    if (prev < 1000) return "#ff6666"
    if (Math.abs(curr - prev) >= 5) return "#ff6666"
    if (Math.abs(curr - prev) >= 3) return "#ffff66"
    return color
  },

  getWindColor(curr, color) {
    if (curr == 20) return "#ff453a"
    if (curr >= 15) return "#ff6666"
    if (curr >= 10) return "#ffbd55"
    if (curr >= 5) return "#ffff66"
    return color
  },

  getTempColor(curr, color) {
    if (curr >= 35) return "#ff453a"
    if (curr >= 30) return "#ff6666"
    if (curr >= 25) return "#ffff66"
    if (curr <= 0) return "#87cefa"
    return color
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