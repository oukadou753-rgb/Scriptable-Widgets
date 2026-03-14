// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
/**
 * WF_CoreBase
 * UTF-8 日本語コメント
 **/
module.exports = class WF_CoreBase {

  constructor(appInfo, appConfig, moduleCache) {
    const appId = appInfo.id
    const appVersion = appInfo.version

    const {
      ModuleLoader,
      moduleLoader,

      WF_DataProvider,
    } = moduleCache

    this.appId = appId || Script.name()
    this.storageType = appInfo.storageType || "local"
    this.frameworkRepo = appInfo.frameworkRepo

    this.WF_DataProvider = WF_DataProvider
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
      : await new this.WF_DataProvider(
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

  getVersionURL() {

    return `https://raw.githubusercontent.com/${this.frameworkRepo}/main/version.json?t=${Date.now()}`
  }

  async checkFrameworkUpdate() {

    try {

      const req = new Request(this.getVersionURL())
      const remote = await req.loadJSON()

      const remoteVersion = remote.framework

      if (remoteVersion !== this.version) {

        return {
          update: true,
          remote: remoteVersion,
          local: this.version
        }

      }

    } catch(e) {
      console.log("Version check failed")
    }

    return null
  }

}

function mixinCore(target, core) {

  const proto = Object.getPrototypeOf(core)

  Object.getOwnPropertyNames(proto)
    .filter(k => k !== "constructor")
    .forEach(k => {
      target[k] = proto[k].bind(target)
    })

  Object.assign(target, core)

}

module.exports.mixinCore = mixinCore