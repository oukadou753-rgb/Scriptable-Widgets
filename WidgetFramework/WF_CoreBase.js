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

    this.appId = appId
    this.storageType = appInfo.storageType
    this.frameworkRepo = appInfo.frameworkRepo

    this.WF_DataProvider = WF_DataProvider
  }

  async run({ size = null } = {}) {

    const context = await this.buildContext({ size })

    await this.handleNotifications(context)

    return await this.renderer.render(context)
  }

  async preview(size) {

    const widget = await this.run({ size })

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
      appId: this.appId,
      config: configData,
      values: configData.values,
      location,
      size: finalSize
    }

    const finalData = this.appConfig.transform
      ? this.appConfig.transform(data, transformContext)
      : data

    await this.handleNotifications(finalData)

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

  async handleNotifications(data) {

    if (!this.notification) return

    const list = data?.notifications
    if (!Array.isArray(list) || list.length === 0) return

    for (const n of list) {

      try {

        // =========================
        // ① 予約通知
        // =========================
        if (n.scheduleAt) {

          await this.notification.schedule(
            n.id,
            new Date(n.scheduleAt),
            n
          )

          continue
        }

        // =========================
        // ② ディレイ通知（即時を安定させる）
        // =========================
        if (n.delay) {

          await this.notification.schedule(
            n.id,
            new Date(Date.now() + n.delay),
            n
          )

          continue
        }

        // =========================
        // ③ 条件通知（notifyOnce）
        // =========================
        if (n.when) {

          await this.notification.notifyOnce(
            n.id,
            n,
            n.cooldown
          )

          continue
        }

      } catch (e) {
        console.log("Notification error: " + e)
      }
    }
  }

  async handleNotificationTap() {

    const notif = args.notification
    const query = args.queryParameters

    // 通常起動
    if (!notif && !query) return false

    // 統合
    const info = {
      ...(notif?.userInfo || {}),
      ...(query || {})
    }

    // =========================
    // 共通処理
    // =========================

    // URL
    if (info.url) {
      Safari.open(info.url)
      return true
    }

    // アプリ側フック
    if (this.appConfig.onNotificationTap) {
      return await this.appConfig.onNotificationTap(info, this)
    }

    return false
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