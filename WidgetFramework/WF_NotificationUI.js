// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationUI
 * UTF-8 日本語コメント
 **/
module.exports = {

  // =========================
  // present
  // =========================
  async present(core) {
    const table = new UITable()
    table.showSeparators = true
    table.dismissOnSelect = false

    // 初期モード
    if (!this.mode) this.mode = "scheduled"

    await this.createTable(table, core)

    await table.present(true)
  },

  // =========================
  // createTable
  // =========================
  async createTable(table, core) {
    table.removeAllRows()

    // =========================
    // データ取得
    // =========================

    let list = []

    if (this.mode === "history") {
      list = core.notification.getHistory()
    } else {
      list = core.notification.getScheduled()
    }

    if (!Array.isArray(list)) list = []

    // =========================
    // タブUI
    // =========================
    const tabRow = new UITableRow()

    const scheduledBtn = tabRow.addButton(
      this.mode === "scheduled" ? "●予定" : "予定"
    )
    scheduledBtn.onTap = async () => {
      this.mode = "scheduled"
      await this.createTable(table, core)
    }

    const historyBtn = tabRow.addButton(
      this.mode === "history" ? "●履歴" : "履歴"
    )
    historyBtn.onTap = async () => {
      this.mode = "history"
      await this.createTable(table, core)
    }

    const reloadBtn = tabRow.addButton("更新")
    reloadBtn.onTap = async () => {
      await this.createTable(table, core)
    }

    table.addRow(tabRow)

    // =========================
    // 件数
    // =========================
    const countRow = new UITableRow()
    const countText = countRow.addText(`件数: ${list.length}`)
    countText.titleFont = Font.systemFont(14)
    countText.rightAligned()
    table.addRow(countRow)

    // =========================
    // 空状態
    // =========================
    if (list.length === 0) {
      const emptyRow = new UITableRow()
      const emptyText = emptyRow.addText("通知はありません")
      emptyText.titleFont = Font.systemFont(14)
      table.addRow(emptyRow)
    }

    // =========================
    // リスト描画
    // =========================
    for (const item of list) {

      const row = new UITableRow()
      row.height = 60
      cellSpacing = 10
      row.dismissOnSelect = false

      const title = item.title || ""
      const subtitle = item.subtitle || ""
      const body = item.body || ""

      let ts = Date.now()

      if (item.status === "pending") {
        ts = item.fireAt ?? Date.now()
      } else {
        ts = item.lastSent ?? item.fireAt ?? Date.now()
      }

      const left = row.addText(
        `${title} | ${subtitle}`, body
      )
      left.widthWeight = 100
      left.titleFont = Font.semiboldSystemFont(16)
      left.subtitleFont = Font.systemFont(14)

      const right = row.addText(
        `${this.formatTimeAgo(ts)}`, this.formatDate(ts)
      )
      right.widthWeight = 20
      right.rightAligned()
      right.titleFont = Font.semiboldSystemFont(16)
      right.subtitleFont = Font.systemFont(14)

      // タップで詳細
      row.onSelect = async () => {

        const detailTable = new UITable()
        detailTable.showSeparators = true
        detailTable.cellSpacing = 2

        const json = JSON.stringify(item, null, "\t")
        const count = Object.keys(item).flat().length + 2

        const lines = json.split("\n")

        const row = new UITableRow()
        row.dismissOnSelect = false

        const text =
          `ID: ${item.id}\n` +
          `status: ${item.status}\n` +
          `title: ${item.title}\n` +
          `body: ${item.body}\n` +
          `time: ${this.formatDate(item.fireAt || item.lastSent)}`

        const t = row.addText(json)

        // 見た目調整
        t.titleFont = Font.systemFont(14)
        t.widthWeight = 100

        // 高さ固定
        row.height = 14 * count * 1.4

        detailTable.addRow(row)

        // Close
        const closeRow = new UITableRow()
        const closeBtn = closeRow.addButton("Close")
        closeBtn.dismissOnTap = true
        detailTable.addRow(closeRow)

        await detailTable.present(true)
      }

      table.addRow(row)
    }

    // =========================
    // Close
    // =========================
    const actionRow = new UITableRow()
    const closeBtn = actionRow.addButton("Close")
    closeBtn.dismissOnTap = true
    table.addRow(actionRow)

    // 再読み込み
    core.notification.refresh()

    table.reload()
  },

  // =========================
  // 時間フォーマット
  // =========================
  formatDate(ts) {
    const d = new Date(ts)
    return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
  },

  // =========================
  // formatTimeAgo
  // =========================
  formatTimeAgo(ts) {
    const diff = Date.now() - ts
    const abs = Math.abs(diff)

    const sec = Math.floor(abs / 1000)
    const min = Math.floor(sec / 60)
    const hour = Math.floor(min / 60)
    const day = Math.floor(hour / 24)

    // =========================
    // 未来（予約）
    // =========================
    if (diff < 0) {
      if (sec < 60) return `${sec}秒後`
      if (min < 60) return `${min}分後`
      if (hour < 24) return `${hour}時間後`
      return `${day}日後`
    }

    // =========================
    // 過去（履歴）
    // =========================
    if (sec < 60) return `${sec}秒前`
    if (min < 60) return `${min}分前`
    if (hour < 24) return `${hour}時間前`
    return `${day}日前`
  }

}