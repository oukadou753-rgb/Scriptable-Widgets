/**
 * DevLoader 最終版
 * HotReload + targetFiles / targetFolders 両対応
 **/
async function devLoader({
  useDiff = true,               // true=差分取得, false=無条件取得
  useTarget = false,            // true=指定ファイル/フォルダを対象にする
  targetFiles = null,           // 個別ファイル指定（GitHub 相対パス）
  targetFolders = null          // フォルダ単位指定（例: ["WidgetFramework"]）
} = {}) {

  const user = "oukadou753-rgb"
  const repo = "Scriptable-Widgets"
  const branch = "main"

  const fm = FileManager.iCloud()
  const baseDir = fm.documentsDirectory()

  // --- SHA 管理用 ---
  const shaFilePath = fm.joinPath(baseDir, "github_sha.json") // ← 先頭に.は付けない
  let localSHA = {}
  if (fm.fileExists(shaFilePath)) {
    try { localSHA = JSON.parse(fm.readString(shaFilePath)) } catch(e) { localSHA = {} }
  }

  // --- GitHub 全ファイル取得（再帰的） ---
  const api = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`
  const tree = await new Request(api).loadJSON()

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
    const code = await new Request(rawURL).loadString()

    // GitHub のフォルダ構造を Scriptable に再現
    const savePath = fm.joinPath(baseDir, file.path)
    const dirPath = fm.joinPath(baseDir, file.path.split("/").slice(0, -1).join("/"))
    if (!fm.fileExists(dirPath)) fm.createDirectory(dirPath, true)

    fm.writeString(savePath, code)
    console.log("Downloaded: " + file.path)
  }

  // SHA 保存
  fm.writeString(shaFilePath, JSON.stringify(newSHA, null, 2))
  console.log("Update complete")

  // --- Main 実行 ---
  const Main = importModule("Main")
  if (Main.run) await Main.run()
}

/**
 * DevLoader 呼び出しテンプレート（新フラグ版）
 **/

// --- 初回全ファイル取得 ---
// await devLoader({
//   useDiff: false,          // 差分無視
//   useTarget: false          // 全体対象
// })

// --- 通常運用: 指定ファイルのみ更新 ---
// await devLoader({
//   useDiff: true,           // 差分のみ
//   useTarget: true,         // 指定対象のみ
//   targetFiles: ["WidgetFramework/WF_AppCore.js","WidgetFramework/WF_DataProvider.js"]
// })

// --- 特定フォルダ単位で更新 ---
// await devLoader({
//   useDiff: true,           // 差分のみ
//   useTarget: true,         // 指定フォルダのみ
//   targetFolders: ["WidgetFramework"]
// })

// --- ファイル＋フォルダ併用 ---
// await devLoader({
//   useDiff: true,
//   useTarget: true,
//   targetFiles: ["Main.js"],
//   targetFolders: ["WidgetFramework"]
// })

// --- HotReload: SHA 差分で更新されたファイルのみ自動取得 ---
// await devLoader({
//   useDiff: true,
//   useTarget: false
// })

// --- HotReload + 特定フォルダ併用 ---
await devLoader({
  useDiff: true,
  useTarget: true,
  targetFolders: ["WidgetFramework"]
})