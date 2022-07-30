<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <!--公告-->
    <p class="userShow">公告</p>
    <el-button icon="el-icon-data-line" class="userButton" @click="showMyDiag=true" size="mini"></el-button>

    <!--公告弹出框-->
    <el-dialog
      title="公告"
      :visible.sync="showMyDiag"
      width="30%"
    >
      <span>修复bug</span>  <hr/>
      <span>优化移动端的响应式</span> <hr/>
      <span>优化前端数据加载的缓冲</span> <hr/>
      <span>折线图不显示就刷新</span> <hr/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showMyDiag = false">取 消</el-button>
        <el-button type="primary" @click="showMyDiag = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="imageUrl" class="user-avatar" alt="暂无">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/comMain">
            <el-dropdown-item icon="el-icon-user">
              我的主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="logout" icon="el-icon-switch-button">
           退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data(){
    return {
      showMyDiag:false, //公告弹出框
    }
  },
  computed: {
    userImg(){
      return this.$store.state.user.userImg?this.$store.state.user.userImg:sessionStorage.getItem('userImg')
    },
    imageUrl(){
      return this.$BaseUrl+'/uploads/images/'+(this.userImg?this.userImg:'userImg.png');
    },
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    /*清除本地存储,退出登录*/
    logout(){
      this.$message({
        message: '登出成功',
        type: 'success'
      });
      sessionStorage.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo")
      this.$router.push( "/login");
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
  }
}
</script>

<style lang="scss" scoped>
.userButton{
  //float: left;
}
.userShow{
  display: inline-block;
  margin-left: 20px;
  margin-right: 10px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
