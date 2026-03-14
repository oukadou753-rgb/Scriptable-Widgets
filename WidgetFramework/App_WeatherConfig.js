// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_Config
 **/
// ======================
// Constat
// ======================
const APP_VERSION = "2.0.0"
const DEFAULT_STRAGE_TYPE = "local" // "icloud", "local", "bookmark"

// ======================
// Header Block
// ======================
const headerBlock = [
  {
    type: "hstack",
    size: new Size(0, 16),
    align: "center",
    children: [
      { type: "image", src: "{{header_titleIcon_src}}", tint: "{{header_titleIcon_tint}}", size: 24 },
      { type: "spacer", size: 3 },
      { type: "text", text: "{{header_titleStr}}", style: "titleText" },
      { type: "spacer" },
      { type: "image", src: "{{status_icon}}", tint: "{{status_color}}", opacity: "{{status_opacity}}", size: 14 }
    ]
  }
]

// ======================
// Footer Block
// ======================
// Location Name
const locationBlock = [
  {
    type: "hstack",
    size: new Size(0, 16),
    justify: "start",
    children: [
      { type: "text", text: "{{location_name}}", style: "locationText" },
    ]
  }
]

// Update + Location.lat/lon
const updateBlock = [
  {
    type: "hstack",
    size: new Size(0, 12),
//     justify: "start",
    children: [
      { type: "text", text: DEFAULT_STRAGE_TYPE + " mode", style: "footerText" },
//       { type: "text", text: "{{location_latStr}} : {{location_lonStr}}", style: "footerText" },
      { type: "spacer" },
      { type: "text", text: "Update: ", style: "updateText" },
      { type: "text", text: "{{footer_updateStr}}", style: "footerText" }
    ]
  }
]

// ======================
// Body Block
// ======================
// currentDataBlockSmall
const currentDataBlockSmall = [
  {
    type: "vstack",
    size: new Size(0, 0),
    padding: pos(5, 0, 0, 0),
//     align: "center",
    children: [
      {
        type: "hstack",
        children: [
          { type: "spacer" },
          { type: "text", text: "{{current_pressureMb}}", style: { base: "defaultText", font:"monospace", fontSize: 45, bold: true, lineLimit: 1, minimumScaleFactor: 0.8 } },
          { type: "spacer" }
        ]
      },
      { type: "spacer" },
      {
        type: "hstack",
        size: new Size(0, 15),
        align: "center",
        children: [
          { type: "spacer" },
          { type: "text", text: "{{current_temp}}", style: { base: "normalText", fontSize: 20, color: "#ff453a", lineLimit: 1, minimumScaleFactor: 0.8 } },
          { type: "text", text: "°C", style: { base: "normalText", color: "#ff453a" } },
          { type: "spacer", size: 13 },
          { type: "text", text: "{{current_humidity}}", style: { base: "normalText", fontSize: 20, color: "#487de7", lineLimit: 1, minimumScaleFactor: 0.8 } },
          { type: "text", text: "％", style: { base: "normalText", color: "#487de7" } },
          { type: "spacer" }
        ]
      }
    ]
  }
]

// CurrentData Details Block 1
const currentDataBlock1 = [
  {
    type: "vstack",
    size: new Size(150, 0),
    padding: pos(5, 0, 0, 0),
//     align: "center",
    children: [
      {
        type: "hstack",
        children: [
          { type: "spacer" },
          { type: "text", text: "{{current_pressureMb}}", style: { base: "defaultText", font:"monospace", fontSize: 60, bold: true, lineLimit: 1, minimumScaleFactor: 0.8 } },
          { type: "spacer" }
        ]
      },
    ]
  }
]

// CurrentData Details Block 2
const currentDataBlock2 = [
  {
    type: "vstack",
    size: new Size(120, 0),
    padding: pos(0, 0, 0, 0),
    children: [
      {
        type: "hstack",
        size: new Size(0, 25),
        children: [
          { type: "spacer" },
          { type: "text", text: "{{current_temp}}", style: { base: "normalText", fontSize: 20, color: "#ff453a" } },
          { type: "text", text: "°C", style: { base: "normalText", color: "#ff453a" } },
          { type: "spacer", size: 13 },
          { type: "text", text: "{{current_humidity}}", style: { base: "normalText", fontSize: 20, color: "#487de7" } },
          { type: "text", text: "％", style: { base: "normalText", color: "#487de7" } },
          { type: "spacer" }
        ]
      },
      {
        type: "hstack",
//         align: "center",
        children: [
          { type: "spacer", size: 15 },
          { type: "text", text: "不快指数：", style: "currentColumnText" },
          { type: "spacer" },
          { type: "text", text: "{{current_discomfortIndex}}", style: { base: "currentDataText", color: "{{current_discomfortIndexColor}}" } }
        ]
      },
      {
        type: "hstack",
//         align: "center",
        children: [
          { type: "spacer", size: 15 },
          { type: "text", text: "降水確率：", style: "currentColumnText" },
          { type: "spacer" },
          { type: "text", text: "{{current_rain}}％", style: { base: "currentDataText", color: "{{current_rainColor}}" } }
        ]
      },
      {
        type: "hstack",
        align: "center",
        children: [
          { type: "spacer", size: 15 },
          { type: "text", text: "雨　　量：", style: "currentColumnText" },
          { type: "spacer" },
          { type: "text", text: "{{current_precipMm}}㎜", style: "currentDataText" }
        ]
      }
    ]
  }
]

// CurrentData Details Block 3
const currentDataBlock3 = [
  {
    type: "vstack",
    size: new Size(0, 60),
//     justify: "center",
    children: [
      {
        type: "hstack",
        align: "center",
        children: [
          { type: "spacer" },
          { type: "text", text: "日較差：", style: "currentColumnText" },
          { type: "text", text: "{{current_tempMax}}", style: "largeText" },
          { type: "text", text: "°C", style: "currentDataText" },
          { type: "text", text: " / ", style: "largeText" },
          { type: "text", text: "{{current_tempMin}}", style: "largeText" },
          { type: "text", text: "°C", style: "currentDataText" },
          { type: "spacer", size: 15 },
          { type: "text", text: "体感温度：", style: "currentColumnText" },
          { type: "text", text: "{{current_feelslike}}", style: "largeText" },
          { type: "text", text: "°C", style: "currentDataText" },
          { type: "spacer" }
        ]
      },
      {
        type: "hstack",
        align: "center",
        children: [
          { type: "spacer" },
          { type: "text", text: "風速：", style: "currentColumnText" },
          { type: "text", text: "{{current_windSpeed}}", style: { base: "largeText", color: "{{current_windSpeedColor}}" } },
          { type: "text", text: "m/s", style: { base: "currentDataText", color: "{{current_windSpeedColor}}" } },
          { type: "spacer", size: 15 },
          { type: "text", text: "風向き：", style: "currentColumnText" },
          { type: "image", src: "{{current_windIcon}}", tint: "{{highlightTextColor}}", size: 24 },
          { type: "spacer", size: 3 },
          { type: "text", text: "{{current_windDegree}}", style: "largeText" },
          { type: "spacer" }
        ]
      }
    ]
  }
]

// ForecastData Block
const forecastDataBlock = [
  {
    type: "hstack",
    size: new Size(0, 75),
    children: [
  
      // Column
      {
        type: "vstack",
        size: new Size(55, 0),
        children: [
          { type: "text", text: "{{intervalHours}}時間予報", style: { base: "smallText", color: "{{highlightTextColor}}" } },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "気圧", style: { base: "columnText", color: "{{highlightTextColor}}" } },
              { type: "text", text: "(hPa)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "風速", style: { base: "columnText", color: "{{highlightTextColor}}" } },
              { type: "text", text: "(m)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "気温", style: { base: "columnText", color: "{{highlightTextColor}}" } },
              { type: "text", text: "(°C)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "降水", style: { base: "columnText", color: "{{highlightTextColor}}" } },
              { type: "text", text: "(％)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          }
        ]
      },
  
      // Repeat
      {
        type: "repeat",
        items: "{{items}}",
        direction: "horizontal",  // 横並び
        spacing: 6,
//         align: "center",          // 左右中央揃え
        template: {
          type: "vstack",
          size: new Size(50, 0),  // 列幅
          children: [
            { type: "hstack", align: "center", children: [
                { type: "spacer" },
                { type: "text", text: "{{hour}}", style: { base: "smallText", color: "{{highlightTextColor}}" } }
              ]
            },
            { type: "hstack", align: "center", children: [
                { type: "spacer" },
                { type: "text", text: "{{pressureTrend}} ", style: { base: "smallText", color: "{{pressureColor}}" } },
                { type: "text", text: "{{pressure}}", style: { base: "dataText", color: "{{pressureColor}}" } }
              ]
            },
            { type: "hstack", align: "center", children: [
                { type: "spacer" },
                { type: "image", src: "{{windIcon}}", tint: "{{highlightTextColor}}", size: 13 },
                { type: "spacer", size: 3 },
                { type: "text", text: "{{windTrend }} ", style: { base: "smallText", color: "{{windSpeedColor}}" } },
                { type: "text", text: "{{windSpeed}}", style: { base: "dataText", color: "{{windSpeedColor}}" } }
              ]
            },
            { type: "hstack", align: "center", children: [
                { type: "spacer" },
                { type: "text", text: "{{tempTrend}} ", style: { base: "smallText", color: "{{tempColor}}" } },
                { type: "text", text: "{{temp}}", style: { base: "dataText", color: "{{tempColor}}" } }
              ]
            },
            { type: "hstack", align: "center", children: [
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
]

// Astro Block
const astroBlock = [
  {
    type: "hstack",
    size: new Size(0, 25),
    spacing: 3,
    align: "center",
    children: [
      { type: "spacer" },
      { type: "image", src: "{{current_sunriseIcon}}", tint: "{{current_sunriseColor}}", size: 28, opacity: "{{current_sunriseOpacity}}" },
      { type: "text", text: "{{current_sunriseTime}}", style: { base: "extraLargeText", color: "{{current_sunriseColor}}", opacity: "{{current_sunriseOpacity}}" } },
      { type: "spacer", size: 5 },
      { type: "text", text: "{{current_moonphaseIcon}}", style: { base: "extraLargeText", shadowColor: "#d1cdda", shadowRadius: 3, shadowOffset: { x: 0, y: 0 } } },
      { type: "spacer", size: 5 },
      { type: "image", src: "{{current_sunsetIcon}}", tint: "{{current_sunsetColor}}", size: 28, opacity: "{{current_sunsetOpacity}}" },
      { type: "text", text: "{{current_sunsetTime}}", style: { base: "extraLargeText", color: "{{current_sunsetColor}}", opacity: "{{current_sunsetOpacity}}" } },
      { type: "spacer" }
    ]
  }
]

// ======================
// Export
// ======================
module.exports = {

  // Default Config
  getDefaultConfig() {

    return {

      version: APP_VERSION,

      styles: {
        defaultText: { fontSize: 13, bold: false, color: "{{defaultTextColor}}" },
        HighlightText: { fontSize: 13, bold: false, color: "{{highlightTextColor}}" },
        headerText: { fontSize: 13, bold: true, color: "{{headerTextColor}}" },
        bodyText: { fontSize: 13, bold: false, color: "{{bodyTextColor}}" },
        footerText: { fontSize: 9, bold: false, color: "{{footerTextColor}}" },

        titleText: { fontSize: 14, bold: true, color: "{{highlightTextColor}}" },
        versionText: { fontSize: 9, bold: false, color: "{{defaultTextColor}}" },
        updateText: { fontSize: 9, bold: false, color: "{{highlightTextColor}}" },
        locationText: { fontSize: 14, bold: true, color: "{{highlightTextColor}}" },

        currentColumnText: { font:"monospace", fontSize: 13, bold: true, color: "{{highlightTextColor}}" },
        currentDataText: { font:"monospace", fontSize: 13, bold: true, color: "{{defaultTextColor}}" },
        columnText: { font:"monospace", fontSize: 11, bold: true, color: "{{highlightTextColor}}" },
        dataText: { font:"monospace", fontSize: 11, bold: true, color: "{{defaultTextColor}}" },
        extraLargeText: { font:"monospace", fontSize: 24, bold: true, color: "{{defaultTextColor}}" },
        largeText: { font:"monospace", fontSize: 20, bold: true, color: "{{defaultTextColor}}" },
        normalText: { font:"monospace", fontSize: 16, bold: true, color: "{{defaultTextColor}}" },
        smallText: { font:"monospace", fontSize: 9, bold: true, color: "{{defaultTextColor}}" }
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
        refreshMinutes: { type: "number", label: "Refresh Minutes", section: "API", default: 5 },
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
          options: ["default", "small", "medium", "test"],
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
        padding: pos(10, 16, 10, 16),

        header: headerBlock,
        body: [
          {
            type: "hstack",
            size: new Size(0, 70),
//             justify: "space-between",
            children: [
              ...currentDataBlock1,
              ...currentDataBlock2
            ]
          },
          ...currentDataBlock3,
          ...forecastDataBlock,
          ...astroBlock
        ],
        footer: [
          ...locationBlock,
          ...updateBlock
        ],

        // Spacing
        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      // small Layout
      small: {
        padding: pos(10, 10, 10, 10),

        header: headerBlock,
        body: currentDataBlockSmall,
        footer: [
          ...locationBlock,
          ...updateBlock
        ],

        // Spacing
        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      // medium Layout
      medium: {
        padding: pos(10, 16, 10, 16),

        header: headerBlock,
        body: [
          {
            type: "hstack",
            size: new Size(0, 70),
//             justify: "center",
            children: [
              ...currentDataBlock1,
              ...currentDataBlock2
            ]
          },
        ],
        footer: [
          ...locationBlock,
          ...updateBlock
        ],

        // Spacing
        spacing: {
          headerBottom: "flex",
          bodyBottom: "flex"
        }
      },

      // Test Layout
      test: {
        padding: pos(10, 16, 10, 16),

        header: [
          {
            type: "hstack",
            size: new Size(0, 16),
            align: "center",
            justify: "space-between",
            children: [
              { type: "text", text: "{{header_titleStr}}", style: "title" },
              { type: "image", src: "{{status_icon}}", tint: "{{status_color}}", opacity: "{{status_opacity}}", size: 16 }
            ]
          }
        ],

       body: [
          { type: "spacer" },
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
                { type: "text", text: "{{index}}. {{titleStr}} ", style: "bodyText" },
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
    const flat = flatObj(meta)
//     console.log(Object.keys(flat))
//     console.log(flat.current_windImage instanceof Image)

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...flat
    }
  },

  // meta 情報を整理
  metaDataTransform(data, config) {

    const v = config?.values || {}
//     console.log(JSON.stringify(config, null, 2))

    const debug = false

    // Online判定
    const online = v.isOnline ?? false
    const dayTime = true
    const status = {
      icon: "location.fill",
      color: "#d1cdda",
      opacity: online ? 1.0 : 0.7
    }

    // 更新時間生成
    const updateStr = formatTime(
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
      debug,
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
    const defaultTextColor = v.defaultTextColor

    const nowEpoch = Math.floor(Date.now() / 1000) - 3600

    const forecastData = data.forecast.forecastday  // forecastday 配列
    const hours = forecastData.flatMap(day => day.hour)
      .filter(h => h.time_epoch >= nowEpoch)
      .slice(0, 1)

//     console.log(JSON.stringify(data, null, 2))
//     console.log(JSON.stringify(forecastData[ 0 ].day, null, 2))
//     console.log(JSON.stringify(forecastData[ 0 ].astro, null, 2))

    const temp = Math.round(data.current.temp_c)
    const tempMin = Math.round(forecastData[0].day.mintemp_c)
    const tempMax = Math.round(forecastData[0].day.maxtemp_c)
    const humidity = data.current.humidity
    const discomfortIndex = getDiscomfortIndex(temp, humidity)
    const windSpeed = (data.current.wind_kph / 3.6).toFixed(1)
    const windDegree = getDegreeString(data.current.wind_dir)
    const rain = Math.ceil(Math.max(...[ hours[0].chance_of_rain, hours[0].chance_of_snow ]) / 5) * 5

    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')

    const sunriseTime = convert12to24(forecastData[ 0 ].astro.sunrise)
    const sunsetTime = convert12to24(forecastData[ 0 ].astro.sunset)
    const isDay = isTimeInRangeAcrossDay(`${h}:${m}`, sunriseTime, sunsetTime)
    const isAm = now.getHours() < 12

    const wind_degree = data.current.wind_degree
    const windIcon = drawArrow(getDegString(wind_degree), null, true)

    const current = {
      updated: data.current.last_updated,
//       isDay: data.current.is_day,

      temp,
      tempMin,
      tempMax,
      feelslike: Math.round(data.current.feelslike_c),

      condition: data.current.condition.text,
      icon: makeWeatherApiIcon(data.current.condition.icon),

      humidity,
//       cloud: data.current.cloud,

      windIcon,
      windSpeed: windSpeed,
      windSpeedColor: getWindColor(windSpeed, defaultTextColor),
      windDir: data.current.wind_dir,
      windDegree: getDegreeString(data.current.wind_dir),
//       gustKph: data.current.gust_kph,

      pressureMb: data.current.pressure_mb,
//       visibilityKm: data.current.vis_km,

      precipMm: Number(data.current.precip_mm.toFixed(1)),
//       uv: data.current.uv,
  
      rain: rain || 0,
      rainColor: getRainColor(rain, defaultTextColor),
      discomfortIndex: discomfortIndex,
      discomfortIndexColor: getDiscomfortColor(discomfortIndex, defaultTextColor),

      moonphaseIcon: getMoonphaseImage(now, true),

      sunriseTime,
      sunriseIcon: "sunrise.fill",
      sunriseColor: isAm ? "" : "#999999",
      sunriseOpacity: isAm ? 1 : 0.7,

      sunsetTime,
      sunsetIcon: "sunset.fill",
      sunsetColor: isAm ? "#999999" : "",
      sunsetOpacity: isAm ? 0.7 : 1
    }

    return current
  },

  // forecast 情報を整理
  forecastDataTransform(data, config) {

    const v = config?.values || {}
    const defaultTextColor = v.defaultTextColor
//     console.log(JSON.stringify(config, null, 2))

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

      const tempTrend = trendIcon(h.temp_c, prev.temp_c)
      const pressureTrend = trendIcon(h.pressure_mb, prev.pressure_mb)
      const windTrend = trendIcon(h.wind_kph, prev.wind_kph)
      const rainTrend = trendIcon(h.chance_of_rain, prev.chance_of_rain)
      const rain = Math.ceil(Math.max(...[ h.chance_of_rain, h.chance_of_snow ]) / 5) * 5

      const wind_degree = h.wind_degree
      const windIcon = drawArrow(getDegString(wind_degree), null, true)

      return {
        hour: Number(h.time.split(" ")[1].slice(0, 2)) + "時",
        pressure: Math.round(h.pressure_mb),
        pressureColor: getPressureColor(h.pressure_mb, prev.pressure_mb, defaultTextColor),
        pressureTrend: pressureTrend,
        windIcon,
        windSpeed: Math.round(h.wind_kph / 3.6),
        windSpeedColor: getWindColor(Math.round(h.wind_kph / 3.6), defaultTextColor),
        windTrend: windTrend,
        temp: Math.round(h.temp_c),
        tempColor: getTempColor(Math.round(h.temp_c), defaultTextColor),
        tempTrend: tempTrend,
        rain: rain,
        rainColor: getRainColor(rain, defaultTextColor),
        rainTrend: rainTrend
      }
    })

    return items
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
        titleStr: item?.title || "No Title",
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
    const updateStr = formatTime(data.last_updated_epoch, "yyyy/MM/dd HH:mm")

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
        status,
        debug: false
    }

    // 共通データ返却（統一フォーマット）
    return {
      items,
      ...flatObj(meta)
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

// ======================
// Function
// ======================
function pos(a,b,c,d){
  if (b === undefined)
    return {top:a,left:a,bottom:a,right:a}
  if (c === undefined)
    return {top:a,left:b,bottom:a,right:b}
  if (d === undefined)
    return {top:a,left:b,bottom:c,right:b}
  return {top:a,left:b,bottom:c,right:d}
}

function degreeTo16Compass(deg) {
  const dirs = [
    "N", "NNE", "NE", "ENE",
    "E", "ESE", "SE", "SSE",
    "S", "SSW", "SW", "WSW",
    "W", "WNW", "NW", "NNW"
  ]
  const index = Math.floor(((deg + 11.25) % 360) / 22.5)
  return dirs[index]
}
function getDegString(deg) { return Math.floor((deg + 11.25) / 22.5) * 22.5 + 180 }
function drawCircle(t,e,a,r,i,n,s,o,l){let c,u,d,$,m,h,p,g,f,w,y,_;d=e.width/2,$=e.height/2,r=r||0,i=i||0,n=n||0,o=o||0,p=1,w=l&&l.strokeColor?l.strokeColor:"#000",y=l&&l.strokeWidth?l.strokeWidth:0,_=l&&l.fillColor?l.fillColor:"#000";let S=new Path,T=[];for(let k=0;k<360;k++)g=(a-y/2)*Math.cos(m=(h=-90+p*k+o)*(Math.PI/180)),f=(a-y/2)*Math.sin(m),c=d+g,u=$+f,T.push(new Point(c,u));S.addLines(T),S.closeSubpath(),"transparent"!==_&&(t.addPath(S),t.setFillColor(new Color(_)),t.fillPath(S)),"transparent"!==w&&y>0&&(t.addPath(S),t.setStrokeColor(new Color(w)),t.setLineWidth(y),t.strokePath())}
function drawTriangle(t,e,a,r,i,n,s,o,l){let c,u,d,$,m,h,p,g,f,w,y,_;d=e.width/2,$=e.height/2,r=r||0,i=i||0,n=n||0,o=o||0,w=l&&l.strokeColor?l.strokeColor:"#000",y=l&&l.strokeWidth?l.strokeWidth:0,_=l&&l.fillColor?l.fillColor:"#000";let S=new Path,T=[],k=[];for(let F=0;F<4;F++)0==F?h=-90+o:1==F?h=-90+o+n:2==F?p=(h+(360-2*n)/2)*(Math.PI/180):3==F&&(h=-90+o+(360-n)),m=h*(Math.PI/180),2==F?(g=(a-i)*Math.cos(p),f=(a-i)*Math.sin(p)):(g=(a+r)*Math.cos(m),f=(a+r)*Math.sin(m)),c=d+g,u=$+f,T.push(new Point(c,u)),k.push([c,u]);S.addLines(T),S.closeSubpath(),"transparent"!==_&&(t.addPath(S),t.setFillColor(new Color(_)),t.fillPath(S)),"transparent"!==w&&y>0&&(t.addPath(S),t.setStrokeColor(new Color(w)),t.setLineWidth(y),t.strokePath())}
function drawArrow(t,e,a){let r=new Size(32,32),i=new DrawContext;i.opaque=!1,i.respectScreenScale=!0,i.size=r;let n={triangle:{strokeColor:e,strokeWidth:0,fillColor:e},circle:{strokeColor:e,strokeWidth:2,fillColor:"transparent"}};return a&&drawCircle(i,r,15,0,0,0,360,t,n.circle),drawTriangle(i,r,12,0,9,140,0,t,n.triangle),i.getImage()}

// Object 平坦化
function flatObj(obj, prefix = '') {
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    const newKey = prefix ? `${prefix}${key}` : key
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      !(value instanceof Date) &&
      !(value instanceof Image)
    ) {
      Object.assign(result, flatObj(value, newKey + "_"))
    } else {
      result[newKey] = value
    }
  }
  return result
}

// Epoch Date Formatter
function formatTime(epoch, format = "HH:mm") {
  if (!epoch) return "--:--"
  const ts = new Date(
    epoch > 1e12 ? epoch : epoch * 1000
  )
  const df = new DateFormatter()
  df.dateFormat = format
  return df.string(ts)
}

function parseURL(t){let e={href:t},a=["protocol host hostname port pathname query hash".split(" "),"directory filename query".split(" "),"basename extension".split(" ")];return[/^(?:(https?:)?(?:\/\/(([^\/:]+)(?::([0-9]+))?)))?(\/?[^?#]*)(\??[^?#]*)(#?.*)/,/^(?:[^:\/?#]+:)?(?:\/\/[^\/?#]*)?(?:([^?#]*\/)([^\/?#]*))?(\?[^#]*)?(?:#.*)?$/,/^([^/]*)\.([^.]+)?$/].map((r,i)=>{let n=String(2==i?e.filename:t).match(r);n&&a[i].forEach(function(t,a){e[t]=void 0===n[a+1]?null:n[a+1]})}),e}
function makeWeatherApiIcon(url) {
  let {  protocol, host, pathname, filename } = parseURL(url)
  url = (protocol || 'https') + '://' + host + pathname
  if (url.includes('day')) filename = filename.replace('.', 'd.')
  else if (url.includes('night')) filename = filename.replace('.', 'n.')
  return url
}

// 例：風向きをアイコンに変換する関数
function _convertWindDegToIcon(deg) {
  if (deg >= 337.5 || deg < 22.5) return "↑"
  if (deg >= 22.5 && deg < 67.5) return "↗"
  if (deg >= 67.5 && deg < 112.5) return "→"
  if (deg >= 112.5 && deg < 157.5) return "↘"
  if (deg >= 157.5 && deg < 202.5) return "↓"
  if (deg >= 202.5 && deg < 247.5) return "↙"
  if (deg >= 247.5 && deg < 292.5) return "←"
  if (deg >= 292.5 && deg < 337.5) return "↖"
  return "↑"
}

function getDegreeString(wind_dir) { return [ ...wind_dir.replace(/E/g, '\u6771').replace(/W/g, '\u897f').replace(/S/g, '\u5357').replace(/N/g, '\u5317') + '\u3000\u3000' ].slice(0, 3).join('') }

function trendIcon(curr, prev) {
  if (curr > prev) return "↑"
  if (curr < prev) return "↓"
  return "→"
}

function getRainColor(curr, color) {
  if (curr == 100) return "#ff453a"
  if (curr >= 80) return "#ff453a"
  if (curr >= 60) return "#ff6666"
  if (curr >= 40) return "#ffff66"
  return color
}

function getPressureColor(curr, prev, color) {
  if (prev < 1000) return "#ff6666"
  if (Math.abs(curr - prev) >= 5) return "#ff6666"
  if (Math.abs(curr - prev) >= 3) return "#ffff66"
  return color
}

function getWindColor(curr, color) {
  if (curr == 20) return "#ff453a"
  if (curr >= 15) return "#ff6666"
  if (curr >= 10) return "#ffbd55"
  if (curr >= 5) return "#ffff66"
  return color
}

function getTempColor(curr, color) {
  if (curr >= 35) return "#ff453a"
  if (curr >= 30) return "#ff6666"
  if (curr >= 25) return "#ffff66"
  if (curr <= 0) return "#87cefa"
  return color
}

function getDiscomfortColor(dis, color) {
//   if ( dis <= 54 ) return '#6500cb'
  if ( 55 <= dis && dis < 60 ) return '#487DE7'
  if ( 60 <= dis && dis < 65 ) return '#87CEFA'
  if ( 65 <= dis && dis < 70 ) return '#9DE24F'
  if ( 70 <= dis && dis < 75 ) return '#FFFF66'
  if ( 75 <= dis && dis < 80 ) return '#FFBD55'
  if ( 80 <= dis && dis < 85 ) return '#FF6666'
  if ( 85 <= dis ) return '#FF453A'
  return color
}

function getDiscomfortIndex(temp, humidity) {
  const index = 0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3
  return Number(index.toFixed(1))
}

function timeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

function convert12to24(time12h) {
  const [_, hours, minutes, modifier] = time12h.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  let hours24 = parseInt(hours, 10);
  if (modifier.toUpperCase() === 'PM' && hours24 < 12) {
    hours24 += 12;
  } else if (modifier.toUpperCase() === 'AM' && hours24 === 12) {
    hours24 = 0;
  }
  return `${String(hours24).padStart(2, '0')}:${minutes}`;
}

function isTimeInRangeAcrossDay(checkTime, startTime, endTime) {
  let start = timeToMinutes(startTime);
  let end = timeToMinutes(endTime);
  let check = timeToMinutes(checkTime);
  if (end < start) {
    end += 24 * 60;
    if (check < start) {
      check += 24 * 60;
    }
  }
  return check >= start && check <= end;
}

function getMoonphaseImage( dt, isMoonUp = true ) {
  Date.prototype.getMoonphase=function(){let t=0,e=0,$=0,o=0,n=this.getFullYear(),h=this.getMonth()+1,r=this.getDate();return h<3&&(n--,h+=12),++h,$=(t=365.25*n)+(e=30.6*h)+r-694039.09,$/=29.5305882,o=parseInt($),$-=o,(o=Math.round(8*$))>=8&&(o=0),o}
  const sunIcon = '\ud83d\udfe0';
  const moonIcons = [ '\ud83c\udf11', '\ud83c\udf12', '\ud83c\udf13', '\ud83c\udf14', '\ud83c\udf15', '\ud83c\udf16', '\ud83c\udf17', '\ud83c\udf18' ];
  return isMoonUp ? moonIcons[ dt.getMoonphase() ] : sunIcon;
}

// ======================
// Module Test
// ======================
const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '');
if (module_name == Script.name()) {
  (async() => {
    const Main = importModule("Main")
    await Main.start(DEFAULT_STRAGE_TYPE)
  })()
}