<template>
  <f7-page>
    <f7-navbar title="我的状态" back-link="Back"></f7-navbar>
    <f7-list inline-labels style="margin-top: 0px">
      <f7-list-input
        label="昵称" type="text" :clear-button="!args.isdisable" :disabled="args.isdisable"
        :value="info.alias" @input="info.alias = $event.target.value"
      />
      <f7-list-item title="关注的IP">
        <div strong style="width: 70%;height: 100%;">
          <f7-chip v-show="!args.isdisable" v-for="(tag1,index) in info.ips" :key="index" :text="tag1" deleteable @delete="deleteTag(info.ips,index,'IP')"></f7-chip>
          <f7-chip v-show="args.isdisable" v-for="(tag1,index) in info.ips" :key="index" :text="tag1" @delete="deleteTag(info.ips,index,'IP')"></f7-chip>
          <f7-chip v-show="!args.isdisable" text="添加"  color="blue" @click="addTag(info.ips,'IP')"></f7-chip>
        </div>
      </f7-list-item>
      <f7-list-item title="标签">
        <div style="width: 70%;height: 100%;">
          <f7-chip v-show="!args.isdisable" v-for="(tag,index) in info.tags" :key="index" :text="tag" deleteable @delete="deleteTag(info.tags,index,'关键字')" ></f7-chip>
          <f7-chip v-show="args.isdisable" v-for="(tag,index) in info.tags" :key="index" :text="tag" @delete="deleteTag(info.tags,index,'关键字')" ></f7-chip>
          <f7-chip v-show="!args.isdisable" text="添加"  color="blue" @click="addTag(info.tags,'标签')"></f7-chip>
        </div>
      </f7-list-item>

      <f7-list-input :disabled="args.isdisable"
        label="城市" type="text" :clear-button="!args.isdisable"
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
import thehome from '@/pages/home.vue'
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
        tags: [],
        ips: [],
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
          if (data2.data === null) { return false }
          // 数组初始化，
          if (data2.data.ips === undefined) {
            data2.data.ips = []
          }
          if (data2.data.sports === undefined) {
            data2.data.sports = []
          }
          if (data2.data.tags === undefined) {
            data2.data.tags = []
          }
          self.info = data2.data
          self.infoCache = JSON.parse(JSON.stringify(data2.data))
          thehome.methods.changeTitle(self.info.alias)
        } else {
          self.toastbuttom(self, data2.message)
        }
      }).catch(() => { self.$root.toastbuttom(self, '通讯异常') })
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
      }).then((data) => {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.args.isdisable = true
          self.getInfo()
          self.$f7router.back()
        }
        self.$root.toastbuttom(self, data2.message)
      }).catch(() => { self.$root.toastbuttom(self, '通讯异常') })
    },
    cancel () {
      const self = this
      self.args.isdisable = true
      self.info = JSON.parse(JSON.stringify(self.infoCache))
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
