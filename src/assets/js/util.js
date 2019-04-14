function myevil (fn) {
  var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
  return new Fn('return ' + fn)()
}
function toastbuttom (self, data) {
  if (self.toastBottom) {
    self.toastBottom.destroy()
  }
  self.toastBottom = self.$f7.toast.create({
    text: data,
    closeTimeout: 2000
  })
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

function deleteTag (self, array, index, text) {
  self.$f7.dialog.confirm('是否删除该' + text, () => {
    array.splice(index, 1)
  }, () => {})
}
function addTag (self, array, text) {
  self.$f7.dialog.prompt('请添加' + text, (data) => {
    try {
      if (data) {
        if (array.indexOf(data) > -1) {
          self.$f7.dialog.alert('已存在')
        } else {
          array.push(data)
        }
      } else {
        self.$f7.dialog.alert('不能为空')
      }
    } catch (e) {
      console.log(e)
    }
  }, null)
}
export default{
  myevil,
  toastbuttom,
  empty,
  dateFormat,
  delEleFromArray,
  isHasImg,
  deleteTag,
  addTag
}
