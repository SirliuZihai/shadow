<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{thetitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-home" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-menu-item icon-f7="add" link dropdown>
          <f7-menu-dropdown right>
            <f7-menu-dropdown-item v-show="false" text="处理样式问题" href="/404/" ></f7-menu-dropdown-item>
            <f7-menu-dropdown-item text="添加事件" href="/insertPanOrHistory/" ></f7-menu-dropdown-item>
            <f7-menu-dropdown-item text="查看日历" href="/calendarPage/" ></f7-menu-dropdown-item>
            <f7-menu-dropdown-item text="搜索历史事件" link class="searchbar-enable" data-searchbar=".searchbar-history" ></f7-menu-dropdown-item>
          </f7-menu-dropdown>
        </f7-menu-item>
      </f7-nav-right>
      <f7-searchbar class="searchbar-home" search-container=".homeevents-list" placeholder="搜索当前事项" disableButtonText="取消" expandable></f7-searchbar>
      <f7-searchbar ref="searchbarHomeEvent" class="searchbar-history" @input="queryEvent.title = $event.target.value" @focus="args.querytime = true" @searchbarEnable="args.homeIsShow=false"
                    @searchbarDisable="()=>{args.homeIsShow=true;args.querytime=false}"  placeholder="搜索历史事项" disableButtonText="取消" expandable>
      </f7-searchbar>
    </f7-navbar>
    <f7-list mediaList class="homeevents-list" style="margin-top: 0px" v-show="args.homeIsShow">
      <f7-list-item v-for="(e,index) in events" :key="index" :title="e.title"  :subtitle="e.latestMsg === null?'':e.latestMsg" :badge="e.num===null?'':e.num" badge-color="blue"
                    :after="dateformate(e._id,'MM-dd hh:mm')" :link="/chat/+e._id+'/'+e.title" @click="curEvent = e;e.num=null" swipeout >
        <f7-swipeout-actions right>
          <f7-swipeout-button color="blue" @click="detail(e)">详情</f7-swipeout-button>
          <f7-swipeout-button color="red" @click="$f7.dialog.confirm('是否删除该条记录？',()=>{events.splice(index,1)},null)">删除</f7-swipeout-button>
        </f7-swipeout-actions>
        <img slot="media" :src="eventImage(e.username)" />
      </f7-list-item>
    </f7-list>
    <f7-list inline-labels form v-show="(!args.homeIsShow)&&args.querytime" style="margin-top: 0px">
      <f7-list-input inputId="homeRangtime" label="起止日期"  placeholder="请选择日期" :value="queryEvent.starttime+'-'+queryEvent.endtime" @change="inputDate" />
      <f7-list-button @click="queryHistroy">查询</f7-list-button>
    </f7-list>
    <f7-list mediaList class="historyevents-list" style="margin-top: 0px" v-show="!args.homeIsShow">
      <f7-list-item v-for="e1 in hisEvents" :key="e1.index" :title="e1.title"  :subtitle="e1.remark" @click="addEvent2(e1)"
                    :after="dateformate(e1._id,'MM-dd hh:mm')" swipeout>
        <f7-swipeout-actions right>
          <f7-swipeout-button color="blue" @click="detail(e1)">详情</f7-swipeout-button>
        </f7-swipeout-actions>
        <img slot="media" :src="eventImage(e1.username)" />
      </f7-list-item>
    </f7-list>
    <f7-list class="searchbar-not-found" style="text-align: center">
      <span >没有更多的消息了</span>
    </f7-list>
  </f7-page>
</template>
<script>
import defautImg from '@/assets/image/nohead.jpg'
import nativeUtil from '@/assets/js/nativeUtil.js'
import photo from '@/assets/js/phonto.js'
let ObjectID = require('bson').ObjectID
var homeCur
// home event websocket
var webSocket
photo.reconnectSocket = initSocket
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
    if (type === '0000') {
      let array = homeCur.$root.myevil(data.data.substring(4))
      if (array.length === 0) {
        return false
      }
      for (let i = 0; i < array.length; i++) {
        homeCur.addEvent(array[i])
      }
    }
    if (type === '0001') {
      let array2 = homeCur.$root.myevil(data.data.substring(4))
      if (array2.length === 0) {
        return false
      }
      for (let i = 0; i < array2.length; i++) {
        homeCur.addMessage(array2[i])
        let hasevent = false
        for (let j = 0; j < homeCur.events.length; j++) {
          if (homeCur.events[j]._id === array2[i].relateId) {
            hasevent = true
            let eventM = homeCur.events[j]
            eventM.num++
            if (array2[i].type === undefined || array2[i].type === 'text') {
              eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + array2[i].data
            } else {
              if (array2[i].type === 'operate') { eventM.latestMsg = array2[i].data }
              if (array2[i].type === 'image') { eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '图片' }
              if (array2[i].type === 'file') { eventM.latestMsg = array2[i].sender === null ? '' : array2[i].sender + ':' + '文件' }
            }
            homeCur.events.splice(j, 1)
            homeCur.events.unshift(eventM)
          }
        }
        if (!hasevent) {
          // 添加事件
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
    navigator.app.exitApp()
    /* while (webSocket.readyState !== webSocket.OPEN) {
      setTimeout(function () {
        webSocket = null
        initSocket()
      }, 10000)
    } */
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
    let temp = JSON.parse(localStorage.getItem(self.$root.prefx + 'events'))
    self.events = temp === null ? [] : temp
    try {
      initSocket()
    } catch (e) {
      console.log(e)
    }
  },
  mounted () {
    const self = this
    // Range Picker
    self.calendarRange = self.$f7.calendar.create({
      inputEl: '#homeRangtime',
      dateFormat: 'yyyymmdd',
      rangePicker: true
    })
  },
  watch: {
    events: {
      handler: function (val) {
        const self = this
        localStorage.setItem(self.$root.prefx + 'events', JSON.stringify(val))
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
    },
    eventImage (name) {
      return process.env.API_HOST + 'image/head/' + name + '.jpg'
    },
    inputDate (e) {
      const self = this
      let value = e.target.value
      if (value) {
        let dateArray = value.split('-')
        if (dateArray.length === 2) {
          self.queryEvent.starttime = dateArray[0].trim()
          self.queryEvent.endtime = dateArray[1].trim()
        }
        if (dateArray.length === 1) {
          self.queryEvent.starttime = dateArray[0]
          self.queryEvent.endtime = dateArray[0]
        }
      }
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
