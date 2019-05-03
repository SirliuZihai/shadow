<template>
  <f7-page :page-content="false" @page:init="onPageInit">
    <f7-navbar back-link="Back" no-shadow>
      <f7-nav-title class="navbar-calendar-title"></f7-nav-title>
    </f7-navbar>
    <div class="page-content">
      <div id="calendar" class="block block-strong no-padding no-margin no-hairline-top"></div>
      <f7-list id="calendar-events" class="no-margin no-hairlines no-safe-area-left">
        <f7-list-item v-for="(item, index) in eventItems" @click="doClick(item)"
          :key="index"
          :title="item.title"
        >
          <div class="event-color" :style="{'background-color': item.color}" slot="root-start"></div>
        </f7-list-item>
        <f7-list-item v-if="eventItems.length === 0">
          <span class="text-color-gray" slot="title">No events for this day</span>
        </f7-list-item>
      </f7-list>
    </div>
  </f7-page>
</template>
<script>
import eventPage from '@/pages/homeSub/eventsPage.vue'
export default {
  created () {
    const self = this
    let colorMap = ['#2196f3', '#e91e63', '#4caf50', '#ff9800']
    // event初始化
    const mainEvents = eventPage.methods.getCur().events
    mainEvents.forEach((e) => {
      for (let i = Number(e.starttime); i <= Number(e.endtime); i++) {
        self.events.push({
          _id: e._id,
          date: self.intTodate(i),
          title: e.title,
          color: e.type.constructor === Number ? colorMap[e.type] : '#4caf50'
        })
      }
    })
  },
  data () {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return {
      today: new Date(year, month, day),
      events: [],
      eventItems: []
    }
  },
  methods: {
    renderEvents (calendar) {
      const self = this
      const currentDate = calendar.value[0]
      const currentEvents = self.events
        .filter(event => (
          event.date.getTime() >= currentDate.getTime() &&
            event.date.getTime() < currentDate.getTime() + 24 * 60 * 60 * 1000
        ))
      const eventItems = []
      if (currentEvents.length) {
        currentEvents.forEach((event) => {
          eventItems.push({
            _id: event._id,
            title: event.title,
            color: event.color
          })
        })
      }
      self.eventItems = eventItems
    },
    onPageInit (e, page) {
      alert()
      const self = this
      const app = self.$f7
      const $ = self.$$
      const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      self.calendar = app.calendar.create({
        containerEl: '#calendar',
        toolbar: true,
        value: [self.today],
        events: self.events,
        on: {
          init (calendar) {
            $('.navbar-calendar-title').text(`${monthNames[calendar.currentMonth]}, ${calendar.currentYear}`)
            app.navbar.size(page.navbarEl)
            calendar.$el.addClass('no-safe-area-right')
            self.renderEvents(calendar)
          },
          monthYearChangeStart (calendar) {
            $('.navbar-calendar-title').text(`${monthNames[calendar.currentMonth]}, ${calendar.currentYear}`)
            app.navbar.size(page.navbarEl)
          },
          change (calendar) {
            self.renderEvents(calendar)
          }
        }
      })
    },
    /**
     * formate: yyyyMMdd
     * */
    intTodate (s) {
      let str = s.toString()
      return new Date(Number(str.substring(0, 4)), Number(str.substring(4, 6)) - 1, Number(str.substring(6, 8)))
    },
    doClick (el) {
      eventPage.methods.getCur().curEvent = el
      this.$f7router.navigate('/event-detail/')
    }
  }
}
</script>
