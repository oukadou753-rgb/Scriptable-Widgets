// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationManager
 * UTF-8 日本語コメント
 **/
// WF_NotificationManager.js
// シンプル & 拡張前提テンプレ

module.exports = class WF_NotificationManager {

  constructor(storage) {
    this.storage = storage
    this.key = "wf_notifications"
    this.history = this._load()
  }

  // =========================
  // Public
  // =========================

  /**
   * 一度だけ通知（重複防止）
   */
  async notifyOnce(id, payload) {
    if (this._isNotified(id)) return false

    await this._send(payload)

    this.history[id] = {
      lastSent: Date.now(),
      status: "sent"
    }

    this._save()
    return true
  }

  /**
   * 通常通知（制限なし）
   */
  async notify(payload) {
    await this._send(payload)
    return true
  }

  /**
   * 予約通知
   */
  async schedule(id, date, payload) {
    const n = this._createNotification(payload)
    n.identifier = id
    n.setTriggerDate(date)

    await n.schedule()

    this.history[id] = {
      fireAt: date.getTime(),
      status: "pending",
      title: payload.title,
      body: payload.body
    }

    this._save()
    return true
  }

  /**
   * 通知削除（予約含む）
   */
  async remove(id) {
    await Notification.removePending([id])
    await Notification.removeDelivered([id])

    delete this.history[id]
    this._save()
  }

  /**
   * 全削除
   */
  async clearAll() {
    const ids = Object.keys(this.history)

    await Notification.removePending(ids)
    await Notification.removeDelivered(ids)

    this.history = {}
    this._save()
  }

  /**
   * 一覧取得（UI用）
   */
  list() {
    return this.history
  }

  // =========================
  // Private
  // =========================

  _isNotified(id) {
    return !!this.history[id]?.lastSent
  }

  async _send(payload) {
    const n = this._createNotification(payload)
    await n.schedule()
  }

  _createNotification(payload) {
    const n = new Notification()

    n.title = payload.title || ""
    n.body = payload.body || ""

    if (payload.sound !== undefined) {
      n.sound = payload.sound
    }

    return n
  }

  _load() {
    try {
      return this.storage.get(this.key) || {}
    } catch {
      return {}
    }
  }

  _save() {
    this.storage.set(this.key, this.history)
  }
}