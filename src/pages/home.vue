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
      <f7-list-item v-for="e in events" :key="e.index" :title="e.title"  :subtitle="e.remark" :badge="e.num===null?'':e.num"
                    :after="dateformate(e._id.date,'MM-dd hh:mm')"  swipeout >
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
                    :after="dateformate(e1._id.date,'MM-dd hh:mm')" swipeout>
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
var homeCur
// home event websocket
var webSocket
function initSocket () {
  var newUrl = 'ws://' + location.host + process.env.API_WS + 'websocket/homeview.do'
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
    let array = homeCur.$root.myevil(data.data)
    if (array.length === 0) { return false }
    for (let i = 0; i < array.length; i++) {
      homeCur.addEvent(array[i])
    }
    localStorage.setItem('events', JSON.stringify(homeCur.events))
    try {
      // cordovaUtil.notify(array[0], null, null)
    } catch (e) {
    }
  }
  webSocket.onopen = function () {
    webSocket.send('receive Home date')
  }
  webSocket.onerror = function (event) {
    console.log(event)
  }
  webSocket.onclose = function () {
    console.log('homeEvent closeed')
    window.clearInterval(heartid)
    let tryTime = 3 // 0 避免主动close Seocket尝试重连
    // 重试2次，每次之间间隔5秒
    if (tryTime < 2) {
      setTimeout(function () {
        webSocket = null
        tryTime++
        initSocket()
      }, 10000)
    } else {
      tryTime = 0
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
    let uname = localStorage.getItem('username')
    let pword = localStorage.getItem('password')
    if (!(uname != null && pword != null)) { self.$f7router.navigate('/LoginScreenPage/'); return false }
    var url = process.env.API_HOST + 'shiro/login.do'
    self.$f7.request.promise({
      method: 'POST',
      contentType: 'application/json',
      url: url,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {username: uname, password: pword}
    }).then((data) => {
      let data2 = self.$root.myevil(data)
      if (data2.success === true) {
        console.log(data2.message)
        self.changeTitle(data2.data.alias)
        let temp = JSON.parse(localStorage.getItem('events'))
        self.events = temp === null ? [] : temp
        initSocket()
      }
    })
  },
  methods: {
    queryHistroy () {
      const self = this
      self.args.querytime = false
      let url = process.env.API_HOST + 'event/queryHistroy.do'
      self.$f7.request.promise.postJSON(url, self.queryEvent).then(
        (data) => {
          if(data.success){
            let array = data.data
            if (array.length === 0) { return false }
            self.hisEvents = []
            for (let i = 0; i < array.length; i++) {
              self.hisEvents.push(array[i])
            }
          }else{
            self.$root.toastbuttom(self, data.message)
          }
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    // 用于监听homeWebsockt接收消息刷新页面
    addEvent (e) {
      const self = this
      let e1 = self.$root.delEleFromArray(e, self.events)
      // 计数
      if (e1.num) {
        e.num = ++e1.num
      } else {
        e.num = 1
      }
      self.events.unshift(e)
    },
    // 用于从历史中添加事件
    addEvent2 (e) {
      const self = this
      self.$root.delEleFromArray(e, self.events)
      self.events.unshift(e)
      localStorage.setItem('events', JSON.stringify(homeCur.events))
      self.$refs.searchbarHomeEvent.disable()
    },
    changeTitle (alia) {
      homeCur.thetitle = (alia === undefined || alia === null) ? '客官，你好' : '您好，' + alia
    },
    initSocket () {
      initSocket()
    },
    clearEvents () {
      homeCur.events = []
    },
    dateformate (time, fmt) {
      return this.$root.dateFormat(new Date(time), fmt)
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
