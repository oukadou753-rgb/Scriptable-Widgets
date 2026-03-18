// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: magic;
/**
 * WF_NotificationManager
 * UTF-8 日本語コメント
 **/
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
   * payload: { id, title, subtitle?, body, delay?, cooldown?, meta? }
   */
  async notifyOnce(payload) {
    if (!payload?.id) throw new Error("notifyOnce: payload.id is required")

    const cooldown = payload.cooldown ?? 300_000
    const last = this.history[payload.id]?.lastSent
    if (last && Date.now() - last < cooldown) return false

    if (payload.delay) {
      const fireDate = new Date(Date.now() + payload.delay)
      await this.schedule(payload.id, fireDate, payload)
    } else {
      await this._send(payload)
      this.history[payload.id] = {
        lastSent: Date.now(),
        status: "sent",
        title: payload.title,
        subtitle: payload.subtitle,
        body: payload.body
      }
      this._save()
    }

    return true
  }

  /**
   * 即時通知（delay があれば予約として扱う）
   */
  async notify(payload) {
    if (payload.delay) {
      const fireDate = new Date(Date.now() + payload.delay)
      await this.schedule(payload.id || `temp_${Date.now()}`, fireDate, payload)
    } else {
      await this._send(payload)
    }
    return true
  }

  /**
   * 予約通知
   */
  async schedule(id, date, payload) {
    if (!id) throw new Error("schedule: id is required")
    if (!payload) throw new Error("schedule: payload is required")

    // cooldown 判定
    const cooldown = payload.cooldown ?? 0
    const last = this.history[id]?.lastSent
    if (last && Date.now() - last < cooldown) return false

    const n = this._createNotification(payload)
    n.identifier = id

    if (typeof n.setTriggerDate === "function") {
      n.setTriggerDate(date)
    } else {
      n.triggerDate = date
    }

    await n.schedule()

    this.history[id] = {
      lastSent: Date.now(),
      fireAt: date.getTime(),
      status: "pending",
      title: payload.title,
      subtitle: payload.subtitle,
      body: payload.body,
      meta: payload.meta
    }
    this._save()

    return true
  }

  /**
   * 削除（予約含む）
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
   * UI 用一覧取得
   */
  list() {
    return this.history
  }

  // =========================
  // Private
  // =========================

  async _send(payload) {
    const n = this._createNotification(payload)
    await n.schedule()
  }

  _createNotification(payload) {
    const n = new Notification()

    n.title = payload.title || ""
    n.subtitle = payload.subtitle || ""
    n.body = payload.body || ""
    if (payload.sound !== undefined) n.sound = payload.sound

    // Scriptable 起動 URL（payload.id を必須に）
    if (payload.id) {
      const toQuery = (obj) =>
        Object.entries(obj)
          .map(([k, v]) => encodeURIComponent(k) + "=" + encodeURIComponent(v))
          .join("&")

      n.openURL = `scriptable:///run?scriptName=${encodeURIComponent(
        Script.name()
      )}&${toQuery({ id: payload.id })}`
    }

    // userInfo に payload.meta を格納
    n.userInfo = { id: payload.id, ...payload.meta }

    return n
  }

  _load() {
    return this.storage.readJSON(this.key) || {}
  }

  _save() {
    this.storage.writeJSON(this.key, this.history)
  }
}