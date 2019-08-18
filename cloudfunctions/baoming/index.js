// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-52nlc'
  //env:'qiumingshan'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  if (event.openid != "null")
  {
    openid = event.openid
  }
// 获取玩家是否已经报名
  const activityCollection = db.collection("activity")
  const _ = db.command
  return result = activityCollection.where({
    _openid: _.eq(openid)
  }).get()
}