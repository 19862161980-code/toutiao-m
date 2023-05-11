<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'"
    >
    <van-icon
     slot="left"
     name="cross"
    @click="$emit('close')"
    />
    </van-nav-bar>

    <div class="scroll-weap">
        <!-- 当前评论项 -->
        <CommentItem :comment="comment"></CommentItem>
        <!-- /当前评论项 -->

        <!-- 评论的回复列表 -->
        <van-cell title="全部回复" />
        <CommentList
          :source="comment.com_id"
          type="c"
          :list="commentList"
        />
        <!-- /评论的回复列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="post-wrap">
        <van-button
         class="post-btn"
         size="small"
         round
         @click="isPostShow = true"
        >
            写评论
        </van-button>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
        <CommentPost
          :target="comment.com_id"
          @post-success="onPostSuccess"
        ></CommentPost>
    </van-popup>
    <!-- /发布评论 -->

  </div>
</template>
<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'
export default {
  name: 'CommentReply',
  data () {
    return {
      isPostShow: false,
      commentList: []// 评论回复列表
    }
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  methods: {
    onPostSuccess (data) {
      // 更新回复的数量
      // eslint-disable-next-line vue/no-mutating-props
      this.comment.reply_count++
      // 关闭弹层
      this.isPostShow = false
      // 将最新回复的内容展示到列表的顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>
<style scoped lang="less">
.scroll-weap{
    position: fixed;
    top: 92px;
    left: 0;
    right: 0;
    bottom: 88px;
    overflow-y: auto;
}
.post-wrap{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-top: 1px solid #d8d8d8;
    .post-btn{
        width: 60%;
    }
}
</style>
