<template>
  <f7-page>
    <f7-navbar title="事件" back-link="Back">
      <f7-nav-right>
        <f7-link icon-f7="star_round_fill" :href="'/tips/?eventId='+eventInfo._id"></f7-link>
      </f7-nav-right>
    </f7-navbar>
    <f7-list no-hairlines form >
      <f7-list-input label="标题&事件" type="textarea"  resizable :value="eventInfo.title" @input="eventInfo.title=$event.target.value" placeholder="请输入关键字（默认：留白）" :disabled="args.isdisable" :clear-button="!args.isdisable" />
      <f7-list-input inputId="rangtime" label="起止日期"  placeholder="请选择日期" :value="eventInfo.starttime+'-'+eventInfo.endtime" @change="inputDate" :disabled="args.isdisable" />
      <f7-list-input :disabled="args.isdisable" label="地点" type="textarea" resizable placeholder="请输入地址" :value="eventInfo.place.name" @focus="callMap()" :readonly="args.isdisable" :clear-button="!args.isdisable" />
      <f7-list-item :disabled="true" title="发起人">
        <div strong style="width: 70%;height: 100%;"><f7-chip :text="eventInfo.username"></f7-chip></div></f7-list-item>
      <f7-list-item :disabled="args.isdisable" title="关联人">
        <div strong style="width: 70%;height: 100%;">
          <f7-chip v-show="!args.isdisable" v-for="(p,index) in eventInfo.relationship" :key="index" :text="p" deleteable @delete="deleteTag(eventInfo.relationship,index,'关联人')" ></f7-chip>
          <f7-chip v-show="args.isdisable" v-for="(p,index) in eventInfo.relationship" :key="index" :text="p"  @delete="deleteTag(eventInfo.relationship,index,'关联人')" ></f7-chip>
          <f7-chip text="邀请"  color="blue" @click="addTag()" v-if="!args.isdisable"></f7-chip>
        </div>
      </f7-list-item>
      <f7-list-item title="是否公开" :disabled="args.isdisable">
        <f7-toggle slot="after" :checked="eventInfo.public"  @change="eventInfo.public = $event.target.checked" ></f7-toggle>
      </f7-list-item>
      <f7-list-item title="事件分类" smart-select :smart-select-params="{openIn: 'popover'}" :disabled="args.isdisable">
        <div :style="'height:1rem; width: 1rem;background:'+colorMap[eventInfo.type]"></div>
        <select :value="eventInfo.type" @change="eventInfo.type = $event.target.value">
          <option value="3">普通</option>
          <option value="2">重要</option>
          <option value="1">紧急</option>
          <option value="0">紧急重要</option>
        </select>
      </f7-list-item>
      <f7-list-input label="说明" type="textarea"  resizable :value="eventInfo.remark" @input="eventInfo.remark=$event.target.value" :clear-button="!args.isdisable"  :disabled="args.isdisable"/>
    </f7-list>
    <f7-list v-if="args.justShow === true"></f7-list>
    <f7-list v-else-if="args.isdisable === true">
      <f7-list-button v-show="args.canedit" @click="args.isdisable = false">编辑</f7-list-button>
      <f7-list-button  v-show="args.canedit"  @click="deleteEvent">删除</f7-list-button>
      <f7-list-button v-show="!args.canedit" @click="deleteEvent">不参与</f7-list-button>
    </f7-list>
    <f7-list  v-else>
      <f7-list-button @click="saveEvent">保存</f7-list-button>
      <f7-list-button @click="cancel">取消</f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
import theEventPage from '@/pages/homeSub/eventsPage.vue'
var curEventDetail
let endOfDay = new Date()
endOfDay.setHours(23)
endOfDay.setMinutes(59)
endOfDay.setSeconds(59)
export default {
  created () {
    const self = this
    curEventDetail = self
    self.eventInfo = JSON.parse(JSON.stringify(theEventPage.methods.getCur().curEvent))
    let name = localStorage.getItem('username')
    self.args.canedit = self.eventInfo.username === name
    if (self.$f7route.query.option === 'publicSee') {
      self.args.justShow = true
    }
  },
  mounted () {
    const self = this
    // Range Picker
    self.calendarRange = self.$f7.calendar.create({
      inputEl: '#rangtime',
      dateFormat: 'yyyymmdd',
      rangePicker: true
    })
  },
  data: function () {
    const self = this
    return {
      args: {
        isdisable: true,
        canedit: false,
        justShow: false
      },
      colorMap: ['#e91e63', '#ff9800', '#2196f3', '#4caf50'],
      eventInfo: {
        title: '',
        starttime: self.$root.dateFormat(new Date(), 'yyyyMMdd'),
        endtime: self.$root.dateFormat(endOfDay, 'yyyyMMdd'),
        relationship: [],
        remark: '',
        place: {type: 'Point', coordinates: [], name: ''},
        public: '',
        type: 3
      }
    }
  },
  methods: {
    getCur () {
      return curEventDetail
    },
    saveEvent () {
      const self = this
      if (!self.eventInfo.title) {
        self.$f7.dialog.alert('标题不能为空')
      }
      let url = process.env.API_HOST + 'event/saveEvent.do'
      delete self.eventInfo.latestMsg
      self.$f7.request.promise.postJSON(url, self.eventInfo).then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
          if (data.success === true)self.args.isdisable = true
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    deleteEvent () {
      const self = this
      self.$f7.dialog.confirm('是否删除该事件', () => {
        let url = process.env.API_HOST + 'event/deleteEvent.do'
        self.$f7.request.promise.postJSON(url, {'_id': self.eventInfo._id, 'username': self.eventInfo.username}).then(
          (data) => {
            self.$root.toastbuttom(self, data.message)
            if (data.success === true || data.message === '该记录已被移除') {
              self.$root.delEleFromArray(self.eventInfo, theEventPage.methods.getCur().events)
            }
            self.$f7router.back()
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      }, null)
    },
    cancel () {
      const self = this
      self.eventInfo = JSON.parse(JSON.stringify(theEventPage.methods.getCur().curEvent))
      self.args.isdisable = true
    },
    deleteTag (array, index, text) {
      const self = this
      self.$root.deleteTag(self, array, index, text)
    },
    addTag () {
      const self = this
      self.$f7router.navigate('/contact/?option=eventDetail')
    },
    inputDate (e) {
      const self = this
      let value = e.target.value
      if (value) {
        let dateArray = value.split('-')
        if (dateArray.length === 2) {
          self.eventInfo.starttime = dateArray[0].trim()
          self.eventInfo.endtime = dateArray[1].trim()
        }
        if (dateArray.length === 1) {
          self.eventInfo.starttime = dateArray[0]
          self.eventInfo.endtime = dateArray[0]
        }
      }
    },
    callMap () {
      const self = this
      if (self.eventInfo.place.coordinates) {
        sessionStorage.setItem('curMapPoint', self.eventInfo.place.coordinates)
      } else {
        sessionStorage.setItem('curMapPoint', null)
      }
      if (self.eventInfo.place.name) {
        sessionStorage.setItem('curMapPointName', self.eventInfo.place.name)
      } else {
        sessionStorage.setItem('curMapPointName', '')
      }
      if (self.args.isdisable) {
        self.$f7router.navigate('/bdmap/?businessCode=show')
      } else {
        self.$f7router.navigate('/bdmap/?businessCode=eventDetail')
      }
    }
  }
}
</script>
