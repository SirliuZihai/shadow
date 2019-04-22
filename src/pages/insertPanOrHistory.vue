<template>
  <f7-page>
    <f7-navbar title="添加事件" back-link="Back"></f7-navbar>
    <f7-list no-hairlines form >
      <f7-list-input label="标题&事件" type="text"  :value="eventInfo.title" @input="eventInfo.title=$event.target.value" placeholder="请输入关键字（默认：留白）" clear-button />
      <f7-list-input inputId="rangtime" label="起止日期"  placeholder="请选择日期" :value="eventInfo.starttime+'-'+eventInfo.endtime" @change="inputDate"/>
      <f7-list-input label="地点" type="textarea"  placeholder="请输入地址" :value="eventInfo.place.name" @focus="callMap()" @input="eventInfo.place=$event.target.value" clear-button />
      <f7-list-item title="关联人">
        <div strong style="width: 70%;height: 100%;">
          <f7-chip v-for="(p,index) in eventInfo.relationship" :key="index" :text="p" deleteable @delete="deleteTag(eventInfo.relationship,index,'关联人')" ></f7-chip>
          <f7-chip text="添加"  color="blue" @click="addTag()"></f7-chip>
        </div>
      </f7-list-item>
      <f7-list-item title="是否公开">
        <f7-toggle slot="after" :checked="eventInfo.public"  @change="eventInfo.public = $event.target.checked"></f7-toggle>
      </f7-list-item>
      <f7-list-input label="说明" type="textarea"  :value="eventInfo.remark" @input="eventInfo.remark=$event.target.value" clear-button />
    </f7-list>
    <f7-list>
      <f7-list-button @click="saveEvent">保存</f7-list-button>
      <f7-list-button @click="$f7router.back()">取消</f7-list-button>
    </f7-list>
  </f7-page>
</template>
<script>
var CurInserPan
let endOfDay = new Date()
endOfDay.setHours(23)
endOfDay.setMinutes(59)
endOfDay.setSeconds(59)
export default {
  created () {
    CurInserPan = this
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
      eventInfo: {
        title: '',
        starttime: self.$root.dateFormat(new Date(), 'yyyyMMdd'),
        endtime: self.$root.dateFormat(endOfDay, 'yyyyMMdd'),
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
      return CurInserPan
    },
    saveEvent () {
      const self = this
      let url = process.env.API_HOST + 'event/saveEvent.do'
      self.$f7.request.promise.postJSON(url, self.eventInfo).then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
          self.$f7router.back()
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    deleteTag (array, index, text) {
      const self = this
      self.$root.deleteTag(self, array, index, text)
    },
    addTag () {
      const self = this
      self.$f7router.navigate('/contact/?option=insertEvent')
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
      self.$f7router.navigate('/bdmap/?businessCode=insertPalce')
    }
  }
}
</script>
