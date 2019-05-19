// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

var rp = require('request-promise')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('bookinfo')

  var res = rp('https://douban.uieee.com/v2/movie/coming_soon').then(html => {
    return html;
  }).catch(err => {
    console.log(err)
  })

  return res
}