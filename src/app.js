import Vue from 'vue'
import Framework7 from 'framework7/framework7.esm.bundle'
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js'
import App from './app.vue'
import myutil from '@/assets/js/util.js'

Framework7.use(Framework7Vue)

// Init Vue App
const myapp = new Vue({
  // Root Element
  el: '#app',
  render: c => c(App),
  methods: myutil,
  data: function () {
    return {
      prefx: '#',
      curSelf: this,
      isForword: true
    }
  }
})
export default myapp
