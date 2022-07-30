import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui';
import request from "@/utils/request";
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: ()=>import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/comMain',
    children: [{
      path: 'comMain',
      name: 'comMain',
      component: () => import('@/views/comMain'),
      meta: { title: '我的主页', icon: '#icon-zhuye' }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/agentList',
    children: [{
      path: 'agentList',
      name: 'agentList',
      component: () => import('@/views/agentList'),
      meta: { title: '代理管理', icon: '#icon-zongdailizhanghao' }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/cardList',
    children: [{
      path: 'cardList',
      name: 'cardList',
      component: () => import('@/views/Card/cardList'),
      meta: { title: '卡密管理', icon: '#icon-kamiguanli' }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/cardAdd',
    children: [{
      path: 'cardAdd',
      name: 'cardAdd',
      component: () => import('@/views/Card/cardAdd'),
      meta: { title: '添加卡密', icon: '#icon-shengchengbaogao-' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
})


router.beforeEach((to, from, next) => {
   // 除登录之外的所有路由均需重新获取用户信息（保持同步）
    if (sessionStorage.getItem("token")||!to.meta.title) {// 通过localStorage.getItem()获取当前的 userInfo 是否存在
      next()
    } else {
      Message.error("请重新登录");
      next({
        path: '/login',
        query: {
          redirect: to.fullPath // 将跳转的路由path作为参数，登录成功后跳转到该路由
        }
      })
    }
})
/*获取用户信息*/
function getUserInfo(){
  request.service.post('/getInfo',{
    token:sessionStorage.getItem('token')
  }).then((res) => {
    sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
    this.$store.commit('user/userImg',res.data.data.avatar)
    this.$store.commit('user/userInfo',JSON.stringify(res.data.data))
    console.log(this.$store.state.user.userImg)
    sessionStorage.setItem('userImg',res.data.data.avatar)
  })
}

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
