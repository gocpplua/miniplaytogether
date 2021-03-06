// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  //env: 'test-52nlc'
  env: 'qiumingshan'
})
const MAX_LIMIT = 20
// 云函数入口函数
exports.main = async (event, context) => {
  var myavtivityid = event.avtivityid
  console.log('server api getAllUserSignUpInfo myavtivityid', myavtivityid)

  // 先取出集合记录总数
  const countResult = await db.collection('usersignupdb').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('usersignupdb').skip(i * MAX_LIMIT).limit(MAX_LIMIT).where
    ({
        db_avtivityid: myavtivityid
    }).get()
    tasks.push(promise)
  }

  let nLen = tasks.length
  console.log('server api getAllUserSignUpInfo tasks len:', nLen)
  if (nLen <= 0)
  {
    return {
      data: [],
      errMsg: 'no one signup activity',
    }
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}