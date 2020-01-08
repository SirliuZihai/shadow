<template>
  <f7-page :page-content="false">
    <f7-navbar title="请求&通知" back-link="Back">
    </f7-navbar>
    <f7-toolbar tabbar bottom>
      <f7-link tab-link="#tab-1" tab-link-active >收到请求</f7-link>
      <f7-link tab-link="#tab-2" >发送申请</f7-link>
      <f7-link tab-link="#tab-3" >通知</f7-link>
    </f7-toolbar>
    <f7-tabs>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <f7-list  mediaList class="notify-list">
          <f7-list-item v-for="(i,index) in deal" :key="index" :title="i.sender" :subtitle="i.content" :after="dateformate(i._id,'MM-dd hh:mm')">
            <img slot="media" :src="eventImage(i.sender)" />
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-list  mediaList class="notify-list">
          <f7-list-item v-for="(a,index) in applys" :key="index" :title="fmt_applys(a,'title')" :subtitle="fmt_applys(a,'subtitle')" :after="dateformate(a._id,'MM-dd hh:mm')">
            <img slot="media" :src="eventImage(a.receiver)" />
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-list  mediaList class="notify-list" >
          <f7-list-item v-for="(c,index) in comments" :key="index" :title="c.sender" :subtitle="c.content" :after="dateformate(c._id,'MM-dd hh:mm')">
            <img slot="media" :src="eventImage(c.sender)" />
          </f7-list-item>
        </f7-list>
      </f7-tab>
    </f7-tabs>
  </f7-page>
</template>

<script>
let ObjectID = require('bson').ObjectID
export default {
  name: 'notify',
  created () {
    // 查看统计信息，并冒泡
    const self = this
    self.query(5)
    self.query(6)
    self.query(1)
    self.query(0)
  },
  data: function () {
    return {
      operNum: 0,
      noteNum: 0,
      applys: [],
      deal: [],
      comments: []
    }
  },
  methods: {
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
            for (let i = 0; i < data.data.length; i++) {
              switch (type) {
                case 1: self.comments.push(data.data[i]); break
                case 5: self.applys.push(data.data[i]); break
                case 6: self.deal.push(data.data[i]); break
              }
            }
          }
          console.log(data.message)
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
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
    detail (e) {
    },
    eventImage (name) {
      return process.env.API_HOST + 'image/head/' + name + '.jpg'
    },
    fmt_applys (a, arg) {
      if (arg === 'title') {
        let state = ''
        switch (a.state) {
          case 0: state = '未处理'; break
          case 1: state = '已忽略'; break
          case 2: state = '已同意'; break
          case 3: state = '已拒绝'; break
        }
        if (a.type === 5) {
          return a.receiver + '(' + state + ')'
        }
        if (a.type === 6) {
          return a.sender + '(' + state + ')'
        }
      }
      if (arg === 'subtitle') {
        if (a.type === 5) {
          return a.sender + '申请参与' + a.e_title
        }
        if (a.type === 6) {
          return '邀请' + a.receiver + '参与' + a.e_title
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
