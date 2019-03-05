/* eslint-disable */
import myapp from '@/app'

var pictureSource
var destinationType
document.addEventListener('deviceready', onDeviceReady, false)

// Cordova加载完成会触发
function onDeviceReady () {
  pictureSource = navigator.camera.PictureSourceType
  destinationType = navigator.camera.DestinationType
}

// 获取照片
function getPhoto () {
  // quality : 图像的质量，范围是[0,100]
  navigator.camera.getPicture(onPhotoURISuccess,
   null,
    { quality: 50, destinationType: destinationType.FILE_URI, sourceType: pictureSource.PHOTOLIBRARY })
}

// 获取照片成功
function onPhotoURISuccess (imageURI) {
  upload(imageURI)
}

// 上传文件
function upload (fileURL) {
  // 上传成功
  var success = function (r) {
    let data = myapp.myevil(r.response)
  }

  // 上传失败
  var fail = function (error) {
    myapp.$f7.dialog.alert("上传失败! ")
  }

  var options = new FileUploadOptions()
  options.fileKey = 'headImageFile'
  options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1)

  var ft = new FileTransfer()
  // 上传地址
  var SERVER = process.env.API_HOST + 'user/uploadHeadImg.do'
  ft.upload(fileURL, encodeURI(SERVER), success, fail, options)
};
//……………………按键………………
document.addEventListener('deviceready', onDeviceReady, false)
function getPosition(){
  var options = {
    enableHighAccuracy: true,
    maximumAge: 3600000
  }
  let pos
  var watchid = navigator.geolocation.getCurrentPosition(
    function(position){
      pos = position.coords.longitude+","+position.coords.latitude+","+position.coords.altitude;
    },
    function(error){}, options
  );
}
export default {
  getPhoto
}
