<template>
  <div class="article-list">
    <!--
        List 组件通过 loading 和 finished 两个变量控制加载状态，
        当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
        若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

        - `load 事件`：
            + List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
            + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
        - `loading 属性`：控制加载中的 loading 状态
            + 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
            + 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件
        - `finished 属性`：控制加载结束的状态
            + 在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
            + 所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh
     v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      @refresh="onRefresh"
      success-duration="1500"
      >
      <van-list
        v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
        >
        <!-- <van-cell
         v-for="(article, index) in list"
          :key="index"
          :title="article.title" /> -->
          <ArticleItem
            v-for="(article, index) in list"
            :key="index"
            :article = "article"
          />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/arcticle-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      typeof: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading状态
      finished: false, // 控制数据加载结束的状态：当所有数据加载完毕之后，finished为true，将不再触发加载更多
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 默认是false，控制列表失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的状态
      refreshSuccessText: '刷新成功'// 下拉刷新成功提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用onLoad
    /* onLoad () {
      // 1、请求获取数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        // 2、把请求结果数据放到list数组中
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }

        // 3、本次数据加载结束之后，要把加载状态设置为结束
        // loading关闭之后才能触发下一次的加载更多
        this.loading = false

        // 4、判断数据是否全部加载完成
        if (this.list.length >= 40) {
          // 如果没有数据了，把finished设置为true，之后不再触发加载更多
          this.finished = true
        }
      }, 1000)
    } */
    async onLoad () {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          // 简单理解就是请求数据的页码
          // 请求第一页数据：当前最新时间戳
          // 用户请求之后数据的时间戳，会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now()
        })

        // 模拟随机失败的情况
        /* if (Math.random() > 0.5) {
          JSON.parse('asdaccccccccc')
        } */

        // 2、把请求结果数据放到list数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个个拿出来
        this.list.push(...results)
        // 3、本次数据加载结束之后，要把加载状态设置为结束
        // loading关闭之后才能触发下一次的加载更多
        this.loading = false
        // 4、判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了将finfished设置为true，不再load加载更多
          this.finished = true
        }
      } catch (error) {
        // 展示错误提示状态
        this.error = true

        // 请求失败了,loading也需要关闭
        this.finished = false
      }
    },
    // 当下拉刷新的时候，会触发该函数
    async onRefresh () {
      try {
        // 1、请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道id
          timestamp: Date.now()// 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
        })

        // 模拟随机失败的情况
        /* if (Math.random() > 0.2) {
          JSON.parse('asdaccccccccc')
        } */

        // 2、将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)
        // 3、关闭下来刷新的loading状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.isreFreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>
<style scoped lang="less">
.article-list{
  height: 79vh;
  overflow-y: auto;
}
</style>
