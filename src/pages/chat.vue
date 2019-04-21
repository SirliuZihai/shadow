<template>
  <f7-page>
    <f7-navbar back-link="Back" sliding :title="title" subtitle="讨论区">
    </f7-navbar>

    <f7-messages>
      <template v-for="msg in msgs" >
        <f7-messages-title :key="msg.index" v-if="msg.type==='operate'">{{msg.data}}</f7-messages-title>
        <f7-message :key="msg.index" v-if="msg.type==='image'" :image="msg.data" :first="true" :last="true" :tail="true"
                    :name="dateformate(msg._id,'MM-dd hh:mm')+' '+msg.sender" :type="msg.sender===name?'sent':'received' " :avatar="headImgUrl(msg.sender)"
        />
        <f7-message :key="msg.index" v-else :first="true" :last="true" :tail="true"
                    :name="dateformate(msg._id,'MM-dd hh:mm')+' '+msg.sender" :text="msg.data" :type="msg.sender===name?'sent':'received' " :avatar="headImgUrl(msg.sender)"
                    />
      </template>
    </f7-messages>
    <f7-messagebar placeholder="Message"
                   :sheet-visible="sheetVisible">
      <f7-link
        icon-ios="f7:camera_fill"
        icon-md="material:camera_alt"
        slot="inner-start"
        @click="getPicture"
      ></f7-link>
      <f7-link
        icon-ios="f7:arrow_up_fill"
        icon-md="material:send"
        slot="inner-end"
        @click="sendMessage"/>
    </f7-messagebar>
  </f7-page>
</template>

<script>
import defautImg from '@/assets/image/nohead.jpg'
import theHome from '@/pages/home.vue'
import photo from '@/assets/js/phonto.js'
let ObjectID = require('bson').ObjectID
export default {
  created () {
    const self = this
    let eventId = self.$f7route.params.eventId
    self.title = self.$f7route.params.title
    let oldData = JSON.parse(localStorage.getItem(eventId))
    if (oldData) {
      self.msgs = oldData
    }
    self.initSocket()
  },
  beforeDestroy () {
    this.webSocket.close()
  },
  data: function () {
    return {
      title: '',
      webSocket: '',
      msgs: [],
      name: localStorage.getItem('username'),
      attachments: [],
      sheetVisible: false,
      attachmentsVisible: true
    }
  },
  watch: {
    msgs: function (val) {
      const self = this
      localStorage.setItem(self.$f7route.params.eventId, JSON.stringify(val))
    }
  },
  methods: {
    sendMessage () {
      const self = this
      const text = self.$f7.messagebar.getValue().replace(/\n/g, '<br>').trim()
      // Reset attachments
      self.attachments = []
      // Hide sheet
      self.sheetVisible = false
      // Clear area
      self.$f7.messagebar.clear()
      // Send message
      if (text)self.webSocket.send('[text]:' + text)
    },
    headImgUrl (name) {
      let url = process.env.API_HOST + 'image/head/' + name + '.jpg'
      return url
    },
    nohaedImg () {
      this.$$('#headImg').attr('src', defautImg)
    },
    initSocket () {
      const self = this
      var newUrl = process.env.API_WS + 'websocket/chatview.do?eventId=' + self.$f7route.params.eventId +
      '&token=' + localStorage.getItem('token')
      if (self.webSocket) {
        self.webSocket.close()
        self.webSocket = new WebSocket(newUrl)
        self.initwebSocket(self.webSocket)
      } else {
        self.webSocket = new WebSocket(newUrl)
        self.initwebSocket(self.webSocket)
      }
    },
    initwebSocket (webSocket) {
      const self = this
      webSocket.onmessage = function (data) {
        let type = data.data.substring(0, 4)
        if (type === '0001') {
          let array2 = self.$root.myevil(data.data.substring(4))
          if (array2.length === 0) {
            return false
          }
          for (let i = 0; i < array2.length; i++) {
            self.msgs.push(array2[i])
            if (array2[i].type === undefined || array2[i].type === 'text') {
              theHome.methods.getCurHome().curEvent.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + array2[i].data
            } else {
              if (array2[i].type === 'operate') { theHome.methods.getCurHome().curEvent.latestMsg = array2[i].data }
              if (array2[i].type === 'image') { theHome.methods.getCurHome().curEvent.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '图片' }
              if (array2[i].type === 'file') { theHome.methods.getCurHome().curEvent.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '文件' }
            }
          }
        }
      }
      webSocket.onclose = function () {
        console.log('chat closeed')
        window.clearInterval(heartid)
      }
      // 监听下socket的close事件，代码中最好还是别用try catch了，会严重拖垮性能
      var heartid = window.setInterval(function () { // 每隔20秒钟发送一次心跳，避免websocket连接因超时而自动断开
        if (webSocket) {
          if (webSocket.readyState === webSocket.OPEN) {
            webSocket.send('heartbeat[myapp]')
          } else {
            window.clearInterval(heartid)
          }
        }
      }, 20000)
    },
    dateformate (id, fmt) { return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt) },
    getPicture () {
      const self = this
      photo.sendPicture(self.webSocket)
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
  .message-image img{
    width: 50%;
    width: 50%;
  }
</style>
