// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: download;
/**
 * DevLoader
 * UTF-8 日本語コメント
 * 2026/03/10
 **/
let storageType = "icloud"
storageType = "local"
// storageType = "bookmark"
// "icloud"
// "local"
// "bookmark"

const loadMain = true

const useDiff = true
const useTarget = true
const targetFiles = [
//   "Main.js",
//   "Tools/DevLoader.js",
//   "Tools/ModuleLoader.js",
//   "WidgetFramework/App_WeatherConfig.js",
//   "WidgetFramework/WF_AppCore.js",
//   "WidgetFramework/WF_ConfigUI.js",
//   "WidgetFramework/WF_CoreBase.js",
//   "WidgetFramework/WF_DataProvider.js",
//   "WidgetFramework/WF_MenuEngine.js",
//   "WidgetFramework/WF_ProfileEngine.js",
//   "WidgetFramework/WF_StorageEngine.js",
//   "WidgetFramework/WF_NotificationManager.js",
//   "WidgetFramework/WF_WidgetCore.js",
//   "WidgetFramework/WF_WidgetRenderer.js"
]
const targetFolders = [
  "WidgetFramework",
//   "Tools"
]

/**
 * useDiff: true=差分取得, false=無条件取得
 * useTarget: true=指定ファイル/フォルダを対象にする
 * targetFiles: 個別ファイル指定（GitHub 相対パス）
 * targetFolders: フォルダ単位指定（例: ["WidgetFramework"]）
 **/
async function devLoader({
  useDiff = true,
  useTarget = false,
  useiCloud = true,
  useBookmark = false,
  targetFiles = null,
  targetFolders = null
} = {}) {

  const user = "oukadou753-rgb"
  const repo = "Scriptable-Widgets"
  const branch = "main"

  let fm
  let baseDir

  switch (storageType) {

    case "icloud":
      fm = FileManager.iCloud()
      baseDir = fm.documentsDirectory()
      break

    case "bookmark":
      fm = FileManager.local()
      baseDir = fm.bookmarkedPath("Scriptable")
      break

    default:
      fm = FileManager.local()
      baseDir = fm.documentsDirectory()

  }
  console.warn("USING: " + storageType)

  // --- SHA 管理用 ---
  const githubDir = fm.joinPath(baseDir, "WidgetFramework")
  if (!fm.fileExists(githubDir)) fm.createDirectory(githubDir)

  const shaFilePath = fm.joinPath(githubDir, "github_sha.json")

  let localSHA = {}
  if (fm.fileExists(shaFilePath)) {
    try { localSHA = JSON.parse(fm.readString(shaFilePath)) } catch(e) { localSHA = {} }
  }

  // --- GitHub 全ファイル取得（再帰的） ---
  const treeCacheFile = fm.joinPath(githubDir, "github_tree_cache.json")
  const cacheLife = 600 // 10分

  let tree

  if (fm.fileExists(treeCacheFile)) {

    const cache = JSON.parse(fm.readString(treeCacheFile))
    const now = Date.now() / 1000

    if (now - cache.time < cacheLife) {
      console.log("Using GitHub tree cache")
      tree = cache.data
    }
  }

  if (!tree) {

    console.log("Fetching GitHub tree")

    const api = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`

    const req = new Request(api)

    if (Keychain.contains("github_token")) {
      req.headers = {
        "Authorization": "token " + Keychain.get("github_token")
      }
    }

    tree = await req.loadJSON()

    fm.writeString(treeCacheFile, JSON.stringify({
      time: Date.now() / 1000,
      data: tree
    }))
  }

  const newSHA = {}

  for (const file of tree.tree) {
    if (file.type !== "blob") continue // ファイルのみ

    newSHA[file.path] = file.sha

    let shouldDownload = false

    if (useTarget) {

      // 指定ファイル/フォルダ対象か判定
      if (targetFiles && targetFiles.includes(file.path)) shouldDownload = true
      if (!shouldDownload && targetFolders) {
        shouldDownload = targetFolders.some(f => file.path.startsWith(f + "/"))
      }

      // 差分を使う場合は SHA を確認
      if (shouldDownload && useDiff) {
        shouldDownload = !localSHA[file.path] || localSHA[file.path] !== file.sha
      }
    } else {
      // 全体対象
      if (!useDiff) {
        shouldDownload = true // 無条件で全体取得
      } else {
        shouldDownload = !localSHA[file.path] || localSHA[file.path] !== file.sha // 差分取得
      }
    }

    if (!shouldDownload) continue

    // --- ダウンロード ---
    const rawURL = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${file.path}`
    let code = await new Request(rawURL).loadString()

    // GitHub のフォルダ構造を Scriptable に再現
    const savePath = fm.joinPath(baseDir, file.path)
    const dirPath = fm.joinPath(baseDir, file.path.split("/").slice(0, -1).join("/"))
    if (!fm.fileExists(dirPath)) fm.createDirectory(dirPath, true)

    // JSはBOM付与
//     if (file.path.endsWith(".js") && !code.startsWith("\uFEFF")) {
//       code = "\uFEFF" + code
//     }

    fm.writeString(savePath, code)
    console.log("Downloaded: " + file.path)
  }

  // --- GitHubから削除されたファイルを削除 ---
  for (const path in localSHA) {
    if (!newSHA[path]) {
      const removePath = fm.joinPath(baseDir, path)
      if (fm.fileExists(removePath)) {
        fm.remove(removePath)
        console.log("Removed: " + path)
      }
    }
  }

  // SHA 保存
  fm.writeString(shaFilePath, JSON.stringify(newSHA, null, 2))
  console.log("Update complete")

  // --- Main 実行 ---
  if (loadMain) {
    const Main = importModule("Main")
    Main.setAppInfo("storageType", storageType)
    await Main.start()
  }
}

await devLoader({ useDiff, useTarget, targetFiles, targetFolders })