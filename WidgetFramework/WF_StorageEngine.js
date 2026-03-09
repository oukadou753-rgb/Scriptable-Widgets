// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_StorageEngine
 **/
const WF_DEV_MODE = true

module.exports = class WF_StorageEngine {

  constructor(appId) {

    this.appId = appId

    // 切り替え
    this.fm = WF_DEV_MODE
      ? FileManager.iCloud()
      : FileManager.local()

    // ルート（WF_Data固定）
    this.root = this.fm.joinPath(
      this.fm.documentsDirectory(),
      "WF_Data"
    )

    // app単位ディレクトリ
    this.appRoot = this.fm.joinPath(this.root, this.appId)

    // サブディレクトリ
    this.cacheRoot = this.fm.joinPath(this.appRoot, "cache")
    this.profileRoot = this.fm.joinPath(this.appRoot, "profiles")
    this.snapshotRoot = this.fm.joinPath(this.appRoot, "snapshots")

    // システムファイル
    this.activeFile = this.fm.joinPath(this.appRoot, "active.txt")
    this.profilesFile = this.fm.joinPath(this.appRoot, "profiles.json")

    this._ensureDirs()
  }

  // =========================
  // 初期ディレクトリ生成（完全修正版）
  // =========================
  _ensureDirs() {

    // WF_Data
    if (!this.fm.fileExists(this.root)) {
      this.fm.createDirectory(this.root)
    }

    // appRoot
    if (!this.fm.fileExists(this.appRoot)) {
      this.fm.createDirectory(this.appRoot)
    }

    // CacheRoot
    if (!this.fm.fileExists(this.cacheRoot)) {
      this.fm.createDirectory(this.cacheRoot)
    }

    // profiles
    if (!this.fm.fileExists(this.profileRoot)) {
      this.fm.createDirectory(this.profileRoot)
    }

    // snapshots
    if (!this.fm.fileExists(this.snapshotRoot)) {
      this.fm.createDirectory(this.snapshotRoot)
    }
  }

  // =========================
  // パス取得
  // =========================
  getActivePath() {
    return this.activeFile
  }

  getProfilesPath() {
    return this.profilesFile
  }

  getProfileDir(name) {

    if (!name) {
      console.warn("getProfileDir: name undefined")
      return null
    }

    return this.fm.joinPath(this.profileRoot, name)
  }

  getProfileConfigPath(name) {

    const dir = this.getProfileDir(name)

    if (!dir) return null

    if (!this.fm.fileExists(dir)) {
      this.fm.createDirectory(dir)
    }

    return this.fm.joinPath(dir, "config.json")
  }

  // =========================
  // 基本IO
  // =========================
  read(path) {

    try {

      if (!path) {
        console.warn("READ: path undefined")
        return null
      }

      if (!this.fm.fileExists(path)) return null

      const txt = this.fm.readString(path)

      if (!txt || txt.trim() === "") return null
      if (txt === "undefined") return null

      return txt

    } catch (e) {
      console.warn("READ ERROR: " + e)
      return null
    }
  }

  write(path, content) {

    try {

      if (!path) {
        console.warn("WRITE: path undefined")
        return
      }

      // ディレクトリ保証
      const dir = path.split("/").slice(0, -1).join("/")

      if (!this.fm.fileExists(dir)) {
        this.fm.createDirectory(dir, true)
      }

      // undefined 防止
      if (content === undefined) {
        console.warn("WRITE BLOCKED: undefined " + path)
        return
      }

      if (content === null) {
        content = "null"
      }

      if (typeof content === "object") {
        try {
          content = JSON.stringify(content)
        } catch (e) {
          console.warn("STRINGIFY ERROR: " + e)
          return
        }
      }

      const str = String(content)

      if (str === "undefined") {
        console.warn("WRITE BLOCKED: string undefined " + path)
        return
      }

      this.fm.writeString(path, str)

    } catch (e) {
      console.warn("WRITE ERROR: " + e)
    }
  }

  remove(path) {

    try {
      if (path && this.fm.fileExists(path)) {
        this.fm.remove(path)
      }
    } catch (e) {
      console.warn("REMOVE ERROR: " +  e)
    }
  }

  exists(path) {
    if (!path) return false
    return this.fm.fileExists(path)
  }

  // =========================
  // プロファイルリネーム
  // =========================
  renameProfile(oldName, newName) {

    const oldDir = this.getProfileDir(oldName)
    const newDir = this.getProfileDir(newName)

    if (!oldDir || !newDir) return

    if (!this.fm.fileExists(oldDir)) return
    if (this.fm.fileExists(newDir)) return

    this.fm.move(oldDir, newDir)
  }

  // =========================
  // Snapshot
  // =========================
  saveSnapshot(name, data) {

    if (!name) return
    if (!data) return

    const path = this.fm.joinPath(
      this.snapshotRoot,
      name + ".json"
    )

    try {

      const safeData = JSON.parse(JSON.stringify(data))

      if (safeData.layout !== undefined) {
        delete safeData.layout
      }

      this.write(
        path,
        JSON.stringify(safeData, null, 2)
      )

    } catch (e) {

      console.warn("SNAPSHOT SAVE ERROR: " + e)
      console.warn("DATA: " + data)

    }
  }

  listSnapshots() {

    if (!this.fm.fileExists(this.snapshotRoot)) return []

    return this.fm
      .listContents(this.snapshotRoot)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""))
  }

  loadSnapshot(name) {

    if (!name) return null

    const path = this.fm.joinPath(
      this.snapshotRoot,
      name + ".json"
    )

    const txt = this.read(path)

    if (!txt) return null

    try {
      return JSON.parse(txt)
    } catch {
      return null
    }
  }

  // =========================
  // Cache
  // =========================
  getCachePath(key) {
    return this.fm.joinPath(this.cacheRoot, key + ".json")
  }

  // =========================
  // JSON
  // =========================
  writeJSON(key, value) {
    const path = this.getCachePath(key)
    this.write(path, JSON.stringify(value))
  }
  
  readJSON(key) {
    const path = this.getCachePath(key)
    const data = this.read(path)
    if (!data) return null
  
    try {
      return JSON.parse(data)
    } catch (e) {
      console.warn("JSON parse error: " + e)
      return null
    }
  }
}
