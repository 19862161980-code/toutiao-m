<template>
  <div class="home-container">
     <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
      class="search-btn"
       slot="title"
       type="info"
       size="small"
       round
       icon="search"
       to="/search"
       >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 频道列表 -->
    <!--
      通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。
      通过 animated 属性可以开启切换标签内容时的转场动画。
      通过 swipeable 属性可以开启滑动切换标签页。
     -->
    <van-tabs class="channel-tabs" v-model="active" swipeable animated>
      <van-tab
       :title="channel.name"
       v-for="channel in channels"
       :key="channel.id"
       >
       <!-- 文章列表 -->
       <ArticleList :channel = "channel"></ArticleList>
       <!-- /文章列表 -->
       </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hanmburger-btn"
        @click="isChannelEditShow = true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
    <ChannelEdit
     :my-channels="channels"
     :active="active"
     @update-active="onUpdateActive"
     />
    </van-popup>
    <!-- /频道编辑弹出层 -->
  </div>
</template>
<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false// 控制编辑频道弹出层的显示状态
    }
  },
  computed: {
    ...mapState(['user'])
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  methods: {
    async loadChannels () {
      try {
        // const { data } = await getUserChannels()
        // this.channels = data.data.channels

        let channels = []

        if (this.user) {
          // 已登录，请求获取用户频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        } else {
          // 未登录，判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAO_CHANNELS')
          // 有，直接拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有，请求获取默认频道列表
            const { data } = await getUserChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (error) {
        this.$toast('获取频道数据失败')
      }
    },
    onUpdateActive (index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      // 数据更新完成之后，让弹层自动关闭
      this.isChannelEditShow = isChannelEditShow
    }
  },
  created () {
    this.loadChannels()
  }
}
</script>
<style scoped lang="less">
.home-container{
  padding-bottom: 100px;
  padding-top: 174px;
  // 由于直接写.van-nav-bar__title不生效，所以使用深度选择器
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }

  .search-btn{
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon{
      font-size: 32px;
    }
  }

  .channel-tabs{
    /deep/ .van-tabs__wrap{
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    /deep/ .van-tab{
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }
    /deep/ .van-tab--active{
      color: #333
    }
    /deep/ .van-tabs__nav{
      padding-bottom: 0;
    }
    /deep/ .van-tabs__line{
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
  }

  .placeholder{
    flex-shrink: 0;//不参与剩余空间的计算
    width: 50px;
    height: 82px;
    right: 0;
  }

  .hanmburger-btn{
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.9;
    i.toutiao-gengduo{
      font-size: 33px;
    }
    &:before{
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
}

</style>
