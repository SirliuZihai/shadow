<template>
  <f7-page>
    <f7-navbar title="Not found" backLink="Back"></f7-navbar>
    <f7-block strong>
      <p v-for="(msg ,index) in msgs" :key="index">
         {{msg}}
      </p>
      <p>Requested content not found.</p>
    </f7-block>
    <f7-list>
    <f7-list-button title="更新应用" @click="update2"></f7-list-button>
    <f7-list-button title="更新应用3" @click="update3"></f7-list-button>
    <f7-list-button title="更新应用4" @click="update4"></f7-list-button>
    <f7-list-button title="更新应用5" @click="update5"></f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
/* eslint-disable */
export default {
  name: 'test',
  created () {
    const self = this
    self.msgs = ['cordova.file.applicationDirectory:' + cordova.file.applicationDirectory,
      'cordova.file.documentsDirectory:' + cordova.file.documentsDirectory,
      'cordova.file.dataDirectory:' + cordova.file.dataDirectory,
      'cordova.file.cacheDirectory:' + cordova.file.cacheDirectory,
      '400'
    ]
  },
  data: function () {
    return {
      msgs: 'good'
    }
  },
  methods: {
    update2 () {
      // 调用升级提示框 点击确认会跳转对应商店升级
      chcp.requestApplicationUpdate('下载吗', process.env.API_HOST + 'store/shadow.apk', null)
    },
    update3 () {
      if (window.confirm('有新的版本是否下载')) {
        cordova.InAppBrowser.open(process.env.API_HOST + 'store/shadow.apk', '_blank', 'location=yes')
      }
    },
    update4 () {
      if (window.confirm('下载二维码')) {
        cordova.InAppBrowser.open(process.env.API_HOST + 'store/shadow.png', '_blank', 'location=yes')
      }
    },
    update5 () {
      if (window.confirm('下载二维码window')) {
        window.open(process.env.API_HOST + 'store/shadow.png', '_blank', 'location=yes')
      }
    }
  }
}
</script>
