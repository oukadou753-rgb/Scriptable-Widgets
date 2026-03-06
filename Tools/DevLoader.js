// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: download;
/**
 * DevLoader
 **/
async function devLoader() {

  const user = "oukadou753-rgb"
  const repo = "Scriptable-Widgets"
  const branch = "main"
  const path = "WidgetFramework"

  const api = `https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${branch}`

  const fm = FileManager.iCloud()
  const baseDir = fm.documentsDirectory()

  const req = new Request(api)
  const list = await req.loadJSON()

  for (const file of list) {

    if (file.type === "file" && file.name.endsWith(".js")) {

      const rawURL = file.download_url
      const code = await new Request(rawURL).loadString()

      const subDir = (file.name == 'Main.js') ? "" : "/WidgetFramework"
      const savePath = fm.joinPath(`${baseDir}${subDir}`, file.name)

      fm.writeString(savePath, code)

      console.log(file.name)
      console.log(JSON.stringify(file.html_url, null, 2) + "\n")
//       console.log(JSON.stringify(file.download_url, null, 2) + "\n")
    }
  }

  console.log("Update complete")

  // Mainå®è¡
  const Main = importModule("Main")
  if (Main.run) await Main.run()

}

await devLoader()