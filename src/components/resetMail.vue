<template>
  <f7-page>
    <f7-navbar title="邮件设置" back-link="Back">
    </f7-navbar>
    <f7-list>
       <f7-list-input placeholder="请输入邮箱" :value="mail"  @input="mail = $event.target.value"></f7-list-input>
      <li>
        <div class="item-content item-input">
              <input placeholder="请输入验证码" :value="code" type="text" @input="code=$event.target.value" />
              <f7-button  style="width: 10rem" @click="sendCode" :disabled="disBut" :text="ButText"></f7-button>
        </div>
      </li>
      <f7-list-button @click="confirm()">确认</f7-list-button>
      <f7-list-button @click="$f7router.back()">取消</f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
var CurResetMail
export default {
  name: 'resetMail',
  created (){
    const self = this
    CurResetMail = self
  },
  data: function () {
    return {
      mail: '',
      code: '',
      ButText: '发送验证码',
      disBut: false,
      leaveTime: 10
    }
  },
  watch: {
    disBut: (val) => {
      if (val) {
        CurResetMail.leaveTime = 20
        CurResetMail.ButText = CurResetMail.leaveTime + 's'
        let count = setInterval(() => {
          if (CurResetMail.leaveTime > 1) {
            CurResetMail.leaveTime--
            CurResetMail.ButText = CurResetMail.leaveTime + 's'
          } else {
            CurResetMail.disBut = false
            clearInterval(count)
          }
        }, 1000)
      } else {
        CurResetMail.ButText = '发送验证码'
      }
    }
  },
  methods: {
    sendCode () {
      const self = this
      var reg = new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$')
      if (!reg.test(self.mail)) {
        self.$f7.dialog.alert('邮箱格式不正确，请重新输入')
        return false
      }
      self.disBut = true
      var url = process.env.API_HOST + 'shiro/setMail_step1.do'
      self.$f7.request.promise.get(url, {mailName: self.mail}, 'json').then((data) => {
        self.$root.toastbuttom(self, data.message)
      }, () => { self.$root.toastbuttom(self, '通讯异常') })
    },
    confirm () {
      const self = this
      var reg = new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$')
      if (!reg.test(self.mail)) {
        self.$f7.dialog.alert('邮箱格式不正确，请重新输入')
        return false
      }
      if(!self.code){
        self.$f7.dialog.alert('验证码不能为空')
        return false
      }
      let url = process.env.API_HOST + 'shiro/setMail_step2.do'
      self.$f7.request.promise.get(url, {code: self.code, mailName: self.mail}, 'json').then((data) => {
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
