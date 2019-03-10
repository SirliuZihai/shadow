<template>
  <f7-page>
    <f7-navbar title="请计划您的日程" back-link="Back"></f7-navbar>
    <f7-list inline-labels form >
      <f7-list-input label="标题&事件" type="text"  :value="eventInfo.title" @input="eventInfo.title=$event.target.value" placeholder="请输入关键字（默认：留白）" clear-button />
      <f7-list-input :value="eventInfo.starttime" @input="eventInfo.starttime=$event.target.value"
        label="起始时间"
        type="datetime-local"
        placeholder="请选择时间"
      />
      <f7-list-input :value="eventInfo.endtime" @input="eventInfo.endtime=$event.target.value"
        label="截止时间"
        type="datetime-local"
        placeholder="请选择时间"
      />
      <f7-list-input label="地点" type="text"  placeholder="请输入地址" :value="eventInfo.place" @input="eventInfo.place=$event.target.value" clear-button />
      <f7-list-input label="关联人" type="text" placeholder="请选择关联人" :value="eventInfo.relationship" @input="eventInfo.relationship=$event.target.value" clear-button />
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
let endOfDay = new Date()
endOfDay.setHours(23)
endOfDay.setMinutes(59)
endOfDay.setSeconds(59)
export default {
  data: function () {
    const self = this
    return {
      eventInfo: {
        title: '',
        starttime: self.$root.dateFormat(new Date(), 'yyyy-MM-ddThh:mm'),
        endtime: self.$root.dateFormat(endOfDay, 'yyyy-MM-ddThh:mm'),
        relationship: '',
        remark: '',
        place: '',
        public: '',
        type: ''
      }
    }
  },
  methods: {
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
    }
  }
}
</script>

<style scoped>

</style>
