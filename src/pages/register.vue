<template>
  <f7-page>
    <f7-navbar title="注册" back-link="Back"></f7-navbar>
    <f7-list form>
      <f7-list-input
        type="text"
        placeholder="用户名"
        :value="username"
        @input="username = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        type="password"
        placeholder="密码"
        :value="password"
        @input="password = $event.target.value"
      ></f7-list-input>
      <f7-list-input
        type="password"
        placeholder="请再次确认密码"
        :value="PasswordConfirm"
        @input="PasswordConfirm = $event.target.value"
      ></f7-list-input>
    </f7-list>
    <f7-list>
      <f7-list-button @click="regist">注册</f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
import {hexmd5} from '../assets/js/md5.js'
export default {
  data () {
    return {
      username: '',
      password: '',
      PasswordConfirm: '',
      SIM: ''
    }
  },
  mounted () {
    const self = this
    window.plugins.sim.getSimInfo(function (res) {
      self.SIM = res.phoneNumber
    }, null)
  },
  methods: {
    regist () {
      const self = this
      const router = self.$f7router
      if (self.password !== self.PasswordConfirm) {
        self.$f7.dialog.alert('密码不一致！')
        return false
      }
      var url = process.env.API_HOST + 'shiro/newUser.do'
      this.$f7.request.promise({
        'method': 'POST',
        'contentType': 'application/json',
        'url': url,
        data: {username: self.username, password: hexmd5(self.password), SIM: self.SIM}
      }).then(function (data) {
        if (data === 'OK') { self.$root.toastbuttom(self,'注册成功'); router.back() } else { self.$f7.dialog.alert(data) }
      })
    }
  }
}
</script>

<style scoped>

</style>
