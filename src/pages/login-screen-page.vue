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
      <f7-list-button @click="cancel">取消</f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
import {hexmd5} from '../assets/js/md5.js'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    test (e) {
      console.log('aa')
    },
    signIn () {
      const self = this
      const router = self.$f7router
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
        if (data === 'OK') {
          self.toastbuttom('登录成功')
          localStorage.setItem('username', self.username)
          localStorage.setItem('password', hexmd5(self.password))
          router.back()
        } else {
          self.toastbuttom(data)
        }
      })
    },
    regist () {
      const self = this
      const router = self.$f7router
      router.navigate('/register/')
      // this.$f7.mainView.router.load({url: '/chat/'});
    },
    cancel () {
      this.$f7router.back()
    },
    toastbuttom (data) {
      const self = this
      if (!self.toastBottom) {
        self.toastBottom = self.$f7.toast.create({
          text: data,
          cssClass: 'sd_center',
          closeTimeout: 2000
        })
      }
      // Open it
      self.toastBottom.open()
    }
  }
}
</script>
<style>
  .sd_center {
    text-align: center;
  }
</style>
