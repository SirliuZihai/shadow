<template>
  <f7-page>
    <f7-navbar title="信箱" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-otherletters" icon-ios="f7:search" icon-md="material:search"></f7-link>
          <f7-menu-item icon-f7="add" style="margin-left: auto" link=true dropdown>
              <f7-menu-dropdown right>
                <f7-menu-dropdown-item text="添加信件" href="/letter/add/"></f7-menu-dropdown-item>
                <f7-menu-dropdown-item text="刷新"  href="#" @click="getNearrBox()" ></f7-menu-dropdown-item>
              </f7-menu-dropdown>
           </f7-menu-item>
      </f7-nav-right>
      <f7-searchbar class="searchbar-otherletters" search-container=".letter-list" @searchbarEnable="lettersShow=false" @searchbarDisable="lettersShow=true"  disableButtonText="取消" placeholder="搜索附近信箱" expandable></f7-searchbar>
    </f7-navbar>
    <f7-toolbar tabbar bottom>
    <!--<f7-link tab-link="#tab-1" >我的信箱</f7-link>-->
      <f7-link tab-link="#tab-2" tab-link-active >附近的信箱</f7-link>
      <f7-link tab-link="#tab-3" >我的信件</f7-link>
    </f7-toolbar>
    <f7-tabs swipeable>
      <f7-tab id="tab-2" class="page-content" tab-active>
        <f7-list v-show="!args.showotherletter" class="letter-list">
          <f7-list-item v-for="o in otherletterBox" :key="o.index" :title="o.username + 的信箱" @click="args.showotherletter=true;showotherlist(o.username)">
          </f7-list-item>
        </f7-list>
        <f7-list v-show="args.showotherletter" class="letter-list">
          <f7-list-item v-for="ol in otherletters" :key="ol.index" :title="ol.title" @click="showDetal(ol)">
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-list class="letter-list">
          <f7-list-item v-for="m in myletters" :key="m.index" :title="m.title" :subtitle="m.content" @click="showDetal(m)">
          </f7-list-item>
        </f7-list>
      </f7-tab>
    </f7-tabs>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import phonto from '@/assets/js/phonto.js'
var curLetterBox
export default {
  created () {
    const self = this
    curLetterBox = self
    let myletters = JSON.parse(localStorage.getItem('myletters'))
    if (myletters) { self.myletters = myletters }
    self.getNearrBox()
  },
  data: function () {
    return {
      curLetter: {}, // 当前看的
      othername: '', // 用于查询的
      otherletters: [], // 别人信箱的信件
      otherletterBox: [], // 别人的信箱
      myletters: [], // 我写的
      args: {
        showotherletter: false
      }
    }
  },
  watch: {
    myletters: {
      handler: function (val) {
        localStorage.setItem('myletters', JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    getCur () {
      return curLetterBox
    },
    showDetal (l) {
      const self = this
      self.curLetter = l
      self.$f7router.navigate('/letter/show/')
    },
    sendLetter () {
      const self = this
      let url = process.env.API_HOST + 'letter/send.do'
      self.curLetter.receiver = self.othername
      self.$f7.request.promise.postJSON(url, self.curLetter).then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    showotherlist (username) {
      const self = this
      let url = process.env.API_HOST + 'letter/getOtherLetter.do'
      self.$f7.request.promise.postJSON(url, {'other': username}).then(
        (data) => {
          self.$root.toastbuttom(self, data.message)
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    getNearrBox () {
      const self = this
      if (phonto.myPosition) {
        var array = phonto.myPosition.split(',')
        let url = process.env.API_HOST + 'letter/getOtherLetter.do'
        self.$f7.request.promise.postJSON(url, {'longitude': array[0], 'latitude': array[1]}).then(
          (data) => {
            self.$root.toastbuttom(self, data.message)
          },
          (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
        )
      } else {
        self.$root.toastbuttom(self, '获取位置失败')
      }
    }
  }
}
</script>

<style scoped>

</style>
