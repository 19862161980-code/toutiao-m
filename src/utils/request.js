/*
请求模块
*/
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

/* const jsonStr = '{"art_id":15522660048777897867}'

console.log(JSON.parse(jsonStr)) // 15522660048777898000
console.log(JSONBig.parse(jsonStr))// BigNumber对象

// 使用的时候需要把BigNumber类型的数据转为字符串来使用
console.log(JSONBig.parse(jsonStr).art_id.toString())// 15522660048777897867

console.log(JSON.stringify(JSONBig.parse(jsonStr)))// {"art_id":"15522660048777897867"}
console.log(JSONBig.stringify(JSONBig.parse(jsonStr)))// {"art_id":15522660048777897867}
 */

// 可以处理数据中超出JavaScript安全整数范围的问题
// JSONBig.parase()//把JSON格式的字符串转为JavaScript
// JSONBig.stringfiy()//把JSON对象转换为JSON格式的字符串

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://toutiao.itheima.net',

  // 自定后端返回的原始数据
  // data：后端返回的原始数据，说白了就是JSON格式的字符串
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (error) {
      return data
    }
    // axios默认会在内部这样处理后端返回的数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么，请求发起会经过这里
  // config：本次请求的请求配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 注意：这里务必要返回confing配置对象，否则请求就停在这里，出不去了
  return config
}, function (error) {
  // 如果请求出错了（还没有发出去）会进入这里
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 响应拦截器

export default request
