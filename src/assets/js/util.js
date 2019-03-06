import myapp from '@/app'

function evil (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
function toastbuttom (data) {
  const self = myapp.curSelf
  if (!self.toastBottom) {
    self.toastBottom = self.$f7.toast.create({
      text: data,
      closeTimeout: 2000
    })
  }
  // Open it
  self.toastBottom.open()
}

export default{
  evil,
  toastbuttom
}
