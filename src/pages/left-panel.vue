<template>
  <f7-page>
    <f7-list>
      <div style="text-align:center">
        <img id="headImg"  src="" class="headImg"/>
      </div>
      <f7-button @click="uploadFile">点击上传头像</f7-button>
    </f7-list>
    <f7-list>
      <f7-list-item  link="/userInfo/" title="我" panel-close></f7-list-item>
      <f7-list-item  link="/contact/" title="联系人" panel-close></f7-list-item>
      <f7-list-item link="/letterBox/" title="信箱" panel-close></f7-list-item>
      <!--<f7-list-item link="/explore/" title="发现" panel-close></f7-list-item>-->
      <f7-list-item  link="/login-screen-page/" title="注销" @click="logoff" panel-close></f7-list-item>
      <f7-list-item link="/about/" title="关于" panel-close></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import photo from '@/assets/js/phonto.js'
import defautImg from '@/assets/image/nohead.jpg'
var LeftPanelCur
export default {
  mounted: function () {
    const self = this
    LeftPanelCur = self
    self.$$('#headImg').on('error', self.nohaedImg)
    self.changeImgUrl()
  },
  methods: {
    uploadFile () {
      const self = this
      self.$root.curSelf = self
      if (self.$device.android === true || self.$device.ios === true) {
        photo.getPhoto()
      }
    },
    changeImgUrl () {
      let url = process.env.API_HOST + 'image/head/' + localStorage.getItem('username') + '.jpg?temp=' + Math.floor((Math.random() * 10000) + 1)
      LeftPanelCur.$$('#headImg').attr('src', url)
    },
    nohaedImg () {
      this.$$('#headImg').attr('src', defautImg)
    },
    logoff () {
      localStorage.removeItem('username')
    }

  }
}
</script>
<style scoped>
  .headImg{
    width: 50px;
    height: 50px;
    border-radius:50%
  }
</style>
