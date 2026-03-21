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
  view: "list",
  mode: "scheduled",
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

    this.view = "list"
    this.currentItem = null

    if (options.mode) {
      this.mode = options.mode
    }

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
  // createTable
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
  // 共通部品
  // =========================
  createRow() {
    const row = new UITableRow()
    row.dismissOnSelect = false
    row.cellSpacing = 10
    return row
  },

  createKeyValueRow(label, value) {
    const row = this.createRow()

    const left = row.addText(label)
    left.widthWeight = 70
    left.titleFont = Font.semiboldSystemFont(16)

    const right = row.addText(String(value))
    right.widthWeight = 30
    right.rightAligned()
    right.titleFont = Font.systemFont(12)

    return { row, left, right }
  },

  createActionRow(buttons) {
    const row = this.createRow()

    for (const btn of buttons) {
      const b = row.addButton(btn.label)
      if (btn.onTap) b.onTap = btn.onTap
      if (btn.dismiss) b.dismissOnTap = true
    }

    return row
  },

  createSpacer(height = 12) {
    const row = new UITableRow()
    row.height = height
    row.dismissOnSelect = false
    return row
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
  // タブ
  // =========================
  renderTabs(table, core) {
    table.addRow(this.createActionRow([
      {
        label: this.mode === "scheduled" ? "●予定" : "予定",
        onTap: async () => {
          this.mode = "scheduled"
          await this.reload(core)
        }
      },
      {
        label: this.mode === "history" ? "●履歴" : "履歴",
        onTap: async () => {
          this.mode = "history"
          await this.reload(core)
        }
      },
      {
        label: "↺",
        onTap: async () => {
          await this.reload(core)
        }
      }
    ]))
  },

  // =========================
  // 件数
  // =========================
  renderCount(table, list) {
    const { row, right } =
      this.createKeyValueRow("件数", list.length)

    right.rightAligned()
    table.addRow(row)
  },

  // =========================
  // リスト
  // =========================
  renderList(table, list, core) {

    if (!Array.isArray(list) || list.length === 0) {
      const { row } = this.createKeyValueRow("状態", "通知はありません")
      table.addRow(row)
      return
    }

    for (const item of list) {
      const row = this.createRow()
      row.height = 60

      const left = row.addText(
        item.title || "",
        `${item.subtitle || ""} ${item.body || ""}`
      )
      left.widthWeight = 70
      left.titleFont = Font.semiboldSystemFont(16)
      left.subtitleFont = Font.systemFont(14)

      const right = row.addText(
        this.formatTimeAgo(item.date),
        this.formatDate(item.date)
      )
      right.widthWeight = 30
      right.rightAligned()
      right.titleFont = Font.systemFont(14)
      right.subtitleFont = Font.systemFont(12)

      if (item.isExpired) {
        left.titleColor = Color.gray()
      }

      row.onSelect = async () => {
        this.view = "detail"
        this.currentItem = item
        await this.reload(core)
      }

      table.addRow(row)
    }
  },

  // =========================
  // 詳細
  // =========================
  renderDetail(table, core) {
    const item = this.currentItem
    if (!item) return

    // 戻る
    table.addRow(this.createActionRow([
      {
        label: "← 一覧",
        onTap: async () => {
          this.view = "list"
          this.currentItem = null
          await this.reload(core)
        }
      }
    ]))

    // 内容
    table.addRow(this.createKeyValueRow("Title", item.title).row)

    if (item.body) {
      table.addRow(this.createKeyValueRow("Body", item.body).row)
    }

    table.addRow(this.createKeyValueRow(
      "状態",
      item.isPending ? "予約中" : "送信済み"
    ).row)

    table.addRow(this.createKeyValueRow(
      "時刻",
      this.formatDate(item.date)
    ).row)

    // 削除
    table.addRow(this.createActionRow([
      {
        label: "削除",
        onTap: async () => {
          await core.notification.remove(item.id)
          this.view = "list"
          await this.reload(core)
        }
      }
    ]))

    table.addRow(this.createSpacer(16))

    // スヌーズ
    if (item.isPending) {
      table.addRow(this.createActionRow([
        {
          label: "+5分",
          onTap: async () => {
            await this.snooze(item, core, 5 * 60 * 1000)
          }
        },
        {
          label: "+1時間",
          onTap: async () => {
            await this.snooze(item, core, 60 * 60 * 1000)
          }
        },
        {
          label: "カスタム",
          onTap: async () => {
            await this.snoozeCustom(item, core)
          }
        }
      ]))
    }
  },

  // =========================
  // フッター
  // =========================
  renderFooter(table, core) {
    table.addRow(this.createSpacer(16))

    table.addRow(this.createActionRow([
      {
        label: "全削除",
        onTap: async () => {
          const a = new Alert()
          a.title = "全削除しますか？"
          a.addDestructiveAction("削除")
          a.addCancelAction("キャンセル")

          const r = await a.presentAlert()
          if (r === -1) return

          await core.notification.clearAll()
          await this.reload(core)
        }
      },
      { label: "Close", dismiss: true }
    ]))
  },

  // =========================
  // reload
  // =========================
  async reload(core) {
    await this.createTable(this.table, core)
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
    await this.reload(core)
  },

  async snoozeCustom(item, core) {
    const a = new Alert()
    a.title = "スヌーズ（分）"
    a.addTextField("例: 10", "5")
    a.addAction("OK")
    a.addCancelAction("キャンセル")

    const r = await a.presentAlert()
    if (r === -1) return

    const minutes = parseInt(a.textFieldValue(0), 10)
    if (!minutes || minutes <= 0) return

    await this.snooze(item, core, minutes * 60 * 1000)
  },

  // =========================
  // 時刻
  // =========================
  formatDate(ts) {
    if (!ts) return ""
    const d = new Date(ts)
    return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`
  },

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