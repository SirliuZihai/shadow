<template>
  <f7-page>
    <f7-navbar title="联系人" back-link="Back">
      <f7-nav-right>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-contacts_old" icon-ios="f7:search" icon-md="material:search"></f7-link>
        <f7-link class="searchbar-enable" data-searchbar=".searchbar-contacts_new" icon-ios="f7:add" icon-md="material:add"></f7-link>
      </f7-nav-right>
      <f7-searchbar class="searchbar-contacts_old"  @change="localSearch($event.target.value)" @searchbarEnable="contactIsShow=2" @searchbarDisable="contactIsShow=0"  placeholder="查找联系人" disableButtonText="取消" expandable></f7-searchbar>
      <f7-searchbar class="searchbar-contacts_new" @change="searchPeople($event.target.value)" @searchbarEnable="contactIsShow=1" @searchbarDisable="contactIsShow=0"  disableButtonText="取消" placeholder="搜索用户" expandable></f7-searchbar>
    </f7-navbar>
    <f7-list class=".contacts-list2" v-show="contactIsShow===1">
      <f7-list-item v-for="p in people" :key="p.username" :title="p.username+' '+(p.alias === undefined?'':p.alias)">
        <f7-link slot="after" icon-ios="f7:add" icon-md="material:add" @click="addUser(p.username,p.alias)"></f7-link>
      </f7-list-item>
    </f7-list>
    <f7-list contacts-list v-show="contactIsShow===0">
      <f7-list-item v-for="(c,index) in contacts" :key="index" :title="titleFormate(c)" @click="onClicklist(c.people)">
        <img slot="media" :src="changeContactListImgUrl(c.people)" @error="onerror"/>
      </f7-list-item>
    </f7-list>
    <f7-list mediaList class=".contacts-list3" v-show="contactIsShow===2">
      <f7-list-item v-for="(c,index) in searchContacts" :key="index" @click="onClicklist(c.people)">
        <img slot="media" :src="changeContactListImgUrl(c.people)" @error="onerror"/>
        <div v-html="titleFormate2(c,searchword)" slot="title"/>
        <div v-html="subtitleFormate(c,searchword)" slot="subtitle"/>
      </f7-list-item>
    </f7-list>
    <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import defautImg from '@/assets/image/nohead.jpg'
import util from '@/assets/js/util.js'
import insertPlan from '@/pages/insertPanOrHistory.vue'
import eventDetail from '@/pages/eventDetail.vue'
var CurContact
export default {
  created: function () {
    const self = this
    CurContact = self
    let localContacts = localStorage.getItem(self.$root.prefx + 'contacts')
    if (!localContacts) {
      self.getContact()
    } else {
      self.contacts = JSON.parse(localContacts)
    }
  },
  data: function () {
    return {
      contactIsShow: 0,
      contacts: [],
      people: [],
      searchContacts: [],
      searchword: ''
    }
  },
  methods: {
    getCur () {
      return CurContact
    },
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
          localStorage.setItem(self.$root.prefx + 'contacts', JSON.stringify(data2.data))
        } else {
          self.$root.toastbuttom(self, data2.message)
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
          self.$root.toastbuttom(self, data2.message)
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
        data: {'people': inputarg, 'interest': true, 'tag': '', 'remark': alias}
      }).then(function (data) {
        let data2 = self.$root.myevil(data)
        if (data2.success === true) {
          self.getContact()
          self.$root.toastbuttom(self, data2.message)
        } else {
          self.$root.toastbuttom(self, data2.message)
        }
      })
    },
    changeContactListImgUrl (name) {
      let url = process.env.API_HOST + 'image/head/' + name + '.jpg' // + Math.floor((Math.random() * 10000) + 1)
      return url
    },
    onerror (e) {
      e.target.src = defautImg
    },
    titleFormate (c) {
      return c.people + '  [' + (util.empty(c.remark) ? c.people : c.remark) + ']'
    },
    titleFormate2 (c, searchword) {
      const self = this
      let titel = c.people + '  [' + (util.empty(c.remark) ? c.people : c.remark) + ']'
      return self.$root.highlight(titel, searchword)
    },
    subtitleFormate (c, searchword) {
      const self = this
      if (c.tag) {
        return 'tag: ' + self.$root.highlight(c.tag, searchword)
      }
      return ''
    },
    /**
     * 本地查询通讯录，包含tag，username,remark
     * */
    localSearch (searchquery) {
      if (!searchquery) {
        return false
      }
      const self = this
      let contacts = self.contacts // searchContacts
      self.searchContacts.length = 0 // clear
      self.searchword = searchquery
      for (let i = 0; i < contacts.length; i++) {
        let titel = contacts[i].people + '  [' + (util.empty(contacts[i].remark) ? contacts[i].people : contacts[i].remark) + ']'
        if (titel.indexOf(searchquery) > -1) {
          let pushele1 = JSON.parse(JSON.stringify(contacts[i]))
          self.searchContacts.push(pushele1)
          continue
        }
        let indexOfArray = self.getIndexOfArray(searchquery, contacts[i].tags)
        if (indexOfArray > -1) {
          let pushele2 = JSON.parse(JSON.stringify(contacts[i]))
          pushele2.tag = pushele2.tags[indexOfArray]
          self.searchContacts.push(pushele2)
        }
      }
    },
    getIndexOfArray (findStr, myArray) {
      if (typeof myArray === 'object' && myArray.constructor === Array) {
        for (let i = 0; i < myArray.length; i++) {
          if (myArray[i].indexOf(findStr) > -1) {
            return i
          }
        }
      }
      return -1
    },
    /**
     * 用于添加联系人
     * */
    onClicklist (name) {
      const self = this
      let option = self.$f7route.query.option
      if (option) {
        if (option === 'insertEvent') {
          const curPlan = insertPlan.methods.getCur()
          self.$root.addTag(curPlan, curPlan.eventInfo.relationship, name)
          self.$f7router.back()
        }
        if (option === 'eventDetail') {
          const curPlan = eventDetail.methods.getCur()
          self.$root.addTag(curPlan, curPlan.eventInfo.relationship, name)
          self.$f7router.back()
        }
        return false
      }
      self.$f7router.navigate('/contactState/' + name)
    },
    tagFormate (tags) {
      try {
        return tags.toString()
      } catch (e) {
        return ''
      }
    }
  }
}
</script>
<style scoped>
  img{
    width: 3rem;
    height: 3rem;
  }
</style>
