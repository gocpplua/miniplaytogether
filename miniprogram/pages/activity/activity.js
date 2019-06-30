// pages/activity/activity.js
const testDB = wx.cloud.database({
  env: 'test-52nlc'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityPicPath: "../../images/create-collection.png",
    activityInfo:"秋名山社 周三18-21",
    avatarUrl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
    this.getActivityAvatarUrl("activity")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('onReachBottom')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  onClickAddress:function(){
      wx.openLocation({
        latitude: 23.099994,
        longitude: 113.32452,
      })
    },

  open:function(){
    console.log("open")
  },

  callwechat:function(){
    console.log('callwechat')
  },

  bindGetUserInfo:function(e) {
    console.log('bindGetUserInfo')
    console.log(e.detail.userInfo)
    var avatarUrlTmp = 
      {
        avatarUrl:e.detail.userInfo.avatarUrl
      }


    this.data.avatarUrl.push(avatarUrlTmp)
    console.log(this.data.avatarUrl)
    this.setData(
      {
        avatarUrl: this.data.avatarUrl
      }
    )

    const todos = testDB.collection('activity')
    todos.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        avatarUrl: e.detail.userInfo.avatarUrl
      }
    }).then(res => {
      console.log(res)
    })
  },

  // 获取活动报名玩家的头像Array
  getActivityAvatarUrl:function(collectionName){
    var that = this
    const activityColl = testDB.collection(collectionName)
    activityColl.get(
      {
        success:function(res){
          console.log(res.data)
          that.setData(
            {
              avatarUrl:res.data
            }
          )
          console.log(that.data.avatarUrl)
        }
      }
    )
  }

})