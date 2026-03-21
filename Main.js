// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: download;
/**
 * DevWidget
 * UTF-8 日本語コメント
 * 2026/03/21 09:00
 */
const DEFAULT_APP_ID = "Weather"
const DEFAULT_STRAGE_TYPE = "local"

const APP_DEV_MODE = true
const APP_ID = args.widgetParameter || DEFAULT_APP_ID
const APP_VERSION = "1.0.0"
const APP_CONFIG = `App_${APP_ID}Config`

const WF_MODULE_DIR = "WidgetFramework/"
const WF_REPO = "oukadou753-rgb/scriptable-widget-framework"

const APP_INFO = {
  debug: APP_DEV_MODE,
  id: APP_ID,
  version: APP_VERSION,
  storageType: DEFAULT_STRAGE_TYPE,
  moduleDir: WF_MODULE_DIR,
  frameworkRepo: WF_REPO,
}

const MODULES = {
  WF_StorageEngine: { type: "both", path: WF_MODULE_DIR },
  WF_WidgetRenderer: { type: "both", path: WF_MODULE_DIR },
  WF_ProfileEngine: { type: "both", path: WF_MODULE_DIR },
  WF_DataProvider: { type: "both", path: WF_MODULE_DIR },
  WF_NotificationManager: { type: "both", path: WF_MODULE_DIR },
  WF_CoreBase: { type: "both", path: WF_MODULE_DIR },

  WF_MenuEngine: { type: "app", path: WF_MODULE_DIR },
  WF_ConfigUI: { type: "app", path: WF_MODULE_DIR },
  WF_NotificationHandlers: { type: "app", path: WF_MODULE_DIR },
  WF_NotificationUI: { type: "app", path: WF_MODULE_DIR },

  WF_AppCore: { type: "app", path: WF_MODULE_DIR },
  WF_WidgetCore: { type: "widget", path: WF_MODULE_DIR },

  [APP_CONFIG]: { type: "both", path: "" },
}

module.exports = {
  
  // =========================
  // start
  // =========================
  async start(appInfo = APP_INFO) {

    try {

      await this.init(appInfo)

    } catch(e) {

      this.catch(e)

    } finally {

      this.terminate(appInfo)

    }

  },

  // =========================
  // init
  // =========================
  async init(appInfo) {

      const ModuleLoader = importModule("ModuleLoader")
      const moduleLoader = new ModuleLoader(appInfo.storageType)

      let obj = {}

      for (key in MODULES) {

        const value = MODULES[key]
        const path = value.path + key
        const type = value.type

        if (this.isImport(type)) {
          try {
            obj[key] = moduleLoader.load(path)
          } catch(e) {
            obj[key] = importModule(key)
          }
        }

      }

      if (config.runsInWidget) {
        const widgetCore = new obj.WF_WidgetCore(appInfo, obj[APP_CONFIG], obj)
        await widgetCore.start()
      } else {
        const appCore = new obj.WF_AppCore(appInfo, obj[APP_CONFIG], obj)
        await appCore.start()
      }

  },

  // =========================
  // catch
  // =========================
  catch(e) {

    console.error(e.message)
    errorWidget(e)

  },

  // =========================
  // terminate
  // =========================
  terminate(appInfo) {

    Script.complete()

  },

  // =========================
  // isImport
  // =========================
  isImport(type) {
    if (config.runsInWidget) {
      if(type == "widget" || type == "both") return true
    } else {
      if(type == "app" || type == "both") return true
    }
    return false
  },

  // =========================
  // setAppInfo
  // =========================
  setAppInfo(key, values) {

    APP_INFO[key] = values

  }

}

// =========================
// errorWidget
// =========================
function errorWidget(e) {

  const color = [ Color.black(), Color.red() ]
  const bgColor = Color.yellow()

  let w = new ListWidget()
  w.setPadding(10, 10, 10, 10)
  w.backgroundColor = bgColor

  addText(w, "WidgetFramework", Font.semiboldSystemFont(13), color[0], "left")
  w.addSpacer()
  addText(w, "Script Stopped", Font.boldSystemFont(18), color[0], "center")
  w.addSpacer(10)
  addText(w, e.message, Font.boldSystemFont(16), color[1], "center")
  if (e.stack) {
    w.addSpacer(6)
    addText(w, e.stack.slice(0, 120), Font.systemFont(10), color[1], "left")
  }
  w.addSpacer()
  addText(w, APP_INFO.storageType + " " + new Date().toLocaleTimeString(), Font.semiboldSystemFont(11), color[1], "right")

  if (config.runsInWidget) Script.setWidget(w)
  else w.presentLarge()

}

// =========================
// addText
// =========================
function addText(w, text, font, color, aling) {

  let t = w.addText(text)
  if (font) t.font = font
  if (color) t.textColor = color
  if (aling == "right") t.rightAlignText()
  else if (aling == "center") t.centerAlignText()

}
  
// =========================
// Module Test
// =========================
const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '');
if (module_name == Script.name()) {
  (async() => {
    await module.exports.start()
  })()
}