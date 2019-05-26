// pages/scanCode/scanCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    transitionShow:false
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
   * 扫码加书
   */
  onScanCode : function(){
    console.log("scancode")
    wx.scanCode({
      onlyFromCamera:true,
      scanType: ['barCode'], // 图书上的码是一维码，所以这边直接设置为：barCode
      success:res => {
        console.log(res)
        console.log(res.result) // ISBN码
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'bookinfo',
          // 传给云函数的参数
          data: {
            isbn:res.result
          },
          success(res) {
            console.log('call bookinfo success')
            console.log(res) 

            const db = wx.cloud.database()
            const todos = db.collection('todo')
            todos.add({
              // data 字段表示需新增的 JSON 数据
              data: res
            }).then(res => {
                console.log(res)
              })
          },
          fail(err){
            console.error(err)
          }
        })
      },
      fail:err => {
        console.log(err)
      }
    })
  },

onClose() {
    this.setData({ show: false });
    console.log("蒙层关闭")
  },

  onPopup(){
    this.setData({ show: true });
    console.log("蒙层显示")
  },

  onTransitionShow() {
    this.setData({ transitionShow: true });
    console.log("动画显示")
  },

  onTransitionClose() {
    this.setData({ transitionShow: false });
    console.log("动画关闭")
  },
  


})