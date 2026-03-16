// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetCore
 * UTF-8 日本語コメント
 **/
module.exports = class WF_WidgetCore {

  constructor(appInfo, appConfig, moduleCache) {

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
    this.version = appVersion || "3.0.0"

    this.storage = new WF_StorageEngine(this.appId, this.storageType)
    this.renderer = new WF_WidgetRenderer(this.appId, this.storageType)

    this.appConfig = appConfig
    this.defaultConfig = appConfig.getDefaultConfig()
    this.profile = new WF_ProfileEngine(this.storage, this.defaultConfig)

    const core = new WF_CoreBase(appInfo, appConfig, moduleCache)
    WF_CoreBase.mixinCore(this, core)
  }

  async start() {

    // Framework update check
    const update = await this.checkFrameworkUpdate()

    if (update?.update) {

      console.log(
        "Framework Update Available\n" +
        "Local: " + update.local + "\n" +
        "Remote: " + update.remote
      )

    }

    if (config.runsInWidget && !config.runsInApp) {
      const context = await this.buildContext()
      const widget = await this.renderer.render(context)
      Script.setWidget(widget)
      Script.complete()
      return
    }

    await this.preview("large")
  }
}