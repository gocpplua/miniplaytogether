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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getActivityAvatarUrl("activity")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
    console.log(e.detail.userInfo)
    var avatarUrlTmp = e.detail.userInfo.avatarUrl

    this.setData(
      {
        avatarUrl:avatarUrlTmp
      }
    )

    const todos = testDB.collection('activity')
    todos.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        avatarUrl: avatarUrlTmp
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