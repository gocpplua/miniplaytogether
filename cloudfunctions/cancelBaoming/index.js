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
    let userSignUpDatas = await db.collection('usersignupdb').where({
      db_avtivityid: myavtivityid,
      db_openid: openid,
    }).remove()
    console.log('cancelBaoming userSignUpDatas', userSignUpDatas)

    const _ = db.command
    let activitydbActPeople = await db.collection('activitydb').where({
      db_avtivityid: myavtivityid
    }).update({
      data: {
        db_actpeople: _.inc(-1)
      },
    })
    console.log('cancelBaoming activitydbActPeople', activitydbActPeople, ' myavtivityid', myavtivityid)
    return userSignUpDatas
  } catch (e) {
    console.error(e)
    console.log('cancelBaoming server catch err', e)
    return e  }
}