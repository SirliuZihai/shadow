/* eslint-disable */
import myapp from '@/app'

document.addEventListener('deviceready', onDeviceReady, false)

// Cordova加载完成会触发
function onDeviceReady () {
  document.addEventListener("backbutton", onBackKeyDown, false);
  setInterval("getPosition()","1000");
}
var myPosition
function getPosition(){
  var options = {
    enableHighAccuracy: true,
    maximumAge: 3600000
  }
  var watchid = navigator.geolocation.getCurrentPosition(
    function(position){
      myPosition = position.coords.longitude+","+position.coords.latitude+","+position.coords.altitude;
    },
    function(error){}, options
  );
}
function onBackKeyDown() {
  if(myapp.$f7.views.main.history.length>0){
    //如果有history则执行返回
    myapp.$f7.views.main.router.back()
  }else{
    //HOME键
    navigator.Backbutton.goHome(function() {
      console.log('go home success');
    }, function() {
      console.log('go home fail');
    });
  }

}
function cordovaDevice() {
  navigator.notification.alert("Cordova version: " + device.cordova + "\n" +
    "Device model: " + device.model + "\n" +
    "Device platform: " + device.platform + "\n" +
    "Device UUID: " + device.uuid + "\n" +
    "Device version: " + device.version);
}
// 获取照片
function getPhoto (calledObj) {
  // quality : 图像的质量，范围是[0,100]
  navigator.camera.getPicture(onPhotoURISuccess,
   null,
    { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY })
}

// 获取照片成功
function onPhotoURISuccess (imageURI) {
  plugins.crop(function success(url) {
    url = url.split('?');
    //缩放裁切后的图片，然后再上传
    window.autobots.imageResize.resize(
      {
        source: url[0],
        quality: 90, // Default 70
        type: 'maxPixelResize' | 'minPixelResize', //Default maxPixelResize
        width: 100,
        height: 100
      },
      function(response) {
        //console.log(response.filePath);
        //console.log(response.width);
        //console.log(response.height);
        upload('file://'+ response.filePath);
      },
      function(error) {
        alert(error);
      }
    );
  }, function fail(err) {
    console.log(err);
  }, imageURI, {quality: 80});
}

// 上传文件
function upload (fileURL) {
  // 上传成功
  var success = function (r) {
    let data = myapp.myevil(r.response)
    myapp.curSelf.changeImgUrl ()
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

export default {
  getPhoto,
  myPosition
}
