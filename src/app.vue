<template>
  <f7-app :params="f7Params">
    <f7-statusbar></f7-statusbar>
    <f7-panel left reveal>
      <f7-view url="/panel-left/" links-view=".view-main"></f7-view>
    </f7-panel>
    <f7-panel right reveal>
      <f7-view url="/panel-right/"></f7-view>
    </f7-panel>
    <f7-view url="/login-screen-page/" :main="true" class="safe-areas" :master-detail-breakpoint="800"></f7-view>
  </f7-app>
</template>
<script>
import routes from './routes'

export default {
  data () {
    return {
      f7Params: {
        theme: 'ios',
        routes,
        id: 'com.zihai.app',
        name: '影子'
      }
    }
  }
}
</script>
<style>
</style>
