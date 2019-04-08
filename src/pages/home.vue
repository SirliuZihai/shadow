<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{thetitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-home" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-history" icon-ios="f7:add" icon-md="material:add"></f7-link>
      </f7-nav-right>
      <f7-searchbar class="searchbar-home" search-container=".homeevents-list" placeholder="搜索当前事项" disableButtonText="取消" expandable></f7-searchbar>
      <f7-searchbar ref="searchbarHomeEvent" class="searchbar-history" @inpput="queryEvent.title = $event.target.value" @focus="args.querytime = true" @searchbarEnable="args.homeIsShow=false"
                    @searchbarDisable="()=>{args.homeIsShow=true;args.querytime=false}"  placeholder="搜索历史事项" disableButtonText="取消" expandable>
      </f7-searchbar>
    </f7-navbar>
    <f7-list mediaList class="homeevents-list" style="margin-top: 0px" v-show="args.homeIsShow">
      <f7-list-item v-for="e in events" :key="e.index" :title="e.title"  :subtitle="e.latestMsg === null?'':e.latestMsg" :badge="e.num===null?'':e.num" badge-color="blue"
                    :after="dateformate(e._id,'MM-dd hh:mm')" :link="/chat/+e._id+'/'+e.title" @click="curEvent = e;e.num=null" swipeout >
        <f7-swipeout-actions right>
          <f7-swipeout-button @click="detail(e)">详情</f7-swipeout-button>
        </f7-swipeout-actions>
        <img slot="media" :src="homedefautImg" />
      </f7-list-item>
    </f7-list>
    <f7-list inline-labels form v-show="(!args.homeIsShow)&&args.querytime" style="margin-top: 0px">
      <f7-list-input :value="queryEvent.starttime" @input="queryEvent.starttime=$event.target.value"
                     label="起始时间"
                     type="datetime-local"
                     placeholder="请选择时间" clear-button
      />
      <f7-list-input :value="queryEvent.endtime" @input="queryEvent.endtime=$event.target.value"
                     label="截止时间"
                     type="datetime-local"
                     placeholder="请选择时间" clear-button
      />
      <f7-list-button @click="queryHistroy">查询</f7-list-button>
    </f7-list>
    <f7-list mediaList class="historyevents-list" style="margin-top: 0px" v-show="!args.homeIsShow">
      <f7-list-item v-for="e1 in hisEvents" :key="e1.index" :title="e1.title"  :subtitle="e1.remark" @click="addEvent2(e1)"
                    :after="dateformate(e1._id,'MM-dd hh:mm')" swipeout>
        <f7-swipeout-actions right>
          <f7-swipeout-button @click="detail(e1)">详情</f7-swipeout-button>
        </f7-swipeout-actions>
        <img slot="media" :src="homedefautImg" />
      </f7-list-item>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import defautImg from '@/assets/image/nohead.jpg'
import nativeUtil from '@/assets/js/nativeUtil.js'
let ObjectID = require('bson').ObjectID
var homeCur
// home event websocket
var webSocket
function initSocket () {
  if (!window.WebSocket) {
    alert('error:不支持socket通信')
    return false
  }
  var newUrl = process.env.API_WS + 'websocket/homeview.do?token=' + localStorage.getItem('token')
  if (webSocket) {
    webSocket.close()
    webSocket = new WebSocket(newUrl)
    initwebSocket(webSocket)
  } else {
    webSocket = new WebSocket(newUrl)
    initwebSocket(webSocket)
  }
}
function initwebSocket (webSocket) {
  webSocket.onmessage = function (data) {
    let type = data.data.substring(0, 4)
    if (type === '0000') {
      let array = homeCur.$root.myevil(data.data.substring(4))
      if (array.length === 0) {
        return false
      }
      for (let i = 0; i < array.length; i++) {
        homeCur.addEvent(array[i])
      }
      // localStorage.setItem('events', JSON.stringify(homeCur.events))
      try {
        // cordovaUtil.notify(array[0], null, null)
      } catch (e) {
      }
    }
    if (type === '0001') {
      let array2 = homeCur.$root.myevil(data.data.substring(4))
      if (array2.length === 0) {
        return false
      }
      for (let i = 0; i < array2.length; i++) {
        homeCur.addMessage(array2[i])
        for (let j = 0; j < homeCur.events.length; j++) {
          if (homeCur.events[j]._id === array2[i].relateId) {
            homeCur.events[j].num++
            if (array2[i].type === undefined || array2[i].type === 'text') {
              homeCur.events[j].latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + array2[i].data
            } else {
              if (array2[i].type === 'operate') { homeCur.events[j].latestMsg = array2[i].data }
              if (array2[i].type === 'image') { homeCur.events[j].latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '图片' }
              if (array2[i].type === 'file') { homeCur.events[j].latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '文件' }
            }
          }
        }
      }
    }
  }
  webSocket.onopen = function () {
    webSocket.send('receive Home date')
  }
  webSocket.onerror = function (event) {
    nativeUtil.writeLogFile2(event)
  }
  webSocket.onclose = function () {
    window.clearInterval(heartid)
    while (webSocket.readyState !== webSocket.OPEN) {
      setTimeout(function () {
        webSocket = null
        initSocket()
      }, 10000)
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
  }, 20000)
}
export default {
  data: function () {
    return {
      thetitle: '',
      events: [],
      hisEvents: [],
      queryEvent: {
        title: '',
        starttime: '',
        endtime: ''
      },
      curEvent: {},
      homedefautImg: defautImg,
      args: {
        homeIsShow: true,
        querytime: false
      }
    }
  },
  created () {
    const self = this
    homeCur = self
    self.changeTitle(localStorage.getItem('alias'))
    let temp = JSON.parse(localStorage.getItem('events'))
    self.events = temp === null ? [] : temp
    try {
      initSocket()
    } catch (e) {
      console.log(e)
    }
  },
  watch: {
    events: {
      handler: function (val) {
        localStorage.setItem('events', JSON.stringify(val))
        console.log('events saved')
      },
      deep: true
    },
    curEvent: {
      handler: function (val) {
        this.addEvent(val)
      },
      deep: true
    }
  },
  methods: {
    queryHistroy () {
      const self = this
      self.args.querytime = false
      let url = process.env.API_HOST + 'event/queryHistroy.do'
      self.$f7.request.promise.postJSON(url, self.queryEvent).then(
        (data) => {
          if (data.success) {
            let array = data.data
            if (array.length === 0) { return false }
            self.hisEvents = []
            for (let i = 0; i < array.length; i++) {
              self.hisEvents.push(array[i])
            }
          } else {
            self.$root.toastbuttom(self, data.message)
          }
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    // 用于监听homeWebsockt接收消息刷新页面
    addEvent (e) {
      const self = this
      self.$root.delEleFromArray(e, self.events)
      self.events.unshift(e)
    },
    // 用于从历史中添加事件
    addEvent2 (e) {
      const self = this
      self.$root.delEleFromArray(e, self.events)
      self.events.unshift(e)
      // localStorage.setItem('events', JSON.stringify(homeCur.events))
      self.$refs.searchbarHomeEvent.disable()
    },
    changeTitle (alia) {
      homeCur.thetitle = (alia === undefined || alia === null || alia === 'undefined') ? localStorage.getItem('username') : localStorage.getItem('username') + '[' + alia + ']'
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
    clearEvents () {
      homeCur.events = []
    },
    dateformate (id, fmt) {
      return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt)
    },
    getCurHome () {
      return homeCur
    },
    detail (e) {
      this.curEvent = e
      this.$f7router.navigate('/event-detail/')
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
