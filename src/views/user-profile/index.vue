<template>
  <div class="useer-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <input
     type="file"
     hidden
     ref="file"
     @change="onFileChange"
    >

    <!-- 个人信息 -->
    <van-cell
     class="photo-cell"
     title="头像"
     center
     is-link
     @click="$refs.file.click()"
    >
        <van-image
          class="avatar"
          fit="cover"
          round
          :src="user.photo"
        />
    </van-cell>
    <van-cell
     title="昵称"
     @click="isUpdateNameShow = true"
     :value="user.name"
     is-link/>
    <van-cell
     title="性别"
     :value="user.gender === 0 ? '男'  :  '女'"
     is-link
     @click="isUpdateGenderShow = true"
    />
    <van-cell
     title="生日"
     @click="isUpdateBirthdayShow = true"
     :value="user.birthday"
     is-link/>
    <!-- /个人信息 -->

    <!-- 编辑昵称弹出层 -->
    <van-popup
     v-model="isUpdateNameShow"
     position="bottom"
     style="height: 100%;">
        <UpdateName
          v-if="isUpdateNameShow"
          @close="isUpdateNameShow = false"
          v-model="user.name"
        />
    </van-popup>
    <!-- /编辑昵称弹出层 -->

    <!-- 编辑性别 -->
    <van-popup
     v-model="isUpdateGenderShow"
     position="bottom"
    >
        <UpdateGender
          v-if="isUpdateGenderShow"
          v-model="user.gender"
          @close="isUpdateGenderShow = false"
        />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup
     v-model="isUpdateBirthdayShow"
     position="bottom"
    >
        <UpdateBirthday
          v-if="isUpdateBirthdayShow"
          v-model="user.birthday"
          @close="isUpdateBirthdayShow = false"
        />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup
     v-model="isUpdatePhotoShow"
     position="bottom"
     style="height: 100%;"
    >
        <UpdatePhoto
          v-if="isUpdatePhotoShow"
          :img="img"
          @close="isUpdatePhotoShow = false"
          @update-photo="user.photo = $event"
        />
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import UpdateGender from './components/update-gender.vue'
import UpdateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'
export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}, // 用户的个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null// 预览的图片
    }
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('数据获取失败')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)

      //   展示预览图片弹出层
      this.isUpdatePhotoShow = true

      //   file-input 如果选了同一个文件，不会触发change时间
      // 解决：每次使用完毕。把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>
<style scoped lang="less">
.useer-profile{
    .avatar{
        width: 60px;
        height: 60px;
    }
    .van-popup{
        background-color: #f5f7f9;
    }
}
</style>
