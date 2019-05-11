<template>
  <f7-page>
    <f7-navbar title="找回密码" back-link="Back">
    </f7-navbar>
    <f7-list>
      <f7-list-input placeholder="用户名" :value="username" @input="username = $event.target.value"/>
      <f7-list-input placeholder="邮箱名称" :value="mail"  @input="mail = $event.target.value">
        <f7-button slot="after" @click="sendCode" :disabled="disBut" :title="buttomText" />
      </f7-list-input>
      <li>
        <div class="item-content item-input">
          <input placeholder="请输入验证码" :value="code" type="text" @input="code=$event.target.value" />
          <f7-button  style="width: 10rem" @click="sendCode" :disabled="disBut" :text="ButText"></f7-button>
        </div>
      </li>
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
      <f7-list-button @click="resetPassword">确认</f7-list-button>
      <f7-list-button @click="$f7router.back()">取消</f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
import {hexmd5} from '../assets/js/md5.js'
var CurResetPass
export default {
  created () {
    const self = this
    CurResetPass = self
  },
  data: function () {
    return {
      username: '',
      mail: '',
      code: '',
      passord: '',
      PasswordConfirm: '',
      ButText: '发送验证码',
      disBut: false,
      leaveTime: 20
    }
  },
  watch: {
    disBut: (val) => {
      if (val) {
        CurResetPass.leaveTime = 20
        CurResetPass.ButText = CurResetPass.leaveTime + 's'
        let count = setInterval(() => {
          if (CurResetPass.leaveTime > 1) {
            CurResetPass.leaveTime--
            CurResetPass.ButText = CurResetPass.leaveTime + 's'
          } else {
            CurResetPass.disBut = false
            clearInterval(count)
          }
        }, 1000)
      } else {
        CurResetPass.ButText = '发送验证码'
      }
    }
  },
  methods: {
    buttomText () {
      const self = this
      if (self.disBut) {
        return self.leaveTime + 's'
      } else {
        return '发送验证码'
      }
    },
    sendCode () {
      const self = this
      if(!self.username){
        self.$f7.dialog.alert('用户名不能为空')
        return false
      }
      var reg = new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$')
      if (!reg.test(self.mail)) {
        self.$f7.dialog.alert('邮箱格式不正确，请重新输入')
        return false
      }
      self.disBut = true
      var url = process.env.API_HOST + 'shiro/resetPassword_step1.do'
      self.$f7.request.promise.get(url, {username: self.username, mail: self.mail}, 'json').then((data) => {
        self.$root.toastbuttom(self, data.message)
      }, () => { self.$root.toastbuttom(self, '通讯异常') })
    },
    resetPassword () {
      const self = this
      if (!self.code) {
        self.$f7.dialog.alert('验证码不能为空！')
        return false
      }
      if (self.password !== self.PasswordConfirm) {
        self.$f7.dialog.alert('密码不一致！')
        return false
      }
      var url = process.env.API_HOST + 'shiro/resetPassword_step2.do'
      self.$f7.request.promise.get(url, {username: self.username, password: hexmd5(self.password), code: self.code}, 'json').then((data) => {
        self.$root.toastbuttom(self, data.message)
        if (data.success) {
          self.$f7router.back()
        }
      }, () => { self.$root.toastbuttom(self, '通讯异常') })
    }
  }
}
</script>

<style scoped>

</style>
