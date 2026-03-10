// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
/**
 * WF_CoreBase
 **/
const DataProvider = importModule("WidgetFramework/WF_DataProvider")

module.exports = class WF_CoreBase {

  constructor(appInfo) {
    this.appId = appInfo.id || Script.name()
    this.storageType = appInfo.storageType
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

    configData.values.isOnline = await this.checkOnline()
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

  async checkOnline() {
    try {
      const req = new Request("https://www.apple.com")
      req.timeoutInterval = 2
      await req.load()
      return true
    } catch(e) {
      return false
    }
  }
}