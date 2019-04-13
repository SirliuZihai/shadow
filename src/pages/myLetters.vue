<template>
  <f7-page>
    <f7-navbar title="我的信件" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-myletters" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-list class="searchbar-not-found">
          <f7-list-item title="Nothing found"></f7-list-item>
        </f7-list>
      </f7-nav-right>
      <f7-searchbar class="searchbar-myletters" search-container=".letter-list" @searchbarEnable="lettersShow=false" @searchbarDisable="lettersShow=true"  disableButtonText="取消" placeholder="搜索附近信箱" expandable></f7-searchbar>
    </f7-navbar>
    <f7-list mediaList class="letter-list">
      <f7-list-item v-for="(m,index) in myletters" :key="index" :title="'标题: '+m.title" :subtitle="'正文: '+m.content" @click="select(m,index)">
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import letterBox from '@/pages/letterBox.vue'
export default {
  name: 'myLetters',
  created () {
    const self = this
    self.myletters = JSON.parse(localStorage.getItem('myletters'))
  },
  data: function () {
    return {
      myletters: []
    }
  },
  methods: {
    select (m, index) {
      const self = this
      self.$f7.dialog.confirm('是否投递[主题：' + m.title + ']该信件?', () => {
        letterBox.methods.getCur().sendLetter(m)
        self.$f7router.back()
      }, () => {})
    }
  }
}
</script>

<style scoped>

</style>
