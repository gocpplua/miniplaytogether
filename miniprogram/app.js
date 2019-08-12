//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    const g_activityDB = wx.cloud.database({
      env: 'test-52nlc'
      //env: 'qiumingshan'
    })

    this.globalData = {}
    this.globalData["db"] = g_activityDB
  }
})
