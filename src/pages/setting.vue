<template>
  <f7-page>
    <f7-navbar title="设置" back-link="Back"></f7-navbar>
    <f7-list inline-labels>
      <f7-list-item title="退出全部已读">
        <f7-toggle slot="after" :checked="settings.allReadOnExit"  @change="settings.allReadOnExit = $event.target.checked"></f7-toggle>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
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
  },
  data: function () {
    return {
      settings: {
        allReadOnExit: false
      }
    }
  },
  watch: {
    settings: {
      handler: function (val) {
        localStorage.setItem(CurSetting.$root.prefx + 'settings', JSON.stringify(val))
      },
      deep: true
    }
  }
}
</script>
