// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
module.exports = class WF_MenuEngine {

  constructor() {

    this.menus = {}

    this.stack = []
  }

  // =========================
  // メニュー登録
  // =========================
  register(name, items = [], options = {}) {

    if (!Array.isArray(items)) items = []

    this.menus[name] = {
      items,
      options
    }
  }

  // =========================
  // 開始
  // =========================
  async start(name, overrideOptions = {}) {

    this.stack = [name]

    while (this.stack.length > 0) {

      const current = this.stack[this.stack.length - 1]

      const result = await this.present(current, overrideOptions)

      if (result === "exit") return true

      if (result === "back") {
        if (this.stack.length > 1) {
          this.stack.pop()
        } else {
          return true
        }
      }
    }

    return false
  }

  // =========================
  // 表示（Alert版）
  // =========================
  async present(name, overrideOptions = {}) {

    const menu = this.menus[name]
    if (!menu) return "exit"

    const options = {
      ...(menu.options || {}),
      ...(overrideOptions || {})
    }

    let items = menu.items
    if (!Array.isArray(items)) items = []

    const a = new Alert()

    // タイトル
    if (options.title) {
      a.title = String(options.title)
    }

    // =========================
    // メニュー項目
    // =========================
    items.forEach(item => {

      const label = item?.label || "Item"

      a.addAction(String(label))
    })

    const isRoot = this.stack.length === 1
    a.addCancelAction(isRoot ? "Close" : "Back")

    const index = await a.present()

    // =========================
    // 戻る / 閉じる
    // =========================
    if (index === -1) {
      return "back"
    }

    const item = items[index]
    if (!item) return null

    // =========================
    // サブメニュー
    // =========================
    if (item.next) {
      this.stack.push(item.next)
      return null
    }

    // =========================
    // アクション
    // =========================
    if (item.action) {

      try {

        const result = await item.action()

        if (result === "exit") return "exit"
        if (result === "back") return "back"

      } catch (e) {

        const err = new Alert()
        err.title = "Action Error"
        err.message = String(e)
        err.addAction("OK")
        await err.present()
      }

      return null
    }

    return null
  }
}
