<template>
  <div class="update-gender">
    <van-picker
      title="标题"
      show-toolbar
      :default-index="value"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onPickerChange"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  data () {
    return {
      columns: ['男', '女'],
      locaGender: this.value
    }
  },
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  methods: {
    async onConfirm () {
      this.$toast.loading({
        message: '保存中……',
        forbidClick: true, // 禁止背景点击
        duration: 0// 持续展示
      })
      try {
        const locaGender = this.locaGender

        await updateUserProfile({
          gender: locaGender
        })

        // 更新视图
        this.$emit('input', locaGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    },
    onPickerChange (picker, value, index) {
      this.locaGender = index
    }
  }
}
</script>
<style scoped>

</style>
