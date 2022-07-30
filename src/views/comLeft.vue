<template>
  <el-menu
    class="el-menu-vertical-demo"
    active-text-color="#ffd04b"
    background-color="#545c64"
    text-color="#fff"
    :collapse="isCollapse"
    :default-active="$route.path"
    unique-opened="true"
    router="true"
  >
    <p class="userTitle">七夏授权系统</p>
    <el-divider class="userDivider"></el-divider>
    <el-menu-item v-for="item in noChildren" :key="item.name" :index="item.url">
      <svg class="icon" aria-hidden="true">
        <use :xlink:href="item.icon"></use>
      </svg>
      <span slot="title">{{item.name}}</span>
    </el-menu-item>
    <el-submenu :index="item.url" v-for="item in hasChildren" :key="item.path">
      <template slot="title">
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="item.icon"></use>
        </svg>
        <span slot="title">{{item.name}}</span>
      </template>
      <el-menu-item-group v-for="children in item.children" :key="children.path" >
        <el-menu-item :index="children.url">{{children.name}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>
<script>

export default {
  data(){
    return{
      //leftSide:this.$store.state.menu
    }
  },
  methods:{

  },
  computed:{
    isCollapse() {
      return this.$store.state.collapse;
    },
    leftSide(){
      return this.$store.state.menu;
    },
    hasChildren(){
      return this.leftSide.filter((item)=>item.children);
    },
    noChildren() {
      return this.leftSide.filter((item) => !item.children);
    }
  }

}
</script>

<style scoped>
.userItem{
  background-color: #8c939d !important;
}
.el-menu {
  border-right: 0 !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse){
  min-height: 100%;
  width: 200px;
}
.el-menu-vertical-demo{
  min-height: 100%;
}
.el-card /deep/ .el-card__body {
  padding: 0;
}
.userTitle{
  text-align: center;
  color: white;
}
.userDivider{
  margin: 0;
  background-color: #8c939d;
}
/*.el-divider--horizontal{*/
/*  margin: 0;*/
/*}*/
.icon{
  margin-left: 0;
  padding-right: 20px;
  width: 24px;
  height: 30px;
  fill: currentColor;
}
</style>
