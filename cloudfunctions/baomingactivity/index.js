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
  var myavatarUrl = event.avatarUrl
  var myavtivityid =  event.avtivityid
  try {
    return await db.collection('usersignupdb').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        db_avtivityid: myavtivityid,
        db_openid: openid,
        db_avatarUrl: myavatarUrl
      }
    })
  } catch (e) {
    console.error(e)
    return e
  }
}