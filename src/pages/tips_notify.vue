<template>
  <f7-page :page-content="false">
    <f7-navbar title="相关动态" back-link="Back">
    <f7-nav-right>
      <f7-link icon-f7="compose" href="/editNews/">
      </f7-link>
    </f7-nav-right>
    </f7-navbar>
    <f7-photo-browser type="popup" :photos="photos" ref="photosbrowser" />
    <div v-if="tip !== null" class="page-content">
   <f7-card class="demo-facebook-card">
      <f7-card-header class="no-border">
        <div class="demo-facebook-avatar "><img :src="headImgUrl(tip.publisher)" class="headImg"/></div>
        <div class="demo-facebook-name">{{tip.publisher}}</div>
        <div class="demo-facebook-date">{{dateformate(tip._id,'MM-dd hh:mm')}}</div>
      </f7-card-header>
      <f7-card-content>
        <p>事件：{{tip.event_title}}<br/>时间：{{tip.event_starttime + '-'+tip.event_endtime}}<br/>————————————————</p>
        <p>{{tip.context}}</p>
        <div style="float: left;width: 100%">
          <template v-for="(pic,index) in tip.picture" >
            <img style="float: left" :src="imgUrl(pic)" width="33%" :key="index" @click="setPhotos(tip.picture);$refs.photosbrowser.open(index)"/>
          </template>
        </div>
      </f7-card-content>
      <f7-card-footer class="no-border" >
        <f7-link style="text-align: center;" @click="like(tip._id,tip.likes,'','',tip)"><span :style="tip.likes === true?'color: #0066d6':''">赞</span>({{tip.likesNum}})</f7-link>
        <f7-link @click="comment(tip)">评论({{tip.commentsNum}})</f7-link>
        <f7-link v-show="tip.event_isJoin !== true" @click="addEvent(tip.eventId)">添加日程</f7-link>
        <f7-link v-show="tip.enter === true&&tip.event_isJoin !== true" @click="participate(tip.eventId)">申请加入</f7-link>
        <f7-link v-show="tip.publisher === username" @click="deletetip(tip._id,index)">删除</f7-link>
      </f7-card-footer>
    </f7-card>
      <f7-block-title style="margin-top: 0rem" :key="index" v-show="tip.comments&&tip.comments.length>0">相关评论</f7-block-title>
      <f7-list mediaList inset :key="index" style="margin-top: 0rem">
        <template v-for="(co,index) in tip.comments" >
          <f7-list-item :key="index" :subtitle="co.publisher" :text="co.content" ><img slot="media" :src="headImgUrl(co.publisher)"/>
            <span class="comment_left">{{dateformate(co._id,'MM-dd hh:mm')}}</span><a v-if="co.publisher === args.uname" @click="deleteComment(co._id,null)" class="comment">删除</a><a class="comment" @click="like(null,co.likes,co._id,'',co)">{{co.likes === true?'已赞':'赞'}}({{co.likesNum}})</a><a v-if="args.comment === true" class="comment" @click="args.comment = false;curComment = co._id;curReceiver=co.publisher">回复</a><a v-else class="comment" @click="args.comment = true;curComment = null">取消回复</a>
          </f7-list-item>
          <f7-list-item v-for="(reply,index) in co.replys" :key="index" :subtitle="reply.publisher+'回复'+reply.receiver" :text="reply.content"><img slot="media" :src="headImgUrl(reply.publisher)" />
            <span class="comment_left">{{dateformate(reply._id,'MM-dd hh:mm')}}</span><a v-if="co.publisher === args.uname" @click="deleteComment(co._id,reply._id)" class="comment">删除</a><a class="comment" @click="like(null,reply.likes,co._id,reply._id,reply)">{{reply.likes === true?'已赞':'赞'}}({{reply.likesNum}})</a><a  v-if="args.comment === true" class="comment" @click="do_reply(reply.publisher,co._id)">回复</a><a  v-else class="comment" @click="un_reply()">取消回复</a>
          </f7-list-item>
        </template>
      </f7-list>
    </div>
      <f7-messagebar v-if="args.comment === true" placeholder="请输入评论" :sheet-visible="sheetVisible">
        <f7-link
          icon-ios="f7:arrow_up_fill"
          icon-md="material:send"
          slot="inner-end"
          @click="addComment(null)"/>
      </f7-messagebar>
      <f7-messagebar v-else placeholder="请输入回复" :sheet-visible="sheetVisible">
        <f7-link
          icon-ios="f7:arrow_up_fill"
          icon-md="material:send"
          slot="inner-end"
          @click="addComment(curComment)"/>
      </f7-messagebar>
  </f7-page>
</template>

<script>
let ObjectID = require('bson').ObjectID
export default {
  name: 'tips',
  data: function () {
    return {
      username: localStorage.getItem('username'),
      tip: {},
      args: {
        likeEnable: true, // 点赞按钮 enable
        partEnable: true, // 加入按钮 enable
        uname: localStorage.getItem('username'),
        comment: true
      },
      photos: [], // {url: '', caption: ''}
      noMore: false,
      curTip: {},
      curReceiver: '',
      curComment: ''
    }
  },
  created () {
    const self = this
    self.getTips()
  },
  methods: {
    do_reply (publisher, commentId) {
      const self = this
      self.args.comment = false
      self.curComment = commentId
      self.curReceiver = publisher
    },
    un_reply () {
      const self = this
      self.args.comment = true
      self.curComment = null
      self.curReceiver = null
    },
    headImgUrl (name) {
      let url = process.env.API_HOST + 'image/head/' + name + '.jpg'
      console.log(url)
      return url
    },
    imgUrl (arg) {
      arg = arg.replace('image/', 'image/cromp/')
      return process.env.API_HOST + arg
    },
    setPhotos (pictures) {
      const self = this
      for (let i = 0; i < pictures.length; i++) {
        // {url: '', caption: ''}
        self.photos.push({url: process.env.API_HOST + pictures[i], caption: ''})
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
              self.tip = {}
            }
            self.$root.toastbuttom(self, data.message)
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      }, null)
    },
    getTips () {
      const self = this
      let url = process.env.API_HOST + 'tips/queryTips_notify.do'
      let args = {}
      let relateId = self.$f7route.query.relateId
      args.type = self.$f7route.query.type
      if (relateId) {
        relateId = relateId.split('_')
        if (relateId.length > 2) {
          args.replyId = relateId[2]
        }
        if (relateId.length > 1) {
          args.commentId = relateId[1]
        }
        if (relateId.length > 0) {
          args.tipId = relateId[0]
        }
      }
      self.$f7.request.promise.postJSON(url, args).then(
        (data) => {
          if (data.success === true) {
            self.tip = data.data
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
      if (!eventId) {
        self.$f7.dialog.alert('该事件已删除')
        return false
      }
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
    deleteComment (commentId, replyId) {
      const self = this
      let url = process.env.API_HOST + 'tips/removeComment.do'
      let tipId = self.$f7route.query.relateId.split('_')[0]
      self.$f7.request.promise.postJSON(url, {_id: tipId, commentId: commentId, replyId: replyId}).then(
        (data) => {
          if (data.success) {
            self.getTips()
          }
          self.$root.toastbuttom(self, data.message)
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    like (_id, likes, commentId, replyId, obj) {
      const self = this
      if (self.likeEnable === false) {
        return false
      }
      self.likeEnable = false
      _id = self.$f7route.query.relateId.split('_')[0]
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
    addComment (commentId) {
      const self = this
      const text = self.$f7.messagebar.getValue().replace(/\n/g, '<br>').trim()
      // Hide sheet
      self.sheetVisible = false
      // Clear area
      self.$f7.messagebar.clear()
      // Send message
      if (text) {
        let url = process.env.API_HOST + 'tips/comment.do'
        let tipId = self.$f7route.query.relateId.split('_')[0]
        self.$f7.request.promise.postJSON(url, {_id: tipId, commentId: commentId, content: text, receiver: self.curReceiver}).then(
          (data) => {
            if (data.success) {
              self.getTips()
              self.args.comment = true
            }
            self.$root.toastbuttom(self, data.message)
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      }
    },
    comment (tip) {
      const self = this
      self.curTip = tip
      self.$f7router.navigate('/comments/?tipId=' + tip._id)
    },
    getCurTip () {
      return this.curTip
    }
  }

}
</script>

<style scoped>
  .headImg{
    width: 3.0rem;
    height: 3.0rem;
    border-radius:50%
  }
  .comment{
    float: right;
    font-size: small;
    margin-right: 0.5rem;
  }
  .comment_left{
    float: left;
    font-size: small;
    margin-right: 0.5rem;
  }
  img{
    width: 2.5rem;
    height: 2.5rem;
  }
</style>
