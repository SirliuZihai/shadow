<template>
  <f7-page>
    <f7-navbar title="信件" back-link="Back"></f7-navbar>
    <f7-list inline-labels>
      <f7-list-input   label="标题" type="text" :disabled="!args.isAdd"
        :value="letter.title" @input="letter.title = $event.target.value" />
      <f7-list-input  label="正文" type="textarea" :disabled="!args.isAdd"
        :value="letter.content" @input="letter.content = $event.target.value" />
      <f7-list-item title="是否公开">
        <f7-toggle slot="after" :checked="letter.public"  @change="letter.public = $event.target.checked" :disabled="!args.isAdd"></f7-toggle>
      </f7-list-item>
    </f7-list>
    <f7-list v-if="args.isAdd ">
      <f7-list-button @click="saveLetter()">保存</f7-list-button>
      <f7-list-button @click="$f7router.back()">取消</f7-list-button>
      <f7-list-button @click="deleteLetter()">删除</f7-list-button>
    </f7-list>
    <f7-list v-else>
      <f7-list-button v-if="myname===othername" @click="deleteLetter()">删除</f7-list-button>
    </f7-list>
  </f7-page>
</template>

<script>
import theLetterBox from '@/pages/letterBox.vue'
export default {
  name: 'letter',
  created () {
    const self = this
    if (self.$f7route.params.option === 'show') {
      self.letter = theLetterBox.methods.getCur().curLetter
    } else if (self.$f7route.params.option === 'edit') {
      self.letter = theLetterBox.methods.getCur().curLetter
      self.args.isAdd = true
    } else if (self.$f7route.params.option === 'add') {
      self.args.isAdd = true
    }
  },
  data: function () {
    return {
      letter: {
        title: '',
        content: '',
        sender: localStorage.getItem('username'),
        public: false
      },
      myname: localStorage.getItem('username'),
      othername: theLetterBox.methods.getCur().othername,
      index: this.$f7router.params.index,
      args: {
        enable: false,
        isAdd: false
      }
    }
  },
  methods: {
    saveLetter () {
      const self = this
      let myletters = theLetterBox.methods.getCur().myletters
      let index = self.$f7route.query.index
      if (!myletters) {
        myletters = []
      }
      if (index) {
        myletters.splice(index, 1)
      }
      myletters.unshift(self.letter)
      self.$root.toastbuttom(self, '保存成功')
      self.$f7router.back()
    },
    deleteLetter () {
      const self = this
      // 如果有id则删除服务器，否则删除本地
      if (self.letter._id) {
        let url = process.env.API_HOST + 'letter/delete.do'
        self.$f7.request.promise.postJSON(url, self.letter).then(
          (data) => {
            let othername = theLetterBox.methods.getCur().othername
            theLetterBox.methods.getCur().showotherlist(othername)
            self.$root.toastbuttom(self, data.message)
            self.$f7router.back()
          },
          () => { self.$root.toastbuttom(self, '通讯异常') }
        )
      } else {
        let myletters = theLetterBox.methods.getCur().myletters
        myletters.splice(self.$f7route.query.index, 1)
        self.$f7router.back()
      }
    }
  }
}
</script>

<style scoped>

</style>
