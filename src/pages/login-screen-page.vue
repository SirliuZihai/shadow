<template>
  <f7-page no-toolbar no-navbar no-swipeback login-screen>
    <f7-login-screen-title>影子</f7-login-screen-title>
    <f7-list form>
    <f7-list-input
      lable="用户名"
      type="text"
      placeholder="请输入用户名"
      :value="username"
      @input="username = $event.target.value"
    ></f7-list-input>
    <f7-list-input
      lable="密码"
      type="password"
      placeholder="请输入密码"
      :value="password"
      @input="password = $event.target.value"
      @keyup="test"
    ></f7-list-input>
  </f7-list>
    <f7-list>
      <f7-list-button @click="signIn">登录</f7-list-button>
      <f7-list-button @click="regist">注册</f7-list-button>
      <f7-list-button @click="cancel">退出</f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
import {hexmd5} from '../assets/js/md5.js'
import thehome from '@/pages/home.vue'
import theLeft from '@/pages/left-panel.vue'
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  beforeCreate () {
    const self = this
    if (thehome.methods.getCurHome()) { // 如果已登录（主页已加载）则跳过
      return
    }
    let token = localStorage.getItem('token')
    if (!token) { // 初始化可自动登录判断
      return
    }
    var url = process.env.API_HOST + 'shiro/login.do'
    self.$f7.request.promise({
      method: 'POST',
      contentType: 'application/json',
      url: url,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {token: token}
    }).then((data) => {
      let data2 = self.$root.myevil(data)
      if (data2.success === true) {
        self.$f7router.navigate('/')
      } else {
      }
    })
  },
  methods: {
    test (e) {
      console.log('aa')
    },
    signIn () {
      const self = this
      var url = process.env.API_HOST + 'shiro/login.do'
      this.$f7.request.promise({
        method: 'POST',
        contentType: 'application/json',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: {username: self.username, password: hexmd5(self.password)}
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.$root.toastbuttom(self, data2.message)
          localStorage.clear()
          localStorage.setItem('username', self.username)
          localStorage.setItem('token', data2.data.token)
          localStorage.setItem('alias', data2.data.alias)
          let curhome1 = thehome.methods.getCurHome()
          if (curhome1) {
            theLeft.methods.changeImgUrl()
            curhome1.changeTitle(localStorage.getItem('alias'))
            curhome1.events = []
            curhome1.initSocket()
          }
          self.$f7router.navigate('/')
        } else {
          self.$root.toastbuttom(self, data)
        }
      })
    },
    regist () {
      const self = this
      const router = self.$f7router
      localStorage.clear()
      router.navigate('/register/')
      // this.$f7.mainView.router.load({url: '/chat/'});
    },
    cancel () {
      navigator.app.exitApp()
    }
  }
}
</script>
