// pages/activity/activity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 30px; color: black;'
      },
      children: [{
        type: 'text',
        text: '当前报名人数:'
      }]
    }],
    activityInfo:"秋名山社 周三18-21",
    avatarUrl:[], //[{}]
    openid: '',
    isBaoming:false,
    baomingBtn:"点击报名",
    myActivitysInfo:{},
    allUserSignUpInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let translateData = JSON.parse(options.data) 
    console.log('activity onLoad', translateData)
    app.myActivitysInfo = 
    this.setData({
      myActivitysInfo: translateData
    })
    console.log(this.data.myActivitysInfo)
    var that = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.setData({
          openid: res.result.openid
        })
        console.log('login 成功')
        that.getAllUserSignUpInfo()
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
    console.log('activity onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('activity onShow') 
    if(this.data.openid != ""){
      console.log("onshow 中getAllUserSignUpInfo")
      this.getAllUserSignUpInfo()
    }
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
          title: this.data.myActivitysInfo.db_title,
          path:'/pages/activity/activity?param=' + 12
        }
      }
    }
    else{
      return {
        title: this.data.myActivitysInfo.db_title
      }
    }
  },

  onClickAddress:function(){
      wx.openLocation({
        latitude: this.data.myActivitysInfo.db_latitude,
        longitude: this.data.myActivitysInfo.db_longitude,
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
  
  //报名活动，调用远端云函数 baomingactivity
  baomingActivity:function(e){
    console.log('baomingActivity')
    console.log(e)

    if (this.data.myActivitysInfo.db_status == 2){
      wx.showModal({
        title: '来自秋名山的提示',
        confirmText:'返回大厅',
        content: '活动已经结束了，无法进行报名/取消报名操作喽！',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }

    // 玩家点击报名，需要先进行授权
    if (!e.detail.userInfo) {
      // 用户按了拒绝按钮
      wx.showToast({
        title: '请授权后进行报名',
      })
      return
    }

  // 已经授权
  // 得到玩家信息
    var myavatarUrl = e.detail.userInfo.avatarUrl // 玩家头像信息
    var myavtivityid = this.data.myActivitysInfo.db_avtivityid
    if (this.data.isBaoming) {
      // 玩家已经报名，此时点击这个按钮是取消报名的意思 
      var that = this
      wx.showLoading({
        title: "取消报名中..."
      })
      wx.cloud.callFunction({
        name: 'cancelBaoming', // 云函数名字
        data: {  // 云函数参数
          avtivityid: myavtivityid
        },
        success: res => {
          wx.hideLoading()
          console.log("cancelBaoming return succes")
          console.log(res)
          if (!res.result) {
            wx.showToast({
              title: '玩家没有报名过，取消失败',
            })
          }
          else {
            var result = JSON.stringify(res.result)
            console.log(result)
            wx.showToast({
              title: '取消报名成功',
            })
          }

          var dataTmp = []
          that.data.allUserSignUpInfo.filter(function (e) {
            if (e.db_openid != that.data.openid) {
              dataTmp.push(e)
            }
          })

          var text = "点击报名"
          if (that.data.myActivitysInfo.db_actpeople >= that.data.myActivitysInfo.db_planmaxpeople){
            text = "报名已满(请联系组织者)"
          }
          let myActivitysInfoTmp = that.data.myActivitysInfo
          myActivitysInfoTmp.db_actpeople = dataTmp.length
          that.setData(
            {
              isBaoming: false,
              baomingBtn: text,
              allUserSignUpInfo: dataTmp,
              myActivitysInfo: myActivitysInfoTmp
            }
          )
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [baomingactivity] 调用失败：', err)
        }
      })
    }
    else{
      // 报名
      var that = this
      wx.showLoading({
        title: "报名中..."
      })
      wx.cloud.callFunction({
        name: 'baomingactivity', // 云函数名字
        data: {  // 云函数参数
          avatarUrl: myavatarUrl,
          avtivityid: myavtivityid
        },
        success: res => {
          wx.hideLoading()
          console.log("baomingactivity return succes")
          console.log(res)
          if (!res.result){
            wx.showToast({
              title: '玩家已经报名过',
            })
          }
          else{
            var result = JSON.stringify(res.result)
            console.log(result)
            wx.showModal({
              title: '差一步就报名成功',
              content: '请及时加发布者陈琦微信(zjut-cq)，将你拉入活动群,否则报名无效',
              showCancel:false,
              success(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }

          var usersignupinfo = {
            db_avatarUrl: myavatarUrl,
            db_avtivityid: myavtivityid,
            db_openid: that.data.openid
          }
          that.data.allUserSignUpInfo.push(usersignupinfo)
          console.log(that.data.allUserSignUpInfo)
          let myActivitysInfoTmp = that.data.myActivitysInfo
          myActivitysInfoTmp.db_actpeople = that.data.allUserSignUpInfo.length
          that.setData(
            {
              isBaoming: true,
              baomingBtn: "取消报名",
              allUserSignUpInfo: that.data.allUserSignUpInfo,
              myActivitysInfo: myActivitysInfoTmp
            }
          )

        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [baomingactivity] 调用失败：', err)
        }
      })
    }
  },
  
  // 获取本次活动所有玩家报名信息
  getAllUserSignUpInfo:function(){
    console.log('getAllUserSignUpInfo')

    var that = this
    var myavtivityid = this.data.myActivitysInfo.db_avtivityid
    wx.showLoading({
      title:"报名信息更新中..."
    })
    wx.cloud.callFunction({
      name: 'getAllUserSignUpInfo', // 云函数名字
      data: {  // 云函数参数
        avtivityid: myavtivityid
      },
      success: res => {
        console.log("getAllUserSignUpInfo return succes:")
        console.log(res)
        if (!res.result) {
          console.log("getAllUserSignUpInfo没有获取到数据1")
          wx.hideLoading()
        }
        var data = res.result.data
        if (data.length == 0){
          console.log("getAllUserSignUpInfo没有获取到数据2")
          wx.hideLoading()
          return
        }
        console.log(JSON.stringify(data))
        var allUserSignUpInfoTmp = []
        var bBaoming = false
        var nBaomigCount = data.length
        for (let i = 0; i < nBaomigCount; i++) {
          var item = data[i]
          console.log(item);

          // 本人是否报名
          if (that.data.openid == item.db_openid){
            bBaoming = true
          }
          var usersignupinfo = {
            db_avatarUrl: item.db_avatarUrl,
            db_avtivityid: item.db_avtivityid,
            db_openid: item.db_openid
          }
          allUserSignUpInfoTmp.push(usersignupinfo)
        }

        var text = "取消报名"
        if (!bBaoming)
        {
          if (that.data.myActivitysInfo.db_actpeople >= that.data.myActivitysInfo.db_planmaxpeople){
            text = "报名已满(请联系组织者)"
          }
          else
          {
            text = "点击报名"
          }
        }
        that.setData({
          isBaoming: bBaoming,
          baomingBtn: text,
          allUserSignUpInfo: allUserSignUpInfoTmp,
        })
        console.log("getAllUserSignUpInfo 并 设置成功，数据如下")
        console.log(that.data.allUserSignUpInfo)
        wx.hideLoading()

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '更新报名信息失败,请重新打开小程序',
        })
        console.error('[云函数] [getAllUserSignUpInfo] 调用失败：', err)
      }
    })
  }
})