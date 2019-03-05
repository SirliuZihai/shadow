<template>
  <f7-page>
    <f7-navbar title="联系人" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-contacts_old" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-contacts_new" icon-ios="f7:add" icon-md="material:add"></f7-link>
      </f7-nav-right>
      <f7-searchbar class="searchbar-contacts_old" search-container=".contacts-list" placeholder="查找联系人" disableButtonText="取消" expandable></f7-searchbar>
      <f7-searchbar class="searchbar-contacts_new" search-container=".contacts-list2" @change="searchPeople($event.target.value)" @searchbarEnable="contactIsShow=false" @searchbarDisable="contactIsShow=true"  disableButtonText="取消" placeholder="搜索用户" expandable></f7-searchbar>
    </f7-navbar>
    <f7-list class=".contacts-list2" v-show="!contactIsShow">
      <f7-list-item v-for="p in people" :key="p.username" :title="p.username+' '+p.alias">
        <f7-link slot="after" icon-ios="f7:add" icon-md="material:add" @click="addUser(p.username,p.alias)"></f7-link>
      </f7-list-item>
    </f7-list>
    <f7-list contacts-list v-show="contactIsShow">
      <f7-list-item v-for="c in contacts" :key="c.people" :title="c.people" :link="/contactState/+c.people"></f7-list-item>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
export default {
  created: function () {
    this.getContact()
  },
  data: function () {
    return {
      contactIsShow: true,
      contacts: {},
      people: {}
    }
  },
  methods: {
    getContact () {
      const self = this
      var url = process.env.API_HOST + 'user/relationUser.do'
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
          self.contacts = data2.data
          sessionStorage.setItem('contacts', JSON.stringify(data2.data))
        } else {
          self.toastbuttom(data2.message)
        }
      })
    },
    searchPeople (inputarg) {
      if (inputarg.length === 0) { return false }
      const self = this
      var url = process.env.API_HOST + 'user/searchUser.do'
      this.$f7.request.promise({
        method: 'POST',
        contentType: 'application/json',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: {'username': inputarg}
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.people = data2.data
        } else {
          self.toastbuttom(data2.message)
        }
      })
    },
    addUser (inputarg, alias) {
      if (inputarg === undefined || inputarg.length === 0) { return false }
      const self = this
      var url = process.env.API_HOST + 'user/addrelation.do'
      this.$f7.request.promise({
        method: 'POST',
        contentType: 'application/json',
        url: url,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        },
        data: {'people': inputarg, 'interest': false, 'tag': '', 'remark': alias}
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.getContact()
          self.toastbuttom(data2.message)
        } else {
          self.toastbuttom(data2.message)
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
    }
  }
}
</script>
<style scoped>
  .display{
    display:none
  }
</style>
