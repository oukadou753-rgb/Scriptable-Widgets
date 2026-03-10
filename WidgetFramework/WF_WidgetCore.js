// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetCore
 **/
const { loadModule } = importModule("ModuleLoader")

const WF_CoreBase = loadModule("WidgetFramework/WF_CoreBase")
const StorageEngine = loadModule("WidgetFramework/WF_StorageEngine")
const WidgetRenderer = loadModule("WidgetFramework/WF_WidgetRenderer")
const ProfileEngine = loadModule("WidgetFramework/WF_ProfileEngine")

module.exports = class WF_WidgetCore extends WF_CoreBase {

  constructor(appInfo, appConfig) {

    super(appInfo)

    const appId = appInfo.id
    const appVersion = appInfo.version

    this.appId = appId || Script.name()

    this.storage = new StorageEngine(this.appId)
    this.renderer = new WidgetRenderer(this.appId)

    this.appConfig = appConfig
    this.defaultConfig = appConfig.getDefaultConfig()
    this.profile = new ProfileEngine(this.storage, this.defaultConfig)

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
