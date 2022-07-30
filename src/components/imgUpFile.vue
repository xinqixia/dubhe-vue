<template>
  <el-upload
    class="avatar-uploader"
    :action="action"
    :headers="myHeaders"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img :src="imageUrl" class="userImg" alt="无法显示"/>
  </el-upload>
</template>

<style scoped>
.avatar-uploader .el-upload {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 40px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.userImg {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 40px;
}
</style>

<script>
export default {
  data() {
    return {
      myHeaders: {token: sessionStorage.getItem('token')},
      action: this.$BaseUrl+"/upAvatar",
    };
  },
  computed:{
    userImg(){
      return this.$store.state.user.userImg?this.$store.state.user.userImg:sessionStorage.getItem('userImg')
    },
    imageUrl(){
     return this.$BaseUrl+'/uploads/images/'+(this.userImg?this.userImg:'userImg.png');
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      if(res.code===200){
        sessionStorage.setItem("userImg",res.data)
        this.$store.commit('user/userImg',res.data)
        this.userImg=res.data
        this.$message.success("修改成功")
      }else {
        this.$message({
          message: res.msg,
          type: 'error'
        });
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    }
  }
}
</script>

