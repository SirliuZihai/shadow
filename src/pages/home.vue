<template>
  <f7-page>
    <f7-navbar>
      <f7-nav-left>
        <f7-link icon-if-ios="f7:menu" icon-if-md="material:menu" panel-open="left"></f7-link>
      </f7-nav-left>
      <f7-nav-title>{{thetitle}}</f7-nav-title>
    </f7-navbar>
    <f7-block>
    </f7-block>
  </f7-page>
</template>

<script>
var vmcurSelf
function changeTitle (alia) {
  vmcurSelf.thetitle = (alia === undefined || alia === null) ? '客官，你好' : '您好，' + alia
}
export {
  changeTitle
}
export default {
  data: function () {
    return {
      thetitle: ''
    }
  },
  created () {
    const self = this
    vmcurSelf = self
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
    }).then((data) => {
      let data2 = self.$root.myevil(data)
      if (data2.success === true) {
        console.log(data2.message)
        changeTitle(data2.data.alias)
      }
    })
  }
}
</script>
