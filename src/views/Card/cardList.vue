<template>
  <div>
    <el-card style="margin-bottom: 15px;margin-top: 20px;">
<!--      条件第一行-->
      <div class="myCard">
        <p>主人账号</p>
        <el-input style=" margin-top: 8px"
                  class="MyInput"
                  placeholder="主人账号"
                  v-model="master"
        >
        </el-input>

        <p>绑定账号</p>
        <el-input style="margin-top: 8px"
                  class="MyInput"
                  placeholder="绑定账号"
                  v-model="account"
        >
        </el-input>

        <p>选择应用</p>
        <el-select v-model="appId"
                   placeholder="请选择应用"
                   style="width: 150px;margin-top: 8px">
          <el-option
            v-for="item in appData"
            :key="item.appid"
            :label="item.appName"
            :value="item.appid">
          </el-option>
        </el-select>

        <el-radio-group v-model="used" class="myRadio">
          <el-radio :label="1">已使用</el-radio>
          <el-radio :label="0">未使用</el-radio>
        </el-radio-group>
        <el-radio-group v-model="type" class="myRadio">
          <el-radio :label="2">绑定设备</el-radio>
          <el-radio :label="1">绑定账号</el-radio>
        </el-radio-group>
      </div>
      <!--条件第二行-->
      <div class="myCard">
        <p>查询卡密</p>
        <el-input  style="margin-top: 8px"
                   class="MyInput"
                   placeholder="查询卡密"
                   v-model="card"
        >
        </el-input>

        <p>代理</p>
        <el-input style="margin-top: 8px"
                  class="MyInput"
                  placeholder="代理"
                  v-model="agent"
                  :disabled="isAdmin"
        >
        </el-input>

        <p>开卡时间</p>
        <el-date-picker
          class="myDate"
          v-model="checkTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
        >
        </el-date-picker>
      </div>

      <el-row>
        <el-col  :sapn="3"  style="margin-top: 10px">
          <el-button type="primary" size="small" @click="getCard(1)">查询</el-button>
          <el-button type="primary" size="small" @click="resetForm()">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="cardListPage!=null">
      <el-button type="danger" size="small" @click="batchDel" :disabled="isAdmin">批量删除</el-button>
      <el-button type="primary" size="small" @click="toExcel">导出excel</el-button>
      <el-table
        :data="cardListPage.records.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        :row-key="cardListPage.records.id"
        @selection-change="batchDelChange"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="卡密"
          prop="card">
        </el-table-column>
        <el-table-column
          width="100px"
          label="绑定类型"
          prop="type">
        </el-table-column>
        <el-table-column
          width="150px"
          label="绑定账号"
          prop="account">
        </el-table-column>
        <el-table-column
          width="100px"
          label="时间"
          prop="time">
        </el-table-column>
        <el-table-column
          label="开卡时间"
          prop="usedTime">
        </el-table-column>
        <el-table-column
          label="卡密期限"
          prop="expiration">
        </el-table-column>
        <el-table-column
          align="right">
          <template slot-scope="scope">
            <el-button
              :disabled="isAdmin"
              size="mini"
              type="danger"
              @click="singleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="cardListPage!=null"
        class="userPag"
        @current-change="current"
        background
        layout="total,prev, pager, next"
        :current-page="cardListPage.current"
        :page-size="cardListPage.size"
        :total="cardListPage.total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data(){
    return {
      agent:'', //代理人
      account:'',//绑定账号
      master:'', //主人账号
      used:null,   //是否使用
      type:null,      //类型
      card:'',  //卡密
      appData: [],
      appId: '',  //应用id
      cardListPage:null,
      isAdmin:JSON.parse(sessionStorage.getItem('userInfo')).name!=='admin',
      batchIds:[],   //批量删除的id
      checkTime:[],   //时间选择
      username:JSON.parse(sessionStorage.getItem('userInfo')).name //登录人名称
    }
  },
  created () {
    this.getAgentPower();
  },
  methods:{
    /*单个删除*/
    singleDel(card){
      this.$axios.post('/user/singleDel',card).then((res)=>{
        if(res.data.code===200) {
          this.$message.success("删除成功")
          this.current(this.cardListPage.current)
        }
      })
    },
    /*重置条件*/
    resetForm () {
      this.account=''
      this.master=''
      this.used=null
      this.type=null
      this.appid=''
      this.card=''
      this.checkTime=[]
      this.agent=''
    },
    /*请求代理权限*/
    async getAgentPower(){
      const {data:res} =await this.$axios.get('/user/getAgentPower?username='+this.username)
      this.appData=res.data
    },
    /*构造批量删除的数组*/
    batchDelChange(val) {
      this.batchIds=[];
      val.forEach((item) => {
        this.batchIds.push(item.id)
      })
    },
    /*批量删除*/
    batchDel(){
      this.$axios.post('/user/batchDel',this.batchIds).then((res)=>{
        if(res.data.code===200) {
          this.$message.success("删除成功")
          this.current(this.cardListPage.current)
        }
      })
    },
    /*导出excel*/
    toExcel(){
      axios.post(this.$BaseUrl+'/toExcel',{
        account:this.account,
        master:this.master,
        used:this.used,
        type:this.type,
        appid:this.appId,
        card:this.card,
        checkTime:this.checkTime,
        agent:this.agent,
      },{responseType:'blob',headers:{token:sessionStorage.getItem('token')}}).then(res => {
        this.downloadLoading = false
        if (!res) {
          this.$message.error("下载模板文件失败");
          return false;
        }
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
        const downloadElement = document.createElement('a');
        const href = window.URL.createObjectURL(blob);
        let contentDisposition = res.headers['content-disposition'];  //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
        let patt = new RegExp("filename=([^;]+\\.[^\\.;]+);*");
        let result = patt.exec(contentDisposition);
        let filename = decodeURI(result[1]);
        downloadElement.style.display = 'none';
        downloadElement.href = href;
        downloadElement.download = filename ; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      })
    },
    /*分页查询*/
    async getCard(current){
      const {data:res} = await this.$axios.post('/que',{
        account:this.account,
        master:this.master,
        used:this.used,
        type:this.type,
        appid:this.appId,
        card:this.card,
        checkTime:this.checkTime,
        agent:this.agent,
        current:current
      })
      this.cardListPage=res.data
    },
    /*当前页*/
    current(currentPage) {
      this.getCard(currentPage)//点击第几页
    },
  }
}
</script>
<style scoped lang="scss">
.myDate{
  margin-top: 8px;
}
.myRadio{
  line-height: 67.2px;
}
.userPag{
  margin-top: 10px;
  margin-bottom: 10px;
  float: right;
}
.MyInput{
  margin-right: 10px;
  width: 200px !important;
}
p{
  display: inline-block;
  width: 90px;
}
.myCard{
  display:flex;
  flex-direction: row;
  flex-wrap:wrap;
}
</style>
