function myevil (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
function toastbuttom (self, data) {
  if (!self.toastBottom) {
    self.toastBottom = self.$f7.toast.create({
      text: data,
      closeTimeout: 2000
    })
  }
  // Open it
  self.toastBottom.open()
}
function empty (s) {
  return s === undefined || s === null || s.length === 0
}
function dateFormat (thedate, fmt) { // author: meizz
  var o = {
    'M+': thedate.getMonth() + 1, // 月份
    'd+': thedate.getDate(), // 日
    'h+': thedate.getHours(), // 小时
    'm+': thedate.getMinutes(), // 分
    's+': thedate.getSeconds(), // 秒
    'q+': Math.floor((thedate.getMonth() + 3) / 3), // 季度
    'S': thedate.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (thedate.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}
function timeToObjId( time ) {
  var t = new Date(time);
  t = t.getTime()/1000; // 转换成秒数
  return t.toString(16)+'0000000000000000'// 转换成16进制的字符串，再加补齐16个0}
}
function oIdIsEqual(id1,id2) {
  return id1.counter===id2.counter&&id1.timestamp==id2.timestamp&&id1.machineIdentifier===id2.machineIdentifier&&id1.processIdentifier===id2.processIdentifier
}
export default{
  myevil,
  toastbuttom,
  empty,
  dateFormat,
  timeToObjId,
  oIdIsEqual
}

