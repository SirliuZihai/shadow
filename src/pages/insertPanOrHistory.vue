<template>
  <f7-page>
    <f7-navbar title="请计划您的日程" back-link="Back"></f7-navbar>
    <f7-list no-hairlines-md form >
      <f7-list-input label="标题&事件" type="text"  :value="eventInfo.title" @input="eventInfo.title=$event.target.value" placeholder="请输入关键字（默认：留白）" clear-button />
      <f7-list-input :value="eventInfo.starttime" @input="eventInfo.starttime=$event.target.value"
        label="起始时间" type="datetime-local"
        placeholder="请选择时间"/>
      <f7-list-input :value="eventInfo.endtime" @input="eventInfo.endtime=$event.target.value" style="width: 100%;"
        label="截止时间"
        type="datetime-local"
        placeholder="请选择时间"
      />
      <f7-list-input label="地点" type="text"  placeholder="请输入地址" :value="eventInfo.place" @input="eventInfo.place=$event.target.value" clear-button />
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
  data: function () {
    const self = this
    return {
      eventInfo: {
        title: '',
        starttime: self.$root.dateFormat(new Date(), 'yyyy-MM-ddThh:mm'),
        endtime: self.$root.dateFormat(endOfDay, 'yyyy-MM-ddThh:mm'),
        relationship: [],
        remark: '',
        place: '',
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
    }
  }
}
</script>
