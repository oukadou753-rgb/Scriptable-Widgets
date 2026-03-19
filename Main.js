// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: download;
/**
 * Main
 * UTF-8 日本語コメント
 **/
const APP_DEV_MODE = true

const DEFAULT_APP_ID = "Weather"

const APP_ID = args.widgetParameter || DEFAULT_APP_ID
const APP_VERSION = "1.0.0"

const DEFAULT_STRAGE_TYPE = "local" // "icloud", "local", "bookmark"
const WF_MODULE_DIR = "WidgetFramework/"
const WF_REPO = "oukadou753-rgb/scriptable-widget-framework"

const APP_INFO = {
  debug: APP_DEV_MODE,

  id: APP_ID,
  version: APP_VERSION,

  storageType: DEFAULT_STRAGE_TYPE,
  moduleDir: WF_MODULE_DIR,
  moduleCache: {},

  frameworkRepo: WF_REPO
}

const ModuleLoader = importModule("ModuleLoader")

// =========================
// Export
// =========================
const Main = {

  // =========================
  // loadAppConfig
  // =========================
  loadAppConfig(appInfo) {

    const appId = appInfo.id
    const moduleDir = appInfo.moduleDir
    const moduleLoader = appInfo.moduleLoader

    try {

      return importModule(`App_${appId}Config`)

    } catch (e) {

      console.error(`App config not found: ${appId}`)
      return moduleLoader.load(`${moduleDir}App_${appId}Config`)

    }
  },

  // =========================
  // start
  // =========================
  async start(appInfo = APP_INFO) {

    const appId = appInfo.id
    const storageType = appInfo.storageType
    const moduleDir = appInfo.moduleDir

    const moduleLoader = new ModuleLoader(storageType)
    appInfo.moduleLoader = moduleLoader

    const appConfig = Main.loadAppConfig(appInfo)

    try {

      const WF_StorageEngine = moduleLoader.load(`${moduleDir}WF_StorageEngine`)
      const WF_WidgetRenderer = moduleLoader.load(`${moduleDir}WF_WidgetRenderer`)
      const WF_ProfileEngine = moduleLoader.load(`${moduleDir}WF_ProfileEngine`)
      const WF_DataProvider = moduleLoader.load(`${moduleDir}WF_DataProvider`)
      const WF_NotificationManager = moduleLoader.load(`${moduleDir}WF_NotificationManager`)
      const WF_CoreBase = moduleLoader.load(`${moduleDir}WF_CoreBase`)

      if (config.runsInWidget && !config.runsInApp) {

        const WF_WidgetCore = moduleLoader.load(`${moduleDir}WF_WidgetCore`)

        appInfo.moduleCache = {
          ModuleLoader,
          moduleLoader,

          WF_StorageEngine,
          WF_WidgetRenderer,
          WF_ProfileEngine,
          WF_DataProvider,
          WF_NotificationManager,
          WF_CoreBase
        }

        const widgetCore = new WF_WidgetCore(appInfo, appConfig, appInfo.moduleCache)
        await widgetCore.start();

      } else {

        const WF_MenuEngine = moduleLoader.load(`${moduleDir}WF_MenuEngine`)
        const WF_ConfigUI = moduleLoader.load(`${moduleDir}WF_ConfigUI`)
        const WF_NotificationUI = moduleLoader.load(`${moduleDir}WF_NotificationUI`)

        const WF_AppCore = moduleLoader.load(`${moduleDir}WF_AppCore`)

        appInfo.moduleCache = {
          ModuleLoader,
          moduleLoader,

          WF_StorageEngine,
          WF_WidgetRenderer,
          WF_MenuEngine,
          WF_ProfileEngine,
          WF_ConfigUI,
          WF_DataProvider,
          WF_NotificationManager,
          WF_NotificationUI,
          WF_CoreBase
        }

        const appCore = new WF_AppCore(appInfo, appConfig, appInfo.moduleCache)
        await appCore.start()

      }
      
    } catch(e) {

      console.error("Error: " + e.message)
      this.errorWidget(e)

    } finally {

      Script.complete()

    }
  },

  // =========================
  // setAppInfo
  // =========================
  setAppInfo(key, values) {

    APP_INFO[key] = values

  },

  // =========================
  // errorWidget
  // =========================
  errorWidget(e) {

    const color = [ Color.yellow(), Color.black(), Color.red() ]

    let w = new ListWidget()
    w.setPadding(10, 10, 10, 10)
    w.backgroundColor = color[0]

    this._addText(w, "WidgetFramework", Font.semiboldSystemFont(13), color[1], "left")
    w.addSpacer()
    this._addText(w, "Script Stopped", Font.boldSystemFont(18), color[1], "center")
    w.addSpacer(10)
    this._addText(w, e.message, Font.boldSystemFont(16), color[2], "center")
    w.addSpacer()
    this._addText(w, APP_INFO.storageType + " " + new Date().toLocaleTimeString(), Font.semiboldSystemFont(11), color[1], "right")

    if (config.runsInWidget) Script.setWidget(w)
    else w.presentLarge()
  },

  // =========================
  // _addText
  // =========================
  _addText(w, text, font, color, aling) {

    let t = w.addText(text)
    if (font) t.font = font
    if (color) t.textColor = color
    if (aling == "right") t.rightAlignText()
    else if (aling == "center") t.centerAlignText()
  }

}

module.exports = Main

// =========================
// Module Test
// =========================
const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '');
if (module_name == Script.name()) {
  (async() => {
    const appInfo = APP_INFO
    
    console.log("USING: " + appInfo.storageType)
    await Main.start(appInfo)
  })()
}