<template>
  <f7-page>
    <f7-block-title>导航</f7-block-title>
    <f7-list>
      <f7-list-item>
        <img id="headImg" slot="media" src="" width="50rem" height="50rem"/>
        <f7-button @click="uploadFile">上传头像</f7-button>
      </f7-list-item>
    </f7-list>
    <f7-list>
      <f7-list-item  link="/userInfo/" title="我" panel-close></f7-list-item>
      <f7-list-item  link="/login-screen-page/" title="登录" panel-close></f7-list-item>
      <f7-list-item  link="/contact/" title="联系人" panel-close></f7-list-item>
      <f7-list-item  link="/insertPanOrHistory/" title="录入"  panel-close></f7-list-item>
      <f7-list-item link="/about2/" title="发现" panel-close></f7-list-item>
      <f7-list-item link="/about/" title="关于" panel-close></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
// import photo from '@/assets/js/phonto.js'
export default {
  mounted: function () {
    this.changeImgUrl()
  },
  methods: {
    uploadFile () {
      const self = this
      if (self.$device.android === true || self.$device.ios === true) {
        // photo.getPhoto()
        self.changeImgUrl()
      }
    },
    changeImgUrl () {
      let url = process.env.API_HOST + 'image/head/' + localStorage.getItem('username') + '.jpg?temp=' + Math.floor((Math.random() * 10000) + 1)
      this.$$('#headImg').attr('src', url)
    }
  }
}
</script>
