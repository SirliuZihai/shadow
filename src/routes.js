import Home from './pages/home.vue'
import tabEvents from './pages/homeSub/eventsPage.vue'
import tabCalendar from './pages/homeSub/calendar-page.vue'
import About from './pages/about.vue'
import NotFound from './pages/404.vue'
import LeftPanel from './pages/left-panel.vue'
import LoginScreenPage from './pages/login-screen-page.vue'
import Register from './pages/register.vue'
import InsertPanOrHistory from './pages/insertPanOrHistory.vue'
import userInfo from './pages/userInfo.vue'
import contact from './pages/contacts-list.vue'
import contactState from './pages/contact-state.vue'
import eventDetail from './pages/eventDetail.vue'
import letterBox from './pages/letterBox.vue'
import letter from './pages/letter.vue'
import chat from './pages/chat.vue'
import myLetters from './pages/myLetters.vue'
import bdmap from './components/map.vue'
import calendarPage from './components/calendar-page2.vue'
import Settings from './pages/setting.vue'
import queryEventHis from './pages/homeSub/queryEventHistory.vue'
import test from './components/test.vue'
// import ShowPanOrHistory from './pages/showPanOrHistory.vue'
// Pages
export default [
  // Index page
  {
    path: '/',
    component: Home,
    keepAlive: true,
    tabs: [
      {
        path: '/',
        id: 'tab-event',
        component: tabEvents,
        keepAlive: true
      },
      {
        path: 'tab-calendar/',
        id: 'tab-calendar',
        component: tabCalendar,
        keepAlive: true
      }
    ]
  },

  {
    path: '/queryEventHis/',
    component: queryEventHis
  },
  // About page
  {
    path: '/about/',
    component: About
  },
  // Index page
  {
    path: '/panel-left/',
    component: LeftPanel
  },
  {
    path: '/login-screen-page/',
    component: LoginScreenPage
  },
  {
    path: '/register/',
    component: Register
  },
  {
    path: '/insertPanOrHistory/',
    component: InsertPanOrHistory
  },
  {
    path: '/userInfo/',
    component: userInfo
  },
  {
    path: '/contact/',
    component: contact,
    keepAlive: true
  },
  {
    path: '/contactState/:people',
    component: contactState
  },
  {
    path: '/event-detail/',
    component: eventDetail
  },
  {
    path: '/chat/:eventId/:title',
    component: chat
  },
  {
    path: '/letterBox/',
    component: letterBox,
    keepAlive: true
  },
  {
    path: '/myletters/',
    component: myLetters
  },
  {
    path: '/letter/:option/',
    component: letter
  },
  {
    path: '/explore/',
    component: test
  },
  {
    path: '/bdmap/',
    component: bdmap
  },
  {
    path: '/calendarPage/',
    component: calendarPage
  },
  {
    path: '/setting/',
    component: Settings
  },
  /* {
    path: '/showPanOrHistory/',
    component: ShowPanOrHistory
  }, */
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    component: NotFound
  }
]
