<template>
  <div class="my-container">

    <!-- 已登录头部 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            fit="cover"
            round
            :src="userInfo.photo"
          />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button
           size="mini"
           to="/user/profile"
           round>编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- /已登录头部 -->

    <!-- 未登录头部 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="">
        <span class="text">登录 / 注册</span>
      </div>
    </div>
    <!-- 未登录头部 -->

    <!-- 宫格导航 -->
    <van-grid class="grid-nav" :column-num="2" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- /宫格导航 -->

    <!-- 消息通知,小智同学，退出登录 -->
    <van-cell title="消息通知" is-link class="md8"/>
    <van-cell title="小智同学" is-link class="md9"/>
    <van-cell
      v-if="user"
      clickable
      title="退出登录"
      class="layout-cell"
      @click="onLogout"/>
    <!-- /消息通知,小智同学，退出登录 -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {}// 用户信息
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    // 如果用户登录了，则请求加载用户信息数据
    if (this.user) {
      this.loadUserInfo()
    }
  },
  methods: {
    onLogout () {
      // 退出提示
      // 在组件中需要使用this.$dialog
      this.$dialog.confirm({
        title: '确认退出吗？'
      })
        .then(() => {
          // 确认退出：清除登录状态（容器中的user + 本地存储中的user）
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          console.log('取消执行这里')
        })
    },
    async loadUserInfo () {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (error) {
        this.$toast('获取数据失败，请稍后重试')
      }
    }
  }
}
</script>
<style scoped lang="less">
.my-container{
  .header{
    height: 366px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }

  .not-login{
    display: flex;
    justify-content: center; //水平居中
    align-items: center;  //垂直居中
    .login-btn{
      display: flex;
      flex-direction: column;
      justify-content: center; //水平居中
      align-items: center;  //垂直居中
      .mobile-img{
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text{
        font-size: 28px;
        color: #fff
      }
    }
  }
  .user-info{
    .base-info{
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      height: 231px;
      .left{
        display: flex;
        align-items: center;
      }
      .avatar{
        width: 132px;
        height: 132px;
        margin-right: 23px;
        border: 4px solid #fff;
      }
      .name{
        font-size: 30px;
        color: #fff;
      }
    }
    .data-stats{
      display: flex;
      .data-item{
        height: 135px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count{
          font-size: 36px;
        }
        .text{
          font-size: 23px;
        }
      }
    }
  }
  .grid-nav{
    .grid-item{
      height: 141px;
      i.toutiao{
        font-size: 45px;
      }
      .toutiao-shoucang{
        color: #eb5253;
      }
      .toutiao-lishi{
        color: #ff9d1d;
      }
      span.text{
        font-size: 28px;
      }
    }
  }
  .layout-cell{
    height: 104px;
    text-align: center;
    color: #d86262;
    font-size: 30px;
  }.md8{
    margin-top: 9px;
  }
  .md9{
    margin-bottom: 9px;
  }
}
</style>
