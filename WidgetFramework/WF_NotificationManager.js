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

  constructor(appId, storage) {
    this.appId = appId
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
  async notifyOnce(id, payload, cooldown = 300000) {

    const last = this.history[id]?.lastSent

    if (last && Date.now() - last < cooldown) return false

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
    
    if (typeof n.setTriggerDate === "function") {
      n.setTriggerDate(date)
    } else {
      n.triggerDate = date
    }

    await n.schedule()

    this.history[id] = {
      fireAt: date.getTime(),
      status: "pending",
      title: payload.title,
      subtitle: payload.subtitle,
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
    n.subtitle = payload.subtitle || ""
    n.body = payload.body || ""

    if (payload.sound !== undefined) {
      n.sound = payload.sound
    }

    // Scriptable起動URL（固定）
    // URLSearchParams を使わずに手動で組み立て
    function toQuery(obj) {
      return Object.entries(obj)
        .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
        .join("&")
    }

    // payload例
    // payload = { id: "rain_alert", meta: { url: "https://example.com" } }

    const paramsStr = toQuery({ id: payload.id })
    n.openURL = `scriptable:///run?scriptName=${encodeURIComponent(Script.name())}&${paramsStr}`

    // userInfo
    n.userInfo = {
      id: payload.id,
      ...payload.meta
    }

    return n
  }

  _load() {
    return this.storage.readJSON(this.key) || {}
  }

  _save() {
    this.storage.writeJSON(this.key, this.history)
  }
}