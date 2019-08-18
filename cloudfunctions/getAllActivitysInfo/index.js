// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({
  env: 'test-52nlc'
  //env: 'qiumingshan'
})
const MAX_LIMIT = 20
// 云函数入口函数
exports.main = async (event, context) => {
  console.log('server api getAllActivitysInfo')

  // 先取出集合记录总数
  const countResult = await db.collection('activitydb').count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('activitydb').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  let nLen = tasks.length
  console.log('server api getAllActivitysInfo tasks len:', nLen)
  if (nLen <= 0) {
    return {
      data: [],
      errMsg: 'no activity',
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