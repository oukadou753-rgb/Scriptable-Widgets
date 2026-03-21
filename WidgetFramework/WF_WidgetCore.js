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
      WF_NotificationManager,
      WF_CoreBase
    } = moduleCache

    this.appId = appId || Script.name()
    this.storageType = appInfo.storageType || "local"
    this.version = appVersion || "3.0.0"

    this.storage = new WF_StorageEngine(this.appId, this.storageType)
    this.renderer = new WF_WidgetRenderer(this.appId, this.storageType)

    this.appConfig = appConfig
    this.defaultConfig = appConfig.getDefaultConfig()
    this.profile = new WF_ProfileEngine(this.storage, this.defaultConfig)
    this.notification = new WF_NotificationManager(this.appId, this.storage)

    const core = new WF_CoreBase(appInfo, appConfig, moduleCache)
    WF_CoreBase.mixinCore(this, core)
  }

  async start() {
/*
    // Framework update check
    const update = await this.checkFrameworkUpdate()

    if (update?.update) {

      console.log(
        "Framework Update Available\n" +
        "Local: " + update.local + "\n" +
        "Remote: " + update.remote
      )

    }
*/

    if (config.runsInWidget && !config.runsInApp) {
      const widget = await this.run()
      Script.setWidget(widget)
      Script.complete()
      return
    }

    await this.preview("large")
  }
}