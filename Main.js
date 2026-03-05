const APP_VERSION = "1.0.0"
const APP_DEV_MODE = false

const DEFAULT_APP_ID = "Weather"
const APP_ID = args.widgetParameter || DEFAULT_APP_ID

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
  await (new WF_WidgetCore([APP_ID, APP_VERSION], APP_CONFIG)).start()
} else {
  const WF_AppCore = importModule("WF_AppCore")
  await (new WF_AppCore([APP_ID, APP_VERSION], APP_CONFIG)).start()
}