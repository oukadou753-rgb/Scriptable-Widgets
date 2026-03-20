// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationUI
 * UTF-8 日本語コメント
 **/
module.exports = {

  // =========================
  // 状態
  // =========================
  view: "list",         // list / detail
  mode: "scheduled",    // scheduled / history
  currentItem: null,
  table: null,

  // =========================
  // present
  // =========================
  async present(core, options = {}) {
    const table = new UITable()
    table.showSeparators = true
    table.dismissOnSelect = false

    this.table = table

    // ★初期化
    this.view = "list"
    this.currentItem = null

    if (options.mode) {
      this.mode = options.mode
    }

    // ★ここ変更（await削除＋状態セット）
    if (options.openId) {
      const item = core.notification
        .getUIList("all")
        .find(v => v.id === options.openId)

      if (item) {
        this.view = "detail"
        this.currentItem = item
      }
    }

    await this.createTable(table, core)
    await table.present(true)
  },

  // =========================
  // createTable（司令塔）
  // =========================
  async createTable(table, core) {
    table.removeAllRows()

    core.notification.refresh()

    if (this.view === "list") {
      const list = this.getList(core)

      this.renderTabs(table, core)
      this.renderCount(table, list)
      this.renderList(table, list, core)
      this.renderFooter(table, core)
    }

    if (this.view === "detail") {
      this.renderDetail(table, core)
    }

    table.reload()
  },

  // =========================
  // データ取得
  // =========================
  getList(core) {
    if (this.mode === "history") {
      return core.notification.getUIList("history")
    }
    return core.notification.getUIList("scheduled")
  },

  // =========================
  // タブUI
  // =========================
  renderTabs(table, core) {
    const row = new UITableRow()

    const scheduledBtn = row.addButton(
      this.mode === "scheduled" ? "●予定" : "予定"
    )
    scheduledBtn.onTap = async () => {
      this.mode = "scheduled"
      await this.reload(table, core)
    }

    const historyBtn = row.addButton(
      this.mode === "history" ? "●履歴" : "履歴"
    )
    historyBtn.onTap = async () => {
      this.mode = "history"
      await this.reload(table, core)
    }

    const reloadBtn = row.addButton("↺")
    reloadBtn.onTap = async () => {
      await this.reload(table, core)
    }

    table.addRow(row)
  },

  // =========================
  // 件数
  // =========================
  renderCount(table, list) {
    const row = new UITableRow()
    const text = row.addText(`件数: ${list.length}`)
    text.titleFont = Font.systemFont(14)
    text.rightAligned()
    table.addRow(row)
  },

  // =========================
  // リスト描画
  // =========================
  renderList(table, list, core) {
    if (!Array.isArray(list) || list.length === 0) {
      const row = new UITableRow()
      const rowText = row.addText("通知はありません")
      rowText.titleFont = Font.semiboldSystemFont(16)
      table.addRow(row)
      return
    }

    for (const item of list) {
      table.addRow(this.createRow(item, core))
    }
  },

  // =========================
  // 行生成
  // =========================
  createRow(item, core) {
    const row = new UITableRow()
    row.height = 60
    row.dismissOnSelect = false
    row.cellSpacing = 10

    const title = item.title || ""
    const subtitle = item.subtitle || ""
    const body = item.body || ""

    const left = row.addText(
      `${title}`,
      `${subtitle} ${body}`
    )
    left.widthWeight = 100
    left.titleFont = Font.semiboldSystemFont(16)
    left.subtitleFont = Font.systemFont(14)

    const right = row.addText(
      this.formatTimeAgo(item.date),
      this.formatDate(item.date)
    )
    right.widthWeight = 25
    right.rightAligned()
    right.titleFont = Font.semiboldSystemFont(14)
    right.subtitleFont = Font.systemFont(12)

    // 期限切れ表示
    if (item.isExpired) {
      left.titleColor = Color.gray()
    }

    row.onSelect = async () => {
      this.view = "detail"
      this.currentItem = item
      await this.reload(this.table, core)
    }

    return row
  },

  // =========================
  // renderDetail
  // =========================
  renderDetail(table, core) {
    const item = this.currentItem
    if (!item) return

    // 戻る
    const backRow = new UITableRow()
    const backBtn = backRow.addButton("← 一覧")
    backBtn.onTap = async () => {
      this.view = "list"
      this.currentItem = null
      await this.reload(this.table, core)
    }
    table.addRow(backRow)

    // タイトル
    const titleRow = new UITableRow()
    const titletext = titleRow.addText("Title", item.title || "")
    titletext.titleFont = Font.systemFont(12)
    titletext.subtitleFont = Font.semiboldSystemFont(16)
    table.addRow(titleRow)

    // 本文
    if (item.body) {
      const row = new UITableRow()
      const rowText = row.addText("Body", item.body)
      rowText.titleFont = Font.systemFont(12)
      rowText.subtitleFont = Font.systemFont(14)
      table.addRow(row)
    }

    // 状態
    const statusRow = new UITableRow()
    const statusText = statusRow.addText("状態",
      item.status === "pending" ? "予約中" : "送信済み"
    )
    statusText.titleFont = Font.systemFont(12)
    statusText.subtitleFont = Font.systemFont(14)
    table.addRow(statusRow)

    // 時刻
    const timeRow = new UITableRow()
    const timeText = timeRow.addText("時刻", this.formatDate(item.date))
    timeText.titleFont = Font.systemFont(12)
    timeText.subtitleFont = Font.systemFont(14)
    table.addRow(timeRow)

    const blankRow = new UITableRow()
    table.addRow(blankRow)

    // 削除
    const deleteRow = new UITableRow()
    const deleteBtn = deleteRow.addButton("削除")
    deleteBtn.onTap = async () => {
      await core.notification.remove(item.id)

      this.view = "list"
      this.currentItem = null

      await this.reload(this.table, core)
    }
    table.addRow(deleteRow)

    // スヌーズ
    if (item.isPending) {
      const snoozeRow = new UITableRow()

      const plus5 = snoozeRow.addButton("+5分")
      plus5.onTap = async () => {
        await this.snooze(item, core, 5 * 60 * 1000)
      }

      const plus60 = snoozeRow.addButton("+1時間")
      plus60.onTap = async () => {
        await this.snooze(item, core, 60 * 60 * 1000)
      }

      const custom = snoozeRow.addButton("カスタム")
      custom.onTap = async () => {
        await this.snoozeCustom(item, core)
      }

      table.addRow(snoozeRow)
    }
  },

  // =========================
  // フッター（＋一括削除）
  // =========================
  renderFooter(table, core) {
    const blankRow = new UITableRow()
    table.addRow(blankRow)

    const row = new UITableRow()

    const clearBtn = row.addButton("全削除")
    clearBtn.onTap = async () => {
      const alert = new Alert()
      alert.title = "全削除しますか？"
      alert.message = "すべての通知（履歴・予定）を削除します"

      alert.addDestructiveAction("削除")
      alert.addCancelAction("キャンセル")

      const res = await alert.presentAlert()
      if (res === -1) return

      await core.notification.clearAll()
      await this.reload(null, core)
    }

    const closeBtn = row.addButton("Close")
    closeBtn.dismissOnTap = true

    table.addRow(row)
  },

  // =========================
  // reload
  // =========================
  async reload(table, core) {
    const t = table || this.table
    if (!t) return

    await this.createTable(t, core)
  },

  // =========================
  // snooze
  // =========================
  async snooze(item, core, diffMs) {
    const base = item.date || Date.now()
    const newTime = base + diffMs

    await core.notification.schedule(
      item.id,
      new Date(newTime),
      item
    )

    this.view = "list"
    this.currentItem = null

    await this.reload(this.table, core)
  },

  // =========================
  // snooze
  // =========================
  async snoozeCustom(item, core) {
    const alert = new Alert()
    alert.title = "スヌーズ（分）"

    alert.addTextField("例: 10", "5")

    alert.addAction("OK")
    alert.addCancelAction("キャンセル")

    const res = await alert.presentAlert()
    if (res === -1) return

    const input = alert.textFieldValue(0)
    const minutes = parseInt(input, 10)

    // バリデーション
    if (isNaN(minutes) || minutes <= 0) {
      const err = new Alert()
      err.title = "無効な値"
      err.message = "1以上の数字を入力してください"
      err.addAction("OK")
      await err.presentAlert()
      return
    }

    const diffMs = minutes * 60 * 1000

    const newTime = item.date + diffMs

    await core.notification.schedule(
      item.id,
      new Date(newTime),
      item
    )

    await this.reload(this.table, core)
  },

  // =========================
  // 時間フォーマット
  // =========================
  formatDate(ts) {
    if (!ts) return ""
    const d = new Date(ts)
    return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
  },

  // =========================
  // 経過時間
  // =========================
  formatTimeAgo(ts) {
    if (!ts) return ""

    const diff = Date.now() - ts
    const abs = Math.abs(diff)

    const sec = Math.floor(abs / 1000)
    const min = Math.floor(sec / 60)
    const hour = Math.floor(min / 60)
    const day = Math.floor(hour / 24)

    if (diff < 0) {
      if (sec < 60) return `${sec}秒後`
      if (min < 60) return `${min}分後`
      if (hour < 24) return `${hour}時間後`
      return `${day}日後`
    }

    if (sec < 60) return `${sec}秒前`
    if (min < 60) return `${min}分前`
    if (hour < 24) return `${hour}時間前`
    return `${day}日前`
  }

}