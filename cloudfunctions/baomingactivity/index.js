// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  //env: 'test-52nlc'
  env: 'qiumingshan'
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID
  var myavatarUrl = event.avatarUrl
  var myavtivityid =  event.avtivityid
  console.log('baomingactivity myavtivityid:', myavtivityid)
  try {
    let userSignUpDatas = await db.collection('usersignupdb').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        db_avtivityid: myavtivityid,
        db_openid: openid,
        db_avatarUrl: myavatarUrl
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log('baomingactivity server success', res)
      },
      fail:function(err){
        console.log('baomingactivity server fail', err)
      },
      complete:function(res){
        console.log('baomingactivity server complete', res)
      }
    })
    console.log('baomingactivity userSignUpDatas', userSignUpDatas)

    const _ = db.command
    let activitydbActPeople = await db.collection('activitydb').where({
      db_avtivityid: myavtivityid
    }).update({
      data: {
        db_actpeople: _.inc(1)
      },
    })
    console.log('baomingactivity activitydbActPeople', activitydbActPeople, ' myavtivityid', myavtivityid)
    return userSignUpDatas
  } catch (e) {
    console.error(e)
    console.log('baomingactivity server catch err', e)
    return e
  }
} 