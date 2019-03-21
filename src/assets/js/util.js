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
// eslint-disable-next-line to
function oIdIsEqual (id1, id2) { return id1.counter === id2.counter && id1.timestamp === id2.timestamp && id1.machineIdentifier === id2.machineIdentifier && id1.processIdentifier === id2.processIdentifier }
/**
 * 从数组中删除元素，根据objectId 返回被删除元素
 * */
function delEleFromArray (e, array) {
  for (let i = 0; i < array.length; i++) {
    let e1 = array[i]
    if (e._id === e1._id) {
      array.splice(i, 1)
      return Object.assign({}, e1)
    }
  }
  return null
}

function isHasImg (pathImg) {
  var ImgObj = new Image()
  ImgObj.src = pathImg
  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
    return true
  } else {
    return false
  }
}

export default{
  myevil,
  toastbuttom,
  empty,
  dateFormat,
  delEleFromArray,
  isHasImg
}
