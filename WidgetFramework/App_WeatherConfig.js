// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_Config
 * UTF-8 日本語コメント
 **/
// ======================
// Constat
// ======================
const APP_VERSION = "2.0.0"
const DEFAULT_STRAGE_TYPE = "local" // "icloud", "local", "bookmark"

// ======================
// Color
// ======================
const PALETTE = Object.freeze({

  red: "#ff4d4d",
  orange: "#ff9a3c",
  amber: "#ffb347",
  yellow: "#ffd84d",
  green: "#9de24f",

  sky: "#66d1ff",
  cyan: "#3ddcff",
  blue: "#4d8dff",
  purple: "#7a4dff",

  whitew: "#d1cdda",
  gray: "#7f8fa6",
  litegGray: "#acb6c5",
  darkGray: "#596980",
  black: "#000000"

})

const ROLE = Object.freeze({

  danger: PALETTE.red,
  warning: PALETTE.orange,
  caution: PALETTE.yellow,
  success: PALETTE.green,

  info: PALETTE.sky,
  accent: PALETTE.blue,

  strongWeather: PALETTE.purple,
  neutral: PALETTE.gray

})

const COLORS = {

  theme: {
    textPrimary: "#d1cdda",    // メイン文字
    textSecondary: "#a8b2c7",  // サブ文字
    divider: "#2c4a72",       // 仕切り

    accent: PALETTE.blue,      // 強調
    info: PALETTE.sky,         // 情報
    highlight: PALETTE.purple  // 特殊
  },

  background: {
    base: "#003366",           // 単色
    top: "#000000",            // グラデーション・上
    bottom: "#003366"          // グラデーション・下
  },

  pressure: {
    rising: PALETTE.sky,       // 上昇
    steady: "#d1cdda",         // 変化なし
    falling: PALETTE.amber,    //下降
    alert: PALETTE.red         // 警戒
  },

  temp: {
    extremeHot: PALETTE.red,    // 35℃以上
    hot: PALETTE.orange,        // 30〜34℃
    warm: PALETTE.amber,        // 25〜29℃
    mild: PALETTE.yellow,       // 20〜24℃

    cool: PALETTE.sky,          // 15〜19℃
    cold: PALETTE.blue,         // 5〜14℃
    freezing: PALETTE.purple    // 4℃以下
  },

  humidity: {
    dry: PALETTE.sky,           // 30%未満
    comfortable: PALETTE.sky,   // 30〜50%
    humid: PALETTE.cyan,        // 50〜70%
    wet: PALETTE.cyan           // 70%以上
  },

  wind: {
    calm: PALETTE.green,        // 無風〜微風
    breeze: PALETTE.sky,        // 弱風
    windy: PALETTE.yellow,      // やや強い
    strong: PALETTE.orange,     // 強風
    storm: PALETTE.red          // 暴風
  },

  rain: {
    none: PALETTE.gray,         // 0mm
    light: PALETTE.sky,         // 0.1〜1mm
    moderate: PALETTE.cyan,     // 1〜5mm
    heavy: PALETTE.blue,        // 5〜20mm
    storm: PALETTE.purple       // 20mm+
  },

  pop: {
    none: PALETTE.gray,         // 0%
    low: PALETTE.sky,           // 10〜30%
    medium: PALETTE.cyan,       // 40〜60%
    high: PALETTE.blue,         // 70〜80%
    veryHigh: PALETTE.purple    // 90〜100%
  },

  discomfort: {
    soHot: PALETTE.red,         // "暑くてたまらない"
    hot: PALETTE.orange,        // "暑くて汗が出る"
    littleHot: PALETTE.amber,   // "やや暑い"
    notHot: PALETTE.yellow,     // "暑くない"
    pleasant: PALETTE.green,    // "快い"
    none: PALETTE.sky,          // "何も感じない"
    chilly: PALETTE.blue,       // "肌寒い"
    cold: PALETTE.purple        // "寒い"
  },

  level: {
    normal: PALETTE.green,      // 普通
    caution: PALETTE.yellow,    // 注意
    alert: PALETTE.orange,      // 警戒
    danger: PALETTE.red         // 危険
  },

  status: {
    ok: PALETTE.green,          // 正常
    info: PALETTE.sky,          // 情報
    notice: PALETTE.yellow,     // 軽注意
    warning: PALETTE.orange,    // 注意
    danger: PALETTE.red,        // 危険
    critical: PALETTE.red       // 最危険
  },

  extra: {
    temp: PALETTE.red,
    humidity: PALETTE.cyan,
    rain: PALETTE.sky,
    snow: "#cfe9ff",
    cloud: PALETTE.gray,
    pressureHigh: PALETTE.orange,
    pressureLow: PALETTE.purple
  }

}

const LEVEL_THRESHOLDS = {

  temp: [
    [35, COLORS.temp.extremeHot],
    [30, COLORS.temp.hot],
    [25, COLORS.temp.warm],
    [20, COLORS.temp.mild],
    [15, COLORS.temp.cool],
    [5, COLORS.temp.cold]
  ],
  tempDef: COLORS.temp.freezing,

  rain: [
    [20, COLORS.rain.storm],
    [5, COLORS.rain.heavy],
    [1, COLORS.rain.moderate],
//     [0.1, COLORS.rain.light]
  ],
  rainDef: COLORS.theme.textPrimary,

  pop: [
    [90, COLORS.pop.veryHigh],
    [70, COLORS.pop.high],
//     [40, COLORS.pop.medium],
//     [10, COLORS.pop.low]
  ],
  popDef: COLORS.theme.textPrimary,

  wind: [
    [15, COLORS.wind.storm],
    [10, COLORS.wind.strong],
    [6, COLORS.wind.windy],
//     [3, COLORS.wind.breeze]
  ],
  windDef: COLORS.theme.textPrimary,

  discomfort: [
    [85, [COLORS.discomfort.soHot, "暑くてたまらない"]],
    [80, [COLORS.discomfort.hot, "暑くて汗が出る"]],
    [75, [COLORS.discomfort.littleHot, "やや暑い"]],
    [70, [COLORS.discomfort.notHot, "暑くない"]],
    [65, [COLORS.discomfort.pleasant, "快い"]],
    [60, [COLORS.discomfort.none, "何も感じない"]],
    [54, [COLORS.discomfort.chilly, "肌寒い"]]
  ],
  discomfortDef: [COLORS.discomfort.cold, "寒い"]

}

// ======================
// Font Size
// ======================
const SIZE_FONTS = {
  default: 13,

  header: 14,
  body: 13,
  footer: 9,

  extraLarge: 24,
  large: 20,
  normal: 16,
  small: 10
}

// ======================
// Header Block
// ======================
const headerBlock = [
  {
    type: "hstack",
    size: new Size(0, 24),
    align: "center",
    children: [
      { type: "image", src: "{{header_titleIcon_src}}", tint: "{{header_titleIcon_tint}}", size: 24 },
      { type: "spacer", size: 3 },
      { type: "text", text: "{{header_titleStr}}", style: "headerText" },
      { type: "spacer" },
      { type: "text", text: "{{current_discomfortIndexStr}}", style: { base: "headerText", color: "{{current_discomfortIndexColor}}" } },
      { type: "spacer", size: 5 },
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
    align: "center",
    children: [
      { type: "text", text: "{{location_name}}", style: { base: "footerText", fontSize: SIZE_FONTS.normal, bold: true, color: "{{highlightTextColor}}" } },
    ]
  }
]

// Update + Location.lat/lon
const updateBlock = [
  {
    type: "hstack",
    size: new Size(0, 16),
    align: "center",
    children: [
//       { type: "text", text: DEFAULT_STRAGE_TYPE + " mode", style: "footerText" },
//       { type: "text", text: "{{location_latStr}} : {{location_lonStr}}", style: "footerText" },
      { type: "spacer" },
      { type: "text", text: "Update: ", style: { base: "footerText", color: "{{highlightTextColor}}" } },
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
    children: [
      {
        type: "hstack",
        justify: "center",
        align: "center",
        children: [
          { type: "text", text: "{{current_pressure}}", style: { base: "defaultText", font:"monospace", fontSize: 45, bold: true, lineLimit: 1, minimumScaleFactor: 0.8 } }
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
    justify: "center",
    align: "center",
    children: [
      {
        type: "hstack",
        children: [
          { type: "text", text: "{{current_pressure}}", style: { base: "dataText", font:"monospace", fontSize: 55, bold: true, color: "{{current_pressureColor}}", lineLimit: 1, minimumScaleFactor: 0.9 } }
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
    children: [
      {
        type: "hstack",
        size: new Size(0, 25),
        justify: "center",
        align: "center",
        children: [
          { type: "text", text: "{{current_temp}}", style: { base: "normalText", fontSize: 20, color: COLORS.extra.temp } },
          { type: "text", text: "°C", style: { base: "normalText", color: COLORS.extra.temp } },
          { type: "spacer", size: 13 },
          { type: "text", text: "{{current_humidity}}", style: { base: "normalText", fontSize: 20, color: COLORS.extra.humidity } },
          { type: "text", text: "％", style: { base: "normalText", color: COLORS.extra.humidity } }
        ]
      },
      {
        type: "hstack",
        align: "center",
        spacing: 2,
        children: [
          { type: "text", text: "不快指数：", style: "currentColumnText" },
          { type: "spacer" },
          { type: "text", text: "{{current_discomfortIndex}}", style: { base: "currentDataText", color: "{{current_discomfortIndexColor}}" } },
            { type: "text", text: "　", style: "currentDataText" }
        ]
      },
      {
        type: "hstack",
        align: "center",
        spacing: 2,
        children: [
          { type: "text", text: "降水確率：", style: "currentColumnText" },
          { type: "spacer" },
          { type: "text", text: "{{current_pop}}", style: { base: "currentDataText", color: "{{current_popColor}}" } },
          { type: "text", text: "％", style: "currentDataText" }
        ]
      },
      {
        type: "hstack",
        align: "center",
        spacing: 2,
        children: [
          { type: "text", text: "雨　　量：", style: "currentColumnText" },
          { type: "spacer" },
          { type: "text", text: "{{current_precipMm}}", style: "currentDataText" },
          { type: "text", text: "㎜", style: "currentDataText" },
        ]
      }
    ]
  }
]

// CurrentData Details Block 3
const currentDataBlock3 = [
  {
    type: "vstack",
    size: new Size(0, 55),
    children: [
      {
        type: "hstack",
        justify: "center",
        align: "center",
        children: [
          { type: "text", text: "日較差：", style: "currentColumnText" },
          { type: "text", text: "{{current_tempMax}}", style: { base: "normalText", color: "{{current_tempMaxColor}}" } },
          { type: "text", text: "°C", style: "currentDataText" },
          { type: "text", text: " / ", style: "currentColumnText" },
          { type: "text", text: "{{current_tempMin}}", style: { base: "normalText", color: "{{current_tempMinColor}}" } },
          { type: "text", text: "°C", style: "currentDataText" },
          { type: "spacer", size: 15 },
          { type: "text", text: "体感温度：", style: "currentColumnText" },
          { type: "text", text: "{{current_feelslike}}", style: { base: "normalText", color: "{{current_feelslikeColor}}" } },
          { type: "text", text: "°C", style: "currentDataText" }
        ]
      },
      {
        type: "hstack",
        justify: "center",
        align: "center",
        children: [
          { type: "text", text: "風速：", style: "currentColumnText" },
          { type: "text", text: "{{current_windSpeed}}", style: { base: "normalText", color: "{{current_windSpeedColor}}" } },
          { type: "text", text: "m/s", style: "currentDataText" },
          { type: "spacer", size: 15 },
          { type: "text", text: "風向き：", style: "currentColumnText" },
          { type: "image", src: "{{current_windIcon}}", tint: "{{highlightTextColor}}", size: 24 },
          { type: "spacer", size: 5 },
          { type: "text", text: "{{current_windDegree}}", style: "normalText" }
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
        size: new Size(50, 0),
        children: [
          { type: "text", text: "{{intervalHours}}時間予報", style: { base: "smallText", color: "{{highlightTextColor}}" } },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "気圧", style: "columnText" },
              { type: "text", text: "(hPa)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "風速", style: "columnText" },
              { type: "text", text: "(m)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "気温", style: "columnText" },
              { type: "text", text: "(°C)", style: { base: "smallText", color: "{{highlightTextColor}}" } }
            ]
          },
          { type: "hstack", align: "center", children: [
              { type: "text", text: "降水", style: "columnText" },
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
        align: "center",          // 左右中央揃え
        template: {
          type: "vstack",
          size: new Size(51, 0),  // 列幅
          children: [
            { type: "hstack", justify: "end", align: "center", children: [
                { type: "text", text: "{{hour}}", style: { base: "smallText", color: "{{highlightTextColor}}" } }
              ]
            },
            { type: "hstack", justify: "end", align: "center", children: [
                { type: "text", text: "{{pressureTrend}} ", style: { base: "smallText", bold: true, color: "{{pressureColor}}" } },
                { type: "text", text: "{{pressure}}", style: "dataText" }
              ]
            },
            { type: "hstack", justify: "end", align: "center", children: [
                { type: "image", src: "{{windIcon}}", tint: "{{highlightTextColor}}", size: 13 },
                { type: "spacer", size: 3 },
                { type: "text", text: "{{windTrend }} ", style: { base: "smallText", bold: true, color: "{{windSpeedColor}}" } },
                { type: "text", text: "{{windSpeed}}", style: "dataText" }
              ]
            },
            { type: "hstack", justify: "end", align: "center", children: [
                { type: "text", text: "{{tempTrend}} ", style: { base: "smallText", bold: true, color: "{{tempColor}}" } },
                { type: "text", text: "{{temp}}", style: "dataText" }
              ]
            },
            { type: "hstack", justify: "end", align: "center", children: [
                { type: "text", text: "{{popTrend}} ", style: { base: "smallText", bold: true, color: "{{popColor}}" } },
                { type: "text", text: "{{pop}}", style: "dataText" }
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
    size: new Size(0, 28),
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

      colors: COLORS,

      styles: {
        defaultText: { fontSize: SIZE_FONTS.default, bold: false, color: "{{defaultTextColor}}" },
        HighlightText: { fontSize: SIZE_FONTS.default, bold: false, color: "{{highlightTextColor}}" },

        headerText: { fontSize: SIZE_FONTS.header, bold: true, color: "{{headerTextColor}}" },
        bodyText: { fontSize: SIZE_FONTS.body, bold: false, color: "{{bodyTextColor}}" },
        footerText: { fontSize: SIZE_FONTS.footer, bold: false, color: "{{footerTextColor}}" },

        titleText: { fontSize: SIZE_FONTS.header, bold: true, color: "{{highlightTextColor}}" },
        versionText: { fontSize: SIZE_FONTS.footer, bold: false, color: "{{defaultTextColor}}" },
        updateText: { fontSize: SIZE_FONTS.footer, bold: false, color: "{{highlightTextColor}}" },
        locationText: { fontSize: SIZE_FONTS.body, bold: true, color: "{{highlightTextColor}}" },

        currentColumnText: { font:"monospace", fontSize: 13, bold: true, color: "{{highlightTextColor}}", lineLimit: 1 },
        currentDataText: { font:"monospace", fontSize: 13, bold: true, color: "{{defaultTextColor}}", lineLimit: 1 },

        columnText: { font:"monospace", fontSize: 11, bold: true, color: "{{highlightTextColor}}", lineLimit: 1 },
        dataText: { font:"monospace", fontSize: 11, bold: true, color: "{{defaultTextColor}}", lineLimit: 1 },

        extraLargeText: { font:"monospace", fontSize: SIZE_FONTS.extraLarge, bold: true, color: "{{defaultTextColor}}", lineLimit: 1 },
        largeText: { font:"monospace", fontSize: SIZE_FONTS.large, bold: true, color: "{{defaultTextColor}}", lineLimit: 1 },
        normalText: { font:"monospace", fontSize: SIZE_FONTS.normal, bold: true, color: "{{defaultTextColor}}", lineLimit: 1 },
        smallText: { font:"monospace", fontSize: SIZE_FONTS.small, bold: true, color: "{{defaultTextColor}}", lineLimit: 1 }
      },

      defaultOpenSections: ["General", "Style"],

      schema: {
        titleStr: { type: "text", label: "Title", section: "General", default: "My Widget" },

        useBgGradient: { type: "bool", label: "Use Gradient Color", section: "BackgroundColor", default: true },
        bgColorTop: { type: "color", label: "Gradient Background Top Color", section: "BackgroundColor", default: COLORS.background.top, presets: ["#000000", "#ff9900"] },
        bgColorBottom: { type: "color", label: "Gradient Background Bottom Color", section: "BackgroundColor", default: COLORS.background.bottom, presets: ["#000000", "#ff9900"] },
        bgColor: { type: "color", label: "Background Color", section: "BackgroundColor", default: COLORS.background.base, presets: ["#000000", "#ff9900"] },

        defaultTextColor: { type: "color", label: "Default Text Color", section: "Style", default: COLORS.theme.textPrimary },
        highlightTextColor: { type: "color", label: "Highlight Text Color", section: "Style", default: COLORS.theme.highlight },
        headerTextColor: { type: "color", label: "Header Text Color", section: "Style", default: COLORS.theme.textPrimary },
        bodyTextColor: { type: "color", label: "Body Text Color", section: "Style", default: COLORS.theme.textPrimary },
        footerTextColor: { type: "color", label: "Footer Text Color", section: "Style", default: COLORS.theme.textPrimary },

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
          src: current.conditionIcon,
          tint: current.isDay ? "" : "#ffffff"
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

    const intervalHours = v.intervalHours || 2
    const displayCount = 2
    const nowEpoch = Math.floor(Date.now() / 1000) - (3600 * (intervalHours + 1))

    const forecastData = data.forecast.forecastday
    const hours = forecastData.flatMap(day => day.hour)
      .filter(h => h.time_epoch >= nowEpoch)
      .filter((h, i) => i % intervalHours === 0)
      .slice(0, displayCount)

//     console.log(JSON.stringify(hours[0], null, 2))
//     console.log(JSON.stringify(data, null, 2))
//     console.log(JSON.stringify(forecastData[ 0 ].day, null, 2))
//     console.log(JSON.stringify(forecastData[ 0 ].astro, null, 2))

    const pressure_current = data.current.pressure_mb
    const pressure_after = hours[0].pressure_mb || pressure_current

    const temp = Math.round(data.current.temp_c)
    const tempMin = Math.round(forecastData[0].day.mintemp_c)
    const tempMax = Math.round(forecastData[0].day.maxtemp_c)
    const humidity = data.current.humidity

    const discomfortIndex = getDiscomfortIndex(temp, humidity)
    const [ discomfortIndexColor, discomfortIndexStr ] = colorByThreshold(discomfortIndex, LEVEL_THRESHOLDS.discomfort, LEVEL_THRESHOLDS.discomfortDef)

    const windSpeed = (data.current.wind_kph / 3.6).toFixed(1)
    const windDegree = getDegreeString(data.current.wind_dir)
    const windIcon = drawArrow(getDegString(data.current.wind_degree), null, true)

    const pop = Math.ceil(Math.max(...[ hours[1].chance_of_rain, hours[1].chance_of_snow ]) / 5) * 5

    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')

    const sunriseTime = convert12to24(forecastData[ 0 ].astro.sunrise)
    const sunsetTime = convert12to24(forecastData[ 0 ].astro.sunset)

    const isDay = isTimeInRangeAcrossDay(`${h}:${m}`, sunriseTime, sunsetTime)
    const isAm = now.getHours() < 12

    const current = {
      updated: data.current.last_updated,
      isDay: data.current.is_day,

      temp,
      tempMin,
      tempMinColor: colorByThreshold(tempMin, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef),
      tempMax,
      tempMaxColor: colorByThreshold(tempMax, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef),

      feelslike: Math.round(data.current.feelslike_c),
      feelslikeColor: colorByThreshold(temp, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef),

      condition: data.current.condition.text,
      conditionIcon: makeWeatherApiIcon(data.current.condition.icon),

      humidity,

      windSpeed,
      windIcon,
      windSpeedColor: colorByThreshold(windSpeed, LEVEL_THRESHOLDS.wind, LEVEL_THRESHOLDS.windDef),
      windDir: data.current.wind_dir,
      windDegree: getDegreeString(data.current.wind_dir),

      pressure: pressure_current,
      pressureColor: getPressureColor(pressure_current, pressure_after),

      precipMm: data.current.precip_mm.toFixed(1),
  
      pop,
      popColor: colorByThreshold(pop, LEVEL_THRESHOLDS.pop, LEVEL_THRESHOLDS.popDef),

      discomfortIndex: discomfortIndex.toFixed(1),
      discomfortIndexColor,
      discomfortIndexStr,

      moonphaseIcon: getMoonphaseImage(now, true),

      sunriseTime,
      sunriseIcon: "sunrise.fill",
      sunriseColor: isAm ? "" : "#999999",
      sunriseOpacity: isAm ? 1 : 0.7,

      sunsetTime,
      sunsetIcon: "sunset.fill",
      sunsetColor: isAm ? "#999999" : "",
      sunsetOpacity: isAm ? 0.7 : 1,

//       cloud: data.current.cloud,
//       gustKph: data.current.gust_kph,
//       visibilityKm: data.current.vis_km,
//       uv: data.current.uv,
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
    const nowEpoch = Math.floor(Date.now() / 1000) - (3600 * (intervalHours + 1))

    const forecastData = data.forecast.forecastday  // forecastday 配列

    // hour 配列から現在時間以降のデータを flatten して抽出
    const hours = forecastData.flatMap(day => day.hour)
      .filter(h => h.time_epoch >= nowEpoch)          // 現在時間以降
      .filter((h, i) => i % intervalHours === 0)      // 2時間毎に間引き
      .slice(0, displayCount + 2)                     // 表示件数に制限

    // レンダラー用 JSON に transform
    const items = hours.map((h, idx) => {
      if (idx <= 1) return null
      const prev = idx > 0 ? hours[idx - 1] : h

      const tempTrend = trendIcon(h.temp_c, prev.temp_c)
      const pressureTrend = trendIcon(h.pressure_mb, prev.pressure_mb)
      const windTrend = trendIcon(h.wind_kph, prev.wind_kph)
      const popTrend = trendIcon(h.chance_of_rain, prev.chance_of_rain)
      const pop = Math.ceil(Math.max(...[ h.chance_of_rain, h.chance_of_snow ]) / 5) * 5

      const temp = Math.round(h.temp_c)
      const windSpeed = Math.round(h.wind_kph / 3.6)
      const windIcon = drawArrow(getDegString(h.wind_degree), null, true)

      return {
        hour: Number(h.time.split(" ")[1].slice(0, 2)) + "時",

        pressure: Math.round(h.pressure_mb),
        pressureColor: getPressureColor(h.pressure_mb, prev.pressure_mb),
        pressureTrend,

        windSpeed,
        windSpeedColor: colorByThreshold(windSpeed, LEVEL_THRESHOLDS.wind, LEVEL_THRESHOLDS.windDef),
        windTrend,
        windIcon,

        temp,
        tempColor: colorByThreshold(temp, LEVEL_THRESHOLDS.temp, LEVEL_THRESHOLDS.tempDef),
        tempTrend,

        pop,
        popColor: colorByThreshold(pop, LEVEL_THRESHOLDS.pop, LEVEL_THRESHOLDS.popDef),
        popTrend
      }
    }).filter(v => v)

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

// function degreeTo16Compass(deg) {
//   const dirs = [
//     "N", "NNE", "NE", "ENE",
//     "E", "ESE", "SE", "SSE",
//     "S", "SSW", "SW", "WSW",
//     "W", "WNW", "NW", "NNW"
//   ]
//   const index = Math.floor(((deg + 11.25) % 360) / 22.5)
//   return dirs[index]
// }
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
// function _convertWindDegToIcon(deg) {
//   if (deg >= 337.5 || deg < 22.5) return "↑"
//   if (deg >= 22.5 && deg < 67.5) return "↗"
//   if (deg >= 67.5 && deg < 112.5) return "→"
//   if (deg >= 112.5 && deg < 157.5) return "↘"
//   if (deg >= 157.5 && deg < 202.5) return "↓"
//   if (deg >= 202.5 && deg < 247.5) return "↙"
//   if (deg >= 247.5 && deg < 292.5) return "←"
//   if (deg >= 292.5 && deg < 337.5) return "↖"
//   return "↑"
// }

function getDegreeString(wind_dir) { return [ ...wind_dir.replace(/E/g, '\u6771').replace(/W/g, '\u897f').replace(/S/g, '\u5357').replace(/N/g, '\u5317') + '\u3000\u3000' ].slice(0, 3).join('') }

function trendIcon(curr, prev) {
  if (curr > prev) return "↑"
  if (curr < prev) return "↓"
  return "→"
}

function colorByThreshold(v, table, defaultColor) {
  for (const [limit, color] of table) {
    if (v >= limit) return color
  }
  return defaultColor
}

function getPressureColor(curr, prev) {
  const diff = curr - prev
  const c = COLORS.pressure
  let color = c.steady
  if (diff > 2 || diff < -2) color = c.alart
  else if (diff > 0.5) color = c.rising
  else if (diff < -0.5) color = c.falling
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