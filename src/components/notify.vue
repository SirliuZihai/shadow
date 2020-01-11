<template>
  <f7-page :page-content="false">
    <f7-navbar title="请求&通知" back-link="Back">
    </f7-navbar>
    <f7-toolbar tabbar bottom>
      <f7-link tab-link="#tab-1" tab-link-active >收到请求({{args.dealNum}})</f7-link>
      <f7-link tab-link="#tab-2" >发送申请</f7-link>
      <f7-link tab-link="#tab-3" @click="ignore(1);args.notifyNum = 0">通知({{args.notifyNum}})</f7-link>
    </f7-toolbar>
    <f7-tabs>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <f7-list  mediaList class="notify-list">
          <f7-list-item v-for="(i,index) in deal" :key="index" :title="fmt_applys(i,'title')" :subtitle="fmt_applys(i,'subtitle')" :after="dateformate(i._id,'MM-dd hh:mm')"
            @click="detail(i.e_list)" swipeout>
            <f7-swipeout-actions right>
              <f7-swipeout-button close color="blue" @click="accept(i)">同意</f7-swipeout-button>
              <f7-swipeout-button close color="red" @click="deny(i)">拒绝</f7-swipeout-button>
            </f7-swipeout-actions>
            <img slot="media" :src="eventImage(i.sender)" />
          </f7-list-item>
        </f7-list>
        <f7-block-footer v-show="args.tab1noMore===true" style="text-align: center">
          没有更多了
        </f7-block-footer>
        <div class="ptr-preloader">
          <div class="preloader"></div>
          <div class="ptr-arrow"></div>
        </div>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-list  mediaList class="notify-list">
          <f7-list-item v-for="(a,index) in applys" :key="index" :title="fmt_applys(a,'title')" :subtitle="fmt_applys(a,'subtitle')" :after="dateformate(a._id,'MM-dd hh:mm')"
                        @click="detail(a.e_list)">
            <img slot="media" :src="eventImage(a.receiver)" />
          </f7-list-item>
        </f7-list>
          <f7-block-footer v-show="args.tab2noMore===true" style="text-align: center">
            没有更多了
          </f7-block-footer>
          <div class="ptr-preloader">
            <div class="preloader"></div>
            <div class="ptr-arrow"></div>
          </div>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-list  mediaList class="notify-list" >
          <f7-list-item v-for="(c,index) in comments" :key="index" :title="c.sender" :subtitle="c.content" :after="dateformate(c._id,'MM-dd hh:mm')" :link="'/tips/?tipId='+c.relateId">
            <img slot="media" :src="eventImage(c.sender)" />
          </f7-list-item>
        </f7-list>
          <f7-block-footer v-show="args.tab3noMore===true" style="text-align: center">
            没有更多了
          </f7-block-footer>
          <div class="ptr-preloader">
            <div class="preloader"></div>
            <div class="ptr-arrow"></div>
          </div>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
import EventPage from '@/pages/homeSub/eventsPage.vue'
let ObjectID = require('bson').ObjectID
export default {
  name: 'notify',
  created () {
    // 查看统计信息，并冒泡
    const self = this
    self.count()
    self.query(5)
    self.query(6)
    self.query(1)
    /* self.$$('#div_tab-1').on('ptr:refresh', function (e) {
      if (self.args.tab1noMore === false) {
        self.query(6)
        e.detail()
      }
    })
    self.$$('#div_tab-2').on('ptr:refresh', function (e) {
      if (self.args.tab2noMore === false) {
        self.query(5)
      }
      e.detail()
    })
    self.$$('#div_tab-3').on('ptr:refresh', function (e) {
      if (self.args.tab3noMore === false) {
        self.query(1)
      }
      e.detail()
    }) */
  },
  data: function () {
    return {
      operNum: 0,
      noteNum: 0,
      applys: [],
      deal: [],
      comments: [],
      args: {
        dealNum: 0,
        notifyNum: 0,
        tab1noMore: false,
        tab2noMore: false,
        tab3noMore: false
      }
    }
  },
  methods: {
    count () {
      const self = this
      let url = process.env.API_HOST + 'notify/countNofify.do'
      self.$f7.request.promise.get(url, null, 'json').then(
        (data) => {
          if (data.success) {
            // 总数
            self.args.dealNum = data.data.map((a) => { return a._id >= 5 ? a.count : 0 }).reduce((x, y) => { return x + y })
            self.args.notifyNum = data.data.map((a) => { return a._id < 5 ? a.count : 0 }).reduce((x, y) => { return x + y })
          }
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    accept (i) {
      const self = this
      if (i.state !== 0) {
        self.$f7.dialog.alert('已经处理过了')
        return false
      }
      let url = process.env.API_HOST + 'event/accept.do'
      self.$f7.request.promise.get(url, {_id: i._id, eventId: i.relateId, type: i.type, sender: i.sender, receiver: i.receiver}, 'json').then(
        (data) => {
          if (data.success) {
            i.state = 2
            self.args.dealNum--
          }
          self.$root.toastbuttom(self, data.message)
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    deny (i) {
      const self = this
      if (i.state !== 0) {
        self.$f7.dialog.alert('已经处理过了')
        return false
      }
      let url = process.env.API_HOST + 'event/deny.do'
      self.$f7.request.promise.get(url, {_id: i._id}, 'json').then(
        (data) => {
          if (data.success) {
            i.state = 3
            self.args.dealNum--
          }
          self.$root.toastbuttom(self, data.message)
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    query (type) {
      const self = this
      let skipNum = 0
      switch (type) {
        case 1: skipNum = self.comments.length; break
        case 5: skipNum = self.applys.length; break
        case 6: skipNum = self.deal.length; break
      }
      let url = process.env.API_HOST + 'notify/queryNofify.do' // {type:'notes',skipNum:0} + username
      self.$f7.request.promise.postJSON(url, {type: type, skipNum: skipNum}, 'json').then(
        (data) => {
          if (data.success === true) {
            if (data.data.length === 0) {
              switch (type) {
                case 1: self.args.tab3noMore = true; break
                case 5: self.args.tab2noMore = true; break
                case 6: self.args.tab1noMore = true; break
              }
            }
            for (let i = 0; i < data.data.length; i++) {
              switch (type) {
                case 1: self.comments.push(data.data[i]); break
                case 5: self.applys.push(data.data[i]); break
                case 6: self.deal.push(data.data[i]); break
              }
            }
            self.$$('.ptr-preloader').hide()
          }
          console.log(data.message)
        },
        (e) => { self.$$('.ptr-preloader').hide(); self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    ignore (type) {
      const self = this
      let url = process.env.API_HOST + 'notify/ignoreNotify.do' // {type:'notes',skipNum:0} + username
      self.$f7.request.promise.get(url, {type: type}, 'json').then(
        (data) => {
          if (data.success === false) {
            console.log(data.message)
          }
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    dateformate (id, fmt) {
      return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt)
    },
    eventImage (name) {
      return process.env.API_HOST + 'image/head/' + name + '.jpg'
    },
    detail (e) {
      const self = this
      EventPage.methods.getCur().curEvent = e
      self.$f7router.navigate('/event-detail/?option=publicSee')
    },
    fmt_applys (a, arg) {
      let username = localStorage.getItem('username')
      let state = ''
      switch (a.state) {
        case 0: state = '未处理'; break
        case 1: state = '已忽略'; break
        case 2: state = '已同意'; break
        case 3: state = '已拒绝'; break
      }
      if (!a.e_title) {
        a.e_title = '[已删除]'
      }
      if (a.sender === username) {
        if (a.type === 5) { // 申请
          if (arg === 'title') {
            return a.receiver + '(' + state + ')'
          }
          if (arg === 'subtitle') {
            return '申请参与' + a.e_title
          }
        }
        if (a.type === 6) { // 邀请
          if (arg === 'title') {
            return a.receiver + '(' + state + ')'
          }
          if (arg === 'subtitle') {
            return '邀请' + a.receiver + '参与' + a.e_title
          }
        }
      } else {
        if (a.type === 5) { // 申请
          if (arg === 'title') {
            return a.sender + '(' + state + ')'
          }
          if (arg === 'subtitle') {
            return '申请参与' + a.e_title
          }
        }
        if (a.type === 6) { // 邀请
          if (arg === 'title') {
            return a.sender + '(' + state + ')'
          }
          if (arg === 'subtitle') {
            return '邀请您参与' + a.e_title
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .notify-list{
    margin-top: 0px;
  }
  img{
    width: 3rem;
    height: 3rem;
  }
</style>
