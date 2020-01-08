<template>
  <f7-page :page-content="false">
    <f7-navbar title="动态" back-link="Back">
    <f7-nav-right>
      <f7-link icon-f7="compose" href="/editNews/">
      </f7-link>
    </f7-nav-right>
    </f7-navbar>
    <f7-photo-browser type="popup" :photos="photos" ref="photosbrowser" />
    <div class="page-content ptr-content ptr-bottom">
    <template v-for="(tip,index) in tips" >
    <f7-card class="demo-facebook-card" :key="index">
      <f7-card-header class="no-border">
        <div class="demo-facebook-avatar "><img :src="headImgUrl(tip.publisher)" class="headImg"/></div>
        <div class="demo-facebook-name">{{tip.publisher}}</div>
        <div class="demo-facebook-date">{{dateformate(tip._id,'MM-dd hh:mm')}}</div>
      </f7-card-header>
      <f7-card-content>
        <p>{{tip.event_title}}<br/>{{tip.event_starttime + '-'+tip.event_endtime}}</p>
        <p>{{tip.context}}}</p>
        <div style="float: left;width: 100%">
          <template v-for="(pic,index) in tip.picture" >
            <img style="float: left" :src="imgUrl(pic)" width="33%" :key="index" @click="setPhotos(ip.picture);$refs.photosbrowser.open(index)"/>
          </template>
        </div>
        <!--<p class="likes">Likes: 112 &nbsp;&nbsp; Comments: 43</p>-->
      </f7-card-content>
      <f7-card-footer class="no-border" >
        <f7-link style="text-align: center;" @click="like(tip._id,tip.likes,'','',tip)"><span :style="tip.likes === true?'color: #0066d6':''">赞</span>({{tip.likesNum}})</f7-link>
        <f7-link @click="comment()">评论({{tip.comments}})</f7-link>
        <f7-link v-show="tip.event_isJoin !== true" @click="addEvent(tip.eventId)">添加日程</f7-link>
        <f7-link v-show="tip.enter === true&&tip.event_isJoin !== true" @click="participate(tip.eventId)">申请加入</f7-link>
        <f7-link v-show="tip.publisher === username" @click="deletetip(tip._id,index)">删除</f7-link>
      </f7-card-footer>
    </f7-card>
    </template>
      <div class="ptr-preloader">
        <div class="preloader"></div>
        <div class="ptr-arrow"></div>
      </div>
    </div>
  </f7-page>
</template>

<script>
let ObjectID = require('bson').ObjectID
var curTips
export default {
  name: 'tips',
  data: function () {
    return {
      username: localStorage.getItem('username'),
      tips: [],
      args: {
        likeEnable: true, // 点赞按钮 enable
        partEnable: true // 加入按钮 enable
      },
      photos: [] // {url: '', caption: ''}
    }
  },
  created () {
    console.log('…………tip created')
    const self = this
    curTips = self
    self.tips.length = 0
    self.getTips()
  },
  mounted () {
    const self = this
    self.$$('.ptr-content').on('ptr:refresh', function (e) {
      self.getTips()
      e.detail()
    })
  },
  methods: {
    getCur () {
      return curTips
    },
    headImgUrl (name) {
      let url = process.env.API_HOST + 'image/head/' + name + '.jpg'
      console.log(url)
      return url
    },
    imgUrl (arg) {
      let url = process.env.API_HOST + arg
      return url
    },
    setPhotos (pictures) {
      const self = this
      for (let i = 0; i < pictures.length; i++) {
        // {url: '', caption: ''}
        self.photos.push({url: pictures[i], caption: ''})
      }
    },
    dateformate (id, fmt) { return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt) },
    cromp (arg) {
      let laNum = arg.lastIndexOf('/')
      return process.env.API_HOST + arg.substring(0, laNum) + '/cromp/' + arg.substring(laNum + 1)
    },
    deletetip (_id, index) {
      const self = this
      self.$f7.dialog.confirm('是否删除该动态', () => {
        let url = process.env.API_HOST + 'tips/deleteTip.do'
        self.$f7.request.promise.postJSON(url, {_id: _id}).then(
          (data) => {
            if (data.success) {
              self.tips.splice(index)
            }
            self.$root.toastbuttom(self, data.message)
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      }, null)
    },
    getTips () {
      const self = this
      let url = process.env.API_HOST + 'tips/queryTips.do'
      let args = {skipNum: self.tips.length}
      if (self.$f7route.query.eventId) {
        args.eventId = self.$f7route.query.eventId
      }
      self.$f7.request.promise.postJSON(url, args).then(
        (data) => {
          if (data.success === true) {
            self.tips = self.tips.concat(data.data)
          }
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    addEvent (eventid) {
      const self = this
      self.$f7router.navigate('/insertPanOrHistory/?eventId=' + eventid)
    },
    participate (eventId) {
      const self = this
      if (self.partEnable === false) {
        return false
      }
      self.partEnable = false
      let url = process.env.API_HOST + 'event/participateEvent.do'
      self.$f7.request.promise.get(url, {eventId: eventId}, 'json').then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
          self.partEnable = true
        },
        () => { self.partEnable = true; self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    like (_id, likes, commentId, replyId, obj) {
      const self = this
      if (self.likeEnable === false) {
        return false
      }
      self.likeEnable = false
      let url = process.env.API_HOST + 'tips/like.do'
      self.$f7.request.promise.postJSON(url, {_id: _id, like: !likes, commentId: commentId, replyId: replyId}).then(
        (data) => {
          if (data.success) {
            if (obj.likes) {
              obj.likesNum--
            } else {
              obj.likesNum++
            }
            obj.likes = !likes
          } else {
            self.$root.toastbuttom(self, data.message)
          }
          self.likeEnable = true
        },
        () => { self.likeEnable = true; self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    comment () {

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
