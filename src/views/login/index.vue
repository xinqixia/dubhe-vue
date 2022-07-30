
<template>
  <div class="userLogin">
    <el-card class="titleCard">七夏授权系统</el-card>
    <el-card class="usrCard">
      <h1 class="usrTitle">登录</h1>
      <el-form :model="ruleForm" label-position="left" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model="ruleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <div style="text-align: center">
          <el-button @click="resetForm('ruleForm')" class="loginBut">重置</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" class="loginBut">登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@media screen and (max-width: 750px) {
  .titleCard{
    width: 70% !important;
  }
  .usrCard{
    width: 70% !important;
  }
}
.userLogin{
  height: 100%;
  width: 100%;
  background-size: 100%;
  display: flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  background: url("../../assets/img/bg.jpg");
  .titleCard{
    font-size: 30px;
    text-align: center;
    width: 30%;
    margin-bottom: 20px;
    background-color: #409EFF;
    border: 0;
  }
  .usrTitle{
    display: flex;
    justify-content:center;
    margin-bottom: 40px;
  }
}
.usrCard{
  border: 0;
  background-color:white;
  width: 30%;
}
</style>
<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    toRegister () {
      this.$router.push('/register')
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/login', this.ruleForm).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                message: '登陆成功',
                type: 'success'
              })
              sessionStorage.setItem('token', res.data.data.token)
              this.$router.push('/comMain')
              this.$axios.post('/getInfo',{
                token:sessionStorage.getItem('token')
              }).then((res) => {
                sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
                this.$store.commit('user/userImg',res.data.data.avatar)
                this.$store.commit('user/userInfo',JSON.stringify(res.data.data))
                sessionStorage.setItem('userImg',res.data.data.avatar)
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
