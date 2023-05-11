<template>
  <van-button
        v-if="isFollowed"
        class="follow-btn"
        round
        size="small"
        :loading="loading"
        @click="onFollow"
    >已关注</van-button>
    <van-button
        v-else
        class="follow-btn"
        type="info"
        color="#3296fa"
        round size="small"
        :loading="loading"
        icon="plus"
    @click="onFollow"
    >关注</van-button>
</template>
<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  data () {
    return {
      loading: false

    }
  },
  // 自定义v-model的数据名称
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_follow'// 默认是input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object]
    }
  },
  methods: {
    async onFollow () {
      this.loading = true// 展示关注按钮的loading状态
      try {
        if (this.isFollowed) {
          // 已关注，点击取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注，点击关注
          await addFollow(this.userId)
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('update-is_followed', !this.value)
        this.$emit('update-is_follow', !this.isFollowed)
      } catch (error) {
        // console.log(error)
        let message = '操作失败，请重试'
        if (error.response && error.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false // 关闭关注按钮的loading状态
    }
  }
}
</script>
<style scoped>

</style>
