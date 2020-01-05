<template>
  <f7-page>
    <f7-navbar title="动态" back-link="Back">
    <f7-nav-right>
      <f7-link icon-f7="compose" href="/editNews/">
      </f7-link>
    </f7-nav-right>
    </f7-navbar>
    <f7-photo-browser type="popup" :photos="photos" ref="photosbrowser" />
    <template v-for="(tip,index) in tips" >
    <f7-card class="demo-facebook-card" :key="index">
      <f7-card-header class="no-border">
        <div class="demo-facebook-avatar"><img src="headImgUrl(tip.publisher)" width="34" height="34"/></div>
        <div class="demo-facebook-name">{{tip.publisher}}</div>
        <div class="demo-facebook-date">{{dateformate(tip._id,'MM-dd hh:mm')}}</div>
      </f7-card-header>
      <f7-card-content>
        <p>What a nice photo i took yesterday!</p>
        <div style="float: left;width: 100%" @click="$refs.photosbrowser.open()">
          <template v-for="(pic,index) in tip.picture" >
            <img style="float: left" src="imgUrl(pic)" width="33%" :key="index"/>
          </template>
        </div>
        <!--<p class="likes">Likes: 112 &nbsp;&nbsp; Comments: 43</p>-->
      </f7-card-content>
      <f7-card-footer class="no-border" >
        <f7-link style="text-align: center">赞</f7-link>
        <f7-link>评论(12)</f7-link>
        <f7-link>更多</f7-link>
      </f7-card-footer>
    </f7-card>
    </template>
    <f7-card class="demo-facebook-card">
      <f7-card-header class="no-border">
        <div class="demo-facebook-avatar"><img src="https://cdn.framework7.io/placeholder/people-68x68-1.jpg" width="34" height="34"/></div>
        <div class="demo-facebook-name">John Doe</div>
        <div class="demo-facebook-date">Monday at 2:15 PM</div>
      </f7-card-header>
      <f7-card-content>
        <p>What a nice photo i took yesterday!</p>
        <div style="float: left;width: 100%" @click="$refs.photosbrowser.open()">
          <img style="float: left" src="https://cdn.framework7.io/placeholder/nature-1000x700-7.jpg" width="33%"/>
          <img style="float: left" src="https://cdn.framework7.io/placeholder/nature-1000x700-8.jpg" width="33%"/>
          <img style="float: left" src="https://cdn.framework7.io/placeholder/nature-1000x700-6.jpg" width="33%"/>
          <img style="float: left" src="https://cdn.framework7.io/placeholder/nature-1000x700-10.jpg" width="33%"/>
        </div>
        <!--<p class="likes">Likes: 112 &nbsp;&nbsp; Comments: 43</p>-->
      </f7-card-content>
    <f7-card-footer class="no-border" >
      <f7-link style="text-align: center">赞</f7-link>
      <f7-link>评论(12)</f7-link>
      <f7-link>更多</f7-link>
    </f7-card-footer>
    </f7-card>
  </f7-page>
</template>

<script>
let ObjectID = require('bson').ObjectID
export default {
  name: 'tips',
  data: function () {
    return {
      tips: [],
      photos: [{url: 'https://cdn.framework7.io/placeholder/nature-1000x700-7.jpg', caption: ''},
        {url: 'https://cdn.framework7.io/placeholder/nature-1000x700-8.jpg', caption: ''},
        {url: 'https://cdn.framework7.io/placeholder/nature-1000x700-6.jpg', caption: ''},
        {url: 'https://cdn.framework7.io/placeholder/nature-1000x700-10.jpg', caption: ''}]
    }
  },
  created () {
    const self = this
    self.getTips()
  },
  methods: {
    headImgUrl (name) {
      let url = process.env.API_HOST + 'image/head/' + name + '.jpg'
      return url
    },
    imgUrl (arg) {
      let url = process.env.API_HOST + arg + '.jpg'
      return url
    },
    dateformate (id, fmt) { return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt) },
    cromp (arg) {
      let laNum = arg.lastIndexOf('/')
      return process.env.API_HOST + arg.substring(0, laNum) + '/cromp/' + arg.substring(laNum + 1)
    },
    getTips () {
      const self = this
      let url = process.env.API_HOST + 'tips/queryTips.do'
      self.$f7.request.promise.postJSON(url, {skipNum: self.tips.length}).then(
        (data) => {
          if (data.success === true) {
            self.tips = self.tips.concat(data.data)
          }
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    }
  }

}
</script>

<style scoped>

</style>
