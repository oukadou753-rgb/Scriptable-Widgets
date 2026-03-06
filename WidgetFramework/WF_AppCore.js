// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_AppCore
 **/
const StorageEngine = importModule("WidgetFramework/WF_StorageEngine")
const WidgetRenderer = importModule("WidgetFramework/WF_WidgetRenderer")
const MenuEngine = importModule("WidgetFramework/WF_MenuEngine")
const ProfileEngine = importModule("WidgetFramework/WF_ProfileEngine")
const WF_ConfigUI = importModule("WidgetFramework/WF_ConfigUI")
const DataProvider = importModule("WidgetFramework/WF_DataProvider")

module.exports = class WF_AppCore {

  constructor(appInfo, appConfig) {
    const appId = appInfo.id
    const appVersion = appInfo.version

    this.appId = appId || Script.name()

    this.storage = new StorageEngine(this.appId)
    this.renderer = new WidgetRenderer()
    this.menu = new MenuEngine()
    this.configUI = WF_ConfigUI

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
    this.setupMenus()

    while (true) {
      const exit = await this.menu.start("Main")
      if (exit) break
    }
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

  setupMenus() {

    this.menu.register(
      "Main",
      [
        { label: "Preview", next: "Preview" },
        { label: "Config Manage", next: "Config" },
        { label: "Snapshot Manage", next: "Snapshot" },
        { label: "Profile Manage", action: () => this.manageProfiles() },
        { label: "About", action: () => this.showAbout() }
      ],
      { title: "Main Menu" }
    )

    this.menu.register(
      "Config",
      [
        { label: "Edit", action: () => this.editConfig() },
        { label: "Reset", action: () => this.resetConfig() },
      ],
      { title: "Config" }
    )

    this.menu.register(
      "Preview",
      [
        { label: "Small", action: () => this.preview("small") },
        { label: "Medium", action: () => this.preview("medium") },
        { label: "Large", action: () => this.preview("large") },
        { label: "ExtraLarge", action: () => this.preview("extraLarge") }
      ],
      { title: "Preview" }
    )

    this.menu.register(
      "Snapshot",
      [
        { label: "Save", action: () => this.saveSnapshotUI() },
        { label: "Load", action: () => this.loadSnapshotUI() },
        { label: "Delete", action: () => this.deleteSnapshotUI() },
        { label: "Preview Diff", action: () => this.previewSnapshotDiffUI() }
      ],
      { title: "Snapshot" }
    )
  }

  async editConfig() {
    try {
      const active = this.profile.getActive()
      const cfg = this.profile.getConfig()

      const newValues = await this.configUI.present(
        {...cfg},
        this.profile,
        active
      )

      return true

    } catch (e) {
      log(e.message)
      const table = new UITable()
      const row = new UITableRow()

      row.addText("Error (tap to view)")
      row.onSelect = () => {
        const a = new Alert()
        a.title = "Error"
        a.message = String(e)
        a.addAction("OK")
        a.present()
      }

      table.addRow(row)
      await table.present()

      return true
    }
  }

  // =========================
  // Snapshot系（layout除外完全版）
  // =========================
  async saveSnapshotUI() {
    const active = this.profile.getActive()
    let current = this.profile.getConfig(active)

    // layout をコピーから除外
    const currentCopy = JSON.parse(JSON.stringify(current))
    delete currentCopy.layout

    const baseCopy = JSON.parse(JSON.stringify(this.defaultConfig))
    delete baseCopy.layout

    const diff = this.createDiff(baseCopy, currentCopy)

    const a = new Alert()
    a.title = "Save Snapshot"
    a.addTextField("name")
    a.addAction("Save")
    a.addCancelAction("Cancel")

    if (await a.present() !== 0) return
    const name = a.textFieldValue(0)
    if (!name) return

    this.storage.saveSnapshot(name, {
      profile: active,
      diff,
      date: new Date().toISOString()
    })
  }

  async loadSnapshotUI() {
    const list = this.storage.listSnapshots()
    if (list.length === 0) return

    const a = new Alert()
    a.title = "Load Snapshot"
    list.forEach(n => a.addAction(n))
    a.addCancelAction("Cancel")

    const r = await a.present()
    if (r === -1) return

    const data = this.storage.loadSnapshot(list[r])
    if (!data) return

    const base = JSON.parse(JSON.stringify(this.defaultConfig))
    delete base.layout

    const merged = this.applyDiff(base, data.diff)

    this.profile.saveConfig(data.profile, merged)
  }

  async previewSnapshotDiffUI() {
    const list = this.storage.listSnapshots()
    if (list.length === 0) return

    const a = new Alert()
    a.title = "Preview Diff"
    list.forEach(n => a.addAction(n))
    a.addCancelAction("Cancel")

    const r = await a.present()
    if (r === -1) return

    const snapshot = this.storage.loadSnapshot(list[r])
    if (!snapshot) return

    const current = this.profile.getConfig()
    await this.previewSnapshotDiff(current, snapshot)
  }

  async previewSnapshotDiff(current, snapshot) {
    if (!snapshot || !snapshot.diff || !current) return

    let cur, d
    try { cur = JSON.parse(JSON.stringify(current)) } catch { cur = {} }
    try { d = JSON.parse(JSON.stringify(snapshot.diff)) } catch { d = {} }

    // layout 完全除外
    delete cur.layout
    delete d.layout

    const changes = []
    for (const key in d) {
      if (key.startsWith("layout")) continue

      let before = this.getByPath(cur, key)
      let after = d[key]

      // 生値比較で差分
      if (JSON.stringify(before) === JSON.stringify(after)) continue

      // 表示用整形
      if (before === undefined) before = "undefined"
      if (after === undefined) after = "undefined"

      if (typeof before === "object") {
        try { before = JSON.stringify(before) } catch { before = "[object]" }
      }
      if (typeof after === "object") {
        try { after = JSON.stringify(after) } catch { after = "[object]" }
      }

      const label = key.replace(/^values\./, "")
      changes.push(label + ": " + before + " → " + after)
    }

    const a = new Alert()
    a.title = "Snapshot Diff"
    a.message = changes.length ? changes.join("\n") : "変更はありません"
    a.addAction("OK")

    await a.present()
  }

  async deleteSnapshotUI() {
    const list = this.storage.listSnapshots()
    if (list.length === 0) return true

    const a = new Alert()
    a.title = "Delete Snapshot"
    list.forEach(n => a.addAction(n))
    a.addCancelAction("Cancel")

    const r = await a.present()
    if (r === -1) return true

    const path = this.storage.fm.joinPath(
      this.storage.snapshotRoot,
      list[r] + ".json"
    )

    this.storage.remove(path)

    return true
  }

  async previewSnapshotDiff(current, snapshot) {

    if (!snapshot || !snapshot.diff || !current) return

    let cur = JSON.parse(JSON.stringify(current))
    let d = JSON.parse(JSON.stringify(snapshot.diff))

    delete cur.layout
    delete d.layout

    const changes = []

    for (const key in d) {

      if (key.startsWith("layout")) continue

      let before = this.getByPath(cur, key)
      let after = d[key]

      if (before === undefined) before = "undefined"
      if (after === undefined) after = "undefined"

      if (typeof before === "object") before = JSON.stringify(before)
      if (typeof after === "object") after = JSON.stringify(after)

      if (before === after) continue

      const label = key.replace(/^values\./, "")

      changes.push(label + ": " + before + " → " + after)
    }

    const a = new Alert()
    a.title = "Snapshot Diff"
    a.message = changes.length ? changes.join("\n") : "変更はありません"
    a.addAction("OK")

    await a.present()
  }

  createDiff(base, current, path = "") {
    let diff = {}

    const keys = new Set([
      ...Object.keys(base || {}),
      ...Object.keys(current || {})
    ])

    for (const key of keys) {
      const p = path ? path + "." + key : key
      const b = base ? base[key] : undefined
      const c = current ? current[key] : undefined

      if (this.isObject(b) && this.isObject(c)) {
        Object.assign(diff, this.createDiff(b, c, p))
      } else {
        if (JSON.stringify(b) !== JSON.stringify(c)) {
          diff[p] = c
        }
      }
    }

    return diff
  }

  applyDiff(target, diff) {
    Object.keys(diff).forEach(path => {
      const keys = path.split(".")
      let obj = target

      keys.slice(0, -1).forEach(k => {
        if (!obj[k] || typeof obj[k] !== "object") {
          obj[k] = {}
        }
        obj = obj[k]
      })

      obj[keys[keys.length - 1]] = diff[path]
    })

    return target
  }

  isObject(v) {
    return v && typeof v === "object" && !Array.isArray(v)
  }

  getByPath(obj, path) {
    return path.split(".").reduce((o, k) => o?.[k], obj)
  }

  deepClone(obj) {
    if (obj === undefined) {
      throw new Error("deepClone: undefined detected")
    }
    return JSON.parse(JSON.stringify(obj))
  }

  async manageProfiles() {
    const a = new Alert()
    a.title = "Manage Profiles"

    a.addAction("Create")
    a.addAction("Duplicate")
    a.addAction("Rename")
    a.addAction("Delete")
    a.addCancelAction("Close")

    const r = await a.present()

    if (r === 0) return this.createProfile()
    if (r === 1) return this.duplicateProfile()
    if (r === 2) return this.renameProfile()
    if (r === 3) return this.deleteProfile()

    return true
  }

  async createProfile() {
    const a = new Alert()
    a.title = "Create Profile"
    a.addTextField("name")
    a.addAction("Create")
    a.addCancelAction("Cancel")

    if (await a.present() === 0) {
      const name = a.textFieldValue(0)
      if (name) this.profile.create(name)
    }

    return true
  }

  async duplicateProfile() {
    const src = this.profile.getActive()

    const a = new Alert()
    a.title = "Duplicate Profile"
    a.addTextField("name")
    a.addAction("Duplicate")
    a.addCancelAction("Cancel")

    if (await a.present() === 0) {
      const name = a.textFieldValue(0)
      if (name) this.profile.duplicate(src, name)
    }

    return true
  }

  async renameProfile() {
    const list = this.profile.list()

    const a = new Alert()
    a.title = "Rename Profile"
    list.forEach(p => a.addAction(p))
    a.addCancelAction("Cancel")

    const r = await a.present()
    if (r === -1) return true

    const oldName = list[r]

    const input = new Alert()
    input.title = "Rename Profile"
    input.addTextField("new name", oldName)
    input.addAction("Rename")

    if (await input.present() === 0) {
      this.profile.rename(oldName, input.textFieldValue(0))
    }

    return true
  }

  async deleteProfile() {
    const list = this.profile.list()

    const a = new Alert()
    a.title = "Delete Profile"
    list.forEach(p => a.addAction(p))
    a.addCancelAction("Cancel")

    const r = await a.present()
    if (r !== -1) this.profile.delete(list[r])

    return true
  }

  async resetConfig() {
    const profile = this.profile.getActive()

    const a = new Alert()
    a.title = "Reset Config"
    a.message = `Reset ${profile}?`

    a.addDestructiveAction("Reset")
    a.addCancelAction("Cancel")

    if (await a.present() === 0) {
      this.profile.reset(profile)
    }

    return true
  }

  async showAbout() {
    const a = new Alert()
    a.title = "Framework v" + this.version.fw
    a.message =
      "AppId: " + this.appId + "\n" +
      "AppVersion: " + this.version.app + "\n" +
      "CfgVersion: " + this.version.cfg + "\n\n" +
      "Profile: " + this.profile.getActive()

    a.addAction("OK")
    await a.present()

    return true
  }
}
