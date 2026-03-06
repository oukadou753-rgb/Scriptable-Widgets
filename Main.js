// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;
const DEFAULT_APP_ID = "Weather"

const APP_DEV_MODE = false
const APP_ID = args.widgetParameter || DEFAULT_APP_ID
const APP_VERSION = "1.0.0"
const APP_INFO = {id: APP_ID, version: APP_VERSION}

function loadAppConfig(appId) {
  try {
    return importModule(`App_${appId}Config`)
  } catch (e) {
    console.error(`App config not found: ${appId}`)
    return importModule(`App_${DEFAULT_APP_ID}Config`)
  }
}

const APP_CONFIG = loadAppConfig(APP_ID)
if (APP_DEV_MODE || (config.runsInWidget && !config.runsInApp)) {
  const WF_WidgetCore = importModule("WF_WidgetCore")
  await (new WF_WidgetCore(APP_INFO, APP_CONFIG)).start()
} else {
  const WF_AppCore = importModule("WF_AppCore")
  await (new WF_AppCore(APP_INFO, APP_CONFIG)).start()
}