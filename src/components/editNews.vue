<template>
    <f7-page>
      <f7-navbar title="编辑" back-link="Back">
        <f7-nav-right>
          <f7-link text="发布" @click="publissh()">
          </f7-link>
        </f7-nav-right>
      </f7-navbar>
      <f7-photo-browser type="popup" :photos="tip.picture" ref="photosbrowser" />
      <f7-list no-hairlines form >
        <f7-list-input type="textarea" :value="tip.context" @input="tip.context=$event.target.value"  clear-button />
        <f7-list-item>
          <div style="float: left;width: 100%" @click="$refs.photosbrowser.open()">
            <template v-for="(pic,index) in tip.picture" >
              <img style="float: left" src="imgUrl(pic)" width="33%" :key="index"/>
            </template>
          </div>
        </f7-list-item>

        <f7-list-button @click="addPic()">添加图片</f7-list-button>
        <f7-list-item title="关联事件">
          <div strong style="width: 70%;height: 100%;">
            <f7-chip :text="relateEvents[0]" ></f7-chip>
            <f7-chip text="选择事件"  color="blue" @click="relateEvent()"></f7-chip>
          </div>
        </f7-list-item>
        <f7-list-item title="允许联系人加入">
          <f7-toggle slot="after" :checked="tip.enter"  @change="tip.enter = $event.target.checked"></f7-toggle>
        </f7-list-item>
        <f7-list-item title="谁可以看">
          <div strong style="width: 70%;height: 100%;">
              <f7-chip v-if="tip.range.length === 0" text="公开" ></f7-chip>
              <f7-chip v-for="(tag,index) in tip.range" :key="index" :text="tag" ></f7-chip>
              <f7-chip text="添加标签"  color="blue" @click="addRange()"></f7-chip>
          </div>
        </f7-list-item>
      </f7-list>
    </f7-page>
</template>

<script>
import photo from '@/assets/js/phonto.js'
var curEdit
export default {
  name: 'editNews',
  data: function () {
    return {
      relateEvents: [],
      tip: {
        eventId: '',
        context: '',
        picture: [],
        enter: false,
        publisher: localStorage.getItem('username'),
        range: []
      }
    }
  },
  created () {
    const self = this
    curEdit = self
  },
  methods: {
    addPic () {
      const self = this
      self.$root.curSelf = self
      if (self.$device.android === true || self.$device.ios === true) {
        photo.upPicture('tempFile', self.tip.picture)
      }
    },
    addRange () {
      const self = this
      let outArray = []
      let helpArray = []
      let contacts = JSON.parse(localStorage.getItem(self.$root.prefx + 'contacts'))
      for (let i = 0; i < contacts.length; i++) {
        // 数组初始化，
        if (contacts[i].tags === undefined) {
          continue
        }
        for (let j = 0; j < contacts[i].tags.length; j++) {
          let a = contacts[i].tags[j]
          if (helpArray.indexOf(a) === -1) {
            helpArray.push(a)
            outArray.push({'text': a, onClick: () => { if (self.tip.range.indexOf(a) === -1)self.tip.range.push(a) }})
          }
        }
      }
      outArray.push({'text': '取消'})
      self.$f7.dialog.create({
        title: '选择标签',
        buttons: outArray,
        verticalButtons: true,
        cssClass: 'tipsDialog'
      }).open()
    },
    relateEvent () {
      curEdit.$f7router.navigate('/queryEventHis/?option=editNews')
    },
    publissh () {
      const self = this
      if (!(self.tip.context || self.tip.picture.length !== 0)) {
        self.$f7.dialog.alert('内容不能为空！')
        return false
      }
      if (!self.tip.eventId) {
        self.$f7.dialog.alert('必须关联事件！')
        return false
      }

      let url = process.env.API_HOST + 'tips/addTip.do'
      self.$f7.request.promise.postJSON(url, self.tip).then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
          self.$f7router.back()
        },
        () => { self.$root.toastbuttom(self, '通讯异常') }
      )
    },
    getCur () {
      return curEdit
    }
  }
}
</script>

<style scoped>
  .tipsDialog {
    height:10rem;
  }
</style>
