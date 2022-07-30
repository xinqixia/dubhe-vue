
const getDefaultState = () => {
  return {
    userInfo: null,
    menu: [],
    userImg:null
  }
}

const state = getDefaultState()

const mutations = {
  userImg(state,userImg){
    state.userImg=userImg
  },
  userInfo(state,userInfo){
    state.userInfo=userInfo
  },
  initAdminMenu (state, menus) {
    state.menu = menus
  },
  isCollapse(state){
    state.collapse=!this.state.collapse;
  }
}

export default {
  namespaced: true,
  state,
  mutations
}

