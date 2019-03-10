<template>
  <f7-page>
    <f7-navbar title="他的状态" back-link="Back"></f7-navbar>
    <f7-list inline-labels>
      <f7-list-input
        label="备注" type="text"
        :value="myInfo.remark" @input="myInfo.remark = $event.target.value"
      />
      <f7-list-input
        label="标签" type="text"
        :value="myInfo.tag" @input="myInfo.tag = $event.target.value"
      />
      <f7-list-item title="是否关注">
        <f7-toggle slot="after" :checked="myInfo.interest"  @change="myInfo.interest = $event.target.checked"></f7-toggle>
      </f7-list-item>
      <f7-list-input label="昵称" type="text" disabled :value="info.alias"  />
      <f7-list-input label="状态" type="text" disabled :value="info.doing"  />
      <f7-list-input label="城市" type="text" disabled :value="info.replace"  />
    </f7-list>
    <f7-list>
      <f7-list-button @click="updateInfo">保存</f7-list-button>
      <f7-list-button @click="deletePeople">删除</f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
export default {
  created: function () {
    const self = this
    let people = self.$f7route.params.people
    let contacts = JSON.parse(sessionStorage.getItem('contacts'))
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].people === people) {
        self.myInfo = contacts[i]
        break
      }
    }
    self.getInfo()
  },
  data: function () {
    return {
      info: {
        alias: '',
        doing: '',
        place: ''
      },
      myInfo: {
        remark: '',
        tag: '',
        interest: false,
        people: ''
      }
    }
  },
  methods: {
    getInfo () {
      const self = this
      var url = process.env.API_HOST + 'user/userInfo.do'
      let people = self.$f7route.params.people
      this.$f7.request.promise({
        contentType: 'application/json',
        method: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: {'username': people}
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.info = data2.data
        } else {
          self.$root.toastbuttom(self, data2.message)
        }
      })
    },
    updateInfo () {
      const self = this
      var url = process.env.API_HOST + 'user/updateRelation.do'
      this.$f7.request.promise({
        contentType: 'application/json',
        method: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: self.myInfo
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        self.$root.toastbuttom(self, data2.message)
        if (data2.success === true) {
          self.$f7router.clearPreviousPages()
        }
      })
    },
    deletePeople () {
      const self = this
      var url = process.env.API_HOST + 'user/removeRelation.do'
      let people = self.$f7route.params.people
      this.$f7.request.promise({
        contentType: 'application/json',
        method: 'POST',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: {'people': people}
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        self.$root.toastbuttom(self, data2.message)
        if (data2.success === true) {
          self.$f7router.back()
        }
      })
    },
    sendMessage () {

    }
  }
}
</script>

<style scoped>

</style>
