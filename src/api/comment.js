/*
评论请求模块
*/

import request from '@/utils/request'

/*
获取文章评论列表
*/
export const getComments = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    // GET参数使用params进行传递
    // 我们写的时候是对象，但是最终发给后端的数据是？
    // axios会把params对象转为key=value?key=value的格式放到url中发送
    params
  })
}

/*
评论点赞
*/
export const addCommentLike = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/*
取消评论点赞
*/
export const deleteCommentLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

/*
发布文章评论或品论回复
*/
export const addComment = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
