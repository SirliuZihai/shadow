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
import chat from './pages/chat.vue'
// import ShowPanOrHistory from './pages/showPanOrHistory.vue'
// Pages
export default [
  // Index page
  {
    path: '/',
    component: Home,
    keepAlive: true
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
