// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * App_TableUI
 * UTF-8 日本語コメント
 */
module.exports = {

  createRow() {
    const row = new UITableRow()
    row.dismissOnSelect = false
    row.cellSpacing = 10
    return row
  },

  createKeyValueRow(title, value) {
    const row = this.createRow()

    const left = row.addText(title)
    left.widthWeight = 70
    left.titleFont = Font.systemFont(14)

    const right = row.addText(String(value))
    right.widthWeight = 30
    right.rightAligned()
    right.titleFont = Font.systemFont(14)

    return { row, left, right }
  },

  createButtonRow(labels = []) {
    const row = this.createRow()
    const buttons = labels.map(l => row.addButton(l))
    return { row, buttons }
  },

  createSpacerRow(height = 10) {
    const row = new UITableRow()
    row.height = height
    return row
  }

}