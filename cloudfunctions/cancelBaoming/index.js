// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  //env: 'test-52nlc'
  env: 'qiumingshan'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  var myavtivityid = event.avtivityid
  // 获取玩家是否已经报名
  try {
    return await db.collection('usersignupdb').where({
      db_avtivityid: myavtivityid,
      db_openid: openid,
    }).remove()
  } catch (e) {
    console.error(e)
  }
}