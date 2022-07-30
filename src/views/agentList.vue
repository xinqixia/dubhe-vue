<template>
  <div>
<!--    代理授权的弹出框-->
    <el-dialog title="代理授权" :visible.sync="editAgentDiag" width="30%">
      <el-select v-model="agentPower" multiple placeholder="请选择授权应用">
        <el-option
          v-for="item in appIdData"
          :key="item.appid"
          :label="item.appName"
          :value="item.appid">
        </el-option>
      </el-select>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editAgentDiag = false">取 消</el-button>
        <el-button type="primary" @click="subAgentPower">确 定</el-button>
      </div>
    </el-dialog>

<!--    注册代理的弹出框-->
    <el-dialog title="注册代理" :visible.sync="addAgentDiag" width="40%">
      <el-form ref="form" :model="addAgent" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addAgent.username" style="width:55%"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addAgent.password" style="width:55%"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="addAgent.email" style="width:55%"></el-input>
        </el-form-item>
        <el-form-item label="代理授权">
          <el-select v-model="addAgent.agentPower" multiple placeholder="请选择授权应用">
            <el-option
              v-for="item in appIdData"
              :key="item.appid"
              :label="item.appName"
              :value="item.appid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAgentDiag = false">取 消</el-button>
        <el-button type="primary" @click="subAddAgent">注册</el-button>
      </div>
    </el-dialog>

<!--代理列表-->
    <el-card style="margin-top: 20px">
      <el-button type="primary" size="medium" @click="toAddAgent" :disabled="isAdmin">注册代理</el-button>
      <el-table
        v-loading="loading"
        :data="agentListPage.records"
        :row-key="agentListPage.records.id"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="头像"
          width="100">
          <template slot-scope="scope">
            <img class="usrImg" :src="baseUrl+'/uploads/images/'+(scope.row.avatar?scope.row.avatar:'userImg.png')" alt="暂无">
          </template>
        </el-table-column>
        <el-table-column
          label="昵称"
          prop="username">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="email">
        </el-table-column>
        <el-table-column
          label="上级代理"
          prop="identity">
        </el-table-column>
        <el-table-column
          align="right">
          <template slot-scope="scope">
            <el-button
              :disabled="isAdmin"
              size="mini"
              @click="editAgent(scope.row)">授权</el-button>
            <el-button
              size="mini"
              type="danger"
              :disabled="isAdmin"
              @click="delAgent(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="agentListPage!=null"
        class="userPag"
        @current-change="current"
        background
        layout="total,prev, pager, next"
        :current-page="agentListPage.current"
        :page-size="agentListPage.size"
        :total="agentListPage.total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>

export default {
  data(){
    return {
      //baseUrl:this.$FileUrl,
      baseUrl:this.$BaseUrl,
      loading:true,  //加载状态
      agentListPage:null,  //代理列表
      isAdmin:JSON.parse(sessionStorage.getItem('userInfo')).name!=='admin',
      editAgentDiag:false, //编辑弹出框
      addAgentDiag:false,  //注册弹出框
      agentPower:null, //代理的授权应用
      username:null,    //代理姓名
      appIdData:null,    //全部应用数据
      addAgent:{
        username:null,
        password:null,
        email:null,
        agentPower:null,
      }     //注册代理数据
    }
  },
  created () {
    this.getAgentList(1);
  },
  methods:{
    /*删除代理*/
    delAgent(row){
      this.$axios.get('/user/delAgent?username='+row.username).then((res)=>{
        if(res.data.code===200) {
          this.$message.success('删除成功')
          this.current(this.agentListPage.current)
        }
      })
    },
    /*注册代理*/
    subAddAgent(){
      this.$axios.post('/user/addAgent',this.addAgent).then((res)=>{
        if(res.data.code===200) {
          this.$message.success('注册成功')
          this.addAgentDiag=false
          this.current(this.agentListPage.current)
        }
      })
    },
    /*打开注册代理弹框*/
    toAddAgent(){
      this.getAppList()
      this.addAgentDiag=true
    },
    /*变更授权*/
    subAgentPower(){
      console.log(this.agentPower)
      this.$axios.post('/user/editPower',{
        username:this.username,
        appIdArray:this.agentPower
      }).then((res=>{
        if(res.data.code===200){
          this.$message.success('授权成功')
          this.editAgentDiag=false
        }
      }))
    },
    /*查询代理与应用数据*/
    editAgent(row){
      this.getAgentPower(row.username)
      this.getAppList()
      this.editAgentDiag=true
      this.username=row.username
    },
    /*请求应用数据*/
    async getAppList(){
      const {data:res} = await this.$axios.get('/user/getAppId')
      this.appIdData=res.data
    },
    /*请求代理权限*/
    async getAgentPower(username){
      let agentPower=[]
      const {data:res} =await this.$axios.get('/user/getAgentPower?username='+username)
      for(let item in res.data) {
        agentPower.push(res.data[item].appid)
      }
      this.agentPower=agentPower
    },
    /*请求代理列表数据*/
    getAgentList(current){
      this.$axios.get('/user/getAgentList?current='+current).then((res)=>{
        this.agentListPage=res.data.data
        this.loading=false
      })
    },
    /*当前页*/
    current(currentPage) {
      this.getAgentList(currentPage)//点击第几页
    },
  }
}
</script>
<style scoped>
@media screen and (max-width: 750px) {
  /deep/.el-input{
    width:90% !important;
  }
  /deep/.el-dialog {
    width: 90% !important;
  }
  .dateForm{
    height: 450px;
  }
}
.userPag{
  margin-top: 10px;
  margin-bottom: 10px;
  float: right;
}
.usrImg{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
</style>
