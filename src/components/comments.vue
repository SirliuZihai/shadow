<template>
    <f7-page>
      <f7-navbar :title="args.page_title" back-link="Back">
      </f7-navbar>

    <f7-list mediaList inset style="margin-top: 0rem">
      <template v-for="(co,index) in comments" >
        <f7-list-item :key="index" :subtitle="co.publisher" :text="co.content" ><img slot="media" :src="headImgUrl(co.publisher)"/>
          <span class="comment_left">{{dateformate(co._id,'MM-dd hh:mm')}}</span><a v-if="co.publisher === args.uname" @click="deleteComment(co._id,null)" class="comment">删除</a><a class="comment" @click="like(null,co.likes,co._id,'',co)">{{co.likes === true?'已赞':'赞'}}({{co.likesNum}})</a><a v-if="args.comment === true" class="comment" @click="args.comment = false;curComment = co._id;curReceiver=co.publisher">回复</a><a v-else class="comment" @click="args.comment = true;curComment = null">取消回复</a>
        </f7-list-item>
        <f7-list-item v-for="(reply,index) in co.replys" :key="index" :subtitle="reply.publisher+'回复'+reply.receiver" :text="reply.content"><img slot="media" :src="headImgUrl(reply.publisher)" />
          <span class="comment_left">{{dateformate(reply._id,'MM-dd hh:mm')}}</span><a v-if="co.publisher === args.uname" @click="deleteComment(co._id,reply._id)" class="comment">删除</a><a class="comment" @click="like(null,reply.likes,co._id,reply._id,reply)">{{reply.likes === true?'已赞':'赞'}}({{reply.likesNum}})</a><a  v-if="args.comment === true" class="comment" @click="do_reply(reply.publisher,co._id)">回复</a><a  v-else class="comment" @click="un_reply()">取消回复</a>
        </f7-list-item>
      </template>
    </f7-list>
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
  name: 'comments',
  data: function () {
    return {
      args: {
        page_title: '评论',
        uname: localStorage.getItem('username'),
        comment: true
      },
      likeEnable: true,
      curReceiver: '',
      curComment: '',
      comments: []
    }
  },
  created () {
    const self = this
    self.queryComments()
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
    queryComments () {
      const self = this
      let url = process.env.API_HOST + 'tips/getComments.do'
      let tipId = self.$f7route.query.tipId
      if (tipId) {
        self.$f7.request.promise.get(url, {tipId: tipId}, 'json').then(
          (data) => {
            if (data.success) {
              self.comments = data.data.comments
            } else {
              self.$root.toastbuttom(self, data.message)
            }
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      }
    },
    headImgUrl (name) {
      let url = process.env.API_HOST + 'image/head/' + name + '.jpg'
      console.log(url)
      return url
    },
    dateformate (id, fmt) { return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt) },
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
        let tipId = self.$f7route.query.tipId
        self.$f7.request.promise.postJSON(url, {_id: tipId, commentId: commentId, content: text, receiver: self.curReceiver}).then(
          (data) => {
            if (data.success) {
              self.queryComments()
              self.args.comment = true
            }
            self.$root.toastbuttom(self, data.message)
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      }
    },
    deleteComment (commentId, replyId) {
      const self = this
      let url = process.env.API_HOST + 'tips/removeComment.do'
      let tipId = self.$f7route.query.tipId
      self.$f7.request.promise.postJSON(url, {_id: tipId, commentId: commentId, replyId: replyId}).then(
        (data) => {
          if (data.success) {
            self.queryComments()
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
      _id = self.$f7route.query.tipId
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
    }

  }
}
</script>

<style scoped>
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
