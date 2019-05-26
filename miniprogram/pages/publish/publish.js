// pages/publish/publish.js
const testDB = wx.cloud.database({
  env: 'test-52nlc'
})
const pic = testDB.collection('pic')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    strPublishAddPic: "../../images/create-collection.png"
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

  onPublishAddPic:function(){
    var that = this
    console.log("onPublishAddPic")
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log("上传的图片路径:" + tempFilePaths[0])
        wx.cloud.uploadFile({
          cloudPath: 'qq.jpg', // 上传至云端的路径
          config:{ // 上传到指定的存储位置
            env:"test-52nlc"},
          filePath: tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log("云数据库中图片名称:" + res.fileID)
            console.log(res)

            wx.cloud.getTempFileURL({
              fileList: [res.fileID],
              success: res => {
                // get temp file URL
                console.log(res.fileList)
                for(var value in res.fileList)
                {
                  console.log(res.fileList[0])
                  var tempFileURL = res.fileList[0].tempFileURL;
                  console.log("temp file utl:" + tempFileURL )
                  pic.add({
                    data: {
                      strPath: tempFileURL
                    },

                    success(res) {
                      console.log("onPublishAddPic 上传成功！")
                      console.log(res)
                    },
                    fail(err) {
                      console.log("onPublishAddPic 上传失败！")
                      console.log(err)
                    }
                  })
                }
              },
              fail: err => {
                // handle error
              }
            })  
          },
          fail: console.error
        })
      }
    })
  },

  onInsertTestPic:function(){
    pic.add({
      data:{
        strPath:"qq"
      },

      success(res){
        console.log(res)
      },
      fail(err){
        console.log(err)
      }
    })
  },

  onGetTestPic: function () {
    var that = this
    pic.where({
      _openid: "oG0Eo46Lf6j-nXHkmqMckGshfn7"
    }).get({
      success(res) {
        // res.data 包含该记录的数据
        console.log(res)
        console.log(res.data)
        console.log(res.data[0])
        var exp = (res.data[0]);
        if (typeof (exp) == "undefined") {
          console.log("无图片")
        }else{
            that.setData({
              strPublishAddPic: res.data[0].strPath + ' ',
            })
        }
      }
    })
  },

})