
<template>
  <div>
    <!--个人展示页的卡片-->
    <div class="myBox">
      <div class="home">
        <div class="grid-content bg-purple">
          <el-card>
            <div class="user">
              <img-up-file></img-up-file>
              <div class="userinfo">
                <p class="name">{{UserInfo.name}}</p>
                <p class="access">代理</p>
              </div>
            </div>
            <div class="login-info">
              <p>本日销售额：<span>{{dayIncome}}元</span></p>
              <p>本月销售额：<span>{{mouthIncome}}元</span></p>
            </div>
            <p><el-button type="text" class="button" @click="toUserHome">去主页</el-button></p>
          </el-card>
        </div>
      </div>

      <!--代理销量的饼状图-->
      <el-card class="agentEcharts" id="agentEcharts"></el-card>

      <!--按时间查询的卡片-->
      <el-card class="dateForm">
        <p style="margin-top: 0">按时间查询</p>
        <el-form ref="form" :model="dateForm">
          <el-row :gutter="20">
            <el-col :sm="11" :xs="24">
              <el-date-picker type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="开始日期"
                              v-model="dateForm.startTime"></el-date-picker>
            </el-col>
            <el-col class="line" :sm="2" :xs="4">--</el-col>
            <el-col :sm="11" :xs="24">
              <el-date-picker type="datetime"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              placeholder="结束时间"
                              v-model="dateForm.endTime"></el-date-picker>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="10">
              <el-input
                placeholder="代理"
                v-model="dateForm.agent"
                :disabled="isAdmin"
              >
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" style="margin-top: 6px;margin-left: 10px" @click="timeStat">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-tabs class="userDesc">
          <el-tab-pane label="单Q">
            <el-descriptions border>
              <el-descriptions-item :label="item.name" v-for="item in singleSum" :key="item.name">{{item.num}}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="多Q">
            <el-descriptions border>
              <el-descriptions-item :label="item.name" v-for="item in doubleSum" :key="item.name">{{item.num}}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </el-card>

    </div>

    <!--销量折线图-->
    <el-card class="myEcharts" id="weekEcharts">
    </el-card>
  </div>
</template>
<script>
import imgUpFile from '../components/imgUpFile'
import * as echarts from 'echarts';
export default {
    data(){
      return {
        //UserInfo:this.$store.state.user.userInfo?this.$store.state.user.userInfo:JSON.parse(sessionStorage.getItem('userInfo')),
        dayIncome:0,
        mouthIncome:0,
        singleSum:[], //按时间单Q
        doubleSum:[], //按时间多Q
        series:[], //折线图数据
        dateForm:{
          startTime:'',
          endTime:'',
          agent:'',
        },
      }
    },
    computed:{
      UserInfo(){
        return this.$store.state.user.userInfo?this.$store.state.user.userInfo:JSON.parse(sessionStorage.getItem('userInfo'));
      },
      isAdmin(){
        let userInfo=this.$store.state.user.userInfo?this.$store.state.user.userInfo:JSON.parse(sessionStorage.getItem('userInfo'))
        return userInfo.name!=='admin'
      }
    },
    mounted(){
      this.echartsInit() //初始化周销量表
      this.agentAcInit() //初始化代理销量表
      this.incomeStat('day')  //统计当天收入
      this.incomeStat('mouth')  //统计当月收入
    },
    methods:{
      /*按照时间查询数据*/
      async timeStat() {
        const {data:res} = await this.$axios.post('/stat/timeStat',this.dateForm)
        let name=['天卡','月卡','季卡','半年卡','年卡','永久卡']
        this.singleSum=[]
        this.doubleSum=[]
        for(let item in res.data.singleSum){
          this.singleSum.push({
            name:name[item],
            num:res.data.singleSum[item]
          })
        }
        for(let item in res.data.doubleSum){
          this.doubleSum.push({
            name:name[item],
            num:res.data.doubleSum[item]
          })
        }
      },
      /*收入统计*/
      async incomeStat(type){
        const {data:res} = await this.$axios.post('/stat/incomeStat',{
          agent:'',
          type:type
        })
        if(type==='day') this.dayIncome=res.data
        else this.mouthIncome=res.data
      },
      /*构造折线图*/
      echartsInit() {
        let myEcharts = echarts.init(document.getElementById('weekEcharts'))
        myEcharts.setOption({
          title: {
            text: '本周销量'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['天卡', '月卡', '季卡', '半年卡', '年卡','永久卡']
          },
          grid: {
            left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
              boundaryGap: false,
              data: ['周一', '周二', '周三', '周四', '周五', '周六','周日']
          },
          yAxis: {
            type: 'value'
          },
          series: []
        })
        this.$axios.get('/stat/weekStat').then((res)=>{
          let series=[]
          let name=['天卡','月卡','季卡','半年卡','年卡','永久卡']
          for(let item in res.data.data) {
            series.push({
              name: name[item],
              type: 'line',
              data:  res.data.data[item]
            })
          }
          myEcharts.setOption({
            series: series
          })
        })
        window.addEventListener('resize',function () {
          myEcharts.resize();
        });
      },
      agentAcInit() {
        let myEcharts = echarts.init(document.getElementById('agentEcharts'))
        myEcharts.setOption({
          title: {
            text: '代理周销量(截止当前)'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            type:'scroll',
            top: '7%',
            left: 'center'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
              ]
            }
          ]
        },)
        this.$axios.get('/stat/agentStat').then((res)=>{
          if(res.data.code===200) {
            let data=[]
            data=res.data.data
            myEcharts.setOption({
              series: {
                data:data
              }
            })
          }
        })
        window.addEventListener('resize',function () {
          myEcharts.resize();
        });
      },
      toUserHome(){
        this.$router.push("/home/userHome");
      }
    },
    components:{
      imgUpFile
    }
  }
</script>
<style lang="scss" scoped>
@import "../assets/scss/home.scss";
@media screen and (max-width: 750px) {
  .dateForm{
    height: 400px !important;
  }
}
.home{
  margin-top: 20px;
  width: 350px;
}
.myEcharts{
  padding: 10px;
  width: auto;
  height: 400px;
  margin-top: 20px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.button {
  float: right;
}
.agentEcharts{
  margin-top: 20px;
  padding: 10px;
  width:350px;
  height: 343px;
}
.myBox{
  display: flex;
  flex-direction: row;
  flex-wrap:wrap;
  justify-content:space-around;
}
.userDesc {
  margin-top:10px;
}
.dateForm{
  margin-top: 20px;
  height: 343px;
}
.line{
  text-align: center;
  line-height: 40px;
}
</style>
