<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>影子</f7-nav-title>
    </f7-navbar>
    <f7-block>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  created () {
    const self = this
    let uname = localStorage.getItem('username')
    let pword = localStorage.getItem('password')
    if (!(uname != null && pword != null)) { return false }
    var url = process.env.API_HOST + 'shiro/login.do'
    self.$f7.request.promise({
      method: 'POST',
      contentType: 'application/json',
      url: url,
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {username: uname, password: pword}
    }).then(function (data) {
      if (data === 'OK') {
        console.log('auto login enter')
      }
    })
  }
}
</script>
