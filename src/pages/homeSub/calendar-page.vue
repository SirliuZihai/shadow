<template>
  <div class="page-content" style="padding: 0px">
    <div id="calendar" style="height: 22rem" class="block block-strong no-padding no-margin no-hairline-top"></div>
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
</template>

<script>
  import eventPage from '@/pages/homeSub/eventsPage.vue'

  var curCalendar
  export default {
    name: 'calendar-page',
    mounted () {
      const self = this
      const app = self.$f7
      self.calendar = app.calendar.create({
        containerEl: '#calendar',
        toolbar: true,
        value: [self.curDay],
        events: self.events,
        on: {
          init (calendar) {
            calendar.$el.addClass('no-safe-area-right')
            self.renderEvents(calendar)
          },
          change (calendar) {
            self.renderEvents(calendar)
            self.curDay = calendar.value[0]
          }
        }
      })
    },
    created () {
      const self = this
      curCalendar = self
      // event初始化
      self.init()
    },
    data: () => {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      return {
        curDay: new Date(year, month, day),
        events: [],
        eventItems: []
      }
    },
    methods: {
      getCur () {
        return curCalendar
      },
      init () {
        const self = this
        let colorMap = ['#e91e63', '#ff9800', '#2196f3', '#4caf50']
        const homeEvents = eventPage.methods.getCur().events
        if (!homeEvents) {
          return false
        }
        self.events = []
        homeEvents.forEach((e) => {
          for (let i = Number(e.starttime); i <= Number(e.endtime); i++) {
            if (!e.type) {
              e.type = 3
            }
            self.events.push({
              _id: e._id,
              date: self.intTodate(i),
              title: e.title,
              color: colorMap[e.type]
            })
          }
        })
        if (self.calendar) {
          self.renderEvents(self.calendar)
        }
      },
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
      /**
       * formate: yyyyMMdd
       * */
      intTodate (s) {
        let str = s.toString()
        return new Date(Number(str.substring(0, 4)), Number(str.substring(4, 6)) - 1, Number(str.substring(6, 8)))
      },
      doClick (ele) {
        let array = eventPage.methods.getCur().events.filter(ev => (
          ev._id === ele._id
        ))
        eventPage.methods.getCur().curEvent = array[0]
        this.$f7router.navigate('/event-detail/')
      }
    }
  }
</script>
