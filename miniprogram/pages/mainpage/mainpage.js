// pages/mainpage/mainpage.js
// 功能点：
// 1、轮播图：使用swiper

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityTypePicPath: '../../images/mainpage/tubu.png',
    myActivitysInfo:[], // 所有活动数据
    openid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 每一次打开界面的时候获取所有活动的信息
    console.log('mainpage onLoad', options)
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.setData({
          openid: res.result.openid
        })
        console.log('mainpage login 成功')
        that.getActivity()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败，请检查是否有部署 login 云函数',
        })
        console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('mainpage onShow')
    if (this.data.openid != "") {
      console.log("onshow 中 getAllActivitysInfo")
      this.getActivity()
    }
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

  /**
   * 用户点击报名
   */
  onSignUp:function(){

  },

  // 获取所有的活动信息
  getActivity:function(){
    var that = this
    wx.showLoading({
      title: "报名信息更新中..."
    })
    wx.cloud.callFunction({
      name: 'getAllActivitysInfo', // 云函数名字
      success: res => {
        console.log("getActivity return succes:")
        console.log(res)
        if (!res.result) {
          console.log("getActivity 没有获取到数据1")
          wx.hideLoading()
        }
        var data = res.result.data
        if (data.length == 0) {
          console.log("getActivity 没有获取到数据2")
          wx.hideLoading()
          return
        }
        console.log(JSON.stringify(data))
        let dataLen = data.length
        console.log("共查询到活动数目:", dataLen)
        var myActivitysInfoTmp = []
        for (let i = dataLen - 1; i >= 0; i--) {
          console.log("第", i + 1, "条:", data[i])
          myActivitysInfoTmp.push(data[i])
        }
        that.setData({
          myActivitysInfo: myActivitysInfoTmp
        })
        wx.hideLoading()
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取活动失败,请重新打开小程序',
        })
        console.error('[云函数] [getAllActivitysInfo] 调用失败：', err)
      }
    })
  },

  clickOneActivity:function(event){
    console.log("clickOneActivity", event)
    console.log("activity _id:", event.currentTarget.dataset.activityinfo._id)
    wx.navigateTo({
      url: '../activity/activity?data=' + JSON.stringify(event.currentTarget.dataset.activityinfo),
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        console.log(res)
      },
      fail:function(res){
        console.log(res)
      }
    })
  },

  // 客服
  handleContact(e) {
    console.log("handleContact");
    console.log(e.detail.path)
    console.log(e.detail.query)
  }
})