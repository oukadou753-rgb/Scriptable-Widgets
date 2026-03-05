module.exports = class WF_ProfileEngine {

  constructor(storage, defaultConfig) {

    this.storage = storage
    this.defaultConfig = defaultConfig

    // 初期セットアップ
    this.ensureSystem()
  }

  // =========================
  // システム初期化
  // =========================
  ensureSystem() {

    // アクティブプロファイル未設定なら default
    if (!this.storage.read(this.storage.getActivePath())) {
      this.storage.write(this.storage.getActivePath(), "default")
    }

    // プロファイル一覧未作成なら defaultのみ
    if (!this.storage.read(this.storage.getProfilesPath())) {
      this.storage.write(
        this.storage.getProfilesPath(),
        JSON.stringify(["default"])
      )
    }

    // defaultプロファイルのconfig生成
    this.ensureConfig("default")
  }

  // =========================
  // config存在保証
  // =========================
  ensureConfig(profile) {

    const path = this.storage.getProfileConfigPath(profile)
    const raw = this.storage.read(path)

    if (raw) {
      try {
        JSON.parse(raw)
        return
      } catch {
        log("Config corrupted → recreating")
      }
    }

    const cfg = this.deepClone(this.defaultConfig)

    cfg.values = {}
  
    // 通常値
    Object.keys(cfg.schema).forEach(key => {
      cfg.values[key] = cfg.schema[key].default
    })

    const openSections = this.defaultConfig.defaultOpenSections || []

    const sectionSet = new Set()

    Object.keys(cfg.schema).forEach(key => {
      const sec = cfg.schema[key].section || "General"
      sectionSet.add(sec)
    })

    sectionSet.forEach(sec => {
      const sectionKey = `section_${sec}`
      cfg.values[sectionKey] = openSections.includes(sec)
    })

    this.storage.write(path, JSON.stringify(cfg))
  }

  // =========================
  // プロファイル一覧
  // =========================
  list() {
    return JSON.parse(
      this.storage.read(this.storage.getProfilesPath())
    )
  }

  // =========================
  // アクティブ取得
  // =========================
  getActive() {
    return this.storage.read(this.storage.getActivePath())
  }

  // =========================
  // アクティブ変更
  // =========================
  setActive(name) {
    this.storage.write(this.storage.getActivePath(), name)
  }

  // =========================
  // MigrateValues（自動補完）
  // =========================
  migrateValues(values, schema) {

    const newValues = { ...values }
    const sectionSet = new Set()

    // schemaベースで再構築
    for (const key in schema) {

      const def = schema[key]

      if (!(key in newValues)) {
        newValues[key] = def.default ?? null
      }

      const sec = def.section || "General"
      sectionSet.add(sec)
    }

    // section
    const openSections = this.defaultConfig.defaultOpenSections || []

    sectionSet.forEach(sec => {

      const sectionKey = `section_${sec}`

      if (!(sectionKey in newValues)) {
        newValues[sectionKey] = openSections.includes(sec)
      }

    })

    // 削除
    Object.keys(newValues).forEach(key => {

      // 通常キー削除
      if (!key.startsWith("section_") && !(key in schema)) {
        delete newValues[key]
        return
      }

      // sectionキー削除
      if (key.startsWith("section_")) {

        const sec = key.replace("section_", "")

        if (!sectionSet.has(sec)) {
          delete newValues[key]
        }

      }

    })

    return newValues
  }

  // =========================
  // Config取得（正規化込み）
  // =========================
  getConfig() {

    const profile = this.getActive()

    this.ensureConfig(profile)

    const path = this.storage.getProfileConfigPath(profile)

    let raw = this.storage.read(path)
    let cfg = this.safeParse(raw, null)

    this.version = this.defaultConfig.version

    // 壊れてた場合は再生成
    if (!cfg || typeof cfg !== "object") {

      log("Config broken → rebuilding")

      const fresh = this.deepClone(this.defaultConfig)

      fresh.values = {}
      Object.keys(fresh.schema).forEach(key => {
        fresh.values[key] = fresh.schema[key].default
      })

      this.saveConfig(profile, fresh)
      return fresh
    }

    // schema更新
    cfg.schema = this.defaultConfig.schema

    // layout補完
    if (!cfg.layout) {
      cfg.layout = this.deepClone(this.defaultConfig.layout || {})
    }

    // api補完
    if (!cfg.api) {
      cfg.api = this.deepClone(this.defaultConfig.api || {})
    }

    // styles補完
    if (!cfg.styles) {
      cfg.styles = this.deepClone(this.defaultConfig.styles || {})
    }

    // migrate（超重要）
    cfg.values = this.migrateValues(
      cfg.values || {},
      cfg.schema
    )

    // values正規化
    cfg = this.normalizeConfig(cfg)

    this.saveConfig(profile, cfg)

    return cfg
  }

  // =========================
  // 保存
  // =========================
  saveConfig(profile, cfg) {
    const sanitized = {
      version: this.defaultConfig.version,
      values: cfg.values,
      defaultOpenSections: cfg.defaultOpenSections,
//       schema: cfg.schema // schema は必須なら残す
    }

    this.storage.write(
      this.storage.getProfileConfigPath(profile),
      JSON.stringify(sanitized)
    );
  }

  // =========================
  // 完全リセット
  // =========================
  reset(profile) {

    if (!profile) return

    const cfg = this.deepClone(this.defaultConfig)

    // schema → values再生成
    cfg.values = {}
    Object.keys(cfg.schema).forEach(key => {
      cfg.values[key] = cfg.schema[key].default
    })

    this.saveConfig(profile, cfg)
  }

  // =========================
  // 作成
  // =========================
  create(name) {

    if (!name || !name.trim()) return

    const list = this.list()

    if (list.includes(name)) return

    list.push(name)

    this.storage.write(
      this.storage.getProfilesPath(),
      JSON.stringify(list)
    )

    this.ensureConfig(name)
  }

  // =========================
  // 削除
  // =========================
  delete(name) {

    if (name === "default") return

    let list = this.list()

    list = list.filter(p => p !== name)

    this.storage.write(
      this.storage.getProfilesPath(),
      JSON.stringify(list)
    )

    const dir = this.storage.getProfileDir(name)

    this.storage.remove(dir)

    if (this.getActive() === name) {
      this.setActive("default")
    }
  }

  // =========================
  // 複製
  // =========================
  duplicate(from, to) {

    if (!to || !to.trim()) return

    const list = this.list()

    if (list.includes(to)) return

    const srcDir = this.storage.getProfileDir(from)
    const dstDir = this.storage.getProfileDir(to)

    if (!this.storage.exists(srcDir)) return

    this.copyDir(srcDir, dstDir)

    list.push(to)

    this.storage.write(
      this.storage.getProfilesPath(),
      JSON.stringify(list)
    )
  }

  // =========================
  // ディレクトリコピー
  // =========================
  copyDir(src, dst) {

    const fm = this.storage.fm

    if (!fm.fileExists(dst)) {
      fm.createDirectory(dst)
    }

    const items = fm.listContents(src)

    for (const name of items) {

      const s = fm.joinPath(src, name)
      const d = fm.joinPath(dst, name)

      if (fm.isDirectory(s)) {
        this.copyDir(s, d)
      } else {
        fm.writeString(d, fm.readString(s))
      }
    }
  }

  // =========================
  // リネーム
  // =========================
  rename(oldName, newName) {

    if (!newName || !newName.trim()) return
    if (oldName === newName) return

    if (oldName === "default") return

    const list = this.list()

    if (list.includes(newName)) return

    this.storage.renameProfile(oldName, newName)

    const newList = list.map(p =>
      p === oldName ? newName : p
    )

    this.storage.write(
      this.storage.getProfilesPath(),
      JSON.stringify(newList)
    )

    if (this.getActive() === oldName) {
      this.setActive(newName)
    }
  }

  // =========================
  // values正規化
  // =========================
  normalizeConfig(cfg) {

    const schema = cfg.schema || {}
    const values = cfg.values || {}

    const newValues = { ...values }

    Object.keys(schema).forEach(key => {

      const def = schema[key]
      let val = values[key]

      if (val === undefined) {
        val = def.default
      }

      switch (def.type) {

        case "number":
          val = Number(val)
          if (isNaN(val)) val = def.default
          break

        case "bool":
        case "boolean":
          val = val === true || val === "true"
          break

        case "color":
          val = String(val || def.default || "#ffffff")
          break

        case "text":
        default:
          val = String(val ?? def.default ?? "")
          break
      }

      newValues[key] = val
    })

    cfg.values = newValues

    return cfg
  }

  // =========================
  // Deep Clone（完全安全版）
  // =========================
  deepClone(obj) {

    // -------------------------
    // null / undefined 防御
    // -------------------------
    if (obj === undefined || obj === null) {
      log("deepClone: invalid input")
      return {}
    }

    try {

      // -------------------------
      // JSON安全化
      // ・undefined除去
      // ・function除去
      // ・循環参照除去
      // -------------------------
      const safe = this.toSafeJSON(obj)

      // -------------------------
      // ディープコピー
      // -------------------------
      return JSON.parse(JSON.stringify(safe))

    } catch (e) {

      log("deepClone error")
      log(e)
      log(obj)

      return {}
    }
  }

  // =========================
  // JSON安全化
  // =========================
  toSafeJSON(obj, seen = new WeakSet()) {

    // -------------------------
    // primitive処理
    // -------------------------
    if (obj === null || typeof obj !== "object") {

      // undefinedはJSON化できないのでnullへ
      if (obj === undefined) return null

      // functionも除外
      if (typeof obj === "function") return null

      return obj
    }

    // -------------------------
    // 循環参照防止
    // -------------------------
    if (seen.has(obj)) {
      return null
    }
    seen.add(obj)

    // -------------------------
    // 配列
    // -------------------------
    if (Array.isArray(obj)) {
      return obj.map(v => this.toSafeJSON(v, seen))
    }

    // -------------------------
    // オブジェクト
    // -------------------------
    const result = {}

    for (const key in obj) {

      const value = obj[key]

      // undefinedは完全除去
      if (value === undefined) continue

      // functionも除去
      if (typeof value === "function") continue

      result[key] = this.toSafeJSON(value, seen)
    }

    return result
  }

  safeParse(txt, fallback = {}) {

    if (!txt) return fallback

    try {
      return JSON.parse(txt)
    } catch (e) {
      log("JSON parse failed, fallback used")
      return fallback
    }
  }
}