//app.js
App({
  onLaunch: function () {
    
    this.globalData = {}
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
        //env: 'test-52nlc'
        env: 'qiumingshan'
      })
      const g_activityDB = wx.cloud.database()
      this.globalData["db"] = g_activityDB
    }
  }
})
