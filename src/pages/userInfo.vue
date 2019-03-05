<template>
  <f7-page>
    <f7-navbar title="我的状态" back-link="Back"></f7-navbar>
    <f7-list inline-labels>
      <f7-list-input
        label="昵称" type="text" :clear-button="!args.isdisable" :disabled="args.isdisable"
        :value="info.alias" @input="info.alias = $event.target.value"
      />
      <f7-list-input
        label="背景音乐" type="text" :clear-button="!args.isdisable" :disabled="args.isdisable"
        :value="info.music" @input="info.music = $event.target.value"
      />
      <f7-list-input
        label="关注的书" type="text" :clear-button="!args.isdisable" :disabled="args.isdisable"
        :value="info.book" @input="info.book = $event.target.value"
      />
      <f7-list-input
        label="关注的运动" type="text" :clear-button="!args.isdisable" :disabled="args.isdisable"
        :value="info.sport" @input="info.sport = $event.target.value"
      />
      <f7-list-input :disabled="args.isdisable"
        label="关键字" type="text" :clear-button="!args.isdisable" placeholder="请输入关键字（词）（如：A,B）,它将用于邀请索引"
        :value="info.like" @input="info.like = $event.target.value"
      />
      <f7-list-input :disabled="args.isdisable"
        label="位置" type="text" :clear-button="!args.isdisable" placeholder="请输入一个位置，系统将自动为您打卡"
        :value="info.place" @input="info.place = $event.target.value"
      />
    </f7-list>
    <f7-list v-if="args.isdisable === true">
    <f7-list-button  @click="args.isdisable = false">编辑</f7-list-button>
  </f7-list>
    <f7-list v-else>
      <f7-list-button @click="saveInfo">保存</f7-list-button>
      <f7-list-button @click="cancel">取消</f7-list-button>
    </f7-list>

  </f7-page>
</template>

<script>
export default {
  created: function () {
    const self = this
    self.getInfo()
  },
  data: function () {
    return {
      info: {
        alias: '',
        doing: '',
        like: '',
        music: '',
        book: '',
        sport: '',
        place: ''
      },
      infoCache: {},
      args: {
        isdisable: true
      }
    }
  },
  methods: {
    getInfo () {
      const self = this
      var url = process.env.API_HOST + 'user/userInfo.do'
      this.$f7.request.promise({
        method: 'GET',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.info = data2.data
          self.infoCache = Object.assign({}, data2.data)
        } else {
          self.toastbuttom(data2.message)
        }
      })
    },
    saveInfo () {
      const self = this
      var url = process.env.API_HOST + 'user/saveUserInfo.do'
      this.$f7.request.promise({
        method: 'POST',
        contentType: 'application/json',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: self.info
      }).then(function (data) {
        if (data === 'OK') {
          self.toastbuttom('保存成功')
          self.args.isdisable = true
          self.getInfo()
        } else {
          self.toastbuttom(data)
        }
      })
    },
    toastbuttom (data) {
      const self = this
      if (!self.toastBottom) {
        self.toastBottom = self.$f7.toast.create({
          text: data,
          closeTimeout: 2000
        })
      }
      // Open it
      self.toastBottom.open()
    },
    cancel () {
      const self = this
      self.args.isdisable = true
      self.info = self.infoCache
    }
  }
}
</script>

<style scoped>

</style>
