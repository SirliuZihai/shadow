<template>
  <f7-page>
    <f7-navbar>
      <f7-searchbar ref="searchbarHomeEvent" @input="queryEvent.title = $event.target.value" @focus="args.querytime = true"
                    @searchbarDisable="$f7router.back()"  placeholder="搜索历史事项" disableButtonText="取消">
      </f7-searchbar>
    </f7-navbar>
    <f7-list inline-labels form v-show="args.querytime" style="margin-top: 0px">
      <f7-list-input inputId="homeRangtime" label="起止日期"  placeholder="请选择日期" :value="queryEvent.starttime+'-'+queryEvent.endtime" @change="inputDate" />
      <f7-list-button @click="queryHistroy">查询</f7-list-button>
    </f7-list>
    <f7-list class="searchbar-found" mediaList style="margin-top: 0px">
      <f7-list-item v-for="e1 in hisEvents" :key="e1.index" :title="e1.title"  :subtitle="e1.remark" @click="addEvent2(e1)"
                    :after="dateformate(e1._id,'MM-dd hh:mm')" swipeout>
        <f7-swipeout-actions right>
          <f7-swipeout-button close color="blue" @click="detail(e1)">详情</f7-swipeout-button>
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
import eventPage from '@/pages/homeSub/eventsPage.vue'
import EditNews from '@/components/editNews.vue'
let ObjectID = require('bson').ObjectID
export default {
  name: 'queryEventHistory',
  mounted () {
    const self = this
    // Range Picker
    self.calendarRange = self.$f7.calendar.create({
      inputEl: '#homeRangtime',
      dateFormat: 'yyyymmdd',
      rangePicker: true
    })
  },
  data: function () {
    return {
      queryEvent: {
        title: '',
        starttime: '',
        endtime: ''
      },
      hisEvents: [],
      args: {
        querytime: false
      }
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
    },
    // 用于从历史中添加事件
    addEvent2 (e) {
      const self = this
      let option = self.$f7route.query.option
      if (option) {
        if (option === 'editNews') {
          const curEdit = EditNews.methods.getCur()
          curEdit.relateEvents.length = 0
          self.$root.addTag(curEdit, curEdit.relateEvents, e.title)
          curEdit.tip.eventId = e._id
          self.$f7router.back()
        }
      } else {
        self.$root.delEleFromArray(e, eventPage.methods.getCur().events)
        eventPage.methods.getCur().events.unshift(e)
        self.$refs.searchbarHomeEvent.disable()
      }
    },
    dateformate (id, fmt) {
      return this.$root.dateFormat(new Date((new ObjectID(id)).getTimestamp()), fmt)
    },
    eventImage (name) {
      return process.env.API_HOST + 'image/head/' + name + '.jpg'
    },
    detail (e) {
      eventPage.methods.getCur().curEvent = e
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
