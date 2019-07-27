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
    activityInfo:"秋名山社 周三18-21",
    avatarUrl:[], //[{}]
    openid: '',
    isBaoming:false,
    baomingBtn:"点击报名",
    myAvatarUrl:'',
    myActivitysInfo:[]
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
    /* 获取到活动的详细信息 */
    this.getActivity()

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
        latitude: this.data.myActivitysInfo[0].db_latitude,
        longitude: this.data.myActivitysInfo[0].db_longitude,
      })
    },

  open:function(){
    console.log("open")
  },

  callwechat:function(){
    console.log('callwechat')
  },

  callphone:function(){
    wx.makePhoneCall({
      phoneNumber:'18767122273',
      success:function(){
        console.log("拨打电话成功")
      },
      fail:function(){
        console.log("拨打电话失败")
      }
    })
  },

  bindGetUserInfo:function(e) {
    console.log('bindGetUserInfo')
    console.log(e)
    if (this.data.isBaoming){
      // 玩家已经报名，此时点击这个按钮是取消报名的意思 
      var that = this
      wx.cloud.callFunction({
        name: 'cancelBaoming',
        success: res => {
          wx.showToast({
            title: '取消报名成功',
          })
          var dataTmp = []
          that.data.avatarUrl.filter(function (e) {
            if (e.avatarUrl != that.data.myAvatarUrl) {
              dataTmp.push(e)
            }
          })
          that.setData(
            {
              isBaoming: false,
              baomingBtn: "点击报名",
              myAvatarUrl:'',
              avatarUrl:dataTmp
            }
          )
          console.log(JSON.stringify(res.result))
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [cancelBaoming] 调用失败：', err)
        }
      })
    }
    else{
      // 玩家没有报名，此时点击这个按钮是报名的意思
      if (!e.detail.userInfo) {
        // 用户按了拒绝按钮
        wx.showToast({
          title: '请授权后进行报名',
        })
        return
      }
      var avatarUrlTmp =
      {
        avatarUrl: e.detail.userInfo.avatarUrl
      }


      this.data.avatarUrl.push(avatarUrlTmp)
      console.log(this.data.avatarUrl)
      this.setData(
        {
          avatarUrl: this.data.avatarUrl
        }
      )
      console.log(this.data)

      var that = this
      wx.cloud.callFunction({
        name: 'baoming',
        success: res => {
          wx.showToast({
            title: '报名成功',
          })
          that.setData(
            {
              isBaoming: true,
              baomingBtn: "取消报名"
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
          avatarUrl: e.detail.userInfo.avatarUrl,
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log("添加到Activity")
          console.log(res)
          that.setData({
            myAvatarUrl: e.detail.userInfo.avatarUrl
          })
        },
        fail: function (res) {
          console.error(err)
        }
      })
    }


    
  },

  // 获取所有的活动信息
  getActivity:function(){
    var that = this
    const activity = testDB.collection("activitydb")
    activity.get({
      success:function(res){
        console.log("getActivity success")
        console.log(res.data[0])
        var myActivityInfoTmp = res.data[0]
        var myActivitysInfoTmp = []
        myActivitysInfoTmp.push(myActivityInfoTmp)
        that.setData({
          myActivitysInfo: myActivitysInfoTmp
        })
        console.log(that.data.myActivitysInfo)
      }
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
        openid:"null",
      },
      success: res => {
        //wx.showToast({
          //title: '调用成功',
        //})
        console.log("查询玩家报名状态成功")
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
              baomingBtn: "点击报名",
              myAvatarUrl:''
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
              baomingBtn: "取消报名",
              myAvatarUrl: result.data[0].avatarUrl
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