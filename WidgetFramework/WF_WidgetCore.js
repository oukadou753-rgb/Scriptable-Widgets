// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetCore
 **/
const WF_CoreBase = importModule("WidgetFramework/WF_CoreBase")

module.exports = class WF_WidgetCore extends WF_CoreBase {

  constructor(appInfo, appConfig, moduleCache) {

    super(appInfo, appConfig, moduleCache)

    const appId = appInfo.id
    const appVersion = appInfo.version

    const {
      ModuleLoader,
      moduleLoader,

      WF_StorageEngine,
      WF_WidgetRenderer,
      WF_ProfileEngine,
      WF_DataProvider,
      WF_CoreBase,
      WF_WidgetCore
    } = moduleCache

    this.appId = appId || Script.name()
    this.storageType = appInfo.storageType || "local"

    this.storage = new WF_StorageEngine(this.appId, this.storageType)
    this.renderer = new WF_WidgetRenderer(this.appId, this.storageType)

    this.appConfig = appConfig
    this.defaultConfig = appConfig.getDefaultConfig()
    this.profile = new WF_ProfileEngine(this.storage, this.defaultConfig)

    this.version = {
      app: appVersion,
      cfg: this.defaultConfig.version,
      fw: "3.0.0"
    }
  }

  async start() {

    if (config.runsInWidget && !config.runsInApp) {
      const context = await this.buildContext()
      const widget = await this.renderer.render(context)
      Script.setWidget(widget)
      Script.complete()
      return
    }

    await this.preview("extraLarge")
  }
}