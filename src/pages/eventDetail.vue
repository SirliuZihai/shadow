<template>
  <f7-page>
    <f7-navbar title="事件" back-link="Back"></f7-navbar>
    <f7-list no-hairlines form >
      <f7-list-input label="标题&事件" type="text"  :value="eventInfo.title" @input="eventInfo.title=$event.target.value" placeholder="请输入关键字（默认：留白）" :disabled="args.isdisable" :clear-button="!args.isdisable" />
      <f7-list-input :value="eventInfo.starttime" @input="eventInfo.starttime=$event.target.value"
        label="起始时间" :disabled="args.isdisable" type="datetime-local" placeholder="请选择时间"/>
      <f7-list-input :value="eventInfo.endtime" @input="eventInfo.endtime=$event.target.value"
        label="截止时间" :disabled="args.isdisable"
        type="datetime-local"
        placeholder="请选择时间"
      />
      <f7-list-input label="地点" type="textarea"  placeholder="请输入地址" :value="eventInfo.place.name" @focus="callMap()" :readonly="args.isdisable" :clear-button="!args.isdisable" />
      <f7-list-item title="关联人">
        <div strong style="width: 70%;height: 100%;">
          <f7-chip v-for="(p,index) in eventInfo.relationship" :key="index" :text="p" :deleteable="!args.isdisable" @delete="deleteTag(eventInfo.relationship,index,'关联人')" ></f7-chip>
          <f7-chip text="添加"  color="blue" @click="addTag()" v-if="!args.isdisable"></f7-chip>
        </div>
      </f7-list-item>
      <f7-list-item title="是否公开" :disabled="args.isdisable">
        <f7-toggle slot="after" :checked="eventInfo.public"  @change="eventInfo.public = $event.target.checked" ></f7-toggle>
      </f7-list-item>
      <f7-list-input label="说明" type="textarea"  :value="eventInfo.remark" @input="eventInfo.remark=$event.target.value" :clear-button="!args.isdisable"  :disabled="args.isdisable"/>
    </f7-list>
    <f7-list v-if="args.isdisable === true">
      <f7-list-button v-show="args.canedit" @click="args.isdisable = false">编辑</f7-list-button>
      <f7-list-button  @click="deleteEvent">删除</f7-list-button>
    </f7-list>
    <f7-list  v-else>
      <f7-list-button @click="saveEvent">保存</f7-list-button>
      <f7-list-button @click="cancel">取消</f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
import theHome from '@/pages/home.vue'
var curEventDetail
let endOfDay = new Date()
endOfDay.setHours(23)
endOfDay.setMinutes(59)
endOfDay.setSeconds(59)
export default {
  created () {
    const self = this
    curEventDetail = self
    self.eventInfo = JSON.parse(JSON.stringify(theHome.methods.getCurHome().curEvent))
    let name = localStorage.getItem('username')
    self.args.canedit = self.eventInfo.username === name
  },
  data: function () {
    const self = this
    return {
      args: {
        isdisable: true,
        canedit: false
      },
      eventInfo: {
        title: '',
        starttime: self.$root.dateFormat(new Date(), 'yyyy-MM-ddThh:mm'),
        endtime: self.$root.dateFormat(endOfDay, 'yyyy-MM-ddThh:mm'),
        relationship: [],
        remark: '',
        place: {type: 'Point', coordinates: [], name: ''},
        public: '',
        type: ''
      }
    }
  },
  methods: {
    getCur () {
      return curEventDetail
    },
    saveEvent () {
      const self = this
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
      let url = process.env.API_HOST + 'event/deleteEvent.do'
      self.$f7.request.promise.postJSON(url, {'_id': self.eventInfo._id, 'username': self.eventInfo.username}).then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
          if (data.success === true || data.message === '该记录已被移除') {
            self.$root.delEleFromArray(self.eventInfo, theHome.methods.getCurHome().events)
            // let deletobj =  if (deletobj !== null) { localStorage.setItem('events', JSON.stringify(theHome.methods.getCurHome().events)) }
            self.$root.delEleFromArray(self.eventInfo, theHome.methods.getCurHome().hisEvents)
          }
          self.$f7router.back()
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    cancel () {
      const self = this
      self.eventInfo = JSON.parse(JSON.stringify(theHome.methods.getCurHome().curEvent))
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
    callMap () {
      const self = this
      if (self.args.isdisable) {
        sessionStorage.setItem('curMapPoint', self.eventInfo.place.coordinates)
        sessionStorage.setItem('curMapPointName', self.eventInfo.place.name)
        self.$f7router.navigate('/bdmap/?businessCode=show')
      } else {
        self.$f7router.navigate('/bdmap/?businessCode=eventDetail')
      }
    }
  }
}
</script>
