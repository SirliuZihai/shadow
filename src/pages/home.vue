<template>
  <f7-page :page-content="false">
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{thetitle}}</f7-nav-title>
      <f7-nav-right>
        <f7-menu-item icon-f7="add" link dropdown>
          <f7-menu-dropdown right>
            <f7-menu-dropdown-item v-show="false" text="处理样式问题" href="/404/" ></f7-menu-dropdown-item>
            <f7-menu-dropdown-item text="添加事件" href="/insertPanOrHistory/" ></f7-menu-dropdown-item>
            <f7-menu-dropdown-item v-if="args.showTab ==='events'" text="搜索历史事件" href="/queryEventHis/" ></f7-menu-dropdown-item>
          </f7-menu-dropdown>
        </f7-menu-item>
      </f7-nav-right>
    </f7-navbar>
    <f7-toolbar tabbar bottom>
      <f7-link tab-link="#tab-event" tab-link-active @click="args.link = 'event'">消息</f7-link>
      <f7-link tab-link="#tab-calendar" @click="args.link = 'calendar'">日历</f7-link>
    </f7-toolbar>
    <f7-tabs animated>
      <f7-tab id="tab-event" class="page-content" tab-active>
        <tabEvents></tabEvents>
      </f7-tab>
      <f7-tab ref="tabCalendar" id="tab-calendar" class="page-content" >
        <tabCalendar v-if="args.link==='calendar'"></tabCalendar>
    </f7-tab>
    </f7-tabs>
  </f7-page>
</template>
<script>
import tabEvents from '@/pages/homeSub/eventsPage.vue'
import tabCalendar from '@/pages/homeSub/calendar-page.vue'
var homeCur
export default {
  components: {
    tabEvents, tabCalendar
  },
  data: function () {
    return {
      thetitle: '',
      args: {
        showTab: 'events',
        link: 'event'
      }
    }
  },
  created () {
    console.log('home created')
    const self = this
    homeCur = self
    self.changeTitle(localStorage.getItem('alias'))
  },
  destroyed () {
    console.log('home destroyed')
  },
  methods: {
    changeTitle (alia) {
      homeCur.thetitle = (alia === undefined || alia === null || alia === 'undefined') ? localStorage.getItem('username') : localStorage.getItem('username') + '[' + alia + ']'
    },
    getCurHome () {
      return homeCur
    }
  }
}
</script>
