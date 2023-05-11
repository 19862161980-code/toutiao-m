<template>
    <van-button
      :icon="value ? 'star' : 'star-o'"
      :class="{
        collected:value
      }"
      @click="onCollect"
      :loading="loading"
    />
</template>
<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  data () {
    return {
      loading: false
    }
  },
  props: {
    value: {
      type: Boolean,
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
        if (this.value) {
          // 已收藏点，击取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏，点击收藏
          await addCollect(this.articleId)
        }
        // 更新视图
        // 自定义事件修改数据并不是立即的
        this.$emit('input', !this.value)
        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast('操作失败，请重试')
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped>
.van-button__icon{
    color: #777;
}
.van-icon-star{
    color: #ffa500;
}
</style>
