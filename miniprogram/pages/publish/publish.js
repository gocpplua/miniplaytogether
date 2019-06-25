// pages/publish/publish.js
const testDB = wx.cloud.database({
  env: 'test-52nlc'
})
const pic = testDB.collection('pic')
const geo = testDB.collection('Geo')
const defaultAvatar = "https://b.yzcdn.cn/vant/icon-demo-1126.png"

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    strPublishAddPic: "../../images/create-collection.png",
    Avatar: defaultAvatar,
    Avatars: [
      {
        id: defaultAvatar,unique:"unique_1"
      },
      {
        id: defaultAvatar, unique: "unique_2"
      }, 
    ],
    markers: [{
      iconPath: "../../images/location.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],

    latitude: 23.099994,
    longitude: 113.324520,
    address: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key:'VORBZ-JTSK6-YJKST-MLPKU-RCRSZ-ZT'
    });
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

  onGetUserinfoAvatar:function()
  {
    console.log("onGetUserinfoAvatar")
  },

  bindGetUserInfo(e) {
    var that = this
    console.log(e.detail.userInfo)
    console.log(e.detail.userInfo.avatarUrl)
    that.setData(
      {
        Avatar: e.detail.userInfo.avatarUrl
      }
    )
  },

  onResetUserinfoAvatar:function(){
    this.setData({
      Avatar: defaultAvatar
    })
  },

  onInsertGeoPoint:function(){
    //作者：geekape
    //链接：https://juejin.im/post/5bbabb02e51d450e865838e4
    //来源：掘金
    geo.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: "learn cloud database",
        due: new Date("2018-09-01"),
        tags: [
          "cloud",
          "database"
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new testDB.Geo.Point(113, 23), //该对象上含有地理位置构造器:https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-client-api/database/db.geo.html
        done: false
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res + '成功插入')
      }
    })
  },
  onGetGeoPoint:function(){
    var that = this
    geo.get({
      success: function (res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        console.log(res.data)
        that.setData({
          markers: [{
            iconPath: "../../images/location.png",
            id: 0,
            latitude: 23.089994,
            longitude: 113.324520,
            width: 50,
            height: 50
          }],
        })
      }
    })
  },

  onOpenMap:function(){
    console.log(this.data.latitude)
    console.log(this.data.longitude)
    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
    })
  },
  onGetLocation:function(){
    var that = this
    wx.getLocation({
      success: function(res) {
        console.log(res)
        console.log(res.latitude)
        console.log(res.longitude)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      },
    })
  },
  onQQMapLocation:function(){
    qqmapsdk.search({
      keyword: '酒店',
      success: function (res) {
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  // 地址逆解析
  analysisTap: function (lat, lng) {
    let that = this;
    demo.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: function (res) {
        // console.log(res)
        let recommend = res.result.formatted_addresses.recommend
        let local = res.result.address
        that.setData({
          address: recommend,
          detail: local
        })
      }
    })
  },

  //视图改变
  bindchangeTap: function () {
    let that = this;
    let mapCtx = wx.createMapContext('mapQQ')
    mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res)
        let lat = res.latitude
        let lng = res.longitude
        qqmapsdk.reverseGeocoder({ // 根据经纬度获取地理位置名称：https://blog.csdn.net/chq1988/article/details/74685647
          location: {
            latitude:lat,
            longitude:lng
          },
          success:function(addressRes){
            var address = addressRes.result.formatted_addresses.recommend;
            console.log(address)
          }
        })
        that.setData({
          ["markers[0].latitude"]: lat,  //修改数组对象中的某一项
          ["markers[0].longitude"]: lng,
        })
      }
    })
  }
})
