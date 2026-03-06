// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * HotLoader
 **/
async function hotReload() {
  const user = "oukadou753-rgb"
  const repo = "Scriptable-Widgets"
  const branch = "main"
  const path = "WidgetFramework"

  const api = `https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${branch}`

  const fm = FileManager.iCloud()
  const dir = fm.documentsDirectory()
  const frameworkDir = fm.joinPath(dir, "WidgetFramework")
  const shaPath = fm.joinPath(frameworkDir, "github_sha.json")

  if (!fm.fileExists(frameworkDir)) {
    fm.createDirectory(frameworkDir)
  }

  let localSha = {}
  if (fm.fileExists(shaPath)) {
    localSha = JSON.parse(fm.readString(shaPath))
  }

  const list = await new Request(api).loadJSON()

  for (const file of list) {

    if (!file.name.endsWith(".js")) continue

    if (localSha[file.name] === file.sha) {
      console.log("skip: " + file.name)
      console.log(JSON.stringify(file.html_url, null, 2) + "\n")
//       console.log(JSON.stringify(file.download_url, null, 2) + "\n")
      continue
    }

    const code = await new Request(file.download_url).loadString()

    const subDir = (file.name == 'Main.js') ? "" : "/WidgetFramework"
    const savePath = fm.joinPath(`${dir}${subDir}`, file.name)

    fm.writeString(savePath, code)

    localSha[file.name] = file.sha

    console.log("Updated: " + file.name)
    console.log(JSON.stringify(file.html_url, null, 2) + "\n")
//     console.log(JSON.stringify(file.download_url, null, 2) + "\n")
  }

  fm.writeString(shaPath, JSON.stringify(localSha))

  console.log("Hot reload complete")

  // Mainå®è¡
  const Main = importModule("Main")
  await Main.run()
}

await hotReload()