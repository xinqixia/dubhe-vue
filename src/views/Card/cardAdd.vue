<template>
  <div>
    <el-card style="margin-bottom: 15px;margin-top: 20px;">
      <el-row :gutter="20">
        <el-col :span="1.5" style="padding-right: 0">
          <p class="userP">数量</p>
        </el-col>
        <el-col :span="3.5" style="width: 150px">
          <el-input style="float: left; margin-top: 8px"
                    placeholder="默认一张"
                    v-model="addForm.num"
          >
          </el-input>
        </el-col>
        <el-col :span="1.5" style="padding-right: 0">
          <p>有效时间</p>
        </el-col>
        <el-col :span="3.5">
          <el-select v-model="addForm.time"
                     placeholder="默认为一天"
                     style="width: 150px;margin-top: 8px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1.5" style="padding-right: 0">
          <p>选择应用</p>
        </el-col>
        <el-col :span="3.5">
          <el-select v-model="addForm.appid"
                     placeholder="请选择应用"
                     style="width: 150px;margin-top: 8px">
            <el-option
              v-for="item in appData"
              :key="item.appid"
              :label="item.appName"
              :value="item.appid">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" style="margin-top: 16px">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="2">绑定设备</el-radio>
            <el-radio :label="1">绑定账号</el-radio>
          </el-radio-group>
        </el-col>
        <el-col  style="margin-top: 10px">
          <el-button type="primary" size="small" @click="getCard">生成</el-button>
          <el-button type="primary" size="small" @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="height: 100%;width: 100%">
      <p style="margin-top: 0">列表(刷新后消失)</p>
     <div v-if="cards.length===1">
       <p style="margin-bottom: 10px">卡密:</p>
       <span>{{cards[0].card}}</span>
     </div>
     <div v-else v-for="item in cards" :key="item">
       <p>卡密:</p>
       <span>{{item.card}}</span>
     </div>
    </el-card>
  </div>

</template>
<script>
export default {
  data(){
    return {
      options: [{
        value: 24,
        label: '天卡'
      }, {
        value: 720,
        label: '月卡'
      }, {
        value: 2160,
        label: '季卡'
      }, {
        value: 4320,
        label: '半年卡'
      }, {
        value: 8760,
        label: '年卡'
      }, {
        value: 876000,
        label: '永久'
      }],          //有效期数据
      appData: [],
      addForm:{
        appid: '',  //应用id
        time: 24,    //有效期选择框绑定的值
        num:1,       //卡密张数
        type:1,      //类型 1:
      },
      cards:[
      ],   //生成的卡密
      username:JSON.parse(sessionStorage.getItem('userInfo')).name //登录人名称

    }
  },
  created () {
    this.getAgentPower();
  },
  methods:{
    /*重置条件*/
    resetForm() {
      this.addForm={
        appid: '',
        time: 24,
        num:1,
        type:1,
      }
    },
    /*请求代理权限*/
    async getAgentPower(){
      const {data:res} =await this.$axios.get('/user/getAgentPower?username='+this.username)
      this.appData=res.data
    },
    /*生成卡密*/
    async getCard(){
      this.cards=[]
      const {data: res} = await this.$axios.post('/gen',this.addForm)
      if(res.data.length===1) this.cards.push(res.data[0])
      else {
        for(let item in res.data) {
          this.cards.push(res.data[item])
        }
      }
    },
  },
}
</script>
<style scoped>
div{ word-wrap: break-word; word-break: normal;}
.userP{
  text-align: center;
}
</style>
