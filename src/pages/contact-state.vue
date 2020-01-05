<template>
  <f7-page>
    <f7-navbar title="他的状态" back-link="Back"></f7-navbar>
    <f7-list inline-labels>
      <f7-list-input
        label="备注" type="text"
        :value="myInfo.remark" @input="myInfo.remark = $event.target.value"
      />
      <f7-list-item title="标签">
        <div strong style="width: 70%;height: 100%;">
          <f7-chip v-for="(tag,index) in myInfo.tags" :key="index" :text="tag" deleteable @delete="deleteTag(myInfo.tags,index,'标签')" ></f7-chip>
          <f7-chip text="添加"  color="blue" @click="addTag(myInfo.tags,'标签')"></f7-chip>
        </div>
      </f7-list-item>
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
import theList from '@/pages/contacts-list.vue'
export default {
  created: function () {
    const self = this
    let people = self.$f7route.params.people
    let contacts = JSON.parse(localStorage.getItem(self.$root.prefx + 'contacts'))
    for (let i = 0; i < contacts.length; i++) {
      if (contacts[i].people === people) {
        // 数组初始化，
        if (contacts[i].tags === undefined) {
          contacts[i].tags = []
        }
        self.myInfo = contacts[i]
        break
      }
    }
    self.getInfo()
    self.myInfo.people = people
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
        tags: [],
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
          // 缓存了 self.$f7router.clearPreviousPages()
          theList.methods.getCur().getContact()
          self.$f7router.back()
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

    },
    deleteTag (array, index, text) {
      const self = this
      self.$root.deleteTag(self, array, index, text)
    },
    addTag (array, text) {
      const self = this
      self.$f7.dialog.prompt('请添加' + text, (data) => {
        self.$root.addTag(self, array, data)
      }, null)
    }
  }
}
</script>

<style scoped>

</style>
