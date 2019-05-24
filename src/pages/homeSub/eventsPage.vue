<template>
  <div>
  <f7-list mediaList class="homeevents-list" style="margin-top: 0px">
    <f7-list-item v-for="(e,index) in events" :key="index" :title="e.title"  :subtitle="e.latestMsg === null?'':e.latestMsg" :badge="e.num===null?'':e.num" badge-color="blue"
                  :after="dateformate(e._id,'MM-dd hh:mm')" :link="/chat/+e._id+'/'+e.title" @click="curEvent = e;e.num=null" swipeout >
      <f7-swipeout-actions right>
        <f7-swipeout-button close color="blue" @click="detail(e)">详情</f7-swipeout-button>
        <f7-swipeout-button close color="red" @click="$f7.dialog.confirm('是否删除该条记录？',()=>{events.splice(index,1)},null)">删除</f7-swipeout-button>
      </f7-swipeout-actions>
      <img slot="media" :src="eventImage(e.username)" />
    </f7-list-item>
  </f7-list>
  </div>
</template>
<script>
import nativeUtil from '@/assets/js/nativeUtil.js'
import photo from '@/assets/js/phonto.js'
let ObjectID = require('bson').ObjectID
var curEventPage
// event websocket
var webSocket
var trytime = 0
function initSocket () {
  if (!window.WebSocket) {
    alert('error:不支持socket通信')
    return false
  }
  var newUrl = process.env.API_WS + 'websocket/homeview.do?token=' + localStorage.getItem('token')
  if (webSocket) {
    if (webSocket.readyState !== webSocket.OPEN && webSocket.readyState !== webSocket.CONNECTING) {
      webSocket = new WebSocket(newUrl)
      initwebSocket(webSocket)
    }
  } else {
    webSocket = new WebSocket(newUrl)
    initwebSocket(webSocket)
  }
}
function initwebSocket (webSocket) {
  webSocket.onmessage = function (data) {
    let type = data.data.substring(0, 4)
    if (type === '0003') {
      try {
        trytime = 0 // 重连初始化
        nativeUtil.writeLogFile2(new Date() + '===0003')
      } catch (e) {
        console.log(e)
      }
    }
    if (type === '0000') {
      let array = curEventPage.$root.myevil(data.data.substring(4))
      if (array.length === 0) {
        return false
      }
      for (let i = 0; i < array.length; i++) {
        curEventPage.addEvent(array[i])
      }
    }
    if (type === '0001') {
      let array2 = curEventPage.$root.myevil(data.data.substring(4))
      if (array2.length === 0) {
        return false
      }
      for (let i = 0; i < array2.length; i++) {
        curEventPage.addMessage(array2[i])
        let hasevent = false
        let eventM
        for (let j = 0; j < curEventPage.events.length; j++) {
          if (curEventPage.events[j]._id === array2[i].relateId) {
            hasevent = true
            eventM = curEventPage.events[j]
            curEventPage.events.splice(j, 1)
          }
        }
        if (!hasevent) {
          // 添加事件
          let url3 = process.env.API_HOST + 'event/getEvent.do'
          curEventPage.$f7.request.promise.get(url3, {'eventId': array2[i].relateId}, 'json').then((data) => {
            eventM = data.data
            // 更新事件栏
            eventM.num++
            if (array2[i].type === undefined || array2[i].type === 'text') {
              eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + array2[i].data
            } else {
              if (array2[i].type === 'operate') { eventM.latestMsg = array2[i].data }
              if (array2[i].type === 'image') { eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '图片' }
              if (array2[i].type === 'file') { eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '文件' }
            }
            curEventPage.events.unshift(eventM)
          }, () => { curEventPage.$root.toastbuttom(self, '通讯异常') })
        } else {
          // 更新事件栏
          eventM.num++
          if (array2[i].type === undefined || array2[i].type === 'text') {
            eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + array2[i].data
          } else {
            if (array2[i].type === 'operate') { eventM.latestMsg = array2[i].data }
            if (array2[i].type === 'image') { eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '图片' }
            if (array2[i].type === 'file') { eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '文件' }
          }
          curEventPage.events.unshift(eventM)
        }
        try {
          photo.notify(eventM, null, null)
        } catch (e) {
        }
      }
    }
  }
  webSocket.onopen = function () {
    webSocket.send('receive Home date')
  }
  webSocket.onerror = function (event) {
    nativeUtil.writeLogFile2('WS_ERROR:' + new Date() + JSON.stringify(event))
  }
  webSocket.onclose = function () {
    window.clearInterval(heartid)
    console.log('eventPage ws closed')
    // navigator.app.exitApp()
    while (trytime < 1) {
      if (webSocket.readyState !== webSocket.OPEN && webSocket.readyState !== webSocket.CONNECTING) {
        setTimeout(function () {
          webSocket = null
          try {
            nativeUtil.writeLogFile2(new Date() + '  TRY TO RECONNECT')
          } catch (e) {
            console.log(e)
          }
          initSocket()
        }, 3000)
      }
      trytime++
    }
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
  }, 30000)
}
export default {
  name: 'events-page',
  data: function () {
    return {
      events: [],
      curEvent: {}
    }
  },
  created () {
    console.log('eventPage created')
    const self = this
    curEventPage = self
    let temp = JSON.parse(localStorage.getItem(self.$root.prefx + 'events'))
    self.events = temp === null ? [] : temp
    try {
      initSocket()
    } catch (e) {
      console.log(e)
    }
  },
  destroyed () {
    console.log('eventPage destroyed')
  },
  watch: {
    events: {
      handler: function (val) {
        const self = this
        localStorage.setItem(self.$root.prefx + 'events', JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    getCur () {
      return curEventPage
    },
    // 用于监听homeWebsockt接收消息刷新页面
    addEvent (e) {
      const self = this
      self.$root.delEleFromArray(e, self.events)
      self.events.unshift(e)
    },

    addMessage (m) {
      // eventId 作为键，存messages
      let messages = JSON.parse(localStorage.getItem(m.relateId))
      if (messages === null)messages = []
      messages.push(m)
      localStorage.setItem(m.relateId, JSON.stringify(messages))
    },
    initSocket () {
      initSocket()
    },
    ReinitSocket () {
      webSocket = null
      initSocket()
    },
    dateformate (id, fmt) {
      return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt)
    },
    detail (e) {
      this.curEvent = e
      this.$f7router.navigate('/event-detail/')
    },
    eventImage (name) {
      return process.env.API_HOST + 'image/head/' + name + '.jpg'
    }
  }
}
</script>
<style scoped>
  img{
    width: 3rem;
    height: 3rem;
  }
</style>
