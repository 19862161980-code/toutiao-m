<template>
  <div class="update-birthday">
    <!--
        currentDate：双向绑定了日期选择器
            设置日期选择器的默认值
            同步日期选择器的日期
        minDate：可选的最小日期
        maxDate：可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  data () {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  props: {
    value: {
      tyepe: String,
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
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')

        await updateUserProfile({
          birthday: currentDate
        })

        // 更新视图
        this.$emit('input', currentDate)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>
<style scoped>

</style>
