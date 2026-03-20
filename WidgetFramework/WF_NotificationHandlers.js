// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: teal; icon-glyph: magic;
/*
 * WF_NotificationHandlers
 * UTF-8 日本語コメント
 **/
module.exports = (core) => ({

  openProfile: async (info) => {
    core.profile.setActive(info.profile)
    await core.preview(info.widgetFamily)
  },

  openNotificationUI: async () => {
    await core.notificationUI.present(core)
  },

  openNotificationDetail: async (info) => {
    await core.notificationUI.present(core, {
      openId: info.id
    })
  }

})