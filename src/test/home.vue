<template>
  <f7-page :page-content="false">
    <f7-navbar back-link="Back">
      <f7-nav-title>{{thetitle}}</f7-nav-title>
    </f7-navbar>
    <f7-toolbar tabbar bottom>
    <f7-link tab-link="#tab-event1">消息</f7-link>
    <f7-link tab-link="#tab-calendar2" tab-link-active>日历</f7-link>s
  </f7-toolbar>
    <f7-tabs swipeable>
      <f7-tab id="tab-event1" class="page-content" >
        <test1></test1>
      </f7-tab>
     <f7-tab id="tab-calendar2" class="page-content" tab-active>
       <test2></test2>
     </f7-tab>
    </f7-tabs>
  </f7-page>
</template>
<script>
import test1 from '@/test/test1.vue'
import test2 from '@/test/test2.vue'
export default {
  components: {
    test1, test2
  },
  data: function () {
    return {
      thetitle: '测试主页',
      args: {
        showTab: 'events'
      }
    }
  },
  created () {
    console.log('hometest created')
  },
  destroyed () {
    console.log('hometest destroyed')
  }
}
</script>
