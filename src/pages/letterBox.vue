<template>
  <f7-page>
    <f7-navbar title="信箱" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-otherletters" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-menu-item icon-f7="add" link=true dropdown>
            <f7-menu-dropdown right>
              <f7-menu-dropdown-item v-show="false" text="处理bug" href="/404/" ></f7-menu-dropdown-item>
              <f7-menu-dropdown-item v-show='args.showotherletter' text="投递信件" href="/myletters/" ></f7-menu-dropdown-item>
              <f7-menu-dropdown-item text="添加信件" href="/letter/add/"></f7-menu-dropdown-item>
              <f7-menu-dropdown-item text="将当前位置设置为信箱" link @click="setBoxReplace()"></f7-menu-dropdown-item>
              <f7-menu-dropdown-item text="刷新"  href="#" @click="getNearrBox()" ></f7-menu-dropdown-item>
            </f7-menu-dropdown>
         </f7-menu-item>
      </f7-nav-right>
      <f7-searchbar class="searchbar-otherletters" search-container=".letter-list" @searchbarEnable="lettersShow=false" @searchbarDisable="lettersShow=true"  disableButtonText="取消" placeholder="搜索附近信箱" expandable></f7-searchbar>
    </f7-navbar>
    <f7-toolbar tabbar bottom>
    <!--<f7-link tab-link="#tab-1" >我的信箱</f7-link>-->
      <f7-link tab-link="#tab-2" tab-link-active @click="args.showotherletter = false"><span v-show="!args.showotherletter">附近的信箱.</span><span v-show="args.showotherletter">返回</span></f7-link>
      <f7-link tab-link="#tab-3" >我的信件</f7-link>
    </f7-toolbar>
    <f7-tabs swipeable>
      <f7-tab id="tab-2" class="page-content" tab-active><!--附近的信箱 -->
        <f7-list v-show="!args.showotherletter" class="letter-list" >
          <f7-list-item v-for="(o,index) in otherletterBox" :key="index" :title="o.username + '的信箱'" @click="showotherlist(o.username)">
          </f7-list-item>
        </f7-list>
        <f7-list  mediaList v-show="args.showotherletter" class="letter-list">
          <f7-list-item v-for="(ol,index) in otherletters" :key="index" :title="'标题: '+ol.title" :subtitle="'正文: '+ol.content" @click="showDetal(ol,index)">
          </f7-list-item>
        </f7-list>
      </f7-tab>
      <f7-tab id="tab-3" class="page-content"><!--我的信件 -->
        <f7-list mediaList class="letter-list">
          <f7-list-item v-for="(m,index) in myletters" :key="index" :title="'标题: '+m.title" :subtitle="'正文: '+m.content" @click="showDetalEdit(m,index)">
          </f7-list-item>
        </f7-list>
      </f7-tab>
    </f7-tabs>

    <f7-list class="searchbar-not-found">
      <f7-list-item title="没有更多的消息了"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
var curLetterBox
export default {
  created () {
    const self = this
    curLetterBox = self
    let myletters = JSON.parse(localStorage.getItem('myletters'))
    if (myletters) { self.myletters = myletters }
    self.getNearrBox()
  },
  activated () { // 缓存的组件每次激活触发
    alert(1) // 并没有触发
  },
  deactivated () {
    alert(2)
  },
  data: function () {
    return {
      curLetter: {}, // 当前看的
      othername: '', // 当前查询的,投递的信箱主人
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
    showDetal (l, i) {
      const self = this
      self.curLetter = l
      self.$f7router.navigate('/letter/show/?index=' + i)
    },
    showDetalEdit (e, i) {
      const self = this
      self.curLetter = e
      self.$f7router.navigate('/letter/edit/?index=' + i)
    },
    sendLetter (l) {
      const self = this
      let url = process.env.API_HOST + 'letter/sendLetter.do'
      l.receiver = self.othername
      self.$f7.request.promise.postJSON(url, l).then(
        (data) => {
          if (data.success === true) {
            self.showotherlist(self.othername)
          }
          self.$root.toastbuttom(self, data.message)
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    showotherlist (username) {
      const self = this
      let url = process.env.API_HOST + 'letter/getOtherLetter.do'
      self.othername = username
      self.$f7.request.promise.postJSON(url, {'othername': username}).then(
        (data) => {
          if (data.success === true) {
            self.otherletters = data.data
            self.args.showotherletter = true
          } else {
            self.$root.toastbuttom(self, data.message)
          }
        },
        (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
      )
    },
    setBoxPlace (position) {
      // let myPosition = position.coords.longitude + ',' + position.coords.latitude
      const self = this
      let url = process.env.API_HOST + 'letter/setBoxPlace.do'
      if (position) {
        self.$f7.request.promise.postJSON(url, {'longitude': position.coords.longitude, 'latitude': position.coords.latitude}).then(
          (data) => {
            self.$root.toastbuttom(self, data.message)
          },
          (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
        )
      } else {
        self.$root.toastbuttom(self, '获取位置失败')
      }
    },
    setBoxReplace () {
      const self = this
      navigator.geolocation.getCurrentPosition(
        function (position) {
          self.setBoxPlace(position)
        },
        function (error) { alert(error) }, null
      )
    },
    getNearrBox () {
      const self = this
      navigator.geolocation.getCurrentPosition(
        function (position) {
          if (position) {
            let url = process.env.API_HOST + 'letter/getNearrBox.do'
            self.$f7.request.promise.postJSON(url, {'longitude': position.coords.longitude, 'latitude': position.coords.latitude}).then(
              (data) => {
                if (data.success === true) {
                  self.otherletterBox = data.data
                } else {
                  self.$root.toastbuttom(self, data.message)
                }
              },
              (e) => { self.$root.toastbuttom(self, '通讯异常\n' + e) }
            )
          } else {
            self.$root.toastbuttom(self, '获取位置失败')
          }
        },
        function (error) { self.$root.toastbuttom(self, error) }, null
      )
    }
  }
}
</script>

<style scoped>
  .letter-list{
    margin-top: 0;
  }
</style>
