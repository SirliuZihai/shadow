<template>
  <f7-page :page-content="false">
    <f7-navbar back-link="Back" sliding :title="title" subtitle="讨论区">
    </f7-navbar>
    <f7-photo-browser type="popup" :photos="photos" ref="photosbrowser"/>
    <div class="page-content ptr-content">
      <f7-messages id="chatMessages" ref="messages" :scrollMessages="args.scroll">
        <div class="ptr-preloader">
          <div class="preloader"></div>
          <div class="ptr-arrow"></div>
          <input id="chatImage" type="file" accept="image/*" @change="uploadFileForm2" hidden/>
        </div>
        <template v-for="(msg,index) in msgs.slice(showNum)">
          <f7-messages-title :key="index" v-if="msg.type==='operate'">{{msg.data.replace(name,'您')}}</f7-messages-title>
          <f7-message :key="index" v-else-if="msg.type==='image'" :image="cromp(msg.data,true)" :first="true"
                      :last="true" :tail="true" @click="photos[0].url=cromp(msg.data,false);$refs.photosbrowser.open()"
                      :name="dateformate(msg._id,'MM-dd hh:mm')+' '+msg.sender"
                      :type="msg.sender===name?'sent':'received' " :avatar="headImgUrl(msg.sender)"
                      @click:avatar="photos[0].url=headImgUrl(msg.sender);$refs.photosbrowser.open()"
          />
          <f7-message :key="index" v-else :first="true" :last="true" :tail="true"
                      @click:avatar="photos[0].url=headImgUrl(msg.sender);$refs.photosbrowser.open()"
                      :name="dateformate(msg._id,'MM-dd hh:mm')+' '+msg.sender"
                      :type="msg.sender===name?'sent':'received' " :avatar="headImgUrl(msg.sender)"
          >
            <div v-html="msg.data"></div>
          </f7-message>
        </template>
      </f7-messages>
    </div>
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
  import theEventPage from '@/pages/homeSub/eventsPage.vue'
  import photo from '@/assets/js/phonto.js'

  var CHATVUE
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
    mounted () {
      const self = this
      CHATVUE = self
      this.$nextTick(() => {
        self.$refs.messages.scroll()
      })
      self.$$('.ptr-content').on('ptr:refresh', function (e) {
        self.args.scroll = false
        self.pageUp(5)
        e.detail()
      })
      self.pageUp(20)
    },
    beforeDestroy () {
      this.webSocket.close()
    },
    data: function () {
      return {
        title: '',
        webSocket: '',
        msgs: [],
        showNum: 0,
        name: localStorage.getItem('username'),
        attachments: [],
        sheetVisible: false,
        attachmentsVisible: true,
        photos: [{
          url: '',
          caption: ''
        }],
        args: {
          scroll: true
        },
        metest: '测试数据<br>，和/n换行'
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
        if (text) self.webSocket.send('[text]:' + text)
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
        /** 在这里，事件是必然存在的 */
        webSocket.onmessage = function (data) {
          let type = data.data.substring(0, 4)
          if (type === '0001') {
            let array2 = self.$root.myevil(data.data.substring(4))
            if (array2.length === 0) {
              return false
            }
            for (let i = 0; i < array2.length; i++) {
              self.msgs.push(array2[i])
              let eventPage = theEventPage.methods.getCur()
              if (array2[i].type === undefined || array2[i].type === 'text') {
                theEventPage.methods.getCur().curEvent.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + array2[i].data
              } else {
                if (array2[i].type === 'operate') {
                  eventPage.curEvent.latestMsg = array2[i].data
                }
                if (array2[i].type === 'image') {
                  eventPage.curEvent.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '图片'
                }
                if (array2[i].type === 'file') {
                  eventPage.curEvent.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '文件'
                }
              }
              eventPage.addEvent(eventPage.curEvent) // 事件置顶
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
      dateformate (id, fmt) {
        return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt)
      },
      getPicture () {
        const self = this
        if (self.$device.android === true || self.$device.ios === true) {
          photo.sendPicture(self.webSocket)
        } else {
          CHATVUE.$$('#chatImage').click()
        }
      },
      cromp (arg, useable) {
        if (useable === false) {
          return process.env.API_HOST + arg
        } else {
          let laNum = arg.lastIndexOf('/')
          return process.env.API_HOST + arg.substring(0, laNum) + '/cromp/' + arg.substring(laNum + 1)
        }
      },
      pageUp (num) {
        const self = this
        self.showNum = self.showNum - num
        if (Math.abs(self.showNum) >= self.msgs.length) {
          self.$$('.ptr-preloader').hide()
          self.showNum = -self.msgs.length
        }
      },
      uploadFileForm2 (event) {
        const self = this
        var SERVER = process.env.API_HOST + 'event/uploadtempfile.do'
        var imgFile = event.target.files[0] // 获取图片文件
        var formData = new FormData() // 创建form对象
        formData.append('tempFile', imgFile)// 通过append向form对象添加数据
        self.$f7.request.promise({
          method: 'POST',
          url: SERVER,
          data: formData
        }).then(function (data) {
          let data2 = self.$root.myevil(data)
          if (data2.success === true) {
            // alert(JSON.stringify(data.response))
            self.webSocket.send('[image]:' + data2.message)
          } else {
            self.$root.toastbuttom(self, data2.message)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .headImg {
    width: 50px;
    height: 50px;
    border-radius: 50%
  }

  .messages2 {
    overflow: auto;
  }

</style>
