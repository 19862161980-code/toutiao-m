<template>
  <div class="search-suggestion">
    <van-cell
     icon="search"
     v-for="(text, index) in suggestions"
     :key="index"
     @click="$emit('search', text)"
     >
      <div slot="title" v-html="highlight(text)"></div>
     </van-cell>

     <!-- 双花括号会直接输出纯文本内容 -->
     <!-- <div>{{ htmlStr }}</div> -->

     <!-- 使用v-html指令可以绑定渲染带有HTML标签的字符串 -->
     <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>
<script>
import { getSearchSuggestions } from '@/api/search'
// 按需加载有好处：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'SearchSuggestion',
  data () {
    return {
      suggestions: [] // 联想建议数据列表
      // htmlStr: 'Hello <span style="color: red">World</span>'
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  watch: {
    searchText: {
      // 当searchText发生改变的时候，就会调用handler函数
      // 注意：handler函数名称是固定的
      // value是更新后的最新数据
      // async handler (value) {
      //   this.loadSearchSuggestions(value)
      // },
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true// 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式//中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态创建正则表达式，可以手动new RegExp
      // RegExp正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串
      const reg = new RegExp(this.searchText, 'gi')
      if (text !== null) {
        return text.replace(reg, highlightStr)
      }
    }
  }
}
</script>
<style scoped lang="less">
.search-suggestion{
  /deep/ span.active{
    color: #3296fa;
  }
}
</style>
