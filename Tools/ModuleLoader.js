// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
/**
 * ModuleLoader
 * UTF-8 日本語コメント
 **/
class ModuleLoader {

  constructor(storageType = "local") {

    this.storageType = storageType
    this.cache = {}

    this.initStorage()

    console.log("MODULE LOADER" + "\n")
    console.log("STORAGE: " + this.storageType)
    console.log("BASE: " + this.baseDir + "\n")
  }

  // =========================
  // load module
  // =========================
  load(path) {

    if (this.cache[path]) {
      return this.cache[path]
    }

    const fullPath = this.getFilePath(path)

    const module = importModule(fullPath)

    this.cache[fullPath] = module

    console.log("IMPORT: " + path)

    return module
  }

  // =========================
  // resolve path
  // =========================
  getFilePath(path) {

    const file = path.endsWith(".js") ? path : path + ".js"

    const fullPath = this.fm.joinPath(this.baseDir, file)

    if (!this.fm.fileExists(fullPath)) {
      throw new Error("Module not found:\n" + fullPath)
    }

    // iCloud auto download
    if (this.storageType === "icloud") {
      if (!this.fm.isFileDownloaded(fullPath)) {
        this.fm.downloadFileFromiCloud(fullPath)
      }
    }

    return fullPath
  }

  // =========================
  // initStorage
  // =========================
  initStorage(){

    switch (this.storageType) {

      case "icloud":
        this.fm = FileManager.iCloud()
        this.baseDir = this.fm.documentsDirectory()
        break

      case "bookmark":
        this.fm = FileManager.local()
        this.baseDir = this.fm.bookmarkedPath("Scriptable")
        break

      default:
        this.fm = FileManager.local()
        this.baseDir = this.fm.documentsDirectory()

    }

    this._ensureDirs()
  }
  
  // =========================
  // _ensureDirs
  // =========================
  _ensureDirs() {

  }

  // =========================
  // static shortcut
  // =========================
  static import(path, storageType = "local") {

    const loader = new ModuleLoader(storageType)

    return loader.load(path)
  }

}

module.exports = ModuleLoader