// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_WidgetCore
 **/
const StorageEngine = importModule("WF_StorageEngine")
const WidgetRenderer = importModule("WF_WidgetRenderer")
const ProfileEngine = importModule("WF_ProfileEngine")
const DataProvider = importModule("WF_DataProvider")

module.exports = class WF_WidgetCore {

  constructor(appInfo, appConfig) {
    const appId = appInfo.id
    const appVersion = appInfo.version

    this.appId = appId || Script.name()

    this.storage = new StorageEngine(this.appId)
    this.renderer = new WidgetRenderer(appInfo)

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

  async preview(size) {

    const context = await this.buildContext({ size })

    const widget = await this.renderer.render(context)

    if (size === "small") await widget.presentSmall()
    else if (size === "medium") await widget.presentMedium()
    else if (size === "large") await widget.presentLarge()
    else {
      if (Device.isPad()) await widget.presentExtraLarge()
      else await widget.presentLarge()
    }

    return true
  }

  async buildContext({ size = null, cfg = null } = {}) {

    const configData = cfg ?? this.profile.getConfig()

    configData.layout = this.appConfig.getLayout(configData.values.layoutId)

    const finalSize =
      size ??
      (config.runsInWidget && !config.runsInApp
        ? config.widgetFamily
        : "medium")

    const { data, location } = configData.values.useTestData
      ? this.appConfig.getTestData()
      : await new DataProvider(
        this.appId,
        this.storage,
        {
          ...this.appConfig,
          config: configData
        }
      ).fetchAll(this.appConfig.api)

    const transformContext = {
      config: configData,
      values: configData.values,
      location,
      size: finalSize
    }

    const finalData = this.appConfig.transform
      ? this.appConfig.transform(data, transformContext)
      : data

    return {
      appId: this.appId,
      size: finalSize,
      version: this.version,
      profile: this.profile.getActive(),
      config: configData,
      data: finalData,
      location
    }
  }
}
