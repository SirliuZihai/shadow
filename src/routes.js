import Home from './pages/home.vue'
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
import testHome from './test/home.vue'
import resetMail from './components/resetMail.vue'
import resetPassword from './components/resetPassword.vue'
import tips from './pages/tips.vue'
import tipsNotify from './pages/tips_notify.vue'
import comments from './components/comments.vue'
import editNews from './components/editNews.vue'
import notify from './components/notify.vue'
import test2 from './pages_demo/pull-to-refresh.vue'

// import ShowPanOrHistory from './pages/showPanOrHistory.vue'
// Pages
export default [
  // Index page
  {
    path: '/',
    component: Home,
    keepAlive: true
  },
  {
    path: '/testHome/',
    component: testHome
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
    component: contact
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
  {
    path: '/resetMail/',
    component: resetMail
  },
  {
    path: '/resetPassword/',
    component: resetPassword
  },
  {
    path: '/tips/',
    component: tips
  },
  {
    path: '/tipsNotify/',
    component: tipsNotify
  },
  {
    path: '/comments/',
    component: comments
  },
  {
    path: '/editNews/',
    component: editNews
  },
  {
    path: '/notify/',
    component: notify
  },
  {
    path: '/test2/',
    component: test2
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
