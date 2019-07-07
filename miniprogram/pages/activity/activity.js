// pages/activity/activity.js
const testDB = wx.cloud.database({
  env: 'test-52nlc'
})
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activityPicPath: "../../images/create-collection.png",
    activityInfo:"秋名山社 周三18-21",
    avatarUrl:[],
    openid: '',
    isBaoming:false,
    baomingBtn:"点击报名"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    console.log(options)
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
    this.getActivityAvatarUrl("activity")
    this.queryIsBaoming()
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
  onShareAppMessage: function (res) {
    console.log(res)
    // res 有两个参数：
    //from是两个转发来源。一个是右上角menu，一个是转发button；
    //target是一个对象，from是menu，则target就是undefind，from是button，那就是button本身；
    if (res.from == 'button'){
      if(res.target.id == 1){
        return {
          title: this.data.activityInfo,
          path:'/pages/activity/activity?param=' + 12
        }
      }
    }
    else{
      return {
        title: this.data.activityInfo
      }
    }
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
    console.log(e)
    if (!e.detail.userInfo)
    {
      // 用户按了拒绝按钮
      wx.showToast({
        title: '请授权后进行报名',
      })
      return
    }
    if(this.data.isBaoming){
      wx.showToast({
        title: '已经报名，请勿重复报名',
      })
      return
    }

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
    console.log(this.data)

    var that= this
    wx.cloud.callFunction({
      name: 'baoming',
      success: res => {
        wx.showToast({
          title: '报名成功',
        })
        that.setData(
          {
            isBaoming: true,
            baomingBtn:"已报名"
          }
        )
        console.log(JSON.stringify(res.result))
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })

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
          console.log("getActivityAvatarUrl success")
          console.log(res)
          that.setData(
            {
              avatarUrl:res.data
            }
          )
          console.log(that.data.avatarUrl)
        }
      }
    )
  },
  
  queryIsBaoming:function(){
    var that = this
    wx.cloud.callFunction({
      name: 'baoming',
      data:{
        openid:"null"
      },
      success: res => {
        //wx.showToast({
          //title: '调用成功',
        //})
        console.log(JSON.stringify(res.result))
        var result = res.result
        var isExist = false
        if (result && result.data.length != 0) {
          isExist = true
        }
        if (!isExist) {
          console.log("玩家未报名")
          that.setData(
            {
              isBaoming:false,
              baomingBtn: "点击报名"
            }
          )
        }
        else {
          console.log("玩家已经报名")
          console.log(result.data[0])
          console.log(result.data[0].avatarUrl)
          that.setData(
            {
              isBaoming: true,
              baomingBtn: "已报名"
            }
          )
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  }
})