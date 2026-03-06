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

  const shaPath = fm.joinPath(`${dir}/WidgetFramework`, "github_sha.json")

  let localSha = {}
  if (fm.fileExists(shaPath)) {
    localSha = JSON.parse(fm.readString(shaPath))
  }

  const list = await new Request(api).loadJSON()

  for (const file of list) {

    if (!file.name.endsWith(".js")) continue

    if (localSha[file.name] === file.sha) {
      console.log("skip: " + file.name)
      continue
    }

    const code = await new Request(file.download_url).loadString()

    const subDir = (file.name == 'Main.js') ? "" : "/WidgetFramework"
    const savePath = fm.joinPath(`${dir}${subDir}`, file.name)

    fm.writeString(savePath, code)

    localSha[file.name] = file.sha

    console.log("Updated: " + file.name)
    console.log("\n" + api + "\n")
  }

  fm.writeString(shaPath, JSON.stringify(localSha))

  console.log("Hot reload complete")

    // Mainå®è¡
  const Main = importModule("Main")
  if (Main.run) await Main.run()

}

await hotReload()