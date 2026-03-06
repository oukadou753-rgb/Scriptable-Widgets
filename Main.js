// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: download;
/**
 * Main
 **/
const DEFAULT_APP_ID = "Weather"

const APP_DEV_MODE = false
const APP_ID = args.widgetParameter || DEFAULT_APP_ID
const APP_VERSION = "1.0.0"
const APP_INFO = {id: APP_ID, version: APP_VERSION}

const Main = {

  loadAppConfig(appId) {
    try {
      return importModule(`WidgetFramework/App_${appId}Config`)
    } catch (e) {
      console.error(`App config not found: ${appId}`)
      return importModule(`App_${DEFAULT_APP_ID}Config`)
    }
  },

  async start(APP_CONFIG) {
    if (APP_DEV_MODE || (config.runsInWidget && !config.runsInApp)) {
      const WF_WidgetCore = importModule("WidgetFramework/WF_WidgetCore")
      await (new WF_WidgetCore(APP_INFO, APP_CONFIG)).start();
    } else {
      const WF_AppCore = importModule("WidgetFramework/WF_AppCore");
      (async() => {
        await (new WF_AppCore(APP_INFO, APP_CONFIG)).start()
      })()
    }
  },

  async run() {
    const APP_CONFIG = Main.loadAppConfig(APP_ID);
    (async() => {
      await Main.start(APP_CONFIG)
    })()
  }
}
module.exports = Main;

const module_name = module.filename.match(/[^\/]+$/ )[ 0 ].replace('.js', '');
if (module_name == Script.name()) {
  (async() => {
    await Main.run()
  })()
}