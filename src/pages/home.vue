<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{thetitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-home" icon-ios="f7:search" icon-md="material:search"></f7-link>
      </f7-nav-right>
      <f7-searchbar class="searchbar-home" search-container=".homeevents-list" placeholder="搜索当前事项" disableButtonText="取消" expandable></f7-searchbar>
    </f7-navbar>
    <f7-list class="homeevents-list">
      <f7-list-item v-for="e in events" :key="e.index" :title="e.title" link="\event-detail\">
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
    for (let i = 0; i < array.length; i++) {
      homeCur.events.unshift(array[i])
    }
    localStorage.setItem('events', JSON.stringify(homeCur.events))
  }
  webSocket.onopen = function () {
    webSocket.send('receive Home date')
  }
  webSocket.onerror = function (event) {
    console.log(event)
  }
  webSocket.onclose = function () {
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
  //监听下socket的close事件，代码中最好还是别用try catch了，会严重拖垮性能
  var heartid = window.setInterval(function () { // 每隔20秒钟发送一次心跳，避免websocket连接因超时而自动断开
    if (webSocket) {
      if (webSocket.readyState !== webSocket.CLOSING || webSocket.readyState !== webSocket.CLOSED) {
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
      homedefautImg: defautImg
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
    changeTitle (alia) {
      homeCur.thetitle = (alia === undefined || alia === null) ? '客官，你好' : '您好，' + alia
    },
    initSocket () {
      initSocket()
    },
    clearEvents () {
      homeCur.events = []
    }
  }
}
</script>
<style scoped>
  img{
    width: 2rem;
    height: 2rem;
  }
</style>
