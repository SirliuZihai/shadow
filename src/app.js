import Vue from 'vue'
import Framework7 from 'framework7/framework7.esm.bundle'
import Framework7Vue, {f7Block, f7Button, f7Input, f7Link, f7ListButton, f7ListInput, f7ListItem, f7List,
  f7LoginScreenTitle, f7LoginScreen, f7NavLeft, f7NavRight, f7NavTitle, f7Navbar, f7Page, f7Panel, f7PhotoBrowser, f7Searchbar,
  f7Statusbar, f7Tab, f7Tabs, f7Toggle, f7BlockTitle, f7Row, f7BlockFooter, f7SwipeoutActions, f7Messages, f7MessagesTitle,
  f7Message, f7Messagebar, f7SwipeoutButton, f7Toolbar, f7MenuDropdown, f7MenuDropdownItem } from 'framework7-vue'
import App from './app.vue'
import myutil from '@/assets/js/util.js'
// import Phone from '@/assets/js/phonto.js'
Framework7.use(Framework7Vue)
Vue.component(f7Messages.name, f7Messages)
Vue.component(f7MessagesTitle.name, f7MessagesTitle)
Vue.component(f7Message.name, f7Message)
Vue.component(f7Messagebar.name, f7Messagebar)
Vue.component(f7BlockTitle.name, f7BlockTitle)
Vue.component(f7Block.name, f7Block)
Vue.component(f7Button.name, f7Button)
Vue.component(f7Input.name, f7Input)
Vue.component(f7Link.name, f7Link)
Vue.component(f7ListButton.name, f7ListButton)
Vue.component(f7ListInput.name, f7ListInput)
Vue.component(f7ListItem.name, f7ListItem)
Vue.component(f7List.name, f7List)
Vue.component(f7LoginScreenTitle.name, f7LoginScreenTitle)
Vue.component(f7LoginScreen.name, f7LoginScreen)
Vue.component(f7NavLeft.name, f7NavLeft)
Vue.component(f7NavRight.name, f7NavRight)
Vue.component(f7NavTitle.name, f7NavTitle)
Vue.component(f7Navbar.name, f7Navbar)
Vue.component(f7Page.name, f7Page)
Vue.component(f7Panel.name, f7Panel)
Vue.component(f7PhotoBrowser.name, f7PhotoBrowser)
Vue.component(f7Searchbar.name, f7Searchbar)
Vue.component(f7Statusbar.name, f7Statusbar)
Vue.component(f7Tab.name, f7Tab)
Vue.component(f7Tabs.name, f7Tabs)
Vue.component(f7Toggle.name, f7Toggle)
Vue.component(f7Row.name, f7Row)
Vue.component(f7BlockFooter.name, f7BlockFooter)
Vue.component(f7SwipeoutActions.name, f7SwipeoutActions)
Vue.component(f7SwipeoutButton.name, f7SwipeoutButton)
Vue.component(f7Toolbar.name, f7Toolbar)
Vue.component(f7MenuDropdown.name, f7MenuDropdown)
Vue.component(f7MenuDropdownItem.name, f7MenuDropdownItem)
// Init Vue App
const myapp = new Vue({
  // Root Element
  el: '#app',
  render: c => c(App),
  methods: myutil,
  data: function () {
    return {
      curSelf: this
    }
  }
})
export default myapp
