<template>
  <f7-page>
    <f7-navbar title="信箱" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-letters" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-menu-dropdown icon-f7="add" center>
          <f7-menu-dropdown-item text="添加信件" link="/letter/add/"></f7-menu-dropdown-item>
          <f7-menu-dropdown-item text="查找附件信箱" class="searchbar-enable" data-searchbar=".searchbar-otherletters" ></f7-menu-dropdown-item>
        </f7-menu-dropdown>
      </f7-nav-right>
      <f7-searchbar class="searchbar-otherletters" @change="searchLetters($event.target.value)" @searchbarEnable="lettersShow=false" @searchbarDisable="lettersShow=true"  disableButtonText="取消" placeholder="搜索附近信箱" expandable></f7-searchbar>
    </f7-navbar>
    <f7-toolbar tabbar bottom>
      <f7-link tab-link="#tab-1" tab-link-active>我的信箱</f7-link>
      <f7-link tab-link="#tab-2">附近的信箱</f7-link>
      <f7-link tab-link="#tab-3">我的信件</f7-link>
    </f7-toolbar>
    <f7-tabs swipeable>
      <f7-tab id="tab-1" class="page-content" tab-active>
        <f7-list>
          <f7-list-item v-for="l in letters" :key="l.index" :title="l.username+': '+l.title" @click="showDetal(l)">
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab-2" class="page-content">
        <f7-list v-show="args.showotherletter">
          <f7-list-item v-for="o in otherletterBox" :key="o.index" :title="o.username" @click="showotherlist(o)">
          </f7-list-item>
        </f7-list>
        <f7-list v-show="!args.showotherletter">
          <f7-list-item v-for="ol in otherletters" :key="ol.index" :title="ol.title" @click="showDetal(ol)">
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content">
        <f7-list>
          <f7-list-item v-for="m in myletters" :key="m.index" :title="m.title" :subtitle="m.content" @click="showDetal2(m)">
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
var curLetterBox
export default {
  created () {
    const self = this
    curLetterBox = self
    let myletters = localStorage.getItem('myletters')
    if (myletters) { self.myletters = myletters }

    self.letters = localStorage.getItem('letters')
    let uname = localStorage.getItem('username')
    let url = process.env.API_HOST + 'letter/getLetter.do'
    self.$f7.request.promise.get(url, uname, 'json').then(
      (data) => {
        if (data.success === true) {
          let array = data.data
          if (array.length === 0) { return false }
          for (let i = 0; i < array.length; i++) {
            self.letters.unshift(data.data)
          }
        } else {
          self.$root.toastbuttom(self, data.message)
        }
      },
      (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
    )
  },
  data: function () {
    return {
      letters: [], // 我收的
      curLetter: {}, // 当前看的
      othername: '', // 用于查询的
      otherletters: [], // 别人信箱的信件
      myletters: [], // 我写的
      args: {
        showotherletter: false
      }
    }
  },
  watch: {
    letter: function (val) {
      localStorage.setItem('letters', val)
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
    }
  }
}
</script>

<style scoped>

</style>
