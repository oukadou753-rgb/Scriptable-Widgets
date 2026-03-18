// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationUI
 * UTF-8 日本語コメント
 **/
module.exports = {

  async showMenu(core) {

    const alert = new Alert()
    alert.title = "Notification Manager"

    alert.addAction("予定一覧")
    alert.addAction("履歴一覧")
    alert.addCancelAction("閉じる")

    const res = await alert.presentSheet()

    if (res === 0) return this.showScheduled(core)
    if (res === 1) return this.showHistory(core)
  },

  async showScheduled(core) {

    const table = new UITable()
    table.showSeparators = true

    // 仮：空テーブル
    const row = new UITableRow()
    row.addText("No Scheduled Notifications")
    table.addRow(row)

    await table.present()
  },

  async showHistory(core) {

    const table = new UITable()
    table.showSeparators = true

    // 仮：空テーブル
    const row = new UITableRow()
    row.addText("No History")
    table.addRow(row)

    await table.present()
  }

}