<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isDeleteShow = true" />
    </van-cell>
    <van-cell
     :title="item"
     v-for="(item, index) in searchHistories"
     :key="index"
     @click="onSearchItemClick(item, index)"
     >
        <van-icon
         v-show="isDeleteShow"
         name="close" />
    </van-cell>
  </div>
</template>
<script>

export default {
  name: 'SearchHistory',
  data () {
    return {
      isDeleteShow: false// 控制删除展示状态
    }
  },
  props: {
    /*
    prop数据
      prop是受父组件数据影响的
      如果式普通数据（数字，字符串，布尔值）绝对不能修改，即便改了也不会传导给父组件
      如果式引用类型数据（数组，对象）可以修改，但不可以重新赋值
    */
    searchHistories: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSearchItemClick (item, index) {
      if (this.isDeleteShow) {
        // 删除状态，删除历史记录数据
        // eslint-disable-next-line vue/no-mutating-props
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态，直接进入搜索
        this.$emit('search', item)
      }
    }
  }
}
</script>
<style scoped>

</style>
