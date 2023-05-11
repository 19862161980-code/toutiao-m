<template>
  <van-button
      :icon="value === 1 ? 'good-job' : 'good-job-o'"
      :class="{
        liked:value === 1
      }"
      @click="onCollect"
      :loading="loading"
    />
</template>
<script>
import { addLike, deleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞，点击取消点赞
          await deleteLike(this.articleId)
        } else {
          // 未点赞，点击点赞
          await addLike(this.articleId)
          status = 1
        }
        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast.fail('操作失败，请重试')
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="less">
.van-button__icon{
    color: #777;
}
.van-icon-good-job{
    color: #e5645f;
}
</style>
