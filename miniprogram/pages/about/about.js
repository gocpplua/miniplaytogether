// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
  /**
   * 根据id值打电话或者复制微信号
   */
  ontap:function(e){
    let id = e.target.dataset.id;
    if (id == "1") {
      wx.makePhoneCall({
        phoneNumber: '18800000000',
      });
    } else if (id == "2") {
      wx.setClipboardData({
        data: 'hhhhhhh',
        success:function(){
          wx.showToast({
            title: '已复制微信号到剪贴板',
          })
        }
      })
    }
  }
})