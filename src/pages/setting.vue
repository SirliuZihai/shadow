<template>
  <f7-page>
    <f7-navbar title="设置" back-link="Back"></f7-navbar>
    <f7-list inline-labels>
      <f7-list-item title="退出全部已读">
        <f7-toggle slot="after" :checked="settings.allReadOnExit"  @change="settings.allReadOnExit = $event.target.checked"></f7-toggle>
      </f7-list-item>
      <f7-list-item :title="'绑定邮箱   '+mail">
        <f7-link slot="after" @click="changeMail">设置</f7-link>
      </f7-list-item>
      <f7-list-button title="清除日志" @click="doClear" />
    </f7-list>
  </f7-page>
</template>
<script>
import nativeUtil from '@/assets/js/nativeUtil.js'
var CurSetting
export default {
  name: 'setting',
  created () {
    const self = this
    CurSetting = self
    let settings = JSON.parse(localStorage.getItem(CurSetting.$root.prefx + 'settings'))
    if (settings) {
      self.settings = settings
    }
    self.updateMail()
  },
  data: function () {
    return {
      settings: {
        allReadOnExit: false
      },
      mail: ''
    }
  },
  watch: {
    settings: {
      handler: function (val) {
        localStorage.setItem(CurSetting.$root.prefx + 'settings', JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    doClear () {
      nativeUtil.removeLogFile2()
    },
    updateMail () {
      const self = this
      let url = process.env.API_HOST + 'shiro/getMail.do'
      self.$f7.request.promise.get(url, {}, 'json').then((data) => {
        if (data.success) {
          if (data.data.mail) {
            self.mail = data.data.mail
          }
        }
      }, () => { self.$root.toastbuttom(self, '通讯异常') })
    },
    changeMail () {
      this.$f7router.navigate('/resetMail/')
    }
  }
}
</script>
